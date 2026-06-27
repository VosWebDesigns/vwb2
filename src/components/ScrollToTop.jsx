import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '@/hooks/useLenis';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // scroll only on path/search change; ignore hash-only updates
    const lenis = getLenis();
    if (lenis) {
      // Keep Lenis' internal position in sync; native scrollTo alone desyncs it.
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
