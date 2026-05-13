import { SITE_URL } from './utils.js';

type Block = {
  type?: string;
  text?: string;
  url?: string;
  alt?: string;
  label?: string;
  href?: string;
  caption?: string;
};

const accent = '#38bdf8';
const bg = '#050b14';
const panel = '#0b1524';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const nl2br = (value = '') => escapeHtml(value).replace(/\n/g, '<br />');

const absoluteUrl = (value = '') => {
  const url = String(value || '').trim();
  if (!url) return '';
  try {
    return new URL(url, SITE_URL()).toString();
  } catch {
    return '';
  }
};

const button = (href: string, label: string) => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:26px 0;">
  <tr><td style="border-radius:999px;background:${accent};">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 22px;color:#020617;font-family:Arial,sans-serif;font-weight:800;text-decoration:none;border-radius:999px;">${escapeHtml(label)}</a>
  </td></tr>
</table>`;

const shell = ({ preheader = '', children, textFooter = '' }: { preheader?: string; children: string; textFooter?: string }) => ({
  html: `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vos Web Designs</title></head>
<body style="margin:0;padding:0;background:${bg};color:#e2e8f0;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${bg};padding:28px 14px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:${panel};border:1px solid #1e293b;border-radius:24px;overflow:hidden;">
        <tr><td style="padding:26px 28px;border-bottom:1px solid #1e293b;">
          <div style="font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:${accent};font-weight:800;">Vos Web Designs</div>
        </td></tr>
        <tr><td style="padding:30px 28px;font-family:Arial,sans-serif;color:#e2e8f0;line-height:1.7;">${children}</td></tr>
        <tr><td style="padding:22px 28px;background:#07111f;border-top:1px solid #1e293b;font-family:Arial,sans-serif;color:#94a3b8;font-size:12px;line-height:1.7;">
          <strong style="color:#e2e8f0;">Vos Web Designs</strong><br />Professionele websites, strategie en groei.<br />${textFooter}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
});

export const buildConfirmEmail = ({ confirmUrl, email }: { confirmUrl: string; email: string }) => {
  const content = `
    <h1 style="margin:0 0 14px;font-size:30px;line-height:1.15;color:#ffffff;">Bevestig je inschrijving</h1>
    <p style="margin:0 0 16px;color:#cbd5e1;">Je ontvangt na bevestiging maximaal 1x per maand praktische tips, cases en updates van Vos Web Designs.</p>
    ${button(confirmUrl, 'Inschrijving bevestigen')}
    <p style="margin:0;color:#94a3b8;font-size:13px;">Werkt de knop niet? Kopieer deze link:<br /><a href="${escapeHtml(confirmUrl)}" style="color:${accent};">${escapeHtml(confirmUrl)}</a></p>
  `;
  return {
    ...shell({ preheader: 'Nog één klik om je nieuwsbriefinschrijving te bevestigen.', children: content }),
    text: `Bevestig je inschrijving voor ${email}\n\nOpen deze link: ${confirmUrl}\n\nVos Web Designs`,
  };
};

export const renderBlocks = (blocks: Block[] = []) => blocks.map((block) => {
  if (block.type === 'heading') return `<h2 style="margin:28px 0 10px;font-size:24px;line-height:1.2;color:#ffffff;">${escapeHtml(block.text)}</h2>`;
  if (block.type === 'image') {
    const imageUrl = absoluteUrl(block.url);
    if (!imageUrl) return '';
    const caption = block.caption ? `<div style="margin:-14px 0 24px;color:#94a3b8;font-size:13px;line-height:1.5;">${escapeHtml(block.caption)}</div>` : '';
    return `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(block.alt || '')}" width="584" style="display:block;width:100%;max-width:584px;height:auto;border-radius:18px;margin:24px 0;border:1px solid #1e293b;" />${caption}`;
  }
  if (block.type === 'divider') return `<hr style="border:0;border-top:1px solid #1e293b;margin:28px 0;" />`;
  if (block.type === 'cta' && block.href) return button(block.href, block.label || block.text || 'Bekijk meer');
  if (block.type === 'quote') return `<blockquote style="margin:24px 0;padding:18px 20px;border-left:4px solid ${accent};background:#07111f;color:#dbeafe;border-radius:12px;">${nl2br(block.text)}</blockquote>`;
  return `<p style="margin:0 0 16px;color:#cbd5e1;font-size:16px;">${nl2br(block.text)}</p>`;
}).join('');

export const blocksToText = (blocks: Block[] = []) => blocks.map((block) => {
  if (block.type === 'image') return block.alt || block.url || '';
  if (block.type === 'cta') return `${block.label || block.text || 'CTA'}: ${block.href || ''}`;
  if (block.type === 'divider') return '---';
  return block.text || '';
}).filter(Boolean).join('\n\n');

export const buildCampaignEmail = ({ title, preheader = '', blocks = [], heroImageUrl = '', heroAlt = '', unsubscribeUrl = '' }: { title: string; preheader?: string; blocks?: Block[]; heroImageUrl?: string; heroAlt?: string; unsubscribeUrl?: string }) => {
  const absoluteHeroImageUrl = absoluteUrl(heroImageUrl);
  const content = `
    <h1 style="margin:0 0 16px;font-size:34px;line-height:1.1;color:#ffffff;">${escapeHtml(title)}</h1>
    ${absoluteHeroImageUrl ? `<img src="${escapeHtml(absoluteHeroImageUrl)}" alt="${escapeHtml(heroAlt)}" width="584" style="display:block;width:100%;max-width:584px;height:auto;border-radius:20px;margin:0 0 24px;border:1px solid #1e293b;" />` : ''}
    ${renderBlocks(blocks)}
  `;
  const footer = unsubscribeUrl ? `Geen interesse meer? <a href="${escapeHtml(unsubscribeUrl)}" style="color:${accent};">Afmelden</a>.` : '';
  return {
    ...shell({ preheader, children: content, textFooter: footer }),
    text: `${title}\n\n${preheader ? `${preheader}\n\n` : ''}${absoluteHeroImageUrl ? `${heroAlt || 'Hero afbeelding'}: ${absoluteHeroImageUrl}\n\n` : ''}${blocksToText(blocks)}\n\nAfmelden: ${unsubscribeUrl || `${SITE_URL()}/newsletter/unsubscribed`}`,
  };
};
