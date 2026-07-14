#!/usr/bin/env python3
# TRENDS 58 新品导入生成器 —— 标准阶梯价模型(decoration_model=null)。
# 用法: python3 trends58_build.py sample | full
import csv, sys, re, json

SRC = "/sessions/practical-dazzling-mccarthy/mnt/uploads/Trends Export - AUD - 2026-07-14 10_30_41.csv"

CATMAP = {
 "129577":("Bags","Cooler Bags"),"129578":("Bags","Cooler Bags"),
 "129580":("Pens","Novelty Pens"),
 "129615":("Drinkware","Mugs"),"129665":("Drinkware","Coffee Cups"),"129697":("Drinkware","Mugs"),
 "129621":("Headwear","Beanies"),"129704":("Headwear","Caps"),
 "129689":("Outdoor & Sports","Umbrellas"),"129698":("Outdoor & Sports","Sports Products"),
 "129699":("Barware & Accessories","Stubby Holders"),"129700":("Barware & Accessories","Stubby Holders"),
 "129702":("Giveaways & Event Accessories","Novelty Giveaways"),
 "129721":("Headwear","Bucket Hats"),"129722":("Headwear","Bucket Hats"),
 "129723":("Headwear","Bucket Hats"),"129724":("Headwear","Bucket Hats"),
 "129725":("Headwear","Wide Brim Hats"),
 "129726":("Apparel","Socks"),"129728":("Apparel","Apparel Accessories"),
 "129729":("Apparel","Scarves & Gloves"),"129730":("Apparel","Apparel Accessories"),
 "129734":("Outdoor & Sports","Towels"),"129735":("Outdoor & Sports","Blankets"),
 "133391":("Apparel","Teamwear"),"133392":("Apparel","Teamwear"),"133393":("Apparel","Teamwear"),
 "133394":("Apparel","T-Shirts"),"133395":("Apparel","T-Shirts"),"133396":("Apparel","T-Shirts"),
 "133397":("Apparel","T-Shirts"),"133398":("Apparel","T-Shirts"),
 "133399":("Apparel","Polo Shirts"),"133400":("Apparel","Polo Shirts"),"133401":("Apparel","Polo Shirts"),
 "133402":("Apparel","Pants & Shorts"),"133403":("Apparel","Pants & Shorts"),"133404":("Apparel","Pants & Shorts"),
 "133405":("Apparel","Pants & Shorts"),"133406":("Apparel","Pants & Shorts"),"133407":("Apparel","Pants & Shorts"),
 "133562":("Headwear","Caps"),"133563":("Headwear","Caps"),
 "133655":("Apparel","Hoodies"),"133656":("Apparel","Hoodies"),"133657":("Apparel","Hoodies"),
 "133807":("Bags","Travel & Duffle Bags"),"133808":("Bags","Travel & Duffle Bags"),
 "133809":("Bags","Travel & Duffle Bags"),"133810":("Bags","Travel & Duffle Bags"),
 "133811":("Technology","Earbuds & Headphones"),"133812":("Technology","Tech Accessories"),
 "133813":("Home & Living","Kitchen & Dining"),"133814":("Home & Living","Kitchen & Dining"),
 "133815":("Drinkware","Teaware"),
 "133816":("Drinkware","Glassware"),"133817":("Drinkware","Glassware"),"133818":("Drinkware","Glassware"),
}
SAMPLE = ["129580","129665","133807","133394","133391","129721"]
INDENT_FORCE_AIR = {"133807","133808","133809","133810"}  # 行李箱=工厂直邮

def detect_indent(desc):
    m = re.search(r'production lead time of\s*\d+\s*working days.*?(air freight|sea freight|sea)', desc or "", re.I)
    if not m: return None
    return 'indent_sea' if 'sea' in m.group(1).lower() else 'indent_air'

COLOUR_HEX = {
 "gunmetal":"#2A3439","white":"#FFFFFF","yellow":"#F5D400","orange":"#F26722","red":"#C8102E",
 "forest green":"#1B5E20","light blue":"#7DD3FC","royal blue":"#1D4ED8","navy":"#1B2A4A","black":"#000000",
 "bright green":"#66BB2E","teal":"#008C8C","dark blue":"#12294A","pink":"#E85D9E","dark green":"#14532D",
 "purple":"#6B21A8","ecru":"#D9CBB2","pine green":"#01796F","dark grey":"#4B4B4B","olive":"#6B7233",
 "natural":"#D9CBB2","charcoal":"#36454F","pebble":"#B8AE9C","clear":"#EAF3F7","silver":"#C0C0C0",
 "grey":"#808080","stone":"#B7A99A","sage":"#9CAF88","slate blue":"#5A6E8C","mauve":"#B784A7",
 "peach":"#FFCBA4","burgundy":"#7B1F2B","pale yellow":"#F5EBA0","off white":"#F5F2E9",
}
def hex_for(name): return COLOUR_HEX.get(name.strip().lower().rstrip('.'), "#CCCCCC")
def esc(s): return (s or "").replace("'","''")

def parse_colours(c1):
    c1=(c1 or "").strip()
    if not c1 or "any colour" in c1.lower(): return []
    if ":" in c1: return []
    return [p.strip().rstrip('.') for p in c1.split(",") if p.strip()]

ADDON_KEYS=["gift box","sleeve","belly band","packaging","polybag","personalis","backing card",
            "metallic thread","additional per","additional 5","gift tube","kitting","pouch"]
DROP_KEYS=["shipping and handling","pre-production","sample"]  # 完全不入库
def classify(name):
    n=name.lower()
    if any(k in n for k in DROP_KEYS): return "drop"
    if any(k in n for k in ADDON_KEYS): return "addon"
    return "branding"

# 印刷方式关键词 → 用于把装饰行匹配到对应 PrintType 的印刷位尺寸
METHOD_KW=["screen print","pad print","colourflex","digiflex","faux embroidery","embroidery",
           "laser","sublimation","rotary","direct digital","digital","prism","debossing","foil",
           "moulded","knitted","full colour patch","imitation etch","etch"]
def method_kw(name):
    n=name.lower()
    for kw in METHOD_KW:
        if kw in n: return kw
    return None
def area_for(name, ptmap):
    kw=method_kw(name)
    if not kw: return None
    for pt,pd in ptmap:
        if kw in pt and pd: return pd
    return None

def norm_sizes(sizes):
    return [re.sub(r'^3X$','3XL', re.sub(r'^2X$','2XL', s)) for s in sizes]

CTAS=["Add your logo to","Brand the","Personalise the","Put your logo on"]
def seo_hook(name, desc, methods, moq, i):
    cta=CTAS[i%len(CTAS)]
    first=re.split(r'(?<=[.!?])\s', (desc or "").strip())[0].rstrip('.').strip() if desc else ""
    if first: first=first[0].lower()+first[1:]
    meth=" with "+(" or ".join(m.lower() for m in methods[:2])) if methods else ""
    unit="unit" if str(moq)=="1" else "units"
    tail=f" From {moq} {unit}." if moq else ""
    return (f"{cta} the {name}{meth} — {first or 'ready for your branding'}.{tail}")[:300]

def main():
    mode=sys.argv[1] if len(sys.argv)>1 else "sample"
    rd=csv.reader(open(SRC,encoding='utf-8-sig',errors='replace'))
    hdr=next(rd); I={h:i for i,h in enumerate(hdr)}
    data={r[I['Code']].strip():r for r in rd if len(r)>20}
    codes=SAMPLE if mode=="sample" else list(CATMAP.keys())
    O=[f"-- TRENDS 新品导入 [{mode}] · 标准阶梯价模型(decoration_model=null) · supplier='Trends'"]

    for i,code in enumerate(codes):
        r=data[code]; cat,sub=CATMAP[code]
        name=r[I['Name']].strip(); desc=r[I['Description']].strip()
        moq=r[I['Quantity1']].strip() or "1"
        slug=re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')+f"-{code}"
        ppd=r[I['PrimaryPriceDes']].strip()
        incl=('includ' in ppd.lower() or 'moulded' in ppd.lower())
        indent='indent_air' if code in INDENT_FORCE_AIR else detect_indent(desc)
        # PrintType map
        ptmap=[]
        for k in range(1,9):
            pt=r[I[f'PrintType{k}']].strip().lower(); pd=r[I[f'PrintDescription{k}']].strip()
            if pt: ptmap.append((pt,pd))
        # tiers
        tiers=[]
        for k in range(1,7):
            q=r[I[f'Quantity{k}']].strip(); p=r[I[f'Price{k}']].strip()
            if q and p: tiers.append((int(float(q)),float(p)))
        # decoration
        brand=[]; addon=[]
        for k in range(1,13):
            d=r[I[f'AdditionalCostDesc{k}']].strip()
            if not d: continue
            cl=classify(d)
            if cl=="drop": continue
            c=r[I[f'AdditionalCost{k}']].strip()
            per=float(c) if c and re.match(r'^\d',c) else 0.0
            (brand if cl=="branding" else addon).append((d,per))
        methods=[b[0] for b in brand]
        seo=seo_hook(name,desc,methods,moq,i)
        cols=parse_colours(r[I['Colours']])
        # size_chart
        sz1=r[I['Sizing 1']].strip(); sz2=r[I['Sizing 2']].strip(); sz3=r[I['Sizing 3']].strip()
        size_json="null"
        if sz1.startswith(","):
            sizes=norm_sizes([s for s in sz1.split(",")[1:] if s])
            rows=[{"label":sc.split(",")[0],"values":sc.split(",")[1:]} for sc in (sz2,sz3) if sc and "," in sc]
            size_json=json.dumps({"sizes":sizes,"rows":rows})

        cols_json=json.dumps([{"name":c,"hex":hex_for(c),"image":""} for c in cols]) if cols else "null"
        O.append("")
        O.append(f"-- {code} {name}  ->  {cat} / {sub}  [{'含印刷一口价' if incl else 'Unbranded空白价'}]{'  ✈INDENT' if indent else ''}")
        O.append("insert into products (supplier,supplier_sku,name,slug,category,subcategory,description,"
                 "seo_description,min_qty,is_published,decoration_model,decoration_source,size_chart,colours,indent_type,brand) values")
        colv=f"'{esc(cols_json)}'::jsonb" if cols_json!="null" else "null"
        szv=f"'{esc(size_json)}'::jsonb" if size_json!="null" else "null"
        indv=f"'{indent}'" if indent else "null"
        O.append(f"  ('Trends','{code}','{esc(name)}','{slug}','{cat}','{esc(sub)}','{esc(desc)}',"
                 f"'{esc(seo)}',{moq},true,null,'supplier',{szv},{colv},{indv},null);")
        for si,(q,p) in enumerate(tiers):
            O.append(f"insert into pricing_tiers (product_id,min_qty,base_price,sort_order) "
                     f"select id,{q},{p},{si} from products where supplier_sku='{code}' and supplier ilike 'trends%';")
        di=0
        for (d,per) in brand:
            det=area_for(d,ptmap); detv=f"'{esc(det)}'" if det else "null"
            O.append(f"insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,"
                     f"setup_qty_editable,default_setup_qty,sort_order,type) select id,'{esc(d)}',{detv},{per},"
                     f"{'true' if per>0 else 'false'},null,false,1,{di},'branding' "
                     f"from products where supplier_sku='{code}' and supplier ilike 'trends%';")
            di+=1
        for (d,per) in addon:
            O.append(f"insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,"
                     f"setup_qty_editable,default_setup_qty,sort_order,type) select id,'{esc(d)}',null,{per},"
                     f"false,null,false,1,{di},'addon' "
                     f"from products where supplier_sku='{code}' and supplier ilike 'trends%';")
            di+=1
        if cols:
            for ci,c in enumerate(cols):
                O.append(f"insert into product_colours (product_id,name,hex,images,sort_order) "
                         f"select id,'{esc(c)}','{hex_for(c)}','[]'::jsonb,{ci} "
                         f"from products where supplier_sku='{code}' and supplier ilike 'trends%';")
        else:
            O.append(f"insert into product_colours (product_id,name,hex,images,sort_order) "
                     f"select id,'Custom','#CCCCCC','[]'::jsonb,0 "
                     f"from products where supplier_sku='{code}' and supplier ilike 'trends%';")

    outfile=f"/tmp/trends58_{mode}.sql"
    open(outfile,"w").write("\n".join(O)+"\n")
    print("WROTE",outfile,"| products:",len(codes))

main()
