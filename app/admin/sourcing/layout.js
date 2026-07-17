// app/admin/sourcing/layout.js
// 给整个 Sourcing 板块加一条子导航(询盘 / 工厂 / 报价检索 / 趋势 / 运费),
// 你现有的 /admin/sourcing 询盘页也会被它包住,自动出现在第一个标签。
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './sourcing.css';

const TABS = [
  { href: '/admin/sourcing', label: '询盘 / 请求', exact: true },
  { href: '/admin/sourcing/factories', label: '工厂管理' },
  { href: '/admin/sourcing/costing', label: '计价 / 报价' },
  { href: '/admin/sourcing/orders', label: '工厂下单 / 订单' },
  { href: '/admin/sourcing/procurement', label: '采购 / 欠爸爸' },
  { href: '/admin/sourcing/quotes', label: '报价检索' },
  { href: '/admin/sourcing/trends', label: '价格趋势' },
  { href: '/admin/sourcing/freight', label: '运费价格' },
];

export default function SourcingLayout({ children }) {
  const pathname = usePathname() || '';
  return (
    <div className="srcx-wrap">
      <nav className="srcx-subnav">
        <Link href="/admin" style={{ color: 'var(--gold)', fontWeight: 700, textDecoration: 'none', paddingBottom: 10, marginRight: 4 }}>← 后台首页</Link>
        <span className="srcx-subnav-title">Sourcing</span>
        {TABS.map((t) => {
          const active = t.exact
            ? pathname === t.href
            : pathname.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} className={active ? 'active' : ''}>
              {t.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
