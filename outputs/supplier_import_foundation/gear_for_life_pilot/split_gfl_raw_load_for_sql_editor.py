from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path


OUT_DIR = Path(__file__).resolve().parent
SOURCE_SQL = OUT_DIR / "gear_for_life_raw_load_INSERT_DRAFT.sql"
PART_PREFIX = "gear_for_life_raw_load_INSERT_DRAFT_SQL_EDITOR_PART_"
SOURCE_HASH = "f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c"
SUPPLIER = "Gear For Life"
MAX_PART_BYTES = 420_000
VALUE_COLUMN_CASTS = {
    "source_row_number": "int",
    "lead_time_min_days": "int",
    "lead_time_max_days": "int",
    "min_qty": "int",
    "max_qty": "int",
    "max_colours": "int",
    "stitch_count_min": "int",
    "stitch_count_max": "int",
    "supplier_formula_base_stitches": "int",
    "supplier_formula_stitch_increment": "int",
    "max_width_mm": "numeric",
    "max_height_mm": "numeric",
    "unit_cost": "numeric",
    "setup_cost": "numeric",
    "repeat_setup_cost": "numeric",
    "run_cost": "numeric",
    "surcharge_cost": "numeric",
    "supplier_formula_increment_unit_cost": "numeric",
    "supplier_decoration_option_id": "uuid",
    "is_default_for_scope": "boolean",
    "raw_json": "jsonb",
}


def clean_old_parts() -> None:
    for path in OUT_DIR.glob(f"{PART_PREFIX}*.sql"):
        path.unlink()


def get_blocks(text: str) -> tuple[str, list[str], str]:
    first_insert_block = re.search(r"(?m)^with gfl_batch as \(", text)
    final_validation = re.search(r"(?m)^do \$\$\ndeclare\n  gfl_batch_id uuid;", text)
    if not first_insert_block or not final_validation:
        raise ValueError("Could not find expected insert blocks or final validation block.")

    start = first_insert_block.start()
    final_start = final_validation.start()
    prefix = text[text.index("do $$") : start].strip()
    middle = text[start:final_start].strip()
    validation = text[final_start : text.rindex("commit;")].strip()

    block_starts = [m.start() for m in re.finditer(r"(?m)^with gfl_batch as \(", middle)]
    blocks: list[str] = []
    for index, block_start in enumerate(block_starts):
        block_end = block_starts[index + 1] if index + 1 < len(block_starts) else len(middle)
        blocks.append(middle[block_start:block_end].strip())
    return prefix, blocks, validation


def table_for_block(block: str) -> str:
    match = re.search(r"insert into public\.(\w+)", block)
    if not match:
        raise ValueError("Could not find target table for insert block.")
    return match.group(1)


def row_count_for_block(block: str) -> int:
    return len(re.findall(r"(?m)^    \(", block))


def value_columns_for_block(block: str) -> list[str]:
    match = re.search(r"\) as v\(([^)]+)\);", block)
    if not match:
        raise ValueError("Could not find VALUES alias columns for insert block.")
    return [column.strip() for column in match.group(1).split(",")]


def casted_value_select(block: str) -> str:
    columns = value_columns_for_block(block)
    expressions = [
        f"v.{column}::{VALUE_COLUMN_CASTS.get(column, 'text')}" for column in columns
    ]
    return re.sub(
        r"(select\n  gfl_batch\.batch_id,\n  ).*?(\nfrom gfl_batch\ncross join \()",
        r"\1" + ", ".join(expressions) + r"\2",
        block,
        count=1,
        flags=re.DOTALL,
    )


def batch_lookup_sql() -> str:
    return f"""select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = '{SUPPLIER}'
    and source_file_hash = '{SOURCE_HASH}'
  order by created_at desc
  limit 1;

  if gfl_batch_id is null then
    raise exception 'Gear For Life batch row was not created. Run part 01 first.';
  end if;"""


def before_guard(table: str, expected_before: int, part_name: str) -> str:
    return f"""do $$
declare
  gfl_batch_id uuid;
begin
  {batch_lookup_sql()}

  if (select count(*) from public.{table} where batch_id = gfl_batch_id) <> {expected_before} then
    raise exception '{part_name} expected {expected_before} existing rows in public.{table}. Stop: run parts in order and do not rerun completed parts.';
  end if;
end $$;"""


def after_guard(table: str, expected_after: int, part_name: str) -> str:
    return f"""do $$
declare
  gfl_batch_id uuid;
begin
  {batch_lookup_sql()}

  if (select count(*) from public.{table} where batch_id = gfl_batch_id) <> {expected_after} then
    raise exception '{part_name} expected {expected_after} rows in public.{table} after insert.';
  end if;
end $$;"""


def write_part(part_number: int, title: str, body: str) -> Path:
    path = OUT_DIR / f"{PART_PREFIX}{part_number:02d}.sql"
    path.write_text(
        "\n".join(
            [
                f"-- Gear For Life raw load SQL Editor split part {part_number:02d}",
                f"-- {title}",
                "-- Run manually in Supabase SQL Editor, in numeric order only.",
                "-- Stop immediately on any error and do not run later parts.",
                "",
                body.strip(),
                "",
            ]
        ),
        encoding="utf-8",
    )
    return path


def main() -> None:
    text = SOURCE_SQL.read_text(encoding="utf-8")
    prefix, blocks, validation = get_blocks(text)
    clean_old_parts()

    paths: list[Path] = []
    part_number = 1
    paths.append(write_part(part_number, "initial duplicate guard, batch row, and GFL commercial defaults", f"begin;\n\n{prefix}\n\ncommit;"))
    part_number += 1

    cumulative_counts: dict[str, int] = defaultdict(int)
    index = 0
    while index < len(blocks):
        table = table_for_block(blocks[index])
        selected: list[str] = []
        selected_rows = 0
        selected_bytes = 0
        while index < len(blocks):
            next_block = blocks[index]
            next_table = table_for_block(next_block)
            next_size = len(next_block.encode("utf-8"))
            if next_table != table:
                break
            if selected and selected_bytes + next_size > MAX_PART_BYTES:
                break
            selected.append(next_block)
            selected_rows += row_count_for_block(next_block)
            selected_bytes += next_size
            index += 1

        before = cumulative_counts[table]
        after = before + selected_rows
        part_name = f"part {part_number:02d}"
        title = f"insert {selected_rows} rows into public.{table}; expected count {before} -> {after}"
        body = "\n\n".join(
            [
                "begin;",
                before_guard(table, before, part_name),
                *(casted_value_select(block) for block in selected),
                after_guard(table, after, part_name),
                "commit;",
            ]
        )
        paths.append(write_part(part_number, title, body))
        cumulative_counts[table] = after
        part_number += 1

    paths.append(write_part(part_number, "final row-count and POA/request_quote null-cost validation", f"begin;\n\n{validation}\n\ncommit;"))

    manifest = OUT_DIR / f"{PART_PREFIX}RUN_ORDER.md"
    manifest.write_text(
        "# Gear For Life Raw Load SQL Editor Run Order\n\n"
        "Run these files manually in Supabase SQL Editor, in numeric order only. "
        "Stop immediately on any error and send the error back for review.\n\n"
        + "\n".join(f"{i + 1}. `{path.name}`" for i, path in enumerate(paths))
        + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {len(paths)} SQL parts")
    for path in paths:
        print(path.name, path.stat().st_size)
    print(manifest.name)


if __name__ == "__main__":
    main()
