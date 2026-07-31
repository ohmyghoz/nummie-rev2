import type { Metadata } from 'next';
import { Fredoka, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

/**
 * Bobot diambil dari `reference/mockup-source/*.fonts.html` — deklarasi `@font-face`
 * yang benar-benar dimuat mockup, bukan tebakan. Memuat bobot yang tidak dipakai
 * memperlambat halaman; melewatkan yang dipakai membuat teks jatuh ke fallback
 * dan layar tidak lagi cocok dengan mockup saat diverifikasi berdampingan.
 */
const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nummi',
  description: 'The piggy bank you and your child share.',
  // Sabuk pengaman kedua di sisi dokumen. Yang sebenarnya menegakkan noindex
  // adalah header `X-Robots-Tag` di middleware.ts — header berlaku untuk SEMUA
  // respons, termasuk yang tidak punya <head>.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
