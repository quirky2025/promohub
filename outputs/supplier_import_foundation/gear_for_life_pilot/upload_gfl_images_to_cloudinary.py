#!/usr/bin/env python3
"""
Upload Gear For Life product images to Cloudinary using the project's UNSIGNED
upload preset (no API key/secret needed), and write a manifest mapping each
original filename -> the REAL secure_url returned by Cloudinary.

Why a manifest: Cloudinary may rewrite the public_id (spaces, '&', case, etc.),
so we never hand-build URLs. The manifest is the single source of truth for the
later DB step (product_colours.images / product_images URL backfill).

USAGE (Windows cmd)
-------------------
1. pip install cloudinary          (already done)
2. cd to this folder
3. Test, list only (no upload):    python upload_gfl_images_to_cloudinary.py --dry-run
4. Upload just 3 as a real test:   python upload_gfl_images_to_cloudinary.py --limit 3
   -> open gfl_cloudinary_manifest.csv, check the secure_url works in a browser.
5. Full upload:                    python upload_gfl_images_to_cloudinary.py

No credentials to set: cloud_name + unsigned upload_preset are filled in below
(they are public values, already used by the website front-end).

Resumable: filenames already 'ok' in the manifest are skipped, so a re-run
continues where it stopped.
"""
import csv, os, sys, re

# ---- config (public, non-secret) ----
CLOUD_NAME    = "dyz9r0fm7"
UPLOAD_PRESET = "quirkypromo_artwork"   # unsigned preset
FOLDER        = "promohub/products/gear-for-life"   # kept separate from Trends
IMAGE_DIR     = r"C:\Users\jilin\Desktop\supplier\gearforlife\GFL images"
MANIFEST      = os.path.join(os.path.dirname(os.path.abspath(__file__)), "gfl_cloudinary_manifest.csv")
EXTS          = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

DRY_RUN = "--dry-run" in sys.argv
LIMIT = None
if "--limit" in sys.argv:
    LIMIT = int(sys.argv[sys.argv.index("--limit") + 1])

def load_done():
    done = {}
    if os.path.exists(MANIFEST):
        with open(MANIFEST, newline="", encoding="utf-8") as fh:
            for r in csv.DictReader(fh):
                if r.get("status") == "ok" and r.get("secure_url"):
                    done[r["original_filename"]] = r
    return done

def write(rows):
    cols = ["original_filename","public_id","secure_url","version","bytes","format","status"]
    with open(MANIFEST, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols); w.writeheader(); w.writerows(rows)

def main():
    files = sorted(f for f in os.listdir(IMAGE_DIR)
                   if os.path.splitext(f)[1].lower() in EXTS
                   and os.path.isfile(os.path.join(IMAGE_DIR, f)))
    print(f"images found: {len(files)} | dir: {IMAGE_DIR}")
    print(f"cloud: {CLOUD_NAME} | preset: {UPLOAD_PRESET} | folder: {FOLDER}")
    print(f"dry_run: {DRY_RUN} | limit: {LIMIT}")

    if DRY_RUN:
        for f in files[:10]:
            print("  would upload:", f)
        print(f"  ... ({len(files)} total)")
        return

    import cloudinary, cloudinary.uploader
    cloudinary.config(cloud_name=CLOUD_NAME, secure=True)

    done = load_done()
    print(f"already uploaded (resume): {len(done)}")

    rows = list(done.values())
    new_ok = fail = 0
    todo = [f for f in files if f not in done]
    if LIMIT is not None:
        todo = todo[:LIMIT]
    print(f"to upload this run: {len(todo)}")

    for i, f in enumerate(todo, 1):
        path = os.path.join(IMAGE_DIR, f)
        # Cloudinary public_id cannot contain & ? # % < > + \ and cannot end in whitespace.
        # original_filename in the manifest stays the REAL file name, so the later DB
        # match (manifest.original_filename -> DB image_url) is unaffected.
        stem = os.path.splitext(f)[0]
        public_id = re.sub(r'[?&#%<>+\\]+', ' ', stem)
        public_id = re.sub(r'\s+', ' ', public_id).strip()
        try:
            res = cloudinary.uploader.unsigned_upload(
                path,
                UPLOAD_PRESET,
                folder=FOLDER,
                public_id=public_id,
                resource_type="image",
            )
            rows.append({
                "original_filename": f,
                "public_id": res.get("public_id", ""),
                "secure_url": res.get("secure_url", ""),
                "version": res.get("version", ""),
                "bytes": res.get("bytes", ""),
                "format": res.get("format", ""),
                "status": "ok",
            })
            new_ok += 1
        except Exception as e:
            rows.append({
                "original_filename": f, "public_id": "", "secure_url": "",
                "version": "", "bytes": "", "format": "", "status": f"ERROR: {e}",
            })
            fail += 1
            print("  ERROR on", f, "->", e)
        if i % 50 == 0:
            print(f"  {i}/{len(todo)} (ok+{new_ok}, fail {fail})"); write(rows)
    write(rows)
    print(f"DONE. new uploaded: {new_ok} | failed: {fail} | manifest: {MANIFEST}")

if __name__ == "__main__":
    main()
