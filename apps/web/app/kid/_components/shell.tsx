'use client';

import type { ReactNode } from 'react';

/**
 * Primitif shell `/kid` — diport sekali, dipakai semua tab & push screen.
 * Sumber: docs/inventory/kid-shell.md · reference/mockup-source/kid-mobile.source.jsx
 *
 * Frame iPhone & status bar mockup TIDAK diport (§1–2 inventaris) — HP sungguhan
 * menggambar keduanya sendiri. Yang diganti: safe-area inset di scroll area.
 */

export type KidTab = 'home' | 'wallets' | 'missions' | 'me';

const NAV_ITEMS: Array<{ key: KidTab; emoji: string; label: string }> = [
  { key: 'home', emoji: '🏠', label: 'Home' },
  { key: 'wallets', emoji: '👛', label: 'Wallets' },
];
const NAV_ITEMS_RIGHT: Array<{ key: KidTab; emoji: string; label: string }> = [
  { key: 'missions', emoji: '🎯', label: 'Missions' },
  { key: 'me', emoji: '🙂', label: 'Me' },
];

export function ScrollArea({ children }: { children: ReactNode }) {
  return (
    <div
      className="cel-scroll"
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
    >
      <div style={{ height: 'max(12px, env(safe-area-inset-top))', flex: 'none' }} />
      <div
        style={{
          padding: '2px 18px 100px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function BottomNav({
  tab,
  onTab,
  onMoney,
}: {
  tab: KidTab;
  onTab: (t: KidTab) => void;
  onMoney: () => void;
}) {
  const item = (key: KidTab, emoji: string, label: string) => (
    <button
      key={key}
      onClick={() => onTab(key)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3px',
        flex: 1,
        padding: 0,
      }}
    >
      <div style={{ fontSize: '20px', filter: tab === key ? 'none' : 'grayscale(1) opacity(.7)' }}>
        {emoji}
      </div>
      <div
        style={{
          fontSize: '10px',
          fontWeight: tab === key ? 700 : 600,
          color: tab === key ? 'var(--brand)' : 'var(--ink-soft)',
        }}
      >
        {label}
      </div>
    </button>
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '78px',
        background: 'rgba(255,255,255,.92)',
        backdropFilter: 'blur(14px)',
        borderTop: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px 14px',
        zIndex: 40,
      }}
    >
      {NAV_ITEMS.map((n) => item(n.key, n.emoji, n.label))}
      <div style={{ flex: 1 }} />
      {NAV_ITEMS_RIGHT.map((n) => item(n.key, n.emoji, n.label))}
      <button
        onClick={onMoney}
        style={{
          position: 'absolute',
          left: '50%',
          top: '-24px',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          padding: 0,
        }}
      >
        <div
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '20px',
            background: 'var(--brand-grad)',
            border: '4px solid #fff',
            boxShadow: '0 8px 30px rgba(108,76,224,.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '30px',
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          {'＋'}
        </div>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand)' }}>Money</div>
      </button>
    </div>
  );
}

export function SectionLabel({
  title,
  link,
  onLink,
}: {
  title: string;
  link?: string;
  onLink?: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        margin: '2px 2px -4px',
      }}
    >
      <div style={{ font: `700 14px 'Plus Jakarta Sans'`, color: 'var(--ink)', minWidth: 0 }}>{title}</div>
      {link ? (
        <button
          onClick={onLink}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--brand)',
            padding: 0,
            flex: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {link}
        </button>
      ) : null}
    </div>
  );
}

export function PushHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <>
      <div style={{ height: 'max(12px, env(safe-area-inset-top))', flex: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 18px 12px' }}>
        <button
          onClick={onBack}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '13px',
            background: '#fff',
            boxShadow: 'var(--sh-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flex: 'none',
          }}
        >
          {'‹'}
        </button>
        <div
          style={{
            font: `700 20px var(--display)`,
            letterSpacing: '-.01em',
            color: 'var(--ink)',
            flex: 1,
          }}
        >
          {title}
        </div>
      </div>
    </>
  );
}

export function PushBody({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '4px 18px 120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {children}
    </div>
  );
}

export function PushCta({
  label,
  enabled,
  onClick,
}: {
  label: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 18px 24px',
        background: 'linear-gradient(to top, var(--canvas) 70%, transparent)',
      }}
    >
      <button
        onClick={enabled ? onClick : undefined}
        disabled={!enabled}
        style={{
          width: '100%',
          borderRadius: '16px',
          padding: '16px',
          fontSize: '15px',
          fontWeight: 700,
          color: '#fff',
          background: enabled ? 'var(--brand)' : 'var(--disabled)',
          boxShadow: enabled ? '0 8px 24px rgba(108,76,224,.35)' : 'none',
          cursor: enabled ? 'pointer' : 'default',
        }}
      >
        {label}
      </button>
    </div>
  );
}

export function PushScreen({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--canvas)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PushHeader title={title} onBack={onBack} />
      {children}
    </div>
  );
}

export function Stepper({
  value,
  onMinus,
  onPlus,
  disMinus,
  disPlus,
  render,
}: {
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  disMinus: boolean;
  disPlus: boolean;
  render: (v: number) => string;
}) {
  const btn = (disabled: boolean, onClick: () => void, glyph: string) => (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '11px',
        background: disabled ? 'var(--surface-2)' : '#fff',
        boxShadow: disabled ? 'none' : 'var(--sh-card)',
        color: disabled ? 'var(--line)' : 'var(--ink)',
        fontSize: '16px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {glyph}
    </button>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {btn(disMinus, onMinus, '−')}
      <div style={{ minWidth: '54px', textAlign: 'center', fontSize: '16px', fontWeight: 700 }}>
        {render(value)}
      </div>
      {btn(disPlus, onPlus, '+')}
    </div>
  );
}

/**
 * Ring donat hero + progress ring dream — `polar`/`arc`/`ring`/`progRing`,
 * kid-mobile.source.jsx :61-77, dipindah 1:1 (bukan direparafrase ke library chart).
 */
function polar(cx: number, cy: number, r: number, a: number): [number, number] {
  const rad = ((a - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const largeArc = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1}`;
}

export function Ring({
  size,
  stroke,
  segments,
  gap = 7,
}: {
  size: number;
  stroke: number;
  segments: Array<{ amount: number; color: string }>;
  gap?: number;
}) {
  const total = segments.reduce((s, x) => s + x.amount, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;
  let acc = 0;
  const paths = segments
    .filter((s) => s.amount > 0)
    .map((s, i) => {
      const f = s.amount / total;
      const a0 = acc * 360 + gap / 2;
      const a1 = (acc + f) * 360 - gap / 2;
      acc += f;
      return (
        <path key={i} d={arc(cx, cy, r, a0, a1)} stroke={s.color} strokeWidth={stroke} fill="none" strokeLinecap="round" />
      );
    });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      {paths}
    </svg>
  );
}

export function ProgressRing({
  size,
  stroke,
  pct,
  color,
  track,
}: {
  size: number;
  stroke: number;
  pct: number;
  color: string;
  track?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const on = c * Math.max(0, Math.min(1, pct / 100));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} stroke={track ?? 'var(--track)'} strokeWidth={stroke} fill="none" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${on} ${c - on}`}
      />
    </svg>
  );
}

/** Form primitif berulang di push screen uang — kid-mobile.source.jsx :1263-1283. */
export function PickLabel({ text }: { text: string }) {
  return <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', margin: '4px 2px -4px' }}>{text}</div>;
}

export function SelectCard({
  emoji,
  name,
  sub,
  selected,
  onClick,
  accent,
}: {
  emoji: string;
  name: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: selected ? `2px solid ${accent}` : '1px solid var(--line)',
        background: selected ? `${accent}14` : '#fff',
        borderRadius: '15px',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <div style={{ fontSize: '22px' }}>{emoji}</div>
      <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, textAlign: 'center' }}>
        {name}
      </div>
      {sub ? (
        <div style={{ fontSize: '10px', color: selected ? accent : 'var(--ink-soft)', fontWeight: 600 }}>{sub}</div>
      ) : null}
    </button>
  );
}

export function SelectRow({
  emoji,
  name,
  desc,
  selected,
  onClick,
  accent,
  tint,
}: {
  emoji: string;
  name: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
  accent: string;
  tint: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        border: selected ? `2px solid ${accent}` : '1px solid var(--line)',
        background: selected ? tint : '#fff',
        borderRadius: '16px',
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '13px',
          background: selected ? '#fff' : 'var(--surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '21px',
          flex: 'none',
        }}
      >
        {emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>{name}</div>
        <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '1px' }}>{desc}</div>
      </div>
      <div
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '999px',
          border: `2px solid ${selected ? accent : 'var(--line)'}`,
          background: selected ? accent : 'transparent',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          flex: 'none',
        }}
      >
        {selected ? '✓' : ''}
      </div>
    </button>
  );
}

export function ChipToggle({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: selected ? '1.5px solid var(--brand)' : '1px solid var(--line)',
        background: selected ? 'var(--brand-tint)' : '#fff',
        color: selected ? 'var(--brand-deep)' : 'var(--ink)',
        borderRadius: '999px',
        padding: '9px 15px',
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      style={{
        width: '100%',
        border: '1px solid var(--line)',
        borderRadius: '14px',
        padding: '13px',
        fontSize: '12.5px',
        fontFamily: 'inherit',
        color: 'var(--ink)',
        resize: 'none',
        background: '#fff',
      }}
    />
  );
}

/** Kartu nominal + stepper — dipakai Cash out/Move/Give/Buy FX (bentuk sama, sumber beda). */
export function AmountCard({
  amount,
  color,
  onMinus,
  onPlus,
  disMinus,
  disPlus,
}: {
  amount: number;
  color: string;
  onMinus: () => void;
  onPlus: () => void;
  disMinus: boolean;
  disPlus: boolean;
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '18px',
        padding: '16px',
        boxShadow: 'var(--sh-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ font: `700 26px var(--display)`, color }}>Rp{amount.toLocaleString('id-ID')}</div>
      <Stepper
        value={amount}
        onMinus={onMinus}
        onPlus={onPlus}
        disMinus={disMinus}
        disPlus={disPlus}
        render={(v) => `Rp${v.toLocaleString('id-ID')}`}
      />
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 90,
        background: 'var(--ink)',
        color: '#fff',
        padding: '11px 18px',
        borderRadius: '14px',
        fontSize: '12.5px',
        fontWeight: 600,
        maxWidth: '300px',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,.25)',
      }}
    >
      {message}
    </div>
  );
}
