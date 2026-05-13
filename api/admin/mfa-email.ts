export type AdminMfaEmailParams = {
  code: string;
  email: string;
  expiresMinutes?: number;
  siteUrl?: string;
  supportEmail?: string;
  brandName?: string;
};

export type AdminMfaEmail = {
  subject: string;
  html: string;
  text: string;
};

const DEFAULT_SITE_URL = process.env.SITE_URL || 'https://www.voswebdesigns.nl';
const DEFAULT_SUPPORT_EMAIL = 'info@voswebdesigns.nl';
const DEFAULT_BRAND_NAME = 'Vos Web Designs';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCode(code: string): string {
  const compactCode = code.replace(/\s+/g, '');
  return compactCode.replace(/(.{3})(?=.)/g, '$1 ').trim();
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

export function buildAdminMfaEmail({
  code,
  email,
  expiresMinutes = 10,
  siteUrl = DEFAULT_SITE_URL,
  supportEmail = DEFAULT_SUPPORT_EMAIL,
  brandName = DEFAULT_BRAND_NAME,
}: AdminMfaEmailParams): AdminMfaEmail {
  const formattedCode = formatCode(code);
  const compactCode = code.replace(/\s+/g, '');
  const safeBrandName = escapeHtml(brandName);
  const safeCode = escapeHtml(formattedCode);
  const safeEmail = escapeHtml(email);
  const safeSupportEmail = escapeHtml(supportEmail);
  const safeSupportMailto = escapeHtml(`mailto:${supportEmail}`);
  const safeSiteUrl = escapeHtml(trimTrailingSlash(siteUrl));
  const safeAdminUrl = `${safeSiteUrl}/login`;
  const year = new Date().getFullYear();
  const preheader = `Gebruik deze code om in te loggen op het beheerpaneel. Geldig ${expiresMinutes} min.`;
  const safePreheader = escapeHtml(preheader);
  const subject = `${brandName} Admin verificatiecode: ${formattedCode}`;

  const html = `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark light">
    <meta name="supported-color-schemes" content="dark light">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0; padding:0; width:100% !important; background:#0b1120; color:#e5e7eb; font-family:Arial, Helvetica, sans-serif; -webkit-font-smoothing:antialiased;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; line-height:1px; font-size:1px; mso-hide:all;">${safePreheader}</div>
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; line-height:1px; font-size:1px; mso-hide:all;">&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; background:#0b1120; margin:0; padding:0;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:600px; border-collapse:collapse;">
            <tr>
              <td style="padding:0 0 18px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td align="left" style="vertical-align:middle;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                        <tr>
                          <td align="center" valign="middle" style="width:44px; height:44px; border-radius:999px; background:#38bdf8; color:#0b1120; font-size:24px; font-weight:800; line-height:44px; text-align:center; font-family:Arial, Helvetica, sans-serif;">V</td>
                          <td style="padding-left:12px; color:#e5e7eb; font-size:18px; font-weight:700; letter-spacing:0.2px;">${safeBrandName}</td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" style="color:#9ca3af; font-size:12px; line-height:18px; vertical-align:middle;">Admin beveiliging</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#111827; border:1px solid #1f2937; border-radius:24px; box-shadow:0 24px 70px rgba(0,0,0,0.35); overflow:hidden;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:36px 32px 18px 32px; border-bottom:1px solid #1f2937; background:#0f172a;">
                      <p style="margin:0 0 12px 0; color:#38bdf8; font-size:13px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase;">Admin verificatiecode</p>
                      <h1 style="margin:0; color:#e5e7eb; font-size:30px; line-height:38px; font-weight:800;">Verifieer uw login</h1>
                      <p style="margin:14px 0 0 0; color:#9ca3af; font-size:15px; line-height:24px;">Gebruik onderstaande code om in te loggen op het beheerpaneel voor <span style="color:#e5e7eb;">${safeEmail}</span>.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                        <tr>
                          <td align="center" style="padding:24px 16px; background:#0b1120; border:1px solid #263244; border-radius:18px;">
                            <p style="margin:0 0 12px 0; color:#9ca3af; font-size:12px; font-weight:700; letter-spacing:1.6px; text-transform:uppercase;">Kopieer deze code</p>
                            <div style="margin:0; color:#e5e7eb; font-size:42px; line-height:50px; font-weight:800; letter-spacing:8px; font-family:'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">${safeCode}</div>
                            <p style="margin:12px 0 0 0; color:#38bdf8; font-size:13px; line-height:20px;">Tik en houd vast om te kopiëren</p>
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse; margin-top:24px;">
                        <tr>
                          <td style="padding:0; color:#e5e7eb; font-size:15px; line-height:24px;">
                            <p style="margin:0 0 12px 0; color:#e5e7eb; font-weight:700;">Belangrijk om te weten</p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                              <tr>
                                <td width="22" valign="top" style="color:#38bdf8; font-size:16px; line-height:24px;">•</td>
                                <td style="color:#9ca3af; font-size:15px; line-height:24px; padding-bottom:6px;">Geldig ${expiresMinutes} minuten</td>
                              </tr>
                              <tr>
                                <td width="22" valign="top" style="color:#38bdf8; font-size:16px; line-height:24px;">•</td>
                                <td style="color:#9ca3af; font-size:15px; line-height:24px; padding-bottom:6px;">Eenmalig te gebruiken</td>
                              </tr>
                              <tr>
                                <td width="22" valign="top" style="color:#38bdf8; font-size:16px; line-height:24px;">•</td>
                                <td style="color:#9ca3af; font-size:15px; line-height:24px; padding-bottom:6px;">Niet aangevraagd? Negeer deze e-mail</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse; margin-top:22px;">
                        <tr>
                          <td style="padding:16px; background:#0f172a; border:1px solid #243044; border-radius:14px; color:#9ca3af; font-size:14px; line-height:22px;">
                            <strong style="color:#e5e7eb;">Security note:</strong> deel deze code nooit met iemand. ${safeBrandName} zal nooit om uw verificatiecode vragen via telefoon, chat of e-mail.
                          </td>
                        </tr>
                      </table>
                      <p style="margin:24px 0 0 0; color:#9ca3af; font-size:14px; line-height:22px;">Wilt u direct verder? <a href="${safeAdminUrl}" style="color:#38bdf8; text-decoration:underline;">Open admin</a></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 16px 0 16px; color:#9ca3af; font-size:13px; line-height:21px;">
                <p style="margin:0 0 8px 0;">Hulp nodig? Mail <a href="${safeSupportMailto}" style="color:#38bdf8; text-decoration:underline;">${safeSupportEmail}</a></p>
                <p style="margin:0;">© ${year} ${safeBrandName}. Alle rechten voorbehouden.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${brandName} Admin verificatiecode

Code: ${compactCode}
Deze code verloopt over ${expiresMinutes} minuten.

Gebruik deze code om in te loggen op het beheerpaneel voor ${email}.
De code is eenmalig te gebruiken. Deel deze code nooit met iemand.

Heeft u dit niet aangevraagd? Negeer deze mail.
Support: ${supportEmail}
Admin: ${trimTrailingSlash(siteUrl)}/login`;

  return { subject, html, text };
}
