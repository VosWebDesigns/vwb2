type LeadEmailData = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  package?: string;
  message?: string;
};

const LOGO_URL = 'https://voswebdesigns.nl/logo.jpeg';
const CONTACT_EMAIL = 'info@voswebdesigns.nl';

const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const asLine = (label: string, value: unknown) => `${label}: ${String(value || '-').trim() || '-'}`;

const rows = (data: LeadEmailData) => [
  ['Naam', data.name],
  ['Email', data.email],
  ['Telefoon', data.phone],
  ['Bedrijf', data.company],
  ['Dienst', data.service],
  ['Pakket', data.package],
  ['Bericht', data.message],
];

const detailTable = (data: LeadEmailData) => `
  <table style="width:100%;border-collapse:collapse;margin:22px 0;background:#111827;border:1px solid #253041;border-radius:14px;overflow:hidden;">
    <tbody>
      ${rows(data).map(([label, value]) => `
        <tr>
          <td style="width:150px;padding:12px 14px;border-bottom:1px solid #253041;color:#93a4b8;font-size:13px;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #253041;color:#f8fafc;white-space:pre-wrap;">${escapeHtml(value || '-')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`;

const shell = (title: string, intro: string, body: string) => `<!doctype html>
<html lang="nl">
  <body style="margin:0;padding:0;background:#020617;font-family:Arial,Helvetica,sans-serif;color:#f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table width="620" cellpadding="0" cellspacing="0" role="presentation" style="max-width:620px;width:100%;background:#0b1220;border:1px solid #1f2a3d;border-radius:22px;overflow:hidden;">
            <tr>
              <td style="padding:30px;text-align:center;background:linear-gradient(135deg,#0f172a,#111827);">
                <img src="${LOGO_URL}" width="140" alt="Vos Web Designs" style="max-width:140px;border-radius:12px;" />
                <h1 style="margin:22px 0 8px;color:#38bdf8;font-size:28px;line-height:1.2;">${escapeHtml(title)}</h1>
                <p style="margin:0;color:#cbd5e1;line-height:1.7;">${escapeHtml(intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;color:#e2e8f0;font-size:16px;line-height:1.7;">
                ${body}
                <hr style="border:none;border-top:1px solid #253041;margin:30px 0;" />
                <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.7;">
                  <strong style="color:#f8fafc;">Vos Web Designs</strong><br />
                  Professioneel webdesign & ontwikkeling<br />
                  <a href="mailto:${CONTACT_EMAIL}" style="color:#38bdf8;text-decoration:none;">${CONTACT_EMAIL}</a><br />
                  Lelystad, Nederland
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const textSummary = (data: LeadEmailData) => [
  asLine('Naam', data.name),
  asLine('Email', data.email),
  asLine('Telefoon', data.phone),
  asLine('Bedrijf', data.company),
  asLine('Dienst', data.service),
  asLine('Pakket', data.package),
  '',
  'Bericht:',
  String(data.message || '-'),
].join('\n');

export const buildAdminLeadEmail = (data: LeadEmailData) => {
  const subject = `Nieuwe aanvraag: ${data.name} – ${data.service || 'Contact'}`;
  const html = shell(
    'Nieuwe aanvraag ontvangen',
    'Er staat een nieuwe lead klaar in de admin inbox.',
    `<p>Gebruik deze e-mail om direct te reageren; de reply-to staat op het e-mailadres van de klant.</p>${detailTable(data)}`
  );
  const text = `Nieuwe aanvraag ontvangen\n\n${textSummary(data)}`;
  return { subject, html, text };
};

export const buildCustomerConfirmationEmail = (data: LeadEmailData) => {
  const subject = 'We hebben je aanvraag ontvangen – Vos Web Designs';
  const html = shell(
    'We hebben je aanvraag ontvangen',
    'Bedankt voor je bericht. We reageren binnen 24 uur met een persoonlijke vervolgstap.',
    `<p>Beste ${escapeHtml(data.name)},</p><p>We hebben je aanvraag goed ontvangen. Hieronder staat de samenvatting die bij ons in de inbox staat.</p>${detailTable(data)}<p>Wil je nog iets toevoegen? Reageer gerust op deze e-mail.</p><p>Met vriendelijke groet,<br /><strong>Melvin Vos</strong></p>`
  );
  const text = `Beste ${data.name},\n\nWe hebben je aanvraag ontvangen en reageren binnen 24 uur.\n\n${textSummary(data)}\n\nVos Web Designs`;
  return { subject, html, text };
};
