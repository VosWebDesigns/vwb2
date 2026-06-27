import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Cursor = () => {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const labelRef = useRef(null);
  const pos      = useRef({ x: -300, y: -300 });
  const target   = useRef({ x: -300, y: -300 });
  const [visible, setVisible] = useState(false);
  const [label, setLabel]     = useState('');

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const lbl   = labelRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor');

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.10;
      pos.current.y += (target.current.y - pos.current.y) * 0.10;
      gsap.set(dot,  { x: target.current.x, y: target.current.y });
      gsap.set(ring, { x: pos.current.x,    y: pos.current.y    });
      if (lbl) gsap.set(lbl, { x: pos.current.x, y: pos.current.y });
    };
    gsap.ticker.add(tick);

    /* Over interactive elements */
    const onEnterInteractive = () => {
      gsap.to(ring, { scale: 2.2, opacity: 0.5, duration: 0.4, ease: 'power3.out' });
      gsap.to(dot,  { scale: 0.2, duration: 0.3 });
    };
    const onLeaveInteractive = () => {
      gsap.to(ring, { scale: 1, opacity: 0.55, duration: 0.4, ease: 'power3.out' });
      gsap.to(dot,  { scale: 1, duration: 0.3 });
    };

    /* View/drag context cursors */
    const onEnterView = (e) => {
      const cursorLabel = e.currentTarget.dataset.cursor || 'VIEW';
      setLabel(cursorLabel);
      gsap.to(ring, { scale: 3.2, opacity: 0.18, duration: 0.4, ease: 'power3.out', borderColor: 'rgba(201,169,110,.35)' });
      gsap.to(dot,  { scale: 0, duration: 0.2 });
      if (lbl) gsap.to(lbl, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' });
    };
    const onLeaveView = () => {
      setLabel('');
      gsap.to(ring, { scale: 1, opacity: 0.55, duration: 0.5, ease: 'power3.out' });
      gsap.to(dot,  { scale: 1, duration: 0.3 });
      if (lbl) gsap.to(lbl, { opacity: 0, scale: 0.7, duration: 0.25 });
    };

    const hide = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const show = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    /* Magnetic elements */
    const handleMagneticMove = (e) => {
      const el   = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      gsap.to(el, {
        x: dx * 0.38,
        y: dy * 0.38,
        duration: 0.5,
        ease: 'power3.out',
      });
    };
    const handleMagneticLeave = (e) => {
      gsap.to(e.currentTarget, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    const attach = () => {
      document.querySelectorAll('a, button, [role="button"], label, input, textarea, select').forEach((el) => {
        if (el.dataset.cursor) {
          el.addEventListener('mouseenter', onEnterView);
          el.addEventListener('mouseleave', onLeaveView);
        } else {
          el.addEventListener('mouseenter', onEnterInteractive);
          el.addEventListener('mouseleave', onLeaveInteractive);
        }
      });

      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        el.addEventListener('mousemove',  handleMagneticMove);
        el.addEventListener('mouseleave', handleMagneticLeave);
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', hide);
    window.addEventListener('mouseenter', show);

    attach();

    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', hide);
      window.removeEventListener('mouseenter', show);
      gsap.ticker.remove(tick);
      observer.disconnect();
      document.body.classList.remove('custom-cursor');
    };
  }, [visible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <div style={{ opacity: visible ? 1 : 0 }} className="transition-opacity duration-300">
      {/* Inner dot — instant */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 5, height: 5, background: 'var(--accent)' }}
      />
      {/* Outer ring — lerp */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 34,
          height: 34,
          border: '1px solid rgba(201,169,110,.55)',
          mixBlendMode: 'difference',
        }}
      />
      {/* Context label */}
      {label && (
        <div
          ref={labelRef}
          className="pointer-events-none fixed left-0 top-0 z-[10000] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.55rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            opacity: label ? 1 : 0,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

export default Cursor;
