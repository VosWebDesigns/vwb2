import type { VercelRequest, VercelResponse } from '@vercel/node';

const STATIC_ROUTES = [
  '/',
  '/diensten',
  '/portfolio',
  '/over-ons',
  '/werkwijze',
  '/contact',
  '/privacy',
  '/voorwaarden',
];

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const normalizeSiteUrl = () => (process.env.SITE_URL || 'https://voswebdesigns.nl').replace(/\/$/, '');

const fetchPublishedProjectUrls = async () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('SITEMAP_SUPABASE_ENV_MISSING', {
      hasUrl: Boolean(supabaseUrl),
      hasAnonKey: Boolean(supabaseAnonKey),
    });
    return [];
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/projects?select=id,updated_at,created_at,is_published&is_published=eq.true`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('SITEMAP_PROJECT_FETCH_ERROR', {
      status: response.status,
      statusText: response.statusText,
      body,
    });
    return [];
  }

  const projects = await response.json();

  return (Array.isArray(projects) ? projects : []).map((project) => ({
    path: `/portfolio/${project.id}`,
    lastmod: project.updated_at || project.created_at,
  }));
};

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const siteUrl = normalizeSiteUrl();

  try {
    const projectRoutes = await fetchPublishedProjectUrls();
    const urls = [
      ...STATIC_ROUTES.map((path) => ({ path })),
      ...projectRoutes,
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ path, lastmod }) => `  <url>
    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>${lastmod ? `
    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('SITEMAP_ERROR', error);
    return res.status(500).send('Sitemap generation failed');
  }
}
