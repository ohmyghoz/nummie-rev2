/**
 * `/` sengaja tidak ada — dan itu keputusan, bukan berkas yang lupa dibuat.
 *
 * Tidak ada satu pun tautan lintas-permukaan di produk ini: app anak tidak
 * pernah menaut ke app ortu, dan tidak ada permukaan yang mengiklankan
 * `/console`. Halaman indeks di root akan menjadi satu-satunya tempat ketiganya
 * disebut bersama — daftar yang justru tidak boleh ada, karena console adalah
 * permukaan operator (ADR-0021), bukan halaman yang boleh ditemukan orang.
 *
 * Jadi root menjawab 404, sama seperti alamat asal lainnya.
 */
export default function NotFound() {
  return (
    <main
      data-surface="parent"
      style={{
        minHeight: '100vh',
        background: 'var(--canvas)',
        color: 'var(--ink)',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '40px', color: 'var(--brand)' }}>
          Nummi
        </div>
        <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--ink-soft)' }}>
          Nothing here.
        </p>
      </div>
    </main>
  );
}
