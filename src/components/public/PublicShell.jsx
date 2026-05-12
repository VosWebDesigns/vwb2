import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const nav = [
  ['/', 'atelier'],
  ['/portfolio', 'cases'],
  ['/diensten', 'diensten'],
  ['/over-ons', 'studio'],
  ['/werkwijze', 'schema'],
  ['/contact', 'contact'],
];

const PublicShell = ({ children }) => {
  const { settings } = useSettings();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--ink)]">
      <aside className="index-rail hidden lg:flex">
        <Link to="/" className="rail-brand">VWD</Link>
        <nav>
          {nav.map(([href, label], index) => (
            <Link key={href} to={href} className={location.pathname === href ? 'active' : ''}>
              <span>0{index + 1}</span>{label}
            </Link>
          ))}
        </nav>
      </aside>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--grid)] bg-[color:var(--bg)]/82 backdrop-blur-xl lg:left-20">
        <div className="flex items-center justify-between px-5 py-4 md:px-10">
          <Link to="/" className="mono text-sm uppercase tracking-[.35em] text-[color:var(--accent)]">{settings?.site_name || 'Vos Web Designs'}</Link>
          <button type="button" onClick={() => setOpen(true)} className="blueprint-icon lg:hidden" aria-label="Open menu"><Menu size={20} /></button>
          <Link to="/contact" className="blueprint-link hidden lg:inline-flex">Request build →</Link>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[80] bg-[color:var(--bg)] lg:hidden" initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: .45, ease: [0.76, 0, 0.24, 1] }}>
            <div className="flex items-center justify-between border-b border-[color:var(--grid)] p-5">
              <span className="mono uppercase tracking-[.35em] text-[color:var(--accent)]">index sheet</span>
              <button type="button" onClick={() => setOpen(false)} className="blueprint-icon" aria-label="Sluit menu"><X size={20} /></button>
            </div>
            <nav className="grid p-5">
              {nav.map(([href, label], index) => (
                <Link key={href} to={href} className="mobile-sheet-link">
                  <span>0{index + 1}</span>{label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {children}

      <footer className="border-t border-[color:var(--grid)] px-5 py-12 md:px-10 lg:pl-28">
        <div className="mx-auto grid max-w-[1500px] gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="mono text-xs uppercase tracking-[.3em] text-[color:var(--accent)]">atelier archive</p>
            <p className="mt-4 max-w-lg text-2xl font-black uppercase tracking-[-.04em]">{settings?.site_description || 'Professioneel webdesign en ontwikkeling voor ambitieuze bedrijven.'}</p>
          </div>
          <nav className="grid gap-2 mono text-sm uppercase tracking-[.2em] text-slate-300">
            {nav.slice(1).map(([href, label]) => <Link key={href} to={href} className="hover:text-[color:var(--accent)]">{label}</Link>)}
          </nav>
          <div className="text-sm text-slate-300">
            <a className="block hover:text-[color:var(--accent)]" href={`mailto:${settings?.contact_email || 'info@voswebdesigns.nl'}`}>{settings?.contact_email || 'info@voswebdesigns.nl'}</a>
            {settings?.contact_phone && <a className="mt-2 block hover:text-[color:var(--accent)]" href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>}
            <div className="mt-6 flex gap-4 text-xs uppercase tracking-[.2em]"><Link to="/privacy">Privacy</Link><Link to="/voorwaarden">Voorwaarden</Link><Link to="/login">Admin</Link></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicShell;
