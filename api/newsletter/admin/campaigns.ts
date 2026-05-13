import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler, captureException } from '../../_sentry.js';
import { json, parseBody, requireAdmin, rest } from '../utils.js';

const sanitizeCampaign = (body: Record<string, any>, userId?: string) => ({
  title: String(body.title || '').trim(),
  subject: String(body.subject || '').trim(),
  preheader: String(body.preheader || '').trim(),
  hero_image_url: String(body.hero_image_url || '').trim(),
  content_json: body.content_json && typeof body.content_json === 'object' ? body.content_json : { blocks: [] },
  ...(userId ? { created_by: userId } : {}),
});

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req);
  if (!admin) return json(res, 401, { error: 'Unauthorized' });

  try {
    if (req.method === 'GET') {
      const campaigns = await rest('newsletter_campaigns?select=*&order=created_at.desc');
      const ids = campaigns.map((c: any) => c.id).filter(Boolean);
      let stats: Record<string, Record<string, number>> = {};
      if (ids.length) {
        const logs = await rest(`newsletter_send_log?select=campaign_id,status&campaign_id=in.(${ids.join(',')})`);
        stats = logs.reduce((acc: Record<string, Record<string, number>>, log: any) => {
          acc[log.campaign_id] ||= { sent: 0, failed: 0, skipped: 0 };
          acc[log.campaign_id][log.status] = (acc[log.campaign_id][log.status] || 0) + 1;
          return acc;
        }, {});
      }
      return json(res, 200, { campaigns: campaigns.map((campaign: any) => ({ ...campaign, stats: stats[campaign.id] || { sent: 0, failed: 0, skipped: 0 } })) });
    }

    if (req.method === 'POST') {
      const payload = sanitizeCampaign(parseBody(req.body), admin.userId);
      if (!payload.title || !payload.subject) return json(res, 400, { error: 'Titel en onderwerp zijn verplicht.' });
      const rows = await rest('newsletter_campaigns', { method: 'POST', body: JSON.stringify(payload) });
      return json(res, 200, { campaign: rows?.[0] });
    }

    if (req.method === 'PUT') {
      const body = parseBody(req.body);
      const id = String(body.id || '');
      if (!id) return json(res, 400, { error: 'Campaign id ontbreekt.' });
      const payload = sanitizeCampaign(body);
      if (!payload.title || !payload.subject) return json(res, 400, { error: 'Titel en onderwerp zijn verplicht.' });
      const rows = await rest(`newsletter_campaigns?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
      return json(res, 200, { campaign: rows?.[0] });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('NEWSLETTER_ADMIN_CAMPAIGNS_ERROR', error);
    void captureException(error, { req, tags: { route: '/newsletter/admin/campaigns' } });
    return json(res, 500, { error: 'Campaign request failed' });
  }
}

export default wrapHandler(handler, { route: '/newsletter/admin/campaigns.ts' });
