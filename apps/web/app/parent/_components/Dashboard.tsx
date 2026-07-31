'use client';

import { dictionaries } from '@copy';
import { formatRp } from '@core/money';
import { tr } from '../../../lib/i18n';
import type { ParentChildSummary, ParentFamily } from '../../../lib/parent/data';
import { signOutParent } from '../../../lib/parent/session';

const en = dictionaries.en;

/**
 * Dashboard — ringkas dari parent-mobile.markup.html (Dashboard screen), disederhanakan untuk
 * beberapa anak sekaligus (mockup aslinya satu ring per anak terpilih; di sini satu kartu per
 * anak, karena chip-picker + ring gabungan belum digarap sesi ini — lihat docs/PROGRESS.md).
 */
export function Dashboard({
  family,
  children,
  pendingTotal,
  onOpenRequests,
  onAddChild,
}: {
  family: ParentFamily;
  children: ParentChildSummary[];
  pendingTotal: number;
  onOpenRequests: () => void;
  onAddChild: () => void;
}) {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--canvas)', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '12px 2px 14px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '19px', letterSpacing: '-.025em', color: 'var(--ink)' }}>
            {family.name}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', marginTop: '3px' }}>You are the bank</div>
        </div>
        <button
          onClick={onOpenRequests}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#fff',
            border: '1px solid var(--line)',
            position: 'relative',
            fontSize: '17px',
          }}
        >
          🔔
          {pendingTotal > 0 ? (
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '8px',
                height: '8px',
                borderRadius: '999px',
                background: '#B26A00',
                border: '1.5px solid #fff',
              }}
            />
          ) : null}
        </button>
        <button
          onClick={() => void signOutParent()}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#fff',
            border: '1px solid var(--line)',
            fontSize: '14px',
          }}
          title="Sign out"
        >
          {'⎋'}
        </button>
      </div>

      {pendingTotal > 0 ? (
        <button
          onClick={onOpenRequests}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            background: '#fff',
            border: '1px solid var(--line)',
            borderLeft: '3px solid #B26A00',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '12px',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '17px' }}>⏳</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <b style={{ fontWeight: 700, fontSize: '13px', display: 'block', color: 'var(--ink)' }}>
              {tr(en.parent.pendingCount, { count: pendingTotal })}
            </b>
            <span style={{ fontSize: '11px', color: 'var(--ink-soft)', display: 'block', marginTop: '3px' }}>
              Nothing moves until you act
            </span>
          </span>
          <span style={{ color: 'var(--ink-soft)' }}>›</span>
        </button>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {children.map((child) => (
          <div
            key={child.id}
            style={{
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '15px',
              boxShadow: 'var(--sh-1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>{child.name}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)', textTransform: 'capitalize' }}>
                  {child.tier}
                </div>
              </div>
              <div style={{ font: `700 22px var(--display)`, color: 'var(--ink)' }}>{formatRp(child.total)}</div>
            </div>
            {child.unsorted > 0 ? (
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--brand)', fontWeight: 600 }}>
                {formatRp(child.unsorted)} still unsorted
              </div>
            ) : null}
            {child.pendingCount > 0 ? (
              <div style={{ marginTop: '4px', fontSize: '11px', color: '#B26A00', fontWeight: 600 }}>
                {child.pendingCount} waiting on you
              </div>
            ) : null}
          </div>
        ))}

        <button
          onClick={onAddChild}
          style={{
            background: '#fff',
            border: '1px dashed var(--line)',
            borderRadius: '16px',
            padding: '16px',
            color: 'var(--ink-soft)',
            fontWeight: 700,
            fontSize: '12.5px',
          }}
        >
          {'＋ Add another child'}
        </button>
      </div>

      <div style={{ marginTop: '18px', fontSize: '10.5px', color: 'var(--ink-soft)', textAlign: 'center' }}>
        Family code {family.familyCode}
      </div>
    </div>
  );
}
