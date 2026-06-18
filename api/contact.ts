import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler, captureException } from '../server/api/sentry.js';
import { buildAdminLeadEmail, buildCustomerConfirmationEmail } from '../server/api/email/templates.js';

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

const clean = (value: unknown) => String(value ?? '').trim();

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
  return current.count > RATE_LIMIT_MAX_REQUESTS;
};

const normalizePayload = (data: ContactPayload) => ({
  name: clean(data.name),
  email: clean(data.email).toLowerCase(),
  phone: clean(data.phone),
  company: clean(data.company),
  service: clean(data.service),
  package: clean(data.package),
  message: clean(data.message),
});

const sendEmail = async (payload: Record<string, unknown>) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Resend failed: ${response.status} ${await response.text()}`);
};

const logLead = async (lead: ReturnType<typeof normalizePayload>) => {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceRoleKey) return;

  const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ ...lead, source: 'contact_form', status: 'Nieuw' }),
  });

  if (!response.ok) console.error('CONTACT_LEAD_LOG_ERROR', { status: response.status, body: await response.text() });
};

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const rawData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const data = rawData as ContactPayload;
    const clientIp = getClientIp(req);
    const rateLimitKey = `${clientIp}:${clean(data.email).toLowerCase()}`;

    if (isRateLimited(rateLimitKey)) return res.status(429).json({ error: 'Too many requests' });
    if (data.website || data.company_website) return res.status(200).json({ success: true });

    const lead = normalizePayload(data);
    if (!lead.email || !lead.name || !lead.message) return res.status(400).json({ error: 'Invalid form data' });

    await logLead(lead);

    if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: 'Mail configuration missing' });

    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;
    const adminEmail = process.env.CONTACT_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;

    await sendEmail({
      from: fromEmail,
      to: [adminEmail],
      reply_to: lead.email,
      ...buildAdminLeadEmail(lead),
    });

    await sendEmail({
      from: fromEmail,
      to: [lead.email],
      reply_to: adminEmail,
      ...buildCustomerConfirmationEmail(lead),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('CONTACT_MAIL_ERROR', error);
    void captureException(error, { req, tags: { route: '/contact' } });
    return res.status(500).json({ error: 'Mail failed' });
  }
};

export default wrapHandler(handler, { route: '/contact.ts' });
