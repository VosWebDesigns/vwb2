import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';

/* Faux browser-window card for the right column */
const BrowserCard = ({ project, index, cardRef, rotation, accentColor = 'rgba(204,255,0,.08)' }) => {
  const img = project?.featured_preview_image || project?.hero_image;
  const label = ['Web Experience', '3D Interface', 'Motion Design'][index] || 'Digital';

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-xl"
      style={{ border: '1px solid rgba(204,255,0,.08)', background: 'rgba(8,16,30,.65)' }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-1.5 px-3 py-2.5"
        style={{ borderBottom: '1px solid rgba(204,255,0,.06)', background: 'rgba(6,6,8,.80)' }}
      >
        <div className="h-2 w-2 rounded-full bg-[var(--accent2)] opacity-75" />
        <div className="h-2 w-2 rounded-full" style={{ background: 'rgba(204,255,0,.30)' }} />
        <div className="h-2 w-2 rounded-full" style={{ background: 'rgba(204,255,0,.14)' }} />
        <div
          className="ml-2.5 h-3.5 flex-1 max-w-[130px] rounded-sm flex items-center px-2"
          style={{ background: 'rgba(204,255,0,.04)', border: '1px solid rgba(204,255,0,.07)' }}
        >
          <span className="font-mono text-[.38rem] uppercase tracking-widest truncate" style={{ color: 'rgba(204,255,0,.20)' }}>
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
            style={{ background: `radial-gradient(ellipse at 35% 40%, ${accentColor}, rgba(6,6,8,.97))` }}
          >
            <span className="font-mono text-[.48rem] uppercase tracking-[.28em]" style={{ color: 'rgba(204,255,0,.18)' }}>
              {label}
            </span>
          </div>
        )}
        {/* Overlay bar */}
        {project?.title && (
          <div className="absolute inset-x-0 bottom-0 px-3 py-2" style={{ background: 'linear-gradient(to top, rgba(6,6,8,.85), transparent)' }}>
            <p className="font-mono text-[.46rem] uppercase tracking-[.16em] truncate" style={{ color: 'rgba(204,255,0,.50)' }}>
              {project.title}
            </p>
          </div>
        )}
      </div>

      {/* Footer chrome */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderTop: '1px solid rgba(204,255,0,.06)', background: 'rgba(6,6,8,.50)' }}
      >
        <span className="font-mono text-[.45rem] uppercase tracking-[.18em]" style={{ color: 'rgba(204,255,0,.25)' }}>
          0{index + 1} — {project?.categories?.name || label}
        </span>
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 5px var(--accent)' }} />
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
      // Set initial states
      gsap.set(topRef.current,  { opacity: 0, y: 14 });
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110, opacity: 0 });
      gsap.set(labelRef.current, { opacity: 0, y: 10 });
      gsap.set(botRef.current,  { opacity: 0, y: 14 });
      gsap.set(card1Ref.current, { opacity: 0, x: 50, rotation: -2 });
      gsap.set(card2Ref.current, { opacity: 0, x: 50, rotation: 0 });
      gsap.set(card3Ref.current, { opacity: 0, x: 50, rotation: 1.5 });
      gsap.set(pillRef.current, { opacity: 0, y: 10 });

      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'power4.out' } });

      tl.to(topRef.current,  { opacity: 1, y: 0, duration: 0.7 })
        .to(line1Ref.current, { yPercent: 0, opacity: 1, duration: 1.0 }, '-=0.25')
        .to(line2Ref.current, { yPercent: 0, opacity: 1, duration: 1.0 }, '-=0.80')
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.65 }, '-=0.45')
        .to(card1Ref.current, { opacity: 1, x: 0, duration: 0.95, ease: 'power3.out' }, '-=0.65')
        .to(card2Ref.current, { opacity: 1, x: 0, duration: 0.95, ease: 'power3.out' }, '-=0.78')
        .to(card3Ref.current, { opacity: 1, x: 0, duration: 0.95, ease: 'power3.out' }, '-=0.78')
        .to(pillRef.current,  { opacity: 1, y: 0, duration: 0.55 }, '-=0.50')
        .to(botRef.current,   { opacity: 1, y: 0, duration: 0.65 }, '-=0.50');

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

      {/* Architectural grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(204,255,0,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,.018) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black, transparent)',
        }}
        aria-hidden="true"
      />

      {/* Atmospheric glows */}
      <div className="pointer-events-none absolute left-0 top-0 h-[70vh] w-[60vw]"
        style={{ background: 'radial-gradient(ellipse at 12% 10%, rgba(204,255,0,.10) 0%, transparent 55%)' }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[50vh] w-[50vw]"
        style={{ background: 'radial-gradient(ellipse at 85% 90%, rgba(255,63,0,.07) 0%, transparent 55%)' }}
        aria-hidden="true"
      />

      {/* ── LEFT: editorial headline column ── */}
      <div
        ref={leftRef}
        className="relative z-10 flex flex-col justify-between w-full lg:w-[55%] px-5 pt-6 pb-8 md:px-10 md:pt-8 md:pb-10 lg:px-14"
        style={{ borderRight: '1px solid rgba(204,255,0,.06)' }}
      >
        {/* HUD top bar */}
        <div ref={topRef} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="status-dot" />
            <span className="font-mono text-[9px] uppercase tracking-[.42em]" style={{ color: 'rgba(204,255,0,.45)' }}>
              Studio — beschikbaar
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[.42em]" style={{ color: 'rgba(204,255,0,.25)' }}>
            NL · Est. 2019
          </span>
        </div>

        {/* MAAT / werk — split headline */}
        <div className="select-none" style={{ perspective: '1000px' }}>
          <div className="overflow-hidden">
            <div
              ref={line1Ref}
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(4.2rem, 15.5vw, 16.5rem)',
                letterSpacing: '-.07em',
                lineHeight: 0.86,
                color: 'var(--accent3)',
              }}
            >
              MAAT
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              ref={line2Ref}
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 'clamp(4.8rem, 17vw, 18rem)',
                letterSpacing: '-.03em',
                lineHeight: 0.86,
                color: 'var(--accent)',
              }}
            >
              werk
            </div>
          </div>
          <p
            ref={labelRef}
            className="mt-5 font-mono uppercase tracking-[.36em]"
            style={{ fontSize: 'clamp(.6rem, 1.0vw, .82rem)', color: 'rgba(204,255,0,.25)' }}
          >
            Web Design Studio · Nederland
          </p>
        </div>

        {/* Bottom bar: scroll cue + CTAs */}
        <div ref={botRef} className="flex items-end justify-between">
          {/* Scroll cue */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(204,255,0,.45))' }} />
            <span className="font-mono text-[7px] uppercase tracking-[.50em] rotate-90 origin-bottom" style={{ color: 'rgba(204,255,0,.25)' }}>
              Scroll
            </span>
          </div>

          {/* CTAs + mobile stats */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-5 lg:hidden">
              <div className="text-right">
                <span className="font-mono text-[.68rem] block" style={{ color: 'var(--accent)' }}>48u</span>
                <span className="font-mono text-[.45rem] uppercase tracking-[.18em]" style={{ color: 'rgba(204,255,0,.22)' }}>gemiddeld design</span>
              </div>
              <div className="h-4 w-px" style={{ background: 'rgba(204,255,0,.10)' }} />
              <div className="text-right">
                <span className="font-mono text-[.68rem] block" style={{ color: 'var(--accent)' }}>99%</span>
                <span className="font-mono text-[.45rem] uppercase tracking-[.18em]" style={{ color: 'rgba(204,255,0,.22)' }}>klanttevredenheid</span>
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
        <BrowserCard project={projects[0]} index={0} cardRef={card1Ref} accentColor="rgba(204,255,0,.10)" />
        <BrowserCard project={projects[1]} index={1} cardRef={card2Ref} accentColor="rgba(255,63,0,.07)" />
        <BrowserCard project={projects[2]} index={2} cardRef={card3Ref} accentColor="rgba(204,255,0,.05)" />

        {/* Availability pill */}
        <div ref={pillRef} className="inline-flex items-center gap-2.5 mt-1">
          <span className="status-dot" />
          <span className="font-mono text-[.56rem] uppercase tracking-[.22em]" style={{ color: 'rgba(204,255,0,.36)' }}>
            1 plek beschikbaar — Q3 2025
          </span>
        </div>
      </div>
    </section>
  );
};

export default FuturisticHero;
