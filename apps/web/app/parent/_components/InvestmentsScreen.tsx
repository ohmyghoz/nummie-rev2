'use client';

import { useEffect, useState } from 'react';
import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import type { Session } from '@supabase/supabase-js';
import { tr } from '../../../lib/i18n';
import { supabaseBrowser } from '../../../lib/supabase-browser';
import { walletFromRow, type WalletRow } from '../../../lib/kid/data';
import type { Wallet } from '@core/types';

const en = dictionaries.en;

interface TdRow {
  id: string;
  name: string;
  principal: number;
  ratePct: number;
  tenorMonths: number;
  matured: boolean;
  pillLabel: string;
}

/**
 * Manage investments per anak — parent-mobile.markup.html "Investments" push (:693), Time
 * Deposit saja. Gold/FX baris dari mockup TIDAK diport — instrumen itu sendiri belum ada di
 * sisi anak (butuh `daily_prices`, lihat docs/PROGRESS.md), jadi tidak akan pernah muncul di
 * sini sampai itu dibangun. Baca-saja: aksi (harvest) tetap lewat Requests, bukan dari sini.
 */
export function InvestmentsScreen({
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
  const [rows, setRows] = useState<TdRow[] | null>(null);

  useEffect(() => {
    const client = supabaseBrowser();
    void Promise.all([
      client.from('wallets').select('*').eq('child_id', childId).is('archived_at', null),
      client.from('wallet_balances').select('wallet_id,balance').eq('child_id', childId),
    ]).then(([walletsRes, balancesRes]) => {
      const wallets = ((walletsRes.data ?? []) as WalletRow[]).map(walletFromRow);
      const balances: Record<string, number> = {};
      for (const row of (balancesRes.data ?? []) as Array<{ wallet_id: string; balance: number }>) {
        balances[row.wallet_id] = Number(row.balance);
      }

      // `startedAt` cuma terisi setelah ortu approve (migrasi 0014, dibekukan bersamaan dengan
      // tenor_months/locked_rate_pct) — sebelum itu wallet-nya sudah ada tapi belum jadi
      // kesepakatan sungguhan, jadi belum pantas disebut "investment". Permintaan yang masih
      // menunggu tetap kelihatan di Requests, bukan di sini.
      const tds = wallets.filter((w: Wallet) => w.category === 'grow' && w.instrument === 'time_deposit' && w.startedAt);
      setRows(
        tds.map((w) => {
          const matured = isMatured(w.startedAt, w.tenorMonths);
          const daysLeft = w.startedAt && w.tenorMonths ? daysUntilMaturity(w.startedAt, w.tenorMonths) : 0;
          return {
            id: w.id,
            name: w.name,
            principal: balances[w.id] ?? 0,
            ratePct: w.lockedRatePct ?? 0,
            tenorMonths: w.tenorMonths ?? 0,
            matured,
            pillLabel: matured
              ? en.settings.matured
              : w.startedAt
                ? tr(en.settings.daysLeft, { days: daysLeft })
                : '',
          };
        }),
      );
    });
  }, [childId]);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--canvas)', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
        <button onClick={onBack} style={{ width: '40px', height: '40px', borderRadius: '13px', background: '#fff', boxShadow: 'var(--sh-1)', fontSize: '18px' }}>
          {'‹'}
        </button>
        <div>
          <div style={{ font: `700 20px var(--display)`, color: 'var(--ink)' }}>{en.settings.investmentsTitle}</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{childName}</div>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rows === null ? null : rows.length === 0 ? (
          <div style={{ padding: '40px 12px', textAlign: 'center', fontSize: '12.5px', color: 'var(--ink-soft)' }}>
            No Time Deposits yet.
          </div>
        ) : (
          rows.map((r) => (
            <div key={r.id} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>{r.name}</div>
                <div style={{ font: `700 18px var(--display)`, color: 'var(--ink)' }}>{formatRp(r.principal)}</div>
              </div>
              {r.pillLabel ? (
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 9px',
                    borderRadius: '999px',
                    background: r.matured ? '#E1F6EC' : 'var(--surface-2)',
                    color: r.matured ? '#1B7A4B' : 'var(--ink-soft)',
                  }}
                >
                  {r.pillLabel}
                </span>
              ) : null}
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <KV k="Principal" v={formatRp(r.principal)} />
                <KV k="Rate (whole term)" v={`${r.ratePct}%`} />
                <KV k="Term" v={tr(en.settings.months, { n: r.tenorMonths })} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
      <span style={{ color: 'var(--ink-soft)' }}>{k}</span>
      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{v}</span>
    </div>
  );
}

function isMatured(startedAt?: string, tenorMonths?: number): boolean {
  if (!startedAt || !tenorMonths) return false;
  return maturityDate(startedAt, tenorMonths).getTime() <= Date.now();
}

function daysUntilMaturity(startedAt: string, tenorMonths: number): number {
  const ms = maturityDate(startedAt, tenorMonths).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

function maturityDate(startedAt: string, tenorMonths: number): Date {
  const mature = new Date(startedAt);
  mature.setMonth(mature.getMonth() + tenorMonths);
  return mature;
}
