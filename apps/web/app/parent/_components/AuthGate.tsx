'use client';

import { useState } from 'react';
import { dictionaries } from '@copy';
import { PROVINCES, regenciesOf } from '@regions';
import {
  requestPasswordReset,
  signInParent,
  signUpParent,
} from '../../../lib/parent/session';

const en = dictionaries.en;

type Mode = 'signin' | 'signup' | 'reset';

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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 700,
  fontSize: '12px',
  color: 'var(--ink-soft)',
  marginBottom: '8px',
};

const submitStyle = (enabled: boolean): React.CSSProperties => ({
  display: 'block',
  width: '100%',
  border: 0,
  borderRadius: '16px',
  padding: '16px',
  fontWeight: 700,
  fontSize: '14px',
  color: '#fff',
  textAlign: 'center',
  background: enabled ? 'var(--brand-grad)' : 'var(--disabled)',
  boxShadow: enabled ? '0 8px 30px rgba(108,76,224,.28)' : 'none',
});

/**
 * Gerbang auth `/parent` — DEVIASI D-D (ADR-0023). "Welcome back"/"Sign in to be the bank."
 * dari mockup (parent-mobile.markup.html:26); sign up & reset dirancang, copy di copy/en.ts.
 */
export function AuthGate({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<Mode>('signin');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState<string | null>(null);

  // signin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // signup
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('ID');
  const [provinceCode, setProvinceCode] = useState('');
  const [city, setCity] = useState('');

  // reset
  const [resetEmail, setResetEmail] = useState('');

  async function submitSignIn() {
    setBusy(true);
    setError(null);
    const { error: err } = await signInParent(email.trim(), password);
    setBusy(false);
    if (err) {
      setError(en.parentSignIn.failed);
      return;
    }
    onSignedIn();
  }

  async function submitSignUp() {
    setBusy(true);
    setError(null);
    const provinceName = PROVINCES.find((p) => p.code === provinceCode)?.name ?? provinceCode;
    const { error: err } = await signUpParent({
      email: signupEmail.trim(),
      password: signupPassword,
      fullName,
      phone,
      country,
      province: country === 'ID' ? provinceName : provinceCode,
      city,
    });
    setBusy(false);
    if (err) {
      setError(err.message.toLowerCase().includes('already') ? en.parentSignUp.emailTaken : en.parentSignUp.failed);
      return;
    }
    // ADR-0023: langsung masuk setelah daftar, verifikasi email tidak memblokir.
    onSignedIn();
  }

  async function submitReset() {
    setBusy(true);
    setError(null);
    const { error: err } = await requestPasswordReset(resetEmail.trim());
    setBusy(false);
    if (err) {
      setError(en.parentResetPassword.failed);
      return;
    }
    setResetSent(resetEmail.trim());
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
          borderRadius: '24px',
          boxShadow: 'var(--sh-2)',
          padding: '28px',
          maxWidth: '380px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {mode === 'signin' ? (
          <>
            <Header title={en.parentSignIn.title} subtitle={en.parentSignIn.subtitle} />
            <Field label={en.parentSignIn.email}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            </Field>
            <Field label={en.parentSignIn.password}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </Field>
            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <button
                onClick={() => {
                  setMode('reset');
                  setError(null);
                }}
                style={{ fontSize: '12px', color: 'var(--brand)', fontWeight: 600 }}
              >
                {en.parentSignIn.forgotPassword}
              </button>
            </div>
            {error ? <ErrorText text={error} /> : null}
            <button
              onClick={submitSignIn}
              disabled={!email || !password || busy}
              style={submitStyle(Boolean(email && password && !busy))}
            >
              {busy ? '…' : en.parentSignIn.submit}
            </button>
            <Switch
              prompt={en.parentSignIn.noAccount}
              link={en.parentSignIn.signUpLink}
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
            />
          </>
        ) : null}

        {mode === 'signup' ? (
          <>
            <Header title={en.parentSignUp.title} subtitle={en.parentSignUp.subtitle} />
            <Field label={en.parentSignUp.fullName}>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
            </Field>
            <Field label={en.parentSignUp.email}>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label={en.parentSignUp.password}>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label={en.parentSignUp.phone}>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
            </Field>
            <Field label={en.parentSignUp.country}>
              <select value={country} onChange={(e) => setCountry(e.target.value)} style={inputStyle}>
                <option value="ID">Indonesia</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>
            {country === 'ID' ? (
              <>
                <Field label={en.parentSignUp.province}>
                  <select
                    value={provinceCode}
                    onChange={(e) => {
                      setProvinceCode(e.target.value);
                      setCity('');
                    }}
                    style={inputStyle}
                  >
                    <option value="">—</option>
                    {PROVINCES.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={en.parentSignUp.city}>
                  <select value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} disabled={!provinceCode}>
                    <option value="">—</option>
                    {regenciesOf(provinceCode).map((r) => (
                      <option key={r.code} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            ) : (
              <>
                <Field label={en.parentSignUp.province}>
                  <input value={provinceCode} onChange={(e) => setProvinceCode(e.target.value)} style={inputStyle} />
                  <Hint text={en.parentSignUp.freeTextHint} />
                </Field>
                <Field label={en.parentSignUp.city}>
                  <input value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />
                </Field>
              </>
            )}
            {error ? <ErrorText text={error} /> : null}
            <button
              onClick={submitSignUp}
              disabled={!fullName || !signupEmail || signupPassword.length < 8 || busy}
              style={submitStyle(Boolean(fullName && signupEmail && signupPassword.length >= 8 && !busy))}
            >
              {busy ? '…' : en.parentSignUp.submit}
            </button>
            <Switch
              prompt={en.parentSignUp.haveAccount}
              link={en.parentSignUp.signInLink}
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
            />
          </>
        ) : null}

        {mode === 'reset' ? (
          <>
            <Header title={en.parentResetPassword.title} subtitle={en.parentResetPassword.subtitle} />
            {resetSent ? (
              <div style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5, marginBottom: '16px' }}>
                {en.parentResetPassword.sent.replace('{email}', resetSent)}
              </div>
            ) : (
              <>
                <Field label={en.parentResetPassword.email}>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    style={inputStyle}
                  />
                </Field>
                {error ? <ErrorText text={error} /> : null}
                <button
                  onClick={submitReset}
                  disabled={!resetEmail || busy}
                  style={submitStyle(Boolean(resetEmail && !busy))}
                >
                  {busy ? '…' : en.parentResetPassword.submit}
                </button>
              </>
            )}
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <button
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setResetSent(null);
                }}
                style={{ fontSize: '12px', color: 'var(--brand)', fontWeight: 600 }}
              >
                {en.parentResetPassword.backToSignIn}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ margin: '0 0 24px' }}>
      <h1 style={{ margin: 0, font: `600 28px var(--display)`, color: 'var(--ink)', lineHeight: 1 }}>{title}</h1>
      <p style={{ margin: '7px 0 0', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Hint({ text }: { text: string }) {
  return <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)', marginTop: '6px' }}>{text}</div>;
}

function ErrorText({ text }: { text: string }) {
  return <div style={{ fontSize: '12.5px', color: 'var(--loss)', marginBottom: '14px', lineHeight: 1.4 }}>{text}</div>;
}

function Switch({ prompt, link, onClick }: { prompt: string; link: string; onClick: () => void }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '12px', color: 'var(--ink-soft)' }}>
      {prompt}{' '}
      <button onClick={onClick} style={{ color: 'var(--brand)', fontWeight: 700 }}>
        {link}
      </button>
    </div>
  );
}
