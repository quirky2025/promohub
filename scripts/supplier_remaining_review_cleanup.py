from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MAPPING_DIR = ROOT / "outputs" / "supplier_mapping"
INVENTORY_DIR = ROOT / "outputs" / "supplier_inventory"

MAPPING_V2 = MAPPING_DIR / "supplier_category_mappings_DRAFT_v2.csv"
PRODUCT_LINKS = INVENTORY_DIR / "supplier_product_category_links.csv"
MASTER_TABLE = Path(
    r"C:\Users\jilin\Desktop\supplier\New folder\QuirkyPromo_Master_Table_LOCKED.md"
)

OUT_RULES = MAPPING_DIR / "remaining_review_keyword_rules_DRAFT.csv"
OUT_RESULTS = MAPPING_DIR / "remaining_review_product_cleanup_results.csv"
OUT_REVIEW = MAPPING_DIR / "remaining_review_products.csv"
OUT_MAPPING_V3 = MAPPING_DIR / "supplier_category_mappings_DRAFT_v3.csv"
OUT_SUMMARY = MAPPING_DIR / "remaining_review_cleanup_summary.md"
OUT_VALIDATION = MAPPING_DIR / "remaining_review_cleanup_validation.json"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in fieldnames})


def parse_master_targets(path: Path) -> set[tuple[str, str]]:
    targets: set[tuple[str, str]] = set()
    category = ""
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("## ") and "说明" not in line and "备注" not in line:
            category = line[3:].strip()
            continue
        if not category or not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) >= 3 and cells[0] not in {"subcategory", "---"} and cells[2] == "P":
            targets.add((category, cells[0]))
    return targets


@dataclass(frozen=True)
class Rule:
    rule_id: str
    priority: int
    keyword_regex: str
    target_category: str
    target_subcategory: str
    confidence: float
    note: str = ""
    exclude_regex: str = ""
    suggested_tags: str = ""
    suggested_material: str = ""

    def matches(self, text: str) -> bool:
        if self.exclude_regex and re.search(self.exclude_regex, text, re.I):
            return False
        return bool(re.search(self.keyword_regex, text, re.I))


RULES: list[Rule] = [
    # Technology before generic lanyard/card/bag rules.
    Rule("TECH-010", 10, r"\bwireless\s+charg(er|ing)|charging\s+pad\b", "Technology", "Wireless Chargers", 0.94),
    Rule("TECH-020", 20, r"\bpower\s*bank|keychain\s*powerbank|powerbank\b", "Technology", "Power Banks", 0.95),
    Rule("TECH-030", 30, r"\b(earbud|earbuds|headphone|headphones|tws|skullcandy|anc\s+wireless)\b", "Technology", "Earbuds & Headphones", 0.95),
    Rule("TECH-040", 40, r"\b(bluetooth\s*)?speaker\b|solar\s+speaker\b", "Technology", "Bluetooth Speakers", 0.93),
    Rule("TECH-050", 50, r"\busb\s+(flash\s+)?drive\b|\bflash\s+drive\b|\bmemory\s+stick\b|\busb\b.*\b\d+\s*gb\b", "Technology", "USB Flash Drives", 0.95),
    Rule("TECH-060", 60, r"\b(charging|charge|charger|adapter|cable|cables|3\s*in\s*1\s*cable|type[- ]?c|lightning)\b", "Technology", "Charging Cables & Chargers", 0.88, exclude_regex=r"bottle\s+opener|keytag"),
    Rule("TECH-070", 70, r"\b(phone|mobile|tablet|ipad)\s+(stand|holder|mount|grip|wallet)\b|\bcar\s+mount\b|\bphone\s+card\s+holder\b|\bpop\s*socket\b", "Technology", "Phone Accessories", 0.9),
    Rule("TECH-080", 80, r"\bwebcam\s+cover|screen\s+(cleaner|cleaning\s+cloth)|micro\s*fibre\s+(cloth|pouch)|microfiber\s+(cloth|pouch)|cable\s+organiser|cable\s+organizer|\borganiser\s+pouch\b", "Technology", "Tech Accessories", 0.86),

    # Giveaways and event items.
    Rule("GIVE-010", 100, r"\blanyard\b", "Giveaways & Event Accessories", "Lanyards", 0.94, exclude_regex=r"charging|charge|power\s+band"),
    Rule("GIVE-020", 110, r"\bwrist\s*band|wristband\b", "Giveaways & Event Accessories", "Wristbands", 0.94),
    Rule("GIVE-030", 120, r"\bbadge\b", "Giveaways & Event Accessories", "Badges", 0.92),
    Rule("GIVE-040", 130, r"\bid\s+(holder|card)|card\s+holder\b", "Giveaways & Event Accessories", "ID Holders", 0.86, exclude_regex=r"phone|business|credit"),
    Rule("GIVE-050", 140, r"\btemporary\s+tattoo|tattoo\b", "Giveaways & Event Accessories", "Temporary Tattoos", 0.95),
    Rule("GIVE-060", 150, r"\bballoon\b", "Giveaways & Event Accessories", "Balloons", 0.95),
    Rule("GIVE-070", 160, r"\bfridge\s+magnet|magnetic\s+whiteboard|magnet\b", "Giveaways & Event Accessories", "Magnets", 0.84, exclude_regex=r"car\s+mount"),
    Rule("GIVE-080", 170, r"\bpatch\b|promotional\s+sticker\b", "Giveaways & Event Accessories", "Stickers & Patches", 0.84),

    # Barware must precede broad drinkware bottle/cooler matching.
    Rule("BAR-010", 200, r"\bbottle\s+opener\b|\bwaiter'?s?\s+knife\b|\bcorkscrew\b", "Barware & Accessories", "Bottle Openers", 0.95),
    Rule("BAR-020", 210, r"\bcoasters?\b", "Barware & Accessories", "Coasters", 0.94),
    Rule("BAR-030", 220, r"\bstubby\b|stubbie\b|\bcan\s+cooler\b|\bdrink\s+cooler\b", "Barware & Accessories", "Stubby Holders", 0.92),
    Rule("BAR-040", 230, r"\bbar\s+(mat|runner)\b", "Barware & Accessories", "Bar Mats", 0.95),
    Rule("BAR-050", 240, r"\bwine\s+(cooler|rack|table|stopper|opener)|hip\s+flask|whiskey\s+stone|whisky\s+stone\b", "Barware & Accessories", "Wine Accessories", 0.9),
    Rule("BAR-060", 250, r"\bstraws?\b|cocktail\s+shaker|ice\s+bucket|ice\s+cubes?\b", "Barware & Accessories", "Bar Accessories", 0.86),

    # Drinkware.
    Rule("DRINK-010", 300, r"\b(water|drink|drinking|sports?)\s*bottle\b|\b\d+\s*(ml|l)\s*bottle\b|\bbottle\s*\(?\d|bottle\b.*\b(ml|litre|liter|l)\b", "Drinkware", "Drink Bottles", 0.9, exclude_regex=r"opener|holder|pouch|bag|gift\s+bag|wine\s+bag"),
    Rule("DRINK-020", 310, r"\bcoffee\s+cup\b|\breusable\s+cup\b|\bkeep\s*cup\b", "Drinkware", "Coffee Cups", 0.92),
    Rule("DRINK-030", 320, r"\btravel\s+mug\b|\bvacc?uum\s+cup\b|\binsulated\s+cup\b", "Drinkware", "Travel Mugs", 0.88),
    Rule("DRINK-040", 330, r"\btumbler\b|\bsmoothie\b|\bshaker\s+cup\b|\b\d+\s*(ml|l)\s*cup\b", "Drinkware", "Tumblers", 0.9),
    Rule("DRINK-050", 340, r"\bmug\b|\bceramic\s+cup\b", "Drinkware", "Mugs", 0.88, exclude_regex=r"travel\s+mug"),
    Rule("DRINK-060", 350, r"\bglassware\b|\bglass\b|\bwine\s+glass\b|\bbeer\s+glass\b", "Drinkware", "Glassware", 0.86),
    Rule("DRINK-070", 360, r"\bflask\b|\bthermos\b", "Drinkware", "Flasks", 0.84, exclude_regex=r"hip\s+flask"),
    Rule("DRINK-080", 370, r"\btea\s+(set|infuser|pot)|teaware\b", "Drinkware", "Teaware", 0.86),

    # Bags.
    Rule("BAG-010", 400, r"\blaptop\s+(bag|backpack|sleeve|case)\b", "Bags", "Laptop Bags", 0.94),
    Rule("BAG-020", 410, r"\bbackpack\b", "Bags", "Backpacks", 0.94),
    Rule("BAG-030", 420, r"\btote\b|\bcalico\s+bag\b|\bshopping\s+bag\b|\bbamboo\s+bag\b|\bnon\s+woven\s+bag\b|\bproduce\s+bag\b", "Bags", "Tote Bags", 0.86, exclude_regex=r"paper\s+shopping\s+bag"),
    Rule("BAG-040", 430, r"\bcooler\s+bag\b|\binsulated\s+(grocery\s+)?(bag|tote)\b|\blunch\s+(bag|cooler)\b", "Bags", "Cooler Bags", 0.92),
    Rule("BAG-050", 440, r"\bdrawstring\b|\bshow\s+bag\b", "Bags", "Drawstring Bags", 0.9),
    Rule("BAG-060", 450, r"\bduffle\b|\bduffel\b|\btravel\s+bag\b|\bgym\s+bag\b|\bsports?\s+bag\b|\bcarry[- ]?on\b", "Bags", "Travel & Duffle Bags", 0.86),
    Rule("BAG-070", 460, r"\btoiletry\b|\bcosmetic\s+bag\b|\bmakeup\s+bag\b", "Bags", "Toiletry Bags", 0.94),
    Rule("BAG-080", 470, r"\bjute\b", "Bags", "Jute Bags", 0.9),
    Rule("BAG-090", 480, r"\bpaper\s+(bag|shopping\s+bag)\b", "Bags", "Paper Bags", 0.92),
    Rule("BAG-100", 490, r"\bwine\s+(carrier|bag)\b", "Bags", "Wine Carriers", 0.9),
    Rule("BAG-110", 500, r"\bcrossbody\b|\bbelt\s+bag\b|\bbum\s+bag\b", "Bags", "Crossbody & Belt Bags", 0.9),
    Rule("BAG-120", 510, r"\bsatchel\b", "Bags", "Satchel Bags", 0.9),
    Rule("BAG-130", 520, r"\bdry\s+bag\b", "Bags", "Dry Bags", 0.92),

    # Apparel and headwear.
    Rule("HEAD-010", 600, r"\b(bucket\s+hat)\b", "Headwear", "Bucket Hats", 0.95),
    Rule("HEAD-020", 610, r"\bwide\s+brim\b", "Headwear", "Wide Brim Hats", 0.95),
    Rule("HEAD-030", 620, r"\bstraw\s+hat\b", "Headwear", "Straw Hats", 0.94),
    Rule("HEAD-040", 630, r"\bbeanie\b", "Headwear", "Beanies", 0.95),
    Rule("HEAD-050", 640, r"\bvisor\b", "Headwear", "Visors", 0.94),
    Rule("HEAD-060", 650, r"\bcap\b|\bsnapback\b|\btrucker\b", "Headwear", "Caps", 0.9, exclude_regex=r"cap\s+gun|capacity"),
    Rule("HEAD-070", 660, r"\bsanta\s+hat\b|\bnovelty\s+hat\b", "Headwear", "Novelty Headwear", 0.92),
    Rule("APP-010", 700, r"\bt[- ]?shirt\b|\btee\b|\bsinglet\b", "Apparel", "T-Shirts", 0.9),
    Rule("APP-020", 710, r"\bpolo\b", "Apparel", "Polo Shirts", 0.94),
    Rule("APP-030", 720, r"\bhoodie\b", "Apparel", "Hoodies", 0.94),
    Rule("APP-040", 730, r"\bpullover\b|\bsweatshirt\b|\bsweater\b|\bjersey\b", "Apparel", "Sweatshirts", 0.84),
    Rule("APP-050", 740, r"\bjacket\b|\banorak\b|\bponcho\b", "Apparel", "Jackets", 0.88),
    Rule("APP-060", 750, r"\bshirt\b", "Apparel", "Shirts", 0.84, exclude_regex=r"t[- ]?shirt|polo"),
    Rule("APP-070", 760, r"\bvest\b", "Apparel", "Vests", 0.9),
    Rule("APP-080", 770, r"\b(shorts?|pants?|trousers)\b", "Apparel", "Pants & Shorts", 0.9),
    Rule("APP-090", 780, r"\bapron\b", "Apparel", "Aprons", 0.92),
    Rule("APP-100", 790, r"\bsocks?\b", "Apparel", "Socks", 0.92),
    Rule("APP-110", 800, r"\bscarf\b|\bgloves?\b|\btie\b|\bscrunchie\b|\bbandana\b|\bslides?\b", "Apparel", "Scarves & Accessories", 0.82),

    # Office and pens.
    Rule("PEN-010", 900, r"\bstylus\s+pen\b|\bstylus\b", "Pens", "Stylus Pens", 0.9),
    Rule("PEN-020", 910, r"\bhighlighter\b", "Pens", "Highlighters", 0.95),
    Rule("PEN-030", 920, r"\bmarker\b", "Pens", "Markers", 0.92),
    Rule("PEN-040", 930, r"\bpencil\b", "Pens", "Pencils", 0.9, exclude_regex=r"pencil\s+case"),
    Rule("PEN-050", 940, r"\b(ballpoint|pen)\b", "Pens", "Ballpoint Pens", 0.84, exclude_regex=r"pencil|case|holder"),
    Rule("OFF-010", 1000, r"\bnotebook\b|\bjournal\b", "Office & Desk", "Notebooks", 0.92),
    Rule("OFF-020", 1010, r"\bnote\s*pad\b|\bnotepad\b", "Office & Desk", "Note Pads", 0.92),
    Rule("OFF-030", 1020, r"\bplanner\b|\bcalendar\b|\bdiary\b", "Office & Desk", "Pads & Planners", 0.86),
    Rule("OFF-040", 1030, r"\bsticky\s+note\b", "Office & Desk", "Sticky Notes", 0.95),
    Rule("OFF-050", 1040, r"\bruler\b", "Office & Desk", "Rulers", 0.95),
    Rule("OFF-060", 1050, r"\bpencil\s+case\b", "Office & Desk", "Pencil Cases", 0.95),
    Rule("OFF-070", 1060, r"\bportfolio\b|\bcompendium\b", "Office & Desk", "Portfolios & Compendiums", 0.92),
    Rule("OFF-080", 1070, r"\bdesk\b|\bmouse\s+mat\b|\bmousepad\b|\bcounter\s+mat\b|\bwhiteboard\b|\bto\s+do\s+list\b", "Office & Desk", "Desk Items", 0.82),

    # Toys and games.
    Rule("TOY-010", 1100, r"\bstress\b|\bsqueeze\b", "Toys & Games", "Stress Balls & Toys", 0.94),
    Rule("TOY-020", 1110, r"\bplush\b|\bteddy\b", "Toys & Games", "Plush Toys", 0.95),
    Rule("TOY-030", 1120, r"\bwooden\s+(model|toy)|model\s+(car|plane|truck|kit)\b", "Toys & Games", "Wooden Toys & Models", 0.88),
    Rule("TOY-040", 1130, r"\bpuzzle\b|\bgame\b|\bskittle\b|\bplaying\s+cards?\b", "Toys & Games", "Games & Puzzles", 0.88),
    Rule("TOY-050", 1140, r"\bfrisbee\b|\bflying\s+disc\b|\bbeach\s+ball\b|\bfootball\s+rocket\b|\bbounce\s+ball\b|\bpopper\s+wrist\s+disc\b", "Toys & Games", "Outdoor Toys", 0.9),
    Rule("TOY-060", 1150, r"\bcrayon\b|\bcolouring\b|\bcoloring\b|\bchalk\b|\billustrator\b", "Toys & Games", "Colouring & Kids Sets", 0.94),
    Rule("TOY-070", 1160, r"\bfidget\b|\byo[- ]?yo\b|\bcap\s+gun\b|\bspinner\b|\bspinzy\b|\bbubble\b|\bpopper\b|\bsensory\b|\brainbow\s+serpent\b|\bkaraoke\b", "Toys & Games", "Novelty Toys", 0.86),

    # Outdoor, sports, tools, travel.
    Rule("OUT-010", 1200, r"\bumbrella\b", "Outdoor & Sports", "Umbrellas", 0.95),
    Rule("OUT-020", 1210, r"\btowel\b|\bface\s+washer\b|\bbath\s+sheet\b", "Outdoor & Sports", "Towels", 0.9),
    Rule("OUT-030", 1220, r"\bgolf\b", "Outdoor & Sports", "Golf Products", 0.92),
    Rule("OUT-040", 1230, r"\bfootball\b|\bsoccer\b|\bbasketball\b|\btennis\s+ball\b|\bpickleball\b|\bsports?\s+ball\b|\bbat\s*&\s*ball\b|\bball\s+set\b", "Outdoor & Sports", "Sports Products", 0.86),
    Rule("OUT-050", 1240, r"\bpicnic\b|\bbbq\b|\bbarbecue\b", "Outdoor & Sports", "Picnic & BBQ", 0.86),
    Rule("OUT-060", 1250, r"\bsunglasses\b|\bsunnies\b", "Outdoor & Sports", "Sunglasses", 0.95),
    Rule("OUT-070", 1260, r"\bblanket\b|\bthrow\b|\bleisure\s+mat\b|\bbeach\s+mat\b", "Outdoor & Sports", "Blankets", 0.88),
    Rule("OUT-080", 1270, r"\bcamp\b|\bcamping\b|\bfolding\s+chair\b|\bleisure\s+chair\b|\bbeach\s+chair\b|\bcarabiner\b", "Outdoor & Sports", "Camping & Outdoors", 0.84, exclude_regex=r"keyring|key\s*ring|multi|tool"),
    Rule("OUT-090", 1280, r"\b(fan|fans)\b", "Outdoor & Sports", "Supporter Gear", 0.78, note="Use for handheld/supporter fans; review if powered fan."),
    Rule("TOOL-010", 1300, r"\btape\s+measure\b|\bcaliper\b", "Tools & Auto", "Tape Measures", 0.94),
    Rule("TOOL-020", 1310, r"\btorch\b|\bheadlamp\b|\bflashlight\b|\binspection\s+light\b|\bcamp\s+light\b", "Tools & Auto", "Torches & Lights", 0.9),
    Rule("TOOL-030", 1320, r"\bmulti[- ]?tool\b|\bpocket\s+knife\b", "Tools & Auto", "Multi-Tools", 0.9),
    Rule("TOOL-040", 1330, r"\bscrewdriver\b|\btool\s+set\b|\btool\s+kit\b", "Tools & Auto", "Tool Sets & Screwdrivers", 0.9),
    Rule("TOOL-050", 1340, r"\bcar\s+(sunshade|shade|air\s+freshener|organiser|organizer)|ice\s+scraper\b", "Tools & Auto", "Car Accessories", 0.88),
    Rule("TRAV-010", 1400, r"\bluggage\s+tag\b", "Travel", "Luggage Tags", 0.95),
    Rule("TRAV-020", 1410, r"\bpassport\b", "Travel", "Passport Holders", 0.95),
    Rule("TRAV-030", 1420, r"\brfid\s+wallet\b|\btravel\s+wallet\b", "Travel", "Travel Wallets", 0.9),
    Rule("TRAV-040", 1430, r"\btravel\s+pillow\b|\bneck\s+pillow\b|\beye\s+mask\b|\bear\s+plug\b", "Travel", "Travel Pillows & Comfort", 0.92),
    Rule("TRAV-050", 1440, r"\bluggage\s+(strap|scale|lock)|\btsa\b|\btravel\s+set\b", "Travel", "Travel Accessories", 0.84),

    # Home, packaging, marketing, personal, pet, confectionery.
    Rule("HOME-010", 1500, r"\bcheese\s+board\b|\bserving\s+board\b|\bserveware\b|\bpaddle\s+board\b|\bcharcuterie\b|\btasting\s+board\b", "Home & Living", "Cheese & Serving Boards", 0.88),
    Rule("HOME-020", 1510, r"\bcutting\s+board\b|\bchopping\s+board\b|\bcutlery\b|\bkitchen\b|\blunch\s+box\b|\bplacemat\b|\btable\b", "Home & Living", "Kitchen & Dining", 0.84),
    Rule("HOME-030", 1520, r"\bcandle\b|\bdiffuser\b", "Home & Living", "Candles & Diffusers", 0.92),
    Rule("HOME-040", 1530, r"\blamp\b|\blantern\b|\bphoto\s+frame\b|\bcushion\b", "Home & Living", "Home Decor", 0.82, exclude_regex=r"camp\s+light"),
    Rule("MKT-010", 1600, r"\bbusiness\s+card\b|\bloyalty\s+card\b", "Marketing Materials", "Business Cards", 0.9),
    Rule("MKT-020", 1610, r"\bresin\s+label\b|\bdome\s+label\b", "Marketing Materials", "Resin Labels", 0.92),
    Rule("MKT-030", 1620, r"\blabel\b|\bsticker\b", "Marketing Materials", "Labels & Stickers", 0.82, exclude_regex=r"promotional\s+sticker|patch"),
    Rule("PKG-010", 1700, r"\bgift\s+box\b|\bbox\b", "Packaging", "Gift Boxes", 0.84, exclude_regex=r"lunch\s+box"),
    Rule("PKG-020", 1710, r"\bgift\s+bag\b", "Packaging", "Gift Bags", 0.9),
    Rule("PKG-030", 1720, r"\bgift\s+tube\b|\btube\b", "Packaging", "Gift Tubes", 0.86),
    Rule("PKG-040", 1730, r"\btissue\s+paper\b|\bwrapping\s+paper\b", "Packaging", "Tissue & Wrapping", 0.9),
    Rule("PKG-050", 1740, r"\bribbon\b|\bgift\s+tag\b", "Packaging", "Ribbons & Gift Tags", 0.9),
    Rule("PKG-060", 1750, r"\bgreeting\s+card\b|\bmessage\s+card\b|\bgift\s+card\b", "Packaging", "Greeting & Gift Cards", 0.86),
    Rule("PKG-070", 1760, r"\bpouch\b", "Packaging", "Pouches", 0.62, note="Only safe when source path is packaging-oriented."),
    Rule("PC-010", 1800, r"\blip\s+balm\b", "Personal Care", "Lip Balms", 0.95),
    Rule("PC-020", 1810, r"\bsanitiser\b|\bsanitizer\b|\bwet\s+wipes?\b", "Personal Care", "Hand Sanitiser", 0.9),
    Rule("PC-030", 1820, r"\bface\s+mask\b", "Personal Care", "Face Masks", 0.95),
    Rule("PC-040", 1830, r"\bsunscreen\b|\blotion\b", "Personal Care", "Sunscreen & Lotions", 0.94),
    Rule("PC-050", 1840, r"\bfirst\s+aid\b", "Personal Care", "First Aid", 0.95),
    Rule("PC-060", 1850, r"\bmanicure\b|\bnail\b", "Personal Care", "Manicure Sets", 0.9),
    Rule("PC-070", 1860, r"\bmirror\b|\bbeauty\b", "Personal Care", "Mirrors & Beauty Accessories", 0.84),
    Rule("PC-080", 1870, r"\bbath\b|\bsoap\b|\bspa\b|\bmassager\b", "Personal Care", "Bath & Body", 0.84),
    Rule("PC-090", 1880, r"\bcomb\b|\btoothbrush\b|\bgrooming\b|\bhair\s+detangler\b", "Personal Care", "Grooming", 0.86),
    Rule("PET-010", 1900, r"\bpet\b|\bdog\b|\bcat\b|\bleash\b|\bpet\s+bowl\b", "Pet", "Pet Accessories", 0.88),
    Rule("CONF-010", 2000, r"\bchocolate\b|\bmint\b|\blolly\b|\blollies\b|\bsweet\b|\bgum\b|\bcandy\b", "Confectionery", "Confectionery", 0.88),

    # Flags and displays.
    Rule("DISPLAY-010", 2100, r"\bfeather\s+flag\b|\bteardrop\s+flag\b|\btear\s+drop\s+flag\b", "Flags & Displays", "Feather & Teardrop Flags", 0.95),
    Rule("DISPLAY-020", 2110, r"\bpull\s*up\s+banner\b|\broll\s*up\s+banner\b", "Flags & Displays", "Pull Up Banners", 0.95),
    Rule("DISPLAY-030", 2120, r"\bmedia\s+wall\b", "Flags & Displays", "Media Walls", 0.95),
    Rule("DISPLAY-040", 2130, r"\bmarquee\b", "Flags & Displays", "Marquees", 0.95),
    Rule("DISPLAY-050", 2140, r"\btable\s+(cover|cloth)\b", "Flags & Displays", "Table Covers", 0.94),
    Rule("DISPLAY-060", 2150, r"\ba[- ]?frame\b|\bcore\s*flute\b|\bsignage\b", "Flags & Displays", "A-Frames & Signage", 0.88),
]


def normalize_text(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def apply_rule(product_name: str, raw_path: str) -> tuple[Rule | None, str]:
    text = normalize_text(f"{product_name} {raw_path}")

    # Avoid treating generic gift sets/hampers as a primary product category.
    if re.search(r"\b(gift\s*set|hamper|pack|bundle|kit)\b", text, re.I):
        # Still allow clear single-product names inside these raw buckets.
        if not re.search(
            r"bottle|tumbler|mug|pen|notebook|journal|speaker|earbud|charger|cable|"
            r"power\s*bank|towel|bag|lanyard|cap|umbrella|coaster|opener|board|"
            r"sunscreen|sanitiser|first\s+aid|chocolate|mint",
            text,
            re.I,
        ):
            return None, "gift set/hamper/pack needs manual bundle strategy"

    for rule in sorted(RULES, key=lambda r: r.priority):
        if rule.rule_id == "PKG-070" and "packaging" not in raw_path.lower():
            continue
        if rule.matches(text):
            return rule, ""
    return None, "no high-confidence keyword match"


def main() -> None:
    mapping_rows = read_csv(MAPPING_V2)
    product_links = read_csv(PRODUCT_LINKS)
    valid_targets = parse_master_targets(MASTER_TABLE)

    invalid_rules = [
        f"{r.rule_id}: {r.target_category} > {r.target_subcategory}"
        for r in RULES
        if (r.target_category, r.target_subcategory) not in valid_targets
    ]
    if invalid_rules:
        raise RuntimeError("Invalid rule targets:\n" + "\n".join(invalid_rules))

    needs_keys = {
        (r["supplier"], r["source_field"], r["raw_category_path"]): r
        for r in mapping_rows
        if r.get("mapping_status") == "needs_review"
    }

    links_by_key: dict[tuple[str, str, str], list[dict[str, str]]] = defaultdict(list)
    for link in product_links:
        key = (link["supplier"], link["source_field"], link["raw_category_path"])
        if key in needs_keys:
            links_by_key[key].append(link)

    result_rows: list[dict[str, object]] = []
    review_rows: list[dict[str, object]] = []
    stats_by_key: dict[tuple[str, str, str], dict[str, object]] = {}

    seen_products: set[tuple[str, str, str, str]] = set()
    for key, links in sorted(links_by_key.items()):
        target_counts: Counter[str] = Counter()
        auto = 0
        unresolved = 0
        conflict = 0
        unique_links = []
        for link in links:
            product_key = (key[0], key[1], key[2], link.get("sku", ""))
            if product_key in seen_products:
                continue
            seen_products.add(product_key)
            unique_links.append(link)

        for link in unique_links:
            product_name = link.get("product_name", "")
            rule, reason = apply_rule(product_name, key[2])
            if rule:
                status = "auto_mapped_by_keyword"
                target_category = rule.target_category
                target_subcategory = rule.target_subcategory
                confidence = rule.confidence
                rule_id = rule.rule_id
                review_reason = ""
                auto += 1
                target_counts[f"{target_category} > {target_subcategory}"] += 1
            else:
                status = "needs_review"
                target_category = ""
                target_subcategory = ""
                confidence = ""
                rule_id = ""
                review_reason = reason
                unresolved += 1

            row = {
                "supplier": key[0],
                "source_field": key[1],
                "raw_category_path": key[2],
                "sku": link.get("sku", ""),
                "product_name": product_name,
                "mapping_status": status,
                "target_category": target_category,
                "target_subcategory": target_subcategory,
                "confidence": confidence,
                "rule_id": rule_id,
                "review_reason": review_reason,
                "suggested_tags": rule.suggested_tags if rule else "",
                "suggested_material": rule.suggested_material if rule else "",
                "mapping_note": rule.note if rule else "",
            }
            result_rows.append(row)
            if status == "needs_review":
                review_rows.append(row)

        stats_by_key[key] = {
            "total": len(unique_links),
            "auto": auto,
            "unresolved": unresolved,
            "conflict": conflict,
            "targets": target_counts,
        }

    # Update raw category mapping rows to show what happened at product level.
    updated_rows: list[dict[str, str]] = []
    for row in mapping_rows:
        key = (row["supplier"], row["source_field"], row["raw_category_path"])
        new_row = dict(row)
        if row.get("mapping_status") == "needs_review" and key in stats_by_key:
            stats = stats_by_key[key]
            target_counts: Counter[str] = stats["targets"]  # type: ignore[assignment]
            total = int(stats["total"])
            auto = int(stats["auto"])
            unresolved = int(stats["unresolved"])
            conflict = int(stats["conflict"])
            top_targets = ", ".join(f"{name}:{count}" for name, count in target_counts.most_common(8))
            if auto and not unresolved and len(target_counts) == 1:
                only_target = next(iter(target_counts))
                category, subcategory = only_target.split(" > ", 1)
                new_row["target_category"] = category
                new_row["target_subcategory"] = subcategory
                new_row["confidence"] = "0.86"
                new_row["mapping_status"] = "auto_mapped_by_keyword"
                new_row["review_reason"] = ""
                new_row["mapping_note"] = (
                    f"All {total} products matched one high-confidence target by product keywords: {only_target}."
                )
            elif auto and not unresolved:
                new_row["target_category"] = ""
                new_row["target_subcategory"] = ""
                new_row["confidence"] = ""
                new_row["mapping_status"] = "product_keyword_rules_applied"
                new_row["review_reason"] = "raw path split at product level"
                new_row["mapping_note"] = (
                    f"Product-level cleanup complete. auto={auto}, unresolved=0, conflict={conflict}. "
                    f"Top targets: {top_targets}"
                )
            elif auto and unresolved:
                new_row["target_category"] = ""
                new_row["target_subcategory"] = ""
                new_row["confidence"] = ""
                new_row["mapping_status"] = "product_keyword_rules_partial"
                new_row["review_reason"] = "partial product-level cleanup; unresolved products remain"
                new_row["mapping_note"] = (
                    f"Product-level cleanup partial. auto={auto}, unresolved={unresolved}, conflict={conflict}. "
                    f"Top targets: {top_targets}"
                )
            else:
                new_row["mapping_note"] = "No high-confidence product keyword match; keep for manual review."
        updated_rows.append(new_row)

    rule_rows = [
        {
            "rule_id": r.rule_id,
            "priority": r.priority,
            "keyword_regex": r.keyword_regex,
            "exclude_regex": r.exclude_regex,
            "target_category": r.target_category,
            "target_subcategory": r.target_subcategory,
            "confidence": r.confidence,
            "suggested_tags": r.suggested_tags,
            "suggested_material": r.suggested_material,
            "note": r.note,
        }
        for r in sorted(RULES, key=lambda x: x.priority)
    ]

    write_csv(
        OUT_RULES,
        rule_rows,
        [
            "rule_id",
            "priority",
            "keyword_regex",
            "exclude_regex",
            "target_category",
            "target_subcategory",
            "confidence",
            "suggested_tags",
            "suggested_material",
            "note",
        ],
    )

    result_fields = [
        "supplier",
        "source_field",
        "raw_category_path",
        "sku",
        "product_name",
        "mapping_status",
        "target_category",
        "target_subcategory",
        "confidence",
        "rule_id",
        "review_reason",
        "suggested_tags",
        "suggested_material",
        "mapping_note",
    ]
    write_csv(OUT_RESULTS, result_rows, result_fields)
    write_csv(OUT_REVIEW, review_rows, result_fields)
    write_csv(OUT_MAPPING_V3, updated_rows, list(mapping_rows[0].keys()))

    status_counts = Counter(r.get("mapping_status", "") for r in updated_rows)
    product_status_counts = Counter(r["mapping_status"] for r in result_rows)
    unresolved_by_supplier = Counter(r["supplier"] for r in review_rows)
    unresolved_by_raw = Counter((r["supplier"], r["raw_category_path"]) for r in review_rows)

    invalid_result_targets = [
        r
        for r in result_rows
        if r["target_category"]
        and (str(r["target_category"]), str(r["target_subcategory"])) not in valid_targets
    ]
    validation = {
        "mapping_rows": len(updated_rows),
        "original_needs_review_rows": len(needs_keys),
        "review_product_rows_processed": len(result_rows),
        "product_status_counts": dict(product_status_counts),
        "mapping_status_counts_v3": dict(status_counts),
        "remaining_review_product_rows": len(review_rows),
        "remaining_review_by_supplier": dict(unresolved_by_supplier),
        "invalid_result_targets": len(invalid_result_targets),
        "outputs": {
            "rules": str(OUT_RULES),
            "results": str(OUT_RESULTS),
            "remaining_review": str(OUT_REVIEW),
            "mapping_v3": str(OUT_MAPPING_V3),
            "summary": str(OUT_SUMMARY),
        },
    }
    OUT_VALIDATION.write_text(json.dumps(validation, indent=2), encoding="utf-8")

    top_unresolved_lines = [
        f"| {supplier} | {raw_path} | {count} |"
        for (supplier, raw_path), count in unresolved_by_raw.most_common(30)
    ]
    if not top_unresolved_lines:
        top_unresolved_lines = ["| - | - | 0 |"]

    top_target_lines = [
        f"| {target} | {count} |"
        for target, count in Counter(
            f"{r['target_category']} > {r['target_subcategory']}"
            for r in result_rows
            if r["target_category"]
        ).most_common(30)
    ]
    if not top_target_lines:
        top_target_lines = ["| - | 0 |"]

    summary = f"""# Remaining Review Cleanup Summary

Generated from `supplier_category_mappings_DRAFT_v2.csv` using product-name keyword rules.

## Result

| Metric | Count |
|---|---:|
| Raw category rows originally needing review | {len(needs_keys)} |
| Product rows processed inside those raw categories | {len(result_rows)} |
| Product rows auto-mapped by keyword | {product_status_counts.get('auto_mapped_by_keyword', 0)} |
| Product rows still needing review | {len(review_rows)} |
| Invalid target checks | {len(invalid_result_targets)} |

## v3 Mapping Status Counts

| mapping_status | rows |
|---|---:|
{chr(10).join(f"| {status or '(blank)'} | {count} |" for status, count in status_counts.most_common())}

## Top Auto Targets

| target | products |
|---|---:|
{chr(10).join(top_target_lines)}

## Top Remaining Manual Review Buckets

| supplier | raw_category_path | products |
|---|---:|
{chr(10).join(top_unresolved_lines)}

## Files

- `remaining_review_keyword_rules_DRAFT.csv`
- `remaining_review_product_cleanup_results.csv`
- `remaining_review_products.csv`
- `supplier_category_mappings_DRAFT_v3.csv`
- `remaining_review_cleanup_validation.json`
"""
    OUT_SUMMARY.write_text(summary, encoding="utf-8")

    print(json.dumps(validation, indent=2))


if __name__ == "__main__":
    main()
