import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * `X-Robots-Tag: noindex` GLOBAL (AGENTS.md §2).
 *
 * Yang dijaganya bukan kerahasiaan — data dijaga auth + RLS. Yang dijaganya
 * adalah agar app keluarga tidak muncul di hasil pencarian: URL-nya bisa
 * dijangkau siapa pun yang tahu alamatnya, karena Deployment Protection harus
 * mati supaya keluarga uji bisa masuk (`docs/DEPLOY.md`).
 *
 * Header, bukan hanya meta tag: header ikut pada respons yang tidak punya
 * `<head>` — JSON dari route handler, redirect, gambar.
 */
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = {
  // Aset build Next dilewati — mereka tidak pernah diindeks sendiri, dan
  // menyentuhnya di setiap permintaan hanya menambah kerja.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
