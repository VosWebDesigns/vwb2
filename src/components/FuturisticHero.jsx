import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';

const FLOATING_TAGS = [
  { label: 'Three.js / WebGL', x: '8%', y: '28%', delay: 0.2 },
  { label: 'GSAP Animations', x: '78%', y: '22%', delay: 0.4 },
  { label: 'React 18', x: '12%', y: '68%', delay: 0.6 },
  { label: 'Supabase Backend', x: '72%', y: '72%', delay: 0.8 },
];

const FuturisticHero = () => {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const tagsRef = useRef([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(badgeRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      .fromTo(headlineRef.current.querySelectorAll('.word'),
        { opacity: 0, y: 60, rotateX: 30 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.08 },
        '-=0.2'
      )
      .fromTo(subRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4'
      )
      .fromTo(ctaRef.current.children,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
        '-=0.4'
      )
      .fromTo(tagsRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12 },
        '-=0.3'
      )
      .fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.2'
      );

      gsap.to(scrollRef.current, {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'sine.inOut',
        delay: 1.5,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const words = ['Web Design', 'van de', 'Toekomst'];

  return (
    <section ref={containerRef} className="relative min-h-[100svh] overflow-hidden flex flex-col items-center justify-center px-5 pt-24 pb-16 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,.18),transparent)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(214,245,122,.06),transparent)]" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(140,214,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(140,214,255,.06)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" aria-hidden="true" />

      {FLOATING_TAGS.map((tag, i) => (
        <div
          key={tag.label}
          ref={(el) => (tagsRef.current[i] = el)}
          className="absolute hidden lg:flex items-center gap-2 rounded-full border border-[rgba(140,214,255,.22)] bg-[rgba(12,22,40,.82)] px-3 py-1.5 text-[11px] font-mono uppercase tracking-[.2em] text-[var(--accent)] backdrop-blur-md"
          style={{ left: tag.x, top: tag.y }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
          {tag.label}
        </div>
      ))}

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div ref={badgeRef} className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(140,214,255,.2)] bg-[rgba(12,22,40,.75)] px-4 py-2 text-xs font-mono uppercase tracking-[.28em] text-[var(--accent)] backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent2)]" />
          Studio Vos Web Designs — 2025
        </div>

        <h1
          ref={headlineRef}
          className="font-heading text-[clamp(3.8rem,11vw,10rem)] font-black leading-[.82] tracking-[-.06em] text-white [perspective:600px]"
          aria-label={words.join(' ')}
        >
          {words.map((w) => (
            <span key={w} className="word block">{w}</span>
          ))}
        </h1>

        <p ref={subRef} className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
          Wij bouwen digitale ervaringen die indruk maken — met realtime 3D, cinematische animaties en interfaces die aanvoelen als de toekomst. Geen templates. Geen compromissen.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-black uppercase tracking-[.12em] text-[#020810] transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(140,214,255,.4)]"
          >
            Bekijk ons werk
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 rounded-full border border-[rgba(140,214,255,.28)] bg-[rgba(12,22,40,.7)] px-7 py-3.5 text-sm font-black uppercase tracking-[.12em] text-white backdrop-blur-md transition-all duration-300 hover:border-[var(--accent)] hover:bg-[rgba(140,214,255,.08)]"
          >
            Start een project
          </Link>
        </div>
      </div>

      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--accent)] opacity-60">
        <span className="font-mono text-[10px] uppercase tracking-[.3em]">Scroll</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
};

export default FuturisticHero;
