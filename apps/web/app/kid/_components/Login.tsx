'use client';

import { useState } from 'react';
import { dictionaries } from '@copy';

const en = dictionaries.en;
import { tr } from '../../../lib/i18n';
import { loginKid, type KidSession } from '../../../lib/kid/session';

/**
 * Layar login `/kid` — DIRANCANG, bukan diport (tidak ada di mockup manapun,
 * AGENTS.md §1 T1.1). Gaya mengikuti kartu putih + brand grape khas mockup anak;
 * copy sudah terkunci di copy/en.ts §login (ADR-0024: email ortu + PIN).
 */
export function Login({ onSuccess }: { onSuccess: (session: KidSession) => void }) {
  const t = en.login;
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function submit() {
    if (!email || pin.length !== 6 || busy) return;
    setBusy(true);
    setFailed(false);
    const result = await loginKid(email.trim(), pin);
    setBusy(false);
    if (result.ok) {
      onSuccess(result.session);
    } else {
      setFailed(true);
    }
  }

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
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--sh-card)',
          padding: '28px',
          maxWidth: '360px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              font: `700 26px var(--display)`,
              color: 'var(--brand)',
              letterSpacing: '-.02em',
            }}
          >
            {t.title}
          </div>
          <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
            {t.subtitle}
          </div>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>{t.parentEmail}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={{
              border: '1px solid var(--line)',
              borderRadius: '13px',
              padding: '13px 14px',
              fontSize: '15px',
              fontFamily: 'inherit',
            }}
          />
          <span style={{ fontSize: '11px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
            {t.parentEmailHint}
          </span>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
            {tr(t.pin, { length: 6 })}
          </span>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            style={{
              border: '1px solid var(--line)',
              borderRadius: '13px',
              padding: '13px 14px',
              fontSize: '20px',
              letterSpacing: '6px',
              textAlign: 'center',
              fontFamily: 'inherit',
            }}
          />
          <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{t.pinHint}</span>
        </label>

        {failed ? (
          <div style={{ fontSize: '12.5px', color: 'var(--loss)', lineHeight: 1.4 }}>{t.failed}</div>
        ) : null}

        <button
          onClick={submit}
          disabled={!email || pin.length !== 6 || busy}
          style={{
            borderRadius: '16px',
            padding: '15px',
            fontSize: '15px',
            fontWeight: 700,
            color: '#fff',
            background: !email || pin.length !== 6 || busy ? 'var(--disabled)' : 'var(--brand)',
            boxShadow: !email || pin.length !== 6 || busy ? 'none' : '0 8px 24px rgba(108,76,224,.35)',
          }}
        >
          {busy ? '…' : t.submit}
        </button>

        <div style={{ fontSize: '11px', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.4 }}>
          {t.askGrownUp}
        </div>
      </div>
    </div>
  );
}
