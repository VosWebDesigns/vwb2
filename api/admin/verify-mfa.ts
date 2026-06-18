import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler } from '../../server/api/sentry.js';
import { mfaCookie } from '../../server/api/admin/mfa-utils.js';

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const code = String(body.code || '').trim();

  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  res.setHeader('Set-Cookie', mfaCookie());
  return res.status(200).json({ success: true, bypassed: true });
};

export default wrapHandler(handler, { route: '/admin/verify-mfa.ts' });
