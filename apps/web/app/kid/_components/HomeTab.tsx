'use client';

import { dictionaries } from '@copy';

const en = dictionaries.en;
import { formatRp } from '@core/money';
import { tr } from '../../../lib/i18n';
import { categoryTotal, walletsTotal, type KidData } from '../../../lib/kid/data';
import { Ring, SectionLabel } from './shell';
import type { KidTab } from './shell';

/**
 * Tab Home — docs/inventory/kid-home.md. Cabang Middle saja (ADR-0020).
 * Warna kategori: nilai kanonik anak/console, bukan mockup ortu (MR-7, tokens.css §1).
 */
const CATEGORY_HEX = {
  unsorted: '#8A7CF0',
  spend: '#FF7A4D',
  save: '#2CA6E0',
  give: '#F056A0',
  grow: '#2FC078',
} as const;

export function HomeTab({
  data,
  onTab,
  onPush,
}: {
  data: KidData;
  onTab: (t: KidTab) => void;
  onPush: (screen: string) => void;
}) {
  const t = en.home;
  const { wallets, balances } = data;

  const unsorted = categoryTotal(wallets, balances, 'unsorted');
  const spend = categoryTotal(wallets, balances, 'spend');
  const save = categoryTotal(wallets, balances, 'save');
  const give = categoryTotal(wallets, balances, 'give');
  const grow = categoryTotal(wallets, balances, 'grow');
  const total = walletsTotal(wallets, balances);

  const segs = [
    { amount: unsorted, color: CATEGORY_HEX.unsorted },
    { amount: spend, color: CATEGORY_HEX.spend },
    { amount: save, color: CATEGORY_HEX.save },
    { amount: give, color: CATEGORY_HEX.give },
    { amount: grow, color: CATEGORY_HEX.grow },
  ];
  const nParts = segs.filter((s) => s.amount > 0).length;

  const dreams = wallets.filter((w) => w.kind === 'dream');
  const cards = [
    { emoji: '🍡', name: en.category.middle.spend, amount: spend, color: 'spend' as const },
    { emoji: '🏦', name: en.category.middle.save, amount: save, color: 'save' as const },
    { emoji: '💝', name: en.category.middle.give, amount: give, color: 'give' as const },
    { emoji: '🌱', name: en.category.middle.grow, amount: grow, color: 'grow' as const },
  ];

  const recent = data.ledger.slice(0, 3);

  return (
    <>
      {/* 1. Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
        <button
          onClick={() => onTab('me')}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'var(--surface-2)',
            boxShadow: '0 0 0 2px #FFB020',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flex: 'none',
          }}
        >
          🦊
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: `700 17px var(--display)`, color: 'var(--ink)', letterSpacing: '-.01em' }}>
            {tr(t.greeting, { child: data.child.name })}!
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)' }}>Let&apos;s check your money today</div>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: '999px',
            padding: '7px 12px',
            boxShadow: 'var(--sh-card)',
            fontSize: '13px',
            fontWeight: 700,
            flex: 'none',
          }}
        >
          ⭐ {data.starsBalance}
        </div>
      </div>

      {/* 2. Hero */}
      <div
        style={{
          background: '#fff',
          borderRadius: '26px',
          padding: '20px',
          boxShadow: 'var(--sh-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        <div style={{ position: 'relative', width: '118px', height: '118px', flex: 'none' }}>
          <Ring size={118} stroke={12} segments={segs} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--ink-soft)' }}>
              {en.common.total.toUpperCase()}
            </div>
            <div style={{ fontSize: '22px' }}>💰</div>
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            {t.totalLabel}
          </div>
          <div style={{ font: `700 34px var(--display)`, margin: '4px 0 6px', color: 'var(--ink)' }}>
            {formatRp(total)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-soft)', lineHeight: 1.35 }}>
            Split into {nParts} parts in the ring {'↖︎'}
          </div>
        </div>
      </div>

      {/* 3. Banner Unsorted */}
      {unsorted > 0 ? (
        <button
          onClick={() => onPush('sort')}
          style={{
            background: 'var(--brand-grad)',
            borderRadius: '22px',
            padding: '16px',
            boxShadow: '0 8px 30px rgba(108,76,224,.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '13px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flex: 'none',
            }}
          >
            🪙
          </div>
          <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
            <div style={{ font: `600 18px var(--display)`, color: '#fff' }}>
              {tr(t.justArrived, { amount: formatRp(unsorted) })}
            </div>
            <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.85)' }}>
              Not sorted yet {'—'} where should it go?
            </div>
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '999px',
              background: '#fff',
              color: 'var(--brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 700,
              flex: 'none',
            }}
          >
            {'→'}
          </div>
        </button>
      ) : null}

      {/* 4. Banner pending */}
      {data.pendingRequestCount > 0 ? (
        <button
          onClick={() => onPush('requests')}
          style={{
            border: '1px solid var(--line)',
            background: 'var(--surface-2)',
            borderRadius: '16px',
            padding: '11px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
          }}
        >
          <div style={{ fontSize: '18px' }}>{'⏳'}</div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)' }}>
              {data.pendingRequestCount} request{data.pendingRequestCount === 1 ? '' : 's'} waiting
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{en.common.waitingForGrownUp}</div>
          </div>
          <div style={{ fontSize: '16px', color: 'var(--ink-soft)' }}>{'›'}</div>
        </button>
      ) : null}

      {/* 5. My wallets */}
      <SectionLabel title={en.wallets.title} link="See all" onLink={() => onTab('wallets')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {cards.map((c) => (
          <button
            key={c.color}
            onClick={() => onTab('wallets')}
            style={{
              textAlign: 'left',
              background: '#fff',
              borderRadius: '20px',
              padding: '14px',
              boxShadow: 'var(--sh-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: `var(--${c.color}-tint)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              {c.emoji}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{c.name}</div>
            <div style={{ font: `700 20px var(--display)` }}>{formatRp(c.amount)}</div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'var(--track)' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: '3px',
                  width: `${total > 0 ? Math.min(100, (c.amount / total) * 100) : 0}%`,
                  background: `var(--${c.color})`,
                }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* 6. My dreams */}
      <SectionLabel title={t.myDreams} link="All dreams" onLink={() => onTab('wallets')} />
      {dreams.length === 0 ? (
        <EmptyState text="No dreams yet — start one from Wallets." />
      ) : (
        <div style={{ display: 'flex', gap: '12px' }}>
          {dreams.slice(0, 2).map((d) => {
            const saved = balances[d.id] ?? 0;
            const target = d.targetAmount ?? 0;
            const pct = target > 0 ? Math.min(100, (saved / target) * 100) : 0;
            return (
              <div
                key={d.id}
                style={{
                  flex: 1,
                  background: '#fff',
                  borderRadius: '18px',
                  padding: '14px',
                  boxShadow: 'var(--sh-card)',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)' }}>{d.name}</div>
                <div style={{ marginTop: '4px', fontSize: '10.5px', color: 'var(--ink-soft)' }}>
                  {formatRp(saved)} of {formatRp(target)} {'·'} {formatRp(Math.max(0, target - saved))} to go
                </div>
                <div style={{ marginTop: '8px', height: '6px', borderRadius: '3px', background: 'var(--track)' }}>
                  <div style={{ height: '100%', borderRadius: '3px', width: `${pct}%`, background: 'var(--save)' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 8. Aksi cepat */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => onPush('cashout')}
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: '16px',
            padding: '13px',
            boxShadow: 'var(--sh-card)',
            textAlign: 'center',
            fontSize: '12.5px',
            fontWeight: 600,
          }}
        >
          {'💸 Request cash out'}
        </button>
        <button
          onClick={() => onPush('move')}
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: '16px',
            padding: '13px',
            boxShadow: 'var(--sh-card)',
            textAlign: 'center',
            fontSize: '12.5px',
            fontWeight: 600,
          }}
        >
          {'🔄 Move money'}
        </button>
      </div>

      {/* 9. Just now */}
      <SectionLabel title="Just now" link="History" onLink={() => onPush('history')} />
      {recent.length === 0 ? (
        <EmptyState text="Nothing has happened yet." />
      ) : (
        <div style={{ background: '#fff', borderRadius: '20px', padding: '4px 14px', boxShadow: 'var(--sh-card)' }}>
          {recent.map((entry, i) => {
            const incoming = entry.fromWalletId === null;
            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: '11px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                }}
              >
                <div style={{ fontSize: '18px' }}>{incoming ? '🎁' : '🔄'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)' }}>{entry.reason}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)' }}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: incoming ? 'var(--grow)' : 'var(--ink)',
                  }}
                >
                  {incoming ? '+' : '−'}
                  {formatRp(entry.amount)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '18px',
        padding: '20px',
        boxShadow: 'var(--sh-card)',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--ink-soft)',
      }}
    >
      {text}
    </div>
  );
}
