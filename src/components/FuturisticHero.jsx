import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';

const METRICS = [
  { label: 'Lighthouse Score', value: '100', unit: '' },
  { label: 'Load Time',        value: '<2s', unit: '' },
  { label: 'Klanten',          value: '48+', unit: '' },
];

const FuturisticHero = () => {
  const secRef    = useRef(null);
  const topRef    = useRef(null);
  const line1Ref  = useRef(null);
  const line2Ref  = useRef(null);
  const line3Ref  = useRef(null);
  const line4Ref  = useRef(null);
  const hudRef    = useRef(null);
  const botRef    = useRef(null);
  const subRef    = useRef(null);
  const ruleRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = [line1Ref, line2Ref, line3Ref, line4Ref].map((r) => r.current).filter(Boolean);

      gsap.set(lines, { clipPath: 'inset(0 100% 0 0)', opacity: 1 });
      gsap.set([topRef.current, subRef.current, botRef.current], { opacity: 0, y: 16 });
      if (hudRef.current) gsap.set(hudRef.current.children, { opacity: 0, y: 24 });

      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'power4.out' } });

      tl.to(topRef.current, { opacity: 1, y: 0, duration: 0.7 });

      lines.forEach((line, i) => {
        tl.to(line, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.95,
          ease: 'power4.out',
        }, i === 0 ? '-=0.3' : `-=0.72`);
      });

      // Animated signature rule — draws left→right after last headline line
      if (ruleRef.current) {
        gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'left' });
        tl.to(ruleRef.current, { scaleX: 1, duration: 1.1, ease: 'power3.out' }, '-=0.45');
      }

      tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.7');

      if (hudRef.current) {
        tl.to(hudRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
        }, '-=0.5');
      }

      tl.to(botRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');

      /* Mouse parallax on headline layers */
      const onMouseMove = (e) => {
        if (prefersReducedMotion) return;
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        if (line1Ref.current) gsap.to(line1Ref.current, { x: dx * 8,  y: dy * 4,  duration: 1.2, ease: 'power2.out' });
        if (line2Ref.current) gsap.to(line2Ref.current, { x: dx * 14, y: dy * 7,  duration: 1.2, ease: 'power2.out' });
        if (line3Ref.current) gsap.to(line3Ref.current, { x: dx * 10, y: dy * 5,  duration: 1.2, ease: 'power2.out' });
        if (line4Ref.current) gsap.to(line4Ref.current, { x: dx * 18, y: dy * 9,  duration: 1.2, ease: 'power2.out' });
      };

      /* Scroll parallax */
      const onScroll = () => {
        const y = window.scrollY * -0.12;
        lines.forEach((line, i) => {
          if (line) gsap.set(line, { y: y * (1 + i * 0.2) });
        });
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('scroll',    onScroll,    { passive: true });

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('scroll',    onScroll);
      };
    }, secRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={secRef}
      className="relative flex h-[100svh] flex-col justify-between overflow-hidden px-6 pt-6 pb-8 md:px-12 md:pt-8 md:pb-10 lg:px-16"
    >
      {/* Atmospheric glows */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[65vh] w-[55vw]"
        style={{ background: 'radial-gradient(ellipse at 15% 8%, rgba(201,169,110,.09) 0%, transparent 60%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[50vh] w-[45vw]"
        style={{ background: 'radial-gradient(ellipse at 85% 92%, rgba(138,92,246,.08) 0%, transparent 58%)' }}
        aria-hidden="true"
      />

      {/* Thin horizontal rule across mid */}
      <div
        className="pointer-events-none absolute inset-x-0"
        style={{ top: '42%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,.04), transparent)' }}
        aria-hidden="true"
      />

      {/* ── Top bar ── */}
      <div ref={topRef} className="relative z-10 flex items-center justify-between">
        <div className="availability-badge">
          <span className="status-dot" />
          Studio — beschikbaar
        </div>
        <span
          className="font-mono text-[9px] uppercase tracking-[.4em]"
          style={{ color: 'rgba(201,169,110,.28)' }}
        >
          NL&nbsp;·&nbsp;Est.&nbsp;2019
        </span>
      </div>

      {/* ── Headline ── */}
      <div className="relative z-10 select-none">
        <h1 className="m-0 p-0">
          {/* Line 1: WIJ */}
          <div
            ref={line1Ref}
            className="font-heading font-black uppercase leading-none"
            style={{
              fontSize: 'clamp(3.8rem, 15.5vw, 18rem)',
              letterSpacing: '-.07em',
              color: 'var(--accent3)',
            }}
          >
            WIJ
          </div>

          {/* Line 2: BOUWEN */}
          <div
            ref={line2Ref}
            className="font-heading font-black uppercase leading-none"
            style={{
              fontSize: 'clamp(3.8rem, 15.5vw, 18rem)',
              letterSpacing: '-.07em',
              color: 'var(--accent3)',
              marginTop: '-0.05em',
              paddingLeft: '0.12em',
            }}
          >
            BOUWEN
          </div>

          {/* Line 3: digitale (serif italic gold) */}
          <div
            ref={line3Ref}
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: 'clamp(4.2rem, 17vw, 20rem)',
              letterSpacing: '-.025em',
              lineHeight: 0.88,
              color: 'var(--accent)',
              paddingLeft: '0.28em',
              marginTop: '-0.04em',
            }}
          >
            digitale
          </div>

          {/* Line 4: ERVARINGEN. */}
          <div
            ref={line4Ref}
            className="font-heading font-black uppercase leading-none"
            style={{
              fontSize: 'clamp(3.2rem, 13vw, 15rem)',
              letterSpacing: '-.07em',
              color: 'var(--accent3)',
              marginTop: '-0.04em',
            }}
          >
            ERVARINGEN.
          </div>
        </h1>

        {/* Animated signature rule */}
        <div
          ref={ruleRef}
          className="mt-7 md:mt-9"
          style={{
            height: 1,
            background: 'linear-gradient(to right, var(--accent), rgba(201,169,110,.12))',
            maxWidth: '52ch',
            transformOrigin: 'left',
          }}
          aria-hidden="true"
        />

        {/* Sub label */}
        <p
          ref={subRef}
          className="mt-4 font-mono text-[.68rem] uppercase tracking-[.26em]"
          style={{ color: 'rgba(201,169,110,.34)', maxWidth: '52ch' }}
        >
          Van concept tot lancering&nbsp;·&nbsp;Maatwerk digitale ervaringen die converteren.
        </p>
      </div>

      {/* ── HUD floating metrics ── */}
      <div
        ref={hudRef}
        className="relative z-10 hidden md:flex items-center gap-4 absolute"
        style={{ bottom: '9rem', right: '4rem' }}
        aria-hidden="true"
      >
        {METRICS.map(({ label, value }) => (
          <div key={label} className="hud-panel flex flex-col gap-0.5">
            <span
              className="font-mono text-[.55rem] uppercase tracking-[.3em]"
              style={{ color: 'rgba(201,169,110,.38)' }}
            >
              {label}
            </span>
            <span
              className="font-heading font-black tabular-nums"
              style={{ fontSize: '1.35rem', letterSpacing: '-.04em', color: 'var(--accent3)' }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div ref={botRef} className="relative z-10 flex items-end justify-between">
        {/* Scroll cue */}
        <div className="flex flex-col items-start gap-2">
          <div
            className="h-14 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,.4))' }}
          />
          <span
            className="font-mono text-[8px] uppercase tracking-[.48em]"
            style={{ color: 'rgba(201,169,110,.28)' }}
          >
            Scroll
          </span>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <MagneticButton to="/contact" className="glow-button">
            Start project <ArrowRight size={14} />
          </MagneticButton>
          <MagneticButton to="/portfolio" className="ghost-button hidden md:inline-flex">
            Werk bekijken
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default FuturisticHero;
