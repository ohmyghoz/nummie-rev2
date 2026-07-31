/**
 * Satu project Vercel, satu app Next multi-route (AGENTS.md §2, mengubah keputusan
 * repo lama yang memakai tiga project).
 *
 * `outputFileTracingRoot` menunjuk ke root repo, DUA tingkat di atas app ini.
 * Itu bukan optimasi — `@core`, `@copy`, dan `@regions` bukan package npm, mereka
 * dijangkau lewat alias tsconfig ke berkas di luar `apps/web`. Tanpa baris ini,
 * jejak berkas berhenti di `apps/web` dan build gagal dengan `Module not found`.
 * Pelajaran yang sama pernah mahal sekali di repo lama — catatannya di
 * `docs/DEPLOY.md`.
 *
 * Yang SENGAJA tidak ada di sini: Tailwind, PostCSS plugin, atau CSS framework
 * apa pun (AGENTS.md §2). CSS mockup sudah lengkap; tugasnya diport.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Header keamanan dipasang di sini, bukan di dashboard Vercel.
 *
 * Alasannya sudah pernah mahal: setelan dashboard tidak ikut dalam `git`, tidak ikut saat
 * project dibuat ulang, dan tidak berlaku di `pnpm dev`. Yang di berkas ini selalu ikut.
 *
 * `frame-ancestors 'none'` adalah yang paling penting dan paling mudah dianggap seremonial:
 * `/parent` memuat tombol **Approve** yang MEMINDAHKAN UANG. Tanpa header ini, halamannya bisa
 * di-iframe orang lain dan tombol itu jadi sasaran clickjacking — korbannya menekan sesuatu yang
 * lain, yang tertekan tombol Approve.
 *
 * `X-Robots-Tag` sengaja dipasang DUA KALI (di sini dan di `middleware.ts`). Yang di sini
 * berlaku bahkan kalau middleware dilewati atau matcher-nya kelak dipersempit.
 */
const securityHeaders = [
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(here, '../..'),
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  /**
   * `@core` & `copy/` importan gaya NodeNext — `import './foo.js'` menunjuk berkas
   * `.ts` sungguhan (TS mewajibkan ekstensi `.js` pada import relatif meski sumbernya
   * `.ts`). `tsc` (moduleResolution: bundler) sudah tahu ini; webpack Next TIDAK,
   * kecuali diberi tahu lewat `extensionAlias`. Tanpa ini, build lolos typecheck
   * tapi mati saat runtime dengan "Module not found: Can't resolve './x.js'".
   */
  webpack(config) {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
    };
    return config;
  },
};

export default nextConfig;
