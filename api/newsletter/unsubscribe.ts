import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler, captureException } from '../_sentry.js';
import { rest, SITE_URL } from './utils.js';

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = String(req.query.token || '');
  const redirect = (path: string) => res.writeHead(302, { Location: `${SITE_URL()}${path}` }).end();
  if (!token) return redirect('/newsletter/unsubscribed?status=invalid');

  try {
    const rows = await rest(`newsletter_subscribers?select=id&unsubscribe_token=eq.${encodeURIComponent(token)}&limit=1`);
    if (!rows?.[0]?.id) return redirect('/newsletter/unsubscribed?status=invalid');
    await rest(`newsletter_subscribers?id=eq.${encodeURIComponent(rows[0].id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() }),
    });
    return redirect('/newsletter/unsubscribed');
  } catch (error) {
    console.error('NEWSLETTER_UNSUBSCRIBE_ERROR', error);
    void captureException(error, { req, tags: { route: '/newsletter/unsubscribe' } });
    return redirect('/newsletter/unsubscribed?status=error');
  }
}

export default wrapHandler(handler, { route: '/newsletter/unsubscribe.ts' });
