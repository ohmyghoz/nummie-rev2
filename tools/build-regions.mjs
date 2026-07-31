#!/usr/bin/env node
/**
 * Menghasilkan `data/regions/*.json` dari paket npm `idn-area-data`.
 *
 * KENAPA DIGENERATE LALU DI-COMMIT, bukan dibaca saat runtime:
 *
 *   1. Rencana Tahap 0 no.9 meminta JSON statis yang **di-bundle, tanpa API eksternal**.
 *      Formulir sign up tidak boleh bergantung pada jaringan pihak ketiga saat ortu mendaftar.
 *   2. `idn-area-data` membawa 4,2 MB CSV — provinsi & kab/kota yang kita butuhkan hanya
 *      sebagian kecilnya. Sisanya (kecamatan, desa, pulau) tidak perlu ikut ke browser.
 *   3. Datanya berubah kalau ada pemekaran wilayah, dan perubahan itu harus terlihat sebagai
 *      diff yang bisa ditinjau — bukan berpindah diam-diam saat seseorang menjalankan install.
 *
 * Paketnya karena itu `devDependencies`, bukan `dependencies`.
 *
 * ANGKA YANG DIJAGA: 38 provinsi & 514 kab/kota. Skrip ini GAGAL kalau jumlahnya meleset —
 * dataset yang diam-diam terpotong lebih buruk daripada skrip yang berhenti, karena yang
 * terpotong akan ditemukan oleh ortu di daerah yang hilang, bukan oleh kita.
 *
 * Jalankan: pnpm regions:build
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'data/regions');
const SRC = path.join(ROOT, 'node_modules/idn-area-data/data');

const EXPECTED_PROVINCES = 38;
const EXPECTED_REGENCIES = 514;

/** CSV sumbernya sederhana: header + baris tanpa kutip. Tanpa parser, tanpa dependency. */
function readCsv(file) {
  const lines = fs.readFileSync(path.join(SRC, file), 'utf8').trim().split('\n');
  const header = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    return Object.fromEntries(header.map((h, i) => [h, (cells[i] ?? '').trim()]));
  });
}

function fail(message) {
  console.error(`build-regions: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(SRC)) {
  fail(`sumber tidak ditemukan di node_modules/idn-area-data — jalankan \`pnpm install\` dulu.`);
}

const provinces = readCsv('provinces.csv')
  .map((r) => ({ code: r.code, name: r.name }))
  .sort((a, b) => a.code.localeCompare(b.code));

const regencies = readCsv('regencies.csv')
  .map((r) => ({ code: r.code, provinceCode: r.province_code, name: r.name }))
  .sort((a, b) => a.code.localeCompare(b.code));

if (provinces.length !== EXPECTED_PROVINCES) {
  fail(`provinsi = ${provinces.length}, diharapkan ${EXPECTED_PROVINCES}. Kalau ini pemekaran yang sah, perbarui angkanya DI SINI dan sebutkan sumbernya di data/regions/README.md.`);
}
if (regencies.length !== EXPECTED_REGENCIES) {
  fail(`kab/kota = ${regencies.length}, diharapkan ${EXPECTED_REGENCIES}. Lihat catatan di atas.`);
}

// Setiap kab/kota harus menunjuk provinsi yang benar-benar ada — kalau tidak, dropdown
// dependent akan menyembunyikannya tanpa jejak, dan tidak ada yang pernah tahu.
const codes = new Set(provinces.map((p) => p.code));
const yatim = regencies.filter((r) => !codes.has(r.provinceCode));
if (yatim.length > 0) {
  fail(`${yatim.length} kab/kota menunjuk provinsi yang tidak ada, mis. ${yatim[0].code} ${yatim[0].name}`);
}

const kosong = provinces.filter((p) => !regencies.some((r) => r.provinceCode === p.code));
if (kosong.length > 0) {
  fail(`provinsi tanpa kab/kota: ${kosong.map((p) => p.name).join(', ')}`);
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'id-provinces.json'), JSON.stringify(provinces, null, 0) + '\n');
fs.writeFileSync(path.join(OUT, 'id-regencies.json'), JSON.stringify(regencies, null, 0) + '\n');

const kb = (f) => (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(1);
console.log(`  id-provinces.json  ${provinces.length} provinsi   (${kb('id-provinces.json')} KB)`);
console.log(`  id-regencies.json  ${regencies.length} kab/kota  (${kb('id-regencies.json')} KB)`);
console.log(`\nSumber: idn-area-data — data ODbL, lihat data/regions/README.md`);
