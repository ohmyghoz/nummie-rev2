'use client';

import { useEffect, useState } from 'react';
import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import { supabaseForKid, type KidSession } from '../../../lib/kid/session';
import { PushBody, PushScreen } from './shell';

const en = dictionaries.en;

interface Row {
  id: string;
  kind: string;
  amount: number;
  status: string;
  fulfilment: string;
  createdAt: string;
}

/** Requests — kid-mobile.source.jsx requestsScreen() :1093. Bacaan saja; anak tidak memutuskan. */
export function RequestsScreen({ session, onBack }: { session: KidSession; onBack: () => void }) {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    const client = supabaseForKid(session);
    void client
      .from('requests')
      .select('id,kind,amount,status,fulfilment,created_at')
      .eq('child_id', session.childId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRows(
          ((data ?? []) as Array<{
            id: string;
            kind: string;
            amount: number;
            status: string;
            fulfilment: string;
            created_at: string;
          }>).map((r) => ({
            id: r.id,
            kind: r.kind,
            amount: Number(r.amount),
            status: r.status,
            fulfilment: r.fulfilment,
            createdAt: r.created_at,
          })),
        );
      });
  }, [session]);

  const waiting = (rows ?? []).filter((r) => r.status === 'needs_ok' || r.status === 'talk_about_it');
  const decided = (rows ?? []).filter((r) => r.status !== 'needs_ok' && r.status !== 'talk_about_it');

  return (
    <PushScreen title={en.requests.title} onBack={onBack}>
      <PushBody>
        {rows === null ? null : waiting.length === 0 && decided.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-soft)' }}>
            <div style={{ fontSize: '44px' }}>🎉</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginTop: '10px' }}>
              {en.requests.empty}
            </div>
          </div>
        ) : (
          <>
            {waiting.length > 0 ? (
              <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', textAlign: 'center' }}>
                Everything here is waiting for a grown-up. Nothing happens until they say yes.
              </div>
            ) : null}
            {waiting.map((r) => (
              <RequestRow key={r.id} row={r} />
            ))}
            {decided.map((r) => (
              <RequestRow key={r.id} row={r} />
            ))}
          </>
        )}
      </PushBody>
    </PushScreen>
  );
}

function RequestRow({ row }: { row: Row }) {
  const icon = row.kind === 'cash_out' ? '💸' : row.kind === 'give_away' ? '💝' : row.kind === 'grow_in' ? '🌱' : '🏦';
  const label = en.requestKind[row.kind as keyof typeof en.requestKind] ?? row.kind;
  const statusLabel =
    row.status === 'declined'
      ? 'Said no'
      : row.status === 'approved' && row.fulfilment === 'done'
        ? en.common.done
        : row.status === 'approved'
          ? en.requests.approved
          : en.requests.waiting;
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '18px',
        padding: '15px',
        boxShadow: 'var(--sh-card)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '13px',
          background: 'var(--surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flex: 'none',
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>
          {label} · {formatRp(row.amount)}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '1px' }}>{statusLabel}</div>
      </div>
      <div style={{ fontSize: '18px' }}>{row.status === 'needs_ok' || row.status === 'talk_about_it' ? '⏳' : row.status === 'declined' ? '✕' : '✓'}</div>
    </div>
  );
}
