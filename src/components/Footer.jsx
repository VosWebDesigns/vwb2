import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const nav = [
  ['/portfolio', 'Portfolio'],
  ['/diensten', 'Diensten'],
  ['/over-ons', 'Over ons'],
  ['/werkwijze', 'Werkwijze'],
  ['/contact', 'Contact'],
];

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--stroke)] bg-[#050b14] px-5 py-14 md:px-8">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent)] to-transparent opacity-70" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_.6fr_.6fr]">
          <div>
            <p className="eyebrow">{settings?.site_name || 'Vos Web Designs'}</p>
            <h2 className="mt-5 max-w-3xl font-heading text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[.82] tracking-[-.08em]">Websites met filmische focus en meetbare flow.</h2>
            <div className="mt-8 grid gap-2 text-slate-300">
              <a href={`mailto:${settings?.contact_email || 'info@voswebdesigns.nl'}`} className="hover:text-[color:var(--accent)]">{settings?.contact_email || 'info@voswebdesigns.nl'}</a>
              {settings?.contact_phone && <a href={`tel:${settings.contact_phone}`} className="hover:text-[color:var(--accent)]">{settings.contact_phone}</a>}
            </div>
          </div>

          <nav className="grid content-start gap-3">
            <span className="text-sm font-bold uppercase tracking-[.18em] text-[color:var(--accent2)]">Navigatie</span>
            {nav.map(([href, label]) => <Link key={href} to={href} className="group flex items-center justify-between border-b border-white/10 py-2 text-slate-300 hover:text-white">{label}<ArrowUpRight size={16} className="opacity-30 group-hover:opacity-100" /></Link>)}
          </nav>

          <div className="grid content-start gap-3">
            <span className="text-sm font-bold uppercase tracking-[.18em] text-[color:var(--accent2)]">Social</span>
            {settings?.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="border-b border-white/10 py-2 text-slate-300 hover:text-white">Instagram</a>}
            {settings?.social_linkedin && <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="border-b border-white/10 py-2 text-slate-300 hover:text-white">LinkedIn</a>}
            <Link to="/contact" className="mt-3 cta-link w-fit">Plan een gesprek</Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[color:var(--stroke)] pt-5 text-xs uppercase tracking-[.16em] text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Vos Web Designs. Alle rechten voorbehouden.</p>
          <div className="flex gap-5"><Link to="/privacy">Privacy</Link><Link to="/voorwaarden">Voorwaarden</Link><Link to="/login">Admin</Link></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
