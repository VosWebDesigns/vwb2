import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler, captureException } from '../_sentry.js';
import { buildAdminMfaEmail } from './mfa-email.js';
import { generateCode, getAdminMfaMode, getBearerToken, getSupabaseConfig, getUserFromToken, hashCode, isAdminUser, isResendDomainNotVerified, newId, supabaseHeaders } from './mfa-utils.js';

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const mode = getAdminMfaMode();
    if (mode === 'off') return res.status(200).json({ success: true, mode, mfaDisabled: true });

    const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
    const user = await getUserFromToken(supabaseUrl, serviceRoleKey, getBearerToken(req));

    if (!user?.id || !user?.email) return res.status(401).json({ error: 'Unauthorized' });
    if (!(await isAdminUser(supabaseUrl, serviceRoleKey, user.id))) return res.status(403).json({ error: 'Forbidden' });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const upsertResponse = await fetch(`${supabaseUrl}/rest/v1/admin_mfa_codes?on_conflict=user_id`, {
      method: 'POST',
      headers: { ...supabaseHeaders(serviceRoleKey), Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ id: newId(), user_id: user.id, code_hash: hashCode(code), expires_at: expiresAt }),
    });

    if (!upsertResponse.ok) {
      const body = await upsertResponse.text();
      console.error('ADMIN_MFA_UPSERT_ERROR', { status: upsertResponse.status, body });
      return res.status(500).json({ error: 'MFA code could not be stored' });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Vos Web Designs <contact@voswebdesigns.nl>';
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      const payload = { success: false, reason: 'mail_config_missing', mode, error: 'Mail configuration missing' };
      return mode === 'optional' ? res.status(200).json(payload) : res.status(500).json(payload);
    }

    const { subject, html, text } = buildAdminMfaEmail({ code, email: user.email, expiresMinutes: 10 });

    const mailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromEmail,
        to: [user.email],
        subject,
        html,
        text,
      }),
    });

    if (!mailResponse.ok) {
      const body = await mailResponse.text();
      console.error('ADMIN_MFA_MAIL_ERROR', { status: mailResponse.status, body });
      if (isResendDomainNotVerified(mailResponse.status, body)) {
        return res.status(200).json({ success: false, reason: 'domain_not_verified', mode });
      }
      const payload = { success: false, reason: 'mail_failed', mode, error: 'MFA mail could not be sent' };
      return mode === 'optional' ? res.status(200).json(payload) : res.status(500).json(payload);
    }

    return res.status(200).json({ success: true, mode });
  } catch (error) {
    console.error('ADMIN_MFA_REQUEST_ERROR', error);
    void captureException(error, { req, tags: { route: '/admin/request-mfa' } });
    return res.status(500).json({ error: 'MFA request failed' });
  }
}

export default wrapHandler(handler, { route: '/admin/request-mfa.ts' });
