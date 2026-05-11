-- Launch-ready portfolio gallery, admin profiles and storage policies.
-- Idempotent and intentionally does NOT alter storage.objects ownership/RLS settings.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'consumer',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists user_id uuid;
alter table public.profiles add column if not exists role text not null default 'consumer';
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

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
      and p.role = 'admin'
  ), false);
$$;

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
alter table public.portfolio_images alter column id set default gen_random_uuid();
alter table public.portfolio_images alter column sort_order set default 0;
alter table public.portfolio_images alter column is_cover set default false;
alter table public.portfolio_images alter column created_at set default now();

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

create index if not exists idx_portfolio_images_portfolio_sort
  on public.portfolio_images(portfolio_id, sort_order);

create unique index if not exists uniq_portfolio_images_cover_per_portfolio
  on public.portfolio_images(portfolio_id)
  where is_cover = true;

alter table public.profiles enable row level security;
alter table public.portfolio_images enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_owner_select') then
    create policy profiles_owner_select on public.profiles
      for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_admin_all') then
    create policy profiles_admin_all on public.profiles
      for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'portfolio_images' and policyname = 'portfolio_images_public_read') then
    create policy portfolio_images_public_read on public.portfolio_images
      for select using (
        exists (
          select 1 from public.projects p
          where p.id = portfolio_images.portfolio_id
            and coalesce(p.is_published, true) = true
        )
      );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'portfolio_images' and policyname = 'portfolio_images_admin_all') then
    create policy portfolio_images_admin_all on public.portfolio_images
      for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
  end if;
end $$;

insert into storage.buckets (id, name, public)
select 'portfolio-media', 'portfolio-media', true
where not exists (select 1 from storage.buckets where id = 'portfolio-media');

update storage.buckets
set public = true
where id = 'portfolio-media' and public is distinct from true;

-- Storage policies only. Do not ALTER TABLE storage.objects.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'portfolio_media_public_read') then
    create policy portfolio_media_public_read on storage.objects
      for select using (bucket_id = 'portfolio-media');
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'portfolio_media_admin_insert') then
    create policy portfolio_media_admin_insert on storage.objects
      for insert with check (bucket_id = 'portfolio-media' and public.is_admin(auth.uid()));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'portfolio_media_admin_update') then
    create policy portfolio_media_admin_update on storage.objects
      for update using (bucket_id = 'portfolio-media' and public.is_admin(auth.uid()))
      with check (bucket_id = 'portfolio-media' and public.is_admin(auth.uid()));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'portfolio_media_admin_delete') then
    create policy portfolio_media_admin_delete on storage.objects
      for delete using (bucket_id = 'portfolio-media' and public.is_admin(auth.uid()));
  end if;
end $$;
