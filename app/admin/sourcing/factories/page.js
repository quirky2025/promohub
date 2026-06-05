// app/admin/sourcing/factories/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const EMPTY = {
  id: null, name: '', contact_person: '', wechat: '',
  phone: '', email: '', main_categories: '', notes: '',
};

export default function FactoriesPage() {
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load(keyword = '') {
    setLoading(true);
    const res = await fetch(
      `/api/admin/sourcing/factories?q=${encodeURIComponent(keyword)}`
    );
    const data = await res.json();
    setFactories(data.factories || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(f) {
    setForm({ ...EMPTY, ...f });
    setShowForm(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save() {
    setError('');
    if (!form.name.trim()) { setError('工厂名称必填'); return; }
    setSaving(true);
    const res = await fetch('/api/admin/sourcing/factories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || '保存失败'); return; }
    setForm(EMPTY);
    setShowForm(false);
    load(q);
  }

  async function remove(f) {
    if (!confirm(`确定删除工厂「${f.name}」?`)) return;
    const res = await fetch(`/api/admin/sourcing/factories?id=${f.id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || '删除失败'); return; }
    load(q);
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <h1 className="srcx-h1" style={{ margin: 0 }}>工厂管理</h1>
        <div className="srcx-row">
          <input
            className="srcx-field-input"
            style={{ border: '1px solid #d8d2c6', borderRadius: 6, padding: '8px 10px' }}
            placeholder="搜索名称 / 品类,如:笔记本"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(q)}
          />
          <button className="srcx-btn srcx-btn-ghost srcx-btn-sm" onClick={() => load(q)}>
            搜索
          </button>
          <button
            className="srcx-btn srcx-btn-gold"
            onClick={() => { setForm(EMPTY); setShowForm(!showForm); setError(''); }}
          >
            {showForm ? '收起' : '+ 新增工厂'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="srcx-card">
          <h2>{form.id ? `编辑:${form.name}` : '新增工厂'}</h2>
          <div className="srcx-grid srcx-grid-2">
            <div className="srcx-field">
              <label>工厂名称 *</label>
              <input value={form.name} onChange={set('name')} />
            </div>
            <div className="srcx-field">
              <label>主营品类(用于快速找厂,逗号分隔)</label>
              <input
                value={form.main_categories}
                onChange={set('main_categories')}
                placeholder="如:笔记本、纸品、文具"
              />
            </div>
          </div>
          <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
            <div className="srcx-field">
              <label>联系人</label>
              <input value={form.contact_person} onChange={set('contact_person')} />
            </div>
            <div className="srcx-field">
              <label>微信号</label>
              <input value={form.wechat} onChange={set('wechat')} />
            </div>
            <div className="srcx-field">
              <label>电话</label>
              <input value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div className="srcx-grid srcx-grid-2" style={{ marginTop: 12 }}>
            <div className="srcx-field">
              <label>邮箱</label>
              <input value={form.email} onChange={set('email')} />
            </div>
            <div className="srcx-field">
              <label>备注</label>
              <input value={form.notes} onChange={set('notes')} />
            </div>
          </div>
          {error && <p className="srcx-error">{error}</p>}
          <div style={{ marginTop: 14 }}>
            <button className="srcx-btn" onClick={save} disabled={saving}>
              {saving ? '保存中…' : form.id ? '保存修改' : '新增工厂'}
            </button>
          </div>
        </div>
      )}

      <div className="srcx-card" style={{ padding: 0 }}>
        <table className="srcx-table">
          <thead>
            <tr>
              <th>工厂</th>
              <th>主营品类</th>
              <th>联系人 / 微信</th>
              <th>报价记录</th>
              <th style={{ textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {factories.map((f) => (
              <tr key={f.id}>
                <td>
                  <Link href={`/admin/sourcing/factories/${f.id}`} className="srcx-link" style={{ fontSize: 14 }}>
                    {f.name}
                  </Link>
                </td>
                <td>
                  {f.main_categories ? (
                    <div className="srcx-tag-row">
                      {f.main_categories.split(/[,、,]/).filter(Boolean).map((c, i) => (
                        <span key={i} className="srcx-badge">{c.trim()}</span>
                      ))}
                    </div>
                  ) : <span className="srcx-muted">—</span>}
                </td>
                <td>
                  {f.contact_person || '—'}
                  {f.wechat && <span className="srcx-muted">({f.wechat})</span>}
                </td>
                <td className="srcx-num">
                  {f.quote_count > 0 ? (
                    <>
                      <span className="srcx-badge-navy srcx-badge">{f.quote_count} 条</span>{' '}
                      <span className="srcx-muted">最近 {f.last_quote_date}</span>
                    </>
                  ) : <span className="srcx-muted">暂无</span>}
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link href={`/admin/sourcing/factories/${f.id}`} className="srcx-link">
                    详情/录价
                  </Link>{' · '}
                  <button className="srcx-link" onClick={() => startEdit(f)}>编辑</button>{' · '}
                  <button className="srcx-link srcx-link-danger" onClick={() => remove(f)}>删除</button>
                </td>
              </tr>
            ))}
            {!loading && !factories.length && (
              <tr><td colSpan={5} className="srcx-empty" style={{ border: 'none' }}>
                还没有工厂,点右上角「+ 新增工厂」
              </td></tr>
            )}
            {loading && (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center' }} className="srcx-muted">
                加载中…
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
