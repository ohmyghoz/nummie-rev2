#!/usr/bin/env node
/**
 * Memeriksa bahwa rujukan `berkas:baris` di `docs/inventory/` masih menunjuk ke tempat yang benar.
 *
 * KENAPA ADA: inventaris layar (AGENTS.md §3.1b) hanya berguna kalau setiap klaimnya bisa
 * ditelusuri. Rujukannya menunjuk ke `reference/mockup-source/`, yang **digenerate** — kalau
 * `tools/unpack-mockups.mjs` berubah (mis. banner-nya bertambah satu baris), SELURUH nomor baris
 * bergeser sekaligus, dan inventaris berubah dari dokumen menjadi kebohongan yang rapi.
 *
 * Pergeseran seperti itu tidak menghasilkan galat apa pun. Ia hanya membuat orang berikutnya
 * membuka baris yang salah, tidak menemukan apa yang dijanjikan, lalu memilih percaya ingatannya.
 * Itu jalur yang sama dengan `grep` yang gagal diam-diam.
 *
 * Yang diperiksa bukan setiap angka — melainkan **jangkar**: klaim paling menanggung beban di tiap
 * inventaris. Kalau jangkarnya bergeser, semua nomor di berkas itu perlu diperiksa ulang.
 *
 * Jalankan: node tools/check-inventory.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'reference/mockup-source/kid-mobile.source.jsx');

/** [baris, potongan yang harus ada di baris itu, klaim yang bergantung padanya] */
const ANCHORS = [
  // shell
  [149, 'frame(){', 'kid-shell §1 bingkai perangkat'],
  [169, 'bottomNav(){', 'kid-shell §4 bottom nav'],
  [176, "item('home'", 'kid-shell §4 urutan nav — Home pertama'],
  [179, "key:'fab'", 'kid-shell §4 FAB di tengah'],
  [187, 'scrollArea(children', 'kid-shell §3 area gulir'],
  [839, 'pushCta(label', 'kid-shell §5 CTA melayang'],
  [843, 'stepper(val,', 'kid-shell §5 stepper'],

  // home
  [220, 'const nParts', 'kid-home §2 "Split into N parts"'],
  [224, 'const chip=(emoji', 'kid-home §5 kartu wallet'],
  [278, 'if(d.unsorted>0)', 'kid-home §3 banner Unsorted bersyarat'],
  [289, 'if(this.state.pending.length>0)', 'kid-home §4 banner pending bersyarat'],
  [311, "key:'mission'", 'kid-home §7 kartu misi'],

  // wallets
  [382, "key:'main'", 'kid-wallets §3 kantong utama'],
  [389, 'disabled:d.unsorted===0', 'kid-wallets §3 tombol Sort mati saat kosong'],
  [416, 'cluster(key,', 'kid-wallets §4 akordeon'],
  [417, 'accordion===key', 'kid-wallets §4 hanya satu akordeon terbuka'],
  [433, 'pocket(emoji,', 'kid-wallets §5 kartu kantong'],

  // sort — yang paling menanggung beban
  [852, 'const dests', 'kid-sort §3 daftar tujuan mati'],
  [857, 'step=5000', 'kid-sort §4 langkah Rp5.000'],
  [859, 'const autoSplit', 'kid-sort §5 auto-split'],
  [896, 'nd.unsorted=0', 'kid-sort §6 Unsorted dinolkan tanpa syarat'],
  [901, 'remainder===0&&allocated>0', 'kid-sort §6 CTA Strict-only (MR-8)'],
];

const lines = fs.readFileSync(SRC, 'utf8').split('\n');
let failed = 0;

for (const [n, needle, claim] of ANCHORS) {
  const line = lines[n - 1];
  if (line === undefined || !line.includes(needle)) {
    console.error(`  ✗ :${n} tidak lagi memuat "${needle}"`);
    console.error(`      klaim yang bergantung: ${claim}`);
    if (line !== undefined) console.error(`      isi baris sekarang: ${line.trim().slice(0, 80)}`);
    failed++;
  }
}

if (failed) {
  console.error(
    `\n${failed} jangkar bergeser. Nomor baris di docs/inventory/ tidak lagi bisa dipercaya —\n` +
      `periksa ulang berkas inventaris yang disebut di atas sebelum memport apa pun darinya.`,
  );
  process.exit(1);
}

console.log(`  ${ANCHORS.length} jangkar inventaris cocok dengan reference/mockup-source/`);
