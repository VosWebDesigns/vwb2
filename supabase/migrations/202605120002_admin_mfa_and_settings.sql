-- Launch-ready admin MFA and settings hardening.
-- Idempotent: safe to run repeatedly in Supabase SQL editor or migrations.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'consumer',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists role text not null default 'consumer';
alter table public.profiles add column if not exists full_name text;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(exists (
    select 1 from public.profiles p
    where p.user_id = uid
      and p.role = 'admin'
  ), false);
$$;

create table if not exists public.admin_mfa_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.admin_mfa_codes add column if not exists user_id uuid;
alter table public.admin_mfa_codes add column if not exists code_hash text;
alter table public.admin_mfa_codes add column if not exists expires_at timestamptz;
alter table public.admin_mfa_codes add column if not exists created_at timestamptz not null default now();

create unique index if not exists uniq_admin_mfa_codes_user_id on public.admin_mfa_codes(user_id);
create index if not exists idx_admin_mfa_codes_expires_at on public.admin_mfa_codes(expires_at);

alter table public.admin_mfa_codes enable row level security;

-- No public insert/select/update/delete policies are created intentionally.
-- Vercel API routes access this table only with SUPABASE_SERVICE_ROLE_KEY.

alter table if exists public.site_settings add column if not exists social_tiktok text;
alter table if exists public.site_settings add column if not exists social_youtube text;

alter table public.projects add column if not exists live_url text;
alter table public.projects add column if not exists featured_preview_image text;
alter table public.projects add column if not exists home_featured boolean not null default false;

create unique index if not exists uniq_projects_home_featured
  on public.projects ((home_featured))
  where home_featured = true;
