#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gildan Brands 导入 SQL 生成器(自带 PDF 价格提取)
------------------------------------------------------------------
运行前:  pip install pdfplumber      (只需一次)
运行:    python gildan_build_import.py
输出:    gildan_import.sql(同目录),约 68 款,暂存 is_published=false

需要把这几个文件放同一个文件夹(和本脚本一起):
  1. 价目表 PDF        —— 文件名含 "Price List"(如 2025 Wholesale Price List ....pdf)
  2. gildan_r2_mapping.json
  3. gildan_galleries.csv
  4. gildan_specs_all.json
  5. gildan_specs_batch6.json

决策(已定):supplier='Gildan Brands';brand 分三家;Classic 档 Colour 价;
统一 Colour 价;大码加价 size_pricing;calculator 印刷;跳过 3000/1545;min_qty=20;margin=1.4。
"""
import json, csv, re, uuid, os, glob

SRC = os.path.dirname(os.path.abspath(__file__))
def P(name): return os.path.join(SRC, name)

SKIP = {"3000", "1545"}
MARGIN = 1.4; MIN_QTY = 20; SHIPPING = 30
SIZE_ORDER = ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","2T","3T","4T","5T","6T",
              "YXS","YS","YM","YL","YXL","Y2XL","LS","L2XL","L3XL","OS"]

# ---------- 1) 从 PDF 提取价格 ----------
def find_pdf():
    cands = glob.glob(P("*.pdf"))
    for c in cands:
        if "price" in os.path.basename(c).lower(): return c
    if cands: return cands[0]
    raise FileNotFoundError("没找到价目表 PDF,请把它放到脚本同目录")

def extract_prices():
    import pdfplumber
    pdf_path = find_pdf()
    row_re = re.compile(r'^(\S+?)(?:\s+NEW)?\s+(.+?)\s+((?:[\d.]+|-)(?:\s+(?:[\d.]+|-)){8})$')
    def pick(w,b,c):
        for v in (c,b,w):
            if v and v != '-':
                try: return round(float(v),2)
                except: pass
        return None
    prices = {}
    with pdfplumber.open(pdf_path) as pdf:
        for pg in pdf.pages:
            for ln in (pg.extract_text() or "").split("\n"):
                ln = ln.strip()
                m = row_re.match(ln)
                if not m: continue
                style = m.group(1); desc = m.group(2); nums = m.group(3).split()
                sz = re.search(r"\(([^)]*)\)\s*$", desc)
                size_range = sz.group(1) if sz else ""
                cost = pick(nums[0], nums[1], nums[2])   # Classic 档 White/Black/Colour → 取 Colour
                if cost is None: continue
                prices.setdefault(style, []).append(
                    {"size_range": size_range, "cost": cost, "sell": round(cost*MARGIN,2)})
    return prices

# ---------- 2) 载入其它源 ----------
mapping = json.load(open(P("gildan_r2_mapping.json"), encoding="utf-8"))
specs = json.load(open(P("gildan_specs_all.json"), encoding="utf-8"))
try:
    specs.update(json.load(open(P("gildan_specs_batch6.json"), encoding="utf-8")))
except FileNotFoundError:
    print("! 未找到 gildan_specs_batch6.json")

galleries = {}
try:
    with open(P("gildan_galleries.csv"), encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            urls = [u for u in (r.get("gallery_urls") or "").split(";") if u.strip()]
            galleries[r["style"]] = {"main": r.get("main") or "", "gallery": urls}
except FileNotFoundError:
    print("! 未找到 gildan_galleries.csv,画廊将只用颜色首图")

prices = extract_prices()
print("PDF 提到价的款:", len(prices))

# ---------- 工具 ----------
def esc(s): return str(s).replace("'","''") if s is not None else ""
def slugify(s): return re.sub(r"^-+|-+$","",re.sub(r"[^a-z0-9]+","-",str(s).lower()))
def jstr(o): return "'" + json.dumps(o, ensure_ascii=False).replace("'","''") + "'::jsonb"
def pgarr(items):
    if not items: return "null"
    return "'{" + ",".join('"'+str(i).replace('"','\\"')+'"' for i in items) + "}'"
def clean(v):
    try: return round(float(v),2)
    except: return None
def category_of(name):
    s=(name or "").lower()
    if re.search(r"\b(hood|hoodie)\b",s): return "Hoodies"
    if re.search(r"\bpolo\b",s): return "Polos"
    if re.search(r"\btank\b|muscle",s): return "Tanks"
    if re.search(r"\b(crewneck|sweatshirt)\b",s): return "Sweatshirts"
    if re.search(r"sweatpant|\bpants?\b",s): return "Pants"
    if re.search(r"\bshorts?\b",s): return "Shorts"
    if re.search(r"blanket",s): return "Accessories"
    if re.search(r"\b(cap|hat|beanie)\b",s): return "Headwear"
    return "T-Shirts"
def gender_of(name):
    s=(name or "").lower()
    if re.search(r"women|ladies|wo's|womens",s): return "Women"
    if re.search(r"youth|kids|toddler|infant|boys|girls",s): return "Kids"
    return "Unisex"
def deco_type(cat):
    c=(cat or "").lower()
    if re.search(r"head|cap|hat|beanie",c): return "hats"
    if re.search(r"bag|tote",c): return "bags"
    return "apparel"
METHODS={"apparel":["Screen Print","DTG","DTF","Embroidery"],
         "hats":["DTF","Embroidery"],"bags":["Screen Print","DTF","Embroidery"]}
def mat_tags(c):
    c=(c or "").lower(); t=[]
    for k,v in [("cotton","Cotton"),("polyester","Polyester"),("recycled","Recycled"),
                ("rayon","Rayon"),("viscose","Viscose")]:
        if k in c: t.append(v)
    return t
def eco(c,f): return bool(re.search(r"recycled|organic",(c or "")+" "+" ".join(f or []),re.I))
def expand(rng):
    rng=rng.strip()
    if "-" not in rng: return [rng]
    a,b=[x.strip() for x in rng.split("-",1)]
    if a in SIZE_ORDER and b in SIZE_ORDER:
        i,j=SIZE_ORDER.index(a),SIZE_ORDER.index(b)
        if i<=j: return SIZE_ORDER[i:j+1]
    return [a,b]

# ---------- 3) 生成 SQL ----------
out=["-- Gildan Brands 导入(暂存 is_published=false)",
     "-- supplier='Gildan Brands';brand 分三家;calculator 印刷;Classic·Colour 价;大码 size_pricing",
     "begin;",
     "-- 若下列列不存在,先手动 ALTER(和 AS 导入相同,已建过可忽略):",
     "-- gender / decoration_required / decoration_model / size_pricing / print_methods / meta_title",
     "delete from public.products where supplier='Gildan Brands';"]
built=0; no_data=[]
for style,mrec in mapping.items():
    if style in SKIP or style not in prices: continue
    sp=specs.get(style,{})
    name=sp.get("name") or ""
    if not name.strip() or not sp.get("sizes"): no_data.append(style); continue
    brand=mrec.get("brand",""); pid=str(uuid.uuid4())
    cat=category_of(name); gender=gender_of(name); dtype=deco_type(cat)
    gsm=sp.get("weight_gsm") or ""; comp=sp.get("composition") or ""; feats=sp.get("features") or []
    labels=METHODS[dtype]
    colours=[{"name":c.get("colour",""),"hex":c.get("hex","") or "","image":c.get("front","")}
             for c in mrec.get("colours",[])]
    rows=prices[style]
    base=min(rows,key=lambda r:(clean(r["cost"]) or 9e9)); base_cost=clean(base["cost"]) or 0
    psize=set(sp.get("sizes") or []); size_pricing={}
    for r in rows:
        if r is base: continue
        for sz in expand(r["size_range"]):
            if sz in psize and r.get("sell") is not None: size_pricing[sz]=r["sell"]
    sc=sp.get("size_chart")
    if sc and sp.get("sizes"):
        sc=dict(sc); sc["sizes"]=sp["sizes"]   # 关键:把尺码数组塞进 size_chart(前端列头+数量网格都读它)
    if style=="H000" and sc:
        for me in sc.get("measurements",[]):
            if "Length" in me.get("name","") and len(me.get("values",[]))>=6: me["values"][5]=None
    mt=f"Custom Printed {name} | {brand}"
    mw="/".join(labels)
    seo=f"Print your logo on the {name}"+(f" — {gsm} GSM" if gsm else "")+f". {mw} from {MIN_QTY}."
    md=f"Custom printed {name} by {brand}. "+(f"{comp}. " if comp else "")+f"{mw}, min {MIN_QTY}. Fast Australia-wide."
    desc=sp.get("description") or ""; short=desc[:150]
    # 图顺序:模特图(gallery -01/-02)在前 → 主图=模特图;白底正面图放最后
    g=galleries.get(style,{}); imgs=[x for x in (g.get("gallery",[])+[g.get("main")]) if x]
    if not imgs and colours: imgs=[colours[0]["image"]]
    cols=("id,supplier,supplier_name,supplier_sku,supplier_code,name,slug,category,gender,brand,"
          "description,short_desc,seo_description,meta_description,meta_title,min_qty,setup_fee,shipping,"
          "margin,status,is_published,decoration_required,decoration_model,colours,specs,features,"
          "size_chart,size_pricing,material_tags,print_methods,is_eco,fulfillment")
    slug=slugify(name)+"-"+style.lower()
    vals=[f"'{pid}'","'Gildan Brands'",f"'{esc(brand)}'",f"'{esc(style)}'",f"'{esc(style)}'",
          f"'{esc(name)}'",f"'{esc(slug)}'",f"'{esc(cat)}'",f"'{esc(gender)}'",f"'{esc(brand)}'",
          f"'{esc(desc)}'",f"'{esc(short)}'",f"'{esc(seo)}'",f"'{esc(md)}'",f"'{esc(mt)}'",
          str(MIN_QTY),"0",str(SHIPPING),str(MARGIN),"'active'","false","true","'calculator'",
          jstr(colours),jstr({"composition":comp,"weight_gsm":gsm,"fit":sp.get("fit","")}),jstr(feats),
          (jstr(sc) if sc else "null"),(jstr(size_pricing) if size_pricing else "null"),
          pgarr(mat_tags(comp)),pgarr(labels),("true" if eco(comp,feats) else "false"),"'local_stock'"]
    out.append(f"insert into public.products ({cols}) values ({','.join(vals)});")
    out.append(f"insert into public.pricing_tiers (product_id,min_qty,base_price,sort_order) values ('{pid}',{MIN_QTY},{base_cost},1);")
    out.append(f"insert into public.product_colours (product_id,name,hex,images,sort_order) values ('{pid}','Gallery',null,{jstr(imgs)},0);")
    built+=1
out.append("commit;")
open(P("gildan_import.sql"),"w",encoding="utf-8").write("\n".join(out))
print(f"✅ 生成 gildan_import.sql,建了 {built} 款")
if no_data: print("跳过(无规格/尺码):",no_data)
print("跳过(指定):",sorted(SKIP))
