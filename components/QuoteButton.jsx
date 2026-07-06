'use client';
// Opens the local-stock QuoteModal (same as nav 'Get a Quote'). NOT the sourcing quote.
import { useState } from 'react';
import QuoteModal from '@/components/QuoteModal';
import { gaEvent } from '@/lib/gtag';

export default function QuoteButton({ label = 'Get a Quote', source = 'page', style }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => { gaEvent('quote_click', { source_location: source }); setOpen(true); }} style={style}>{label}</button>
      <QuoteModal open={open} onClose={() => setOpen(false)} source={source} />
    </>
  );
}
