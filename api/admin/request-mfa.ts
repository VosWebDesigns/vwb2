import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateCode, getBearerToken, getSupabaseConfig, getUserFromToken, hashCode, isAdminUser, newId, supabaseHeaders } from './mfa-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
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
    if (!resendKey) return res.status(500).json({ error: 'Mail configuration missing' });

    const mailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromEmail,
        to: [user.email],
        subject: 'Vos Admin verificatiecode',
        html: `<p>Uw Vos Admin verificatiecode is:</p><h1 style="letter-spacing:6px;">${code}</h1><p>Deze code verloopt over 10 minuten.</p>`,
      }),
    });

    if (!mailResponse.ok) {
      const body = await mailResponse.text();
      console.error('ADMIN_MFA_MAIL_ERROR', { status: mailResponse.status, body });
      return res.status(500).json({ error: 'MFA mail could not be sent' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('ADMIN_MFA_REQUEST_ERROR', error);
    return res.status(500).json({ error: 'MFA request failed' });
  }
}
