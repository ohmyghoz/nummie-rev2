'use client';

import { useMemo, useState } from 'react';
import { dictionaries } from '@copy';

const en = dictionaries.en;
import { formatRp } from '@core/money';
import { sortPlan } from '@core/sort';
import { tr } from '../../../lib/i18n';
import { categoryTotal, type KidData } from '../../../lib/kid/data';
import { PushBody, PushCta, PushScreen } from './shell';
import type { KidSession } from '../../../lib/kid/session';

const CATEGORY_TINT = { spend: '--spend-tint', save: '--save-tint', give: '--give-tint', grow: '--grow-tint' } as const;
const CATEGORY_COLOR = { spend: '--spend', save: '--save', give: '--give', grow: '--grow' } as const;
const CATEGORY_EMOJI = { spend: '🍡', save: '🏦', give: '💝', grow: '🌱' } as const;

/**
 * Push screen Sort — docs/inventory/kid-sort.md, DEVIASI D-B: rasio/mode dari
 * `money_rules`, bukan teks mati. Confirm menulis lewat POST /api/kid/sort
 * (service role + validasi ulang server-side — klien tidak pernah menulis ledger).
 */
export function SortScreen({
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
  const t = en.sort;
  const unsorted = categoryTotal(data.wallets, data.balances, 'unsorted');
  const plan = useMemo(() => sortPlan(unsorted, data.rules, data.wallets), [unsorted, data.rules, data.wallets]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ratios = data.rules.autoSplit.ratios;

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/kid/sort', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ childId: data.child.id }),
      });
      if (!res.ok) {
        setError(t.saveFailed);
        setBusy(false);
        return;
      }
      onDone('Sorted!');
    } catch {
      setError(t.saveFailed);
      setBusy(false);
    }
  }

  return (
    <PushScreen title={t.title} onBack={onBack}>
      <PushBody>
        {plan.autoSplitEnabled ? (
          <div style={{ fontSize: '12px', color: 'var(--ink-soft)', textAlign: 'center' }}>
            {tr(t.autoSplitHint, {
              spend: ratios.spend ?? 0,
              save: ratios.save ?? 0,
              give: ratios.give ?? 0,
            })}
          </div>
        ) : null}

        {plan.locked ? (
          <div
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '14px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{t.lockedTitle}</div>
            <div style={{ marginTop: '4px', fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
              {t.lockedBody}
            </div>
          </div>
        ) : null}

        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{t.preview}</div>

        {plan.slots.length === 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--ink-soft)', textAlign: 'center', padding: '20px 0' }}>
            Turn on auto-split with a grown-up, or sort this from Wallets.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {plan.slots.map((slot) => {
              const cat = slot.category;
              return (
                <div
                  key={slot.wallet.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    boxShadow: 'var(--sh-card)',
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: `var(${CATEGORY_TINT[cat]})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '19px',
                    }}
                  >
                    {CATEGORY_EMOJI[cat]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{slot.wallet.name}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: `var(${CATEGORY_COLOR[cat]})` }}>
                    {formatRp(slot.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {plan.remainderToUnsorted > 0 ? (
          <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', textAlign: 'center' }}>
            {tr(t.leftInUnsorted, { amount: formatRp(plan.remainderToUnsorted) })}
          </div>
        ) : null}

        {error ? <div style={{ fontSize: '12px', color: 'var(--loss)', textAlign: 'center' }}>{error}</div> : null}
      </PushBody>
      <PushCta label={busy ? '…' : t.confirm} enabled={unsorted > 0 && !busy} onClick={confirm} />
    </PushScreen>
  );
}
