import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Preloader = ({ onComplete }) => {
  const ref      = useRef(null);
  const barRef   = useRef(null);
  const numRef   = useRef(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el  = ref.current;
    const bar = barRef.current;
    const num = numRef.current;
    if (!el || !bar || !num) return;

    const obj = { n: 0 };
    const tl  = gsap.timeline({
      onComplete: () => {
        gsap.to(el, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          delay: 0.15,
          onComplete,
        });
      },
    });

    tl.to(obj, {
      n: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate() {
        const v = Math.round(obj.n);
        setPct(v);
        if (num) num.textContent = String(v).padStart(3, '0');
        if (bar) bar.style.transform = `scaleX(${v / 100})`;
      },
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{ background: '#06060c' }}
    >
      {/* Brand mark */}
      <p
        className="font-heading font-black uppercase tracking-[.35em] text-[var(--accent3)]"
        style={{ fontSize: 'clamp(1rem, 3vw, 1.6rem)' }}
      >
        Vos Web Designs
      </p>

      {/* Progress number */}
      <p
        ref={numRef}
        className="mt-10 font-mono text-[var(--accent)] tabular-nums"
        style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', letterSpacing: '-.04em', lineHeight: 1 }}
      >
        000
      </p>

      {/* Bar */}
      <div
        className="mt-10 w-[min(400px,80vw)] overflow-hidden"
        style={{ height: 1, background: 'rgba(201,169,110,.15)' }}
      >
        <div
          ref={barRef}
          className="h-full origin-left"
          style={{ background: 'linear-gradient(to right, var(--accent), var(--accent2))', transform: 'scaleX(0)' }}
        />
      </div>

      {/* Sub */}
      <p
        className="mt-5 font-mono text-[.6rem] uppercase tracking-[.4em]"
        style={{ color: 'rgba(201,169,110,.3)' }}
      >
        Premium web studio
      </p>
    </div>
  );
};

export default Preloader;
