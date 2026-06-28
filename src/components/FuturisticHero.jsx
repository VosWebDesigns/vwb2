import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';

/* Faux browser-window card for the right column */
const BrowserCard = ({ project, index, cardRef, accentColor = 'rgba(200,168,106,.06)' }) => {
  const img   = project?.featured_preview_image || project?.hero_image;
  const label = ['Web Experience', '3D Interface', 'Motion Design'][index] || 'Digital';

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-xl"
      style={{ border: '1px solid rgba(200,168,106,.10)', background: 'rgba(16,11,32,.75)' }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-1.5 px-3 py-2.5"
        style={{ borderBottom: '1px solid rgba(200,168,106,.07)', background: 'rgba(8,5,15,.80)' }}
      >
        <div className="h-2 w-2 rounded-full" style={{ background: 'rgba(124,92,191,.50)' }} />
        <div className="h-2 w-2 rounded-full" style={{ background: 'rgba(200,168,106,.25)' }} />
        <div className="h-2 w-2 rounded-full" style={{ background: 'rgba(200,168,106,.12)' }} />
        <div
          className="ml-2.5 h-3.5 flex-1 max-w-[130px] rounded-sm flex items-center px-2"
          style={{ background: 'rgba(200,168,106,.04)', border: '1px solid rgba(200,168,106,.08)' }}
        >
          <span className="font-mono text-[.38rem] uppercase tracking-widest truncate" style={{ color: 'rgba(200,168,106,.22)' }}>
            {project?.live_url || 'voswebdesigns.nl'}
          </span>
        </div>
      </div>

      {/* Image / placeholder */}
      <div className="relative aspect-video overflow-hidden">
        {img ? (
          <SmartImage
            src={img}
            alt={project?.title || label}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center"
            style={{ background: `radial-gradient(ellipse at 35% 40%, ${accentColor}, rgba(8,5,15,.97))` }}
          >
            <span className="font-mono text-[.48rem] uppercase tracking-[.28em]" style={{ color: 'rgba(200,168,106,.18)' }}>
              {label}
            </span>
          </div>
        )}
        {/* Overlay bar */}
        {project?.title && (
          <div className="absolute inset-x-0 bottom-0 px-3 py-2" style={{ background: 'linear-gradient(to top, rgba(8,5,15,.85), transparent)' }}>
            <p className="font-mono text-[.46rem] uppercase tracking-[.16em] truncate" style={{ color: 'rgba(200,168,106,.50)' }}>
              {project.title}
            </p>
          </div>
        )}
      </div>

      {/* Footer chrome */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderTop: '1px solid rgba(200,168,106,.06)', background: 'rgba(8,5,15,.50)' }}
      >
        <span className="font-mono text-[.45rem] uppercase tracking-[.18em]" style={{ color: 'rgba(200,168,106,.28)' }}>
          0{index + 1} — {project?.categories?.name || label}
        </span>
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 5px rgba(200,168,106,.50)' }} />
      </div>
    </div>
  );
};

const FuturisticHero = ({ projects = [] }) => {
  const secRef   = useRef(null);
  const topRef   = useRef(null);
  const leftRef  = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const labelRef = useRef(null);
  const botRef   = useRef(null);
  const rightRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const pillRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(topRef.current,  { opacity: 0, y: 14 });
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110, opacity: 0 });
      gsap.set(labelRef.current, { opacity: 0, y: 10 });
      gsap.set(botRef.current,  { opacity: 0, y: 14 });
      gsap.set(card1Ref.current, { opacity: 0, x: 50 });
      gsap.set(card2Ref.current, { opacity: 0, x: 50 });
      gsap.set(card3Ref.current, { opacity: 0, x: 50 });
      gsap.set(pillRef.current, { opacity: 0, y: 10 });

      const silk = 'cubic-bezier(0.22, 1, 0.36, 1)';
      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: silk } });

      tl.to(topRef.current,  { opacity: 1, y: 0, duration: 0.9 })
        .to(line1Ref.current, { yPercent: 0, opacity: 1, duration: 1.2 }, '-=0.40')
        .to(line2Ref.current, { yPercent: 0, opacity: 1, duration: 1.2 }, '-=0.90')
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
        .to(card1Ref.current, { opacity: 1, x: 0, duration: 1.0 }, '-=0.75')
        .to(card2Ref.current, { opacity: 1, x: 0, duration: 1.0 }, '-=0.85')
        .to(card3Ref.current, { opacity: 1, x: 0, duration: 1.0 }, '-=0.85')
        .to(pillRef.current,  { opacity: 1, y: 0, duration: 0.7 }, '-=0.60')
        .to(botRef.current,   { opacity: 1, y: 0, duration: 0.8 }, '-=0.60');

      // Differential parallax on scroll
      const onScroll = () => {
        const y = window.scrollY;
        gsap.set(leftRef.current,  { y: y * -0.14 });
        gsap.set(rightRef.current, { y: y * -0.06 });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, secRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} className="relative flex h-[100svh] overflow-hidden">

      {/* Architectural gold grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(200,168,106,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,106,.018) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black, transparent)',
        }}
        aria-hidden="true"
      />

      {/* Atmospheric glows — violet left, faint gold right */}
      <div className="pointer-events-none absolute left-0 top-0 h-[70vh] w-[60vw]"
        style={{ background: 'radial-gradient(ellipse at 12% 10%, rgba(124,92,191,.14) 0%, transparent 55%)' }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[50vh] w-[50vw]"
        style={{ background: 'radial-gradient(ellipse at 85% 90%, rgba(200,168,106,.06) 0%, transparent 55%)' }}
        aria-hidden="true"
      />

      {/* ── LEFT: editorial headline column ── */}
      <div
        ref={leftRef}
        className="relative z-10 flex flex-col justify-between w-full lg:w-[55%] px-5 pt-6 pb-8 md:px-10 md:pt-8 md:pb-10 lg:px-14"
        style={{ borderRight: '1px solid rgba(200,168,106,.06)' }}
      >
        {/* HUD top bar */}
        <div ref={topRef} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="status-dot" />
            <span className="font-mono text-[9px] uppercase tracking-[.42em]" style={{ color: 'rgba(200,168,106,.45)' }}>
              Studio — beschikbaar
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[.42em]" style={{ color: 'rgba(200,168,106,.25)' }}>
            NL · Est. 2019
          </span>
        </div>

        {/* Headline: "Op maat" (Cormorant italic, cream) + "gebouwd." (Space Grotesk, gold) */}
        <div className="select-none">
          <div className="overflow-hidden">
            <div
              ref={line1Ref}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 'clamp(5rem, 16vw, 17rem)',
                letterSpacing: '-.03em',
                lineHeight: 0.88,
                color: 'var(--accent3)',
              }}
            >
              Op maat
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              ref={line2Ref}
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(3.2rem, 9.5vw, 10rem)',
                letterSpacing: '-.07em',
                lineHeight: 0.90,
                color: 'var(--accent)',
              }}
            >
              gebouwd.
            </div>
          </div>
          <p
            ref={labelRef}
            className="mt-5 font-mono uppercase tracking-[.36em]"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(.55rem, .9vw, .78rem)',
              color: 'rgba(200,168,106,.28)',
            }}
          >
            Web Design Atelier · Nederland
          </p>
        </div>

        {/* Bottom bar: scroll cue + CTAs */}
        <div ref={botRef} className="flex items-end justify-between">
          {/* Scroll cue */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(200,168,106,.40))' }} />
            <span className="font-mono text-[7px] uppercase tracking-[.50em] rotate-90 origin-bottom" style={{ color: 'rgba(200,168,106,.25)' }}>
              Scroll
            </span>
          </div>

          {/* CTAs + mobile stats */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-5 lg:hidden">
              <div className="text-right">
                <span className="font-mono text-[.68rem] block" style={{ color: 'var(--accent)' }}>48u</span>
                <span className="font-mono text-[.45rem] uppercase tracking-[.18em]" style={{ color: 'rgba(200,168,106,.22)' }}>gemiddeld design</span>
              </div>
              <div className="h-4 w-px" style={{ background: 'rgba(200,168,106,.10)' }} />
              <div className="text-right">
                <span className="font-mono text-[.68rem] block" style={{ color: 'var(--accent)' }}>99%</span>
                <span className="font-mono text-[.45rem] uppercase tracking-[.18em]" style={{ color: 'rgba(200,168,106,.22)' }}>klanttevredenheid</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/contact" className="glow-button" data-magnetic>
                Start project <ArrowRight size={14} />
              </Link>
              <Link to="/portfolio" className="ghost-button hidden md:inline-flex" data-magnetic>
                Ons werk
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: project preview stack (desktop only) ── */}
      <div
        ref={rightRef}
        className="relative z-10 hidden lg:flex flex-col justify-center gap-3 w-[45%] px-10 pb-10 pt-24 overflow-hidden"
      >
        <BrowserCard project={projects[0]} index={0} cardRef={card1Ref} accentColor="rgba(200,168,106,.10)" />
        <BrowserCard project={projects[1]} index={1} cardRef={card2Ref} accentColor="rgba(124,92,191,.10)" />
        <BrowserCard project={projects[2]} index={2} cardRef={card3Ref} accentColor="rgba(200,168,106,.06)" />

        {/* Availability pill */}
        <div ref={pillRef} className="inline-flex items-center gap-2.5 mt-1">
          <span className="status-dot" />
          <span className="font-mono text-[.56rem] uppercase tracking-[.22em]" style={{ color: 'rgba(200,168,106,.36)' }}>
            1 plek beschikbaar — Q3 2025
          </span>
        </div>
      </div>
    </section>
  );
};

export default FuturisticHero;
