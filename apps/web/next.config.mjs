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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(here, '../..'),
};

export default nextConfig;
