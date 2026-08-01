'use client';

import { useEffect, useState } from 'react';
import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import { canGrowInFrom, tdInterest, type Prices, type Tenor } from '@core/grow';
import type { KidData } from '../../../lib/kid/data';
import { supabaseForKid, type KidSession } from '../../../lib/kid/session';
import { AmountCard, PickLabel, PushBody, PushCta, PushScreen, SelectCard, SelectRow } from './shell';

const en = dictionaries.en;

type Sub = 'hub' | 'buy-td' | 'harvest-td';

/**
 * Grow — kid-mobile.source.jsx growScreen()/buyfxScreen()/harvestTdScreen() (:997-1092).
 * **Time Deposit saja.** Gold & valas TIDAK diport: keduanya butuh riwayat harga per-lot
 * (cost basis) untuk menghitung nilai sekarang, dan infrastrukturnya (`daily_prices` diisi,
 * dipakai) belum ada — memalsukannya supaya "terlihat lengkap" persis yang dihindari D-C.
 */
export function GrowScreen({
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
  const [sub, setSub] = useState<Sub>('hub');

  const tdWallets = data.wallets.filter((w) => w.instrument === 'time_deposit');
  const matured = tdWallets.filter((w) => isMatured(w.startedAt, w.tenorMonths));
  const pending = tdWallets.filter((w) => w.startedAt && !isMatured(w.startedAt, w.tenorMonths));

  if (sub === 'buy-td') {
    return <BuyTdScreen data={data} session={session} onBack={() => setSub('hub')} onDone={onDone} />;
  }
  if (sub === 'harvest-td' && matured[0]) {
    return (
      <HarvestTdScreen
        data={data}
        session={session}
        wallet={matured[0]}
        onBack={() => setSub('hub')}
        onDone={onDone}
      />
    );
  }

  return (
    <PushScreen title={en.grow.title} onBack={onBack}>
      <PushBody>
        <div
          style={{
            background: 'var(--grow-tint)',
            borderRadius: '16px',
            padding: '13px 15px',
            fontSize: '11.5px',
            color: 'var(--grow-deep)',
            lineHeight: 1.4,
          }}
        >
          {en.grow.needsGrownUp} {en.grow.onlyWayOut}.
        </div>

        {matured.length > 0 ? (
          <GrowOption
            emoji="🏦"
            name="Time Deposit — ready!"
            desc={`${formatRp(data.balances[matured[0]!.id] ?? 0)} · ${en.grow.matured}`}
            onClick={() => setSub('harvest-td')}
          />
        ) : null}

        {pending.map((w) => (
          <GrowOption
            key={w.id}
            emoji="🏦"
            name={w.name}
            desc={`${formatRp(data.balances[w.id] ?? 0)} · not ready yet`}
            onClick={() => {}}
          />
        ))}

        <GrowOption
          emoji="🏦"
          name="Time Deposit"
          desc="Lock money for 3, 6 or 12 months for interest"
          onClick={() => setSub('buy-td')}
        />
        <GrowOption emoji="🪙" name="Gold" desc="Not built yet — needs daily prices (see docs/PROGRESS.md)" onClick={() => {}} disabled />
        <GrowOption
          emoji="💵"
          name="Foreign currency"
          desc="Not built yet — needs daily prices (see docs/PROGRESS.md)"
          onClick={() => {}}
          disabled
        />
      </PushBody>
    </PushScreen>
  );
}

function GrowOption({
  emoji,
  name,
  desc,
  onClick,
  disabled,
}: {
  emoji: string;
  name: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: '100%',
        textAlign: 'left',
        background: '#fff',
        borderRadius: '18px',
        padding: '15px',
        boxShadow: 'var(--sh-card)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'var(--grow-tint)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '23px',
          flex: 'none',
        }}
      >
        {emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{name}</div>
        <div style={{ fontSize: '11px', color: 'var(--ink-soft)', lineHeight: 1.3, marginTop: '1px' }}>{desc}</div>
      </div>
      {!disabled ? <div style={{ color: 'var(--ink-soft)', fontSize: '18px' }}>{'›'}</div> : null}
    </button>
  );
}

function isMatured(startedAt?: string, tenorMonths?: number): boolean {
  if (!startedAt || !tenorMonths) return false;
  const start = new Date(startedAt);
  const mature = new Date(start);
  mature.setMonth(mature.getMonth() + tenorMonths);
  return mature.getTime() <= Date.now();
}

function BuyTdScreen({
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
  const sources = data.wallets.filter((w) => canGrowInFrom(w));
  const [srcId, setSrcId] = useState<string | null>(null);
  const [tenor, setTenor] = useState<Tenor | null>(null);
  const [amount, setAmount] = useState(0);
  const [rates, setRates] = useState({ m3: 0, m6: 0, m12: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const step = 10000;

  useEffect(() => {
    const client = supabaseForKid(session);
    void client
      .from('bank_rates')
      .select('m3,m6,m12')
      .maybeSingle()
      .then(({ data: r }) => {
        if (r) setRates({ m3: Number(r.m3), m6: Number(r.m6), m12: Number(r.m12) });
      });
  }, [session]);

  const src = data.wallets.find((w) => w.id === srcId) ?? null;
  const balance = src ? (data.balances[src.id] ?? 0) : 0;
  const prices: Prices = { goldSellPerGram: 0, goldBuybackPerGram: 0, fxMid: {}, fxSpread: 0, bankRates: rates, updatedAt: '' };
  const interest = tenor ? tdInterest(amount, tenor, prices) : 0;
  const ok = Boolean(src && tenor && amount > 0 && amount <= balance);

  async function submit() {
    if (!ok || !src || !tenor) return;
    setBusy(true);
    setError(null);
    const res = await fetch('/api/kid/grow/buy', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ childId: data.child.id, sourceWalletId: src.id, amount, tenorMonths: tenor }),
    });
    setBusy(false);
    if (!res.ok) {
      setError('That did not send. Try again.');
      return;
    }
    onDone('Grow request sent 🌱');
  }

  return (
    <PushScreen title="Time Deposit" onBack={onBack}>
      <PushBody>
        <div style={{ background: 'var(--grow-tint)', borderRadius: '16px', padding: '13px 15px', fontSize: '11.5px', color: 'var(--grow-deep)', lineHeight: 1.4 }}>
          {en.grow.needsGrownUp}
        </div>

        <PickLabel text={en.grow.pickTenor} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {([3, 6, 12] as Tenor[]).map((t) => (
            <SelectCard
              key={t}
              emoji="🏦"
              name={`${t} mo`}
              sub={`${rates[t === 3 ? 'm3' : t === 6 ? 'm6' : 'm12']}%`}
              selected={tenor === t}
              onClick={() => setTenor(t)}
              accent="#2FC078"
            />
          ))}
        </div>

        <PickLabel text={en.grow.addMoneyFrom} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {sources.map((w) => (
            <SelectCard
              key={w.id}
              emoji={w.category === 'unsorted' ? '🪙' : w.category === 'spend' ? '🍡' : '🏦'}
              name={w.name}
              sub={formatRp(data.balances[w.id] ?? 0)}
              selected={srcId === w.id}
              onClick={() => {
                setSrcId(w.id);
                setAmount(0);
              }}
              accent="#6C4CE0"
            />
          ))}
        </div>

        <PickLabel text={en.grow.howMuch} />
        <AmountCard
          amount={amount}
          color={src ? 'var(--ink)' : 'var(--line)'}
          onMinus={() => setAmount((a) => Math.max(0, a - step))}
          onPlus={() => setAmount((a) => Math.min(a + step, balance))}
          disMinus={amount <= 0}
          disPlus={!src || amount >= balance}
        />

        {tenor && amount > 0 ? (
          <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', textAlign: 'center' }}>
            {en.grow.promisedInterest.replace('{amount}', formatRp(interest))}
          </div>
        ) : null}

        {error ? <div style={{ fontSize: '12px', color: 'var(--loss)', textAlign: 'center' }}>{error}</div> : null}
      </PushBody>
      <PushCta label={busy ? '…' : en.grow.submit} enabled={ok && !busy} onClick={submit} />
    </PushScreen>
  );
}

function HarvestTdScreen({
  session,
  wallet,
  data,
  onBack,
  onDone,
}: {
  session: KidSession;
  wallet: { id: string; name: string };
  data: KidData;
  onBack: () => void;
  onDone: (toast: string) => void;
}) {
  const [choice, setChoice] = useState<'cash_out' | 'roll_over' | 'take_profit' | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const principal = data.balances[wallet.id] ?? 0;

  async function submit() {
    if (!choice) return;
    setBusy(true);
    setError(null);
    const res = await fetch('/api/kid/grow/harvest', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ childId: data.child.id, walletId: wallet.id, choice }),
    });
    setBusy(false);
    if (!res.ok) {
      setError('That did not send. Try again.');
      return;
    }
    onDone('Harvest request sent — it will land in Save 🏦');
  }

  return (
    <PushScreen title={`${en.grow.harvest} · Time Deposit`} onBack={onBack}>
      <PushBody>
        <div style={{ background: 'var(--grow-tint)', borderRadius: '18px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--grow-deep)', textTransform: 'uppercase' }}>
            {wallet.name} · {en.grow.matured} ✅
          </div>
          <div style={{ margin: '6px 0 2px', font: `700 32px var(--display)`, color: 'var(--grow-deep)' }}>{formatRp(principal)}</div>
        </div>

        <PickLabel text="What next?" />
        <SelectRow emoji="💰" name={en.grow.cashOut} desc={en.grow.harvestLockedToSave} selected={choice === 'cash_out'} onClick={() => setChoice('cash_out')} accent="#2FC078" tint="var(--grow-tint)" />
        <SelectRow emoji="🔄" name={en.grow.rollOver} desc="Starts a new deposit with all of it" selected={choice === 'roll_over'} onClick={() => setChoice('roll_over')} accent="#2FC078" tint="var(--grow-tint)" />
        <SelectRow emoji="✨" name={en.grow.takeProfit} desc="Interest to Save, rest keeps working" selected={choice === 'take_profit'} onClick={() => setChoice('take_profit')} accent="#2FC078" tint="var(--grow-tint)" />

        {error ? <div style={{ fontSize: '12px', color: 'var(--loss)', textAlign: 'center' }}>{error}</div> : null}
      </PushBody>
      <PushCta label={busy ? '…' : en.grow.submit} enabled={Boolean(choice) && !busy} onClick={submit} />
    </PushScreen>
  );
}
