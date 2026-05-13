import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler, captureException } from '../_sentry.js';
import { rest, SITE_URL } from './utils.js';

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = String(req.query.token || '');
  const redirect = (path: string) => res.writeHead(302, { Location: `${SITE_URL()}${path}` }).end();
  if (!token) return redirect('/newsletter/confirmed?status=invalid');

  try {
    const rows = await rest(`newsletter_subscribers?select=id&or=(confirm_token.eq.${encodeURIComponent(token)},token.eq.${encodeURIComponent(token)})&status=eq.pending&limit=1`);
    if (!rows?.[0]?.id) return redirect('/newsletter/confirmed?status=invalid');
    await rest(`newsletter_subscribers?id=eq.${encodeURIComponent(rows[0].id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'active', confirmed_at: new Date().toISOString(), confirm_token: null, token: null, unsubscribed_at: null }),
    });
    return redirect('/newsletter/confirmed');
  } catch (error) {
    console.error('NEWSLETTER_CONFIRM_ERROR', error);
    void captureException(error, { req, tags: { route: '/newsletter/confirm' } });
    return redirect('/newsletter/confirmed?status=error');
  }
}

export default wrapHandler(handler, { route: '/newsletter/confirm.ts' });
