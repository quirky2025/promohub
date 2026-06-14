# Supplier Raw Category Inventory

Generated from the four supplier files. This is an inventory only; target category/subcategory mapping is intentionally blank.

## Summary

| supplier | source rows | unique SKUs | raw category paths | product-like paths | review paths |
|---|---:|---:|---:|---:|---:|
| Gear For Life | 472 | 470 | 50 | 50 | 0 |
| Logoline | 5226 | 1054 | 159 | 153 | 6 |
| NIConcept | 994 | 975 | 13 | 8 | 5 |
| PromoBrands | 863 | 863 | 312 | 268 | 44 |

Total raw category path rows: **534**
Total unique product-category links: **4409**
Uncategorised or blank-SKU rows/products needing review: **77**

## Important Notes

- Logoline has many source rows per SKU because pricing/decoration lines repeat; inventory counts distinct SKUs per category path, while `source_row_count` preserves raw repeated rows.
- PromoBrands can assign one SKU to several category paths through Category 1-4; each path is retained as a separate raw link.
- `raw_path_type_guess` is a first-pass flag only: `product_category_candidate`, `collection_or_tag`, `service_or_fulfillment`, or `broad_category_needs_review`.
- `target_category` and `target_subcategory` are blank on purpose. Next step is mapping these to the LOCKED QuirkyPromo taxonomy.

## Top Raw Paths By Supplier

### Gear For Life
| raw category path | SKU count | type guess | examples |
|---|---:|---|---|
| Clothing / Shirts | 91 | product_category_candidate | EOE: The End on End Shirt - Mens ; ES: The Euro Corporate Stripe Shirt - Mens ; TBC: The Broadway Check Shirt - Mens ; TBT: The Bretton Shirt - Mens ; TCDH: The Cedar Hill Check Shirt - Mens |
| Clothing / Polo Shirts | 74 | product_category_candidate | DGAXP: Dri Gear Axis Polo - Mens ; DGCHP: Dri Gear Challenger Polo ; DGCHP(Y): Youth Dri Gear Challenger Polo ; DGCP: Dri Gear Corporate Pinnacle Polo - Mens ; DGDP: Dri Gear Dimension Polo - Mens |
| Clothing / Jackets | 38 | product_category_candidate | AN(C): Contrast Basecamp Anorak ; AN(P): Plain Basecamp Anorak ; AN(Y): Youth Plain Basecamp Anorak ; CWJ: Crosswinds Jacket ; DJ: District Jacket - Mens |
| Bags / Cooler Bags | 15 | product_category_candidate | BBCC: Bottle Caddy Cooler ; BBISC: Bistro Cooler ; BCOS: Cool Shuttle ; BCR: Cool Runner ; BDUC: Duo Cooler |
| Bags / Backpacks | 14 | product_category_candidate | BBB: Basket Backpack ; BFGB: Fugitive Backpack ; BFLB: Fluid Backpack ; BGMB: Grommet Backpack ; BICB: Identity Compu Backpack |
| Clothing / T Shirts | 14 | product_category_candidate | DGLS: Dri Gear Long Sleeve Tee - Mens ; DGR: Dri Gear Plain Raglan Tee - Mens ; DGST(I): Dri Gear Spliced Zenith Impact Tee ; DGZT: Dri Gear Zone Tee ; DGZT(Y): Youth Dri Gear Zone Tee |
| Clothing / Merino | 13 | product_category_candidate | EGMDP: Merino Detailed Vee Pullover - Mens ; EGMFV: Merino Fully Fashioned Vest - Mens ; EGMSP: Merino Short Sleeve Polo - Mens ; EGMZ: Merino Zip Pullover - Mens ; WEGMCD: Merino Cardigan - Womens |
| Clothing / Vests | 13 | product_category_candidate | ASROV: Agri Station Ranger Oilskin Vest ; FPV: Frontier Puffa Vest ; GV: Gravity Vest ; LV: Legacy Vest - Mens ; NV: Nylon Ottoman Vest |
| Bags / Duffle/Sports Bags | 12 | product_category_candidate | BHVS: Hydrovent Sports Bag ; BKDS: Kodiak Sports Bag ; BKKS: Kamakazzi Sports Bag ; BMS: Marine Sports Bag ; BPS: Plain Sports Bag |
| Home & Living / Cheese Boards | 12 | product_category_candidate | POCS: Carving Set ; POCCB: Clamshell Cheese Board ; POCB: Gourmet Cheese Board Set ; PONSB: Napoli Serving Board ; POPPS: Pizza Peel Set |
| Bags / Travel Bags | 11 | product_category_candidate | BBT: Bus Travel Bag ; BLD: Lansdowne Duffle ; BMO: Milan Overnight Bag ; BST: Solitude Travel Bag ; BTGB: Transporter Garment Bag |
| Bags / Laptops | 10 | product_category_candidate | BES: Express Conference Satchel ; BIB: Identity Brief Bag ; BPOB: Portal Brief Bag ; BPOCB: Portal Compu Backpack ; BSM: Satellite Messenger Bag |
| Drinkware / Drink Bottles | 10 | product_category_candidate | POCHB: Chill Hydro Bottle ; POEGB: Envy Glass Bottle ; POGB: Orbit Glass Bottle ; POTFI: Tea & Fruit Infuser Bottle ; POAB: Absorption Bottle |
| Clothing / Pullovers | 8 | product_category_candidate | ASBJ: Agri Station Boundary Jersey ; BT: Ballistic Top ; DGRFZ: Dri Gear Reflex Zip Pullover ; DGRFZ(Y): Youth Dri Gear Reflex Zip Pullover ; TNT: Transition Top |
| Drinkware / Glassware | 8 | product_category_candidate | POAGC: Aroma Glass Coffee Cup Set ; POGGS: Ginaissance Glass Set ; POHWGS: Highland Whisky Glass Set ; POTF2S: Tea For2 Set ; POBWD: Barolo Wine Decanter |

### Logoline
| raw category path | SKU count | type guess | examples |
|---|---:|---|---|
| Office / Notebooks | 40 | product_category_candidate | LL0941: Andean Notebook ; LL0944: Tourist A5 Notebook ; LL0946: Trek Notebook ; LL0950: Savannah Notebook ; LL0951: Savannah Notebook / Matador Pen |
| Personal / Face Masks | 32 | product_category_candidate | LL6019: Travel Safe Pack ; LL6021: 5 Pack -  Armour Face Masks ; LL6022: 5 Pack - Shield Face Masks ; LL6023: Deluxe Face Mask / Hand Sanitiser Pack ; LL6024: Armour Face Mask / Hand Sanitiser Pack |
| Packs & Gifting / Celebrate & Gift | 31 | product_category_candidate | LL8231: The Classic Pairing ; LL8233: The Warm Welcome ; LL8313: The Happy Hour ; LL8315: The Host Edit ; LL8317: The Carry-On Graze |
| Technology / Cables | 30 | product_category_candidate | LL0112: 2 in 1 Nifty USB Cable - Micro, 8 Pin ; LL9091: 3 in 1 Combo USB Cable - Micro, 8 Pin, Type C ; LL9093: Radius Cable ; LL9096: Altona Retractable Cable ; LL9099: Reveal Recycled ABS Cable Set |
| Drinkware / Drinkware Accessories | 26 | product_category_candidate | LL0980: Cosy Stainless Steel Drink Cooler ; LL201: Skol Bottle Opener / Keytag ; LL2014: Evergreen Straw Set ; LL2019: Buzz Paper Straws ; LL207: Spinner Bottle Opener |
| Indent / Indent Tech Accessories | 23 | service_or_fulfillment | LN0520: Custom Wireless Charger ; LN1425: Microfibre Bean Bag Phone Chair / Cleaner ; LN605: Screen Cleaning Kit ; LN6065: Microfibre Stick Clean 30mm x 30mm ; LN6066: Microfibre Stick Clean 35mm Diameter |
| Technology / Gift Sets | 23 | product_category_candidate | LL8211: Symphony Gift Set ; LL8212: Destiny Gift Set ; LL8214: Alliance Gift Set ; LL8215: Bellman Gift Set ; LL8218: Ohana Gift Set |
| Office / Pens / Black Refill,Plastic | 22 | product_category_candidate | LL0468: Gemini Pen ; LL0469: Gemini Metallic Pen ; LL0470: Aquarius Pen ; LL0474: Javelin Pen ; LL0714: LED Torch Pen |
| Home & Auto / Keytags | 21 | product_category_candidate | LL102: Condo Keytag ; LL205: Cheers Bottle Opener / Keytag ; LL3519: Arvo Bottle Opener ; LL3522: House Bamboo Zinc Keytag ; LL3524: Circle Bamboo Zinc Keytag |
| Personal / Grooming | 21 | product_category_candidate | LL0166: Folding Nail File ; LL0335: Bamboo Toothbrush ; LL0336: Refresh Travel Pack ; LL1047: Spa Bamboo Hair Brush ; LL1634: Compact Pop Up Brush / Mirror Set |
| Confectionery / Jelly Beans | 20 | product_category_candidate | LL3145: Corporate Colour Mini Jelly Beans ; LL31450: Corporate Colour Mini Jelly Beans in 50 Gram Cello Bag ; LL3146: Assorted Colour Mini Jelly Beans in Container ; LL3147: Assorted Colour Mini Jelly Beans ; LL31470: Assorted Colour Mini Jelly Beans in 50 Gram Cello Bag |
| Novelties / Kids | 20 | product_category_candidate | LL012: Quack PVC Bath Duck ; LL2885: Zippy Wooden Yo Yo ; LL3015: Ace Hacky Sacks ; LL3079: Crazy Bouncing Putty ; LL429: Rainbow Spring Thingz |
| Technology / Tech Accessories | 20 | product_category_candidate | LL0284: Whisper USB Hub ; LL0773: Defender Waterproof Pouch ; LL1614: Zoom LCD Writing Tablet ; LL3436: Phone Grip ; LL4834: Digital Luggage Scales |
| Novelties / Stress Relievers | 19 | product_category_candidate | LL112: Brain Stress Reliever ; LL297: House Stress Reliever ; LL3018: Popper Ball ; LL350: Transit Van Stress Reliever ; LL499: Apple Stress Reliever |
| Office / Pens / Black Refill,Metal | 18 | product_category_candidate | LL2111: Austin Pen / Stylus ; LL2113: Aspen Aluminium Pen ; LL3270: Napier Deluxe Pen ; LL3271: Napier Pen ; LL3272: Napier Pen (Black Edition) |

### NIConcept
| raw category path | SKU count | type guess | examples |
|---|---:|---|---|
| Bags | 252 | product_category_candidate | 119526: Mumbay Cotton Pocket Jute Tote Bag 19L ; 120120: Peek Drawstring Backpack ; 120191: Graphite Slim 15" 17L Laptop Backpack ; 120768: Swift GRS Recycled Toiletry Bag Set ; 130096: Byron 14" GRS Recycled City Laptop Backpack 16L |
| Apparel | 143 | broad_category_needs_review | 111053: Level Beanie - Unisex ; 38341: Heracles Bandana ; TKC1001: Trekk Austin Organic Washed Cotton Cap ; TKC1002: Trekk Alliance Organic Cotton Twill Cap ; TKC1003: Trekk Falcon Flex Cap |
| Drinkware | 141 | product_category_candidate | 100002: Oregon 400ml Sport Bottle w/ Carabiner ; 100836: Alti 630 ml RCS Recycled Plastic Water Bottle ; 113349: Seasons Gaudie Recycled Stainless Steel Cocktail Shaker ; 1414: Glass Coffee & Tea Set 300ml ; 1626-60: Reusable Stainless Steel Straw Set w/ Brush |
| Office | 131 | broad_category_needs_review | 1015-18: Drake Ballpoint ; 1026PEN: Geometric Ballpoint Pen ; 1055-32: Geneva Ballpoint ; 1066: Recycled Stainless Steel Ballpoint Pen ; 1066-49: Bamboo Quick-Dry Gel Ballpoint |
| Outdoor & Leisure | 104 | broad_category_needs_review | 1026-08: Aluminium Identification Tag ; 1033-94: Bamboo Fibre Cutlery Set ; 104493: Liam 5 Metre Measuring Tape ; 109064: Trav 21.5" Foldable Auto Marksman Umbrella ; 113211: Seasons Nordkapp Waitress Knife |
| Journals & Compendiums | 74 | product_category_candidate | 1026JNL: Geo Notebook ; 106249: Slyk A5 Cahier Planner ; 3619: The Presidential Portfolio ; 3640: The New Yorker Portfolio ; 425: A4 Pad Cover |
| Technology | 33 | broad_category_needs_review | 134264: Freal Wireless Charging Pad, White/Solid Black ; 1427: Dual Car Charger ; 2PA145: Prixton TWS158 ENC and ANC earbuds ; 2PA152: Prixton TWS159 ENC and ANC earbuds ; 6165: USB Smart Charger |
| Health & Personal | 27 | product_category_candidate | 124263: Kubi Phone Lanyard ; 126376: Glider Slider Makeup Mirror ; 126381: Beautix Manicure Set ; 1342: Portable First Aid Kit ; 1343: Weekly Pill Organiser |
| Games & Novelty | 25 | broad_category_needs_review | 1062: Freijo FSC Sticky Note ; 110029: Brainiac 3-Piece Wooden Brain Teaser Set ; 124460: Aggia Recycled Plastic Phone Stand w/ Fidget Toy ; 126386: Bellix Bicycle Bell ; 1355: Icon Mental Block |
| Giftsets | 22 | product_category_candidate | 8988: Plain Cufflinks ; 9096: Pineapple Leather Travel Gift Set ; GIFT1006: Gift Set w/ 9196 Journal & 4101 Nash Pen ; GIFT1007: Gift Set w/ JB1001 Journal & Nash Pen ; GIFT1010: Gift Set w/ JB1008 Nova Journal & 6018 Gorcia Pen |
| Travel & Home | 11 | product_category_candidate | 118013: Leveller Key Chain ; 1423: Cheese Set ; 5301: Hygiene Key ; 9018: Leather Travel Wallet ; 9115: Travel Wallet |
| Hampers | 9 | product_category_candidate | HAM1001: The Custom Gourmet Entertainer Set ; HAM1002: The Prestige Custom Gourmet Nibbles Gift Pack ; HAM1003: The Branded Gourmet Picnic Gift Pack ; HAM1004: The Gourmet Retreat Gift Pack ; HAM1005: Custom Sweet Treats & Essentials Gift Pack |
| Writing | 3 | product_category_candidate | SM-4303: The Nash Pen-Highlighter ; SM-4616: The Maven Soft Touch Metal Pen ; SM-9000: Velvet Pouch |

### PromoBrands
| raw category path | SKU count | type guess | examples |
|---|---:|---|---|
| Offshore Express | 77 | service_or_fulfillment | OA034: Santa Sock Gift Tote ; OU001: Full Colour Poppins Umbrella ; OU002: Full Colour Corporate Umbrella ; S003: Magic Dress Socks ; S010: Magic Seamless Socks |
| Legendary Range | 68 | collection_or_tag | BR2: Mini Bar Runner ; BR1: Premium Bar Runner ; RB191-850: Deluxe 850mm Roll Up Banner ; RB191-1200: Deluxe 1200mm Roll Up Banner ; BB100: Button Badge 100mm |
| Pens & Writing Instruments / Metal | 47 | product_category_candidate | FD78S.MTO: BND78S SARI STYLUS, THIN TWIST METAL BALL PEN ; FD76S.MTO: BND76S JOT, STYLUS, TWIST METAL BALLPEN ; FD78XLS.MTO: BND78XLS SARI STYLUS TWIST METAL BALL PEN ; FD71S.MTO: BND71S CLAP STYLUS THIN TWIST METAL BALL PEN ; FD75S.MTO: BND75S CLAW STYLUS TWIST METAL BALL PEN |
| Sale | 46 | collection_or_tag | S960M: Java Drop (350mL) ; P200: Byron Pen ; P346: Metallic Mykonos Pen ; P322: Galapagos Pen ; P392: Palmyra Pen |
| Office / Desk Accessories & Supplies | 41 | product_category_candidate | NP115: 2 in 1 Pencil Set ; NP133: Colour Pencil Pack ; P380: Madeira Pen ; HP800: 3 1/2 inch Pencil ; F302: Velvet Pen Pouch |
| Bic Promo / Bic Pens | 39 | product_category_candidate | G55720: Flav Metallic Pen ; G55721: Electro Pen ; G55722: Electro Colour Pen ; G55723: Electro Silver Colour Pen ; G55575: White Element Pen |
| Eco+ Collection | 39 | collection_or_tag | S897: Carnaby 500ml Tumbler ; S3101: Vidro 750ml Bottle ; S3102: Vidro 1L Bottle ; P380: Madeira Pen ; FD500.ECO.Nat.FD: Ruma Wireless speaker in Plant Fibre |
| Office / Desk Accessories & Supplies | 38 | product_category_candidate | NP144: Malibu Stylus Pen ; F892: Hexad Stylus Pen ; P124: Mondello Pen ; P128: Amalfi Pen ; P125: Roma Pen |
| Offshore Express | 38 | service_or_fulfillment | OA029: Slides ; OA033: Pullover Hoodie ; OA013: Touch Football Singlet ; OA014: Rugby Jersey ; OA015: Rugby/AFL Shorts |
| Pens & Writing Instruments / Plastics | 33 | product_category_candidate | G55720: Flav Metallic Pen ; G55721: Electro Pen ; G55722: Electro Colour Pen ; G55723: Electro Silver Colour Pen ; G55575: White Element Pen |
| Trending | 33 | collection_or_tag | RB1018C: Colourful Calico Tote Bag ; RB1018: Calico Tote Bag ; D881: Wave Drinking 350mL Cup ; NP130.A5: A5 Colouring Books ; D217: Pluto Picnic Blanket |
| Outdoor & Leisure / Toys & Games | 31 | product_category_candidate | T156: Skittle Throw ; NP142: Squiggle Crayon Set ; PT101: Plush Kangaroo ; PT102: Plush Koala ; PT103: Plush Puppy |
| Eco+ Collection | 29 | collection_or_tag | T325: Eco Highlighter ; B105: Aroma Coffee Coasters ; B106: Bamboo Hairbrush ; B108: Ozi Bamboo Paddle Board ; B109: Trey Bamboo Cutting Board |
| Outdoor & Leisure / Toys & Games | 29 | product_category_candidate | T471: Silicon Frisbee ; T155: Stacking Puzzle Set with Pouch ; NP162: Cap Gun ; T475: Football Rocket ; T851: LED Light Up Yo-Yos |
| Apparel / Sublimated Apparel | 27 | product_category_candidate | OA029: Slides ; OA033: Pullover Hoodie ; OA013: Touch Football Singlet ; OA014: Rugby Jersey ; OA015: Rugby/AFL Shorts |

## Review Buckets
| supplier | raw category path | SKU count | type guess | examples |
|---|---|---:|---|---|
| NIConcept | Apparel | 143 | broad_category_needs_review | 111053: Level Beanie - Unisex ; 38341: Heracles Bandana ; TKC1001: Trekk Austin Organic Washed Cotton Cap ; TKC1002: Trekk Alliance Organic Cotton Twill Cap ; TKC1003: Trekk Falcon Flex Cap |
| NIConcept | Office | 131 | broad_category_needs_review | 1015-18: Drake Ballpoint ; 1026PEN: Geometric Ballpoint Pen ; 1055-32: Geneva Ballpoint ; 1066: Recycled Stainless Steel Ballpoint Pen ; 1066-49: Bamboo Quick-Dry Gel Ballpoint |
| NIConcept | Outdoor & Leisure | 104 | broad_category_needs_review | 1026-08: Aluminium Identification Tag ; 1033-94: Bamboo Fibre Cutlery Set ; 104493: Liam 5 Metre Measuring Tape ; 109064: Trav 21.5" Foldable Auto Marksman Umbrella ; 113211: Seasons Nordkapp Waitress Knife |
| NIConcept | Technology | 33 | broad_category_needs_review | 134264: Freal Wireless Charging Pad, White/Solid Black ; 1427: Dual Car Charger ; 2PA145: Prixton TWS158 ENC and ANC earbuds ; 2PA152: Prixton TWS159 ENC and ANC earbuds ; 6165: USB Smart Charger |
| NIConcept | Games & Novelty | 25 | broad_category_needs_review | 1062: Freijo FSC Sticky Note ; 110029: Brainiac 3-Piece Wooden Brain Teaser Set ; 124460: Aggia Recycled Plastic Phone Stand w/ Fidget Toy ; 126386: Bellix Bicycle Bell ; 1355: Icon Mental Block |
| PromoBrands | Office | 3 | broad_category_needs_review | T332: Daisy Eco Highlighter ; T326: Mackie Highlighter Sets ; T606: Nano Portable BT Speaker |
| PromoBrands | Office | 3 | broad_category_needs_review | RB001: Bowles Laptop Sleeve ; D878: The Original RPET Portfolio ; T856: Neo Keychain Powerbank 2000mAh |
| PromoBrands | Outdoor & Leisure | 3 | broad_category_needs_review | OG001: Daly Golf Towel ; H711: Scheffler Golf Towel ; T523: Popper Phone Tether Wristlet |
| PromoBrands | Office | 2 | broad_category_needs_review | T522: Whirl Popper Spinner ; D434: Minichroma A6 Notebook |
| PromoBrands | Outdoor & Leisure | 2 | broad_category_needs_review | S941: Wanderer 400ml Mug ; OG002: Neoprene Golf Ball Sleeve |
| PromoBrands | Outdoor & Leisure | 2 | broad_category_needs_review | S940: Wanderer 354ml Tumbler ; T222: Waterproof Phone Pouch |
| PromoBrands | Apparel | 1 | broad_category_needs_review | H138: Trucker Roadhouse Cap |
| PromoBrands | Outdoor & Leisure | 1 | broad_category_needs_review | K259: Cork Floating Keychain |
| PromoBrands | Legendary Range | 68 | collection_or_tag | BR2: Mini Bar Runner ; BR1: Premium Bar Runner ; RB191-850: Deluxe 850mm Roll Up Banner ; RB191-1200: Deluxe 1200mm Roll Up Banner ; BB100: Button Badge 100mm |
| PromoBrands | Sale | 46 | collection_or_tag | S960M: Java Drop (350mL) ; P200: Byron Pen ; P346: Metallic Mykonos Pen ; P322: Galapagos Pen ; P392: Palmyra Pen |
| PromoBrands | Eco+ Collection | 39 | collection_or_tag | S897: Carnaby 500ml Tumbler ; S3101: Vidro 750ml Bottle ; S3102: Vidro 1L Bottle ; P380: Madeira Pen ; FD500.ECO.Nat.FD: Ruma Wireless speaker in Plant Fibre |
| PromoBrands | Trending | 33 | collection_or_tag | RB1018C: Colourful Calico Tote Bag ; RB1018: Calico Tote Bag ; D881: Wave Drinking 350mL Cup ; NP130.A5: A5 Colouring Books ; D217: Pluto Picnic Blanket |
| PromoBrands | Eco+ Collection | 29 | collection_or_tag | T325: Eco Highlighter ; B105: Aroma Coffee Coasters ; B106: Bamboo Hairbrush ; B108: Ozi Bamboo Paddle Board ; B109: Trey Bamboo Cutting Board |
| PromoBrands | Legendary Range / Magnets | 21 | collection_or_tag | CL101: Magnetic Tab Calendar ; CL102: Magnetic Tab Calendar ; M408A: Magnetic Whiteboard (148mm x 210mm) ; M408B: Magnetic Whiteboard (210mm x 297mm) ; M408C: Magnetic Whiteboard (297mm x 420mm) |
| PromoBrands | Eco+ Collection | 17 | collection_or_tag | T125: Trafalgar Bamboo charging dock ; S896: Organic 650ml Bottle ; S844: Bambu Eco 400ml Bottle ; NP163: Grano 420ml Wheat Straw Water Bottle ; D881: Wave Drinking 350mL Cup |
| PromoBrands | New | 17 | collection_or_tag | S881: The Bondi 700ml Drinking Bottle ; T239: The Power Band Charging Lanyard - 60W ; T524: The Spinzy ; H451: Pac-Man Lunch Box with Handle ; T527: The Amazing Fidget |
| PromoBrands | Summer Range | 12 | collection_or_tag | RB1038: Byron Beach Tote ; D112: Aland 600ml Aluminum Water Bottle ; S900: Allegra 1L Bottle ; D310: Iris 700mL Cup ; NP157: Sand Spike |
| PromoBrands | New | 7 | collection_or_tag | JT148: The Barker Eco Notebook - B6 ; S922: The Maxwell 330ml Ceramic Mug ; T165: The Felix Foldable Phone Stand ; T856: Neo Keychain Powerbank 2000mAh ; RB401: Paper Show Bag |
| PromoBrands | New | 7 | collection_or_tag | RB1053: The Buddy Drawstring Bag ; T192FD: SeekTag Factory Direct ; T608: Sunrise Solar Speaker ; RB402: Paper Shopping Bag ; S405: The Roamer 300ml Vacuum Cup |
| PromoBrands | Sale | 7 | collection_or_tag | P126: Gallipoli Pen ; P322: Galapagos Pen ; RB1007: Non-Woven Single Wine Tote Bag ; G1200: Pivo Clear Gold Pen ; K202: Pilsner Bottle Opener |
| PromoBrands | Summer Range | 7 | collection_or_tag | OT006: Beach Towel ; OT007: Round Beach Towel ; H316: 50mL Sunscreen ; D305: Chilly Ice Bucket ; D609: Lakeside BBQ Picnic Bag |
| PromoBrands | Apparel / New | 6 | collection_or_tag | D207: Snapback Truckers Cap ; D202: Snapback Cotton Baseball Cap ; D203: Buckle Strap Denim Cotton Baseball Cap ; D204: Poly Strapback Baseball Cap ; D205: Quick-Dry Ripstop Strapback Baseball Cap |
| PromoBrands | Sale | 6 | collection_or_tag | H337: Cotton Face Masks ; K252: Floating Keychain ; K235: Pocket Ruler Magnifier with Sleeve ; T354: Galveston Gel Highlighter Set ; F144: Havana Pen |
| PromoBrands | Eco+ Collection | 4 | collection_or_tag | T520: Splash-O-Matic Reusable Water Balloon ; P091: Kikla 4 Way Eco Pen ; S850: Thunder 600ml Bottle ; D433: SunScribe Notebook (A4) |
| PromoBrands | Legendary Range / Notepads & Calenders | 4 | collection_or_tag | CL101: Magnetic Tab Calendar ; M407H: House Shaped To Do Lists ; M407T: Telephone Shaped To Do Lists ; M418: Magnetic Whiteboard To Do List |
| PromoBrands | Premium Gifting / Barware | 3 | collection_or_tag | S709: Stemless Shatterproof Champagne Glass ; S714: Stemless Shatterproof White Wine Glass ; S716: Stemless Shatterproof Red Wine Glass |
| PromoBrands | Premium Gifting / Glassware | 3 | collection_or_tag | S709: Stemless Shatterproof Champagne Glass ; S714: Stemless Shatterproof White Wine Glass ; S716: Stemless Shatterproof Red Wine Glass |
| PromoBrands | Summer Range | 3 | collection_or_tag | T470: Fold Up Flying Disc ; T813: 200mm Spyro Football ; T520: Splash-O-Matic Reusable Water Balloon |
| PromoBrands | Apparel / Yoga Range | 2 | collection_or_tag | OA023: Yoga Long Sleeve Top ; OA024: Yoga Short Sleeve Top |
| PromoBrands | New | 2 | collection_or_tag | RB1045: The Brooke Jute and Cotton Cooler Bag ; T222: Waterproof Phone Pouch |
| PromoBrands | Premium Gifting / Barware | 2 | collection_or_tag | K290: Bamboo Bottle Opener ; K109: Handa Bottle Opener |
| PromoBrands | Sale | 2 | collection_or_tag | K300: The Hefe Bottle Opener ; GY214: Slim Metal Pen |
| PromoBrands | Trending | 2 | collection_or_tag | D427: Jodha Notebook ; T520: Splash-O-Matic Reusable Water Balloon |
| PromoBrands | Home & Entertainment / New | 1 | collection_or_tag | T158: Phil's Pickle Ball Set |
| PromoBrands | Legendary Range / Magnets | 1 | collection_or_tag | M420: A3 Magnetic Whiteboard with Notepad |
| PromoBrands | Legendary Range / Notepads & Calenders | 1 | collection_or_tag | CL102: Magnetic Tab Calendar |
| PromoBrands | Pens & Writing Instruments / New | 1 | collection_or_tag | P730: Spinner Fidget Pen |
| PromoBrands | Premium Gifting / Barware | 1 | collection_or_tag | D305: Chilly Ice Bucket |
| PromoBrands | Trending | 1 | collection_or_tag | D426: Polychroma A5 Notebook |
| PromoBrands | Trending | 1 | collection_or_tag | H138: Trucker Roadhouse Cap |
| Logoline | Indent / Indent Tech Accessories | 23 | service_or_fulfillment | LN0520: Custom Wireless Charger ; LN1425: Microfibre Bean Bag Phone Chair / Cleaner ; LN605: Screen Cleaning Kit ; LN6065: Microfibre Stick Clean 30mm x 30mm ; LN6066: Microfibre Stick Clean 35mm Diameter |
| Logoline | Indent / Temporary Tattoos | 6 | service_or_fulfillment | LN15238: 152mm x 38mm Classic Temporary Tattoos ; LN3838: 38mm x 38mm Classic Temporary Tattoos ; LN3857: 38mm x 57mm  Classic Temporary Tattoos ; LN5050: 50mm x 50mm Classic Temporary Tattoos ; LN5778: 57mm x 78mm Classic Temporary Tattoos |
| Logoline | Indent / Fun & Novelty | 4 | service_or_fulfillment | LN0026: Snap Playing Cards ; LN0040: Button Bottle Opener ; LN0068: Silicone Strap Keytag ; LN0075: Woven Keytag |
| Logoline | Indent / Fitness Bands / Smart Watches | 3 | service_or_fulfillment | LN9933: Endurance Pedometer MKII ; LN9951: Mustang Sports Watch ; LN9954: Flight Smart Watch |
| Logoline | Indent / Lanyards & Office | 2 | service_or_fulfillment | LN6310: Azure Sublimated Lanyard ; LN6315: Artemis Woven Lanyard |
| Logoline | Indent / Wearables & Accessories | 2 | service_or_fulfillment | LN0065: 12mm Wide Silicone Wrist Band ; LN0072: Aluminium Offset Print Badge 25mm |
| PromoBrands | Offshore Express | 77 | service_or_fulfillment | OA034: Santa Sock Gift Tote ; OU001: Full Colour Poppins Umbrella ; OU002: Full Colour Corporate Umbrella ; S003: Magic Dress Socks ; S010: Magic Seamless Socks |
| PromoBrands | Offshore Express | 38 | service_or_fulfillment | OA029: Slides ; OA033: Pullover Hoodie ; OA013: Touch Football Singlet ; OA014: Rugby Jersey ; OA015: Rugby/AFL Shorts |
| PromoBrands | Offshore Express | 17 | service_or_fulfillment | L131.19: 19mm Custom Lanyard ; L101.13: 13mm Custom Lanyard ; L101E.10: 10mm Recycled Custom Lanyard ; L101E.13: 13mm Recycled Custom Lanyard ; L101E.19: 19mm Recycled Custom Lanyard |
| PromoBrands | Offshore Express | 3 | service_or_fulfillment | RB1025: Full-Colour Drawstring Bag ; RB1024: Full-Colour Cotton Tote Bag ; T192FD: SeekTag Factory Direct |

## Uncategorized / Blank Category Examples
| supplier | sku | product | reason |
|---|---|---|---|
| Gear For Life |  | DELETIONS | blank sku |
| Gear For Life | EGAS | Merino Arctic Scarf | blank category |
| Gear For Life | POFWGS | Festa Wine Glass Set | blank category |
| Gear For Life | VT | Vantage Top | blank category |
| Gear For Life | GJ | Gravity Jacket | blank category |
| Gear For Life | TSC | The Soho Check Shirt - Mens | blank category |
| Gear For Life | OAN(C) | Contrast Basecamp Anorak | blank category |
| Gear For Life | OASTOJ | Agri Station Tundra Oilskin Jacket | blank category |
| Gear For Life | BBYBS | Backyard Badminton Set | blank category |
| Gear For Life | OEGCP | Merino Contoured Pullover - Mens | blank category |
| Gear For Life | OEGMCI | Merino Contrast Insert Pullover - Mens | blank category |
| Gear For Life | OWEGCP | Merino Contoured Pullover - Womens | blank category |
| Gear For Life | OWEGMX | Merino Crossover Top - Womens | blank category |
| Gear For Life | PORHFP | Roadhouse Fire Pit | blank category |
| Gear For Life | TAX | The Axiom Check Shirt - Mens | blank category |
| Gear For Life | TTBL | The Two Tone Shirt - Mens | blank category |
| Gear For Life | BIO | Identity Overnight Bag | blank category |
| Gear For Life | PORT | Roll Table | blank category |
| Gear For Life | POAFP | Ambi Flame Pit | blank category |
| Gear For Life | WTFL | The Farrell Shirt - Womens | blank category |
| Gear For Life | TFL | The Farrell Shirt - Mens | blank category |
| Gear For Life | TV | The Traveller Shirt - Mens | blank category |
| Gear For Life | WMWJ | Melton Wool Ceo Jacket - Womens | blank category |
| Gear For Life | BMB | Milan Brief Bag | blank category |
| Gear For Life | BMW | Milan Weekender Bag | blank category |
| Gear For Life | BINB | Intern Brief Bag | blank category |
| Gear For Life | ODGHP | Dri Gear Hype Polo - Mens | blank category |
| Gear For Life | OTSZH | Zip Thru Hoodie – Mens | blank category |
| Gear For Life | BPMC | Parkway Music Cooler | blank category |
| Gear For Life | POHF | Hip Flask | blank category |
| Gear For Life | POKGS | Kafe Double Walled Glass Set | blank category |
| Gear For Life | POMA | Master Grill Music Apron | blank category |
| Gear For Life | TEL | The Evolution Shirt - Mens | blank category |
| Gear For Life | TMC | The Montreal Chambray Shirt - Mens | blank category |
| Gear For Life | TYS | The Yale Stripe Shirt - Mens | blank category |
| Gear For Life | WTYS | The Yale Stripe Shirt - Womens | blank category |
| Logoline | LL212 | Matador PLA Eco Pen | blank category |
| Logoline | LL2327 | Axis 30cm Wooden Ruler | blank category |
| Logoline | LL555 | Assorted Colour Lollipops | blank category |
| Logoline | LL560 | Corporate Colour Lollipops | blank category |