import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const quickNav = [
  ['/', 'Home'],
  ['/portfolio', 'Portfolio'],
  ['/diensten', 'Diensten'],
  ['/over-ons', 'Over ons'],
  ['/werkwijze', 'Werkwijze'],
  ['/contact', 'Contact'],
];

const legalLinks = [
  ['/privacy', 'Privacybeleid'],
  ['/voorwaarden', 'Algemene voorwaarden'],
];

const cleanPhoneHref = (phone = '') => phone.replace(/[^+\d]/g, '');

const getWhatsappUrl = (phone = '') => {
  const digits = phone.replace(/\D/g, '');

  if (!digits) return '';

  return `https://wa.me/${digits.startsWith('00') ? digits.slice(2) : digits}`;
};

const getLocation = (settings) => [
  settings?.address_street,
  [settings?.address_postal_code, settings?.address_city].filter(Boolean).join(' '),
  settings?.address_country,
].filter(Boolean).join(', ');

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const siteName = settings?.site_name || 'Vos Web Designs';
  const contactEmail = settings?.contact_email?.trim();
  const contactPhone = settings?.contact_phone?.trim();
  const location = getLocation(settings);
  const telHref = contactPhone ? cleanPhoneHref(contactPhone) : '';
  const whatsappUrl = contactPhone ? getWhatsappUrl(contactPhone) : '';
  const socialLinks = [
    { label: 'Instagram', href: settings?.social_instagram, icon: Instagram },
    { label: 'LinkedIn', href: settings?.social_linkedin, icon: Linkedin },
    { label: 'Facebook', href: settings?.social_facebook, icon: Facebook },
    { label: 'X / Twitter', href: settings?.social_twitter, icon: Twitter },
    { label: 'TikTok', href: settings?.social_tiktok, icon: null },
  ].filter(({ href }) => href?.trim());

  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--stroke)] bg-[#050b14] px-5 py-12 md:px-8 md:py-14">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent)] to-transparent opacity-70" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12">
          <div className="md:col-span-2 lg:col-span-1">
            <p className="eyebrow">{siteName}</p>
            <h2 className="mt-5 max-w-3xl font-heading text-[clamp(2.8rem,8vw,5.75rem)] font-black uppercase leading-[.82] tracking-[-.08em]">
              Websites met filmische focus en meetbare flow.
            </h2>
            {settings?.site_description && (
              <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
                {settings.site_description}
              </p>
            )}
          </div>

          <nav className="grid content-start gap-3" aria-label="Snel navigeren">
            <span className="text-sm font-bold uppercase tracking-[.18em] text-[color:var(--accent2)]">Snel navigeren</span>
            {quickNav.map(([href, label]) => (
              <Link key={href} to={href} className="group flex items-center justify-between border-b border-white/10 py-2 text-slate-300 transition hover:text-white">
                {label}
                <ArrowUpRight size={16} className="opacity-30 transition group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          <div className="grid content-start gap-3">
            <span className="text-sm font-bold uppercase tracking-[.18em] text-[color:var(--accent2)]">Contact</span>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="group flex items-center gap-3 border-b border-white/10 py-2 text-slate-300 transition hover:text-white">
                <Mail size={16} className="text-[color:var(--accent)]" />
                <span>{contactEmail}</span>
              </a>
            )}
            {contactPhone && (
              <a href={`tel:${telHref}`} className="group flex items-center gap-3 border-b border-white/10 py-2 text-slate-300 transition hover:text-white">
                <Phone size={16} className="text-[color:var(--accent)]" />
                <span>{contactPhone}</span>
              </a>
            )}
            {location && (
              <p className="flex items-start gap-3 border-b border-white/10 py-2 text-slate-300">
                <MapPin size={16} className="mt-1 shrink-0 text-[color:var(--accent)]" />
                <span>{location}</span>
              </p>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--accent)]/40 px-4 py-2 text-sm font-bold text-[color:var(--accent)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-black" aria-label="Stuur Vos Web Designs een WhatsApp bericht">
                <MessageCircle size={16} />
                WhatsApp
              </a>
            )}
            {!contactEmail && !contactPhone && !location && (
              <p className="text-sm leading-6 text-slate-500">Contactgegevens worden binnenkort aangevuld.</p>
            )}
          </div>

          <div className="grid content-start gap-7">
            <div className="grid gap-3">
              <span className="text-sm font-bold uppercase tracking-[.18em] text-[color:var(--accent2)]">Volg ons</span>
              {socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Volg ${siteName} op ${label}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 px-4 text-sm font-bold text-slate-300 transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-black"
                    >
                      {Icon ? <Icon size={18} aria-hidden="true" /> : <span aria-hidden="true">TikTok</span>}
                      <span className="sr-only md:not-sr-only">{label}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-slate-500">Social media links worden binnenkort toegevoegd.</p>
              )}
            </div>

            <nav className="grid gap-3" aria-label="Juridisch">
              <span className="text-sm font-bold uppercase tracking-[.18em] text-[color:var(--accent2)]">Juridisch</span>
              {legalLinks.map(([href, label]) => (
                <Link key={href} to={href} className="group flex items-center justify-between border-b border-white/10 py-2 text-slate-300 transition hover:text-white">
                  {label}
                  <ArrowUpRight size={16} className="opacity-30 transition group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[color:var(--stroke)] pt-5 text-xs uppercase tracking-[.16em] text-slate-500 md:mt-14 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} {siteName}. Alle rechten voorbehouden.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy" className="transition hover:text-white">Privacybeleid</Link>
            <Link to="/voorwaarden" className="transition hover:text-white">Voorwaarden</Link>
            <Link to="/login" className="transition hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
