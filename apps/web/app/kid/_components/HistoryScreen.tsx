'use client';

import { useEffect, useMemo, useState } from 'react';
import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import { supabaseForKid, type KidSession } from '../../../lib/kid/session';
import { PushBody, PushScreen } from './shell';

const en = dictionaries.en;

interface Entry {
  id: string;
  fromWalletId: string | null;
  toWalletId: string | null;
  amount: number;
  reason: string;
  createdAt: string;
}

type Range = '7d' | '30d' | '90d' | 'all';

/** History — kid-mobile.source.jsx historyScreen() :1115, disederhanakan (bukan demo data mati). */
export function HistoryScreen({ session, onBack }: { session: KidSession; onBack: () => void }) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [range, setRange] = useState<Range>('30d');

  useEffect(() => {
    const client = supabaseForKid(session);
    void client
      .from('ledger_entries')
      .select('id,from_wallet_id,to_wallet_id,amount,reason,created_at')
      .eq('child_id', session.childId)
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setEntries(
          ((data ?? []) as Array<{
            id: string;
            from_wallet_id: string | null;
            to_wallet_id: string | null;
            amount: number;
            reason: string;
            created_at: string;
          }>).map((r) => ({
            id: r.id,
            fromWalletId: r.from_wallet_id,
            toWalletId: r.to_wallet_id,
            amount: Number(r.amount),
            reason: r.reason,
            createdAt: r.created_at,
          })),
        );
      });
  }, [session]);

  const filtered = useMemo(() => {
    if (!entries) return [];
    if (range === 'all') return entries;
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const cutoff = Date.now() - days * 86400000;
    return entries.filter((e) => new Date(e.createdAt).getTime() >= cutoff);
  }, [entries, range]);

  const totalIn = filtered.filter((e) => e.fromWalletId === null).reduce((s, e) => s + e.amount, 0);
  const totalOut = filtered.filter((e) => e.toWalletId === null).reduce((s, e) => s + e.amount, 0);

  return (
    <PushScreen title={en.txn.title} onBack={onBack}>
      <PushBody>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['7d', '30d', '90d', 'all'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                background: range === r ? 'var(--brand)' : '#fff',
                color: range === r ? '#fff' : 'var(--ink)',
                boxShadow: range === r ? 'none' : 'var(--sh-card)',
              }}
            >
              {r === '7d' ? en.txn.range7d : r === '30d' ? en.txn.range30d : r === '90d' ? en.txn.range90d : en.txn.rangeAll}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <SummaryCard label={en.txn.moneyIn} amount={totalIn} color="var(--grow)" />
          <SummaryCard label={en.txn.moneyOut} amount={totalOut} color="var(--loss)" />
        </div>

        {entries === null ? null : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)', fontSize: '13px' }}>
            {en.txn.empty}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '20px', padding: '4px 14px', boxShadow: 'var(--sh-card)' }}>
            {filtered.map((e, i) => {
              const incoming = e.fromWalletId === null;
              const internal = e.fromWalletId !== null && e.toWalletId !== null;
              return (
                <div
                  key={e.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '11px',
                    padding: '11px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                  }}
                >
                  <div style={{ fontSize: '18px' }}>{incoming ? '🎁' : internal ? '🔄' : '💸'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)', textTransform: 'capitalize' }}>
                      {e.reason.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)' }}>
                      {new Date(e.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: incoming ? 'var(--grow)' : 'var(--ink)' }}>
                    {incoming ? '+' : '−'}
                    {formatRp(e.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PushBody>
    </PushScreen>
  );
}

function SummaryCard({ label, amount, color }: { label: string; amount: number; color: string }) {
  return (
    <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '13px', boxShadow: 'var(--sh-card)' }}>
      <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ font: `700 17px var(--display)`, color, marginTop: '4px' }}>{formatRp(amount)}</div>
    </div>
  );
}
