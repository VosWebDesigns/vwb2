import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildCampaignEmail } from '../email-templates.js';
import { EMAIL_RE, json, normalizeEmail, parseBody, requireAdmin, rest, sendResendEmail, SITE_URL } from '../utils.js';

const MAX_BATCH = 50;

const campaignBlocks = (campaign: any) => Array.isArray(campaign?.content_json?.blocks) ? campaign.content_json.blocks : [];

const logSend = async (campaignId: string, email: string, status: 'sent' | 'failed' | 'skipped', error = '') => {
  await rest('newsletter_send_log', {
    method: 'POST',
    body: JSON.stringify({ campaign_id: campaignId, email, status, error }),
  }).catch((logError) => console.error('NEWSLETTER_LOG_ERROR', logError));
};

const sendCampaignTo = async (campaign: any, recipient: { email: string; unsubscribe_token?: string }, test = false) => {
  const unsubscribeUrl = test
    ? `${SITE_URL()}/newsletter/unsubscribed?preview=1`
    : `${SITE_URL()}/api/newsletter/unsubscribe?token=${encodeURIComponent(recipient.unsubscribe_token || '')}`;
  const rendered = buildCampaignEmail({
    title: campaign.subject || campaign.title,
    preheader: campaign.preheader || '',
    blocks: campaignBlocks(campaign),
    heroImageUrl: campaign.hero_image_url || '',
    heroAlt: campaign.content_json?.hero_alt || '',
    unsubscribeUrl,
  });
  return sendResendEmail({
    from: process.env.RESEND_FROM_EMAIL || 'Vos Web Designs <contact@voswebdesigns.nl>',
    to: [recipient.email],
    subject: campaign.subject,
    html: rendered.html,
    text: rendered.text,
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const admin = await requireAdmin(req);
  if (!admin) return json(res, 401, { error: 'Unauthorized' });

  try {
    const body = parseBody(req.body);
    const campaignId = String(body.campaign_id || '');
    const mode = body.mode === 'send' ? 'send' : 'test';
    if (!campaignId) return json(res, 400, { error: 'Campaign id ontbreekt.' });

    const campaigns = await rest(`newsletter_campaigns?select=*&id=eq.${encodeURIComponent(campaignId)}&limit=1`);
    const campaign = campaigns?.[0];
    if (!campaign) return json(res, 404, { error: 'Campaign niet gevonden.' });

    if (mode === 'test') {
      const testEmail = normalizeEmail(body.test_email);
      if (!EMAIL_RE.test(testEmail)) return json(res, 400, { error: 'Vul een geldig testadres in.' });
      await sendCampaignTo(campaign, { email: testEmail }, true);
      return json(res, 200, { success: true, message: 'Testmail verstuurd.' });
    }

    const offset = Number.isFinite(Number(body.offset)) ? Math.max(0, Number(body.offset)) : 0;
    await rest(`newsletter_campaigns?id=eq.${encodeURIComponent(campaignId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'sending' }),
    });

    const subscribers = await rest(`newsletter_subscribers?select=email,unsubscribe_token&status=eq.active&order=created_at.asc&offset=${offset}&limit=${MAX_BATCH}`);
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const alreadySent = await rest(`newsletter_send_log?select=id&campaign_id=eq.${encodeURIComponent(campaignId)}&email=eq.${encodeURIComponent(subscriber.email)}&status=eq.sent&limit=1`);
      if (alreadySent?.[0]) {
        await logSend(campaignId, subscriber.email, 'skipped', 'Already sent');
        continue;
      }
      try {
        await sendCampaignTo(campaign, subscriber);
        await logSend(campaignId, subscriber.email, 'sent');
        sent += 1;
      } catch (sendError: any) {
        failed += 1;
        await logSend(campaignId, subscriber.email, 'failed', sendError?.message || 'Send failed');
      }
    }

    const hasMore = subscribers.length === MAX_BATCH;
    if (!hasMore) {
      await rest(`newsletter_campaigns?id=eq.${encodeURIComponent(campaignId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'sent', sent_at: new Date().toISOString() }),
      });
    }

    return json(res, 200, { success: true, sent, failed, processed: subscribers.length, next_offset: hasMore ? offset + MAX_BATCH : null, status: hasMore ? 'sending' : 'sent' });
  } catch (error) {
    console.error('NEWSLETTER_ADMIN_SEND_ERROR', error);
    return json(res, 500, { error: 'Versturen is mislukt.' });
  }
}
