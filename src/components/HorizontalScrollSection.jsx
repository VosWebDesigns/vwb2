import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HorizontalScrollSection = ({
  children,
  className = '',
  trackClassName = '',
  label = '',
  scrub = 1.4,
  paddingLeft = '5vw',
  paddingRight = '5vw',
}) => {
  const wrapRef  = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const getScrollAmount = () => {
      const trackW = track.scrollWidth;
      const wrapW  = wrap.clientWidth;
      return -(trackW - wrapW);
    };

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          pin: true,
          scrub,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, [scrub]);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
    >
      {label && (
        <div
          className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          aria-hidden="true"
        >
          <span
            className="font-mono text-[.6rem] uppercase tracking-[.42em]"
            style={{ color: 'rgba(201,169,110,.24)' }}
          >
            {label}
          </span>
        </div>
      )}

      <div
        ref={trackRef}
        className={`flex will-change-transform h-scroll-track ${trackClassName}`}
        style={{ paddingLeft, paddingRight }}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScrollSection;
