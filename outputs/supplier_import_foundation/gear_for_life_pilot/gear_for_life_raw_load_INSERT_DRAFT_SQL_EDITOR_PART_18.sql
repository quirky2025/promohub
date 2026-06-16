-- Gear For Life raw load SQL Editor split part 18
-- final row-count and POA/request_quote null-cost validation
-- Run manually in Supabase SQL Editor, in numeric order only.
-- Stop immediately on any error and do not run later parts.

begin;

do $$
declare
  gfl_batch_id uuid;
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1;

  if gfl_batch_id is null then
    raise exception 'Gear For Life batch row was not created.';
  end if;

  if (select count(*) from public.supplier_raw_product_rows where batch_id = gfl_batch_id) <> 472 then
    raise exception 'Gear For Life raw product row count mismatch.';
  end if;

  if (select count(*) from public.supplier_raw_colour_options where batch_id = gfl_batch_id) <> 892 then
    raise exception 'Gear For Life raw colour row count mismatch.';
  end if;

  if (select count(*) from public.supplier_raw_images where batch_id = gfl_batch_id) <> 2416 then
    raise exception 'Gear For Life raw image row count mismatch.';
  end if;

  if (select count(*) from public.supplier_price_rows where batch_id = gfl_batch_id) <> 773 then
    raise exception 'Gear For Life product price row count mismatch.';
  end if;

  if (select count(*) from public.supplier_decoration_options where batch_id = gfl_batch_id) <> 273 then
    raise exception 'Gear For Life decoration option row count mismatch.';
  end if;

  if (select count(*) from public.supplier_decoration_price_rows where batch_id = gfl_batch_id) <> 1069 then
    raise exception 'Gear For Life decoration price row count mismatch.';
  end if;

  if (select count(*) from public.supplier_decoration_rate_cards where batch_id = gfl_batch_id) <> 2 then
    raise exception 'Gear For Life decoration rate card row count mismatch.';
  end if;

  if (select count(*) from public.supplier_decoration_rate_card_rows where batch_id = gfl_batch_id) <> 160 then
    raise exception 'Gear For Life decoration rate card price row count mismatch.';
  end if;

  if exists (
    select 1
    from public.supplier_decoration_price_rows
    where batch_id = gfl_batch_id
      and price_status = 'request_quote'
      and unit_cost is not null
  ) then
    raise exception 'POA/request_quote decoration rows must have unit_cost null.';
  end if;
end $$;

commit;
