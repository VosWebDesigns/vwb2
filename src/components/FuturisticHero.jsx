import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown, CheckCircle } from 'lucide-react';

const TRUST = [
  'Geen aanbetaling',
  'Snelle oplevering',
  'Persoonlijk contact',
  'Transparante prijzen',
];

const FuturisticHero = () => {
  const containerRef = useRef(null);
  const headlineRef  = useRef(null);
  const subRef       = useRef(null);
  const rightRef     = useRef(null);
  const statsRef     = useRef(null);
  const scanRef      = useRef(null);
  const scrollRef    = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl
        .fromTo('.hero-eyebrow',
          { opacity: 0, y: -14 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo(headlineRef.current.querySelectorAll('.word'),
          isMobile
            ? { opacity: 0, y: 40 }
            : { opacity: 0, y: 60, rotateX: 30 },
          isMobile
            ? { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 }
            : { opacity: 1, y: 0, rotateX: 0, duration: 0.85, stagger: 0.08 },
          '-=0.2'
        )
        .fromTo(subRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo('.hero-cta > *',
          { opacity: 0, y: 18, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
          '-=0.4'
        )
        .fromTo(rightRef.current,
          isMobile
            ? { opacity: 0, y: 28 }
            : { opacity: 0, x: 36 },
          { opacity: 1, x: 0, y: 0, duration: 0.85 },
          '<0.15'
        )
        .fromTo(Array.from(statsRef.current.children),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 },
          '-=0.35'
        )
        .fromTo(scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.2'
        );

      /* Scanline sweep */
      if (scanRef.current) {
        gsap.fromTo(scanRef.current,
          { y: '-100%', opacity: 0 },
          { y: '100%', opacity: 0.35, duration: 3.5, repeat: -1, ease: 'none', delay: 2 }
        );
      }

      /* Scroll bounce */
      gsap.to(scrollRef.current, {
        y: 7, repeat: -1, yoyo: true, duration: 1.3, ease: 'sine.inOut', delay: 1.8,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden flex flex-col justify-center px-5 pt-28 pb-16 md:px-10"
    >
      {/* Scanline sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          ref={scanRef}
          className="absolute left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(140,214,255,.45), transparent)' }}
        />
      </div>

      {/* Atmospheric glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(14,165,233,.18),transparent)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_85%_85%,rgba(214,245,122,.06),transparent)]" aria-hidden="true" />

      {/* Sci-fi grid — fades left-to-right so left text stays clean */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(140,214,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(140,214,255,.055) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 60% 30%, black 15%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 60% 30%, black 15%, transparent 72%)',
        }}
        aria-hidden="true"
      />

      {/* Corner brackets (decorative) */}
      <div className="pointer-events-none absolute left-6 top-28 hidden lg:block" aria-hidden="true">
        <div className="h-5 w-5 border-l border-t border-[rgba(140,214,255,.28)]" />
      </div>
      <div className="pointer-events-none absolute right-6 bottom-16 hidden lg:block" aria-hidden="true">
        <div className="h-5 w-5 border-b border-r border-[rgba(214,245,122,.28)]" />
      </div>

      {/* ── Two-column layout ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl grid gap-10 lg:grid-cols-[1fr_.48fr] lg:items-center">

        {/* Left: headline + CTA */}
        <div>
          <div className="hero-eyebrow mb-6 flex items-center gap-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent2)] shadow-[0_0_8px_rgba(214,245,122,.8)]" />
            <span className="font-mono text-[11px] uppercase tracking-[.32em] text-[var(--accent)]">
              Studio Vos Web Designs — 2025
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="font-heading font-black leading-[.85] tracking-[-.065em] text-white [perspective:700px]"
            style={{ fontSize: 'clamp(3.2rem,10.5vw,9rem)' }}
          >
            <span className="word block">Jouw website.</span>
            <span className="word block gradient-text-full">Onze visie.</span>
          </h1>

          <p
            ref={subRef}
            className="mt-7 max-w-lg text-base leading-8 text-slate-300 md:text-lg"
          >
            Professionele websites die vertrouwen wekken en resultaat geven — zonder technische zorgen of verborgen kosten.
          </p>

          <div className="hero-cta mt-9 flex flex-wrap gap-4">
            <Link to="/contact" className="glow-button">
              Start een project <ArrowRight size={16} />
            </Link>
            <Link to="/diensten" className="ghost-button">
              Diensten bekijken
            </Link>
          </div>
        </div>

        {/* Right: glass info card */}
        <div
          ref={rightRef}
          className="glass-card cyber-corner rounded-2xl p-6 md:p-8 flex flex-col gap-6"
        >
          <div>
            <span className="hud-label block mb-2">Beschikbaarheid</span>
            <div className="flex items-center gap-2.5">
              <span className="status-dot" />
              <p className="font-heading text-xl font-black text-white">Nieuwe projecten welkom</p>
            </div>
          </div>

          <ul className="grid gap-3">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle size={15} className="shrink-0 text-[var(--accent2)]" />
                {item}
              </li>
            ))}
          </ul>

          <div className="border-t border-[var(--stroke)] pt-5 grid gap-1.5">
            <span className="hud-label block mb-1">Doorlooptijd</span>
            <p className="text-sm text-slate-400">
              Starter — <span className="font-bold text-white">1–2 weken</span>
            </p>
            <p className="text-sm text-slate-400">
              Groei — <span className="font-bold text-white">2–4 weken</span>
            </p>
            <p className="text-sm text-slate-400">
              Op maat — <span className="font-bold text-white">in overleg</span>
            </p>
          </div>

          <Link to="/diensten" className="cta-link text-sm">
            Bekijk pakketten <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div
        ref={statsRef}
        className="relative z-10 mx-auto mt-10 w-full max-w-7xl grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[rgba(140,214,255,.1)] bg-[rgba(140,214,255,.08)]"
      >
        {[
          ['48u',  'Gemiddelde design doorlooptijd'],
          ['3×',   'Meer conversies vs templates'],
          ['<2s',  'Gemiddelde laadtijd'],
        ].map(([val, label]) => (
          <div key={label} className="bg-[rgba(5,11,20,.85)] px-4 py-4 text-center md:px-6">
            <p className="font-heading text-xl font-black text-[var(--accent)] md:text-2xl">{val}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[.15em] text-slate-500 leading-4">{label}</p>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[var(--accent)] opacity-50"
      >
        <span className="font-mono text-[9px] uppercase tracking-[.3em]">Scroll</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
};

export default FuturisticHero;
