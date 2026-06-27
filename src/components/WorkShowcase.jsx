import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';

gsap.registerPlugin(ScrollTrigger);

const ProjectItem = ({ project, index }) => {
  const ref     = useRef(null);
  const imgRef  = useRef(null);
  const infoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const img = project.featured_preview_image || project.hero_image;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          delay: index * 0.12,
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  const handleEnter = () => {
    setHovered(true);
    gsap.to(imgRef.current,  { scale: 1.06, duration: 0.85, ease: 'power3.out' });
    gsap.to(infoRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  };
  const handleLeave = () => {
    setHovered(false);
    gsap.to(imgRef.current,  { scale: 1, duration: 0.85, ease: 'power3.out' });
    gsap.to(infoRef.current, { opacity: 0, y: 12, duration: 0.4 });
  };

  return (
    <article
      ref={ref}
      className="group relative overflow-hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ borderRadius: 16 }}
    >
      <Link to={`/portfolio/${project.id}`} className="block">
        {/* Image */}
        <div className="overflow-hidden" style={{ aspectRatio: index === 0 ? '16/9' : '4/3' }}>
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
              style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(201,169,110,.12), rgba(6,6,12,.95))' }}
            >
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: 'rgba(201,169,110,.3)' }}
              >
                {project.title}
              </span>
            </div>
          )}

          {/* Overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(to bottom, transparent 35%, rgba(6,6,12,.85) 100%)',
              opacity: hovered ? 1 : 0.6,
            }}
          />
        </div>

        {/* Info overlay */}
        <div
          ref={infoRef}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
          style={{ opacity: 0, transform: 'translateY(12px)' }}
        >
          <div className="flex items-end justify-between">
            <div>
              <p
                className="font-mono text-[.6rem] uppercase tracking-[.28em] mb-2"
                style={{ color: 'rgba(201,169,110,.55)' }}
              >
                {project.categories?.name || 'Web Design'} — {new Date(project.created_at).getFullYear()}
              </p>
              <h3
                className="font-heading font-black uppercase leading-none"
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 3rem)',
                  letterSpacing: '-.04em',
                  color: 'var(--accent3)',
                }}
              >
                {project.title}
              </h3>
              {project.short_description && (
                <p
                  className="mt-2 text-sm leading-relaxed max-w-lg line-clamp-2"
                  style={{ color: 'rgba(240,235,227,.5)' }}
                >
                  {project.short_description}
                </p>
              )}
            </div>
            <div
              className="ml-4 shrink-0 grid h-12 w-12 place-items-center rounded-full transition-all duration-400"
              style={{
                border: '1px solid rgba(201,169,110,.4)',
                background: hovered ? 'var(--accent)' : 'transparent',
              }}
            >
              <ArrowUpRight
                size={18}
                style={{ color: hovered ? '#06060c' : 'var(--accent)' }}
              />
            </div>
          </div>
        </div>

        {/* Index number (always visible) */}
        <div
          className="absolute top-5 left-6"
        >
          <span
            className="font-mono text-[.62rem] uppercase tracking-[.3em]"
            style={{ color: 'rgba(201,169,110,.35)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </Link>
    </article>
  );
};

const WorkShowcase = ({ projects = [], loading = false }) => {
  const headRef = useRef(null);

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

  if (!loading && projects.length === 0) return null;

  return (
    <section className="relative py-28 px-5 md:px-10 lg:px-16">
      {/* Faint gold glow */}
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
        /* Skeleton */
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl"
              style={{
                aspectRatio: i === 1 ? '16/9' : '4/3',
                background: 'rgba(201,169,110,.04)',
                gridColumn: i === 1 ? '1 / -1' : 'auto',
              }}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {projects.map((p, i) => (
            <div
              key={p.id}
              style={{ gridColumn: i === 0 ? '1 / -1' : 'auto' }}
            >
              <ProjectItem project={p} index={i} />
            </div>
          ))}
        </div>
      )}

      {/* Mobile "all projects" link */}
      <div className="mt-10 lg:hidden">
        <Link to="/portfolio" className="ghost-button">
          Volledig portfolio <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
};

export default WorkShowcase;
