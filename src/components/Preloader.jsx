import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Preloader = ({ onComplete }) => {
  const wrapRef = useRef(null);
  const topRef  = useRef(null);
  const botRef  = useRef(null);
  const numRef  = useRef(null);
  const lineRef = useRef(null);
  const barRef  = useRef(null);
  const tagRef  = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const top  = topRef.current;
    const bot  = botRef.current;
    const num  = numRef.current;
    const line = lineRef.current;
    const bar  = barRef.current;
    const tag  = tagRef.current;
    if (!wrap || !top || !bot || !num || !line || !bar) return;

    // Initial states
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(tag,  { opacity: 0, y: 8 });

    const obj = { n: 0 };
    const tl  = gsap.timeline();

    // Phase 1: counter climbs + bar fills
    tl.to(obj, {
      n: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate() {
        const v = Math.round(obj.n);
        if (num) num.textContent = String(v).padStart(3, '0');
        if (bar) bar.style.transform = `scaleX(${v / 100})`;
      },
    })
    // Phase 2: tag line fades in
    .to(tag, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    // Phase 3: brief hold then split-panel reveal
    .to({}, { duration: 0.25 })
    // Split: top panel flies up, bottom flies down simultaneously
    .to(top, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' })
    .to(bot, { yPercent: 100,  duration: 0.85, ease: 'power4.inOut' }, '<')
    .add(onComplete, '-=0.2');

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div ref={wrapRef} className="fixed inset-0 z-[10000] overflow-hidden" aria-hidden="true">
      {/* Top panel */}
      <div
        ref={topRef}
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-end pb-8"
        style={{ height: '50%', background: '#060608' }}
      >
        {/* Counter */}
        <p
          ref={numRef}
          className="font-mono tabular-nums select-none"
          style={{
            color: 'var(--accent)',
            fontSize: 'clamp(6rem, 18vw, 14rem)',
            letterSpacing: '-.06em',
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          000
        </p>
      </div>

      {/* Bottom panel */}
      <div
        ref={botRef}
        className="absolute inset-x-0 bottom-0 flex flex-col items-center pt-7"
        style={{ height: '50%', background: '#060608' }}
      >
        {/* Horizontal rule / progress bar */}
        <div className="w-[min(440px,82vw)]" style={{ height: 1, background: 'rgba(204,255,0,.08)' }}>
          <div
            ref={barRef}
            className="h-full origin-left"
            style={{ background: 'linear-gradient(to right, var(--accent), var(--accent2))', transform: 'scaleX(0)' }}
          />
        </div>

        {/* Studio name */}
        <p
          className="mt-8 font-heading font-bold uppercase tracking-[.28em]"
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 'clamp(.9rem, 2.8vw, 1.5rem)',
            color: 'var(--accent3)',
            letterSpacing: '.28em',
          }}
        >
          Vos Web Designs
        </p>

        {/* Tagline */}
        <p
          ref={tagRef}
          className="mt-3 font-mono text-[.6rem] uppercase tracking-[.42em]"
          style={{ color: 'rgba(204,255,0,.30)' }}
        >
          Premium Web Studio · NL
        </p>

        {/* Divider hairline */}
        <div
          ref={lineRef}
          className="mt-8 w-[min(440px,82vw)]"
          style={{ height: 1, background: 'rgba(204,255,0,.12)', transform: 'scaleX(0)', transformOrigin: 'left center' }}
        />
      </div>
    </div>
  );
};

export default Preloader;
