-- Growth Pack project metadata.
-- Idempotent: safe to run repeatedly in Supabase SQL editor or migrations.

alter table public.projects add column if not exists live_url text;
alter table public.projects add column if not exists stack text;
alter table public.projects add column if not exists resultaat text;
