import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler } from '../../server/api/sentry.js';

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  return res.status(200).json({
    ok: true,
    mode: 'off',
    verified: false,
    mfaRequired: false,
    reason: 'disabled_for_hobby_deployment',
  });
};

export default wrapHandler(handler, { route: '/admin/mfa-status' });
