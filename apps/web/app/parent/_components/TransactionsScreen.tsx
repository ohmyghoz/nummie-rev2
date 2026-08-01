'use client';

import { useEffect, useMemo, useState } from 'react';
import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import type { Session } from '@supabase/supabase-js';
import { supabaseBrowser } from '../../../lib/supabase-browser';

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

/**
 * Transactions per anak — parent-mobile.markup.html "hist" push (:570), disederhanakan ke satu
 * anak (bukan gabungan `__all`, sama seperti Dashboard: kartu per anak, bukan chip-picker —
 * lihat docs/PROGRESS.md). Sama seperti HistoryScreen kid-side: `ledger_entries` langsung lewat
 * RLS (`ledger_read`/`can_see_child`), bukan route handler — baca-saja.
 */
export function TransactionsScreen({
  session: _session,
  childId,
  childName,
  onBack,
}: {
  session: Session;
  childId: string;
  childName: string;
  onBack: () => void;
}) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [range, setRange] = useState<Range>('30d');

  useEffect(() => {
    const client = supabaseBrowser();
    void client
      .from('ledger_entries')
      .select('id,from_wallet_id,to_wallet_id,amount,reason,created_at')
      .eq('child_id', childId)
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
  }, [childId]);

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
    <div style={{ minHeight: '100dvh', background: 'var(--canvas)', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
        <button onClick={onBack} style={{ width: '40px', height: '40px', borderRadius: '13px', background: '#fff', boxShadow: 'var(--sh-1)', fontSize: '18px' }}>
          {'‹'}
        </button>
        <div>
          <div style={{ font: `700 20px var(--display)`, color: 'var(--ink)' }}>{en.txn.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{childName}</div>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                border: '1px solid var(--line)',
              }}
            >
              {r === '7d' ? en.txn.range7d : r === '30d' ? en.txn.range30d : r === '90d' ? en.txn.range90d : en.txn.rangeAll}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <SummaryCard label={en.txn.moneyIn} amount={totalIn} color="#1B7A4B" />
          <SummaryCard label={en.txn.moneyOut} amount={totalOut} color="var(--loss)" />
        </div>

        {entries === null ? null : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)', fontSize: '13px' }}>
            {en.txn.empty}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '4px 14px', border: '1px solid var(--line)' }}>
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
                  <div style={{ fontSize: '13px', fontWeight: 700, color: incoming ? '#1B7A4B' : 'var(--ink)' }}>
                    {incoming ? '+' : '−'}
                    {formatRp(e.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, amount, color }: { label: string; amount: number; color: string }) {
  return (
    <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '13px', border: '1px solid var(--line)' }}>
      <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ font: `700 17px var(--display)`, color, marginTop: '4px' }}>{formatRp(amount)}</div>
    </div>
  );
}
