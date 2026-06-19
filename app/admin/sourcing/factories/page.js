// app/admin/sourcing/factories/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const EMPTY = {
  id: null,
  name: '',
  contact_person: '',
  wechat: '',
  phone: '',
  email: '',
  main_categories: '',
  notes: '',
  status: 'active',
  country: 'China',
  province: '',
  city: '',
  address: '',
  payment_terms: '',
  currency: 'RMB',
  documents_supported: '',
  compliance_notes: '',
  quality_rating: '',
  on_time_rating: '',
  defect_notes: '',
  blocked_reason: '',
};

export default function FactoriesPage() {
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load(keyword = '') {
    setLoading(true);
    const res = await fetch(`/api/admin/sourcing/factories?q=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    setFactories(data.factories || []);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    async function initialLoad() {
      const res = await fetch('/api/admin/sourcing/factories?q=');
      const data = await res.json();
      if (!cancelled) {
        setFactories(data.factories || []);
        setLoading(false);
      }
    }
    initialLoad();
    return () => {
      cancelled = true;
    };
  }, []);

  function startEdit(factory) {
    setForm({
      ...EMPTY,
      ...factory,
      documents_supported: Array.isArray(factory.documents_supported)
        ? factory.documents_supported.join(', ')
        : factory.documents_supported || '',
    });
    setShowForm(true);
    setError('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save() {
    setError('');
    setMessage('');
    if (!form.name.trim()) {
      setError('Factory name is required.');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/admin/sourcing/factories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Save failed.');
      return;
    }
    setForm(EMPTY);
    setShowForm(false);
    if (data.warning) setMessage(data.warning);
    else setMessage('Factory saved.');
    load(q);
  }

  async function remove(factory) {
    if (!confirm(`Delete factory "${factory.name}"?`)) return;
    const res = await fetch(`/api/admin/sourcing/factories?id=${factory.id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Delete failed.');
      return;
    }
    setMessage('Factory deleted.');
    load(q);
  }

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  return (
    <div>
      <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <h1 className="srcx-h1" style={{ margin: 0 }}>Factory Management</h1>
        <div className="srcx-row">
          <input
            className="srcx-field-input"
            style={{ border: '1px solid #d8d2c6', borderRadius: 6, padding: '8px 10px' }}
            placeholder="Search name / category, e.g. notebook"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && load(q)}
          />
          <button className="srcx-btn srcx-btn-ghost srcx-btn-sm" onClick={() => load(q)}>
            Search
          </button>
          <button
            className="srcx-btn srcx-btn-gold"
            onClick={() => {
              setForm(EMPTY);
              setShowForm(!showForm);
              setError('');
              setMessage('');
            }}
          >
            {showForm ? 'Collapse' : '+ Add Factory'}
          </button>
        </div>
      </div>

      {message && (
        <div className="srcx-card" style={{ borderColor: '#2e7d52', color: '#2e7d52', padding: '10px 14px' }}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="srcx-card">
          <h2>{form.id ? `Edit: ${form.name}` : 'Add Factory'}</h2>
          <div className="srcx-grid srcx-grid-2">
            <div className="srcx-field">
              <label>Factory name *</label>
              <input value={form.name} onChange={set('name')} />
            </div>
            <div className="srcx-field">
              <label>Main categories for quick search</label>
              <input
                value={form.main_categories}
                onChange={set('main_categories')}
                placeholder="linen notebooks, paper notebooks"
              />
            </div>
          </div>

          <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
            <div className="srcx-field">
              <label>Contact person</label>
              <input value={form.contact_person} onChange={set('contact_person')} />
            </div>
            <div className="srcx-field">
              <label>WeChat</label>
              <input value={form.wechat} onChange={set('wechat')} />
            </div>
            <div className="srcx-field">
              <label>Phone</label>
              <input value={form.phone} onChange={set('phone')} />
            </div>
          </div>

          <div className="srcx-grid srcx-grid-2" style={{ marginTop: 12 }}>
            <div className="srcx-field">
              <label>Email</label>
              <input value={form.email} onChange={set('email')} />
            </div>
            <div className="srcx-field">
              <label>Notes</label>
              <input value={form.notes} onChange={set('notes')} />
            </div>
          </div>

          <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
            <div className="srcx-field">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="active">Active</option>
                <option value="preferred">Preferred</option>
                <option value="trial">Trial</option>
                <option value="blocked">Blocked</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="srcx-field">
              <label>Country</label>
              <input value={form.country} onChange={set('country')} />
            </div>
            <div className="srcx-field">
              <label>Province</label>
              <input value={form.province} onChange={set('province')} placeholder="Fujian, Zhejiang..." />
            </div>
            <div className="srcx-field">
              <label>City</label>
              <input value={form.city} onChange={set('city')} />
            </div>
            <div className="srcx-field">
              <label>Payment terms</label>
              <input value={form.payment_terms} onChange={set('payment_terms')} placeholder="30/70" />
            </div>
            <div className="srcx-field">
              <label>Currency</label>
              <select value={form.currency} onChange={set('currency')}>
                <option value="RMB">RMB</option>
                <option value="USD">USD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
            <div className="srcx-field">
              <label>Supported documents</label>
              <input value={form.documents_supported} onChange={set('documents_supported')} placeholder="COO, test report, fumigation" />
            </div>
            <div className="srcx-field">
              <label>Quality rating 1-5</label>
              <input type="number" step="0.1" value={form.quality_rating} onChange={set('quality_rating')} />
            </div>
            <div className="srcx-field">
              <label>On-time rating 1-5</label>
              <input type="number" step="0.1" value={form.on_time_rating} onChange={set('on_time_rating')} />
            </div>
          </div>

          <div className="srcx-field" style={{ marginTop: 12 }}>
            <label>Address</label>
            <input value={form.address} onChange={set('address')} placeholder="Factory address, if known" />
          </div>

          <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
            <div className="srcx-field">
              <label>Blocked reason</label>
              <input value={form.blocked_reason} onChange={set('blocked_reason')} />
            </div>
            <div className="srcx-field" style={{ gridColumn: 'span 2' }}>
              <label>Compliance notes</label>
              <textarea rows={3} value={form.compliance_notes} onChange={set('compliance_notes')} />
            </div>
          </div>
          <div className="srcx-field" style={{ marginTop: 12 }}>
            <label>Defect history / risk notes</label>
            <textarea rows={3} value={form.defect_notes} onChange={set('defect_notes')} />
          </div>

          {error && <p className="srcx-error">{error}</p>}
          <div style={{ marginTop: 14 }}>
            <button className="srcx-btn" onClick={save} disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Save Changes' : 'Add Factory'}
            </button>
          </div>
        </div>
      )}

      <div className="srcx-card" style={{ padding: 0 }}>
        <table className="srcx-table">
          <thead>
            <tr>
              <th>Factory</th>
              <th>Main Categories</th>
              <th>Contact / WeChat</th>
              <th>Quote Records</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {factories.map((factory) => (
              <tr key={factory.id}>
                <td>
                  <Link href={`/admin/sourcing/factories/${factory.id}`} className="srcx-link" style={{ fontSize: 14 }}>
                    {factory.name}
                  </Link>
                </td>
                <td>
                  {factory.main_categories ? (
                    <div className="srcx-tag-row">
                      {factory.main_categories.split(/[,;|/]/).filter(Boolean).map((category, index) => (
                        <span key={index} className="srcx-badge">{category.trim()}</span>
                      ))}
                    </div>
                  ) : <span className="srcx-muted">-</span>}
                </td>
                <td>
                  {factory.contact_person || '-'}
                  {factory.wechat && <span className="srcx-muted"> ({factory.wechat})</span>}
                </td>
                <td className="srcx-num">
                  {factory.quote_count > 0 ? (
                    <>
                      <span className="srcx-badge-navy srcx-badge">{factory.quote_count} records</span>{' '}
                      <span className="srcx-muted">Last {factory.last_quote_date}</span>
                    </>
                  ) : <span className="srcx-muted">None</span>}
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link href={`/admin/sourcing/factories/${factory.id}`} className="srcx-link">
                    Details / Pricing
                  </Link>{' | '}
                  <button className="srcx-link" onClick={() => startEdit(factory)}>Edit</button>{' | '}
                  <button className="srcx-link srcx-link-danger" onClick={() => remove(factory)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && !factories.length && (
              <tr>
                <td colSpan={5} className="srcx-empty" style={{ border: 'none' }}>
                  No factories yet. Use the add button above to create one.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: 'center' }} className="srcx-muted">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
