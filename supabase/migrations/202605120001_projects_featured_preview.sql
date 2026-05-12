-- Admin configurable featured preview fields for homepage project previews.
-- Idempotent: safe to run repeatedly in Supabase SQL editor or migrations.

alter table public.projects
  add column if not exists live_url text null;

alter table public.projects
  add column if not exists featured_preview_image text null;

alter table public.projects
  add column if not exists home_featured boolean not null default false;

create unique index if not exists uniq_projects_home_featured
  on public.projects ((home_featured))
  where home_featured = true;
