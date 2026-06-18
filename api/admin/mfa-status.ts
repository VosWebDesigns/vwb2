import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler } from '../../server/api/sentry.js';
import { getAdminMfaMode, getCookieValue, MFA_COOKIE_NAME } from '../../server/api/admin/mfa-utils.js';

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const mode = getAdminMfaMode();
  const verified = getCookieValue(req, MFA_COOKIE_NAME) === '1';

  if (mode === 'off') {
    return res.status(200).json({ ok: true, mode, verified: false, mfaRequired: false });
  }

  if (mode === 'optional' && !verified) {
    return res.status(200).json({
      ok: true,
      mode,
      verified: false,
      mfaRequired: false,
      reason: 'optional_not_verified',
    });
  }

  return res.status(200).json({ ok: verified, mode, verified, mfaRequired: !verified });
};

export default wrapHandler(handler, { route: '/admin/mfa-status' });
