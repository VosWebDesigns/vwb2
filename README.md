# Vos Web Designs vwb2

Launch-ready Vite + React 18 + React Router + Supabase + Vercel website for Vos Web Designs.

## Installeren en lokaal draaien

```bash
npm i
cp .env.example .env.local
npm run dev
```

## Build

```bash
npm run build
```

De build draait eerst `tools/generate-llms.js` en bouwt daarna de Vite SPA.

## Environment variables

Zet op Vercel bij Project Settings → Environment Variables minimaal deze variabelen:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
SITE_URL=
ADMIN_MFA_MODE=optional
```

Gebruik lokaal een `.env.local` bestand met dezelfde keys. Je kunt starten vanaf `.env.example`:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL` en `NEXT_PUBLIC_SUPABASE_ANON_KEY` worden door de Vite client bundle gebruikt voor Supabase. `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY` blijven als fallback ondersteund.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only en wordt gebruikt door Vercel API routes voor admin MFA, contactformulier-lead logging, exports en nieuwsbriefacties.
- `RESEND_API_KEY` en `RESEND_FROM_EMAIL` worden gebruikt door `/api/contact`, admin MFA en nieuwsbriefmails. Gebruik tijdelijk `onboarding@resend.dev` of verifieer het domein voordat `contact@voswebdesigns.nl` als afzender wordt gebruikt.
- `ADMIN_MFA_MODE` ondersteunt `off`, `optional` en `required`; start veilig met `optional` en zet op `required` zodra Resend betrouwbaar mailt.
- `VITE_SENTRY_DSN`, `VITE_SENTRY_ENV` en `VITE_SENTRY_TRACES_SAMPLE_RATE` schakelen client-side Sentry monitoring/performance tracing in; zonder DSN is dit een no-op. `VITE_PLAUSIBLE_DOMAIN` of `VITE_GA_ID` schakelt analytics in na cookie consent.
- `SENTRY_DSN`, `SENTRY_ENVIRONMENT` en `SENTRY_TRACES_SAMPLE_RATE` schakelen serverless error capture voor Vercel API routes in; zonder DSN is dit een no-op.
- `SITE_URL` wordt gebruikt voor absolute URLs in `/sitemap.xml` en nieuwsbrief confirm/unsubscribe links.

## Supabase setup

1. Run de SQL migraties in `supabase/migrations/` op de Supabase database. Voor deze audit pack zijn vooral `202605120001_projects_featured_preview.sql`, `202605120002_admin_mfa_and_settings.sql`, `202605130001_newsletter.sql`, `202605130003_project_meta.sql` en `202605130004_leads.sql` belangrijk.
2. De migratie maakt of verhardt:
   - `public.profiles` met `user_id` en `role`.
   - `public.is_admin(uid uuid)`.
   - `public.portfolio_images` met gallery metadata.
   - RLS policies voor publieke reads en admin writes.
   - Storage bucket `portfolio-media` met publieke reads en admin-only writes.
3. Belangrijk: de migraties doen géén `ALTER TABLE storage.objects`, zodat Supabase owner errors worden vermeden.

## Admin rechten instellen

Een gebruiker krijgt admin toegang door de bijbehorende profile role op `admin` te zetten:

```sql
insert into public.profiles (user_id, role)
values ('<auth-user-id>', 'admin')
on conflict (user_id) do update set role = excluded.role, updated_at = now();
```

Admin routes controleren `profiles.role = 'admin'`. Ingelogde niet-admin gebruikers worden naar `/forbidden` gestuurd.

## Portfolio gallery checklist

Na deploy en migraties moet de admin gallery het volgende ondersteunen:

- Upload naar bucket `portfolio-media`.
- Insert in `public.portfolio_images`.
- Cover instellen met één cover per project.
- Volgorde wijzigen via upsert met volledige payload.
- Verwijderen uit storage en database, met idempotente database cleanup als een bestand al ontbreekt.

## SEO basis

- `public/robots.txt` verwijst naar `https://voswebdesigns.nl/sitemap.xml`.
- Vercel rewritet `/sitemap.xml` naar `/api/sitemap`.
- `/api/sitemap` bevat vaste pagina's en gepubliceerde portfolio projecten.
- Globale Open Graph en Twitter tags staan in `src/App.jsx`.


## Nieuwsbrief checklist

- Footer signup gebruikt double opt-in via `/api/newsletter/subscribe` en slaat subscribers server-side op in Supabase.
- Confirm en unsubscribe links lopen via `/api/newsletter/confirm` en `/api/newsletter/unsubscribe` en redirecten naar publieke statuspagina's.
- Admin campagnes staan op `/admin/newsletter`; content is DB-driven via `newsletter_campaigns.content_json` en afbeeldingen komen uit upload, galerij of URL.
- Als Resend het afzenderdomein nog niet heeft geverifieerd, gebruik tijdelijk `RESEND_FROM_EMAIL=onboarding@resend.dev` of laat `ADMIN_MFA_MODE=optional` staan tijdens onboarding.
