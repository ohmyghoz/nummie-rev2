'use client';

import { useEffect, useState } from 'react';
import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import { SEND_SOURCES, takeTargets, type SendSource } from '@core/parent';
import type { Session } from '@supabase/supabase-js';
import { supabaseBrowser } from '../../../lib/supabase-browser';
import { walletFromRow, type WalletRow } from '../../../lib/kid/data';
import type { Wallet } from '@core/types';

const en = dictionaries.en;

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  border: '1px solid var(--line)',
  borderRadius: '13px',
  padding: '12px 14px',
  fontSize: '14px',
  fontFamily: 'inherit',
  background: '#fff',
};

function useWalletsAndBalances(childId: string) {
  const [wallets, setWallets] = useState<Wallet[] | null>(null);
  const [balances, setBalances] = useState<Record<string, number>>({});
  useEffect(() => {
    const client = supabaseBrowser();
    void Promise.all([
      client.from('wallets').select('*').eq('child_id', childId).is('archived_at', null),
      client.from('wallet_balances').select('wallet_id,balance').eq('child_id', childId),
    ]).then(([w, b]) => {
      setWallets(((w.data ?? []) as WalletRow[]).map(walletFromRow));
      const map: Record<string, number> = {};
      for (const row of (b.data ?? []) as Array<{ wallet_id: string; balance: number }>) map[row.wallet_id] = Number(row.balance);
      setBalances(map);
    });
  }, [childId]);
  return { wallets, balances };
}

/** Send money — packages/core/parent.ts: selalu mendarat di Unsorted, tidak pernah kategori. */
export function SendMoneyScreen({
  session,
  childId,
  childName,
  onBack,
  onDone,
}: {
  session: Session;
  childId: string;
  childName: string;
  onBack: () => void;
  onDone: (msg: string) => void;
}) {
  const [amount, setAmount] = useState(0);
  const [source, setSource] = useState<SendSource | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!source || amount <= 0) return;
    setBusy(true);
    setError(null);
    const res = await fetch('/api/parent/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ childId, amount, source, note }),
    });
    setBusy(false);
    if (!res.ok) {
      setError('That did not go through.');
      return;
    }
    onDone(`Sent ${formatRp(amount)} to ${childName}.`);
  }

  return (
    <Shell title={en.parent.sendTitle} childName={childName} onBack={onBack}>
      <Field label={en.parent.sendSource}>
        <select value={source ?? ''} onChange={(e) => setSource(e.target.value as SendSource)} style={inputStyle}>
          <option value="">{'—'}</option>
          {SEND_SOURCES.map((s) => (
            <option key={s} value={s}>
              {en.sendSource[s]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="How much">
        <input type="number" value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))} style={inputStyle} />
      </Field>
      <Field label={en.parent.sendNote}>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'none' }} />
      </Field>
      <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
        {en.parent.landsInUnsorted.replace('{child}', childName)}
      </div>
      {error ? <div style={{ fontSize: '12px', color: 'var(--loss)' }}>{error}</div> : null}
      <SubmitButton onClick={submit} busy={busy} disabled={!source || amount <= 0} label={en.parent.sendSubmit} />
    </Shell>
  );
}

/** Take money — kantong terlindungi tetap TAMPIL, digembok dengan sebab (ADR-0007). */
export function TakeMoneyScreen({
  session,
  childId,
  childName,
  onBack,
  onDone,
}: {
  session: Session;
  childId: string;
  childName: string;
  onBack: () => void;
  onDone: (msg: string) => void;
}) {
  const { wallets, balances } = useWalletsAndBalances(childId);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!wallets) return null;
  const targets = takeTargets(wallets);
  const selected = targets.find((t) => t.wallet.id === walletId);

  async function submit() {
    if (!walletId || amount <= 0 || !reason.trim()) return;
    setBusy(true);
    setError(null);
    const res = await fetch('/api/parent/take', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ childId, walletId, amount, reason: reason.trim() }),
    });
    setBusy(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error === 'take.protected' ? en.parent.protected : 'That did not go through.');
      return;
    }
    onDone(`Took ${formatRp(amount)} from ${childName}.`);
  }

  return (
    <Shell title={en.parent.takeTitle} childName={childName} onBack={onBack}>
      <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>{en.parent.protectedShownNotHidden}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {targets.map((t) => (
          <button
            key={t.wallet.id}
            disabled={t.locked}
            onClick={() => setWalletId(t.wallet.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: walletId === t.wallet.id ? '2px solid var(--brand)' : '1px solid var(--line)',
              borderRadius: '13px',
              padding: '12px 14px',
              background: t.locked ? 'var(--surface-2)' : '#fff',
              opacity: t.locked ? 0.7 : 1,
              textAlign: 'left',
            }}
          >
            <span>
              <b style={{ fontWeight: 700, fontSize: '13px', display: 'block' }}>{t.wallet.name}</b>
              {t.locked && t.reasonKey ? (
                <span style={{ fontSize: '10.5px', color: 'var(--loss)' }}>
                  {t.reasonKey === 'take.dreamProtected'
                    ? en.takeLock.dreamProtected
                    : t.reasonKey === 'take.giveProtected'
                      ? en.takeLock.giveProtected
                      : en.takeLock.growProtected}
                </span>
              ) : null}
            </span>
            <span style={{ fontWeight: 700, fontSize: '13px' }}>{formatRp(balances[t.wallet.id] ?? 0)}</span>
          </button>
        ))}
      </div>
      {selected ? (
        <>
          <Field label="How much">
            <input type="number" value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))} style={inputStyle} />
          </Field>
          <Field label={en.parent.takeReason}>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </Field>
        </>
      ) : null}
      {error ? <div style={{ fontSize: '12px', color: 'var(--loss)' }}>{error}</div> : null}
      <SubmitButton onClick={submit} busy={busy} disabled={!walletId || amount <= 0 || !reason.trim()} label={en.parent.takeSubmit} />
    </Shell>
  );
}

function Shell({ title, childName, onBack, children }: { title: string; childName: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--canvas)', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
        <button onClick={onBack} style={{ width: '40px', height: '40px', borderRadius: '13px', background: '#fff', boxShadow: 'var(--sh-1)', fontSize: '18px' }}>
          {'‹'}
        </button>
        <div>
          <div style={{ font: `700 20px var(--display)`, color: 'var(--ink)' }}>{title}</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{childName}</div>
        </div>
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--ink-soft)', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  );
}

function SubmitButton({ onClick, busy, disabled, label }: { onClick: () => void; busy: boolean; disabled: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={busy || disabled}
      style={{
        marginTop: '8px',
        border: 0,
        borderRadius: '14px',
        padding: '14px',
        fontWeight: 700,
        fontSize: '14px',
        color: '#fff',
        background: busy || disabled ? 'var(--disabled)' : 'var(--brand)',
      }}
    >
      {busy ? '…' : label}
    </button>
  );
}
