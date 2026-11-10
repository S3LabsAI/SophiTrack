-- Links the two parent accounts to Sophie. Run once, after Tom has created both accounts
-- by hand in Supabase (Authentication > Users > Add user).
--
-- The repo is public, so the emails are NOT written here and this file stays a template:
-- never replace the placeholders in this file. Paste it into the Supabase SQL editor (or copy
-- it to private/seed-members.sql, which is git-ignored) and replace the two placeholders there
-- with the addresses in private/accounts.md.

insert into public.members (baby_id, user_id, display_name, initial)
select '4afcd821-32c3-43e0-8361-b50487ee3500'::uuid, u.id, v.display_name, v.initial
from (
  values
    ('<TOM_EMAIL>', 'Tom', 'T'),
    ('<HEIDI_EMAIL>', 'Heidi', 'H')
) as v (email, display_name, initial)
join auth.users u on lower(u.email) = lower(v.email)
on conflict (baby_id, user_id) do update
  set display_name = excluded.display_name,
      initial = excluded.initial;

-- Expect two rows.
select display_name, initial from public.members where baby_id = '4afcd821-32c3-43e0-8361-b50487ee3500';
