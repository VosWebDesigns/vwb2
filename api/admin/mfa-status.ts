import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCookieValue, MFA_COOKIE_NAME } from './mfa-utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  return res.status(200).json({ ok: getCookieValue(req, MFA_COOKIE_NAME) === '1' });
}
