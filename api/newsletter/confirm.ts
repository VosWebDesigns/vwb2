import type { VercelRequest, VercelResponse } from '@vercel/node';
import { rest, SITE_URL } from './utils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = String(req.query.token || '');
  const redirect = (path: string) => res.writeHead(302, { Location: `${SITE_URL()}${path}` }).end();
  if (!token) return redirect('/newsletter/confirmed?status=invalid');

  try {
    const rows = await rest(`newsletter_subscribers?select=id&token=eq.${encodeURIComponent(token)}&status=eq.pending&limit=1`);
    if (!rows?.[0]?.id) return redirect('/newsletter/confirmed?status=invalid');
    await rest(`newsletter_subscribers?id=eq.${encodeURIComponent(rows[0].id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'active', confirmed_at: new Date().toISOString(), token: null, unsubscribed_at: null }),
    });
    return redirect('/newsletter/confirmed');
  } catch (error) {
    console.error('NEWSLETTER_CONFIRM_ERROR', error);
    return redirect('/newsletter/confirmed?status=error');
  }
}
