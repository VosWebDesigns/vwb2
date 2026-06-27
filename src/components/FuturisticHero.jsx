import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';

const FLOATING_TAGS = [
  { label: 'Three.js / WebGL', x: '7%',  y: '30%', depth: 0.8 },
  { label: 'GSAP Animations',  x: '74%', y: '24%', depth: 0.5 },
  { label: 'React 18',         x: '10%', y: '66%', depth: 1.0 },
  { label: 'Supabase Backend', x: '70%', y: '68%', depth: 0.6 },
  { label: 'Tailwind CSS',     x: '44%', y: '82%', depth: 0.4 },
];

const FuturisticHero = () => {
  const containerRef = useRef(null);
  const headlineRef  = useRef(null);
  const subRef       = useRef(null);
  const ctaRef       = useRef(null);
  const badgeRef     = useRef(null);
  const tagsRef      = useRef([]);
  const scrollRef    = useRef(null);
  const orbitRef     = useRef(null);
  const scanRef      = useRef(null);
  const coordRef     = useRef(null);

  /* ── Entrance animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(badgeRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 }
      )
      .fromTo(headlineRef.current.querySelectorAll('.word'),
        { opacity: 0, y: 70, rotateX: 35 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.95, stagger: 0.09 },
        '-=0.25'
      )
      .fromTo(subRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75 },
        '-=0.45'
      )
      .fromTo(ctaRef.current.children,
        { opacity: 0, y: 22, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.12 },
        '-=0.45'
      )
      .fromTo(tagsRef.current.filter(Boolean),
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.55, stagger: 0.1 },
        '-=0.35'
      )
      .fromTo([scrollRef.current, orbitRef.current, coordRef.current].filter(Boolean),
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.2'
      );

      /* Scroll indicator bounce */
      gsap.to(scrollRef.current, {
        y: 9,
        repeat: -1,
        yoyo: true,
        duration: 1.3,
        ease: 'sine.inOut',
        delay: 1.8,
      });

      /* Orbit ring slow spin */
      gsap.to(orbitRef.current, {
        rotation: 360,
        transformOrigin: '50% 50%',
        repeat: -1,
        duration: 22,
        ease: 'none',
      });

      /* Scanline sweep */
      if (scanRef.current) {
        gsap.fromTo(
          scanRef.current,
          { y: '-100%', opacity: 0 },
          { y: '100%', opacity: 0.4, duration: 3.5, repeat: -1, ease: 'none', delay: 2 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ── Mouse parallax on floating tags ── */
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      tagsRef.current.forEach((tag, i) => {
        if (!tag) return;
        const depth = FLOATING_TAGS[i]?.depth ?? 0.5;
        gsap.to(tag, {
          x: cx * depth * 22,
          y: cy * depth * 16,
          duration: 1.0,
          ease: 'power2.out',
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const words = ['Web Design', 'van de', 'Toekomst'];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden flex flex-col items-center justify-center px-5 pt-24 pb-16 md:px-10"
    >
      {/* Scan line sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          ref={scanRef}
          className="absolute left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(140,214,255,.5), transparent)' }}
        />
      </div>

      {/* Radial glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_-8%,rgba(14,165,233,.2),transparent)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_45%_at_18%_80%,rgba(214,245,122,.07),transparent)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_82%_85%,rgba(44,82,130,.12),transparent)]" aria-hidden="true" />

      {/* Sci-fi grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(140,214,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(140,214,255,.055) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 78%)',
        }}
        aria-hidden="true"
      />

      {/* Corner brackets */}
      <div className="pointer-events-none absolute left-6 top-28 hidden lg:block" aria-hidden="true">
        <div className="h-5 w-5 border-l border-t border-[rgba(140,214,255,.35)]" />
      </div>
      <div className="pointer-events-none absolute right-6 top-28 hidden lg:block" aria-hidden="true">
        <div className="h-5 w-5 border-r border-t border-[rgba(214,245,122,.35)]" />
      </div>
      <div className="pointer-events-none absolute bottom-20 left-6 hidden lg:block" aria-hidden="true">
        <div className="h-5 w-5 border-b border-l border-[rgba(140,214,255,.25)]" />
      </div>
      <div className="pointer-events-none absolute bottom-20 right-6 hidden lg:block" aria-hidden="true">
        <div className="h-5 w-5 border-b border-r border-[rgba(214,245,122,.25)]" />
      </div>

      {/* Floating technology tags */}
      {FLOATING_TAGS.map((tag, i) => (
        <div
          key={tag.label}
          ref={(el) => (tagsRef.current[i] = el)}
          className="absolute hidden lg:flex items-center gap-2 rounded-full border border-[rgba(140,214,255,.22)] bg-[rgba(10,18,34,.84)] px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[.2em] text-[var(--accent)] backdrop-blur-md shadow-[0_0_20px_rgba(140,214,255,.08)]"
          style={{ left: tag.x, top: tag.y }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent2)] shadow-[0_0_6px_rgba(214,245,122,.8)]" />
          {tag.label}
        </div>
      ))}

      {/* Decorative orbit ring */}
      <div
        ref={orbitRef}
        className="pointer-events-none absolute hidden xl:block"
        style={{ right: '8%', top: '20%', width: '200px', height: '200px' }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="100" cy="100" rx="95" ry="38" stroke="rgba(140,214,255,.15)" strokeWidth="1" strokeDasharray="4 6" />
          <ellipse cx="100" cy="100" rx="95" ry="38" transform="rotate(60 100 100)" stroke="rgba(214,245,122,.1)" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="100" cy="62" r="4" fill="rgba(140,214,255,.7)" />
          <circle cx="190" cy="114" r="3" fill="rgba(214,245,122,.6)" />
        </svg>
      </div>

      {/* Coordinate display */}
      <div
        ref={coordRef}
        className="pointer-events-none absolute left-6 bottom-28 hidden xl:flex flex-col gap-1"
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] uppercase tracking-[.28em] text-[rgba(140,214,255,.3)]">52°22'N  4°54'E</span>
        <span className="font-mono text-[10px] uppercase tracking-[.28em] text-[rgba(140,214,255,.3)]">Studio NL — 2025</span>
      </div>

      {/* Main hero content */}
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div
          ref={badgeRef}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[rgba(140,214,255,.2)] bg-[rgba(10,18,34,.78)] px-4 py-2 text-xs font-mono uppercase tracking-[.28em] text-[var(--accent)] backdrop-blur-md shadow-[0_0_24px_rgba(140,214,255,.1)]"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent2)] shadow-[0_0_8px_rgba(214,245,122,.8)]" />
          Studio Vos Web Designs — 2025
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(140,214,255,.8)]" style={{ animationDelay: '0.5s' }} />
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
            className="group inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-black uppercase tracking-[.12em] text-[#020810] transition-all duration-300 hover:bg-white hover:shadow-[0_0_50px_rgba(140,214,255,.5)]"
          >
            Bekijk ons werk
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 rounded-full border border-[rgba(140,214,255,.3)] bg-[rgba(10,18,34,.72)] px-7 py-3.5 text-sm font-black uppercase tracking-[.12em] text-white backdrop-blur-md transition-all duration-300 hover:border-[var(--accent)] hover:bg-[rgba(140,214,255,.1)] hover:shadow-[0_0_30px_rgba(140,214,255,.15)]"
          >
            Start een project
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mx-auto mt-14 hidden max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[rgba(140,214,255,.1)] bg-[rgba(140,214,255,.08)] sm:grid">
          {[
            ['48u', 'Avg. design doorlooptijd'],
            ['3×', 'Meer conversies vs templates'],
            ['<2s', 'Gemiddelde laadtijd'],
          ].map(([val, label]) => (
            <div key={label} className="bg-[rgba(5,11,20,.82)] px-5 py-4 text-center backdrop-blur-sm">
              <p className="font-heading text-xl font-black text-[var(--accent)]">{val}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.18em] text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--accent)] opacity-60"
      >
        <span className="font-mono text-[10px] uppercase tracking-[.3em]">Scroll</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
};

export default FuturisticHero;
