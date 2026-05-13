import type { VercelRequest, VercelResponse } from '@vercel/node';
import { wrapHandler, captureException } from '../_sentry.js';
import { buildConfirmEmail } from './email-templates.js';
import { EMAIL_RE, getClientIp, isResendDomainNotVerifiedError, json, newToken, normalizeEmail, parseBody, rest, sendResendEmail, SITE_URL } from './utils.js';

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const isLimited = (key: string) => {
  const now = Date.now();
  const current = rateLimitStore.get(key);
  if (!current || current.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
};

const handler = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const body = parseBody(req.body);
    const email = normalizeEmail(body.email);
    const ip = getClientIp(req);

    if (body.website) return json(res, 200, { success: true, message: 'Check je mail om te bevestigen.' });
    if (!EMAIL_RE.test(email)) return json(res, 400, { error: 'Vul een geldig e-mailadres in.' });
    if (isLimited(`${ip}:${email}`)) return json(res, 429, { error: 'Te veel pogingen. Probeer het later opnieuw.' });

    const existing = await rest(`newsletter_subscribers?select=*&email=eq.${encodeURIComponent(email)}&limit=1`);
    if (existing?.[0]?.status === 'active') return json(res, 200, { success: true, message: 'Je bent al ingeschreven.' });

    const token = newToken();
    const row = {
      email,
      status: 'pending',
      confirm_token: token,
      token,
      unsubscribe_token: existing?.[0]?.unsubscribe_token || newToken(),
      confirmed_at: null,
      unsubscribed_at: null,
    };

    await rest('newsletter_subscribers?on_conflict=email', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(row),
    });

    const confirmUrl = `${SITE_URL()}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
    const emailPayload = buildConfirmEmail({ confirmUrl, email });
    try {
      await sendResendEmail({
        from: process.env.RESEND_FROM_EMAIL || 'Vos Web Designs <contact@voswebdesigns.nl>',
        to: [email],
        subject: 'Bevestig je inschrijving – Vos Web Designs',
        html: emailPayload.html,
        text: emailPayload.text,
      });
    } catch (mailError) {
      console.error('NEWSLETTER_CONFIRM_MAIL_ERROR', mailError);
      if (isResendDomainNotVerifiedError(mailError)) {
        return json(res, 200, {
          success: false,
          reason: 'domain_not_verified',
          error: 'Nieuwsbriefmail kon niet worden verstuurd: verifieer het Resend domein of gebruik tijdelijk onboarding@resend.dev.',
        });
      }
      return json(res, 500, { error: 'Bevestigingsmail kon niet worden verstuurd.' });
    }

    return json(res, 200, { success: true, message: 'Check je mail om te bevestigen.' });
  } catch (error) {
    console.error('NEWSLETTER_SUBSCRIBE_ERROR', error);
    void captureException(error, { req, tags: { route: '/newsletter/subscribe' } });
    return json(res, 500, { error: 'Inschrijven is tijdelijk niet gelukt.' });
  }
}

export default wrapHandler(handler, { route: '/newsletter/subscribe.ts' });
