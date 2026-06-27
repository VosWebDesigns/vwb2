import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CHARS = 'VOS WEB DESIGNS'.split('');

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const numRef       = useRef(null);
  const barRef       = useRef(null);
  const charsRef     = useRef([]);
  const subRef       = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const num       = numRef.current;
    const bar       = barRef.current;
    const sub       = subRef.current;
    if (!container || !num || !bar) return;

    const chars = charsRef.current.filter(Boolean);

    gsap.set(chars, { yPercent: 110, opacity: 0 });
    gsap.set([num, bar, sub], { opacity: 0 });

    const tl = gsap.timeline();

    tl.to(chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.04,
      ease: 'power4.out',
    });

    tl.to([num, bar, sub], {
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out',
    }, '-=0.1');

    const obj = { n: 0 };
    tl.to(obj, {
      n: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate() {
        const v = Math.round(obj.n);
        if (num) num.textContent = String(v).padStart(3, '0');
        if (bar) bar.style.transform = `scaleX(${v / 100})`;
      },
    }, '-=0.3');

    tl.to(container, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.85,
      ease: 'power4.inOut',
      delay: 0.22,
      onComplete,
    });

    gsap.set(container, { clipPath: 'inset(0 0 0% 0)' });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: '#06060c',
        clipPath: 'inset(0 0 0% 0)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,.05), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Brand name — char-by-char reveal */}
      <div className="relative overflow-visible flex" aria-label="Vos Web Designs">
        {CHARS.map((char, i) => (
          <span
            key={i}
            ref={(el) => { charsRef.current[i] = el; }}
            style={{
              display: 'inline-block',
              fontFamily: 'Sora, Inter, system-ui, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.1rem, 3.2vw, 1.8rem)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--accent3)',
              whiteSpace: 'pre',
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Counter */}
      <p
        ref={numRef}
        className="tabular-nums"
        style={{
          marginTop: '2.5rem',
          fontFamily: 'Sora, Inter, system-ui, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(5rem, 16vw, 13rem)',
          letterSpacing: '-0.06em',
          lineHeight: 1,
          color: 'var(--accent)',
        }}
      >
        000
      </p>

      {/* Progress bar */}
      <div
        className="mt-8"
        style={{
          width: 'min(440px, 82vw)',
          height: '1px',
          background: 'rgba(201,169,110,.14)',
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
            background: 'linear-gradient(to right, var(--accent), var(--accent2))',
          }}
        />
      </div>

      {/* Sub label */}
      <p
        ref={subRef}
        className="mt-6"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.6rem',
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: 'rgba(201,169,110,.3)',
        }}
      >
        Premium web studio · Nederland
      </p>

      {/* Scanline */}
      <div
        className="pointer-events-none absolute inset-0 scanline-overlay"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      />
    </div>
  );
};

export default Preloader;
