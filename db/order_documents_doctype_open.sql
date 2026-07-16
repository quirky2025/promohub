-- The app validates doc_type in code (route TYPES list). An older CHECK
-- constraint on order_documents.doc_type only allowed the original types and
-- rejects newer ones like 'approved_artwork', which made uploads fail.
-- Drop any CHECK constraint on this table so app-validated types are accepted.
-- Safe / idempotent.
do $$
declare c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'order_documents'
      and con.contype = 'c'
  loop
    execute format('alter table public.order_documents drop constraint %I', c.conname);
  end loop;
end $$;
