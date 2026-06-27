import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic scroll reveal for any subtree.
 * Animates every `[data-reveal]` descendant into view with a staggered,
 * Apple/Linear-style ease. Pass `deps` (e.g. loading flags) so reveals
 * re-bind after async content renders.
 */
export function useReveal(ref, deps = []) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const items = root.querySelectorAll('[data-reveal]');
    if (!items.length) return undefined;

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        const delay = parseFloat(item.getAttribute('data-reveal-delay') || '0');
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 88%' },
          }
        );
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
