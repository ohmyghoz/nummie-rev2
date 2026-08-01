'use client';

import { formatRp } from '@core/money';
import type { KidData } from '../../../lib/kid/data';
import { categoryTotal } from '../../../lib/kid/data';

/** Sheet FAB "＋ Money" — kid-mobile.source.jsx sheet() :783. Dua grup: langsung vs butuh OK. */
export function MoneySheet({
  data,
  onClose,
  onPush,
}: {
  data: KidData;
  onClose: () => void;
  onPush: (screen: string) => void;
}) {
  const unsorted = categoryTotal(data.wallets, data.balances, 'unsorted');

  const go = (screen: string) => {
    onClose();
    onPush(screen);
  };

  const Row = ({
    emoji,
    tint,
    name,
    desc,
    onClick,
    needs,
  }: {
    emoji: string;
    tint: string;
    name: string;
    desc: string;
    onClick: () => void;
    needs?: boolean;
  }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        background: '#fff',
        borderRadius: '16px',
        padding: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '13px',
          background: tint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flex: 'none',
        }}
      >
        {emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{name}</div>
          {needs ? <NeedsChip /> : null}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '1px', lineHeight: 1.3 }}>{desc}</div>
      </div>
      <div style={{ color: 'var(--ink-soft)', fontSize: '18px' }}>{'›'}</div>
    </button>
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(20,16,36,.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--canvas)',
          borderRadius: '28px 28px 0 0',
          padding: '12px 18px 26px',
          maxHeight: '86%',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '44px', height: '5px', borderRadius: '3px', background: 'var(--line)', margin: '2px auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ font: `700 19px var(--display)`, color: 'var(--ink)' }}>What do you want to do?</div>
          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '11px',
              background: '#fff',
              boxShadow: 'var(--sh-card)',
              fontSize: '15px',
              color: 'var(--ink-soft)',
            }}
          >
            {'✕'}
          </button>
        </div>

        <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '.5px', color: 'var(--ink-soft)', margin: '0 2px 8px' }}>
          MANAGE MY MONEY · HAPPENS RIGHT AWAY
        </div>
        {unsorted > 0 ? (
          <Row emoji="🪙" tint="var(--brand-tint)" name="Sort new money" desc={`${formatRp(unsorted)} unsorted — split it into wallets`} onClick={() => go('sort')} />
        ) : null}
        {/* "Give" ada di grup ini persis posisinya di mockup (sheet() :799, g1) — meski
            fungsinya sebenarnya butuh OK ortu (ADR-0002/0006), sama seperti Cash out/Grow.
            Konflik dicatat MR-11 (docs/mockup-review.md), bukan dipindah diam-diam. */}
        <Row emoji="💝" tint="var(--give-tint)" name="Give" desc="Set money aside to share" onClick={() => go('giveaway')} />
        <Row emoji="🔄" tint="var(--surface-2)" name="Move between wallets" desc="Shift a balance from one wallet to another" onClick={() => go('move')} />

        <div style={{ height: '1px', background: 'var(--line)', margin: '12px 2px' }} />

        <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '.5px', color: 'var(--ink-soft)', margin: '0 2px 8px' }}>
          ASK A GROWN-UP · NEEDS THEIR OK
        </div>
        <Row emoji="🌱" tint="var(--grow-tint)" name="Grow my money" desc="Put money into a time deposit or gold" onClick={() => go('grow')} needs />
        <Row emoji="💸" tint="var(--spend-tint)" name="Cash out" desc="Turn app balance into real money or an item" onClick={() => go('cashout')} needs />
      </div>
    </div>
  );
}

function NeedsChip() {
  return (
    <div
      style={{
        fontSize: '8.5px',
        fontWeight: 800,
        letterSpacing: '.5px',
        color: '#B77908',
        background: '#FFF4DE',
        padding: '2px 7px',
        borderRadius: '7px',
        border: '1px solid #FFE2A8',
        whiteSpace: 'nowrap',
      }}
    >
      NEEDS OK
    </div>
  );
}
