-- Seed data for SophiTrack: the baby, feed timing and the daily minimums.
-- Safe to run more than once. Run it in the Supabase SQL editor (or through the Supabase MCP).
-- Members are added separately with seed-members.sql, after the two accounts exist.

insert into public.babies (id, name, birth_at, day1_date, tz, birth_weight_g, birth_length_cm, birth_head_cm)
values (
  '4afcd821-32c3-43e0-8361-b50487ee3500',
  'Sophie',
  timestamptz '2026-10-29 22:59:00 America/Chicago',
  date '2026-10-30',
  'America/Chicago',
  2977,   -- 6 lb 9 oz
  48.3,   -- 19 in
  null    -- head circumference: not known yet
)
on conflict (id) do nothing;

insert into public.settings (baby_id, feed_interval_min, feed_window_min)
values ('4afcd821-32c3-43e0-8361-b50487ee3500', 120, 60)
on conflict (baby_id) do nothing;

-- Daily minimums by day of life (spec section 3.1).
-- To change one after a pediatrician visit, edit the row and record the pediatrician as the source.
insert into public.reference_metrics (baby_id, metric, day_from, day_to, min, typical, max, note, source)
select '4afcd821-32c3-43e0-8361-b50487ee3500'::uuid, v.metric, v.day_from, v.day_to, v.min, v.typical, v.max, v.note, v.source
from (
  values
    ('feeds', 1, 1, 8, null::numeric, null::numeric,
      'The hospital sheet shades 4 feeds for Day 1.',
      'Parents'' decision (Tom and Heidi), 11/9/2026'),
    ('feeds', 2, null, 8, null, null,
      'The sheet covers Days 2 to 6; the same minimum is used from Day 6 on until the pediatrician says otherwise.',
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('wets', 1, 1, 1, null, null, null,
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('wets', 2, 2, 2, null, null, null,
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('wets', 3, 3, 3, null, null, null,
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('wets', 4, 4, 4, null, null, null,
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('wets', 5, 5, 5, null, null, 'Pale yellow.',
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('wets', 6, null, 6, null, null, null,
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('dirties', 1, 1, 1, null, null, 'Tarry black or green (meconium).',
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('dirties', 2, 2, 2, null, null, 'Dark green, less sticky.',
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('dirties', 3, 3, 2, null, null, 'Meconium to dark green to green-brown, at least quarter size.',
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('dirties', 4, 4, 2, null, null, 'Greenish yellow to yellowish brown, loose not watery.',
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('dirties', 5, 5, 2, null, 5, 'Yellow, seedy, loose. 2 to 5 is typical.',
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18'),
    ('dirties', 6, null, 2, null, null, 'Yellow, seedy.',
      'Ascension Columbia St. Mary''s Hospital, Breastfeeding and Diaper Record, 03-3210-20 Rev. 7/18')
) as v (metric, day_from, day_to, min, typical, max, note, source)
on conflict (baby_id, metric, day_from) do nothing;
