import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    num: '01',
    name: '3D Web Experiences',
    short: 'Three.js · WebGL · Spline',
    desc: 'Realtime 3D scènes, particle systems en cinematische scroll-animaties. Wij zetten uw merk neer als marktleider via WebGL-gedreven ervaringen die concurrenten niet kunnen evenaren.',
    link: '/diensten',
  },
  {
    num: '02',
    name: 'Motion & GSAP Design',
    short: 'GSAP · ScrollTrigger · Lenis',
    desc: 'Cinematische reveals, parallax en vloeiende pagina-overgangen op Apple-niveau. Elk element beweegt met intentie — animaties die uw verhaal vertellen zonder woorden.',
    link: '/diensten',
  },
  {
    num: '03',
    name: 'Premium UI / UX',
    short: 'Figma · Design Systems · Glassmorphism',
    desc: 'Interface systemen die voelen als high-end software. Van typografie tot micro-interacties — wij ontwerpen ervaringen die gebruikers niet meer vergeten.',
    link: '/diensten',
  },
  {
    num: '04',
    name: 'Full-Stack Development',
    short: 'React · Supabase · Vercel · TypeScript',
    desc: 'Van design naar live — in één team. Backend, database, serverless APIs en security. Geen externe partijen, geen communicatie-verlies, één verantwoordelijkheid.',
    link: '/diensten',
  },
  {
    num: '05',
    name: 'Performance & Launch',
    short: 'Core Web Vitals · SEO · Analytics',
    desc: 'Sub-2s laadtijden als standaard. Lighthouse 100, structured data, open graph — uw investering begint direct te renderen na elke launch.',
    link: '/diensten',
  },
];

const ServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const headRef = useRef(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-28 px-5 md:px-10 lg:px-16">
      {/* Section header */}
      <div ref={headRef} className="mb-16 flex items-end justify-between">
        <div>
          <p
            className="font-mono text-[.65rem] uppercase tracking-[.38em] mb-4"
            style={{ color: 'var(--accent)' }}
          >
            — Wat wij bouwen
          </p>
          <h2
            className="font-heading font-bold uppercase leading-none tracking-[-0.055em]"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 7.5rem)',
              color: 'var(--accent3)',
            }}
          >
            ONZE<br />
            <em
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                fontWeight: 600,
                color: 'var(--accent)',
                fontSize: '1.06em',
                letterSpacing: '-.02em',
              }}
            >
              disciplines
            </em>
          </h2>
        </div>
        <Link
          to="/diensten"
          className="hidden lg:inline-flex items-center gap-2 font-mono text-[.7rem] uppercase tracking-[.22em] pb-2 transition-colors"
          style={{ color: 'rgba(204,255,0,.36)', borderBottom: '1px solid rgba(204,255,0,.16)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(204,255,0,.36)'; }}
        >
          Alle diensten <ArrowUpRight size={12} />
        </Link>
      </div>

      {/* ── Desktop: horizontal expanding strips ── */}
      <div
        className="hidden lg:flex overflow-hidden rounded-2xl"
        style={{ minHeight: '65vh', border: '1px solid rgba(204,255,0,.07)' }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {SERVICES.map((s, i) => {
          const isActive = activeIndex === i;
          return (
            <div
              key={s.num}
              className="relative overflow-hidden cursor-pointer"
              style={{
                flex: isActive ? '5 0 0%' : '1 0 0%',
                transition: 'flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                borderRight: i < SERVICES.length - 1 ? '1px solid rgba(204,255,0,.06)' : 'none',
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <AnimatePresence mode="wait">
                {isActive ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="absolute inset-0 flex flex-col justify-between p-8 lg:p-10"
                  >
                    {/* Ghost number */}
                    <span
                      className="ghost-num"
                      aria-hidden="true"
                      style={{
                        fontSize: 'clamp(7rem, 14vw, 14rem)',
                        right: '-0.15em',
                        bottom: '-0.15em',
                      }}
                    >
                      {s.num}
                    </span>

                    {/* Top: number + tech stack */}
                    <div>
                      <span
                        className="font-mono text-[.58rem] uppercase tracking-[.28em] block"
                        style={{ color: 'rgba(204,255,0,.36)' }}
                      >
                        {s.num}
                      </span>
                      <span
                        className="font-mono text-[.54rem] uppercase tracking-[.16em] block mt-1.5"
                        style={{ color: 'rgba(204,255,0,.22)' }}
                      >
                        {s.short}
                      </span>
                    </div>

                    {/* Bottom: title + desc + link */}
                    <div className="relative z-10">
                      <h3
                        style={{
                          fontFamily: "'Space Grotesk', system-ui, sans-serif",
                          fontWeight: 700,
                          fontSize: 'clamp(1.4rem, 2.2vw, 2.6rem)',
                          letterSpacing: '-.055em',
                          lineHeight: 1.0,
                          color: 'var(--accent3)',
                        }}
                      >
                        {s.name}
                      </h3>
                      <p
                        className="mt-4 text-sm leading-[1.85]"
                        style={{ color: 'rgba(240,237,230,.44)', maxWidth: '30ch' }}
                      >
                        {s.desc}
                      </p>
                      <Link
                        to={s.link}
                        className="inline-flex items-center gap-1.5 mt-5 font-mono text-[.6rem] uppercase tracking-[.18em] transition-colors"
                        style={{ color: 'var(--accent)' }}
                      >
                        Meer info <ArrowUpRight size={11} />
                      </Link>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: 'linear-gradient(to right, var(--accent), var(--accent2))', opacity: 0.6 }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-7 py-8"
                  >
                    <span
                      className="font-mono text-[.52rem] uppercase tracking-[.28em]"
                      style={{ color: 'rgba(204,255,0,.25)' }}
                    >
                      {s.num}
                    </span>
                    <span
                      className="service-strip-vert"
                      style={{
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        fontWeight: 700,
                        fontSize: 'clamp(.85rem, 1.3vw, 1.1rem)',
                        letterSpacing: '.03em',
                        color: 'rgba(240,237,230,.38)',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      {s.name}
                    </span>
                    <div
                      className="h-px w-5"
                      style={{ background: 'rgba(204,255,0,.14)' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── Mobile: accordion ── */}
      <div className="lg:hidden">
        <div style={{ height: 1, background: 'rgba(204,255,0,.08)' }} />
        {SERVICES.map((s, i) => {
          const isOpen = activeIndex === i;
          return (
            <div
              key={s.num}
              style={{ borderBottom: '1px solid rgba(204,255,0,.08)' }}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between py-6 text-left"
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-mono text-[.58rem] uppercase tracking-[.24em] shrink-0"
                    style={{ color: 'rgba(204,255,0,.36)' }}
                  >
                    {s.num}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: 'clamp(1.1rem, 4vw, 1.9rem)',
                      letterSpacing: '-.04em',
                      color: isOpen ? 'var(--accent)' : 'var(--accent3)',
                      transition: 'color .3s ease',
                    }}
                  >
                    {s.name}
                  </span>
                </div>
                <ArrowUpRight
                  size={16}
                  style={{
                    color: 'var(--accent)',
                    transform: isOpen ? 'rotate(135deg)' : 'rotate(0deg)',
                    transition: 'transform .4s ease',
                    flexShrink: 0,
                    marginLeft: '1rem',
                  }}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="pb-7 pl-[calc(clamp(.58rem,1vw,.7rem)+1rem+1rem)]">
                      <p
                        className="font-mono text-[.55rem] uppercase tracking-[.18em] mb-3"
                        style={{ color: 'rgba(204,255,0,.28)' }}
                      >
                        {s.short}
                      </p>
                      <p
                        className="text-sm leading-[1.85]"
                        style={{ color: 'rgba(240,237,230,.46)' }}
                      >
                        {s.desc}
                      </p>
                      <Link
                        to={s.link}
                        className="inline-flex items-center gap-2 mt-5 font-mono text-[.62rem] uppercase tracking-[.18em] transition-colors"
                        style={{ color: 'var(--accent)' }}
                      >
                        Meer over {s.name} <ArrowUpRight size={11} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Mobile diensten link */}
      <div className="mt-8 lg:hidden">
        <Link to="/diensten" className="ghost-button">
          Alle diensten <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export default ServicesSection;
