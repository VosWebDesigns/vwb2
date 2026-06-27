import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const PageTransition = () => {
  const { pathname } = useLocation();
  const overlayRef   = useRef(null);
  const isFirst      = useRef(true);

  useEffect(() => {
    // Skip on initial page load — Preloader already handles the entrance
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const overlay = overlayRef.current;
    if (!overlay) return;

    // Phase 1: curtain slides DOWN, covering the screen (0.28s)
    // This hides the scroll-position jump from the user
    gsap.fromTo(overlay,
      { clipPath: 'inset(0 0 100% 0)', pointerEvents: 'none' },
      {
        clipPath: 'inset(0 0 0% 0)',
        pointerEvents: 'all',
        duration: 0.28,
        ease: 'power3.inOut',
        onComplete: () => {
          // Phase 2: curtain wipes upward, revealing new page (0.48s)
          gsap.to(overlay, {
            clipPath: 'inset(100% 0 0 0)',
            duration: 0.48,
            ease: 'power3.inOut',
            delay: 0.04,
            onComplete: () => {
              if (overlay) overlay.style.pointerEvents = 'none';
            },
          });
        },
      }
    );
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#03030a',
        zIndex: 9998,
        clipPath: 'inset(100% 0 0 0)',
        pointerEvents: 'none',
        willChange: 'clip-path',
      }}
    />
  );
};

export default PageTransition;
