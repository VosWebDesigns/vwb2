# Vos Web Designs vwb2

Launch-ready Vite + React 18 + React Router + Supabase + Vercel website for Vos Web Designs.

## Installeren en lokaal draaien

```bash
npm i
cp .env.example .env
npm run dev
```

## Build

```bash
npm run build
```

De build draait eerst `tools/generate-llms.js` en bouwt daarna de Vite SPA.

## Environment variables

Zet deze variabelen lokaal in `.env` en in Vercel bij Project Settings → Environment Variables:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=Vos Web Designs <contact@voswebdesigns.nl>
CONTACT_ADMIN_EMAIL=info@voswebdesigns.nl
SITE_URL=https://voswebdesigns.nl
```

- `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY` worden gebruikt door de frontend en serverless sitemap.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` en `CONTACT_ADMIN_EMAIL` worden gebruikt door `/api/contact`.
- `SITE_URL` wordt gebruikt voor absolute URLs in `/sitemap.xml`.

## Supabase setup

1. Run de SQL migraties in `supabase/migrations/` op de Supabase database. De launch-ready basis staat in `supabase/migrations/001_portfolio_gallery.sql`.
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
