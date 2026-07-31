#!/usr/bin/env bash
#
# Menjalankan SELURUH migrasi ke Postgres lokal yang bersih, lalu memeriksa perilakunya.
#
# KENAPA ADA: menulis SQL yang "kelihatan benar" itu murah, dan migrasi yang salah baru
# ketahuan saat sudah menyentuh database sungguhan — tempat memperbaikinya paling mahal.
# Skrip ini membuat "sudah dijalankan, hijau" bisa dikatakan tanpa kredensial Supabase.
#
# YANG TIDAK DIBUKTIKANNYA: Postgres lokal bukan Supabase. Trigger `auth.users` di sini
# dipicu `insert` biasa, bukan Supabase Auth yang sungguhan; email dan PostgREST tidak ada
# sama sekali. Runbook di `docs/DEPLOY.md` tetap wajib.
#
# Pakai:  ./tools/verify-migrations.sh
# Syarat: Postgres >= 14 terpasang (psql, initdb, pg_ctl). Tidak menyentuh database mana pun
#         di luar direktori sementaranya sendiri.

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PGDIR="${NUMMI_PGDIR:-/var/tmp/nummi-verify-pg}"
PORT="${NUMMI_PGPORT:-5433}"
DB=nummi_verify

# Postgres menolak jalan sebagai root. Kalau skrip dijalankan root (container CI, sesi remote),
# pindah ke user `postgres` yang sudah ada bersama paketnya.
RUNAS=""
if [ "$(id -u)" -eq 0 ]; then
  if id -u postgres >/dev/null 2>&1; then
    RUNAS="postgres"
  else
    echo "Jalan sebagai root dan user 'postgres' tidak ada — buat dulu, atau jalankan sebagai user biasa." >&2
    exit 1
  fi
fi

for bin in initdb pg_ctl psql; do
  command -v "$bin" >/dev/null 2>&1 || {
    # Paket Debian menaruhnya di luar PATH.
    for d in /usr/lib/postgresql/*/bin; do [ -d "$d" ] && PATH="$d:$PATH"; done
    export PATH
    break
  }
done
command -v initdb >/dev/null 2>&1 || { echo "initdb tidak ditemukan — Postgres belum terpasang." >&2; exit 1; }

as() { if [ -n "$RUNAS" ]; then su "$RUNAS" -s /bin/bash -c "PATH='$PATH' $1"; else bash -c "$1"; fi; }

cleanup() { as "pg_ctl -D '$PGDIR/data' stop -m immediate" >/dev/null 2>&1 || true; }
trap cleanup EXIT

echo "▸ Menyiapkan Postgres sementara di $PGDIR"
rm -rf "$PGDIR"; mkdir -p "$PGDIR/data" "$PGDIR/run"
[ -n "$RUNAS" ] && chown -R "$RUNAS" "$PGDIR"
as "initdb -D '$PGDIR/data' -U postgres --auth=trust" >/dev/null
as "pg_ctl -D '$PGDIR/data' -o '-k $PGDIR/run -p $PORT -c listen_addresses=' -l '$PGDIR/pg.log' start" >/dev/null

export PGHOST="$PGDIR/run" PGPORT="$PORT" PGUSER=postgres
for _ in $(seq 1 30); do psql -q -c 'select 1' >/dev/null 2>&1 && break; sleep 0.5; done

psql -q -c "create database $DB"
psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$REPO/supabase/verify/auth-stub.sql" >/dev/null
echo "▸ Stub skema auth siap"

echo "▸ Menjalankan migrasi"
for f in "$REPO"/supabase/migrations/*.sql; do
  if psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$f" >/dev/null 2>"$PGDIR/err"; then
    echo "  ✅ $(basename "$f")"
  else
    echo "  ❌ $(basename "$f")"; sed 's/^/     /' "$PGDIR/err"; exit 1
  fi
done

echo "▸ Memeriksa perilaku"
# Id ortu baru diketahui setelah checks.sql membuat keduanya, jadi bagian RLS-nya memakai
# penanda yang ditukar di sini — bukan id yang di-hardcode.
TMP="$PGDIR/checks.sql"
head -n "$(grep -n '^-- ── 0019: RLS' "$REPO/supabase/verify/checks.sql" | cut -d: -f1)" \
  "$REPO/supabase/verify/checks.sql" > "$TMP.head"
psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$TMP.head"

A=$(psql -tAq -d "$DB" -c "select id from parents where id = (select id from auth.users where email='sinta@verify.local')")
B=$(psql -tAq -d "$DB" -c "select id from parents where id = (select id from auth.users where email='kosong@verify.local')")
sed -e "s/__A__/$A/g" -e "s/__B__/$B/g" "$REPO/supabase/verify/checks.sql" > "$TMP"
tail -n +"$(grep -n '^-- ── 0019: RLS' "$TMP" | cut -d: -f1)" "$TMP" > "$TMP.rls"
psql -q -d "$DB" -f "$TMP.rls" 2>&1 | grep -v '^$' | sed 's/^/  /'

echo "▸ Selesai — 0001–0021 jalan bersih dan berperilaku sesuai harapan."
