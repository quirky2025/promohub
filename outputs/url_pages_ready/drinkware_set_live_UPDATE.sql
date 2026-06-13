-- Set Drinkware flat URL pages live
-- Run only after drinkware_live_preflight_READONLY.sql has acceptable product counts.
-- This updates only 9 Drinkware url_pages rows.

begin;

update public.url_pages
set
  status = 'live',
  noindex = false,
  updated_at = now()
where slug in (
  'custom-drinkware-australia',
  'custom-drink-bottles-australia',
  'custom-coffee-cups-australia',
  'custom-travel-mugs-australia',
  'custom-tumblers-australia',
  'custom-mugs-australia',
  'branded-glassware-australia',
  'custom-flasks-australia',
  'custom-teaware-australia'
);

select
  count(*) as live_drinkware_rows
from public.url_pages
where status = 'live'
  and slug in (
    'custom-drinkware-australia',
    'custom-drink-bottles-australia',
    'custom-coffee-cups-australia',
    'custom-travel-mugs-australia',
    'custom-tumblers-australia',
    'custom-mugs-australia',
    'branded-glassware-australia',
    'custom-flasks-australia',
    'custom-teaware-australia'
  );

commit;

