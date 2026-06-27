import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { getLenis } from '@/hooks/useLenis';

const navLinks = [
  { name: 'Home',      path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Diensten',  path: '/diensten' },
  { name: 'Over ons',  path: '/over-ons' },
  { name: 'Werkwijze', path: '/werkwijze' },
  { name: 'Contact',   path: '/contact' },
];

const Clock = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="hidden md:inline-block font-mono text-[10px] uppercase tracking-[.26em] text-[rgba(140,214,255,.35)]">
      {time}
    </span>
  );
};

const Header = () => {
  const { settings }   = useSettings();
  const location       = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
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
            ? 'border-b border-[rgba(140,214,255,.1)] bg-[rgba(2,8,16,.9)] shadow-[0_8px_40px_rgba(0,0,0,.5)] backdrop-blur-2xl'
            : 'bg-transparent'
        }`}
      >
        {/* Top accent line */}
        {isScrolled && (
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,214,255,.4)] to-transparent" />
        )}

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 md:px-8">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3" aria-label={`${siteName} home`}>
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-[rgba(140,214,255,.24)] bg-[rgba(140,214,255,.07)] font-heading text-sm font-black text-[var(--accent)] shadow-[0_0_20px_rgba(140,214,255,.12)] transition-all duration-300 group-hover:border-[rgba(140,214,255,.5)] group-hover:shadow-[0_0_32px_rgba(140,214,255,.3)]">
              V
            </span>
            <div className="flex flex-col">
              <span className="font-heading text-sm font-black uppercase tracking-[.2em] text-white">{siteName}</span>
              <span className="hidden font-mono text-[9px] uppercase tracking-[.3em] text-[rgba(140,214,255,.4)] sm:block">
                Web Design Studio
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.slice(1, 5).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-[rgba(140,214,255,.1)] text-[var(--accent)]'
                    : 'text-slate-400 hover:bg-[rgba(140,214,255,.06)] hover:text-white'
                }`}
              >
                {location.pathname === link.path && (
                  <span className="absolute bottom-0.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
                )}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            to="/contact"
            className="glow-button hidden lg:inline-flex"
            style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
          >
            Start project
          </Link>

          {/* Right side: clock + status + menu */}
          <div className="flex items-center gap-3">
            <Clock />
            <span className="hidden items-center gap-1.5 lg:flex">
              <span className="status-dot status-dot-cyan" />
              <span className="font-mono text-[10px] uppercase tracking-[.22em] text-[rgba(140,214,255,.4)]">Online</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group inline-flex items-center gap-2.5 rounded-full border border-[rgba(140,214,255,.2)] bg-[rgba(12,22,40,.72)] px-4 py-2 text-sm font-bold uppercase tracking-[.14em] text-white backdrop-blur-md transition-all duration-300 hover:border-[rgba(140,214,255,.48)] hover:bg-[rgba(140,214,255,.09)] hover:shadow-[0_0_24px_rgba(140,214,255,.18)]"
              aria-label="Open menu"
            >
              Menu <Menu size={16} className="text-[var(--accent)] transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] overflow-y-auto bg-[#030b16]/95 text-white backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Background */}
            <motion.div
              className="absolute inset-0 cinema-bg opacity-70"
              initial={{ scale: 1.04 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.03 }}
            />
            {/* Grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'linear-gradient(rgba(140,214,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(140,214,255,.06) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
              }}
            />

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 md:px-8">
              {/* Menu header */}
              <div className="flex items-center justify-between border-b border-[color:var(--stroke)] pb-5">
                <div className="flex items-center gap-3">
                  <span className="status-dot" />
                  <span className="font-heading text-sm font-black uppercase tracking-[.28em] text-[color:var(--accent)]">
                    Studio menu
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-[color:var(--stroke)] p-3 text-white transition hover:border-[color:var(--accent)] hover:bg-[rgba(140,214,255,.08)]"
                  aria-label="Sluit menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="grid flex-1 gap-10 py-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
                {/* Navigation links */}
                <nav className="grid gap-2">
                  {navLinks.map((link, index) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="group flex items-center justify-between border-b border-white/8 py-4 font-heading text-[clamp(2.2rem,7.5vw,6.5rem)] font-black uppercase leading-none tracking-[-.08em] text-white transition hover:text-[color:var(--accent)]"
                    >
                      <span>
                        <em className="mr-4 align-top font-sans text-sm not-italic tracking-normal text-[color:var(--accent2)]">
                          0{index + 1}
                        </em>
                        {link.name}
                      </span>
                      <ArrowUpRight className="h-7 w-7 opacity-25 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100 md:h-10 md:w-10" />
                    </Link>
                  ))}
                </nav>

                {/* Info panel */}
                <aside className="panel cut p-7 md:p-9">
                  <p className="eyebrow">{siteName}</p>
                  <h2 className="mt-4 font-heading text-4xl font-black leading-[.95] tracking-[-.05em]">
                    Maatwerk websites zonder template-smaak.
                  </h2>
                  <p className="mt-5 text-slate-300">
                    Strategie, design en techniek in één strak proces. Gebouwd voor snelheid, vertrouwen en meetbare groei.
                  </p>
                  <div className="mt-8 grid gap-2 text-sm text-slate-300">
                    <a
                      href={`mailto:${settings?.contact_email || 'info@voswebdesigns.nl'}`}
                      className="terminal-line hover:text-[color:var(--accent)]"
                    >
                      {settings?.contact_email || 'info@voswebdesigns.nl'}
                    </a>
                    {settings?.contact_phone && (
                      <a href={`tel:${settings.contact_phone}`} className="terminal-line hover:text-[color:var(--accent)]">
                        {settings.contact_phone}
                      </a>
                    )}
                  </div>
                  <div className="mt-8 flex gap-4 text-xs font-bold uppercase tracking-[.18em] text-[color:var(--accent2)]">
                    {settings?.social_instagram && (
                      <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
                    )}
                    {settings?.social_linkedin && (
                      <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
                    )}
                    <Link to="/contact" className="hover:text-white">Intake</Link>
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
