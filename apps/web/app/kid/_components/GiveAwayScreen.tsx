'use client';

import { useState } from 'react';
import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import { GIVE_CAUSES, giveSources, validateGive, type GiveCause } from '@core/give';
import type { KidData } from '../../../lib/kid/data';
import { AmountCard, PickLabel, PushBody, PushCta, PushScreen, SelectCard, TextAreaField } from './shell';
import type { KidSession } from '../../../lib/kid/session';

const en = dictionaries.en;
const CAUSE_EMOJI: Record<GiveCause, string> = {
  worship: '🕌',
  orphanage: '🏠',
  disaster: '🌊',
  friend: '🧑‍🤝‍🧑',
  animals: '🐾',
  school: '🏫',
  own: '✏️',
};

/** Give it away — kid-mobile.source.jsx giveawayScreen() :970. Alasan opsional (ADR-0006). */
export function GiveAwayScreen({
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
  const t = en.give;
  const source = giveSources(data.wallets)[0] ?? null;
  const giveBalance = source ? (data.balances[source.id] ?? 0) : 0;

  const [cause, setCause] = useState<GiveCause | null>(null);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const step = 5000;

  const validation = cause ? validateGive({ amount, sourceWalletId: source?.id ?? '', cause, note }, giveBalance) : null;
  const ok = Boolean(source && cause && validation?.ok);

  async function submit() {
    if (!ok || !source || !cause) return;
    setBusy(true);
    setError(null);
    const res = await fetch('/api/kid/requests', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.token}` },
      body: JSON.stringify({
        childId: data.child.id,
        kind: 'give_away',
        amount,
        sourceWalletId: source.id,
        reason: `${en.giveCause[cause]}${note.trim() ? ` — ${note.trim()}` : ''}`,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError('That did not send. Try again.');
      return;
    }
    onDone(t.sent);
  }

  return (
    <PushScreen title={t.giveItAway} onBack={onBack}>
      <PushBody>
        <div
          style={{
            background: 'var(--give-tint)',
            borderRadius: '16px',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--give-deep)' }}>Ready to give</div>
          <div style={{ font: `700 22px var(--display)`, color: 'var(--give)' }}>{formatRp(giveBalance)}</div>
        </div>

        <PickLabel text={t.pickCause} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {GIVE_CAUSES.map((c) => (
            <SelectCard
              key={c}
              emoji={CAUSE_EMOJI[c]}
              name={en.giveCause[c]}
              selected={cause === c}
              onClick={() => setCause(c)}
              accent="#F056A0"
            />
          ))}
        </div>

        <PickLabel text={t.howMuch} />
        <AmountCard
          amount={amount}
          color="var(--ink)"
          onMinus={() => setAmount((a) => Math.max(0, a - step))}
          onPlus={() => setAmount((a) => (a + step <= giveBalance ? a + step : a))}
          disMinus={amount <= 0}
          disPlus={amount + step > giveBalance}
        />

        <PickLabel text={cause === 'own' ? t.notePlaceholder : t.reasonLabel} />
        <TextAreaField value={note} onChange={setNote} placeholder={t.notePlaceholder} />

        {validation && !validation.ok && amount > 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--loss)', textAlign: 'center' }}>
            {t[validation.errorKey === 'give.notEnough' ? 'notEnough' : validation.errorKey === 'give.ownCauseNeedsNote' ? 'ownCauseNeedsNote' : 'amountRequired']}
          </div>
        ) : null}
        {error ? <div style={{ fontSize: '12px', color: 'var(--loss)', textAlign: 'center' }}>{error}</div> : null}
      </PushBody>
      <PushCta label={busy ? '…' : t.submit} enabled={ok && !busy} onClick={submit} />
    </PushScreen>
  );
}
