'use client';

import { useState } from 'react';
import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import type { Session } from '@supabase/supabase-js';
import type { ParentRequestRow } from '../../../lib/parent/data';

const en = dictionaries.en;

/** Approval inbox — parent-mobile.markup.html "Requests" screen, disederhanakan jadi daftar datar. */
export function RequestsInbox({
  session,
  pending,
  promiseDebt,
  onBack,
  onChanged,
}: {
  session: Session;
  pending: ParentRequestRow[];
  promiseDebt: ParentRequestRow[];
  onBack: () => void;
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [storyDraft, setStoryDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  async function act(id: string, action: string, story?: string) {
    setBusyId(id);
    setError(null);
    const res = await fetch(`/api/parent/requests/${id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ action, story }),
    });
    setBusyId(null);
    if (!res.ok) {
      setError(en.parent.decisionFailed);
      return;
    }
    onChanged();
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--canvas)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
        <button
          onClick={onBack}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '13px',
            background: '#fff',
            boxShadow: 'var(--sh-1)',
            fontSize: '18px',
          }}
        >
          {'‹'}
        </button>
        <div style={{ font: `700 20px var(--display)`, color: 'var(--ink)' }}>{en.parent.inbox}</div>
      </div>

      <div style={{ padding: '0 16px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {error ? <div style={{ fontSize: '12.5px', color: 'var(--loss)' }}>{error}</div> : null}

        {promiseDebt.length > 0 ? (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#B26A00', marginBottom: '6px' }}>
              {en.parent.promiseDebt}
            </div>
            {promiseDebt.map((r) => (
              <RequestCard
                key={r.id}
                r={r}
                busy={busyId === r.id}
                story={storyDraft[r.id] ?? ''}
                onStory={(v) => setStoryDraft((s) => ({ ...s, [r.id]: v }))}
                onDone={() => act(r.id, 'done', storyDraft[r.id])}
              />
            ))}
          </div>
        ) : null}

        <div>
          {pending.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', textAlign: 'center', padding: '40px 0' }}>
              {en.parent.noPending}
            </div>
          ) : (
            pending.map((r) => (
              <div key={r.id} style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>
                        {r.childName} · {en.requestKind[r.kind as keyof typeof en.requestKind] ?? r.kind}
                      </div>
                      {r.reason ? (
                        <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', marginTop: '3px' }}>{r.reason}</div>
                      ) : null}
                    </div>
                    <div style={{ font: `700 16px var(--display)`, color: 'var(--ink)' }}>{formatRp(r.amount)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <ActionButton
                      label={en.common.approve}
                      primary
                      disabled={busyId === r.id}
                      onClick={() => act(r.id, 'approve')}
                    />
                    <ActionButton label={en.common.talkAboutIt} disabled={busyId === r.id} onClick={() => act(r.id, 'talk')} />
                    <ActionButton label={en.common.decline} disabled={busyId === r.id} onClick={() => act(r.id, 'decline')} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function RequestCard({
  r,
  busy,
  story,
  onStory,
  onDone,
}: {
  r: ParentRequestRow;
  busy: boolean;
  story: string;
  onStory: (v: string) => void;
  onDone: () => void;
}) {
  const needsStory = r.kind === 'give_away';
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--line)',
        borderLeft: '3px solid #B26A00',
        borderRadius: '16px',
        padding: '14px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>
          {r.childName} · {en.requestKind[r.kind as keyof typeof en.requestKind] ?? r.kind}
        </div>
        <div style={{ font: `700 16px var(--display)`, color: 'var(--ink)' }}>{formatRp(r.amount)}</div>
      </div>
      {needsStory ? (
        <>
          <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '8px' }}>{en.parent.storyRequired}</div>
          <textarea
            value={story}
            onChange={(e) => onStory(e.target.value)}
            placeholder={en.parent.storyPlaceholder}
            rows={2}
            style={{
              width: '100%',
              marginTop: '6px',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              padding: '8px 10px',
              fontSize: '12.5px',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </>
      ) : null}
      <button
        onClick={onDone}
        disabled={busy || (needsStory && !story.trim())}
        style={{
          marginTop: '10px',
          width: '100%',
          borderRadius: '11px',
          padding: '10px',
          fontWeight: 700,
          fontSize: '12.5px',
          color: '#fff',
          background: busy || (needsStory && !story.trim()) ? 'var(--disabled)' : '#B26A00',
        }}
      >
        {en.parent.markDone}
      </button>
    </div>
  );
}

function ActionButton({
  label,
  primary,
  disabled,
  onClick,
}: {
  label: string;
  primary?: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        borderRadius: '11px',
        padding: '10px',
        fontWeight: 700,
        fontSize: '12px',
        color: primary ? '#fff' : 'var(--ink)',
        background: disabled ? 'var(--disabled)' : primary ? 'var(--brand)' : 'var(--surface-2)',
        border: primary ? 'none' : '1px solid var(--line)',
      }}
    >
      {label}
    </button>
  );
}
