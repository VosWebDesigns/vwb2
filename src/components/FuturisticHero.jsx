import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, ArrowUpRight, CheckCircle } from 'lucide-react';

const TRUST = [
  'Geen aanbetaling nodig',
  'Snelle, persoonlijke oplevering',
  'Transparante vaste prijzen',
  'Post-launch ondersteuning',
];

const FuturisticHero = () => {
  const containerRef = useRef(null);
  const headlineRef  = useRef(null);
  const subRef       = useRef(null);
  const rightRef     = useRef(null);
  const statsRef     = useRef(null);
  const scrollRef    = useRef(null);
  const lineRef      = useRef(null);
  const eyebrowRef   = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      gsap.set([eyebrowRef.current, lineRef.current], { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      /* Vertical line reveal */
      tl.fromTo(lineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, opacity: 1, duration: 1.1 }
      )
      /* Eyebrow */
      .fromTo(eyebrowRef.current,
        { opacity: 0, x: -18 },
        { opacity: 1, x: 0, duration: 0.7 },
        '-=0.6'
      )
      /* Headline chars */
      .fromTo(headlineRef.current.querySelectorAll('.char'),
        isMobile
          ? { opacity: 0, y: 40 }
          : { opacity: 0, y: 80, rotateX: 24, filter: 'blur(4px)' },
        isMobile
          ? { opacity: 1, y: 0, duration: 1.0, stagger: 0.022 }
          : { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.0, stagger: 0.022 },
        '-=0.3'
      )
      /* Serif accent word */
      .fromTo('.hero-serif-word',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.6'
      )
      /* Sub copy */
      .fromTo(subRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      /* CTAs */
      .fromTo('.hero-cta > *',
        { opacity: 0, y: 16, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.10 },
        '-=0.45'
      )
      /* Right card */
      .fromTo(rightRef.current,
        isMobile ? { opacity: 0, y: 28 } : { opacity: 0, x: 42, filter: 'blur(6px)' },
        { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 0.95 },
        '-=0.55'
      )
      /* Stats */
      .fromTo(Array.from(statsRef.current.children),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 },
        '-=0.4'
      )
      /* Scroll indicator */
      .fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.3'
      );

      /* Scroll bounce */
      gsap.to(scrollRef.current, {
        y: 8, repeat: -1, yoyo: true, duration: 1.4, ease: 'sine.inOut', delay: 2.0,
      });

      /* Magnetic CTAs on desktop */
      if (!isMobile) {
        document.querySelectorAll('.glow-button, .ghost-button').forEach((btn) => {
          btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top  - rect.height / 2;
            gsap.to(btn, { x: x * 0.18, y: y * 0.18, duration: 0.4, ease: 'power2.out' });
          });
          btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.6)' });
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* Split headline into characters */
  const line1 = 'Jouw website.';
  const line2Serif = 'Onze';
  const line2Sans  = ' visie.';

  const charsLine1 = line1.split('').map((ch, i) => (
    <span key={i} className="char inline-block" style={{ perspective: '600px' }}>{ch === ' ' ? ' ' : ch}</span>
  ));
  const charsLine2 = line2Sans.split('').map((ch, i) => (
    <span key={i} className="char inline-block" style={{ perspective: '600px' }}>{ch === ' ' ? ' ' : ch}</span>
  ));

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden flex flex-col justify-center px-5 pt-28 pb-16 md:px-10"
    >
      {/* Deep atmospheric gradient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 20% -5%, rgba(201,169,110,.12) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 85% 90%, rgba(138,92,246,.08) 0%, transparent 50%)',
        }}
      />

      {/* Subtle grid (right side only) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(201,169,110,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.04) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
          maskImage: 'radial-gradient(ellipse 60% 70% at 72% 38%, black 10%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at 72% 38%, black 10%, transparent 68%)',
        }}
        aria-hidden="true"
      />

      {/* Corner brackets */}
      <div className="pointer-events-none absolute left-6 top-28 hidden lg:block" aria-hidden="true">
        <div className="h-6 w-6 border-l border-t" style={{ borderColor: 'rgba(201,169,110,.3)' }} />
      </div>
      <div className="pointer-events-none absolute right-6 bottom-16 hidden lg:block" aria-hidden="true">
        <div className="h-6 w-6 border-b border-r" style={{ borderColor: 'rgba(138,92,246,.3)' }} />
      </div>

      {/* Vertical accent line */}
      <div
        ref={lineRef}
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-px hidden lg:block"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,.35) 20%, rgba(138,92,246,.25) 70%, transparent)',
          left: '2.2rem',
        }}
        aria-hidden="true"
      />

      {/* ── Two-column layout ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl grid gap-12 lg:grid-cols-[1fr_.44fr] lg:items-center">

        {/* Left: headline + CTA */}
        <div>
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="mb-7 flex items-center gap-4">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 10px rgba(201,169,110,.8)' }} />
            <span className="font-mono text-[10px] uppercase tracking-[.36em]" style={{ color: 'rgba(201,169,110,.55)' }}>
              Studio — Vos Web Designs
            </span>
            <span className="hidden sm:block h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to right, rgba(201,169,110,.3), transparent)' }} />
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="font-heading font-black leading-[.84] tracking-[-.072em]"
            style={{ fontSize: 'clamp(3.4rem,11vw,9.5rem)', perspective: '700px' }}
          >
            <span className="block text-white overflow-hidden">
              {charsLine1}
            </span>
            <span className="block overflow-hidden mt-1">
              {/* "Onze" in serif italic gold */}
              <em className="hero-serif-word not-italic" style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 600,
                color: 'var(--accent)',
                fontSize: '1.06em',
                letterSpacing: '-.03em',
                marginRight: '0.06em',
              }}>
                {line2Serif}
              </em>
              {/* " visie." in regular heading */}
              <span className="text-white">{charsLine2}</span>
            </span>
          </h1>

          {/* Sub copy */}
          <p
            ref={subRef}
            className="mt-8 max-w-xl leading-[1.75] text-[.98rem]"
            style={{ color: 'rgba(240,235,227,.55)' }}
          >
            Websites die indruk maken vóór de eerste klik — ontworpen met Three.js, GSAP en precisie-animaties die uw merk op het niveau van een top-100 bureau plaatsen.
          </p>

          {/* CTAs */}
          <div className="hero-cta mt-10 flex flex-wrap gap-4">
            <Link to="/contact" className="glow-button">
              Start een project <ArrowRight size={15} />
            </Link>
            <Link to="/portfolio" className="ghost-button">
              Bekijk werk <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* Trust micro-copy */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {TRUST.map((item) => (
              <span key={item} className="flex items-center gap-2 text-[.72rem] font-mono uppercase tracking-[.12em]" style={{ color: 'rgba(201,169,110,.38)' }}>
                <span style={{ color: 'var(--accent)' }}>✓</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right: premium glass card */}
        <div
          ref={rightRef}
          className="glass-card cyber-corner rounded-2xl p-6 md:p-8 flex flex-col gap-5"
        >
          {/* Availability indicator */}
          <div>
            <span className="hud-label block mb-2.5">Status</span>
            <div className="flex items-center gap-3">
              <span className="status-dot" />
              <p className="font-heading text-lg font-black" style={{ color: 'var(--accent3)' }}>
                Nieuwe projecten welkom
              </p>
            </div>
          </div>

          <div className="h-px" style={{ background: 'var(--stroke)' }} />

          {/* Checklist */}
          <ul className="grid gap-3">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[.82rem]" style={{ color: 'rgba(240,235,227,.6)' }}>
                <CheckCircle size={13} className="shrink-0" style={{ color: 'var(--accent)' }} />
                {item}
              </li>
            ))}
          </ul>

          <div className="h-px" style={{ background: 'var(--stroke)' }} />

          {/* Delivery times */}
          <div className="grid gap-1.5">
            <span className="hud-label block mb-1">Doorlooptijd</span>
            {[
              ['Starter', '1–2 weken'],
              ['Groei',   '2–4 weken'],
              ['Op maat', 'in overleg'],
            ].map(([label, time]) => (
              <p key={label} className="text-[.8rem]" style={{ color: 'rgba(240,235,227,.45)' }}>
                {label} — <span className="font-bold" style={{ color: 'var(--accent3)' }}>{time}</span>
              </p>
            ))}
          </div>

          {/* CTA link */}
          <Link
            to="/diensten"
            className="inline-flex items-center gap-2 text-[.8rem] font-mono uppercase tracking-[.14em] transition-colors mt-1"
            style={{ color: 'var(--accent)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent3)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent)'}
          >
            Bekijk pakketten <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div
        ref={statsRef}
        className="relative z-10 mx-auto mt-14 w-full max-w-7xl grid grid-cols-3 gap-px overflow-hidden rounded-2xl"
        style={{ border: '1px solid rgba(201,169,110,.10)', background: 'rgba(201,169,110,.06)' }}
      >
        {[
          ['48u',  'Gemiddelde design doorlooptijd'],
          ['3×',   'Meer conversies vs templates'],
          ['<2s',  'Gemiddelde laadtijd'],
        ].map(([val, label]) => (
          <div key={label} className="px-4 py-5 text-center md:px-6" style={{ background: 'rgba(6,6,12,.88)' }}>
            <p className="font-heading text-xl font-black md:text-2xl" style={{ color: 'var(--accent)' }}>{val}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[.15em] leading-4" style={{ color: 'rgba(201,169,110,.35)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'rgba(201,169,110,.35)' }}
      >
        <span className="font-mono text-[8px] uppercase tracking-[.36em]">Scroll</span>
        <div className="h-8 w-px" style={{ background: 'linear-gradient(to bottom, rgba(201,169,110,.4), transparent)' }} />
      </div>
    </section>
  );
};

export default FuturisticHero;
