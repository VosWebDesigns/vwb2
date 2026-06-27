import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '@/hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  // Synchronous reset before browser paints — hides the scroll jump
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  // Sync Lenis internal state + refresh all ScrollTrigger positions
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });

    // Clear GSAP's scroll memory so pinned sections start fresh
    ScrollTrigger.clearScrollMemory();

    // Refresh after new page's ScrollTriggers have registered
    const id = setTimeout(() => ScrollTrigger.refresh(true), 120);
    return () => clearTimeout(id);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
