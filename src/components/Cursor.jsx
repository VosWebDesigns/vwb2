import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Cursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -200, y: -200 });
  const target  = useRef({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
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
    };
    gsap.ticker.add(tick);

    const expand = () => {
      gsap.to(ring, { scale: 2.8, opacity: 0.55, duration: 0.45, ease: 'power3.out' });
      gsap.to(dot,  { scale: 0.3, duration: 0.3 });
    };
    const contract = () => {
      gsap.to(ring, { scale: 1, opacity: 0.45, duration: 0.45, ease: 'power3.out' });
      gsap.to(dot,  { scale: 1, duration: 0.3 });
    };
    const hide = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const show = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    const attachListeners = () => {
      document.querySelectorAll('a, button, [role="button"], label, input, textarea, select').forEach((el) => {
        el.addEventListener('mouseenter', expand);
        el.addEventListener('mouseleave', contract);
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', hide);
    window.addEventListener('mouseenter', show);

    attachListeners();

    const observer = new MutationObserver(attachListeners);
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
      {/* Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 6, height: 6, background: 'var(--accent)' }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 36,
          height: 36,
          border: '1px solid rgba(204,255,0,.42)',
          mixBlendMode: 'difference',
        }}
      />
    </div>
  );
};

export default Cursor;
