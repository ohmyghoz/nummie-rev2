'use client';

import { useState } from 'react';
import { formatRp } from '@core/money';
import { canCashOutFrom } from '@core/rules';
import type { KidData } from '../../../lib/kid/data';
import { AmountCard, PickLabel, PushBody, PushCta, PushScreen, SelectCard, TextAreaField } from './shell';
import type { KidSession } from '../../../lib/kid/session';

const CATEGORY_COLOR: Record<string, string> = { spend: '#FF7A4D', save: '#2CA6E0' };

/** Cash out — kid-mobile.source.jsx cashoutScreen() :905. Butuh OK ortu (ADR-0002). */
export function CashoutScreen({
  data,
  session,
  onBack,
  onDone,
}: {
  data: KidData;
  session: KidSession;
  onBack: () => void;
  onDone: (toast: string) => void;
}) {
  const sources = data.wallets.filter((w) => canCashOutFrom(w));
  const [srcId, setSrcId] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const step = 10000;

  const src = data.wallets.find((w) => w.id === srcId) ?? null;
  const balance = src ? (data.balances[src.id] ?? 0) : 0;
  const ok = Boolean(src && amount > 0 && reason.trim().length > 2);

  async function submit() {
    if (!ok || !src) return;
    setBusy(true);
    setError(null);
    const res = await fetch('/api/kid/requests', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.token}` },
      body: JSON.stringify({
        childId: data.child.id,
        kind: 'cash_out',
        amount,
        sourceWalletId: src.id,
        reason: reason.trim(),
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError('That did not send. Try again.');
      return;
    }
    onDone('Request sent to a grown-up ⏳');
  }

  return (
    <PushScreen title="Cash out" onBack={onBack}>
      <PushBody>
        <div
          style={{
            background: 'var(--spend-tint)',
            borderRadius: '16px',
            padding: '13px 15px',
            fontSize: '11.5px',
            color: 'var(--spend-deep)',
            lineHeight: 1.4,
          }}
        >
          Cash out turns app balance into real money. A grown-up says yes first. You can only cash out from Spend or
          Save — not Give, Unsorted, or Grow.
        </div>

        <PickLabel text="From which wallet?" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {sources.map((w) => (
            <SelectCard
              key={w.id}
              emoji={w.category === 'spend' ? '🍡' : '🏦'}
              name={w.name}
              sub={formatRp(data.balances[w.id] ?? 0)}
              selected={srcId === w.id}
              onClick={() => {
                setSrcId(w.id);
                setAmount(0);
              }}
              accent={CATEGORY_COLOR[w.category] ?? '#6C4CE0'}
            />
          ))}
        </div>

        <PickLabel text="How much?" />
        <AmountCard
          amount={amount}
          color={src ? 'var(--ink)' : 'var(--line)'}
          onMinus={() => setAmount((a) => Math.max(0, a - step))}
          onPlus={() => setAmount((a) => (a + step <= balance ? a + step : a))}
          disMinus={amount <= 0}
          disPlus={!src || amount + step > balance}
        />
        {src ? (
          <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)', textAlign: 'right', marginTop: '-6px' }}>
            Max {formatRp(balance)}
          </div>
        ) : null}

        <PickLabel text="Why do you want it?" />
        <TextAreaField value={reason} onChange={setReason} placeholder="e.g. buy a birthday gift for my friend" />

        {error ? <div style={{ fontSize: '12px', color: 'var(--loss)', textAlign: 'center' }}>{error}</div> : null}
      </PushBody>
      <PushCta label={busy ? '…' : 'Send request'} enabled={ok && !busy} onClick={submit} />
    </PushScreen>
  );
}
