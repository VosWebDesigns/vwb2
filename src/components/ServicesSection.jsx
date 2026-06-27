import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const ServiceItem = ({ service, index }) => {
  const [open, setOpen] = useState(false);
  const descRef = useRef(null);
  const rowRef  = useRef(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          delay: index * 0.07,
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.55, ease: 'power3.inOut' }
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.4, ease: 'power3.inOut' });
    }
  }, [open]);

  return (
    <div ref={rowRef} className="border-b" style={{ borderColor: 'rgba(201,169,110,.10)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between py-7 text-left md:py-9 transition-colors"
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent3)'; }}
        style={{ color: 'var(--accent3)' }}
      >
        {/* Number + Name */}
        <div className="flex items-baseline gap-5 md:gap-8">
          <span
            className="font-mono shrink-0"
            style={{ fontSize: 'clamp(.6rem, 1vw, .75rem)', letterSpacing: '.28em', color: 'rgba(201,169,110,.4)' }}
          >
            {service.num}
          </span>
          <span
            className="font-heading font-black uppercase leading-none tracking-[-0.05em] transition-colors duration-300"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 5rem)' }}
          >
            {service.name}
          </span>
        </div>

        {/* Right: tag + arrow */}
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span
            className="hidden font-mono text-[.6rem] uppercase tracking-[.22em] lg:block"
            style={{ color: 'rgba(201,169,110,.35)' }}
          >
            {service.short}
          </span>
          <ArrowUpRight
            size={20}
            className="transition-all duration-400"
            style={{
              color: 'var(--accent)',
              transform: open ? 'rotate(135deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </button>

      {/* Expandable description */}
      <div ref={descRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <div className="pb-8 pl-[calc(clamp(.6rem,1vw,.75rem)+1.25rem+2rem)] md:pl-[calc(clamp(.6rem,1vw,.75rem)+2rem+2.5rem)] flex items-start justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-base leading-[1.85]" style={{ color: 'rgba(240,235,227,.5)' }}>
              {service.desc}
            </p>
            <Link
              to={service.link}
              className="inline-flex items-center gap-2 mt-6 font-mono text-[.72rem] uppercase tracking-[.2em] transition-colors"
              style={{ color: 'var(--accent)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
            >
              Meer over {service.name} <ArrowUpRight size={12} />
            </Link>
          </div>
          <span
            className="hidden shrink-0 font-mono text-[.6rem] uppercase tracking-[.22em] lg:block"
            style={{ color: 'rgba(201,169,110,.3)' }}
          >
            {service.short}
          </span>
        </div>
      </div>
    </div>
  );
};

const ServicesSection = () => {
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
            className="font-mono text-[.65rem] uppercase tracking-[.4em] mb-4"
            style={{ color: 'var(--accent)' }}
          >
            — Wat wij bouwen
          </p>
          <h2
            className="font-heading font-black uppercase leading-none tracking-[-0.055em]"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 7.5rem)', color: 'var(--accent3)' }}
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
          className="hidden lg:inline-flex items-center gap-2 font-mono text-[.7rem] uppercase tracking-[.24em] pb-2 transition-colors"
          style={{
            color: 'rgba(201,169,110,.4)',
            borderBottom: '1px solid rgba(201,169,110,.2)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(201,169,110,.4)'; }}
        >
          Alle diensten <ArrowUpRight size={12} />
        </Link>
      </div>

      {/* Top divider */}
      <div style={{ height: 1, background: 'rgba(201,169,110,.10)', marginBottom: 0 }} />

      {/* Service list */}
      {SERVICES.map((s, i) => (
        <ServiceItem key={s.num} service={s} index={i} />
      ))}
    </section>
  );
};

export default ServicesSection;
