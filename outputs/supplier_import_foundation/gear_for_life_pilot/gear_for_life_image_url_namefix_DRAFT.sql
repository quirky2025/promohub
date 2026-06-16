-- Gear For Life: fix 5 malformed image_url values in product_images -- DRAFT, WRITE OPERATION.
-- The actual image files exist on disk under the CORRECT name; only the DB image_url
-- is malformed (trailing '=' or missing '.jpg'). This corrects image_url to match the file.
--
-- SAFETY:
--   * Scoped to supplier = 'Gear For Life'.
--   * Each UPDATE matches one exact bad value -> sets the corrected value.
--   * Idempotent: re-running matches nothing once fixed.
--   * Wrapped in a transaction: review the verify rows, then COMMIT or ROLLBACK.

begin;

update public.product_images
set image_url = 'BFCS-barkers-corporate-fremont-check-shirt-mens-back.jpg'
where supplier = 'Gear For Life'
  and image_url = 'BFCS-barkers-corporate-fremont-check-shirt-mens-back.jpg=';

update public.product_images
set image_url = 'BTGB TRANSPORTER-GARMENT-BAG-BLACK-SUIT-BAG.jpg'
where supplier = 'Gear For Life'
  and image_url = 'BTGB TRANSPORTER-GARMENT-BAG-BLACK-SUIT-BAG';

update public.product_images
set image_url = 'IGSCFAK-swiftcare-first-aid-kit-contents.jpg'
where supplier = 'Gear For Life'
  and image_url = 'IGSCFAK-swiftcare-first-aid-kit-contents';

update public.product_images
set image_url = 'IGWFFJ-workfuel-750ml-food-jar-foldable-spoon.jpg'
where supplier = 'Gear For Life'
  and image_url = 'IGWFFJ-workfuel-750ml-food-jar-foldable-spoon';

update public.product_images
set image_url = 'poatb-artisan-tasting-board-set-acacia-board-and-knife.jpg'
where supplier = 'Gear For Life'
  and image_url = 'poatb-artisan-tasting-board-set-acacia-board-and-knife';

-- VERIFY: the 5 corrected filenames should now be present (expect 5 rows),
-- and none of the old malformed values should remain (expect 0 rows).
select 'corrected_present' as object, count(*)::int as rows
from public.product_images
where supplier = 'Gear For Life'
  and image_url in (
    'BFCS-barkers-corporate-fremont-check-shirt-mens-back.jpg',
    'BTGB TRANSPORTER-GARMENT-BAG-BLACK-SUIT-BAG.jpg',
    'IGSCFAK-swiftcare-first-aid-kit-contents.jpg',
    'IGWFFJ-workfuel-750ml-food-jar-foldable-spoon.jpg',
    'poatb-artisan-tasting-board-set-acacia-board-and-knife.jpg'
  )
union all
select 'old_malformed_remaining', count(*)::int
from public.product_images
where supplier = 'Gear For Life'
  and image_url in (
    'BFCS-barkers-corporate-fremont-check-shirt-mens-back.jpg=',
    'BTGB TRANSPORTER-GARMENT-BAG-BLACK-SUIT-BAG',
    'IGSCFAK-swiftcare-first-aid-kit-contents',
    'IGWFFJ-workfuel-750ml-food-jar-foldable-spoon',
    'poatb-artisan-tasting-board-set-acacia-board-and-knife'
  );

-- If corrected_present = 5 and old_malformed_remaining = 0: COMMIT;
-- Otherwise:                                                ROLLBACK;
commit;
