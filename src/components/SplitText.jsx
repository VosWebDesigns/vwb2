import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  children,
  type = 'words',
  animation = 'slide-up',
  delay = 0,
  stagger = 0.025,
  duration = 0.95,
  ease = 'power4.out',
  start = 'top 85%',
  className = '',
  style = {},
  as: Tag = 'div',
  onComplete,
}) => {
  const ref = useRef(null);
  const text = typeof children === 'string' ? children : '';

  const getTokens = () => {
    if (type === 'chars') {
      return text.split('').map((c, i) => ({ char: c === ' ' ? ' ' : c, key: i }));
    }
    if (type === 'words') {
      const words = text.split(' ');
      return words.map((w, i) => ({ char: w + (i < words.length - 1 ? ' ' : ''), key: i }));
    }
    return [{ char: text, key: 0 }];
  };

  const tokens = getTokens();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll('.split-unit');
    if (!spans.length) return;

    const ctx = gsap.context(() => {
      if (animation === 'slide-up') {
        gsap.fromTo(spans,
          { y: 70, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration, ease, stagger, delay,
            onComplete,
            scrollTrigger: { trigger: el, start },
          }
        );
      } else if (animation === 'clip') {
        gsap.fromTo(spans,
          { yPercent: 120 },
          {
            yPercent: 0,
            duration, ease, stagger, delay,
            onComplete,
            scrollTrigger: { trigger: el, start },
          }
        );
      } else if (animation === 'scale') {
        gsap.fromTo(spans,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration,
            ease: 'back.out(1.7)',
            stagger,
            delay,
            onComplete,
            scrollTrigger: { trigger: el, start },
          }
        );
      } else if (animation === 'fade') {
        gsap.fromTo(spans,
          { opacity: 0 },
          {
            opacity: 1,
            duration,
            ease,
            stagger,
            delay,
            onComplete,
            scrollTrigger: { trigger: el, start },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [animation, delay, duration, ease, start, stagger, onComplete]);

  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {tokens.map(({ char, key }) =>
        animation === 'clip' ? (
          <span
            key={key}
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
          >
            <span className="split-unit" style={{ display: 'inline-block' }}>
              {char}
            </span>
          </span>
        ) : (
          <span key={key} className="split-unit" style={{ display: 'inline-block' }}>
            {char}
          </span>
        )
      )}
    </Tag>
  );
};

export default SplitText;
