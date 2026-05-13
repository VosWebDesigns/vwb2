-- Newsletter subscribers, campaigns, send logging and newsletter-media storage.
-- Idempotent: safe to run repeatedly in Supabase SQL editor or migrations.

create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'pending',
  confirm_token text,
  unsubscribe_token text,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint newsletter_subscribers_status_check check (status in ('pending', 'active', 'unsubscribed'))
);

alter table public.newsletter_subscribers add column if not exists confirm_token text;
alter table public.newsletter_subscribers add column if not exists token text;
alter table public.newsletter_subscribers add column if not exists unsubscribe_token text;
alter table public.newsletter_subscribers add column if not exists confirmed_at timestamptz;
alter table public.newsletter_subscribers add column if not exists unsubscribed_at timestamptz;
alter table public.newsletter_subscribers add column if not exists created_at timestamptz not null default now();

update public.newsletter_subscribers
set confirm_token = token
where confirm_token is null and token is not null;

update public.newsletter_subscribers
set unsubscribe_token = encode(gen_random_bytes(32), 'hex')
where unsubscribe_token is null;

alter table public.newsletter_subscribers alter column unsubscribe_token set default encode(gen_random_bytes(32), 'hex');

create unique index if not exists newsletter_subscribers_email_key on public.newsletter_subscribers (email);
create unique index if not exists newsletter_subscribers_unsubscribe_token_key on public.newsletter_subscribers (unsubscribe_token);
create index if not exists idx_newsletter_subscribers_status on public.newsletter_subscribers(status);
create index if not exists idx_newsletter_subscribers_confirm_token on public.newsletter_subscribers(confirm_token) where confirm_token is not null;
create index if not exists idx_newsletter_subscribers_token on public.newsletter_subscribers(token) where token is not null;

create table if not exists public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  preheader text,
  hero_image_url text,
  content_json jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.newsletter_campaigns add column if not exists preheader text;
alter table public.newsletter_campaigns add column if not exists hero_image_url text;
alter table public.newsletter_campaigns add column if not exists content_json jsonb not null default '[]'::jsonb;
alter table public.newsletter_campaigns add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.newsletter_campaigns add column if not exists status text not null default 'draft';
alter table public.newsletter_campaigns add column if not exists sent_at timestamptz;
alter table public.newsletter_campaigns add column if not exists created_at timestamptz not null default now();
alter table public.newsletter_campaigns add column if not exists updated_at timestamptz not null default now();

alter table public.newsletter_campaigns alter column content_json set default '[]'::jsonb;

create index if not exists idx_newsletter_campaigns_status_created on public.newsletter_campaigns(status, created_at desc);

create table if not exists public.newsletter_send_log (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.newsletter_campaigns(id) on delete cascade,
  email text not null,
  status text not null,
  error text,
  sent_at timestamptz not null default now(),
  constraint newsletter_send_log_status_check check (status in ('sent', 'failed', 'skipped'))
);

alter table public.newsletter_send_log add column if not exists campaign_id uuid references public.newsletter_campaigns(id) on delete cascade;
alter table public.newsletter_send_log add column if not exists email text;
alter table public.newsletter_send_log add column if not exists status text;
alter table public.newsletter_send_log add column if not exists error text;
alter table public.newsletter_send_log add column if not exists sent_at timestamptz not null default now();

create index if not exists idx_newsletter_send_log_campaign_id on public.newsletter_send_log(campaign_id);
create index if not exists idx_newsletter_send_log_status on public.newsletter_send_log(status);
create unique index if not exists uniq_newsletter_send_log_campaign_email_sent on public.newsletter_send_log(campaign_id, email) where status = 'sent';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_newsletter_campaigns_set_updated_at on public.newsletter_campaigns;
create trigger trg_newsletter_campaigns_set_updated_at
before update on public.newsletter_campaigns
for each row execute function public.set_updated_at();

alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_campaigns enable row level security;
alter table public.newsletter_send_log enable row level security;

-- Public/client-side access is intentionally not allowed. Serverless routes use SUPABASE_SERVICE_ROLE_KEY.
drop policy if exists "Newsletter public subscribe insert" on public.newsletter_subscribers;

drop policy if exists "Newsletter subscribers admin read" on public.newsletter_subscribers;
create policy "Newsletter subscribers admin read"
on public.newsletter_subscribers
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Newsletter subscribers admin update" on public.newsletter_subscribers;
create policy "Newsletter subscribers admin update"
on public.newsletter_subscribers
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Newsletter subscribers admin delete" on public.newsletter_subscribers;
create policy "Newsletter subscribers admin delete"
on public.newsletter_subscribers
for delete
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Newsletter campaigns admin all" on public.newsletter_campaigns;
create policy "Newsletter campaigns admin all"
on public.newsletter_campaigns
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Newsletter send log admin read" on public.newsletter_send_log;
create policy "Newsletter send log admin read"
on public.newsletter_send_log
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Newsletter send log admin all" on public.newsletter_send_log;
create policy "Newsletter send log admin all"
on public.newsletter_send_log
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Public newsletter media bucket: public-read for email clients, admin write via RLS.
insert into storage.buckets (id, name, public)
select 'newsletter-media', 'newsletter-media', true
where not exists (
  select 1 from storage.buckets where id = 'newsletter-media'
);

update storage.buckets
set public = true
where id = 'newsletter-media' and public is distinct from true;

drop policy if exists "Newsletter media public read" on storage.objects;
create policy "Newsletter media public read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'newsletter-media');

drop policy if exists "Newsletter media admin all" on storage.objects;
create policy "Newsletter media admin all"
on storage.objects
for all
to authenticated
using (bucket_id = 'newsletter-media' and public.is_admin(auth.uid()))
with check (bucket_id = 'newsletter-media' and public.is_admin(auth.uid()));
