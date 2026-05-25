'use client';

import { useState } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const METHODS = [
  {
    name: 'Colourflex Transfer',
    description: 'Colourflex® is a CMYK+W digital print process, used for branding apparel and fabrics.',
    advantages: [
      'Ideal for producing full colour, complex images as well as approximate spot colour branding',
      'High definition, vibrant matt finish artwork suitable on a range of garment fabrics',
      'Eco-friendly water-based inks',
      'Durable, flexible branding for apparel that is machine washable with a soft-touch matt finish',
      'Efficient self-weeding technology',
      'Only one set up charge is required regardless of the number of print colours',
      'Can be shipped straight after being printed',
    ],
    limitations: [
      'Some colours cannot be reproduced including metallic and neon/fluorescent colours',
      'A thin, clear line of glue can sometimes be seen around the edges of the image',
      'Unable to print variable data',
      'Minimum detail advised at 1mm',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Apparel & Fabrics',
  },
  {
    name: 'Debossing',
    description: 'Commonly referred to as "Blind" debossing, a heated custom metal plate is pressed firmly onto the product leaving an impression of the artwork.',
    advantages: [
      'Higher perceived value than other forms of branding',
      'The branding becomes part of the product and is permanent',
      'The product can be shipped as soon as heat pressing is finished',
      'Certain products can produce a two-tone finish',
    ],
    limitations: [
      'Can be very subtle and harder to see, especially on textured materials',
      'Unable to print variable data such as individual naming',
      'Minimum line thickness: 0.4mm',
    ],
    artwork: [
      'Artwork must be supplied in editable vector format',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Premium Finish',
  },
  {
    name: 'DigiFlex Transfer',
    description: 'DigiFlex Transfer is a DTF or Direct to Film digital transfer process, used for branding apparel and fabrics.',
    advantages: [
      'More economical for short runs',
      'Ideal for personalisation and variable data, including names and numbering',
      'Eco-friendly water-based inks',
      'Durable, flexible branding for apparel that is machine washable',
      'Efficient self-weeding technology',
      'Only one set up charge is required regardless of the number of print colours',
      'Can be shipped straight after being printed',
    ],
    limitations: [
      'Some colours cannot be reproduced including metallic and neon/fluorescent colours',
      'Minimum detail advised at 1mm',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Apparel & Fabrics',
  },
  {
    name: 'Digital Label',
    description: 'Digital adhesive labels are used to brand products that cannot be branded with any other method. They are printed with a digital printing press and applied to the product.',
    advantages: [
      'Ideal for producing vivid full colour images as well as closely matched spot colour branding',
      'Can print variable data including individual names',
      'Only one set up charge is required regardless of the number of print colours',
      'Edge-to-edge branding can be achieved',
      'Can be cut to custom shapes',
    ],
    limitations: [
      'Metallic and neon/fluorescent colours are not available',
      'White print cannot be produced on clear, silver or gold stock',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'A 3mm bleed should be added to the artwork if it bleeds off the product',
    ],
    category: 'Digital',
  },
  {
    name: 'Digital Packaging Print',
    description: 'Digital Packaging Print offers a single-pass CMYK digital print onto a range of materials.',
    advantages: [
      'Ideal for producing full colour, complex images with gradients',
      'Variable data, including names, is available on select products',
      'Only one setup charge is required regardless of the number of print colours',
      'Dries instantly, so products can be shipped immediately',
      'Digital Packaging Print uses dye so there is no ink build-up',
    ],
    limitations: [
      'Some colours, including closely matched PMS, RGB, metallic and neon colours, cannot be produced',
      'Cannot print on dark coloured substrates as white ink cannot be printed underneath the artwork',
      'Edge-to-edge branding and large block colours cannot be achieved',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'Fonts should be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Digital',
  },
  {
    name: 'Digital Print',
    description: 'This production method is used for printing media such as paper, vinyl and magnetic material used in the manufacture of labels, badges, and fridge magnets etc. This printing process uses CMYK values.',
    advantages: [
      'Ideal for producing full colour, complex images with gradients',
      'Variable data including individual names is available on select products',
      'Only one set up charge is required regardless of the number of print colours',
      'Dries instantly so products can be shipped immediately',
      'Select products can be cut to custom shapes',
      'Edge-to-edge branding can be achieved on certain products',
    ],
    limitations: [
      'Metallic and neon/fluorescent colours are not available',
      'White print cannot be produced on kraft, clear, silver or gold stock',
      'Cannot print on dark coloured substrates as white ink cannot be printed underneath the artwork',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'A 3mm bleed should be added to the artwork if it bleeds off the product',
    ],
    category: 'Digital',
  },
  {
    name: 'Direct Digital',
    description: 'Direct digital printing involves the transfer of ink directly from the print heads of an inkjet machine to the product and can be used to produce both full colour and closely matched spot colour branding on flat or slightly curved surfaces.',
    advantages: [
      'Ideal for printing dark coloured products as a layer of white ink can be printed under the artwork',
      'Variable data including individual names is available on select products',
      'Dried instantly so products can be shipped immediately',
      'Offers larger print areas on many products and can print very close to the edge of flat products',
      'Only one set up charge is required regardless of the number of print colours',
    ],
    limitations: [
      'Some colours cannot be reproduced including metallic and neon/fluorescent colours',
      'The size of branding areas is limited on curved surfaces',
      'Larger print areas can be more expensive',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'A 3mm bleed must be added to the artwork if it bleeds off the product',
    ],
    category: 'Digital',
  },
  {
    name: 'Embroidery',
    description: 'Embroidery is an excellent way of branding bags, apparel, and other textile products. It offers higher perceived value and a depth of branding quality which other processes cannot match. Embroidery uses rayon thread which is stitched into the product and has a slightly raised effect.',
    advantages: [
      'Only one setup charge applies per position for up to 12 thread colours',
    ],
    limitations: [
      'Only approximate PMS colour matches are possible — threads are chosen from available options to give the closest possible match',
      'Unable to print variable data such as individual naming',
      'Metallic embroidery colours have special pricing',
    ],
    artwork: [
      'Artwork must be supplied in editable vector format',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
      'Minimum text heights: 4.5mm for Sans Serif fonts, 5.5mm for Serif fonts',
    ],
    category: 'Apparel & Fabrics',
  },
  {
    name: 'Faux Embroidery',
    description: 'Faux Embroidery is a Colourflex® Transfer with the supplied artwork digitised to create a texture and depth that mimics traditional embroidery. Suitable for branding bags, apparel and other textile products with unlimited colours.',
    advantages: [
      'Durable, flexible branding for apparel that is machine washable with a soft-touch matte finish',
      'Eco-friendly water-based inks',
      'Efficient self-weeding technology',
      'Only one set up charge is required regardless of the number of print colours',
      'Can be shipped straight after being printed',
      'Can be applied to a larger range of products and positions',
      'Results on smaller sized prints is far better than conventional embroidery',
    ],
    limitations: [
      'Pantone colour matching is not available — artwork will be matched to the closest available thread colour with a 3D shading that will affect the colour outcome',
      'Not suitable for fine details in the artwork — bold larger art is recommended',
      'As the size of the design decreases, both stitch clarity and detail resolution will be reduced',
      'Metallic colours not available',
    ],
    artwork: [
      'Vector and/or high-resolution JPEG, BITMAPS can be used',
      'Sans Serif: Min. height 4.5mm, 1.3mm thickness, and 1mm letter spacing',
      'Serif/Script: Min. height 5.5mm, 1.3mm thickness, and 1mm letter spacing',
    ],
    category: 'Apparel & Fabrics',
  },
  {
    name: 'Foil Printing',
    description: 'Foil Printing applies a metallic foil onto a flat surface using heat and pressure, utilising modern digital foiling which is more cost-effective and eliminates the need for plates or stamps. Available foil colours include Gold, Silver, and Copper.',
    advantages: [
      'Higher perceived value than other forms of branding',
      'The product can be shipped as soon as printing is finished',
      'Offers variable data such as individual naming',
      'The foil is flexible which means it is suitable for softcover notebooks',
    ],
    limitations: [
      'Detailed artwork can get lost on textured substrates',
      'Min line thickness 0.4mm for smooth substrates',
      'Min line thickness 1mm for textured substrates',
    ],
    artwork: [
      'The artwork must be supplied in vector format',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Premium Finish',
  },
  {
    name: 'Hot Stamping',
    description: 'Hot Stamping creates an indented design on the product surface using a heated custom metal plate pressed firmly onto the surface, leaving a permanent impression. Often used on materials like wood.',
    advantages: [
      'Higher perceived value than other forms of branding',
      'The branding becomes part of the product and is permanent',
      'The product can be shipped as soon as heat pressing is finished',
      'Certain products can produce a two-tone, contrasting finish',
    ],
    limitations: [
      'Unable to print variable data such as individual naming',
      'Large block artwork can produce an inconsistent print result',
      'Minimum line thickness: 0.4mm',
    ],
    artwork: [
      'The artwork must be supplied in vector format',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Premium Finish',
  },
  {
    name: 'Imitation Etch',
    description: 'Imitation etch uses a special ink to produce an etch-like effect on glass products via pad or screen print.',
    advantages: [
      'Much more affordable than real etching',
      'Can brand curved or uneven products',
      'Produces a subtle finish with a higher perceived value that looks like etching',
    ],
    limitations: [
      'Halftones cannot be consistently reproduced',
      'The size of branding areas is limited on curved surfaces',
      'Requires a curing period before the product can be shipped',
      'Unable to print variable data',
    ],
    artwork: [
      'Artwork must be supplied in a vector editable format',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Specialist',
  },
  {
    name: 'Laser Engraving',
    description: 'Laser engraving is a permanent branding process that engraves artwork into the surface of the product using a laser. Different materials produce different engraving finishes.',
    advantages: [
      'Higher perceived value than other forms of branding',
      'The branding becomes part of the surface and is permanent',
      'Large branding areas available on curved products',
      'Variable data including individual names is available on select products',
      'The product can be shipped straight away after being engraved',
    ],
    limitations: [
      'Fine detail can be lost on smaller products like pens',
    ],
    artwork: [
      'Artwork must be supplied in editable vector format',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Premium Finish',
  },
  {
    name: 'Pad Print',
    description: 'Pad printing uses a silicone pad to transfer an image to a product from a laser etched printing plate. One of the most popular and affordable ways of branding promotional products due to its ability to reproduce images on uneven or curved products.',
    advantages: [
      'Ideal for printing on curved or uneven products',
      'Prints sharp, clean images with detail as fine as 0.4mm, minimum text size is 5pt',
      'Close PMS matches are possible on white or light-coloured products',
      'Metallic gold and silver ink are available',
      'Can offer a white under base for the darker products that require it',
      'Many products can print up to 6 colours with tight multi-colour registration',
    ],
    limitations: [
      'Halftones cannot be consistently reproduced',
      'Unable to print variable data such as individual naming',
      'Close PMS matches are more difficult on darker products',
      'Some pad print inks require a curing period before the product can be shipped',
      'Each colour requires its own setup charge',
      'Neon/fluorescent colours are not available',
    ],
    artwork: [
      'Artwork must be supplied in a vector editable format',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Print',
  },
  {
    name: 'Prism Digital Print',
    description: 'Prism Digital Print is a UV-DTF (Direct to Film) process using CMYK + White + Varnish. UV inks print directly onto film that is cured by UV light, laminated and applied directly to the object like a sticker.',
    advantages: [
      'Produces vivid, full colour print with a gloss finish',
      'Long-lasting and resistant to scratching and fading',
      'Can be applied to most hard surfaces',
      'No need for heat presses or screens',
      'Ideal for personalisation and variable data, including names and numbering',
      'Efficient self-weeding technology',
      'Only one set up charge regardless of the number of print colours',
      'Can be shipped straight after printing',
    ],
    limitations: [
      'Not suitable for soft or flexible products',
      'Some colours cannot be reproduced including metallic and neon/fluorescent colours',
      'Minimum detail advised at 0.8mm',
      'Not suitable for designs with gradients that fade out to a transparency',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Digital',
  },
  {
    name: 'Resin Coated Finish',
    description: 'This CMYK branding process is produced by printing artwork onto a vinyl material with strong adhesive on the reverse. The branded area is then coated with a crystal-clear resin to form a permanent bond.',
    advantages: [
      'Ideal for producing vivid full colour images as well as closely matched spot colour branding',
      'Produces a stunning 3D effect that elevates the perceived value of a product',
      'Variable data including individual names is available on select products',
      'Edge-to-edge branding can be achieved on the resin coated area',
      'Only one set up charge is required regardless of the number of print colours',
    ],
    limitations: [
      'Larger print areas can be more expensive',
      'White, metallic gold, silver and neon colours cannot be printed',
      'The resin needs to be cured for one day before shipping the product',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'A 3mm bleed must be added to the artwork if it bleeds off the product',
    ],
    category: 'Specialist',
  },
  {
    name: 'Rotary Digital Print',
    description: 'Direct to product rotary digital printing involves the transfer of UV ink and a varnish coating from inkjet print heads to produce detailed gloss artwork using both closely matched spot colours and full colour branding.',
    advantages: [
      'Ideal for large or complex full colour gloss prints',
      'The print is dry and ready to ship as soon as the product is printed',
      'Only one setup charge is required regardless of the number of print colours',
      'No loss of print vibrancy, even on darker products',
    ],
    limitations: [
      'Production speed is limited so lead times can be longer in some cases',
      'Some colours cannot be reproduced including metallic and neon/fluorescent colours',
      'As the print does not wrap completely around the product, there is a small gap between the start and end of the print',
      'More expensive than other branding options',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Print',
  },
  {
    name: 'Rotary Screen Print',
    description: 'Rotary Screen Printing is achieved by forcing ink through a fine mesh screen with a squeegee onto the product and is ideal for cylindrical objects.',
    advantages: [
      'Large print areas are possible on cylindrical products',
      'Close PMS matches are possible on white or light-coloured products',
      'Most screen print inks are quick drying and can be shipped immediately after printing',
      'Metallic gold and silver colours are available',
      'Many products can print five colours (including white) with tight multi-colour registration',
    ],
    limitations: [
      'Close PMS matches are more difficult on darker products and will only be approximate',
      'Unable to print variable data',
      'Each colour requires its own setup charge',
    ],
    artwork: [
      'Artwork must be supplied in editable vector format',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Print',
  },
  {
    name: 'Screen Print',
    description: 'Screen Printing is achieved by forcing ink through a fine mesh screen with a squeegee onto the product and is ideal for branding flat objects.',
    advantages: [
      'Large print areas are possible on flat products',
      'Close PMS matches are possible on white or light-coloured products',
      'Most screen print inks dry quickly and can be shipped immediately after printing',
      'Fluorescent, metallic gold and silver inks are available on select textile products',
      'Many products can print with tight multi-colour registration, with some products able to be printed using up to five colours',
    ],
    limitations: [
      'Close PMS matches are more difficult on darker products and will only be approximate',
      'Unable to print variable data',
      'Each colour requires its own setup charge',
    ],
    artwork: [
      'Artwork must be supplied in editable vector format',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Print',
  },
  {
    name: 'Silicone Digital Print',
    description: 'This production method is a CMYK+W digital branding process designed specifically for silicone surfaces.',
    advantages: [
      'Provides crisp, clear, high-definition artwork',
      'Durable, flexible branding that can be hand washed',
      'Perfect for printing dark coloured products as a layer of white ink can be printed under the artwork',
      'Ideal for producing full colour images as well as approximate spot colour branding',
      'Has a matt finish and does not crack or fade with typical use of product',
      'Only one set up charge is required regardless of the number of print colours',
    ],
    limitations: [
      'Some colours cannot be reproduced including metallic and neon/fluorescent colours',
      'Unable to print variable data',
      'Minimum detail is advised to be no finer than 0.7mm',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Specialist',
  },
  {
    name: 'Sublimation Print',
    description: 'Dye sublimation print is used for branding products that have a special coating on them, or fabrics suitable for the sublimation process. A transfer is produced by printing sublimation ink onto transfer paper and then heat pressing it onto the product.',
    advantages: [
      'Sublimation ink is a dye so there is no ink build-up — the finished print is embedded in the product',
      'Ideal for producing vivid full colour images as well as closely matched spot colour branding',
      'Variable data including individual names is available on select products',
      'Edge-to-edge branding can be achieved on some products',
      'Only one set up charge is required regardless of the number of print colours',
    ],
    limitations: [
      'Can only be used on suitable products with white surfaces',
      'Some colours cannot be reproduced including white, metallic, and neon/fluorescent colours',
      'Fine detail/text may experience minor colour bleed across adjacent design elements',
    ],
    artwork: [
      'Artwork can be supplied in either vector or bitmap format',
      'Supplied bitmaps must be higher than 300DPI resolution at the actual print size',
      'A 3mm bleed must be added to the artwork if it bleeds off the product',
    ],
    category: 'Specialist',
  },
  {
    name: 'Thermo Debossing',
    description: 'Thermo debossing is only available on certain products, using additional heat to create a unique and eye-catching two-tone finish.',
    advantages: [
      'Produces a two tone finish that means it stands out',
      'Higher perceived value than other forms of branding',
      'The branding becomes part of the product and is permanent',
      'The product can be shipped as soon as heat pressing is finished',
    ],
    limitations: [
      'Unable to print variable data such as individual naming',
      'Minimum line thickness: 0.4mm',
    ],
    artwork: [
      'The artwork must be supplied in vector format',
      'Fonts are advised to be converted to outlines/objects to avoid font conflicts',
    ],
    category: 'Premium Finish',
  },
];

const CATEGORIES = ['All', 'Print', 'Digital', 'Apparel & Fabrics', 'Premium Finish', 'Specialist'];

export default function DecorationMethodsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = activeCategory === 'All' ? METHODS : METHODS.filter(m => m.category === activeCategory);

  return (
    <div style={{ background: BG, fontFamily: '"DM Sans", sans-serif', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: NAVY, padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '0 auto 32px' }} />
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 600, color: '#fff', letterSpacing: '2px', lineHeight: 1.1, margin: '0 0 16px' }}>
            Decoration Methods
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7 }}>
            We offer a wide range of branding techniques to make your logo look exceptional on every product. Explore each method to find the best fit for your brief.
          </p>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '32px auto 0' }} />
        </div>
      </div>

      {/* FILTER */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '20px 40px', position: 'sticky', top: '56px', zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ padding: '8px 20px', borderRadius: '20px', border: `1.5px solid ${activeCategory === cat ? NAVY : '#E0DDD7'}`, background: activeCategory === cat ? NAVY : '#fff', color: activeCategory === cat ? '#fff' : '#5A5A5A', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', transition: 'all 0.15s' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* METHODS */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '20px' }}>
          {filtered.map(method => (
            <div key={method.name}
              style={{ background: '#fff', border: `1.5px solid ${expanded === method.name ? GOLD : '#E0DDD7'}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>

              {/* Header */}
              <button onClick={() => setExpanded(expanded === method.name ? null : method.name)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px', fontFamily: '"DM Sans", sans-serif' }}>
                    {method.category}
                  </div>
                  <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '22px', fontWeight: 600, color: NAVY }}>
                    {method.name}
                  </div>
                </div>
                <span style={{ fontSize: '20px', color: GOLD, flexShrink: 0, marginLeft: '16px' }}>
                  {expanded === method.name ? '−' : '+'}
                </span>
              </button>

              {/* Description always visible */}
              <div style={{ padding: '0 24px 20px', borderTop: '1px solid #F0EEED' }}>
                <p style={{ fontSize: '14px', color: '#5A5A5A', lineHeight: 1.8, margin: '16px 0 0' }}>
                  {method.description}
                </p>
              </div>

              {/* Expanded content */}
              {expanded === method.name && (
                <div style={{ padding: '0 24px 24px', borderTop: '1px solid #F0EEED' }}>

                  <div style={{ marginTop: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#2D6A4F', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>✓ Advantages</div>
                    {method.advantages.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2D6A4F', marginTop: '7px', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', color: '#3A3A3A', lineHeight: 1.7 }}>{a}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>✗ Limitations</div>
                    {method.limitations.map((l, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C0392B', marginTop: '7px', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', color: '#3A3A3A', lineHeight: 1.7 }}>{l}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '20px', background: '#F8F7F4', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>📐 Artwork Requirements</div>
                    {method.artwork.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: NAVY, marginTop: '7px', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', color: '#3A3A3A', lineHeight: 1.7 }}>{a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '36px', color: '#fff', marginBottom: '16px' }}>
            Not sure which method is right for you?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px' }}>
            Our team is happy to advise on the best branding option for your product and budget.
          </p>
          <a href="/contact" style={{ display: 'inline-block', background: GOLD, color: '#fff', padding: '16px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
