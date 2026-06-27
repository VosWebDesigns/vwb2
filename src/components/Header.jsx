import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { getLenis } from '@/hooks/useLenis';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Diensten', path: '/diensten' },
  { name: 'Over ons', path: '/over-ons' },
  { name: 'Werkwijze', path: '/werkwijze' },
  { name: 'Contact', path: '/contact' },
];

const Header = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    // Pause smooth-scroll while the full-screen menu is open so the overlay
    // scrolls and the page behind it stays put.
    const lenis = getLenis();
    if (lenis) {
      if (open) lenis.stop();
      else lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      const active = getLenis();
      if (active) active.start();
    };
  }, [open]);

  const siteName = settings?.site_name || 'Vos Web Designs';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'border-b border-[rgba(140,214,255,.1)] bg-[rgba(2,8,16,.88)] shadow-[0_8px_40px_rgba(0,0,0,.4)] backdrop-blur-2xl'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link to="/" className="group flex items-center gap-3" aria-label="Vos Web Designs home">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-[rgba(140,214,255,.22)] bg-[rgba(140,214,255,.08)] font-heading text-sm font-black text-[var(--accent)] shadow-[0_0_20px_rgba(140,214,255,.15)] transition-all duration-300 group-hover:border-[rgba(140,214,255,.45)] group-hover:shadow-[0_0_30px_rgba(140,214,255,.3)]">V</span>
            <span className="font-heading text-sm font-black uppercase tracking-[.22em] text-white sm:text-base">{siteName}</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.slice(1, 5).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-[rgba(140,214,255,.1)] text-[var(--accent)]'
                    : 'text-slate-400 hover:bg-[rgba(140,214,255,.06)] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group inline-flex items-center gap-2.5 rounded-full border border-[rgba(140,214,255,.2)] bg-[rgba(12,22,40,.7)] px-4 py-2 text-sm font-bold uppercase tracking-[.14em] text-white backdrop-blur-md transition-all duration-300 hover:border-[rgba(140,214,255,.45)] hover:bg-[rgba(140,214,255,.08)] hover:shadow-[0_0_20px_rgba(140,214,255,.15)]"
            aria-label="Open menu"
          >
            Menu <Menu size={16} className="text-[var(--accent)] transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] overflow-y-auto bg-[#040b16]/96 text-white backdrop-blur-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <motion.div className="absolute inset-0 cinema-bg opacity-80" initial={{ scale: 1.04 }} animate={{ scale: 1 }} exit={{ scale: 1.03 }} />
            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 md:px-8">
              <div className="flex items-center justify-between border-b border-[color:var(--stroke)] pb-5">
                <span className="font-heading text-sm font-black uppercase tracking-[.28em] text-[color:var(--accent)]">Studio menu</span>
                <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-[color:var(--stroke)] p-3 text-white transition hover:border-[color:var(--accent)]" aria-label="Sluit menu"><X size={22} /></button>
              </div>

              <div className="grid flex-1 gap-10 py-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
                <nav className="grid gap-3">
                  {navLinks.map((link, index) => (
                    <Link key={link.path} to={link.path} className="group flex items-center justify-between border-b border-white/10 py-4 font-heading text-[clamp(2.4rem,8vw,6.8rem)] font-black uppercase leading-none tracking-[-.08em] text-white transition hover:text-[color:var(--accent)]">
                      <span><em className="mr-4 align-top font-sans text-sm not-italic tracking-normal text-[color:var(--accent2)]">0{index + 1}</em>{link.name}</span>
                      <ArrowUpRight className="h-8 w-8 opacity-30 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100 md:h-12 md:w-12" />
                    </Link>
                  ))}
                </nav>

                <aside className="panel cut p-7 md:p-9">
                  <p className="eyebrow">Vos Web Designs</p>
                  <h2 className="mt-4 font-heading text-4xl font-black leading-[.95] tracking-[-.05em]">Maatwerk websites zonder template-smaak.</h2>
                  <p className="mt-5 text-slate-300">Strategie, design en techniek in één strak proces. Gebouwd voor snelheid, vertrouwen en meetbare groei.</p>
                  <div className="mt-8 grid gap-2 text-sm text-slate-300">
                    <a href={`mailto:${settings?.contact_email || 'info@voswebdesigns.nl'}`} className="hover:text-[color:var(--accent)]">{settings?.contact_email || 'info@voswebdesigns.nl'}</a>
                    {settings?.contact_phone && <a href={`tel:${settings.contact_phone}`} className="hover:text-[color:var(--accent)]">{settings.contact_phone}</a>}
                  </div>
                  <div className="mt-8 flex gap-3 text-xs font-bold uppercase tracking-[.18em] text-[color:var(--accent2)]">
                    {settings?.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noreferrer">Instagram</a>}
                    {settings?.social_linkedin && <a href={settings.social_linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                    <Link to="/contact">Intake</Link>
                  </div>
                </aside>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
