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

const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatCode = (code: string) => code.replace(/\s+/g, '').replace(/(.{3})(?=.)/g, '$1 ').trim();

export function buildAdminMfaEmail({
  code,
  email,
  expiresMinutes = 10,
  siteUrl = process.env.SITE_URL || 'https://www.voswebdesigns.nl',
  supportEmail = 'info@voswebdesigns.nl',
  brandName = 'Vos Web Designs',
}: AdminMfaEmailParams): AdminMfaEmail {
  const formattedCode = formatCode(code);
  const compactCode = code.replace(/\s+/g, '');
  const loginUrl = `${siteUrl.replace(/\/+$/, '')}/login`;
  const subject = `${brandName} Admin verificatiecode: ${formattedCode}`;
  const html = `<!doctype html>
<html lang="nl">
  <body style="margin:0;padding:0;background:#0b1120;color:#e5e7eb;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0b1120;padding:32px 16px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background:#111827;border:1px solid #1f2937;border-radius:22px;overflow:hidden;">
          <tr><td style="padding:30px;background:#0f172a;border-bottom:1px solid #1f2937;">
            <p style="margin:0 0 10px;color:#38bdf8;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Admin verificatiecode</p>
            <h1 style="margin:0;color:#e5e7eb;font-size:28px;line-height:1.2;">Verifieer uw login</h1>
            <p style="margin:14px 0 0;color:#9ca3af;line-height:1.6;">Gebruik deze code om in te loggen op het beheerpaneel voor ${escapeHtml(email)}.</p>
          </td></tr>
          <tr><td align="center" style="padding:34px 28px;">
            <div style="display:inline-block;background:#0b1120;border:1px solid #263244;border-radius:18px;padding:24px 30px;color:#e5e7eb;font-size:40px;font-weight:800;letter-spacing:8px;font-family:Consolas,monospace;">${escapeHtml(formattedCode)}</div>
            <p style="margin:22px 0 0;color:#9ca3af;line-height:1.6;">Deze code verloopt over ${expiresMinutes} minuten en is eenmalig te gebruiken.</p>
            <p style="margin:14px 0 0;color:#9ca3af;line-height:1.6;">Niet aangevraagd? Negeer deze mail.</p>
            <p style="margin:22px 0 0;"><a href="${escapeHtml(loginUrl)}" style="color:#38bdf8;">Open admin</a></p>
          </td></tr>
          <tr><td style="padding:20px 28px;background:#0f172a;color:#9ca3af;font-size:13px;line-height:1.6;">
            ${escapeHtml(brandName)} · Support: <a href="mailto:${escapeHtml(supportEmail)}" style="color:#38bdf8;">${escapeHtml(supportEmail)}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
  const text = `${brandName} Admin verificatiecode\n\nCode: ${compactCode}\nDeze code verloopt over ${expiresMinutes} minuten.\n\nGebruik deze code om in te loggen op het beheerpaneel voor ${email}.\nAdmin: ${loginUrl}\nSupport: ${supportEmail}`;

  return { subject, html, text };
}
