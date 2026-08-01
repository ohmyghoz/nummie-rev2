'use client';

import { useState } from 'react';
import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import { moveSources, moveTargets } from '@core/move';
import { tr } from '../../../lib/i18n';
import type { KidData } from '../../../lib/kid/data';
import { AmountCard, PickLabel, PushBody, PushCta, PushScreen, SelectCard } from './shell';
import type { KidSession } from '../../../lib/kid/session';

const en = dictionaries.en;
const CATEGORY_COLOR: Record<string, string> = {
  spend: '#FF7A4D',
  save: '#2CA6E0',
  give: '#F056A0',
  grow: '#2FC078',
  unsorted: '#8A7CF0',
};

/** Move money — kid-mobile.source.jsx moveScreen() :937. Langsung, tanpa OK ortu. */
export function MoveScreen({
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
  const t = en.move;
  const sources = moveSources(data.wallets, data.rules);
  const [fromId, setFromId] = useState<string | null>(null);
  const [toId, setToId] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const step = 5000;

  const from = data.wallets.find((w) => w.id === fromId) ?? null;
  const fromBalance = from ? (data.balances[from.id] ?? 0) : 0;
  const targets = from ? moveTargets(from, data.wallets) : [];

  async function confirm() {
    if (!from || !toId || amount <= 0) return;
    setBusy(true);
    setError(null);
    const res = await fetch('/api/kid/move', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ childId: data.child.id, fromWalletId: from.id, toWalletId: toId, amount }),
    });
    setBusy(false);
    if (!res.ok) {
      setError(en.sort.saveFailed);
      return;
    }
    const to = data.wallets.find((w) => w.id === toId);
    onDone(`Moved ${formatRp(amount)} · ${from.name} → ${to?.name ?? ''}`);
  }

  if (sources.length === 0) {
    return (
      <PushScreen title={t.title} onBack={onBack}>
        <PushBody>
          <div style={{ textAlign: 'center', padding: '40px 20px', fontSize: '13px', color: 'var(--ink-soft)' }}>
            {t.nothingMovable}
          </div>
        </PushBody>
      </PushScreen>
    );
  }

  return (
    <PushScreen title={t.title} onBack={onBack}>
      <PushBody>
        <div
          style={{
            background: 'var(--brand-tint)',
            borderRadius: '16px',
            padding: '13px 15px',
            fontSize: '11.5px',
            color: 'var(--brand-deep)',
            lineHeight: 1.4,
          }}
        >
          Move happens right away — no grown-up needed. Grow can&apos;t be moved (only Harvest), and Unsorted only
          leaves through Sort.
        </div>

        <PickLabel text={t.from} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {sources.map((w) => (
            <SelectCard
              key={w.id}
              emoji={emojiFor(w.kind)}
              name={w.name}
              sub={formatRp(data.balances[w.id] ?? 0)}
              selected={fromId === w.id}
              onClick={() => {
                setFromId(w.id);
                setToId(null);
                setAmount(0);
              }}
              accent={CATEGORY_COLOR[w.category] ?? '#6C4CE0'}
            />
          ))}
        </div>

        {from ? (
          <>
            <PickLabel text={t.to} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {targets.map((w) => (
                <SelectCard
                  key={w.id}
                  emoji={emojiFor(w.kind)}
                  name={w.name}
                  sub={formatRp(data.balances[w.id] ?? 0)}
                  selected={toId === w.id}
                  onClick={() => setToId(w.id)}
                  accent={CATEGORY_COLOR[w.category] ?? '#6C4CE0'}
                />
              ))}
            </div>

            <PickLabel text={t.howMuch} />
            <AmountCard
              amount={amount}
              color="var(--ink)"
              onMinus={() => setAmount((a) => Math.max(0, a - step))}
              onPlus={() => setAmount((a) => (a + step <= fromBalance ? a + step : a))}
              disMinus={amount <= 0}
              disPlus={amount + step > fromBalance}
            />
          </>
        ) : null}

        {error ? <div style={{ fontSize: '12px', color: 'var(--loss)', textAlign: 'center' }}>{error}</div> : null}
      </PushBody>
      <PushCta
        label={busy ? '…' : t.confirm}
        enabled={Boolean(from && toId && amount > 0 && amount <= fromBalance && !busy)}
        onClick={confirm}
      />
    </PushScreen>
  );
}

function emojiFor(kind: string): string {
  switch (kind) {
    case 'envelope':
      return '🍡';
    case 'dream':
      return '🚲';
    case 'free_savings':
      return '💭';
    case 'give_pool':
      return '💝';
    default:
      return '💰';
  }
}
