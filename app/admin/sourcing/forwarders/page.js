// app/admin/sourcing/forwarders/page.js
// 货代管理 — 录入/编辑货代 + 银行/付款信息(付国际运费用)。
'use client';

import { useEffect, useState } from 'react';

const NAVY = '#1B2A4A';
const EMPTY = { name: '', short_code: '', contact_person: '', wechat: '', phone: '', email: '', bank_name: '', bank_branch: '', bank_address: '', swift: '', account_number: '', account_currency: 'AUD', payment_terms: '', remark: '', notes: '' };

export default function ForwardersPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    const d = await fetch('/api/admin/sourcing/forwarders').then((r) => r.json());
    setRows(d.forwarders || []);
  }
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save() {
    if (!form.name.trim()) { setErr('货代名称必填'); return; }
    setSaving(true); setErr('');
    const res = await fetch('/api/admin/sourcing/forwarders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, id: editingId || undefined }),
    });
    const d = await res.json();
    setSaving(false);
    if (!res.ok) { setErr(d.error || '保存失败'); return; }
    setForm(EMPTY); setEditingId(null); load();
  }
  function edit(r) { setEditingId(r.id); setForm({ ...EMPTY, ...r }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function del(id) {
    if (!confirm('删除这个货代?')) return;
    const res = await fetch(`/api/admin/sourcing/forwarders?id=${id}`, { method: 'DELETE' });
    if (!res.ok) { const d = await res.json(); alert(d.error || '删除失败'); return; }
    load();
  }

  const F = ({ label, k, ph, wide }) => (
    <div className="srcx-field" style={{ width: wide ? '100%' : 200 }}>
      <label>{label}</label>
      <input value={form[k]} onChange={set(k)} placeholder={ph || ''} />
    </div>
  );

  return (
    <div style={{ padding: '4px 0' }}>
      <h1 className="srcx-h1" style={{ fontSize: 20 }}>货代管理 · Forwarders</h1>
      <p className="srcx-muted" style={{ marginTop: 2 }}>录入货代 + 银行信息(付国际运费用)。</p>

      <div className="srcx-card" style={{ marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>{editingId ? '编辑货代' : '新增货代'}</h2>
        {err && <div className="srcx-error">{err}</div>}
        <div className="srcx-row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <F label="货代名称 *" k="name" ph="Zhejiang Bing Supply Chain…" />
          <F label="短代码" k="short_code" ph="ZB" />
          <F label="联系人" k="contact_person" />
          <F label="微信 WeChat" k="wechat" />
          <F label="电话" k="phone" />
          <F label="Email" k="email" />
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '12px 0 6px' }}>银行 / 付款信息</div>
        <div className="srcx-row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <F label="银行 Bank" k="bank_name" ph="Bank of China" />
          <F label="支行 Branch" k="bank_branch" ph="Yiwu Branch" />
          <F label="SWIFT" k="swift" ph="BKCHCNBJ92H" />
          <F label="账号 A/C" k="account_number" ph="354577334824" />
          <F label="币种" k="account_currency" ph="AUD" />
          <F label="付款条款" k="payment_terms" />
        </div>
        <div className="srcx-row" style={{ gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
          <F label="银行地址 Bank address" k="bank_address" wide ph="No.500, Chouzhou North Road, Yiwu…" />
        </div>
        <div className="srcx-row" style={{ gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
          <F label="备注 Remark" k="remark" ph="运费" />
          <F label="内部备注" k="notes" wide />
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="srcx-btn srcx-btn-gold" onClick={save} disabled={saving}>{saving ? '保存中…' : editingId ? '保存修改' : '+ 新增货代'}</button>
          {editingId && <button className="srcx-btn srcx-btn-ghost" onClick={() => { setEditingId(null); setForm(EMPTY); }}>取消</button>}
        </div>
      </div>

      {rows.length === 0 ? <div className="srcx-empty">还没有货代。上面新增一个。</div> : rows.map((r) => (
        <div key={r.id} className="srcx-card" style={{ marginBottom: 10 }}>
          <div className="srcx-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0 }}>{r.name}{r.short_code ? ` (${r.short_code})` : ''}</h2>
              <div style={{ fontSize: 12.5, color: '#000', marginTop: 4, lineHeight: 1.7 }}>
                {[r.contact_person, r.wechat && `微信 ${r.wechat}`, r.phone, r.email].filter(Boolean).join(' · ')}
                {(r.bank_name || r.account_number) && <div>🏦 {[r.bank_name, r.bank_branch].filter(Boolean).join(' ')} · SWIFT {r.swift || '—'} · {r.account_currency} A/C <strong>{r.account_number || '—'}</strong></div>}
                {r.bank_address && <div style={{ color: '#000' }}>{r.bank_address}</div>}
                {r.remark && <div>备注: {r.remark}</div>}
              </div>
            </div>
            <span style={{ display: 'inline-flex', gap: 12, flexShrink: 0 }}>
              <button className="srcx-link" onClick={() => edit(r)}>编辑</button>
              <button className="srcx-link srcx-link-danger" onClick={() => del(r.id)}>删除</button>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
