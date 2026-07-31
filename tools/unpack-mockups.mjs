#!/usr/bin/env node
/**
 * Membuka mockup di `reference/mockups/` jadi sumber yang bisa di-grep.
 *
 * KENAPA BERKAS INI ADA — baca sebelum menganggapnya kenyamanan belaka.
 *
 * `kid-mobile.html`, `parent-mobile.html`, dan `parent-web.html` bukan HTML biasa. Ketiganya
 * bundle React satu-berkas, dan kode layarnya terkubur dua lapis:
 *
 *   <script type="__bundler/template">  → satu string JSON berisi seluruh dokumen
 *     └─ <script type="text/x-dc">      → kode komponen, ter-escape sebagai entity HTML
 *
 * `grep` ke berkas HTML mentah TIDAK gagal dengan jujur — ia gagal dengan diam. Tiga bentuknya,
 * ketiganya sudah diukur di berkas ini, bukan dikira-kira:
 *
 *   1. Cocok, tapi tak terbaca. `grep "7-day streak" kid-mobile.html` memang cocok — lalu
 *      memuntahkan SATU baris sepanjang 113.348 karakter. `-A/-B/-C` tidak menolong: seluruh
 *      berkas cuma 392 baris, dan hampir semuanya duduk di dua baris.
 *
 *   2. NEGATIF PALSU — yang berbahaya. Di dalam string JSON, `"` tersimpan sebagai `\"`:
 *        grep -F "\"Today's mission\"" kid-mobile.html          → 0 hasil
 *        grep -F "\"Today's mission\"" kid-mobile.source.jsx    → 1 hasil
 *      Setiap pencarian yang memuat kutip ganda — atribut, props, string JSX — menjawab
 *      "tidak ada" untuk sesuatu yang jelas ada di layar.
 *
 *   3. Tag ikut tersamar: `</script>` di dalam template tersimpan sebagai `</script>`.
 *
 * AGENTS.md §3a mewajibkan "ekstrak & baca blok HTML/CSS/JS layar tsb. dari berkas mockup
 * (grep, jangan mengarang dari ingatan)". Bentuk kegagalan (2) persis yang membuat perintah itu
 * berbalik arah: sesi yang patuh mencari, tidak menemukan, lalu mengarang — dengan keyakinan.
 * Itu kegagalan yang membunuh repo lama.
 *
 * `console.html` tidak dibundel — HTML biasa dengan `:root` CSS variables. Ia disalin apa adanya
 * supaya semua permukaan bisa dicari di satu direktori.
 *
 * Idempoten, nol dependency. Jalankan: pnpm mockups:unpack
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'reference/mockups');
const OUT_DIR = path.join(ROOT, 'reference/mockup-source');

/** Entity yang dipakai bundler saat menyimpan kode di atribut/isi <script>. */
function unescapeHtml(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    // `&amp;` HARUS terakhir: kalau duluan, `&amp;lt;` berubah jadi `<` alih-alih `&lt;`.
    .replace(/&amp;/g, '&');
}

/**
 * Isi <script type="__bundler/template"> adalah string JSON — bukan HTML. Ia harus di-JSON.parse
 * dulu, bukan dipotong dengan regex: di dalamnya ada `<\/script>` yang di-escape, jadi mencari
 * `</script>` terdekat pada dokumen mentah tetap aman, tapi isinya belum jadi HTML sampai
 * di-parse.
 */
function extractTemplate(html) {
  const m = html.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
  if (!m) return null;
  return JSON.parse(m[1].trim());
}

function extractComponentSource(templateHtml) {
  const m = templateHtml.match(/<script[^>]*type=\\?"text\/x-dc\\?"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  return unescapeHtml(m[1]);
}

/**
 * Deklarasi `@font-face` TIDAK ada di `<head>` — `<head>` bundle cuma memuat charset, viewport,
 * dan satu <script src>. Fontnya hidup di blok `<helmet>` di dalam body, lengkap dengan bobot
 * per varian. Bobot itu yang dibutuhkan saat menyetel `next/font`, dan menebaknya berarti memuat
 * bobot yang tidak dipakai mockup (atau melewatkan yang dipakai).
 */
function extractFonts(templateHtml) {
  const m = templateHtml.match(/<helmet[^>]*>([\s\S]*?)<\/helmet>/);
  return m ? m[1] : null;
}

const BANNER = (name) =>
  `/* GENERATED oleh tools/unpack-mockups.mjs dari reference/mockups/${name} — JANGAN DIEDIT.\n` +
  `   Sumber kebenaran tetap berkas HTML-nya; berkas ini hanya supaya bisa di-grep. */\n\n`;

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.html')).sort();
  if (files.length === 0) {
    console.error(`Tidak ada .html di ${path.relative(ROOT, SRC_DIR)}`);
    process.exit(1);
  }

  let bundled = 0;
  let plain = 0;

  for (const file of files) {
    const name = path.basename(file, '.html');
    const html = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
    const template = extractTemplate(html);

    if (!template) {
      // Bukan bundle — salin apa adanya supaya satu direktori cukup untuk mencari apa pun.
      fs.writeFileSync(path.join(OUT_DIR, `${name}.source.html`), html);
      console.log(`  ${name}: HTML biasa → ${name}.source.html (${html.length.toLocaleString('id-ID')} char)`);
      plain++;
      continue;
    }

    const source = extractComponentSource(template);
    if (!source) {
      console.error(`  ${name}: template ada tapi <script type="text/x-dc"> tidak ditemukan — bentuk bundle berubah?`);
      process.exitCode = 1;
      continue;
    }

    fs.writeFileSync(path.join(OUT_DIR, `${name}.source.jsx`), BANNER(file) + source);

    const fonts = extractFonts(template);
    if (fonts) {
      fs.writeFileSync(
        path.join(OUT_DIR, `${name}.fonts.html`),
        `<!-- GENERATED oleh tools/unpack-mockups.mjs dari reference/mockups/${file} — JANGAN DIEDIT. -->\n${fonts}`,
      );
    }

    console.log(`  ${name}: bundle → ${name}.source.jsx (${source.length.toLocaleString('id-ID')} char)${fonts ? ` + ${name}.fonts.html` : ''}`);
    bundled++;
  }

  console.log(`\n${bundled} bundle dibuka, ${plain} HTML biasa disalin → ${path.relative(ROOT, OUT_DIR)}/`);
}

main();
