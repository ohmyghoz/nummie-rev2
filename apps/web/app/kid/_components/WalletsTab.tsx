'use client';

import { useState } from 'react';
import { formatRp } from '@core/money';
import type { Category, Wallet } from '@core/types';
import { categoryTotal, type KidData } from '../../../lib/kid/data';
import { ProgressRing } from './shell';

/**
 * Tab Wallets — docs/inventory/kid-wallets.md. Cabang Middle saja.
 *
 * Simplifikasi sadar untuk sesi ini (dicatat, bukan disembunyikan): kartu Grow
 * menampilkan saldo instrumen tanpa simulasi bunga/spread harian (`daily_prices`,
 * `formatGoldWeight`) — itu porsi Grow penuh (task T1 §Grow), belum digarap malam ini.
 */
const CATEGORY_META: Record<Category, { emoji: string; name: string; meta: string }> = {
  spend: { emoji: '🛍️', name: 'Spend', meta: 'envelopes · use now' },
  save: { emoji: '🏦', name: 'Save', meta: 'dreams + free savings' },
  give: { emoji: '💝', name: 'Give', meta: 'Share with others' },
  grow: { emoji: '🌱', name: 'Grow', meta: 'investments · needs OK' },
};

export function WalletsTab({ data, onPush }: { data: KidData; onPush: (screen: string) => void }) {
  const [open, setOpen] = useState<Category | null>('spend');
  const [masked, setMasked] = useState(false);
  const { wallets, balances } = data;
  const total = wallets.reduce((s, w) => s + (balances[w.id] ?? 0), 0);
  const unsorted = categoryTotal(wallets, balances, 'unsorted');

  const money = (n: number) => (masked ? 'Rp ••••' : formatRp(n));

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <div style={{ font: `700 24px var(--display)`, color: 'var(--ink)', letterSpacing: '-.01em' }}>Wallets</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['•••', '🧾'].map((glyph) => (
            <button
              key={glyph}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#fff',
                boxShadow: 'var(--sh-card)',
                fontSize: '15px',
              }}
            >
              {glyph}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '16px 18px',
          boxShadow: 'var(--sh-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            My balance
          </div>
          <div style={{ font: `700 30px var(--display)`, marginTop: '4px' }}>{money(total)}</div>
        </div>
        <button
          onClick={() => setMasked((m) => !m)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--surface-2)',
            fontSize: '18px',
          }}
        >
          {masked ? '🙈' : '👁️'}
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          background: 'var(--brand-tint)',
          border: '1px solid rgba(108,76,224,.2)',
          borderRadius: '20px',
          padding: '15px',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '13px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            flex: 'none',
          }}
        >
          🪙
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700 }}>Main pocket · unsorted</div>
          <div style={{ font: `700 20px var(--display)`, margin: '1px 0 2px' }}>{money(unsorted)}</div>
          <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)' }}>Give it a job before you use it</div>
        </div>
        <button
          onClick={() => (unsorted > 0 ? onPush('sort') : undefined)}
          disabled={unsorted === 0}
          style={{
            alignSelf: 'center',
            padding: '10px 16px',
            borderRadius: '12px',
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#fff',
            background: unsorted > 0 ? 'var(--brand)' : 'var(--disabled)',
            flex: 'none',
          }}
        >
          Sort
        </button>
      </div>

      {(['spend', 'save', 'give', 'grow'] as Category[]).map((cat) => {
        const meta = CATEGORY_META[cat];
        const catWallets = wallets.filter((w) => w.category === cat);
        const catTotal = categoryTotal(wallets, balances, cat);
        const isOpen = open === cat;
        const count = catWallets.length;
        return (
          <div key={cat}>
            <button
              onClick={() => setOpen(isOpen ? null : cat)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '13px',
                background: `var(--${cat}-tint)`,
                borderRadius: isOpen ? '20px 20px 0 0' : '20px',
                padding: '15px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '13px',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  flex: 'none',
                }}
              >
                {meta.emoji}
              </div>
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: `var(--${cat}-deep)` }}>{meta.name}</div>
                <div style={{ fontSize: '10.5px', color: `var(--${cat}-deep)`, opacity: 0.75 }}>
                  {cat === 'give'
                    ? meta.meta
                    : `${count} ${count === 1 ? meta.meta.replace(/s( |·)/, '$1') : meta.meta}`}
                </div>
              </div>
              <div style={{ font: `700 20px var(--display)`, color: `var(--${cat}-deep)` }}>{money(catTotal)}</div>
              <div
                style={{
                  fontSize: '20px',
                  color: `var(--${cat}-deep)`,
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform .2s',
                }}
              >
                {'⌄'}
              </div>
            </button>
            {isOpen ? (
              <div
                style={{
                  background: '#fff',
                  padding: '14px',
                  borderRadius: '0 0 20px 20px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                {catWallets.map((w) => (
                  <PocketCard key={w.id} wallet={w} balance={balances[w.id] ?? 0} masked={masked} onPush={onPush} />
                ))}
                <DashedCard label={cat === 'give' ? '+ Giving history' : `+ New ${cat === 'spend' ? 'envelope' : cat === 'save' ? 'dream' : 'item'}`} />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

function PocketCard({
  wallet,
  balance,
  masked,
  onPush,
}: {
  wallet: Wallet;
  balance: number;
  masked: boolean;
  onPush: (screen: string) => void;
}) {
  const hasRing = wallet.kind === 'dream' && wallet.targetAmount;
  const pct = hasRing ? Math.min(100, (balance / (wallet.targetAmount ?? 1)) * 100) : 0;
  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '13px',
        minHeight: '96px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {hasRing ? (
        <div style={{ position: 'relative', width: '40px', height: '40px' }}>
          <ProgressRing size={40} stroke={4} pct={pct} color="var(--save)" />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            {wallet.kind === 'dream' ? '🚲' : '💭'}
          </div>
        </div>
      ) : (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '11px',
            background: `var(--${wallet.category}-tint)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          {wallet.kind === 'instrument' ? '🌱' : '💭'}
        </div>
      )}
      <div style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {wallet.name}
      </div>
      <div style={{ font: `700 17px var(--display)` }}>{masked ? 'Rp ••••' : formatRp(balance)}</div>
      <div style={{ fontSize: '9.5px', lineHeight: 1.3, color: 'var(--ink-soft)' }}>
        {hasRing
          ? `Dream · ${Math.round(pct)}% of ${formatRp(wallet.targetAmount ?? 0)}`
          : wallet.kind === 'free_savings'
            ? 'No target yet'
            : `${wallet.category[0]?.toUpperCase()}${wallet.category.slice(1)} envelope`}
      </div>
      {wallet.kind === 'instrument' ? (
        <button
          onClick={() => onPush('grow')}
          style={{
            alignSelf: 'flex-start',
            background: 'var(--grow)',
            color: '#fff',
            borderRadius: '9px',
            padding: '6px 10px',
            fontSize: '10.5px',
            fontWeight: 700,
          }}
        >
          Harvest
        </button>
      ) : null}
    </div>
  );
}

function DashedCard({ label }: { label: string }) {
  return (
    <div
      style={{
        border: '2px dashed var(--line)',
        borderRadius: '16px',
        minHeight: '96px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
      }}
    >
      <div style={{ fontSize: '22px', color: 'var(--ink-soft)' }}>{'＋'}</div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textAlign: 'center', padding: '0 8px' }}>
        {label}
      </div>
    </div>
  );
}
