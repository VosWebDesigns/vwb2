import type { VercelRequest, VercelResponse } from '@vercel/node';

const LOGO_URL = 'https://voswebdesigns.nl/logo.jpeg';
const DEFAULT_FROM_EMAIL = 'Vos Web Designs <contact@voswebdesigns.nl>';
const DEFAULT_ADMIN_EMAIL = 'info@voswebdesigns.nl';
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const serviceCopy: Record<string, { title: string; introCustomer: string; introAdmin: string; deepText: string }> = {
  webdesign: {
    title: 'Uw nieuwe website begint hier',
    introCustomer: 'Hartelijk dank voor uw bericht. Wij hebben uw aanvraag goed ontvangen en nemen binnen 24 uur persoonlijk contact met u op.',
    introAdmin: 'Er is een nieuwe webdesign aanvraag binnengekomen via het contactformulier.',
    deepText: 'Een professionele website is het fundament van uw online uitstraling. Wij zorgen ervoor dat design, gebruiksvriendelijkheid en conversie perfect samenkomen.',
  },
  ecommerce: {
    title: 'Samen bouwen aan een succesvolle webshop',
    introCustomer: 'Hartelijk dank voor uw bericht. Wij hebben uw webshop-aanvraag goed ontvangen en nemen binnen 24 uur persoonlijk contact met u op.',
    introAdmin: 'Er is een nieuwe e-commerce aanvraag binnengekomen via het contactformulier.',
    deepText: 'Een goede webshop verkoopt. Daarom focussen wij op snelheid, vertrouwen en een soepele gebruikerservaring.',
  },
  development: {
    title: 'Maatwerk webontwikkeling',
    introCustomer: 'Hartelijk dank voor uw bericht. Uw aanvraag voor maatwerk webontwikkeling is goed ontvangen.',
    introAdmin: 'Er is een nieuwe aanvraag voor maatwerk webontwikkeling binnengekomen.',
    deepText: 'Bij maatwerk webontwikkeling denken wij actief mee over techniek, schaalbaarheid en toekomstbestendigheid.',
  },
  seo: {
    title: 'Meer zichtbaarheid en online groei',
    introCustomer: 'Hartelijk dank voor uw bericht. Wij hebben uw SEO-aanvraag goed ontvangen.',
    introAdmin: 'Er is een nieuwe SEO & marketing aanvraag binnengekomen.',
    deepText: 'Goede vindbaarheid begint bij een sterke technische basis en een duidelijke langetermijnstrategie.',
  },
  other: {
    title: 'Uw aanvraag is ontvangen',
    introCustomer: 'Hartelijk dank voor uw bericht. Wij hebben uw aanvraag goed ontvangen en nemen contact met u op.',
    introAdmin: 'Er is een nieuwe contactaanvraag binnengekomen.',
    deepText: 'Elke aanvraag is uniek. Wij bekijken zorgvuldig wat de beste vervolgstap is.',
  },
};

const packageCopy: Record<string, { title: string; text: string }> = {
  Starter: {
    title: 'Gekozen pakket: Starter',
    text: 'De klant kiest voor een solide basis met een professionele en overzichtelijke aanpak.',
  },
  Groei: {
    title: 'Gekozen pakket: Groei',
    text: 'De klant wil doorgroeien en verwacht strategisch meedenken en schaalbaarheid.',
  },
  Pro: {
    title: 'Gekozen pakket: Pro',
    text: 'De klant kiest voor volledig maatwerk en maximale impact.',
  },
};

const emailFooter = `
<hr style="border:none;border-top:1px solid #2a2a2a;margin:32px 0;" />
<p style="font-size:14px;color:#aaa;line-height:1.6;">
<strong>Vos Web Designs</strong><br />
Professioneel webdesign & ontwikkeling<br /><br />
📧 <a href="mailto:info@voswebdesigns.nl" style="color:#D4AF37;text-decoration:none;">info@voswebdesigns.nl</a><br />
📍 Lelystad, Nederland
</p>
<p style="font-size:12px;color:#666;">
© ${new Date().getFullYear()} Vos Web Designs · Alle rechten voorbehouden
</p>
`;

const sharedTemplate = (data: any, isAdmin = false) => {
  const service = serviceCopy[data.service] || serviceCopy.other;
  const pkg = packageCopy[data.package];

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 16px;">
<table width="600" style="background:#111;border-radius:16px;border:1px solid #2a2a2a;">
<tr><td style="padding:32px;text-align:center;"><img src="${LOGO_URL}" width="160" style="margin-bottom:20px;" /><h1 style="color:#D4AF37;">${service.title}</h1><p style="color:#aaa;">Vos Web Designs</p></td></tr>
<tr><td style="padding:0 40px 32px;font-size:16px;line-height:1.7;">
${isAdmin ? '<p><strong>Nieuwe aanvraag ontvangen</strong></p>' : `<p>Beste <strong>${data.name}</strong>,</p>`}
<p>${isAdmin ? service.introAdmin : service.introCustomer}</p>
<p>${service.deepText}</p>
${pkg ? `<h3 style="color:#D4AF37;">${pkg.title}</h3><p>${pkg.text}</p>` : ''}
<div style="margin:28px 0;padding:22px;background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;">
<strong style="color:#D4AF37;">${isAdmin ? 'Aanvraaggegevens' : 'Samenvatting van uw aanvraag'}</strong><br /><br />
<strong>Naam:</strong> ${data.name}<br />
<strong>Email:</strong> ${data.email}<br />
<strong>Telefoon:</strong> ${data.phone || '-'}<br />
<strong>Bedrijf:</strong> ${data.company || '-'}<br />
<strong>Dienst:</strong> ${data.service || '-'}<br />
<strong>Pakket:</strong> ${data.package || '-'}<br /><br />
<strong>Bericht:</strong><br />
${data.message}
</div>
<p>Met vriendelijke groet,<br /><strong>Melvin Vos</strong><br />Vos Web Designs</p>
${emailFooter}
</td></tr>
</table>
</td>
</tr>
</table>
</body>
</html>
`;
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const clientIp = getClientIp(req);
    const rateLimitKey = `${clientIp}:${String(data?.email || '').toLowerCase()}`;

    if (isRateLimited(rateLimitKey)) {
      console.warn('CONTACT_RATE_LIMITED', { clientIp, email: data?.email });
      return res.status(429).json({ error: 'Too many requests' });
    }

    if (data?.company_website) {
      console.warn('CONTACT_HONEYPOT_BLOCKED', { clientIp });
      return res.status(200).json({ success: true });
    }

    if (!data?.email || !data?.name || !data?.message) {
      return res.status(400).json({ error: 'Invalid form data' });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('CONTACT_RESEND_API_KEY_MISSING');
      return res.status(500).json({ error: 'Mail configuration missing' });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;
    const adminEmail = process.env.CONTACT_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
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

    const adminResult = await sendEmail({
      from: fromEmail,
      to: [adminEmail],
      subject: `Nieuwe aanvraag: ${data.name}`,
      html: sharedTemplate(data, true),
      reply_to: data.email,
    });

    if (adminResult.error) {
      console.error('CONTACT_ADMIN_MAIL_ERROR', adminResult.error);
      return res.status(500).json({ error: 'Admin mail failed' });
    }

    const customerResult = await sendEmail({
      from: fromEmail,
      to: [data.email],
      subject: 'Wij hebben uw bericht ontvangen',
      html: sharedTemplate(data, false),
      reply_to: adminEmail,
    });

    if (customerResult.error) {
      console.error('CONTACT_CUSTOMER_MAIL_ERROR', customerResult.error);
      return res.status(500).json({ error: 'Customer mail failed' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('CONTACT_MAIL_ERROR', error);
    return res.status(500).json({ error: 'Mail failed' });
  }
}
