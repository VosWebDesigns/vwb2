import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Phone, MapPin, MessageCircle, Send, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import MagneticButton from '@/components/MagneticButton';

const quickNav = [
  ['/',           'Home'],
  ['/portfolio',  'Portfolio'],
  ['/diensten',   'Diensten'],
  ['/over-ons',   'Over ons'],
  ['/werkwijze',  'Werkwijze'],
  ['/contact',    'Contact'],
];

const cleanPhoneHref = (phone = '') => phone.replace(/[^+\d]/g, '');

const getWhatsappUrl = (phone = '') => {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits.startsWith('00') ? digits.slice(2) : digits}`;
};

const getLocation = (settings) =>
  [settings?.address_street,
   [settings?.address_postal_code, settings?.address_city].filter(Boolean).join(' '),
   settings?.address_country]
    .filter(Boolean)
    .join(', ');

const Footer = () => {
  const { settings }   = useSettings();
  const currentYear    = new Date().getFullYear();
  const siteName       = settings?.site_name || 'Vos Web Designs';
  const contactEmail   = settings?.contact_email?.trim();
  const contactPhone   = settings?.contact_phone?.trim();
  const location       = getLocation(settings);
  const telHref        = contactPhone ? cleanPhoneHref(contactPhone) : '';
  const whatsappUrl    = contactPhone ? getWhatsappUrl(contactPhone) : '';

  const [nlEmail,   setNlEmail]   = useState('');
  const [nlWebsite, setNlWebsite] = useState('');
  const [nlState,   setNlState]   = useState({ status: 'idle', message: '' });

  const handleNlSubmit = async (e) => {
    e.preventDefault();
    if (nlState.status === 'loading') return;
    const email = nlEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
      setNlState({ status: 'error', message: 'Vul een geldig e-mailadres in.' });
      return;
    }
    setNlState({ status: 'loading', message: '' });
    try {
      const res  = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: nlWebsite }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Inschrijven mislukt.');
      setNlEmail('');
      setNlState({ status: 'success', message: data?.message || 'Check je mail om te bevestigen.' });
    } catch (err) {
      setNlState({ status: 'error', message: err.message || 'Tijdelijk niet gelukt.' });
    }
  };

  const socialLinks = [
    { label: 'Instagram', href: settings?.social_instagram, Icon: Instagram },
    { label: 'LinkedIn',  href: settings?.social_linkedin,  Icon: Linkedin },
    { label: 'Facebook',  href: settings?.social_facebook,  Icon: Facebook },
    { label: 'YouTube',   href: settings?.social_youtube,   Icon: Youtube },
  ].filter(({ href }) => href?.trim());

  return (
    <footer className="relative overflow-hidden" style={{ background: '#03030a' }}>
      {/* Top line */}
      <div className="line-accent-full absolute inset-x-0 top-0" style={{ opacity: 0.35 }} />

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(201,169,110,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.04) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, black 0%, transparent 100%)',
          opacity: 0.4,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">

        {/* ── Hero footer row ── */}
        <div className="flex flex-col gap-6 pt-16 pb-10 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: availability + tagline */}
          <div className="max-w-lg">
            <div className="availability-badge mb-6 w-fit">
              <span className="status-dot" />
              Beschikbaar voor nieuwe projecten
            </div>
            <p
              className="font-heading font-black uppercase leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 4rem)', letterSpacing: '-.06em', color: 'var(--accent3)' }}
            >
              Klaar voor het
              {' '}
              <span style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 600, color: 'var(--accent)' }}>
                volgende niveau
              </span>
              ?
            </p>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col items-start gap-4 lg:items-end lg:pt-4">
            <MagneticButton to="/contact" className="glow-button" data-cursor="VIEW">
              Start een project <ArrowUpRight size={16} />
            </MagneticButton>
            <a
              href={contactEmail ? `mailto:${contactEmail}` : '#'}
              className="font-mono text-[.7rem] uppercase tracking-[.28em] transition-colors"
              style={{ color: 'rgba(201,169,110,.4)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(201,169,110,.4)'; }}
            >
              {contactEmail || 'info@voswebdesigns.nl'}
            </a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="line-accent" />

        {/* ── Main links grid ── */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Col 1: Quick nav */}
          <nav aria-label="Navigatie">
            <p className="section-eyebrow mb-5">Navigatie</p>
            <ul className="grid gap-0">
              {quickNav.map(([href, label]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="group flex items-center justify-between border-b py-3 text-sm transition-colors"
                    style={{ borderColor: 'rgba(201,169,110,.07)', color: 'rgba(240,235,227,.55)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,235,227,.55)'; }}
                  >
                    {label}
                    <ArrowUpRight size={13} className="opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 2: Contact */}
          <div>
            <p className="section-eyebrow mb-5">Contact</p>
            <div className="grid gap-3">
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-sm transition-colors" style={{ color: 'rgba(240,235,227,.55)' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent3)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,235,227,.55)'; }}>
                  <Mail size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  {contactEmail}
                </a>
              )}
              {contactPhone && (
                <a href={`tel:${telHref}`} className="flex items-center gap-3 text-sm transition-colors" style={{ color: 'rgba(240,235,227,.55)' }}
                   onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent3)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,235,227,.55)'; }}>
                  <Phone size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  {contactPhone}
                </a>
              )}
              {location && (
                <p className="flex items-start gap-3 text-sm" style={{ color: 'rgba(240,235,227,.4)' }}>
                  <MapPin size={13} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  {location}
                </p>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[.12em] transition-all"
                  style={{ border: '1px solid rgba(201,169,110,.22)', color: 'var(--accent)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.color = '#06060c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                >
                  <MessageCircle size={13} />
                  WhatsApp
                </a>
              )}
            </div>

            {/* Social */}
            {socialLinks.length > 0 && (
              <div className="mt-8">
                <p className="section-eyebrow mb-4">Volg ons</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all"
                      style={{ border: '1px solid rgba(201,169,110,.14)', color: 'rgba(240,235,227,.55)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201,169,110,.38)';
                        e.currentTarget.style.color = 'var(--accent3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201,169,110,.14)';
                        e.currentTarget.style.color = 'rgba(240,235,227,.55)';
                      }}
                    >
                      <Icon size={13} aria-hidden="true" /> {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Col 3-4: Newsletter (spans 2) */}
          <div className="md:col-span-2">
            <p className="section-eyebrow mb-5">Nieuwsbrief</p>
            <p className="mb-5 text-sm leading-7" style={{ color: 'rgba(240,235,227,.45)' }}>
              Maandelijks premium tips over webdesign, animatie en conversie — direct in je inbox.
            </p>
            <form onSubmit={handleNlSubmit} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  placeholder="uw@email.nl"
                  disabled={nlState.status === 'loading' || nlState.status === 'success'}
                  className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition"
                  style={{
                    background: 'rgba(10,10,18,.75)',
                    border: '1px solid rgba(201,169,110,.14)',
                    color: 'var(--accent3)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.38)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.14)'; }}
                />
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={nlWebsite}
                       onChange={(e) => setNlWebsite(e.target.value)} className="hidden" aria-hidden="true" />
              </div>
              <button
                type="submit"
                disabled={nlState.status === 'loading' || nlState.status === 'success'}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black uppercase tracking-[.1em] transition-all"
                style={{ background: 'var(--accent)', color: '#06060c' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 30px rgba(201,169,110,.35)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Send size={14} />
                {nlState.status === 'loading' ? 'Versturen…' : 'Inschrijven'}
              </button>
            </form>
            {nlState.message && (
              <p className={`mt-3 text-sm ${nlState.status === 'error' ? 'text-red-300' : 'text-emerald-300'}`}>
                {nlState.message}
              </p>
            )}
            <p className="mt-3 text-xs" style={{ color: 'rgba(240,235,227,.28)' }}>
              Afmelden kan altijd.{' '}
              <Link to="/privacy" className="underline-offset-2 hover:underline" style={{ color: 'rgba(201,169,110,.55)' }}>
                Privacybeleid
              </Link>
            </p>
          </div>
        </div>

        {/* ── Big wordmark ── */}
        <div
          className="footer-wordmark select-none py-4"
          aria-hidden="true"
        >
          VOS WEB DESIGNS
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col gap-4 border-t py-6 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: 'rgba(201,169,110,.08)' }}
        >
          <p className="font-mono text-[.6rem] uppercase tracking-[.22em]" style={{ color: 'rgba(201,169,110,.28)' }}>
            © {currentYear} {siteName}. Alle rechten voorbehouden.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[['Privacybeleid', '/privacy'], ['Voorwaarden', '/voorwaarden'], ['Admin', '/login']].map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="font-mono text-[.6rem] uppercase tracking-[.22em] transition-colors"
                style={{ color: 'rgba(201,169,110,.28)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(201,169,110,.28)'; }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
