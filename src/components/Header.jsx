import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { getLenis } from '@/hooks/useLenis';
import { gsap } from 'gsap';

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
  const [scrollPct, setScrollPct] = useState(0);
  const progressRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
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
          borderBottom: '1px solid rgba(201,169,110,.09)',
          background: 'rgba(4,4,10,.94)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: '0 8px 60px rgba(0,0,0,.6)',
        } : { background: 'transparent' }}
      >
        {/* Scroll progress bar */}
        {isScrolled && (
          <div
            className="absolute inset-x-0 top-0 h-[2px] origin-left"
            style={{
              background: 'linear-gradient(to right, var(--accent), var(--accent2))',
              transform: `scaleX(${scrollPct / 100})`,
              transition: 'transform 0.1s linear',
            }}
          />
        )}

        {/* Top accent line when scrolled */}
        {isScrolled && (
          <div
            className="absolute inset-x-0 bottom-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.18), rgba(138,92,246,.10), transparent)' }}
          />
        )}

        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3.5 md:px-10">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3"
            aria-label={`${siteName} home`}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-xl font-heading text-sm font-black transition-all duration-500"
              style={{
                border: '1px solid rgba(201,169,110,.22)',
                background: 'rgba(201,169,110,.06)',
                color: 'var(--accent)',
                boxShadow: '0 0 18px rgba(201,169,110,.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,.55)';
                e.currentTarget.style.boxShadow  = '0 0 28px rgba(201,169,110,.28)';
                e.currentTarget.style.background = 'rgba(201,169,110,.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,.22)';
                e.currentTarget.style.boxShadow  = '0 0 18px rgba(201,169,110,.08)';
                e.currentTarget.style.background = 'rgba(201,169,110,.06)';
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
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.slice(1, 5).map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="nav-underline relative px-4 py-2 text-[.82rem] font-semibold tracking-[.04em] transition-colors duration-250"
                  style={{
                    color: isActive ? 'var(--accent)' : 'rgba(240,235,227,.48)',
                    borderRadius: 8,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--accent3)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(240,235,227,.48)';
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span
                      className="absolute bottom-1 left-1/2 h-px w-4 -translate-x-1/2 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Availability badge */}
            <span className="hidden items-center gap-2 lg:flex">
              <span className="status-dot" style={{ width: 5, height: 5 }} />
              <span
                className="font-mono text-[9px] uppercase tracking-[.24em]"
                style={{ color: 'rgba(201,169,110,.36)' }}
              >
                Beschikbaar
              </span>
            </span>

            {/* CTA */}
            <Link
              to="/contact"
              className="glow-button hidden lg:inline-flex"
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.72rem' }}
              data-magnetic=""
            >
              Start project
            </Link>

            {/* Menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2.5 rounded-full backdrop-blur-md transition-all duration-300 px-4 py-2 text-[.8rem] font-bold uppercase tracking-[.12em]"
              style={{
                border: '1px solid rgba(201,169,110,.18)',
                background: 'rgba(10,10,18,.72)',
                color: 'var(--accent3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,.42)';
                e.currentTarget.style.background  = 'rgba(201,169,110,.07)';
                e.currentTarget.style.boxShadow   = '0 0 20px rgba(201,169,110,.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,.18)';
                e.currentTarget.style.background  = 'rgba(10,10,18,.72)';
                e.currentTarget.style.boxShadow   = 'none';
              }}
              aria-label="Open menu"
            >
              Menu
              <span
                className="flex flex-col gap-[3.5px]"
                aria-hidden="true"
              >
                <span className="block h-px w-4" style={{ background: 'var(--accent)' }} />
                <span className="block h-px w-3" style={{ background: 'rgba(201,169,110,.5)' }} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] overflow-y-auto"
            style={{ background: 'rgba(3,3,9,.98)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Ambient BG */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 55% 45% at 10% 10%, rgba(201,169,110,.09) 0%, transparent 55%), radial-gradient(ellipse 50% 55% at 90% 90%, rgba(138,92,246,.07) 0%, transparent 50%)',
              }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(rgba(201,169,110,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.04) 1px, transparent 1px)',
                backgroundSize: '72px 72px',
                opacity: 0.25,
              }}
              aria-hidden="true"
            />

            <div className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col px-6 py-5 md:px-12">
              {/* Menu header */}
              <div
                className="flex items-center justify-between pb-6"
                style={{ borderBottom: '1px solid rgba(201,169,110,.09)' }}
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

              <div className="grid flex-1 gap-10 py-8 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
                {/* Navigation links */}
                <nav className="grid gap-0">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ x: 60, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.06 * index + 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={link.path}
                        className="group flex items-center justify-between py-3 font-heading font-black uppercase leading-none transition-colors"
                        style={{
                          fontSize: 'clamp(2.2rem, 7vw, 6rem)',
                          letterSpacing: '-.08em',
                          borderBottom: '1px solid rgba(255,255,255,.05)',
                          color: location.pathname === link.path ? 'var(--accent)' : 'rgba(240,235,227,.88)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = location.pathname === link.path ? 'var(--accent)' : 'rgba(240,235,227,.88)';
                        }}
                      >
                        <span className="flex items-baseline gap-4">
                          <em
                            className="not-italic shrink-0"
                            style={{
                              fontFamily: '"Cormorant Garamond", serif',
                              fontStyle: 'normal',
                              fontSize: '0.26em',
                              color: 'rgba(201,169,110,.4)',
                              letterSpacing: '.18em',
                              verticalAlign: 'super',
                            }}
                          >
                            0{index + 1}
                          </em>
                          {link.name}
                        </span>
                        <ArrowUpRight
                          className="shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                          style={{ width: 'clamp(1.2rem,2.8vw,2.4rem)', height: 'clamp(1.2rem,2.8vw,2.4rem)', color: 'var(--accent)' }}
                        />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Info panel */}
                <motion.aside
                  className="panel cut p-7 md:p-9"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="eyebrow">{siteName}</p>
                  <h2
                    className="mt-5 font-heading font-black leading-[.95]"
                    style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)', letterSpacing: '-.05em', color: 'var(--accent3)' }}
                  >
                    Maatwerk websites zonder compromissen.
                  </h2>
                  <p className="mt-4 text-sm leading-[1.8]" style={{ color: 'rgba(240,235,227,.45)' }}>
                    Strategie, design en techniek — één team, geen tussenpersonen.
                  </p>
                  <div className="mt-7 grid gap-2 text-sm">
                    <a
                      href={`mailto:${settings?.contact_email || 'info@voswebdesigns.nl'}`}
                      className="terminal-line transition-colors hover:text-[var(--accent)]"
                    >
                      {settings?.contact_email || 'info@voswebdesigns.nl'}
                    </a>
                    {settings?.contact_phone && (
                      <a
                        href={`tel:${settings.contact_phone}`}
                        className="terminal-line transition-colors hover:text-[var(--accent)]"
                      >
                        {settings.contact_phone}
                      </a>
                    )}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-4 text-[.7rem] font-mono font-bold uppercase tracking-[.2em]" style={{ color: 'rgba(201,169,110,.38)' }}>
                    {settings?.social_instagram && (
                      <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
                    )}
                    {settings?.social_linkedin && (
                      <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                    )}
                    <Link to="/contact" className="hover:text-white transition-colors">Start project</Link>
                  </div>
                </motion.aside>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
