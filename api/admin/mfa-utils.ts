import { createHash, randomInt, randomUUID } from 'node:crypto';
import type { VercelRequest } from '@vercel/node';

export const MFA_COOKIE_NAME = 'admin_mfa';
export const MFA_MAX_AGE_SECONDS = 60 * 60 * 12;

export const hashCode = (code: string) => createHash('sha256').update(code).digest('hex');
export const generateCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');
export const newId = () => randomUUID();

export const getRequiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};


export const getAdminMfaMode = () => {
  const raw = (process.env.ADMIN_MFA_MODE || 'optional').toLowerCase();
  return raw === 'off' || raw === 'required' || raw === 'optional' ? raw : 'optional';
};

export const isResendDomainNotVerified = (status: number, body: string) => (
  status === 403 && /domain is not verified/i.test(body || '')
);

export const getBearerToken = (req: VercelRequest) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
};

export const getCookieValue = (req: VercelRequest, name: string) => {
  const cookie = req.headers.cookie || '';
  return cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
};

export const mfaCookie = () => `${MFA_COOKIE_NAME}=1; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MFA_MAX_AGE_SECONDS}`;
export const clearMfaCookie = () => `${MFA_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export const supabaseHeaders = (serviceRoleKey: string) => ({
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  'Content-Type': 'application/json',
});

export const getSupabaseConfig = () => ({
  supabaseUrl: (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')).replace(/\/$/, ''),
  serviceRoleKey: getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
});

export const getUserFromToken = async (supabaseUrl: string, anonOrServiceKey: string, token: string) => {
  if (!token) return null;
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonOrServiceKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
};

export const isAdminUser = async (supabaseUrl: string, serviceRoleKey: string, userId: string) => {
  const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=role&user_id=eq.${encodeURIComponent(userId)}&limit=1`, {
    headers: supabaseHeaders(serviceRoleKey),
  });

  if (!response.ok) return false;
  const rows = await response.json();
  return rows?.[0]?.role === 'admin';
};
