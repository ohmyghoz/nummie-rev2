'use client';

import { useEffect, useState } from 'react';
import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import { ratioTotal, SPLITTABLE, validateAutoSplit } from '@core/rules';
import type { AllowanceFrequency } from '@core/settings';
import type { Category, MoneyRules, RuleMode } from '@core/types';
import type { Session } from '@supabase/supabase-js';
import { supabaseBrowser } from '../../../lib/supabase-browser';
import { walletFromRow, type WalletRow } from '../../../lib/kid/data';
import type { Wallet } from '@core/types';

const en = dictionaries.en;
const CATEGORY_COLOR: Record<Category, string> = { spend: '#FF7A4D', save: '#2CA6E0', give: '#F056A0', grow: '#2FC078' };

interface AllowanceState {
  enabled: boolean;
  amount: number;
  frequency: AllowanceFrequency;
  day: number;
}

/**
 * Settings per anak — Money rules + Allowance dari parent-mobile.markup.html "Settings"
 * screen (:420), disederhanakan: Investments/Bank rates/Today's prices/Account/Invite belum
 * diport (butuh Grow penuh & fitur lain yang masih stub — lihat docs/PROGRESS.md).
 */
export function SettingsScreen({
  session,
  childId,
  childName,
  onBack,
}: {
  session: Session;
  childId: string;
  childName: string;
  onBack: () => void;
}) {
  const [wallets, setWallets] = useState<Wallet[] | null>(null);
  const [rules, setRules] = useState<MoneyRules | null>(null);
  const [allowance, setAllowance] = useState<AllowanceState>({ enabled: false, amount: 0, frequency: 'weekly', day: 1 });
  const [savingRules, setSavingRules] = useState(false);
  const [savingAllowance, setSavingAllowance] = useState(false);
  const [runningAllowance, setRunningAllowance] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = supabaseBrowser();
    void Promise.all([
      client.from('wallets').select('*').eq('child_id', childId).is('archived_at', null),
      client.from('money_rules').select('*').eq('child_id', childId).maybeSingle(),
      client.from('allowance_schedules').select('*').eq('child_id', childId).maybeSingle(),
    ]).then(([walletsRes, rulesRes, allowRes]) => {
      setWallets(((walletsRes.data ?? []) as WalletRow[]).map(walletFromRow));

      const r = rulesRes.data as {
        mode: RuleMode;
        auto_split_enabled: boolean;
        ratios: Partial<Record<Category, number>>;
        destinations: Partial<Record<Category, string>>;
      } | null;
      setRules(
        r
          ? { childId, mode: r.mode, autoSplit: { enabled: r.auto_split_enabled, ratios: r.ratios ?? {}, destinations: r.destinations ?? {} } }
          : { childId, mode: 'flexible', autoSplit: { enabled: false, ratios: {}, destinations: {} } },
      );

      const a = allowRes.data as { enabled: boolean; amount: number; frequency: AllowanceFrequency; day: number } | null;
      if (a) setAllowance({ enabled: a.enabled, amount: a.amount, frequency: a.frequency, day: a.day });
    });
  }, [childId]);

  if (!wallets || !rules) return null;

  const validation = validateAutoSplit(rules);
  const total = ratioTotal(rules.autoSplit);

  function setRatio(cat: Category, value: number) {
    setRules((r) => (r ? { ...r, autoSplit: { ...r.autoSplit, ratios: { ...r.autoSplit.ratios, [cat]: value } } } : r));
  }
  function setDestination(cat: Category, walletId: string) {
    setRules((r) => (r ? { ...r, autoSplit: { ...r.autoSplit, destinations: { ...r.autoSplit.destinations, [cat]: walletId } } } : r));
  }

  async function saveRules() {
    if (!rules) return;
    setSavingRules(true);
    setError(null);
    // `money_rules` punya policy tulis untuk ortu langsung (RLS `rules_write`) — tidak perlu route handler.
    const client = supabaseBrowser();
    const { error: err } = await client.from('money_rules').upsert(
      {
        child_id: childId,
        mode: rules.mode,
        auto_split_enabled: rules.autoSplit.enabled,
        ratios: rules.autoSplit.ratios,
        destinations: rules.autoSplit.destinations,
      },
      { onConflict: 'child_id' },
    );
    setSavingRules(false);
    if (err) {
      setError('That did not save. Try again.');
      return;
    }
    setMessage(en.settings.saved);
  }

  async function saveAllowance() {
    setSavingAllowance(true);
    setError(null);
    const res = await fetch('/api/parent/allowance', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ childId, ...allowance }),
    });
    setSavingAllowance(false);
    if (!res.ok) {
      setError('That did not save. Try again.');
      return;
    }
    setMessage(en.settings.saved);
  }

  async function runAllowanceNow() {
    setRunningAllowance(true);
    setError(null);
    const res = await fetch('/api/parent/allowance/run', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ childId }),
    });
    setRunningAllowance(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error === 'no_schedule' ? 'Turn on allowance and save it first.' : 'That did not work.');
      return;
    }
    setMessage(`Sent ${formatRp(allowance.amount)} to ${childName}'s Unsorted.`);
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--canvas)', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
        <button onClick={onBack} style={{ width: '40px', height: '40px', borderRadius: '13px', background: '#fff', boxShadow: 'var(--sh-1)', fontSize: '18px' }}>
          {'‹'}
        </button>
        <div>
          <div style={{ font: `700 20px var(--display)`, color: 'var(--ink)' }}>{en.settings.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{childName}</div>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {message ? <Banner text={message} tone="ok" /> : null}
        {error ? <Banner text={error} tone="error" /> : null}

        {/* Allowance */}
        <Card title={en.settings.allowance}>
          <Row label="On" right={<Toggle checked={allowance.enabled} onChange={(v) => setAllowance((a) => ({ ...a, enabled: v }))} />} />
          {allowance.enabled ? (
            <>
              <Field label={en.settings.amount}>
                <input
                  type="number"
                  value={allowance.amount || ''}
                  onChange={(e) => setAllowance((a) => ({ ...a, amount: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </Field>
              <Field label={en.settings.frequency}>
                <select
                  value={allowance.frequency}
                  onChange={(e) => setAllowance((a) => ({ ...a, frequency: e.target.value as AllowanceFrequency, day: 1 }))}
                  style={inputStyle}
                >
                  <option value="weekly">{en.frequency.weekly}</option>
                  <option value="biweekly">{en.frequency.biweekly}</option>
                  <option value="monthly">{en.frequency.monthly}</option>
                </select>
              </Field>
              <Field label={en.settings.day}>
                <input
                  type="number"
                  min={allowance.frequency === 'monthly' ? 1 : 0}
                  max={allowance.frequency === 'monthly' ? 28 : 6}
                  value={allowance.day}
                  onChange={(e) => setAllowance((a) => ({ ...a, day: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </Field>
            </>
          ) : null}
          <SaveButton onClick={saveAllowance} busy={savingAllowance} label={en.settings.save} />
          {allowance.enabled ? (
            <button onClick={runAllowanceNow} disabled={runningAllowance} style={dashedButtonStyle}>
              {runningAllowance ? '…' : '▶ Run the next payment now'}
            </button>
          ) : null}
        </Card>

        {/* Money rules */}
        <Card title={en.parent.rulesTitle}>
          <div style={{ display: 'flex', gap: '2px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px', padding: '3px' }}>
            {(['flexible', 'strict'] as RuleMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setRules((r) => (r ? { ...r, mode: m } : r))}
                style={{
                  flex: 1,
                  border: 0,
                  background: rules.mode === m ? '#fff' : 'transparent',
                  boxShadow: rules.mode === m ? 'var(--sh-1)' : 'none',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  padding: '10px 4px',
                  borderRadius: '7px',
                  color: rules.mode === m ? 'var(--brand)' : 'var(--ink-soft)',
                }}
              >
                {m === 'flexible' ? en.parent.modeFlexible : en.parent.modeStrict}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '8px' }}>
            {rules.mode === 'flexible' ? en.parent.modeFlexibleBody : en.parent.modeStrictBody}
          </div>

          <Row
            label="Auto-split"
            right={
              <Toggle
                checked={rules.autoSplit.enabled}
                onChange={(v) => setRules((r) => (r ? { ...r, autoSplit: { ...r.autoSplit, enabled: v } } : r))}
              />
            }
          />

          {rules.autoSplit.enabled ? (
            <>
              {SPLITTABLE.map((cat) => (
                <div key={cat} style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: CATEGORY_COLOR[cat], flex: 'none' }} />
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '12.5px', textTransform: 'capitalize' }}>{cat}</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={rules.autoSplit.ratios[cat] ?? 0}
                      onChange={(e) => setRatio(cat, Number(e.target.value))}
                      style={{ width: '56px', border: '1px solid var(--line)', borderRadius: '8px', padding: '6px', fontSize: '12px', textAlign: 'right' }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>%</span>
                  </div>
                  {(rules.autoSplit.ratios[cat] ?? 0) > 0 ? (
                    <select
                      value={rules.autoSplit.destinations[cat] ?? ''}
                      onChange={(e) => setDestination(cat, e.target.value)}
                      style={{ ...inputStyle, marginTop: '6px' }}
                    >
                      <option value="">{'—'}</option>
                      {wallets.filter((w) => w.category === cat).map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              ))}
              <div style={{ fontSize: '11.5px', color: total > 100 ? 'var(--loss)' : 'var(--ink-soft)', marginTop: '8px' }}>
                {total > 100 ? en.rules.ratioOver100 : `Total ${total}% — ${100 - total}% lands in Unsorted`}
              </div>
              {!validation.ok && total <= 100 ? (
                <div style={{ fontSize: '11.5px', color: 'var(--loss)', marginTop: '4px' }}>
                  {validation.errorKey === 'ratio.strictMustBeExact'
                    ? `Assign the last ${100 - total}%`
                    : validation.errorKey === 'ratio.missingDestination'
                      ? en.rules.ratioMissingDestination
                      : validation.errorKey === 'ratio.growExcluded'
                        ? en.rules.ratioGrowExcluded
                        : ''}
                </div>
              ) : null}
            </>
          ) : null}

          <SaveButton onClick={saveRules} busy={savingRules} disabled={!validation.ok} label={en.settings.save} />
        </Card>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  border: '1px solid var(--line)',
  borderRadius: '11px',
  padding: '10px 12px',
  fontSize: '13px',
  fontFamily: 'inherit',
  color: 'var(--ink)',
  background: '#fff',
};

const dashedButtonStyle: React.CSSProperties = {
  marginTop: '10px',
  width: '100%',
  border: '1px dashed var(--line)',
  background: 'transparent',
  borderRadius: '9px',
  padding: '11px',
  fontWeight: 700,
  fontSize: '11px',
  color: 'var(--ink-soft)',
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '15px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '10px' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '4px 0' }}>
      <span style={{ flex: 1, fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>{label}</span>
      {right}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: '8px 0' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)', marginBottom: '5px' }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: '44px',
        height: '26px',
        borderRadius: '99px',
        background: checked ? 'var(--brand)' : 'var(--line)',
        position: 'relative',
        flex: 'none',
        border: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#fff',
          transition: '.16s',
          boxShadow: '0 1px 3px rgba(18,20,43,.2)',
        }}
      />
    </button>
  );
}

function SaveButton({ onClick, busy, label, disabled }: { onClick: () => void; busy: boolean; label: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy || disabled}
      style={{
        marginTop: '12px',
        width: '100%',
        border: 0,
        borderRadius: '12px',
        padding: '12px',
        fontWeight: 700,
        fontSize: '12.5px',
        color: '#fff',
        background: busy || disabled ? 'var(--disabled)' : 'var(--brand)',
      }}
    >
      {busy ? '…' : label}
    </button>
  );
}

function Banner({ text, tone }: { text: string; tone: 'ok' | 'error' }) {
  return (
    <div
      style={{
        background: tone === 'ok' ? 'var(--grow-tint)' : '#FCE8EA',
        color: tone === 'ok' ? 'var(--grow-deep)' : 'var(--loss)',
        borderRadius: '12px',
        padding: '11px 14px',
        fontSize: '12.5px',
        fontWeight: 600,
      }}
    >
      {text}
    </div>
  );
}
