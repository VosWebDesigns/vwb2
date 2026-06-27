import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';

const FuturisticHero = () => {
  const secRef   = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const subRef   = useRef(null);
  const botRef   = useRef(null);
  const topRef   = useRef(null);
  const ghostRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
        yPercent: 115,
        rotateX: 8,
        opacity: 0,
      });
      gsap.set([topRef.current, subRef.current, botRef.current], { opacity: 0, y: 14 });
      gsap.set(ghostRef.current, { opacity: 0, x: 30 });

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power4.out' } });

      tl.to(topRef.current,   { opacity: 1, y: 0, duration: 0.8 })
        .to(ghostRef.current, { opacity: 1, x: 0, duration: 1.6, ease: 'power3.out' }, 0)
        .to(line1Ref.current, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1 }, '-=0.4')
        .to(line2Ref.current, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1 }, '-=0.85')
        .to(line3Ref.current, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1 }, '-=0.85')
        .to(subRef.current,   { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .to(botRef.current,   { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');

      const onScroll = () => {
        const y = window.scrollY;
        if (!line1Ref.current) return;
        gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
          y: y * -0.14,
        });
        gsap.set(ghostRef.current, { y: y * -0.07 });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, secRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={secRef}
      className="relative flex h-[100svh] flex-col justify-between overflow-hidden px-5 pt-6 pb-7 md:px-10 md:pt-7 md:pb-10 lg:px-16"
    >
      {/* Architectural grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(204,255,0,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,.028) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
        }}
        aria-hidden="true"
      />

      {/* Ghost architectural number */}
      <div
        ref={ghostRef}
        className="pointer-events-none absolute right-0 top-0 overflow-hidden"
        aria-hidden="true"
        style={{ opacity: 0 }}
      >
        <span
          style={{
            display: 'block',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(14rem, 32vw, 30rem)',
            letterSpacing: '-.06em',
            lineHeight: 0.82,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(204,255,0,.055)',
            userSelect: 'none',
          }}
        >
          01
        </span>
      </div>

      {/* Atmospheric glow left */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[70vh] w-[60vw]"
        style={{ background: 'radial-gradient(ellipse at 15% 12%, rgba(204,255,0,.09) 0%, transparent 55%)' }}
        aria-hidden="true"
      />
      {/* Atmospheric glow right bottom */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[45vh] w-[45vw]"
        style={{ background: 'radial-gradient(ellipse at 82% 88%, rgba(255,63,0,.06) 0%, transparent 55%)' }}
        aria-hidden="true"
      />

      {/* ── Top bar ── */}
      <div ref={topRef} className="relative z-10 flex items-center justify-between">
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

      {/* ── Headline ── */}
      <div className="relative z-10 select-none" style={{ perspective: '900px' }}>
        <h1 className="m-0 p-0">
          {/* Line 1 */}
          <div className="overflow-hidden">
            <div
              ref={line1Ref}
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(3.2rem, 13.2vw, 15.5rem)',
                letterSpacing: '-.065em',
                lineHeight: 0.88,
                color: 'var(--accent3)',
              }}
            >
              WIJ BOUWEN
            </div>
          </div>

          {/* Line 2: serif italic, lime */}
          <div className="overflow-hidden">
            <div
              ref={line2Ref}
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 'clamp(3.6rem, 14.8vw, 17rem)',
                letterSpacing: '-.03em',
                lineHeight: 0.88,
                color: 'var(--accent)',
              }}
            >
              digitale
            </div>
          </div>

          {/* Line 3 */}
          <div className="overflow-hidden">
            <div
              ref={line3Ref}
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(3.2rem, 13.2vw, 15.5rem)',
                letterSpacing: '-.065em',
                lineHeight: 0.88,
                color: 'var(--accent3)',
              }}
            >
              ERVARINGEN.
            </div>
          </div>
        </h1>

        {/* Sub line */}
        <p
          ref={subRef}
          className="mt-6 font-mono text-[.72rem] uppercase tracking-[.22em] md:mt-8"
          style={{ color: 'rgba(204,255,0,.35)', maxWidth: '55ch' }}
        >
          Three.js&nbsp;·&nbsp;GSAP&nbsp;·&nbsp;WebGL&nbsp;·&nbsp;Spline&nbsp;·&nbsp;Lenis&nbsp;·&nbsp;Premium web studio Nederland
        </p>
      </div>

      {/* ── Bottom bar ── */}
      <div ref={botRef} className="relative z-10 flex items-end justify-between">
        {/* Scroll cue */}
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

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link to="/contact" className="glow-button">
            Start project <ArrowRight size={14} />
          </Link>
          <Link to="/portfolio" className="ghost-button hidden md:inline-flex">
            Werk bekijken
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FuturisticHero;
