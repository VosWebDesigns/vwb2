import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';

const FuturisticHero = () => {
  const secRef   = useRef(null);
  const topRef   = useRef(null);
  const leftRef  = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const labelRef = useRef(null);
  const botRef   = useRef(null);
  const rightRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const pillRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(topRef.current,  { opacity: 0, y: 14 });
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 115, opacity: 0 });
      gsap.set(labelRef.current, { opacity: 0, y: 10 });
      gsap.set(botRef.current,  { opacity: 0, y: 14 });
      gsap.set(card1Ref.current, { opacity: 0, x: 44, rotation: -2 });
      gsap.set(card2Ref.current, { opacity: 0, x: 44, rotation: 0 });
      gsap.set(card3Ref.current, { opacity: 0, x: 44, rotation: 1.5 });
      gsap.set(pillRef.current, { opacity: 0, y: 12 });

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power4.out' } });

      tl.to(topRef.current,  { opacity: 1, y: 0, duration: 0.8 })
        .to(line1Ref.current, { yPercent: 0, opacity: 1, duration: 1.1 }, '-=0.3')
        .to(line2Ref.current, { yPercent: 0, opacity: 1, duration: 1.1 }, '-=0.85')
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to(card1Ref.current, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7')
        .to(card2Ref.current, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, '-=0.75')
        .to(card3Ref.current, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, '-=0.75')
        .to(pillRef.current,  { opacity: 1, y: 0, duration: 0.6 }, '-=0.45')
        .to(botRef.current,   { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');

      const onScroll = () => {
        const y = window.scrollY;
        if (!leftRef.current) return;
        gsap.set(leftRef.current,  { y: y * -0.14 });
        gsap.set(rightRef.current, { y: y * -0.06 });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, secRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={secRef}
      className="relative flex h-[100svh] overflow-hidden"
    >
      {/* Architectural grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(204,255,0,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,.022) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
        }}
        aria-hidden="true"
      />
      {/* Atmospheric glow — left */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[70vh] w-[60vw]"
        style={{ background: 'radial-gradient(ellipse at 15% 12%, rgba(204,255,0,.09) 0%, transparent 55%)' }}
        aria-hidden="true"
      />
      {/* Atmospheric glow — right bottom */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[45vh] w-[45vw]"
        style={{ background: 'radial-gradient(ellipse at 82% 88%, rgba(255,63,0,.06) 0%, transparent 55%)' }}
        aria-hidden="true"
      />

      {/* ── Left column ── */}
      <div
        ref={leftRef}
        className="relative z-10 flex flex-col justify-between w-full lg:w-[55%] px-5 pt-6 pb-7 md:px-10 md:pt-7 md:pb-10 lg:px-16"
        style={{ borderRight: '1px solid rgba(204,255,0,.06)' }}
      >
        {/* Top HUD */}
        <div ref={topRef} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="status-dot" />
            <span
              className="font-mono text-[9px] uppercase tracking-[.4em]"
              style={{ color: 'rgba(204,255,0,.45)' }}
            >
              Studio — beschikbaar
            </span>
          </div>
          <span
            className="font-mono text-[9px] uppercase tracking-[.4em]"
            style={{ color: 'rgba(204,255,0,.30)' }}
          >
            NL · Est. 2019
          </span>
        </div>

        {/* Headline: MAAT / werk = MAATWERK */}
        <div className="select-none" style={{ perspective: '900px' }}>
          <div className="overflow-hidden">
            <div
              ref={line1Ref}
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(4.2rem, 15.5vw, 16.5rem)',
                letterSpacing: '-.07em',
                lineHeight: 0.86,
                color: 'var(--accent3)',
              }}
            >
              MAAT
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              ref={line2Ref}
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 'clamp(4.8rem, 17vw, 18rem)',
                letterSpacing: '-.03em',
                lineHeight: 0.86,
                color: 'var(--accent)',
              }}
            >
              werk
            </div>
          </div>
          <p
            ref={labelRef}
            className="mt-5 font-mono uppercase tracking-[.32em]"
            style={{ fontSize: 'clamp(.65rem, 1.1vw, .88rem)', color: 'rgba(204,255,0,.28)' }}
          >
            Web Design Studio · NL
          </p>
        </div>

        {/* Bottom bar */}
        <div ref={botRef} className="flex items-end justify-between">
          <div className="flex flex-col items-start gap-2">
            <div
              className="h-14 w-px"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(204,255,0,.40))' }}
            />
            <span
              className="font-mono text-[8px] uppercase tracking-[.44em]"
              style={{ color: 'rgba(204,255,0,.28)' }}
            >
              Scroll
            </span>
          </div>
          <div className="flex flex-col items-end gap-3">
            {/* Mobile stats strip */}
            <div className="flex items-center gap-5 lg:hidden">
              <div className="text-right">
                <span className="font-mono text-[.7rem] block" style={{ color: 'var(--accent)' }}>48u</span>
                <span className="font-mono text-[.5rem] uppercase tracking-[.18em]" style={{ color: 'rgba(204,255,0,.25)' }}>gemiddeld design</span>
              </div>
              <div className="h-5 w-px" style={{ background: 'rgba(204,255,0,.10)' }} />
              <div className="text-right">
                <span className="font-mono text-[.7rem] block" style={{ color: 'var(--accent)' }}>99%</span>
                <span className="font-mono text-[.5rem] uppercase tracking-[.18em]" style={{ color: 'rgba(204,255,0,.25)' }}>klanttevredenheid</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/contact" className="glow-button">
                Start project <ArrowRight size={14} />
              </Link>
              <Link to="/portfolio" className="ghost-button hidden md:inline-flex">
                Werk bekijken
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right column (desktop only) ── */}
      <div
        ref={rightRef}
        className="relative z-10 hidden lg:flex flex-col justify-center gap-3.5 w-[45%] px-10 pb-10 pt-24 overflow-hidden"
      >
        {/* Card 1 */}
        <div
          ref={card1Ref}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div
            className="aspect-video flex items-center justify-center"
            style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(204,255,0,.08), rgba(6,6,8,.95))' }}
          >
            <span className="font-mono text-[.5rem] uppercase tracking-[.28em]" style={{ color: 'rgba(204,255,0,.20)' }}>
              Web Experience
            </span>
          </div>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(204,255,0,.06)' }}>
            <span className="font-mono text-[.5rem] uppercase tracking-[.18em]" style={{ color: 'rgba(204,255,0,.25)' }}>01 — Design</span>
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          </div>
        </div>

        {/* Card 2 */}
        <div
          ref={card2Ref}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div
            className="aspect-video flex items-center justify-center"
            style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(255,63,0,.07), rgba(6,6,8,.95))' }}
          >
            <span className="font-mono text-[.5rem] uppercase tracking-[.28em]" style={{ color: 'rgba(255,63,0,.20)' }}>
              3D Interface
            </span>
          </div>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(204,255,0,.06)' }}>
            <span className="font-mono text-[.5rem] uppercase tracking-[.18em]" style={{ color: 'rgba(204,255,0,.25)' }}>02 — Development</span>
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent2)' }} />
          </div>
        </div>

        {/* Card 3 */}
        <div
          ref={card3Ref}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div
            className="aspect-video flex items-center justify-center"
            style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(204,255,0,.05), rgba(6,6,8,.95))' }}
          >
            <span className="font-mono text-[.5rem] uppercase tracking-[.28em]" style={{ color: 'rgba(204,255,0,.16)' }}>
              Motion Design
            </span>
          </div>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(204,255,0,.06)' }}>
            <span className="font-mono text-[.5rem] uppercase tracking-[.18em]" style={{ color: 'rgba(204,255,0,.25)' }}>03 — Launch</span>
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          </div>
        </div>

        {/* Availability pill */}
        <div ref={pillRef} className="inline-flex items-center gap-2.5 mt-1">
          <span className="status-dot" />
          <span className="font-mono text-[.58rem] uppercase tracking-[.24em]" style={{ color: 'rgba(204,255,0,.36)' }}>
            1 plek beschikbaar — Q3 2025
          </span>
        </div>
      </div>
    </section>
  );
};

export default FuturisticHero;
