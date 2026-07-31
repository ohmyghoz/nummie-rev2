/**
 * Placeholder Tahap 0 — SEMENTARA.
 *
 * Gunanya cuma dua: membuktikan route-nya hidup, dan membuktikan token desain
 * benar-benar terpasang (kalau `--brand` atau font tidak menyala, halaman ini
 * terlihat salah seketika).
 *
 * Berkas ini DIHAPUS begitu layar aslinya diport. Ia bukan kerangka untuk
 * dibangun di atasnya, dan tidak ada satu pun elemennya yang berasal dari
 * mockup — jangan memperlakukannya sebagai keputusan desain.
 */

export type Surface = 'kid' | 'parent' | 'console';

export function Placeholder({
  surface,
  route,
  title,
  mockup,
  stage,
}: {
  surface: Surface;
  route: string;
  title: string;
  mockup: string;
  stage: string;
}) {
  return (
    <main
      data-surface={surface}
      data-theme="grape"
      style={{
        minHeight: '100vh',
        background: 'var(--canvas)',
        color: 'var(--ink)',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--sh-2)',
          padding: '28px',
          maxWidth: '460px',
          width: '100%',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--display)',
            fontWeight: 700,
            fontSize: '28px',
            color: 'var(--brand)',
            letterSpacing: '-.02em',
          }}
        >
          {title}
        </div>

        <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--ink-soft)' }}>
          <code>{route}</code> — belum dibangun.
        </div>

        <div
          style={{
            marginTop: '18px',
            paddingTop: '16px',
            borderTop: '1px solid var(--line)',
            fontSize: '12.5px',
            lineHeight: 1.6,
            color: 'var(--ink-soft)',
          }}
        >
          Sumber UI: <code>reference/mockups/{mockup}</code>
          <br />
          Dibangun di: <b style={{ color: 'var(--ink)' }}>{stage}</b>
        </div>

        {/* Bukti token kategori menyala. Perhatikan: warnanya SENGAJA berbeda
            antara /kid dan /parent — itu konflik MR-7 yang belum diputuskan,
            bukan kesalahan render. */}
        <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
          {(['spend', 'save', 'give', 'grow'] as const).map((cat) => (
            <span
              key={cat}
              title={cat}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '999px',
                background: `var(--${cat}, var(--track, #DDD))`,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
