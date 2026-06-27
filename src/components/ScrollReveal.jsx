import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  className = '',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  duration = 0.8,
  ease = 'power3.out',
  delay = 0,
  stagger = 0,
  start = 'top 85%',
  once = true,
  tag: Tag = 'div',
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? el.children : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, from, {
        ...to,
        duration,
        ease,
        delay,
        stagger: stagger || 0,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once ? 'play none none none' : 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, [from, to, duration, ease, delay, stagger, start, once]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

export default ScrollReveal;
