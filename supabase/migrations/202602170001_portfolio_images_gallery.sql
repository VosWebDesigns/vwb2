-- Portfolio gallery support: table, constraints, triggers, storage, RLS policies

create extension if not exists pgcrypto;

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

alter table public.portfolio_images add column if not exists id uuid default gen_random_uuid();
alter table public.portfolio_images add column if not exists portfolio_id uuid;
alter table public.portfolio_images add column if not exists url text;
alter table public.portfolio_images add column if not exists path text;
alter table public.portfolio_images add column if not exists alt text;
alter table public.portfolio_images add column if not exists sort_order int not null default 0;
alter table public.portfolio_images add column if not exists is_cover boolean not null default false;
alter table public.portfolio_images add column if not exists created_at timestamptz not null default now();

alter table public.portfolio_images alter column portfolio_id set not null;
alter table public.portfolio_images alter column url set not null;
alter table public.portfolio_images alter column sort_order set not null;
alter table public.portfolio_images alter column sort_order set default 0;
alter table public.portfolio_images alter column is_cover set not null;
alter table public.portfolio_images alter column is_cover set default false;
alter table public.portfolio_images alter column created_at set not null;
alter table public.portfolio_images alter column created_at set default now();

create index if not exists idx_portfolio_images_portfolio_sort
  on public.portfolio_images(portfolio_id, sort_order);

create or replace function public.ensure_single_cover_image()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_cover then
    update public.portfolio_images
    set is_cover = false
    where portfolio_id = new.portfolio_id
      and id <> new.id
      and is_cover = true;
  end if;

  if new.sort_order is null then
    new.sort_order := 0;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_portfolio_images_single_cover on public.portfolio_images;
create trigger trg_portfolio_images_single_cover
before insert or update of is_cover, sort_order on public.portfolio_images
for each row
execute function public.ensure_single_cover_image();

do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'portfolio_images'
      and indexname = 'uniq_portfolio_images_cover_per_portfolio'
  ) then
    create unique index uniq_portfolio_images_cover_per_portfolio
      on public.portfolio_images(portfolio_id)
      where is_cover = true;
  end if;
end $$;

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

alter table public.portfolio_images enable row level security;

-- Public read, consistent with existing portfolio publication strategy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'portfolio_images'
      AND policyname = 'portfolio_images_public_read'
  ) THEN
    create policy portfolio_images_public_read
      on public.portfolio_images
      for select
      using (
        exists (
          select 1
          from public.projects p
          where p.id = portfolio_images.portfolio_id
            and coalesce(p.is_published, true) = true
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'portfolio_images'
      AND policyname = 'portfolio_images_admin_all'
  ) THEN
    create policy portfolio_images_admin_all
      on public.portfolio_images
      for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  END IF;
END $$;

insert into storage.buckets (id, name, public)
select 'portfolio-media', 'portfolio-media', true
where not exists (
  select 1 from storage.buckets where id = 'portfolio-media'
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'portfolio_media_public_read'
  ) THEN
    create policy portfolio_media_public_read
      on storage.objects
      for select
      using (bucket_id = 'portfolio-media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'portfolio_media_admin_insert'
  ) THEN
    create policy portfolio_media_admin_insert
      on storage.objects
      for insert
      with check (
        bucket_id = 'portfolio-media'
        and public.is_admin(auth.uid())
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'portfolio_media_admin_update'
  ) THEN
    create policy portfolio_media_admin_update
      on storage.objects
      for update
      using (
        bucket_id = 'portfolio-media'
        and public.is_admin(auth.uid())
      )
      with check (
        bucket_id = 'portfolio-media'
        and public.is_admin(auth.uid())
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'portfolio_media_admin_delete'
  ) THEN
    create policy portfolio_media_admin_delete
      on storage.objects
      for delete
      using (
        bucket_id = 'portfolio-media'
        and public.is_admin(auth.uid())
      );
  END IF;
END $$;
