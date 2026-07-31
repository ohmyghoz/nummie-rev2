'use client';

import { useState } from 'react';
import { dictionaries } from '@copy';
import { tierAgeRange } from '@core/onboarding';
import { tr } from '../../../lib/i18n';
import type { Session } from '@supabase/supabase-js';

const en = dictionaries.en;
const range = tierAgeRange('middle');

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  border: '2px solid var(--line)',
  borderRadius: '14px',
  padding: '13px 14px',
  fontWeight: 500,
  fontSize: '14px',
  color: 'var(--ink)',
  background: '#fff',
  fontFamily: 'inherit',
};

/**
 * Onboarding wajib — "Add a child" (rencana Tahap 2 no.4). Tier terkunci Middle (ADR-0020),
 * PIN hanya bisa diisi di sini — mengganti lewat Settings, tidak pernah lewat sini lagi
 * (pelajaran repo lama: PIN yang bisa diisi ulang bebas = lubang keamanan).
 */
export function Onboarding({ session, onCreated }: { session: Session; onCreated: () => void }) {
  const t = en.addChild;
  const [name, setName] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  const canSubmit = name.trim() && month && year && pin.length === 6 && !busy;

  async function submit() {
    setBusy(true);
    setError(null);
    const res = await fetch('/api/parent/child', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ name: name.trim(), birthMonth: Number(month), birthYear: Number(year), pin }),
    });
    setBusy(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(errorCopy(body.error));
      return;
    }
    setCreated(true);
  }

  if (created) {
    return (
      <Card>
        <div style={{ font: `600 22px var(--display)`, color: 'var(--ink)' }}>{'✅'}</div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5 }}>
          {tr(t.created, { name })}
        </div>
        <button
          onClick={onCreated}
          style={{
            marginTop: '20px',
            width: '100%',
            border: 0,
            borderRadius: '16px',
            padding: '15px',
            fontWeight: 700,
            fontSize: '14px',
            color: '#fff',
            background: 'var(--brand-grad)',
          }}
        >
          Go to dashboard
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <h1 style={{ margin: '0 0 6px', font: `600 26px var(--display)`, color: 'var(--ink)' }}>{t.title}</h1>
      <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '20px', lineHeight: 1.5 }}>
        {tr(t.tierOnly, { tier: 'Middle', min: range.min, max: range.max ?? '' })}
      </div>

      <Field label={t.name}>
        <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
      </Field>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <Field label={t.month}>
            <input
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={inputStyle}
            />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label={t.year}>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} style={inputStyle} />
          </Field>
        </div>
      </div>
      <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)', margin: '-10px 0 16px' }}>{t.privacy}</div>

      <Field label={t.pin}>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          style={{ ...inputStyle, letterSpacing: '6px', textAlign: 'center', fontSize: '18px' }}
        />
      </Field>
      <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)', margin: '-10px 0 20px' }}>
        {tr(t.pinHint, { length: 6 })}
      </div>

      {error ? <div style={{ fontSize: '12.5px', color: 'var(--loss)', marginBottom: '14px' }}>{error}</div> : null}

      <button
        onClick={submit}
        disabled={!canSubmit}
        style={{
          width: '100%',
          border: 0,
          borderRadius: '16px',
          padding: '16px',
          fontWeight: 700,
          fontSize: '14px',
          color: '#fff',
          background: canSubmit ? 'var(--brand-grad)' : 'var(--disabled)',
          boxShadow: canSubmit ? '0 8px 30px rgba(108,76,224,.28)' : 'none',
        }}
      >
        {busy ? '…' : tr(t.submit, { name: name.trim() || '…' })}
      </button>
    </Card>
  );

  function errorCopy(key?: string): string {
    switch (key) {
      case 'child.nameRequired':
        return t.nameRequired;
      case 'child.birthMonthInvalid':
        return t.birthMonthInvalid;
      case 'child.birthYearInvalid':
        return t.birthYearInvalid;
      case 'child.pinLength':
        return tr(t.pinLength, { length: 6 });
      case 'child.pinDigitsOnly':
        return t.pinDigitsOnly;
      case 'child.pinTaken':
        return t.pinTaken;
      default:
        return 'That did not work. Try again.';
    }
  }
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--canvas)',
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: '24px',
          boxShadow: 'var(--sh-2)',
          padding: '28px',
          maxWidth: '380px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontWeight: 700, fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '8px' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
