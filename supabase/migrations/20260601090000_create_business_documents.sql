create table if not exists public.business_documents (
  id uuid primary key,
  type text not null check (type in ('quote', 'invoice')),
  status text not null default 'concept' check (status in ('concept', 'sent', 'accepted', 'paid')),
  number text not null,
  customer_name text,
  company_name text,
  total_ex_vat numeric(12, 2) not null default 0,
  vat_total numeric(12, 2) not null default 0,
  total_inc_vat numeric(12, 2) not null default 0,
  document_json jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_documents_type_idx on public.business_documents(type);
create index if not exists business_documents_status_idx on public.business_documents(status);
create index if not exists business_documents_updated_at_idx on public.business_documents(updated_at desc);
create unique index if not exists business_documents_number_idx on public.business_documents(number);

alter table public.business_documents enable row level security;

create policy "Admins can read business documents"
  on public.business_documents
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  );

create policy "Admins can insert business documents"
  on public.business_documents
  for insert
  with check (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  );

create policy "Admins can update business documents"
  on public.business_documents
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  );

create policy "Admins can delete business documents"
  on public.business_documents
  for delete
  using (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  );
