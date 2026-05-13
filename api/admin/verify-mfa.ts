import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearMfaCookie, getBearerToken, getSupabaseConfig, getUserFromToken, hashCode, isAdminUser, mfaCookie, supabaseHeaders } from './mfa-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { code } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
    const user = await getUserFromToken(supabaseUrl, serviceRoleKey, getBearerToken(req));

    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });
    if (!(await isAdminUser(supabaseUrl, serviceRoleKey, user.id))) return res.status(403).json({ error: 'Forbidden' });
    if (!/^\d{6}$/.test(String(code || ''))) return res.status(400).json({ error: 'Invalid code' });

    const response = await fetch(`${supabaseUrl}/rest/v1/admin_mfa_codes?select=id,code_hash,expires_at&user_id=eq.${encodeURIComponent(user.id)}&limit=1`, {
      headers: supabaseHeaders(serviceRoleKey),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('ADMIN_MFA_FETCH_ERROR', { status: response.status, body });
      return res.status(500).json({ error: 'MFA check failed' });
    }

    const row = (await response.json())?.[0];
    const valid = row?.code_hash === hashCode(String(code)) && new Date(row.expires_at).getTime() > Date.now();

    if (!valid) {
      res.setHeader('Set-Cookie', clearMfaCookie());
      return res.status(401).json({ error: 'Code ongeldig of verlopen' });
    }

    await fetch(`${supabaseUrl}/rest/v1/admin_mfa_codes?user_id=eq.${encodeURIComponent(user.id)}`, {
      method: 'DELETE',
      headers: supabaseHeaders(serviceRoleKey),
    });

    res.setHeader('Set-Cookie', mfaCookie());
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('ADMIN_MFA_VERIFY_ERROR', error);
    return res.status(500).json({ error: 'MFA verify failed' });
  }
}
