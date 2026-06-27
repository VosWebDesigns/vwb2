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

const Header = () => {
  const { settings }   = useSettings();
  const location       = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
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
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={isScrolled ? {
          borderBottom: '1px solid rgba(201,169,110,.10)',
          background: 'rgba(4,4,10,.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 50px rgba(0,0,0,.55)',
        } : { background: 'transparent' }}
      >
        {/* Top accent line */}
        {isScrolled && (
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.35), rgba(138,92,246,.20), transparent)' }}
          />
        )}

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 md:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3"
            aria-label={`${siteName} home`}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-xl font-heading text-sm font-black transition-all duration-400"
              style={{
                border: '1px solid rgba(201,169,110,.22)',
                background: 'rgba(201,169,110,.06)',
                color: 'var(--accent)',
                boxShadow: '0 0 18px rgba(201,169,110,.10)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,.55)';
                e.currentTarget.style.boxShadow  = '0 0 28px rgba(201,169,110,.28)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,.22)';
                e.currentTarget.style.boxShadow  = '0 0 18px rgba(201,169,110,.10)';
              }}
            >
              V
            </span>
            <div className="flex flex-col">
              <span
                className="font-heading text-sm font-black uppercase tracking-[.22em]"
                style={{ color: 'var(--accent3)' }}
              >
                {siteName}
              </span>
              <span
                className="hidden font-mono text-[8px] uppercase tracking-[.3em] sm:block"
                style={{ color: 'rgba(201,169,110,.36)' }}
              >
                Design Studio
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.slice(1, 5).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative rounded-full px-4 py-2 text-[.82rem] font-semibold tracking-[.04em] transition-all duration-250"
                style={location.pathname === link.path ? {
                  background: 'rgba(201,169,110,.08)',
                  color: 'var(--accent)',
                } : {
                  color: 'rgba(240,235,227,.5)',
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== link.path) {
                    e.currentTarget.style.background = 'rgba(201,169,110,.05)';
                    e.currentTarget.style.color = 'var(--accent3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== link.path) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(240,235,227,.5)';
                  }
                }}
              >
                {location.pathname === link.path && (
                  <span
                    className="absolute bottom-1 left-1/2 h-px w-4 -translate-x-1/2 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Availability badge */}
            <span className="hidden items-center gap-2 lg:flex">
              <span className="status-dot" />
              <span
                className="font-mono text-[9px] uppercase tracking-[.24em]"
                style={{ color: 'rgba(201,169,110,.38)' }}
              >
                Beschikbaar
              </span>
            </span>

            {/* Start project CTA */}
            <Link
              to="/contact"
              className="glow-button hidden lg:inline-flex"
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.72rem' }}
            >
              Start project
            </Link>

            {/* Menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group inline-flex items-center gap-2.5 rounded-full backdrop-blur-md transition-all duration-300 px-4 py-2 text-[.8rem] font-bold uppercase tracking-[.12em]"
              style={{
                border: '1px solid rgba(201,169,110,.18)',
                background: 'rgba(10,10,18,.72)',
                color: 'var(--accent3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,.42)';
                e.currentTarget.style.background = 'rgba(201,169,110,.07)';
                e.currentTarget.style.boxShadow  = '0 0 20px rgba(201,169,110,.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,.18)';
                e.currentTarget.style.background = 'rgba(10,10,18,.72)';
                e.currentTarget.style.boxShadow  = 'none';
              }}
              aria-label="Open menu"
            >
              Menu
              <Menu size={15} style={{ color: 'var(--accent)' }} className="transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] overflow-y-auto text-white"
            style={{ background: 'rgba(4,4,10,.97)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {/* Subtle bg radials */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ scale: 1.04 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.03 }}
              style={{
                background: 'radial-gradient(ellipse 60% 50% at 15% 10%, rgba(201,169,110,.10) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 85% 90%, rgba(138,92,246,.07) 0%, transparent 50%)',
              }}
            />

            {/* Fine grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(rgba(201,169,110,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.05) 1px, transparent 1px)',
                backgroundSize: '72px 72px',
              }}
            />

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 md:px-8">
              {/* Menu header */}
              <div
                className="flex items-center justify-between pb-6"
                style={{ borderBottom: '1px solid rgba(201,169,110,.10)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="status-dot" />
                  <span
                    className="font-heading text-sm font-black uppercase tracking-[.28em]"
                    style={{ color: 'var(--accent)' }}
                  >
                    Studio menu
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-3 transition-all"
                  style={{ border: '1px solid rgba(201,169,110,.16)', color: 'var(--accent3)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,169,110,.4)';
                    e.currentTarget.style.background  = 'rgba(201,169,110,.07)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,169,110,.16)';
                    e.currentTarget.style.background  = 'transparent';
                  }}
                  aria-label="Sluit menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid flex-1 gap-10 py-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
                {/* Navigation links */}
                <nav className="grid gap-0">
                  {navLinks.map((link, index) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="group flex items-center justify-between py-4 font-heading font-black uppercase leading-none transition-colors"
                      style={{
                        fontSize: 'clamp(2.4rem, 7.5vw, 6.5rem)',
                        letterSpacing: '-.08em',
                        borderBottom: '1px solid rgba(255,255,255,.06)',
                        color: location.pathname === link.path ? 'var(--accent)' : 'var(--accent3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = location.pathname === link.path ? 'var(--accent)' : 'var(--accent3)';
                      }}
                    >
                      <span className="flex items-baseline gap-4">
                        <em
                          className="not-italic shrink-0"
                          style={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontStyle: 'normal',
                            fontSize: '0.28em',
                            color: 'rgba(201,169,110,.45)',
                            letterSpacing: '.18em',
                            verticalAlign: 'super',
                          }}
                        >
                          0{index + 1}
                        </em>
                        {link.name}
                      </span>
                      <ArrowUpRight
                        className="shrink-0 opacity-20 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                        style={{ width: 'clamp(1.4rem,3vw,2.8rem)', height: 'clamp(1.4rem,3vw,2.8rem)', color: 'var(--accent)' }}
                      />
                    </Link>
                  ))}
                </nav>

                {/* Info panel */}
                <aside className="panel cut p-7 md:p-9">
                  <p className="eyebrow">{siteName}</p>
                  <h2
                    className="mt-5 font-heading font-black leading-[.95]"
                    style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', letterSpacing: '-.05em', color: 'var(--accent3)' }}
                  >
                    Maatwerk websites zonder compromissen.
                  </h2>
                  <p className="mt-5 text-sm leading-[1.8]" style={{ color: 'rgba(240,235,227,.5)' }}>
                    Strategie, design en techniek — één team, geen tussenpersonen. Gebouwd voor indruk, vertrouwen en meetbare groei.
                  </p>
                  <div className="mt-8 grid gap-2 text-sm">
                    <a
                      href={`mailto:${settings?.contact_email || 'info@voswebdesigns.nl'}`}
                      className="terminal-line transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    >
                      {settings?.contact_email || 'info@voswebdesigns.nl'}
                    </a>
                    {settings?.contact_phone && (
                      <a
                        href={`tel:${settings.contact_phone}`}
                        className="terminal-line transition-colors"
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = ''}
                      >
                        {settings.contact_phone}
                      </a>
                    )}
                  </div>
                  <div className="mt-8 flex gap-5 text-[.72rem] font-mono font-bold uppercase tracking-[.2em]" style={{ color: 'rgba(201,169,110,.4)' }}>
                    {settings?.social_instagram && (
                      <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
                    )}
                    {settings?.social_linkedin && (
                      <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                    )}
                    <Link to="/contact" className="hover:text-white transition-colors">Intake</Link>
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
