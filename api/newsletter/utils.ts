import { randomBytes, randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBearerToken, getSupabaseConfig, getUserFromToken, isAdminUser, supabaseHeaders } from '../admin/mfa-utils.js';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export const SITE_URL = () => (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.voswebdesigns.nl').replace(/\/$/, '');

export const parseBody = (body: unknown) => (typeof body === 'string' ? JSON.parse(body || '{}') : (body || {})) as Record<string, any>;
export const normalizeEmail = (email: unknown) => String(email || '').trim().toLowerCase();
export const newToken = () => `${randomUUID()}-${randomBytes(18).toString('hex')}`;
export const json = (res: VercelResponse, status: number, body: Record<string, unknown>) => res.status(status).json(body);

export const getClientIp = (req: VercelRequest) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (Array.isArray(forwardedFor)) return forwardedFor[0] || 'unknown';
  return forwardedFor?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
};

export const rest = async (path: string, init: RequestInit = {}) => {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...supabaseHeaders(serviceRoleKey),
      Prefer: 'return=representation',
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(`Supabase REST ${response.status}`) as Error & { data?: unknown; status?: number };
    error.data = data;
    error.status = response.status;
    throw error;
  }
  return data;
};

export const requireAdmin = async (req: VercelRequest) => {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  const token = getBearerToken(req);
  const user = await getUserFromToken(supabaseUrl, serviceRoleKey, token);
  const userId = user?.id;
  if (!userId || !(await isAdminUser(supabaseUrl, serviceRoleKey, userId))) return null;
  return { userId };
};

export const sendResendEmail = async (payload: Record<string, unknown>) => {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is required');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(`Resend ${response.status}`) as Error & { body?: unknown };
    error.body = body;
    throw error;
  }
  return body;
};
