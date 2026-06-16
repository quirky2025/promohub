'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'quirkypromo:mto-products:v1';

const EMPTY_PRODUCT = {
  id: '',
  status: 'active',
  sku: '',
  name: '',
  category: '',
  factoryId: '',
  factoryName: '',
  factorySku: '',
  moq: '',
  targetUse: '',
  specs: '',
  material: '',
  dimensions: '',
  colours: '',
  packaging: '',
  availableColours: [],
  decorationOptions: '',
  brandingOptions: [],
  logoRequirements: '',
  specRows: [],
  unitsPerCarton: '',
  cartonLengthCm: '',
  cartonWidthCm: '',
  cartonHeightCm: '',
  grossWeightKgPerCarton: '',
  productionLeadTime: '',
  sampleInfo: '',
  documentsSupported: '',
  complianceNotes: '',
  publicPositioning: '',
  frontEndTags: '',
  internalNotes: '',
  createdAt: '',
  updatedAt: '',
};

const EMPTY_COLOUR = {
  name: '',
  supplierColour: '',
  pms: '',
  hex: '',
  notes: '',
};

const EMPTY_BRANDING = {
  method: '',
  maxSize: '',
  position: '',
  colourLimit: '',
  templateUrl: '',
  notes: '',
};

const EMPTY_SPEC = {
  name: '',
  description: '',
};

const NOTEBOOK_SPECS = [
  ['Cover Type', 'Soft'],
  ['Bookmark Ribbon', 'Yes'],
  ['Size', 'Medium / A5 approx.'],
  ['Material Note', 'Cover material and texture variation to be confirmed from supplier sample.'],
  ['Page Colour', 'Cream'],
  ['Page Edges', 'Rounded'],
  ['Binding Method', 'Case'],
  ['Leaves', '80'],
  ['Page Weight', '70gsm'],
  ['Approx. Cover Thickness', '1mm'],
  ['Page Design', 'Lined'],
  ['Closure Method', 'Elastic Band'],
  ['Packaging', 'Individual paper sleeve'],
  ['Country of Origin', 'China'],
].map(([name, description]) => ({ name, description }));

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `mto-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayIso() {
  return new Date().toISOString();
}

function loadProducts() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeProducts(products) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

const API_URL = '/api/admin/sourcing/products';

async function apiList() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('api-unavailable');
  const data = await res.json();
  return data.products || [];
}

async function apiSave(product) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Save failed.');
  return data.product;
}

async function apiDelete(id) {
  const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Delete failed.');
  }
}

function packingLabel(product) {
  const carton = product.unitsPerCarton ? `${product.unitsPerCarton}/ctn` : '';
  const size = [product.cartonLengthCm, product.cartonWidthCm, product.cartonHeightCm].filter(Boolean).join(' x ');
  const weight = product.grossWeightKgPerCarton ? `${product.grossWeightKgPerCarton}kg` : '';
  return [carton, size ? `${size}cm` : '', weight].filter(Boolean).join(' / ') || '-';
}

function specRowsText(product) {
  return (product.specRows || [])
    .filter((row) => row.name || row.description)
    .map((row) => `${row.name}: ${row.description}`)
    .join(' ');
}

function colourRowsText(product) {
  return (product.availableColours || [])
    .filter((row) => row.name || row.pms || row.supplierColour)
    .map((row) => [row.name, row.supplierColour, row.pms].filter(Boolean).join(' '))
    .join(' ');
}

function brandingRowsText(product) {
  return (product.brandingOptions || [])
    .filter((row) => row.method || row.maxSize || row.position)
    .map((row) => [row.method, row.maxSize, row.position].filter(Boolean).join(' '))
    .join(' ');
}

function searchText(product) {
  return [
    product.name,
    product.sku,
    product.category,
    product.factoryName,
    product.specs,
    specRowsText(product),
    product.material,
    product.dimensions,
    product.packaging,
    product.frontEndTags,
    colourRowsText(product),
    brandingRowsText(product),
  ].filter(Boolean).join(' ').toLowerCase();
}

export default function MadeToOrderProductsPage() {
  const [products, setProducts] = useState([]);
  const [factories, setFactories] = useState([]);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [storageMode, setStorageMode] = useState('local');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiList()
      .then((list) => {
        if (cancelled) return;
        setProducts(list);
        setStorageMode('db');
      })
      .catch(() => {
        if (cancelled) return;
        setProducts(loadProducts());
        setStorageMode('local');
      });
    fetch('/api/admin/sourcing/factories')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setFactories(data.factories || []);
      })
      .catch(() => {
        if (!cancelled) setFactories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) => searchText(product).includes(q));
  }, [products, query]);

  function update(key, value) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === 'factoryId') {
        const factory = factories.find((row) => row.id === value);
        next.factoryName = factory?.name || '';
      }
      return next;
    });
  }

  function updateRow(collection, index, key, value) {
    setForm((current) => ({
      ...current,
      [collection]: (current[collection] || []).map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row
      ),
    }));
  }

  function addRow(collection, emptyRow) {
    setForm((current) => ({
      ...current,
      [collection]: [...(current[collection] || []), { ...emptyRow }],
    }));
  }

  function removeRow(collection, index) {
    setForm((current) => ({
      ...current,
      [collection]: (current[collection] || []).filter((_, rowIndex) => rowIndex !== index),
    }));
  }

  function applyNotebookTemplate() {
    setForm((current) => ({
      ...current,
      category: current.category || 'Notebooks',
      specs: current.specs || 'Made-to-order notebook. Confirm exact cover, page, binding, and packaging details with factory quote.',
      material: current.material || 'Cover and page material to be confirmed',
      dimensions: current.dimensions || 'A5 approx. / custom size available',
      colours: current.colours || 'Supplier colour card / PMS matched options',
      packaging: current.packaging || 'Individual kraft sleeve / packaging to be confirmed',
      decorationOptions: current.decorationOptions || 'Deboss, foil, screen print, pad print',
      logoRequirements: current.logoRequirements || 'Confirm branding method, max branding area, position, and PMS colours before quote.',
      specRows: (current.specRows || []).length ? current.specRows : NOTEBOOK_SPECS,
      brandingOptions: (current.brandingOptions || []).length
        ? current.brandingOptions
        : [
            { method: 'Deboss', maxSize: '', position: 'Front cover', colourLimit: 'Blind deboss', templateUrl: '', notes: 'Max size to be confirmed from supplier template.' },
            { method: 'Screen Print', maxSize: '', position: 'Front cover', colourLimit: 'One colour / PMS', templateUrl: '', notes: 'Max print area and position to be confirmed.' },
          ],
    }));
    setMessage('Notebook template applied. Review and edit the rows for the exact supplier product.');
  }

  function saveProduct() {
    setError('');
    setMessage('');
    if (!form.sku.trim()) {
      setError('Product SKU is required.');
      return;
    }
    const duplicateSku = products.some((product) =>
      product.id !== form.id && product.sku?.trim().toLowerCase() === form.sku.trim().toLowerCase()
    );
    if (duplicateSku) {
      setError('Product SKU already exists. Use a unique SKU.');
      return;
    }
    if (!form.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!form.category.trim()) {
      setError('Category is required.');
      return;
    }
    if (!form.material.trim()) {
      setError('Material is required.');
      return;
    }
    if (!form.dimensions.trim()) {
      setError('Size / dimensions is required.');
      return;
    }
    if (!form.packaging.trim()) {
      setError('Packaging is required.');
      return;
    }
    const hasColour = form.colours.trim() || (form.availableColours || []).some((row) => row.name?.trim() || row.pms?.trim());
    if (!hasColour) {
      setError('At least one available colour or colour summary is required.');
      return;
    }
    const now = todayIso();
    const payload = {
      ...form,
      id: form.id || newId(),
      createdAt: form.createdAt || now,
      updatedAt: now,
    };
    if (storageMode === 'db') {
      setBusy(true);
      apiSave(payload)
        .then((saved) =>
          apiList().then((list) => {
            setProducts(list);
            setForm(saved || payload);
            setMessage('Made-to-order product saved to the database.');
          })
        )
        .catch((err) => setError(err.message || 'Save failed.'))
        .finally(() => setBusy(false));
      return;
    }
    const next = products.some((product) => product.id === payload.id)
      ? products.map((product) => (product.id === payload.id ? payload : product))
      : [payload, ...products];
    setProducts(next);
    storeProducts(next);
    setForm(payload);
    setMessage('Made-to-order product saved locally (browser draft).');
  }

  function editProduct(product) {
    setForm({ ...EMPTY_PRODUCT, ...product });
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function duplicateProduct(product) {
    const copy = {
      ...product,
      id: '',
      sku: '',
      name: `${product.name} copy`,
      createdAt: '',
      updatedAt: '',
    };
    setForm(copy);
    setMessage('Product copied into the form. Save it as a new product.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteProduct(product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    if (storageMode === 'db') {
      setBusy(true);
      apiDelete(product.id)
        .then(() => apiList())
        .then((list) => {
          setProducts(list);
          if (form.id === product.id) setForm(EMPTY_PRODUCT);
          setMessage('Product deleted from the database.');
        })
        .catch((err) => setError(err.message || 'Delete failed.'))
        .finally(() => setBusy(false));
      return;
    }
    const next = products.filter((row) => row.id !== product.id);
    setProducts(next);
    storeProducts(next);
    if (form.id === product.id) setForm(EMPTY_PRODUCT);
    setMessage('Product deleted locally.');
  }

  function resetForm() {
    setForm(EMPTY_PRODUCT);
    setError('');
    setMessage('');
  }

  function exportLocalJson() {
    const drafts = loadProducts();
    const blob = new Blob([JSON.stringify(drafts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quirkypromo-mto-products-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage(`Exported ${drafts.length} browser draft(s) to a JSON backup file.`);
  }

  async function importLocalToDb() {
    const drafts = loadProducts();
    if (!drafts.length) {
      setError('No local browser drafts found to import.');
      return;
    }
    if (!confirm(`Import ${drafts.length} browser draft product(s) into the database? Your browser drafts are kept as a backup.`)) return;
    setError('');
    setMessage('');
    setBusy(true);
    let ok = 0;
    const fails = [];
    for (const draft of drafts) {
      try {
        await apiSave({ ...draft, id: draft.id || newId() });
        ok += 1;
      } catch (err) {
        fails.push(`${draft.sku || draft.name || 'unknown'}: ${err.message || 'failed'}`);
      }
    }
    try {
      const list = await apiList();
      setProducts(list);
      setStorageMode('db');
    } catch {
      /* keep current list if refresh fails */
    }
    setBusy(false);
    if (fails.length) {
      setError(`Imported ${ok}, failed ${fails.length}. ${fails.slice(0, 3).join(' | ')}`);
    } else {
      setMessage(`Imported ${ok} product(s) into the database. Browser drafts kept as backup.`);
    }
  }

  return (
    <div>
      <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h1 className="srcx-h1" style={{ marginBottom: 4 }}>Made-to-Order Products</h1>
          <div className="srcx-muted">
            Quote-only sourcing products: product details, factory links, packing templates, and front-end positioning.
          </div>
        </div>
        <button className="srcx-btn srcx-btn-gold" onClick={resetForm}>New Product</button>
      </div>

      <div className="srcx-card" style={{ borderColor: '#c9a45c' }}>
        <div className="srcx-row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <strong style={{ color: 'var(--navy)' }}>Storage:</strong>{' '}
            <span className="srcx-muted">
              {storageMode === 'db'
                ? 'Connected to the Supabase database (sourcing_products). Saves are stored server-side.'
                : 'Saving to this browser only. Create the sourcing_products tables, then reload to connect the database.'}
            </span>
          </div>
          <div className="srcx-row" style={{ gap: 8 }}>
            <button className="srcx-btn srcx-btn-sm srcx-btn-ghost" onClick={exportLocalJson} disabled={busy}>
              Export browser drafts (JSON)
            </button>
            {storageMode === 'db' && (
              <button className="srcx-btn srcx-btn-sm srcx-btn-gold" onClick={importLocalToDb} disabled={busy}>
                Import browser drafts → database
              </button>
            )}
          </div>
        </div>
      </div>

      {message && <div className="srcx-card" style={{ borderColor: '#2e7d52', color: '#2e7d52', padding: '10px 14px' }}>{message}</div>}
      {error && <div className="srcx-card" style={{ borderColor: '#b4413e', color: '#b4413e', padding: '10px 14px' }}>{error}</div>}

      <div className="srcx-card">
        <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>{form.id ? `Edit: ${form.name}` : 'Product Details'}</h2>
          <button className="srcx-btn srcx-btn-sm srcx-btn-ghost" onClick={applyNotebookTemplate}>
            Apply Notebook Template
          </button>
        </div>
        <div className="srcx-grid srcx-grid-3">
          <Field label="Product SKU # *">
            <input value={form.sku} onChange={(event) => update('sku', event.target.value)} placeholder="QP-MTO-NB-001" />
          </Field>
          <Field label="Product name *">
            <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Custom linen notebook" />
          </Field>
          <Field label="Category *">
            <input value={form.category} onChange={(event) => update('category', event.target.value)} placeholder="Notebooks, packaging, custom bags..." />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(event) => update('status', event.target.value)}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="sample_only">Sample only</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Linked factory">
            <select value={form.factoryId} onChange={(event) => update('factoryId', event.target.value)}>
              <option value="">Manual / not selected</option>
              {factories.map((factory) => (
                <option key={factory.id} value={factory.id}>{factory.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Factory SKU / reference">
            <input value={form.factorySku} onChange={(event) => update('factorySku', event.target.value)} />
          </Field>
          <Field label="MOQ">
            <input type="number" value={form.moq} onChange={(event) => update('moq', event.target.value)} />
          </Field>
        </div>

        <div className="srcx-grid srcx-grid-2" style={{ marginTop: 12 }}>
          <Field label="Specs">
            <textarea rows={4} value={form.specs} onChange={(event) => update('specs', event.target.value)} placeholder="Size, pages, finishing, inserts, accessories..." />
          </Field>
          <Field label="Public positioning">
            <textarea rows={4} value={form.publicPositioning} onChange={(event) => update('publicPositioning', event.target.value)} placeholder="What customers should understand on the front-end quote-only page." />
          </Field>
        </div>

        <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
          <Field label="Material *">
            <input value={form.material} onChange={(event) => update('material', event.target.value)} />
          </Field>
          <Field label="Size / dimensions *">
            <input value={form.dimensions} onChange={(event) => update('dimensions', event.target.value)} placeholder="A5, 210 x 148mm..." />
          </Field>
          <Field label="Colour summary *">
            <input value={form.colours} onChange={(event) => update('colours', event.target.value)} placeholder="Natural, Black, PMS matched options..." />
          </Field>
          <Field label="Packaging *">
            <input value={form.packaging} onChange={(event) => update('packaging', event.target.value)} placeholder="Individual kraft sleeve, polybag, gift box..." />
          </Field>
          <Field label="Decoration options">
            <input value={form.decorationOptions} onChange={(event) => update('decorationOptions', event.target.value)} placeholder="Deboss, foil, screen print..." />
          </Field>
          <Field label="Logo requirements">
            <input value={form.logoRequirements} onChange={(event) => update('logoRequirements', event.target.value)} placeholder="Print area, PMS, file type, placement..." />
          </Field>
          <Field label="Front-end tags">
            <input value={form.frontEndTags} onChange={(event) => update('frontEndTags', event.target.value)} placeholder="Welcome kits, events, corporate gifting..." />
          </Field>
        </div>
      </div>

      <div className="srcx-card">
        <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Available Colours</h2>
            <div className="srcx-muted">
              Record supplier colour card names and PMS matches. Use the public <Link href="/resources/pms-chart" className="srcx-link">PMS Chart</Link> as the reference link.
            </div>
          </div>
          <button className="srcx-btn srcx-btn-sm srcx-btn-ghost" onClick={() => addRow('availableColours', EMPTY_COLOUR)}>
            Add Colour
          </button>
        </div>
        <EditableTable
          emptyLabel="No structured colours yet. Add supplier colours and PMS matches here."
          rows={form.availableColours || []}
          columns={[
            ['name', 'Colour name', 'Natural'],
            ['supplierColour', 'Supplier colour / swatch', 'Supplier code or card name'],
            ['pms', 'PMS #', 'PMS 468 C'],
            ['hex', 'Hex / preview', '#d8c8a8'],
            ['notes', 'Notes', 'Material variation, closest match...'],
          ]}
          onChange={(index, key, value) => updateRow('availableColours', index, key, value)}
          onRemove={(index) => removeRow('availableColours', index)}
        />
      </div>

      <div className="srcx-card">
        <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Branding Options</h2>
            <div className="srcx-muted">
              One row per decoration method, including max area and position from the supplier branding template.
            </div>
          </div>
          <button className="srcx-btn srcx-btn-sm srcx-btn-ghost" onClick={() => addRow('brandingOptions', EMPTY_BRANDING)}>
            Add Branding
          </button>
        </div>
        <EditableTable
          emptyLabel="No structured branding options yet."
          rows={form.brandingOptions || []}
          columns={[
            ['method', 'Method', 'Deboss / Screen Print'],
            ['maxSize', 'Max size', '160mm x 90mm'],
            ['position', 'Position', 'Front cover'],
            ['colourLimit', 'Colours', 'One colour / PMS'],
            ['templateUrl', 'Template link', 'Branding template URL'],
            ['notes', 'Notes', 'Set-up, restrictions, notes...'],
          ]}
          onChange={(index, key, value) => updateRow('brandingOptions', index, key, value)}
          onRemove={(index) => removeRow('brandingOptions', index)}
        />
      </div>

      <div className="srcx-card">
        <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Individual Product Specs</h2>
            <div className="srcx-muted">
              Flexible product-specific rows such as leaves, page weight, page design, elastic band, binding, packaging, and origin.
            </div>
          </div>
          <button className="srcx-btn srcx-btn-sm srcx-btn-ghost" onClick={() => addRow('specRows', EMPTY_SPEC)}>
            Add Spec Row
          </button>
        </div>
        <EditableTable
          emptyLabel="No spec rows yet. Use the notebook template or add your own rows."
          rows={form.specRows || []}
          columns={[
            ['name', 'Name', 'Page Weight'],
            ['description', 'Description', '70gsm'],
          ]}
          onChange={(index, key, value) => updateRow('specRows', index, key, value)}
          onRemove={(index) => removeRow('specRows', index)}
        />
      </div>

      <div className="srcx-card">
        <h2>Carton Packing Template</h2>
        <div className="srcx-grid srcx-grid-3">
          <Field label="Units per carton">
            <input type="number" value={form.unitsPerCarton} onChange={(event) => update('unitsPerCarton', event.target.value)} />
          </Field>
          <Field label="Carton L cm">
            <input type="number" step="0.1" value={form.cartonLengthCm} onChange={(event) => update('cartonLengthCm', event.target.value)} />
          </Field>
          <Field label="Carton W cm">
            <input type="number" step="0.1" value={form.cartonWidthCm} onChange={(event) => update('cartonWidthCm', event.target.value)} />
          </Field>
          <Field label="Carton H cm">
            <input type="number" step="0.1" value={form.cartonHeightCm} onChange={(event) => update('cartonHeightCm', event.target.value)} />
          </Field>
          <Field label="Gross kg per carton">
            <input type="number" step="0.01" value={form.grossWeightKgPerCarton} onChange={(event) => update('grossWeightKgPerCarton', event.target.value)} />
          </Field>
          <Field label="Production lead time">
            <input value={form.productionLeadTime} onChange={(event) => update('productionLeadTime', event.target.value)} placeholder="15-20 working days" />
          </Field>
        </div>
      </div>

      <div className="srcx-card">
        <h2>Factory, Sample, Compliance</h2>
        <div className="srcx-grid srcx-grid-2">
          <Field label="Sample info">
            <textarea rows={3} value={form.sampleInfo} onChange={(event) => update('sampleInfo', event.target.value)} placeholder="Sample fee, sample lead time, refundable policy..." />
          </Field>
          <Field label="Documents supported">
            <textarea rows={3} value={form.documentsSupported} onChange={(event) => update('documentsSupported', event.target.value)} placeholder="COO, test report, fumigation..." />
          </Field>
          <Field label="Compliance notes">
            <textarea rows={3} value={form.complianceNotes} onChange={(event) => update('complianceNotes', event.target.value)} />
          </Field>
          <Field label="Internal notes">
            <textarea rows={3} value={form.internalNotes} onChange={(event) => update('internalNotes', event.target.value)} />
          </Field>
        </div>

        <div className="srcx-row" style={{ marginTop: 14 }}>
          <button className="srcx-btn" onClick={saveProduct}>Save Product</button>
          {form.id && (
            <Link className="srcx-btn srcx-btn-ghost" href={`/admin/sourcing/costing?mto=${encodeURIComponent(form.id)}`}>
              Create Costing
            </Link>
          )}
        </div>
      </div>

      <div className="srcx-card" style={{ padding: 0 }}>
        <div className="srcx-row" style={{ justifyContent: 'space-between', padding: 16 }}>
          <h2 style={{ margin: 0 }}>Product Library</h2>
          <input
            className="srcx-field-input"
            style={{ border: '1px solid #d8d2c6', borderRadius: 6, padding: '8px 10px', minWidth: 280 }}
            placeholder="Search SKU, product, category, factory..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <table className="srcx-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Factory</th>
              <th>MOQ</th>
              <th>Packing</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td><strong>{product.sku || '-'}</strong></td>
                <td>
                  <strong>{product.name}</strong>
                  <div className="srcx-muted">{product.category || product.frontEndTags || '-'}</div>
                  <div className="srcx-muted">
                    {[product.material, product.dimensions, product.packaging, product.colours || colourRowsText(product)].filter(Boolean).join(' / ') || '-'}
                  </div>
                </td>
                <td>
                  {product.factoryId ? (
                    <Link className="srcx-link" href={`/admin/sourcing/factories/${product.factoryId}`}>
                      {product.factoryName || 'Factory'}
                    </Link>
                  ) : (
                    <span className="srcx-muted">Manual / not selected</span>
                  )}
                </td>
                <td className="srcx-num">{product.moq || '-'}</td>
                <td>{packingLabel(product)}</td>
                <td><span className="srcx-badge">{product.status || 'active'}</span></td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button className="srcx-link" onClick={() => editProduct(product)}>Edit</button>{' | '}
                  <Link className="srcx-link" href={`/admin/sourcing/costing?mto=${encodeURIComponent(product.id)}`}>Costing</Link>{' | '}
                  <button className="srcx-link" onClick={() => duplicateProduct(product)}>Duplicate</button>{' | '}
                  <button className="srcx-link srcx-link-danger" onClick={() => deleteProduct(product)}>Delete</button>
                </td>
              </tr>
            ))}
            {!filteredProducts.length && (
              <tr>
                <td colSpan={7} className="srcx-empty" style={{ border: 'none' }}>
                  No made-to-order products yet. Add your first sourcing product above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="srcx-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function EditableTable({ rows, columns, onChange, onRemove, emptyLabel }) {
  if (!rows.length) {
    return <div className="srcx-empty" style={{ padding: 18 }}>{emptyLabel}</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="srcx-table srcx-edit-table">
        <thead>
          <tr>
            {columns.map(([, label]) => (
              <th key={label}>{label}</th>
            ))}
            <th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${index}-${columns[0]?.[0] || 'row'}`}>
              {columns.map(([key, , placeholder]) => (
                <td key={key}>
                  <div className="srcx-row" style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                    {key === 'hex' && row[key] && (
                      <span
                        aria-hidden="true"
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          border: '1px solid #d8d2c6',
                          background: row[key],
                          flex: '0 0 auto',
                        }}
                      />
                    )}
                    <input
                      value={row[key] || ''}
                      placeholder={placeholder}
                      onChange={(event) => onChange(index, key, event.target.value)}
                    />
                  </div>
                </td>
              ))}
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button className="srcx-link srcx-link-danger" onClick={() => onRemove(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
