/**
 * Wilayah Indonesia — 38 provinsi + 514 kabupaten/kota.
 *
 * Dipakai formulir sign up ortu (`nummi-web-plan.md` Tahap 2 no.1): provinsi = dropdown,
 * kota/kabupaten = dropdown **dependent** yang isinya mengikuti provinsi terpilih.
 *
 * Datanya statis dan di-bundle — tidak ada panggilan jaringan saat ortu mendaftar. JSON-nya
 * digenerate `pnpm regions:build`; JANGAN menyunting berkas `.json` dengan tangan.
 *
 * Berlaku hanya untuk `country === 'ID'`. Negara lain → provinsi & kota jadi teks bebas
 * (Tahap 2 no.1), dan `parent_profiles.province/city` memang `text` supaya itu mungkin
 * (alasannya di migrasi 0019).
 */

import provincesJson from './id-provinces.json' with { type: 'json' };
import regenciesJson from './id-regencies.json' with { type: 'json' };

/** Kode Kemendagri: provinsi 2 digit (`"11"`), kab/kota `"11.01"`. */
export interface Province {
  code: string;
  name: string;
}

export interface Regency {
  code: string;
  provinceCode: string;
  /** Sudah memuat awalannya: `"Kabupaten Aceh Selatan"`, `"Kota Bandung"`. */
  name: string;
}

export const PROVINCES: readonly Province[] = provincesJson;
export const REGENCIES: readonly Regency[] = regenciesJson;

/**
 * Dibangun sekali saat modul dimuat, bukan setiap kali dropdown berubah.
 * Tanpa ini, setiap penekanan tombol menyapu 514 baris.
 */
const byProvince = new Map<string, Regency[]>();
for (const r of REGENCIES) {
  const list = byProvince.get(r.provinceCode);
  if (list) list.push(r);
  else byProvince.set(r.provinceCode, [r]);
}

const provinceByCode = new Map(PROVINCES.map((p) => [p.code, p]));

/** Daftar provinsi, urut kode Kemendagri (Aceh → Papua Selatan) — sama seperti sumber resmi. */
export function provinces(): readonly Province[] {
  return PROVINCES;
}

/**
 * Kab/kota di satu provinsi. Kode yang tidak dikenal mengembalikan array kosong, bukan galat:
 * pemanggilnya adalah dropdown yang wajar-wajar saja belum punya pilihan.
 */
export function regenciesOf(provinceCode: string): readonly Regency[] {
  return byProvince.get(provinceCode) ?? [];
}

export function findProvince(code: string): Province | undefined {
  return provinceByCode.get(code);
}

/**
 * Apakah pasangan provinsi+kota ini benar-benar ada?
 *
 * Dipakai untuk memvalidasi kiriman formulir — bukan untuk memvalidasi data yang sudah tersimpan.
 * Wilayah dimekarkan dari waktu ke waktu, dan jawaban yang benar saat ortu mendaftar tidak boleh
 * berubah surut jadi salah karena daftarnya diperbarui belakangan (alasan yang sama membuat
 * `parent_profiles.province/city` bukan foreign key — migrasi 0019).
 */
export function isValidPair(provinceCode: string, regencyCode: string): boolean {
  return regenciesOf(provinceCode).some((r) => r.code === regencyCode);
}
