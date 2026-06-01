-- VWB2 bedrijfsplatform fase 1: klanten, professionele documenten, lead opvolging en case-study velden.
-- Idempotent en veilig opnieuw uitvoerbaar.

create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  company_name text,
  email text,
  phone text,
  address text,
  postal_code text,
  city text,
  vat_number text,
  notes text,
  status text not null default 'lead',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_status_check check (status in ('lead', 'customer', 'former'))
);

alter table public.customers add column if not exists name text;
alter table public.customers add column if not exists company_name text;
alter table public.customers add column if not exists email text;
alter table public.customers add column if not exists phone text;
alter table public.customers add column if not exists address text;
alter table public.customers add column if not exists postal_code text;
alter table public.customers add column if not exists city text;
alter table public.customers add column if not exists vat_number text;
alter table public.customers add column if not exists notes text;
alter table public.customers add column if not exists status text not null default 'lead';
alter table public.customers add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.customers add column if not exists created_at timestamptz not null default now();
alter table public.customers add column if not exists updated_at timestamptz not null default now();

create index if not exists customers_status_idx on public.customers(status);
create index if not exists customers_company_name_idx on public.customers(company_name);
create index if not exists customers_email_idx on public.customers(email);
create index if not exists customers_updated_at_idx on public.customers(updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_customers_set_updated_at on public.customers;
create trigger trg_customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

alter table public.customers enable row level security;

drop policy if exists "Admins can read customers" on public.customers;
create policy "Admins can read customers"
on public.customers
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Admins can insert customers" on public.customers;
create policy "Admins can insert customers"
on public.customers
for insert
to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can update customers" on public.customers;
create policy "Admins can update customers"
on public.customers
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can delete customers" on public.customers;
create policy "Admins can delete customers"
on public.customers
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- Professionele documentvelden en statussen.
alter table if exists public.business_documents add column if not exists customer_id uuid references public.customers(id) on delete set null;
alter table if exists public.business_documents add column if not exists issue_date date;
alter table if exists public.business_documents add column if not exists due_date date;
alter table if exists public.business_documents add column if not exists paid_at timestamptz;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'business_documents'
  ) then
    alter table public.business_documents drop constraint if exists business_documents_status_check;
    alter table public.business_documents add constraint business_documents_status_check
      check (status in ('concept', 'sent', 'accepted', 'rejected', 'expired', 'paid', 'overdue', 'cancelled'));
  end if;
end $$;

create index if not exists business_documents_customer_id_idx on public.business_documents(customer_id);
create index if not exists business_documents_due_date_idx on public.business_documents(due_date);

-- Lead opvolging: nieuwe Nederlandse flow + notities + klantkoppeling.
alter table public.leads add column if not exists notes text;
alter table public.leads add column if not exists customer_id uuid references public.customers(id) on delete set null;

update public.leads set status = case status
  when 'Nieuw' then 'nieuw'
  when 'In gesprek' then 'opgevolgd'
  when 'Offerte' then 'offerte gestuurd'
  when 'Gewonnen' then 'klant geworden'
  when 'Verloren' then 'afgewezen'
  else status
end;

alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in ('nieuw', 'opgevolgd', 'offerte gestuurd', 'klant geworden', 'afgewezen'));

create index if not exists idx_leads_customer_id on public.leads(customer_id);

-- Verkoopgerichte portfolio/case-study velden.
alter table public.projects add column if not exists industry text;
alter table public.projects add column if not exists problem text;
alter table public.projects add column if not exists solution text;
alter table public.projects add column if not exists tags text;
alter table public.projects add column if not exists is_published boolean not null default true;
alter table public.projects add column if not exists is_featured boolean not null default false;
alter table public.projects add column if not exists live_url text;
alter table public.projects add column if not exists featured_preview_image text;

create index if not exists projects_published_featured_idx on public.projects(is_published, is_featured);

-- Centrale bedrijfs/documentinstellingen.
alter table if exists public.site_settings add column if not exists website text;
alter table if exists public.site_settings add column if not exists kvk text;
alter table if exists public.site_settings add column if not exists iban text;
alter table if exists public.site_settings add column if not exists logo_url text;
alter table if exists public.site_settings add column if not exists seo_title text;
alter table if exists public.site_settings add column if not exists default_payment_term_days integer not null default 14;
alter table if exists public.site_settings add column if not exists default_vat_rate numeric(5,2) not null default 21;
alter table if exists public.site_settings add column if not exists default_quote_validity_days integer not null default 14;
