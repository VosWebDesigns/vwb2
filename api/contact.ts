import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler, captureException } from './_sentry.js';
import { buildAdminLeadEmail, buildCustomerConfirmationEmail } from './email/templates.js';

const DEFAULT_FROM_EMAIL = 'Vos Web Designs <contact@voswebdesigns.nl>';
const DEFAULT_ADMIN_EMAIL = 'info@voswebdesigns.nl';
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  package?: string;
  message?: string;
  website?: string;
  company_website?: string;
};

const getClientIp = (req: VercelRequest) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (Array.isArray(forwardedFor)) return forwardedFor[0] || 'unknown';
  return forwardedFor?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
};

const isRateLimited = (key: string) => {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return current.count > RATE_LIMIT_MAX_REQUESTS;
};

const clean = (value: unknown) => String(value ?? '').trim();

const normalizePayload = (data: ContactPayload) => ({
  name: clean(data?.name),
  email: clean(data?.email).toLowerCase(),
  phone: clean(data?.phone),
  company: clean(data?.company),
  service: clean(data?.service),
  package: clean(data?.package),
  message: clean(data?.message),
});

const getSupabaseConfig = () => ({
  supabaseUrl: (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, ''),
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
});

const logLead = async (lead: ReturnType<typeof normalizePayload>) => {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('CONTACT_LEAD_LOG_CONFIG_MISSING');
    return { error: 'Lead configuration missing' };
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      ...lead,
      source: 'contact_form',
      status: 'Nieuw',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('CONTACT_LEAD_LOG_ERROR', { status: response.status, body });
    return { error: body };
  }

  return { error: null };
};

const sendEmail = async (payload: Record<string, unknown>) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    return { error: { status: response.status, statusText: response.statusText, body } };
  }

  return { data: await response.json(), error: null };
};

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const data = rawData as ContactPayload;
    const clientIp = getClientIp(req);
    const rateLimitKey = `${clientIp}:${clean(data?.email).toLowerCase()}`;

    if (isRateLimited(rateLimitKey)) {
      console.warn('CONTACT_RATE_LIMITED', { clientIp, email: data?.email });
      return res.status(429).json({ error: 'Too many requests' });
    }

    if (data?.website || data?.company_website) {
      console.warn('CONTACT_HONEYPOT_BLOCKED', { clientIp });
      return res.status(200).json({ success: true });
    }

    const lead = normalizePayload(data);

    if (!lead.email || !lead.name || !lead.message) {
      return res.status(400).json({ error: 'Invalid form data' });
    }

    const leadResult = await logLead(lead);
    if (leadResult.error) {
      console.error('CONTACT_LEAD_LOG_NON_BLOCKING_ERROR', leadResult.error);
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('CONTACT_RESEND_API_KEY_MISSING');
      return res.status(500).json({ error: 'Mail configuration missing' });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;
    const adminEmail = process.env.CONTACT_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
    const adminEmailContent = buildAdminLeadEmail(lead);
    const customerEmailContent = buildCustomerConfirmationEmail(lead);

    const adminResult = await sendEmail({
      from: fromEmail,
      to: [adminEmail],
      reply_to: lead.email,
      ...adminEmailContent,
    });

    if (adminResult.error) {
      console.error('CONTACT_ADMIN_MAIL_ERROR', adminResult.error);
      return res.status(500).json({ error: 'Admin mail failed' });
    }

    const customerResult = await sendEmail({
      from: fromEmail,
      to: [lead.email],
      reply_to: adminEmail,
      ...customerEmailContent,
    });

    if (customerResult.error) {
      console.error('CONTACT_CUSTOMER_MAIL_ERROR', customerResult.error);
      return res.status(500).json({ error: 'Customer mail failed' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('CONTACT_MAIL_ERROR', error);
    void captureException(error, { req, tags: { route: '/contact' } });
    return res.status(500).json({ error: 'Mail failed' });
  }
}

export default wrapHandler(handler, { route: '/contact.ts' });
