-- Stub skema `auth` milik Supabase — HANYA untuk verifikasi migrasi di Postgres lokal.
--
-- Ini BUKAN bagian dari skema produksi dan tidak pernah dijalankan ke Supabase: di sana
-- skema `auth` dimiliki dan dikelola Supabase Auth. Berkas ini cukup memenuhi apa yang
-- disentuh migrasi 0001–0021, tidak lebih:
--
--   auth.users            0001 (`parents.id` mereferensikannya) & 0020 (trigger sign up)
--   auth.uid()            0002, 0004  — dibaca policy RLS
--   auth.role()           0013        — policy `daily_prices`
--   anon/authenticated/service_role   sasaran GRANT & REVOKE
--
-- `auth.uid()` di sini membaca `request.jwt.claims`, sama seperti aslinya, jadi uji RLS bisa
-- menyamar jadi ortu tertentu dengan `set local request.jwt.claims`.

create schema if not exists auth;
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists auth.users (
  id                 uuid primary key default gen_random_uuid(),
  email              text,
  raw_user_meta_data jsonb
);

create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid;
$$;

create or replace function auth.role() returns text language sql stable as $$
  select coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', 'anon');
$$;

do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon')          then create role anon;          end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role')  then create role service_role;  end if;
end $$;
