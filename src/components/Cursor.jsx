import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MAGNETIC_SEL = '.glow-button, .ghost-button, [data-magnetic]';

const Cursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const lblRef  = useRef(null);
  const state   = useRef('default');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    const lbl  = lblRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor');
    gsap.set([dot, ring], { opacity: 0 });

    // High-performance quickTo targets
    const rxTo = gsap.quickTo(ring, 'x', { duration: 0.50, ease: 'power3.out' });
    const ryTo = gsap.quickTo(ring, 'y', { duration: 0.50, ease: 'power3.out' });
    const dxTo = gsap.quickTo(dot,  'x', { duration: 0.06, ease: 'none' });
    const dyTo = gsap.quickTo(dot,  'y', { duration: 0.06, ease: 'none' });

    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      gsap.to(dot,  { opacity: 1, duration: 0.4 });
      gsap.to(ring, { opacity: state.current === 'default' ? 0.6 : 1, duration: 0.4 });
    };

    const onMove = (e) => {
      const mx = e.clientX, my = e.clientY;
      dxTo(mx); dyTo(my);
      rxTo(mx); ryTo(my);
      reveal();

      // Magnetic pull on buttons
      document.querySelectorAll(MAGNETIC_SEL).forEach((el) => {
        const r  = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d  = Math.hypot(mx - cx, my - cy);
        if (d < 90) {
          const s = (1 - d / 90) * 0.38;
          gsap.to(el, { x: (mx - cx) * s, y: (my - cy) * s, duration: 0.4, ease: 'power2.out', overwrite: true });
        } else {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)', overwrite: true });
        }
      });
    };

    // State machine
    const toDefault = () => {
      if (state.current === 'default') return;
      state.current = 'default';
      gsap.to(ring, { width: 36, height: 36, background: 'transparent', borderColor: 'rgba(200,168,106,.50)', opacity: 0.6, duration: 0.4, ease: 'power3.out' });
      gsap.to(dot,  { scale: 1, opacity: 1, duration: 0.3 });
      if (lbl) gsap.to(lbl, { opacity: 0, duration: 0.2 });
    };

    const toHover = () => {
      if (state.current === 'hover') return;
      state.current = 'hover';
      gsap.to(ring, { width: 54, height: 54, background: 'rgba(200,168,106,.08)', borderColor: 'rgba(200,168,106,.55)', opacity: 1, duration: 0.35, ease: 'power3.out' });
      gsap.to(dot,  { scale: 0, opacity: 0, duration: 0.25 });
    };

    const toView = (text) => {
      state.current = 'view';
      gsap.to(ring, { width: 86, height: 86, background: 'var(--accent)', borderColor: 'var(--accent)', opacity: 1, duration: 0.5, ease: 'power3.out' });
      gsap.to(dot,  { scale: 0, opacity: 0, duration: 0.2 });
      if (lbl) {
        lbl.textContent = text || 'BEKIJK';
        gsap.to(lbl, { opacity: 1, duration: 0.3, delay: 0.1 });
      }
    };

    // Event delegation — no duplicate listeners, handles dynamic DOM
    const onOver = (e) => {
      const viewEl = e.target.closest('[data-cursor="view"]');
      if (viewEl) { toView(viewEl.dataset.cursorLabel); return; }
      const hoverEl = e.target.closest('a, button, [role="button"], label, select, input, textarea');
      if (hoverEl) toHover();
    };

    const onOut = (e) => {
      const el = e.target.closest('a, button, [role="button"], label, select, input, textarea, [data-cursor="view"]');
      if (el && !el.contains(e.relatedTarget)) toDefault();
    };

    const onLeave = () => { if (revealed) gsap.to([dot, ring], { opacity: 0, duration: 0.3 }); };
    const onEnter = () => { if (revealed) gsap.to([dot, ring], { opacity: state.current === 'default' ? 0.6 : 1, duration: 0.3 }); };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
      document.body.classList.remove('custom-cursor');
      document.querySelectorAll(MAGNETIC_SEL).forEach((el) => gsap.set(el, { x: 0, y: 0 }));
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      {/* Dot — snaps instantly to mouse */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 5, height: 5, background: 'var(--accent)' }}
      />
      {/* Ring — lags behind with spring, shows hover/view states */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center overflow-hidden"
        style={{ width: 36, height: 36, border: '1px solid rgba(200,168,106,.50)' }}
      >
        <span
          ref={lblRef}
          aria-hidden="true"
          className="pointer-events-none select-none font-mono font-bold text-[.42rem] uppercase tracking-[.16em]"
          style={{ color: '#060608', opacity: 0, whiteSpace: 'nowrap' }}
        />
      </div>
    </>
  );
};

export default Cursor;
