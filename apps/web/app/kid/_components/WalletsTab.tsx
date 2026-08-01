'use client';

import { useState } from 'react';
import { formatRp, parseRp, formatRpInput } from '@core/money';
import type { Category, Wallet } from '@core/types';
import { categoryTotal, type KidData } from '../../../lib/kid/data';
import { ProgressRing } from './shell';
import { supabaseForKid, type KidSession } from '../../../lib/kid/session';

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

export function WalletsTab({
  data,
  session,
  onPush,
  onChanged,
}: {
  data: KidData;
  session: KidSession;
  onPush: (screen: string) => void;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState<Category | null>('spend');
  const [masked, setMasked] = useState(false);
  const [creating, setCreating] = useState<'spend' | 'save' | null>(null);
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
                {cat === 'give' ? (
                  <DashedCard label="+ Giving history" onClick={() => onPush('history')} />
                ) : cat === 'spend' || cat === 'save' ? (
                  <DashedCard
                    label={`+ New ${cat === 'spend' ? 'envelope' : 'dream'}`}
                    onClick={() => setCreating(cat)}
                  />
                ) : (
                  <DashedCard label="+ Grow money" onClick={() => onPush('grow')} />
                )}
              </div>
            ) : null}
          </div>
        );
      })}

      {creating ? (
        <CreateWalletSheet
          category={creating}
          session={session}
          onClose={() => setCreating(null)}
          onCreated={() => {
            setCreating(null);
            onChanged();
          }}
        />
      ) : null}
    </>
  );
}

/**
 * "+ New envelope"/"+ New dream" — TIDAK ADA di mockup (kartu dashed-nya tanpa `onClick`,
 * kid-wallets.md §5 ⚠️). Dibangun karena rencana Tahap 1 secara eksplisit menyebut "Dreams:
 * buat" sebagai cakupan — bukan tebakan bebas, tapi juga bukan port (tidak ada gaya acuan).
 * Ditulis lewat RLS langsung (`wallets_write: can_see_child`), bukan route handler — beda
 * dengan Sort/Move/Cash-out yang menyentuh ledger (0009 tidak membatasi `wallets`, hanya
 * `ledger_entries`).
 */
function CreateWalletSheet({
  category,
  session,
  onClose,
  onCreated,
}: {
  category: 'spend' | 'save';
  session: KidSession;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [asDream, setAsDream] = useState(category === 'save');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    const client = supabaseForKid(session);
    const { error: err } = await client.from('wallets').insert({
      child_id: session.childId,
      name: name.trim(),
      category,
      kind: category === 'spend' ? 'envelope' : asDream ? 'dream' : 'free_savings',
      target_amount: category === 'save' && asDream && target ? parseRp(target) : null,
    });
    setBusy(false);
    if (err) {
      setError('That did not save. Try again.');
      return;
    }
    onCreated();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        background: 'rgba(20,16,36,.4)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--canvas)',
          borderRadius: '28px 28px 0 0',
          padding: '20px 18px 28px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ font: `700 18px var(--display)`, color: 'var(--ink)' }}>
          {category === 'spend' ? 'New envelope' : 'New dream'}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={category === 'spend' ? 'e.g. Snacks' : 'e.g. BMX Bike'}
          style={{
            border: '1px solid var(--line)',
            borderRadius: '13px',
            padding: '12px 14px',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        />
        {category === 'save' ? (
          <>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--ink)' }}>
              <input type="checkbox" checked={asDream} onChange={(e) => setAsDream(e.target.checked)} />
              Has a target amount
            </label>
            {asDream ? (
              <input
                value={target}
                onChange={(e) => setTarget(formatRpInput(e.target.value))}
                placeholder="Target, e.g. 300.000"
                inputMode="numeric"
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '13px',
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                }}
              />
            ) : null}
          </>
        ) : null}
        {error ? <div style={{ fontSize: '12px', color: 'var(--loss)' }}>{error}</div> : null}
        <button
          onClick={submit}
          disabled={!name.trim() || busy}
          style={{
            marginTop: '6px',
            borderRadius: '16px',
            padding: '15px',
            fontWeight: 700,
            fontSize: '14px',
            color: '#fff',
            background: name.trim() && !busy ? 'var(--brand)' : 'var(--disabled)',
          }}
        >
          {busy ? '…' : 'Create'}
        </button>
      </div>
    </div>
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

function DashedCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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
    </button>
  );
}
