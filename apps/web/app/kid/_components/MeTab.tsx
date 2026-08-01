'use client';

import { dictionaries } from '@copy';
import type { KidData } from '../../../lib/kid/data';
import { clearKidSession } from '../../../lib/kid/session';

const en = dictionaries.en;

/**
 * Tab Me — versi ringkas. Badges/tema/avatar shop (meTab() :690) belum diport (butuh
 * data koleksi yang belum ada tabelnya); yang nyata & sudah bisa dibaca ditampilkan.
 */
export function MeTab({ data, onSignOut }: { data: KidData; onSignOut: () => void }) {
  return (
    <>
      <div style={{ font: `700 22px var(--display)`, color: 'var(--ink)', marginTop: '4px' }}>{en.me.title}</div>

      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '16px',
          boxShadow: 'var(--sh-card)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '22px',
            margin: '0 auto 10px',
            background: 'var(--surface-2)',
            boxShadow: '0 0 0 3px #FFB020',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '34px',
          }}
        >
          🦊
        </div>
        <div style={{ font: `600 18px var(--display)`, color: 'var(--ink)' }}>{data.child.name}</div>
        <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '2px', textTransform: 'capitalize' }}>
          {data.child.tier}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <StatCard label={en.me.starsBalance} value={`⭐ ${data.starsBalance}`} />
        <StatCard label={en.me.gems} value={`💎 ${data.gemsBalance}`} />
      </div>

      <div style={{ fontSize: '11px', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.4, padding: '0 10px' }}>
        {en.me.cosmeticOnly}
      </div>

      <button
        onClick={() => {
          clearKidSession();
          onSignOut();
        }}
        style={{
          marginTop: '8px',
          background: '#fff',
          borderRadius: '16px',
          padding: '14px',
          boxShadow: 'var(--sh-card)',
          fontWeight: 700,
          fontSize: '13px',
          color: 'var(--loss)',
        }}
      >
        {en.me.signOut}
      </button>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '14px', boxShadow: 'var(--sh-card)', textAlign: 'center' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ font: `700 20px var(--display)`, marginTop: '6px', color: 'var(--ink)' }}>{value}</div>
    </div>
  );
}
