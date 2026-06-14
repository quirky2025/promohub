# Supplier Category Mappings DRAFT

Generated from `supplier_raw_category_inventory.csv`. This is a first-pass mapping draft, not an import approval file.

## Coverage

| status | raw paths | SKU-path count |
|---|---:|---:|
| auto_mapped | 340 | 2319 |
| needs_review | 167 | 1637 |
| collection_or_tag | 17 | 278 |
| fulfillment_service | 10 | 175 |

## By Supplier

| supplier | auto_mapped | needs_review | collection_or_tag | fulfillment_service |
|---|---:|---:|---:|---:|
| Gear For Life | 40 | 10 | 0 | 0 |
| Logoline | 115 | 37 | 1 | 6 |
| NIConcept | 4 | 9 | 0 | 0 |
| PromoBrands | 181 | 111 | 16 | 4 |

## Highest Priority Review Rows

| supplier | raw category path | SKU count | status | reason | suggested target | examples |
|---|---|---:|---|---|---|---|
| NIConcept | Bags | 252 | needs_review | bag category too broad | Bags | 119526: Mumbay Cotton Pocket Jute Tote Bag 19L ; 120120: Peek Drawstring Backpack ; 120191: Graphite Slim 15" 17L Laptop Backpack ; 120768: Swift GRS Recycled Toiletry Bag Set ; 130096: Byron 14" GRS Recycled City Laptop Backpack 16L |
| NIConcept | Apparel | 143 | needs_review | apparel/headwear category too broad | - | 111053: Level Beanie - Unisex ; 38341: Heracles Bandana ; TKC1001: Trekk Austin Organic Washed Cotton Cap ; TKC1002: Trekk Alliance Organic Cotton Twill Cap ; TKC1003: Trekk Falcon Flex Cap |
| NIConcept | Drinkware | 141 | needs_review | supplier category too broad | Drinkware | 100002: Oregon 400ml Sport Bottle w/ Carabiner ; 100836: Alti 630 ml RCS Recycled Plastic Water Bottle ; 113349: Seasons Gaudie Recycled Stainless Steel Cocktail Shaker ; 1414: Glass Coffee & Tea Set 300ml ; 1626-60: Reusable Stainless Steel Straw Set w/ Brush |
| NIConcept | Office | 131 | needs_review | office category too broad | - | 1015-18: Drake Ballpoint ; 1026PEN: Geometric Ballpoint Pen ; 1055-32: Geneva Ballpoint ; 1066: Recycled Stainless Steel Ballpoint Pen ; 1066-49: Bamboo Quick-Dry Gel Ballpoint |
| NIConcept | Outdoor & Leisure | 104 | needs_review | outdoor/leisure category too broad | - | 1026-08: Aluminium Identification Tag ; 1033-94: Bamboo Fibre Cutlery Set ; 104493: Liam 5 Metre Measuring Tape ; 109064: Trav 21.5" Foldable Auto Marksman Umbrella ; 113211: Seasons Nordkapp Waitress Knife |
| NIConcept | Technology | 33 | needs_review | technology category too broad | Technology | 134264: Freal Wireless Charging Pad, White/Solid Black ; 1427: Dual Car Charger ; 2PA145: Prixton TWS158 ENC and ANC earbuds ; 2PA152: Prixton TWS159 ENC and ANC earbuds ; 6165: USB Smart Charger |
| Logoline | Packs & Gifting / Celebrate & Gift | 31 | needs_review | gift set / premium grouping not in primary taxonomy | - | LL8231: The Classic Pairing ; LL8233: The Warm Welcome ; LL8313: The Happy Hour ; LL8315: The Host Edit ; LL8317: The Carry-On Graze |
| PromoBrands | Outdoor & Leisure / Toys & Games | 31 | needs_review | outdoor/leisure category too broad | - | T156: Skittle Throw ; NP142: Squiggle Crayon Set ; PT101: Plush Kangaroo ; PT102: Plush Koala ; PT103: Plush Puppy |
| PromoBrands | Outdoor & Leisure / Toys & Games | 29 | needs_review | outdoor/leisure category too broad | - | T471: Silicon Frisbee ; T155: Stacking Puzzle Set with Pouch ; NP162: Cap Gun ; T475: Football Rocket ; T851: LED Light Up Yo-Yos |
| NIConcept | Health & Personal | 27 | needs_review | personal care category too broad | Personal Care | 124263: Kubi Phone Lanyard ; 126376: Glider Slider Makeup Mirror ; 126381: Beautix Manicure Set ; 1342: Portable First Aid Kit ; 1343: Weekly Pill Organiser |
| PromoBrands | Apparel / Sublimated Apparel | 27 | needs_review | teamwear is SEO/filter page | Apparel | OA029: Slides ; OA033: Pullover Hoodie ; OA013: Touch Football Singlet ; OA014: Rugby Jersey ; OA015: Rugby/AFL Shorts |
| Logoline | Drinkware / Drinkware Accessories | 26 | needs_review | accessory subtype may need product-name review | Barware & Accessories > Bar Accessories | LL0980: Cosy Stainless Steel Drink Cooler ; LL201: Skol Bottle Opener / Keytag ; LL2014: Evergreen Straw Set ; LL2019: Buzz Paper Straws ; LL207: Spinner Bottle Opener |
| PromoBrands | Australian Made / Mouse & Counter Mats | 24 | needs_review | no confident rule matched | - | C1A: Deluxe Coaster (3mm) ; C1B: Deluxe Coaster (1mm) ; MM102A: Deluxe Mouse Mat (230mm x 190mm) ; MM102C: Deluxe Mouse Mat (230mm x 190mm) ; MM102B: Deluxe Mouse Mat (205mm x 145mm) |
| Logoline | Technology / Gift Sets | 23 | needs_review | technology category too broad | Technology | LL8211: Symphony Gift Set ; LL8212: Destiny Gift Set ; LL8214: Alliance Gift Set ; LL8215: Bellman Gift Set ; LL8218: Ohana Gift Set |
| NIConcept | Giftsets | 22 | needs_review | gift set / premium grouping not in primary taxonomy | - | 8988: Plain Cufflinks ; 9096: Pineapple Leather Travel Gift Set ; GIFT1006: Gift Set w/ 9196 Journal & 4101 Nash Pen ; GIFT1007: Gift Set w/ JB1001 Journal & Nash Pen ; GIFT1010: Gift Set w/ JB1008 Nova Journal & 6018 Gorcia Pen |
| PromoBrands | Tradeshow | 21 | needs_review | no confident rule matched | - | L101.13: 13mm Custom Lanyard ; L101E.10: 10mm Recycled Custom Lanyard ; L101E.13: 13mm Recycled Custom Lanyard ; L101E.19: 19mm Recycled Custom Lanyard ; L102.13: 13mm Shoestring Custom Lanyard |
| PromoBrands | New | 17 | needs_review | no confident rule matched | - | S881: The Bondi 700ml Drinking Bottle ; T239: The Power Band Charging Lanyard - 60W ; T524: The Spinzy ; H451: Pac-Man Lunch Box with Handle ; T527: The Amazing Fidget |
| PromoBrands | Drinkware / Metal | 15 | needs_review | supplier category too broad | Drinkware | S937: Vita Aluminium 450ml Water Bottle ; S889: Shadow 500ml Water Bottle ; S900: Allegra 1L Bottle ; S901: Allegra 750ml Bottle ; S819: Classic 500ml Water Bottle |
| PromoBrands | Drinkware / Plastic | 14 | needs_review | supplier category too broad | Drinkware | NP135: Quencher 700ml Plastic Water Bottle ; S733: Lakeland 600ml Tritan Insulated Water Bottle ; S622: San Celemente 740ml Tritan Water Bottle ; S726: Sparta 500ml Tritan Water Bottle ; S624: 3 in 1 400ml Shaker Cup |
| PromoBrands | Outdoor & Leisure / Travel & Personal Accessories | 14 | needs_review | outdoor/leisure category too broad | - | FD400.MTO: Universal Magnetic Car Mount ; FD405.MTO: Universal Magnetic Car Mount ; SW101: Branded Silicone Wristband ; J619: Riveria Sunglasses ; J620: Retro Sunglasses |
| Gear For Life | Clothing / Merino | 13 | needs_review | apparel/headwear category too broad | - | EGMDP: Merino Detailed Vee Pullover - Mens ; EGMFV: Merino Fully Fashioned Vest - Mens ; EGMSP: Merino Short Sleeve Polo - Mens ; EGMZ: Merino Zip Pullover - Mens ; WEGMCD: Merino Cardigan - Womens |
| PromoBrands | Back to University | 13 | needs_review | no confident rule matched | - | S895: Sunrise Smoothie 500mL Tumbler ; S146: Digital Galilee 443mL Tumbler ; S777: Byron 1L Drink Bottle ; D427: Jodha Notebook ; T853: Rhodes Power Bank (10,000 mAh) |
| Logoline | Office / Gift Sets | 12 | needs_review | office category too broad | - | LL6002: Back To School Pack ; LL6014: Encore Office Pack ; LL6020: Bravo Pack ; LL6027: Wellbeing Pack ; LL8241: Harmony Gift Set |
| PromoBrands | Health & Wellness / Microfiber Cloths | 12 | needs_review | personal care category too broad | Personal Care | K925: Micro Fibre Pouch & Cloth ; K817: Micro Fibre iPad Pouch ; K818: Micro Fibre Backpack ; K821: Mini Micro Fibre Cloth ; K822: Medium Micro Fibre Cloth |
| Logoline | Bags / Pouches & Utility Cases | 11 | needs_review | bag category too broad | Bags | LL4559: Montana RPET Felt Sunglass Pouch ; LL517: Harvest Produce Bags in Pouch ; LL524: Byron Mesh Produce Bag ; LL545: Malibu Handy Utility  Pouch ; LL7027: Montana RPET Felt Satchel |
| Logoline | Technology / Earphones | 11 | needs_review | technology category too broad | Technology | LL0100: Thump Earbud Set ; LL6150: Forte Earbud Set ; LL6151: Zen Retractable Earbuds / Headphones ; LL6154: Soprano Earbud Set ; LL6156: Venom Earbud Set |
| PromoBrands | Home & Entertainment / Cheeseboards & Serveware | 11 | needs_review | no confident rule matched | - | B108: Ozi Bamboo Paddle Board ; B109: Trey Bamboo Cutting Board ; B110: Obilia Bamboo Chopping Board ; B111: Tiga Bamboo Cutting Board ; B125: Adair Bamboo Cutlery Set |
| Logoline | Lifestyle / Gift Sets | 10 | needs_review | gift set / premium grouping not in primary taxonomy | - | LL6000: Summer Beach Pack ; LL6004: Gold Coast Pack ; LL6011: Bondi Beach Kit ; LL6012: Coogee Beach Kit ; LL8288: Adventure Pack |
| Logoline | Personal / Anti Bacterial | 10 | needs_review | personal care category too broad | Personal Care | LL3027: H2O Wet Wipes ; LL4651: Lancer Liquid Hand Sanitiser Stick ; LL4659: Aqua Wet Wipes ; LL4673: Breezy Gel Hand Sanitiser ; LL4675: Polar Hand Sanitiser |
| Logoline | Technology / Fitness Bands / Smart Watches | 10 | needs_review | technology category too broad | Technology | LN9928: Seekfit Fitness Band ; LN9929: Stride Pedometer Bracelet 2.0 ; LN9932: Endurance Pedometer ; LN9934: Touchdown Pedometer ; LN9935: Lightning Pedometer |
| NIConcept | Hampers | 9 | needs_review | gift set / premium grouping not in primary taxonomy | - | HAM1001: The Custom Gourmet Entertainer Set ; HAM1002: The Prestige Custom Gourmet Nibbles Gift Pack ; HAM1003: The Branded Gourmet Picnic Gift Pack ; HAM1004: The Gourmet Retreat Gift Pack ; HAM1005: Custom Sweet Treats & Essentials Gift Pack |
| PromoBrands | Drinkware / Metal | 9 | needs_review | supplier category too broad | Drinkware | S960M: Java Drop (350mL) ; D315: Midas 600ml Bottle ; D112: Aland 600ml Aluminum Water Bottle ; S703: La Jolla 700ml Water Bottle ; S965: Thermo 500ml Vacuum Flask |
| Gear For Life | Clothing / Pullovers | 8 | needs_review | apparel/headwear category too broad | - | ASBJ: Agri Station Boundary Jersey ; BT: Ballistic Top ; DGRFZ: Dri Gear Reflex Zip Pullover ; DGRFZ(Y): Youth Dri Gear Reflex Zip Pullover ; TNT: Transition Top |
| Logoline | Lifestyle / Wearables | 8 | needs_review | no confident rule matched | - | LL1799: Hurricane Poncho ; LL1822: Sizzle Foam Visor ; LL4560: Horizon Sunglasses ; LL4562: Bamboo Sunglasses ; LL7045: Trinity Recycled Cotton Apron |
| PromoBrands | Australian Made | 8 | needs_review | no confident rule matched | - | M408B: Magnetic Whiteboard (210mm x 297mm) ; M408C: Magnetic Whiteboard (297mm x 420mm) ; M407H: House Shaped To Do Lists ; M407T: Telephone Shaped To Do Lists ; M407: Rectangle To Do Lists |
| PromoBrands | Australian Made / Notepads & Calenders | 8 | needs_review | no confident rule matched | - | PP102: A4 Note pad (25 leaves per pad) ; PP102A: A4 Note pad (50 leaves per pad) ; PP101: A5 Note pad (25 leaves per pad) ; PP101A: A5 Note Pad (50 leaves per pad) ; PP103: A3 Note pad (25 leaves per pad) |
| Gear For Life | Clothing / Singlets | 7 | needs_review | apparel/headwear category too broad | - | ODGSS: Dri Gear Spliced Zenith Singlet - Mens ; OWDGSS: Dri Gear Spliced Zenith Singlet - Womens ; OYDGSS: Youth Dri Gear Spliced Zenith Singlet ; ODGS(P): Dri Gear Plain Singlet - Mens ; OWDGS(P): Dri Gear Plain Singlet - Womens |
| Logoline | Drinkware / Gift Sets | 7 | needs_review | supplier category too broad | Drinkware | LL2230: Elite Gift Set with Hip Flask ; LL8292: Eco Pack ; LL8293: Exec Gift Pack ; LL8294: Espresso Coffee Cup and Speaker Pack ; LL8300: Picnic Pack |
| Logoline | Lifestyle / Bat & Balls | 7 | needs_review | no confident rule matched | - | LL3011: Hi Bounce Tennis Ball ; LL3012: Hi Bounce Soccer Ball ; LL3013: Hi Bounce Basketball ; LL3014: Hi Bounce Ball ; LL3111: Pickleball Set |
| Logoline | Lifestyle / Outdoors | 7 | needs_review | outdoor/leisure category too broad | - | LL4385: Foldable Camp Light ; LL4961: Vision Sports Towel ; LL8356: Marlin Folding Chair ; LL8360: Panama Leisure Mat ; LL8365: Leisure Picnic Blanket |
| PromoBrands | Apparel / Sublimated Towels | 7 | needs_review | apparel/headwear category too broad | - | OT001: Face Washer ; OT002: Gym Towel ; OT003: Hand Towel ; OT004: Bath Towel ; OT005: Bath Sheet |
| PromoBrands | Back to University | 7 | needs_review | no confident rule matched | - | T558: Bambu Phone Holder ; RB1018C: Colourful Calico Tote Bag ; TCS20W: Tebogo 20W fast charge adapter ; RB001: Bowles Laptop Sleeve ; D830: Dusty RPET Duffle Bag |
| PromoBrands | Bags / Food Storage | 7 | needs_review | bag category too broad | Bags | RB1035: Insulated Grocery Bag ; RB1033: Lunch-Time Cooler Bag ; RB1030: Goliath Insulated Grocery Tote ; RB1014: 6-Can Cooler Bag ; B102: PEVA Reusable Food Storage Bag (21.5cm x 12cm) |
| PromoBrands | Navy Products | 7 | needs_review | no confident rule matched | - | H907: 10L Dry Bag ; S901: Allegra 750ml Bottle ; S899: Voyager 600ml Bottle ; S999: The Sanny Tumbler 320ml ; S777: Byron 1L Drink Bottle |
| PromoBrands | New | 7 | needs_review | no confident rule matched | - | JT148: The Barker Eco Notebook - B6 ; S922: The Maxwell 330ml Ceramic Mug ; T165: The Felix Foldable Phone Stand ; T856: Neo Keychain Powerbank 2000mAh ; RB401: Paper Show Bag |
| PromoBrands | New | 7 | needs_review | no confident rule matched | - | RB1053: The Buddy Drawstring Bag ; T192FD: SeekTag Factory Direct ; T608: Sunrise Solar Speaker ; RB402: Paper Shopping Bag ; S405: The Roamer 300ml Vacuum Cup |
| Gear For Life | Clothing / Fleece | 6 | needs_review | apparel/headwear category too broad | - | DET: Youth Detailed Polar Fleece Pullover ; DET(Y): Detailed Polar Fleece Pullover ; EMJ: Explorer Microfleece Jacket ; IPJ: Ice Vista Jacket - Mens ; OIPV: Ice Vista Vest - Mens |
| Gear For Life | Leisure & Outdoors | 6 | needs_review | outdoor/leisure category too broad | - | PODIGB: Dig It Garden Box ; POTT: Tavolo Table ; POLTT: Lungo Tavolo Table ; POOMTT: Ombrello Tavolo Table ; PONS: Nature Secateurs |
| Logoline | Bags / Colour-In Bags | 6 | needs_review | bag category too broad | Bags | LL531: Get Crafty Folding Calico Bag and Crayons ; LL5520: Colouring Short Handle Cotton Bag & Crayons ; LL5521: Colouring Long Handle Cotton Bag & Crayons ; LL5522: Colouring Short Handle Calico Bag & Crayons ; LL5523: Colouring Short Handle Cotton Bag & Pencils |
| Logoline | Packaging / Misc Packaging | 6 | needs_review | no confident rule matched | - | LL3148: Plastic Container ; LL321: Silver Rectangular Tin ; LL326: Clear Pillow Pack ; LL340: Silver Round Tin ; LL4870: Clear Dispenser with Scoop |
| PromoBrands | Apparel / New | 6 | needs_review | apparel/headwear category too broad | - | D207: Snapback Truckers Cap ; D202: Snapback Cotton Baseball Cap ; D203: Buckle Strap Denim Cotton Baseball Cap ; D204: Poly Strapback Baseball Cap ; D205: Quick-Dry Ripstop Strapback Baseball Cap |
| PromoBrands | Bags / Grocery | 6 | needs_review | bag category too broad | Bags | RB1032: Clear Tote Bag ; RB1017: Shopping Tote Bag with Gusset ; RB1008: Large Shopping Tote Bag with Gusset ; RB1022: Stadium Tote Bag ; RB1015: Shopping Tote Bag |
| PromoBrands | Home & Entertainment / Cheeseboards & Serveware | 6 | needs_review | no confident rule matched | - | K288: Bamboo Bottle Opener ; D393: Glencoe Solo Cheeseboard ; D388: St. Andrews Magnetic Cheeseboard and Knife Set ; D161: Besancon Salt and Pepper Set ; D163: Acacia Cheeseboard & Knife Set |
| PromoBrands | Drinkware / Hydrosoul | 5 | needs_review | supplier category too broad | Drinkware | S889: Shadow 500ml Water Bottle ; S819: Classic 500ml Water Bottle ; S935: Zen Mirror Finish Mugs (350mL) ; S936: Calm Cup (230mL) ; S936W: Ecograin Mirror Finish 230mL Calm Cup |
| PromoBrands | Health & Wellness / Personal Care | 5 | needs_review | personal care category too broad | Personal Care | A1500: Mall Manicure set ; A1501: Bamboo Paddle Nail File ; K490: Doctor Pill Box ; K491: Rainbow Pill Tube ; M200: The Ego Pocket Mirror |
| PromoBrands | Navy Products | 5 | needs_review | no confident rule matched | - | S939: Dundee Stubby Cooler ; RB1018RC: Recycled Colourful Cotton Tote Bag ; H450: Double Stack RPP Lunch Box ; S912: Nomad 600ml Double Wall Mug ; RB1044: Century Canvas Tote Bag |
| PromoBrands | Outdoor & Leisure / Survival | 5 | needs_review | outdoor/leisure category too broad | - | H906: 5L Dry Bag ; H907: 10L Dry Bag ; H905: 2.5L Dry Bag ; H908: 2.5L Dry Bag ; JT122: Koda Survival Notebook (Blank Pages) |
| PromoBrands | Outdoor & Leisure / Toys & Games | 5 | needs_review | outdoor/leisure category too broad | - | RB1018S: Squiggle Calico bag + Crayon set ; RB1019S: Squiggle Calico bag + Crayon set ; RB1020S: Squiggle Calico Drawstring Bag + Crayon set ; T158: Phil's Pickle Ball Set ; T517: Popper Stress Reliever Key Chain |
| PromoBrands | Outdoor & Leisure / Travel & Personal Accessories | 5 | needs_review | outdoor/leisure category too broad | - | L804: Imprinted Mini Luggage Tag ; L806: Imprinted Large Luggage Tag ; B113: CRETE Traveller Carrying Case ; T874: Magnetic 900mAh Type C Rechargeable Fan ; T108: Olympic Massage Gun |
| Gear For Life | Home & Living / Miscellaneous Homeware | 4 | needs_review | no confident rule matched | - | PODCS: Decadent Cocktail 10 pcs Set ; POEB: Event Ice Bucket ; POGTT: Grande Tavolo Table ; PORC: Retro Cooler Box |
| Logoline | Bags / Non Woven Bags | 4 | needs_review | bag category too broad | Bags | LL539: Cairo Non Woven Bag - Recycled PET ; LL546: Paris Non Woven Bag ; LN538: Geneva Non Woven Bag ; LN541: Boston Non Woven Bag |
| Logoline | Lifestyle / Fans | 4 | needs_review | no confident rule matched | - | LL4408: Heatwave Fan ; LL4409: Sirocco Fan ; LL8038: Blast Fan ; LN8040: Breeze Fan |
| Logoline | Technology / Mouse Pads | 4 | needs_review | technology category too broad | Technology | LL0199: Tasktamer Desk Mat ; LL0201: Avatar Desk Mat ; LL0205: Console XL Mouse Mat ; LL0217: Hover Wireless Charger / Mouse Pad |
| PromoBrands | Australian Made / Ideas | 4 | needs_review | no confident rule matched | - | HCI101: Sun Visors ; HCI107: Door Hanger ; HCI107A: Double Sided Door Hanger ; HCI106A: Rulers |
| PromoBrands | Bags / Grocery | 4 | needs_review | bag category too broad | Bags | B102: PEVA Reusable Food Storage Bag (21.5cm x 12cm) ; B103: PEVA Reusable Food Storage Bag (215mm x 180mm) ; B104: PEVA Reusable Food Storage Bag (260mm x 200mm) ; RB1031: Metro Recycled PET Bag |
| PromoBrands | Drinkware / Mirror Finish | 4 | needs_review | supplier category too broad | Drinkware | S819: Classic 500ml Water Bottle ; S935: Zen Mirror Finish Mugs (350mL) ; S936: Calm Cup (230mL) ; S936W: Ecograin Mirror Finish 230mL Calm Cup |
| PromoBrands | Essential & PPE Products | 4 | needs_review | no confident rule matched | - | H337: Cotton Face Masks ; H746FD: Custom Neck Gaiter ; NP165: Soapy ; NP165soapyrefill: Soapy Refill Sleeves |
| PromoBrands | Essential & PPE Products / Safety | 4 | needs_review | no confident rule matched | - | K228: Silicone Earplug Keychain ; H680: First Aid Travel Kit - 22 Piece ; H673: Summit Kit ; K292: Vivace Bandage Dispenser |
| PromoBrands | Legendary Range / Notepads & Calenders | 4 | needs_review | no confident rule matched | - | CL101: Magnetic Tab Calendar ; M407H: House Shaped To Do Lists ; M407T: Telephone Shaped To Do Lists ; M418: Magnetic Whiteboard To Do List |
| PromoBrands | Navy Products | 4 | needs_review | no confident rule matched | - | S940: Wanderer 354ml Tumbler ; RB1040: Rara Cooler Bag ; S990: Arlo 1L Glass Water Bottle ; S403: Pacino Recycled PP 350mL Coffee Mug |
| PromoBrands | Office / Executive Gifts & Sets | 4 | needs_review | office category too broad | - | F902: Bullet Pen ; F500: Slim Pen ; F501: Bloa Pen ; F502: Skil Pen |
| PromoBrands | Outdoor & Leisure / Survival | 4 | needs_review | outdoor/leisure category too broad | - | T676: Easy Grip Retractable Utility Knife ; H316: 50mL Sunscreen ; FA112: 30pc First Aid Kit ; H820: Fiberglass Emergency Fire Blanket |
| Gear For Life | Clothing / Wool | 3 | needs_review | apparel/headwear category too broad | - | OWEGMCI: Merino Contrast Insert Pullover – Womens ; OEGMC: Merino Crew Pullover - Mens ; OWEGMV: Merino Vest - Womens |
| Gear For Life | Leisure & Outdoors / Coolers | 3 | needs_review | outdoor/leisure category too broad | - | POPIB: Polar Ice 7.2L Bucket ; POVCB: Vintage Cooler Box ; IGOISB: On-Ice 21L Sound Box |
| Logoline | Bags / Bamboo Bags / 100gsm,100gsm | 3 | needs_review | bag category too broad | Bags | LL514: Short Handle Bamboo Bag ; LL515: Long Handle Bamboo Bag ; LL516: Giant Bamboo Bag |
| Logoline | Personal / Pill Boxes | 3 | needs_review | personal care category too broad | Personal Care | LL2004: Clear Rectangular 6 Compartment Pill Box ; LL3873: Weekly Pill Box ; LL3875: Compact Pill Organiser |
| PromoBrands | Australian Made / Mouse & Counter Mats | 3 | needs_review | no confident rule matched | - | BR2: Mini Bar Runner ; BR1: Premium Bar Runner ; AM1: Admats |
| PromoBrands | Back to University | 3 | needs_review | no confident rule matched | - | D605.R: ECO NOVA Computer Backpack ; T854: Kabul Power Bank (10,000 mAh) ; D429: PlanetScribe RPET A5 Notebook |
| PromoBrands | Bags / Grocery | 3 | needs_review | bag category too broad | Bags | RB1035: Insulated Grocery Bag ; RB1033: Lunch-Time Cooler Bag ; RB1030: Goliath Insulated Grocery Tote |
| PromoBrands | Drinkware / Plastic | 3 | needs_review | supplier category too broad | Drinkware | S896: Organic 650ml Bottle ; S627: Power 600ml Shaker Cup ; S881: The Bondi 700ml Drinking Bottle |

## Notes

- F/filter pages are not used as product primary subcategory targets. Metal/Plastic Pens, Eco Pens, Cotton Tote Bags, Workwear and Teamwear become attributes/tags plus a P subcategory.
- PromoBrands collection/service paths such as Sale, Trending, Eco+ Collection, Legendary Range and Offshore Express are marked as collection/tag or fulfillment signals.
- NIConcept broad paths such as Apparel, Office, Outdoor & Leisure, Technology and Games & Novelty need product-name keyword rules before import.
- This draft is intentionally conservative. Any `needs_review` row should be resolved before generating import rules.