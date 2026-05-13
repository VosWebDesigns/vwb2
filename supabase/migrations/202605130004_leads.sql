-- Growth Pack lead tracking and admin-safe lead access.
-- Idempotent: safe to run repeatedly in Supabase SQL editor or migrations.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  package text,
  message text,
  source text default 'contact_form',
  status text not null default 'Nieuw',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_status_check check (status in ('Nieuw', 'In gesprek', 'Offerte', 'Gewonnen', 'Verloren'))
);

alter table public.leads add column if not exists phone text;
alter table public.leads add column if not exists company text;
alter table public.leads add column if not exists service text;
alter table public.leads add column if not exists package text;
alter table public.leads add column if not exists message text;
alter table public.leads add column if not exists source text default 'contact_form';
alter table public.leads add column if not exists status text not null default 'Nieuw';
alter table public.leads add column if not exists created_at timestamptz not null default now();
alter table public.leads add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_leads_status_created on public.leads(status, created_at desc);
create index if not exists idx_leads_created_at on public.leads(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_leads_set_updated_at on public.leads;
create trigger trg_leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

alter table public.leads enable row level security;

-- Public/client-side inserts are intentionally not allowed. Contact form logging uses SUPABASE_SERVICE_ROLE_KEY server-side.
drop policy if exists "Leads admin read" on public.leads;
create policy "Leads admin read"
on public.leads
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Leads admin update" on public.leads;
create policy "Leads admin update"
on public.leads
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Leads admin delete" on public.leads;
create policy "Leads admin delete"
on public.leads
for delete
to authenticated
using (public.is_admin(auth.uid()));
