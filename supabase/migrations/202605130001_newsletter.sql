-- Newsletter subscribers, campaigns and send logging.
-- Idempotent: safe to run repeatedly in Supabase SQL editor or migrations.

create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'pending',
  token text,
  unsubscribe_token text unique default encode(gen_random_bytes(32), 'hex'),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint newsletter_subscribers_status_check check (status in ('pending', 'active', 'unsubscribed')),
  constraint newsletter_subscribers_email_check check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

alter table public.newsletter_subscribers add column if not exists token text;
alter table public.newsletter_subscribers add column if not exists unsubscribe_token text;
alter table public.newsletter_subscribers add column if not exists confirmed_at timestamptz;
alter table public.newsletter_subscribers add column if not exists unsubscribed_at timestamptz;

update public.newsletter_subscribers
set unsubscribe_token = encode(gen_random_bytes(32), 'hex')
where unsubscribe_token is null;

alter table public.newsletter_subscribers alter column unsubscribe_token set default encode(gen_random_bytes(32), 'hex');

create unique index if not exists newsletter_subscribers_email_key on public.newsletter_subscribers (email);
create unique index if not exists newsletter_subscribers_unsubscribe_token_key on public.newsletter_subscribers (unsubscribe_token);
create index if not exists idx_newsletter_subscribers_status on public.newsletter_subscribers(status);
create index if not exists idx_newsletter_subscribers_token on public.newsletter_subscribers(token) where token is not null;

create table if not exists public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  preheader text,
  content_json jsonb not null default '{}'::jsonb,
  hero_image_url text,
  created_by uuid references auth.users(id) on delete set null,
  status text not null default 'draft',
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  constraint newsletter_campaigns_status_check check (status in ('draft', 'scheduled', 'sending', 'sent'))
);

alter table public.newsletter_campaigns add column if not exists preheader text;
alter table public.newsletter_campaigns add column if not exists content_json jsonb not null default '{}'::jsonb;
alter table public.newsletter_campaigns add column if not exists hero_image_url text;
alter table public.newsletter_campaigns add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.newsletter_campaigns add column if not exists status text not null default 'draft';
alter table public.newsletter_campaigns add column if not exists sent_at timestamptz;

create index if not exists idx_newsletter_campaigns_status_created on public.newsletter_campaigns(status, created_at desc);

create table if not exists public.newsletter_send_log (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.newsletter_campaigns(id) on delete cascade,
  email text not null,
  status text not null,
  error text,
  sent_at timestamptz not null default now(),
  constraint newsletter_send_log_status_check check (status in ('sent', 'failed', 'skipped'))
);

create index if not exists idx_newsletter_send_log_campaign_id on public.newsletter_send_log(campaign_id);
create index if not exists idx_newsletter_send_log_status on public.newsletter_send_log(status);
create unique index if not exists uniq_newsletter_send_log_campaign_email_sent on public.newsletter_send_log(campaign_id, email) where status = 'sent';

alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_campaigns enable row level security;
alter table public.newsletter_send_log enable row level security;

-- Minimal direct public signup allowance; Vercel API still handles validation, rate limiting and e-mail.
drop policy if exists "Newsletter public subscribe insert" on public.newsletter_subscribers;
create policy "Newsletter public subscribe insert"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (status = 'pending');

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
