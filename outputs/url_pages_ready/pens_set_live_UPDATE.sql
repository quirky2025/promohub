-- Set Pens flat URL pages live
-- Run only after pens_live_preflight_READONLY.sql has acceptable product counts.
-- This updates only Pens url_pages rows with non-zero product counts.
-- custom-markers-australia is intentionally left draft until marker products exist.

begin;

update public.url_pages
set
  status = 'live',
  noindex = false,
  updated_at = now()
where slug in (
  'branded-pens-australia',
  'custom-ballpoint-pens-australia',
  'custom-metal-pens-australia',
  'custom-plastic-pens-australia',
  'custom-stylus-pens-australia',
  'custom-highlighters-australia',
  'eco-pens-australia',
  'custom-pencils-australia'
);

select
  count(*) as live_pens_rows,
  (
    select status
    from public.url_pages
    where slug = 'custom-markers-australia'
  ) as markers_status
from public.url_pages
where status = 'live'
  and slug in (
    'branded-pens-australia',
    'custom-ballpoint-pens-australia',
    'custom-metal-pens-australia',
    'custom-plastic-pens-australia',
    'custom-stylus-pens-australia',
    'custom-highlighters-australia',
    'eco-pens-australia',
    'custom-pencils-australia'
  );

commit;
