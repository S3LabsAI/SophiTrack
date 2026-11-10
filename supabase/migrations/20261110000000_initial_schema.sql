-- SophiTrack MVP schema (build plan section 3).
--
-- Access model: a signed-in user can read a baby's rows only if they are in `members`
-- for that baby. The app can insert and edit entries; everything else is read-only from
-- the app and is changed by Tom in the Supabase dashboard. Nobody signed out can do anything.

-- ---------------------------------------------------------------------------
-- Private schema: helper functions that are not reachable through the Data API.
-- ---------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create type public.entry_kind as enum ('feed', 'diaper', 'sleep', 'care', 'note', 'measurement');

create table public.babies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  birth_at timestamptz not null,
  -- The Central calendar date that counts as Day 1.
  day1_date date not null,
  tz text not null default 'America/Chicago',
  birth_weight_g integer check (birth_weight_g > 0),
  birth_length_cm numeric(4, 1) check (birth_length_cm > 0),
  birth_head_cm numeric(4, 1) check (birth_head_cm > 0),
  created_at timestamptz not null default now()
);

-- Who may see a baby's data. Row-level security on every table checks this table.
create table public.members (
  baby_id uuid not null references public.babies (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name text not null,
  initial text not null check (char_length(initial) = 1),
  created_at timestamptz not null default now(),
  primary key (baby_id, user_id)
);
create index members_user_id_idx on public.members (user_id);

-- One row per logged event. `data` holds the fields for its kind (validated by zod in the app).
create table public.entries (
  -- Made on the phone, so an entry can be created with no signal and a retried upload never duplicates.
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references public.babies (id) on delete cascade,
  kind public.entry_kind not null,
  occurred_at timestamptz not null,
  -- Minutes Central time was ahead of UTC at that moment (-300 CDT, -360 CST). Never assumed.
  utc_offset_min smallint not null check (utc_offset_min between -840 and 840),
  ended_at timestamptz check (ended_at is null or ended_at >= occurred_at),
  logged_by uuid references auth.users (id) on delete set null,
  -- 'paper' rows were copied from the hospital sheets.
  source text not null default 'app' check (source in ('app', 'paper')),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Soft delete, so a delete syncs like any edit and Undo just clears this.
  deleted_at timestamptz,
  -- A feed logged in the app always has an amount; only a paper feed may have none.
  -- A missing key makes jsonb_typeof null, and a check passes on null, so coalesce forces it to false.
  constraint entries_feed_amount check (
    kind <> 'feed'
    or (source = 'paper' and not (data ? 'amount_ml'))
    or coalesce(
      jsonb_typeof(data -> 'amount_ml') = 'number' and (data ->> 'amount_ml')::numeric >= 0,
      false
    )
  ),
  -- A diaper is wet, dirty or both. Both keys must be present.
  constraint entries_diaper_type check (
    kind <> 'diaper'
    or coalesce(
      jsonb_typeof(data -> 'wet') = 'boolean'
      and jsonb_typeof(data -> 'dirty') = 'boolean'
      and (data -> 'wet' = 'true'::jsonb or data -> 'dirty' = 'true'::jsonb),
      false
    )
  )
);
create index entries_baby_occurred_idx on public.entries (baby_id, occurred_at desc);

create table public.settings (
  baby_id uuid primary key references public.babies (id) on delete cascade,
  -- Minutes from a feed to the start of the "Next feed about ..." range.
  feed_interval_min integer not null default 120 check (feed_interval_min > 0),
  -- Length of that range in minutes.
  feed_window_min integer not null default 60 check (feed_window_min >= 0),
  updated_at timestamptz not null default now()
);

-- Daily minimums and other reference numbers, stored as data with a source.
-- The app reads metric = 'feeds', 'wets' and 'dirties'. day_to null means "this day onward".
create table public.reference_metrics (
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references public.babies (id) on delete cascade,
  metric text not null,
  day_from integer not null check (day_from >= 1),
  day_to integer check (day_to is null or day_to >= day_from),
  min numeric,
  typical numeric,
  max numeric,
  note text,
  source text not null,
  source_url text,
  created_at timestamptz not null default now(),
  unique (baby_id, metric, day_from)
);

-- ---------------------------------------------------------------------------
-- updated_at is always set by the server, so "last write wins" uses one clock.
-- ---------------------------------------------------------------------------
create function private.set_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger entries_set_updated_at
  before insert or update on public.entries
  for each row execute function private.set_updated_at();

create trigger settings_set_updated_at
  before insert or update on public.settings
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
-- Runs as its owner so the policy on `members` can ask "is this user a member?"
-- without reading `members` through its own policy.
create function private.is_member(target_baby uuid) returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.members m
    where m.baby_id = target_baby
      and m.user_id = (select auth.uid())
  );
$$;
revoke all on function private.is_member(uuid) from public;
grant execute on function private.is_member(uuid) to authenticated;
revoke all on function private.set_updated_at() from public;

alter table public.babies enable row level security;
alter table public.members enable row level security;
alter table public.entries enable row level security;
alter table public.settings enable row level security;
alter table public.reference_metrics enable row level security;

create policy "Members can read their baby" on public.babies
  for select to authenticated
  using (private.is_member(id));

create policy "Members can read the member list" on public.members
  for select to authenticated
  using (private.is_member(baby_id));

create policy "Members can read entries" on public.entries
  for select to authenticated
  using (private.is_member(baby_id));

-- New entries from the app are always the signed-in parent's own, and never 'paper'.
-- Paper rows are loaded by Tom's import script, which does not go through these policies.
create policy "Members can add their own entries" on public.entries
  for insert to authenticated
  with check (
    private.is_member(baby_id)
    and logged_by = (select auth.uid())
    and source = 'app'
  );

-- Either parent can edit or delete (soft delete) any entry for their baby.
create policy "Members can edit entries" on public.entries
  for update to authenticated
  using (private.is_member(baby_id))
  with check (private.is_member(baby_id));

create policy "Members can read settings" on public.settings
  for select to authenticated
  using (private.is_member(baby_id));

create policy "Members can read reference metrics" on public.reference_metrics
  for select to authenticated
  using (private.is_member(baby_id));

-- ---------------------------------------------------------------------------
-- Privileges: start from nothing, then grant exactly what the app uses.
-- ---------------------------------------------------------------------------
revoke all on public.babies, public.members, public.entries, public.settings, public.reference_metrics
  from anon, authenticated;

grant select on public.babies, public.members, public.entries, public.settings, public.reference_metrics
  to authenticated;

-- Insert: every column except the two server-set timestamps.
grant insert (id, baby_id, kind, occurred_at, utc_offset_min, ended_at, logged_by, source, data, notes, deleted_at)
  on public.entries to authenticated;

-- Update: only what an edit, a delete or an Undo changes. An entry's id, baby, kind,
-- who logged it and where it came from cannot be changed from the app.
grant update (occurred_at, utc_offset_min, ended_at, data, notes, deleted_at)
  on public.entries to authenticated;

-- Tom's import script (and any later server-side function) uses the secret key, which runs as
-- service_role. It skips row-level security but still needs table privileges, and new
-- Supabase projects no longer grant them automatically.
grant select, insert, update, delete
  on public.babies, public.members, public.entries, public.settings, public.reference_metrics
  to service_role;

-- ---------------------------------------------------------------------------
-- Realtime: the other parent's phone hears about every change to entries.
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.entries;
  end if;
end;
$$;
