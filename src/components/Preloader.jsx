import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Preloader = ({ onComplete }) => {
  const wrapRef = useRef(null);
  const topRef  = useRef(null);
  const botRef  = useRef(null);
  const nameRef = useRef(null);
  const lineRef = useRef(null);
  const tagRef  = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const top  = topRef.current;
    const bot  = botRef.current;
    const name = nameRef.current;
    const line = lineRef.current;
    const tag  = tagRef.current;
    if (!wrap || !top || !bot || !line) return;

    // Initial states
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set([name, tag], { opacity: 0, y: 10 });

    const tl = gsap.timeline();

    // Phase 1: studio name fades in
    tl.to(name, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.15)
    // Phase 2: gold hairline draws left-to-right — this IS the progress indicator
    .to(line, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0.35)
    // Phase 3: tagline fades in as line completes
    .to(tag, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    // Phase 4: brief breath
    .to({}, { duration: 0.3 })
    // Phase 5: simultaneous split-panel exit
    .to(top, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' })
    .to(bot, { yPercent: 100,  duration: 0.85, ease: 'power4.inOut' }, '<')
    .add(onComplete, '-=0.2');

    return () => tl.kill();
  }, [onComplete]);

  const panelStyle = {
    background: 'var(--surface, #100B20)',
  };

  return (
    <div ref={wrapRef} className="fixed inset-0 z-[10000] overflow-hidden" aria-hidden="true">

      {/* Top panel — studio name */}
      <div
        ref={topRef}
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-end pb-10"
        style={{ height: '50%', ...panelStyle }}
      >
        <p
          ref={nameRef}
          className="select-none text-center"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 'clamp(2.2rem, 7vw, 5.5rem)',
            letterSpacing: '-.01em',
            lineHeight: 1,
            color: 'var(--accent3, #EDE8E0)',
          }}
        >
          Vos Web Designs
        </p>
      </div>

      {/* Hairline divider between panels */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{ top: '50%', height: 1, background: 'rgba(200,168,106,.10)' }}
      />

      {/* Bottom panel — line progress + tagline */}
      <div
        ref={botRef}
        className="absolute inset-x-0 bottom-0 flex flex-col items-center pt-9"
        style={{ height: '50%', ...panelStyle }}
      >
        {/* Gold hairline — the loading line */}
        <div
          className="w-[min(400px,78vw)]"
          style={{ height: 1, background: 'rgba(200,168,106,.12)' }}
        >
          <div
            ref={lineRef}
            className="h-full origin-left"
            style={{ background: 'var(--accent, #C8A86A)' }}
          />
        </div>

        {/* Tagline */}
        <p
          ref={tagRef}
          className="mt-7 font-mono uppercase"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '.55rem',
            letterSpacing: '.38em',
            color: 'rgba(200,168,106,.40)',
          }}
        >
          Web Design Atelier · Nederland
        </p>
      </div>

    </div>
  );
};

export default Preloader;
