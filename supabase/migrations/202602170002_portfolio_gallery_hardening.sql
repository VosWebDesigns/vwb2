-- Portfolio gallery hardening: safe admin helper + storage policies without owner-only operations

create extension if not exists pgcrypto;

-- Ensure role enum exists for projects that don't yet define it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('consumer', 'company', 'admin');
  END IF;
END $$;

-- Ensure profiles exists so is_admin can run safely across environments
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'consumer',
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Replace helper to support profiles.user_id layouts
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(exists (
    select 1
    from public.profiles p
    where p.user_id = uid
      and p.role::text = 'admin'
  ), false);
$$;

-- Ensure table + bucket exist when this migration is run independently
create table if not exists public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  path text,
  alt text,
  sort_order int not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
select 'portfolio-media', 'portfolio-media', true
where not exists (select 1 from storage.buckets where id = 'portfolio-media');

-- Storage policies only; do not ALTER storage.objects to avoid owner errors
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'portfolio_media_public_read'
  ) THEN
    CREATE POLICY portfolio_media_public_read
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'portfolio-media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'portfolio_media_admin_all'
  ) THEN
    CREATE POLICY portfolio_media_admin_all
      ON storage.objects
      FOR ALL
      USING (bucket_id = 'portfolio-media' AND public.is_admin(auth.uid()))
      WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin(auth.uid()));
  END IF;
END $$;
