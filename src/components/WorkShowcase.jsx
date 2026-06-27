import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index, cardRef }) => {
  const imgRef = useRef(null);
  const num    = String(index + 1).padStart(2, '0');
  const img    = project.featured_preview_image || project.hero_image;

  const handleEnter = () => {
    gsap.to(imgRef.current, { scale: 1.06, duration: 0.9, ease: 'power3.out' });
  };
  const handleLeave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.9, ease: 'power3.out' });
  };

  return (
    <article
      ref={cardRef}
      className="relative flex-shrink-0 overflow-hidden"
      style={{
        width: 'clamp(300px, 72vw, 800px)',
        border: '1px solid rgba(201,169,110,.06)',
        willChange: 'transform, opacity',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link to={`/portfolio/${project.id}`} className="group block relative h-full" data-cursor="VIEW">
        {/* Giant number watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none z-10"
          aria-hidden="true"
        >
          <span
            className="font-heading font-black leading-none"
            style={{
              fontSize: 'clamp(8rem, 20vw, 22rem)',
              letterSpacing: '-.09em',
              color: 'rgba(240,235,227,.04)',
            }}
          >
            {num}
          </span>
        </div>

        {/* Image */}
        <div
          className="overflow-hidden"
          style={{ aspectRatio: '16/10' }}
        >
          {img ? (
            <div ref={imgRef} className="h-full w-full">
              <SmartImage
                src={img}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div
              ref={imgRef}
              className="h-full w-full flex items-center justify-center"
              style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(201,169,110,.10), rgba(6,6,12,.95))' }}
            >
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: 'rgba(201,169,110,.3)' }}
              >
                {project.title}
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(3,3,9,.88) 100%)' }}
          />
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p
                className="font-mono text-[.55rem] uppercase tracking-[.3em] mb-2"
                style={{ color: 'rgba(201,169,110,.5)' }}
              >
                {project.categories?.name || 'Web Design'} — {num}
              </p>
              <h3
                className="font-heading font-black uppercase leading-none"
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 2.8rem)',
                  letterSpacing: '-.04em',
                  color: 'var(--accent3)',
                }}
              >
                {project.title}
              </h3>
              {project.short_description && (
                <p
                  className="mt-2 text-sm leading-relaxed max-w-lg line-clamp-2"
                  style={{ color: 'rgba(240,235,227,.45)' }}
                >
                  {project.short_description}
                </p>
              )}
            </div>
            <div
              className="shrink-0 grid h-11 w-11 place-items-center rounded-full transition-all duration-500 group-hover:bg-[var(--accent)]"
              style={{ border: '1px solid rgba(201,169,110,.38)' }}
            >
              <ArrowUpRight
                size={16}
                className="transition-colors duration-500 group-hover:text-[#06060c]"
                style={{ color: 'var(--accent)' }}
              />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

const WorkShowcase = ({ projects = [], loading = false }) => {
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const headRef     = useRef(null);
  const progressRef = useRef(null);
  const cardsRef    = useRef([]);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    const progress = progressRef.current;
    if (!section || !track || projects.length < 2) return;

    const ctx = gsap.context(() => {
      const getAmt = () => -(track.scrollWidth - section.offsetWidth + 80);

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.abs(getAmt())}`,
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(track, { x: getAmt() * self.progress });
          if (progress) progress.style.transform = `scaleX(${self.progress})`;

          // Spotlight: emphasise the card closest to screen centre
          const cards = cardsRef.current.filter(Boolean);
          if (cards.length > 1) {
            const activeIdx = Math.round(self.progress * (cards.length - 1));
            cards.forEach((card, i) => {
              const isActive = i === activeIdx;
              gsap.to(card, {
                scale: isActive ? 1.02 : 0.97,
                opacity: isActive ? 1 : 0.65,
                duration: 0.45,
                ease: 'power2.out',
                overwrite: 'auto',
              });
              card.style.borderColor = isActive
                ? 'rgba(201,169,110,.28)'
                : 'rgba(201,169,110,.06)';
            });
          }
        },
      });

      return () => st.kill();
    }, section);

    return () => ctx.revert();
  }, [projects]);

  if (!loading && projects.length === 0) return null;

  return (
    <section className="relative py-28 px-5 md:px-10 lg:px-16">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[60vh] w-[50vw]"
        style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(201,169,110,.05), transparent 60%)' }}
        aria-hidden="true"
      />

      {/* Header */}
      <div ref={headRef} className="mb-16 flex items-end justify-between">
        <div>
          <p
            className="font-mono text-[.65rem] uppercase tracking-[.4em] mb-4"
            style={{ color: 'var(--accent)' }}
          >
            — Geselecteerd werk
          </p>
          <h2
            className="font-heading font-black uppercase leading-none tracking-[-0.055em]"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 7.5rem)', color: 'var(--accent3)' }}
          >
            RECENTE<br />
            <em
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                fontWeight: 600,
                color: 'var(--accent)',
                fontSize: '1.06em',
                letterSpacing: '-.02em',
              }}
            >
              projecten
            </em>
          </h2>
        </div>
        <Link
          to="/portfolio"
          className="hidden lg:inline-flex items-center gap-2 font-mono text-[.7rem] uppercase tracking-[.24em] pb-2 transition-colors"
          style={{ color: 'rgba(201,169,110,.4)', borderBottom: '1px solid rgba(201,169,110,.2)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(201,169,110,.4)'; }}
        >
          Volledig portfolio <ArrowUpRight size={12} />
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse flex-shrink-0"
              style={{ width: 'clamp(300px, 72vw, 800px)', aspectRatio: '16/10', background: 'rgba(201,169,110,.04)' }}
            />
          ))}
        </div>
      ) : projects.length < 2 ? (
        /* Fallback: simple grid when ≤1 project */
        <div className="grid gap-4">
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      ) : (
        /* Horizontal scroll track */
        <div ref={sectionRef} className="relative overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-5 will-change-transform"
            style={{ paddingRight: '2rem' }}
          >
            {projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                cardRef={(el) => { cardsRef.current[i] = el; }}
              />
            ))}
          </div>

          {/* Scroll progress bar */}
          <div
            className="mt-8 overflow-hidden"
            style={{ height: 1, background: 'rgba(201,169,110,.10)' }}
          >
            <div
              ref={progressRef}
              style={{
                height: '100%',
                transformOrigin: 'left',
                transform: 'scaleX(0)',
                background: 'linear-gradient(to right, var(--accent), var(--accent2))',
                transition: 'transform 0.05s linear',
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile link */}
      <div className="mt-10 lg:hidden">
        <Link to="/portfolio" className="ghost-button">
          Volledig portfolio <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
};

export default WorkShowcase;
