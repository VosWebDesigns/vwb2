-- Central public service catalog for /admin/service-pricing and /diensten.
-- Idempotent: safe to run repeatedly in Supabase SQL editor or migrations.

create table if not exists public.service_catalog (
  id text primary key,
  catalog jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_catalog add column if not exists catalog jsonb not null default '[]'::jsonb;
alter table public.service_catalog add column if not exists created_at timestamptz not null default now();
alter table public.service_catalog add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_service_catalog_set_updated_at on public.service_catalog;
create trigger trg_service_catalog_set_updated_at
before update on public.service_catalog
for each row execute function public.set_updated_at();

alter table public.service_catalog enable row level security;

drop policy if exists "Service catalog public read" on public.service_catalog;
create policy "Service catalog public read"
on public.service_catalog
for select
to anon, authenticated
using (id = 'main');

drop policy if exists "Service catalog admin insert" on public.service_catalog;
create policy "Service catalog admin insert"
on public.service_catalog
for insert
to authenticated
with check (id = 'main' and public.is_admin(auth.uid()));

drop policy if exists "Service catalog admin update" on public.service_catalog;
create policy "Service catalog admin update"
on public.service_catalog
for update
to authenticated
using (id = 'main' and public.is_admin(auth.uid()))
with check (id = 'main' and public.is_admin(auth.uid()));

drop policy if exists "Service catalog admin delete" on public.service_catalog;
create policy "Service catalog admin delete"
on public.service_catalog
for delete
to authenticated
using (id = 'main' and public.is_admin(auth.uid()));

insert into public.service_catalog (id, catalog)
values ('main', '[{"id":"webdesign","title":"Webdesign","shortDescription":"Professioneel design voor starters & kleine bedrijven","description":"Perfect voor ondernemers die nét beginnen en een sterke, betrouwbare online uitstraling willen zonder hoge instapkosten.","image":"/webde.png","icon":"palette","highlightedPackageId":"webdesign-growth","packages":[{"id":"webdesign-starter","name":"Starter","price":349,"badge":"Ideaal voor starters","discountType":"amount","discountValue":0,"recurring":"","features":["1–2 pagina’s","Modern & responsive design","Contactformulier","Basis SEO"]},{"id":"webdesign-growth","name":"Groei","price":649,"badge":"Beste balans","discountType":"amount","discountValue":0,"recurring":"","features":["Tot 5 pagina’s","Conversiegericht ontwerp","Subtiele animaties","SEO & performance basis"]},{"id":"webdesign-pro","name":"Pro","price":995,"badge":"Meest gekozen","discountType":"amount","discountValue":0,"recurring":"","features":["Volledig maatwerk design","Unieke branding look","Uitbreidbaar voor groei","Persoonlijke begeleiding"]}]},{"id":"webontwikkeling","title":"Webontwikkeling","shortDescription":"Betrouwbare techniek zonder onnodige complexiteit","description":"Voor websites en webapplicaties die stabiel moeten werken en later eenvoudig uit te breiden zijn.","image":"/webon.png","icon":"code","highlightedPackageId":"webontwikkeling-growth","packages":[{"id":"webontwikkeling-starter","name":"Starter","price":595,"badge":"Laagdrempelig","discountType":"amount","discountValue":0,"recurring":"","features":["Professionele website","Snelle laadtijden","Eenvoudig beheerbaar"]},{"id":"webontwikkeling-growth","name":"Groei","price":995,"badge":"Beste balans","discountType":"amount","discountValue":0,"recurring":"","features":["Uitgebreide pagina’s","Formulieren & koppelingen","Performance optimalisatie"]},{"id":"webontwikkeling-pro","name":"Pro","price":1495,"badge":"Maatwerk","discountType":"amount","discountValue":0,"recurring":"","features":["Custom functionaliteit","Database of login systeem","Doorontwikkelbaar platform"]}]},{"id":"ecommerce","title":"E-commerce","shortDescription":"Start eenvoudig met online verkopen","description":"Ideaal voor ondernemers die hun eerste webshop willen starten zonder direct grote investeringen.","image":"/ecom.png","icon":"shopping-cart","highlightedPackageId":"ecommerce-starter","packages":[{"id":"ecommerce-starter","name":"Starter","price":895,"badge":"Quick win","discountType":"amount","discountValue":0,"recurring":"","features":["Tot 10 producten","iDEAL betalingen","Gebruiksvriendelijk beheer"]},{"id":"ecommerce-growth","name":"Groei","price":1495,"badge":"Meest gekozen","discountType":"amount","discountValue":0,"recurring":"","features":["Onbeperkt producten","Kortingen & acties","Conversiegericht design"]},{"id":"ecommerce-pro","name":"Pro","price":2495,"badge":"Premium","discountType":"amount","discountValue":0,"recurring":"","features":["Maatwerk webshop","Automatiseringen","Analytics & optimalisatie"]}]},{"id":"seo-marketing","title":"SEO & Marketing","shortDescription":"Gevonden worden in Google, stap voor stap","description":"Geen dure contracten, maar duidelijke maandelijkse optimalisatie gericht op zichtbaarheid en groei.","image":"/seo.png","icon":"search","highlightedPackageId":"seo-marketing-starter","packages":[{"id":"seo-marketing-starter","name":"Starter","price":149,"badge":"Quick win","discountType":"amount","discountValue":0,"recurring":"/ maand","features":["Technische SEO check","Basis optimalisatie","Maandelijkse rapportage"]},{"id":"seo-marketing-growth","name":"Groei","price":299,"badge":"Beste balans","discountType":"amount","discountValue":0,"recurring":"/ maand","features":["Content optimalisatie","Lokale SEO","Actieplan per maand"]},{"id":"seo-marketing-pro","name":"Pro","price":499,"badge":"Structurele groei","discountType":"amount","discountValue":0,"recurring":"/ maand","features":["Concurrentie analyse","Doorlopende optimalisatie","Structurele groei"]}]},{"id":"performance-optimalisatie","title":"Performance Optimalisatie","shortDescription":"Snelle winst voor je website","description":"Een snellere website zorgt direct voor betere gebruikservaring en hogere conversies.","image":"/performance.png","icon":"zap","highlightedPackageId":"performance-optimalisatie-starter","packages":[{"id":"performance-optimalisatie-starter","name":"Starter","price":295,"badge":"Quick win","discountType":"amount","discountValue":0,"recurring":"","features":["Snelheidsanalyse","Afbeelding optimalisatie","Basis caching"]},{"id":"performance-optimalisatie-growth","name":"Groei","price":495,"badge":"Beste balans","discountType":"amount","discountValue":0,"recurring":"","features":["Core Web Vitals","Lazy loading","Code optimalisatie"]},{"id":"performance-optimalisatie-pro","name":"Pro","price":795,"badge":"Beste resultaat","discountType":"amount","discountValue":0,"recurring":"","features":["Geavanceerde optimalisatie","Monitoring","Advies voor groei"]}]}]
'::jsonb)
on conflict (id) do nothing;
