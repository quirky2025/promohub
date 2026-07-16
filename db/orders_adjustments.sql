-- Credit note / balance adjustments recorded against an order when the final
-- produced spec differs from what was quoted+paid. Each line: { desc, amount }
-- where amount is EX-GST and SIGNED (− = credit to customer, + = they owe more).
-- The original paid order is left untouched; the net becomes a Credit Note
-- (net < 0) or a Balance-due note (net > 0).
alter table public.orders
  add column if not exists adjustments jsonb default '[]'::jsonb;
