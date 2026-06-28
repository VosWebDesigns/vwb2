import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';

gsap.registerPlugin(ScrollTrigger);

/* ── Full-width hero card (project 0) with clip-path curtain reveal ── */
const MagazineHeroCard = ({ project }) => {
  const ref    = useRef(null);
  const imgRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const img = project.featured_preview_image || project.hero_image;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <article
      ref={ref}
      className="magazine-grid-hero relative"
      onMouseEnter={() => {
        setHovered(true);
        gsap.to(imgRef.current, { scale: 1.04, duration: 0.9, ease: 'power3.out' });
      }}
      onMouseLeave={() => {
        setHovered(false);
        gsap.to(imgRef.current, { scale: 1, duration: 0.9, ease: 'power3.out' });
      }}
    >
      <Link to={`/portfolio/${project.id}`} className="block">
        {/* 21/9 cinematic image */}
        <div className="overflow-hidden" style={{ aspectRatio: '21/9' }}>
          <div ref={imgRef} className="h-full w-full">
            {img ? (
              <SmartImage src={img} alt={project.title} className="h-full w-full object-cover" />
            ) : (
              <div
                className="h-full w-full flex items-center justify-center"
                style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(200,168,106,.07), rgba(6,6,8,.95))' }}
              >
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'rgba(200,168,106,.20)' }}>
                  {project.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(6,6,8,.92) 100%)' }}
        />

        {/* Always-visible info bar */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-5 md:px-8 md:py-7 flex items-end justify-between">
          <div>
            <p
              className="font-mono text-[.58rem] uppercase tracking-[.26em] mb-2"
              style={{ color: 'rgba(200,168,106,.50)' }}
            >
              {project.categories?.name || 'Web Design'} — {new Date(project.created_at).getFullYear()}
            </p>
            <h3
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2.8rem)',
                letterSpacing: '-.04em',
                lineHeight: 1.0,
                color: 'var(--accent3)',
              }}
            >
              {project.title}
            </h3>
          </div>
          <div
            className="ml-4 shrink-0 grid h-11 w-11 place-items-center rounded-full transition-all duration-400"
            style={{
              border: '1px solid rgba(200,168,106,.40)',
              background: hovered ? 'var(--accent)' : 'transparent',
            }}
          >
            <ArrowUpRight size={16} style={{ color: hovered ? '#08050F' : 'var(--accent)' }} />
          </div>
        </div>

        {/* Index number */}
        <div className="absolute top-5 left-6">
          <span className="font-mono text-[.56rem] uppercase tracking-[.28em]" style={{ color: 'rgba(200,168,106,.28)' }}>01</span>
        </div>
      </Link>
    </article>
  );
};

/* ── Secondary card (projects 1-3): info always visible below image ── */
const MagazineCard = ({ project, index }) => {
  const ref = useRef(null);

  const img = project.featured_preview_image || project.hero_image;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, x: index % 2 === 0 ? -30 : 30 },
        {
          opacity: 1, x: 0, duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          delay: (index - 1) * 0.1,
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <article ref={ref} className="group overflow-hidden" style={{ borderRadius: 12 }}>
      <Link to={`/portfolio/${project.id}`} className="block">
        {/* Image */}
        <div className="overflow-hidden" style={{ aspectRatio: '4/3', borderRadius: 12 }}>
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]">
            {img ? (
              <SmartImage src={img} alt={project.title} className="h-full w-full object-cover" />
            ) : (
              <div
                className="h-full w-full flex items-center justify-center"
                style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(200,168,106,.07), rgba(6,6,8,.95))' }}
              >
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'rgba(200,168,106,.20)' }}>
                  {project.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info below image (always visible — editorial style) */}
        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-mono text-[.54rem] uppercase tracking-[.24em]" style={{ color: 'rgba(200,168,106,.34)' }}>
              {project.categories?.name || 'Web Design'}
            </p>
            <p className="font-mono text-[.52rem] uppercase tracking-[.2em]" style={{ color: 'rgba(200,168,106,.22)' }}>
              {new Date(project.created_at).getFullYear()}
            </p>
          </div>
          <h3
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(.95rem, 2.2vw, 1.55rem)',
              letterSpacing: '-.04em',
              lineHeight: 1.05,
              color: 'var(--accent3)',
              transition: 'color .3s',
            }}
            className="group-hover:text-[var(--accent)]"
          >
            {project.title}
          </h3>
          <span
            className="font-mono text-[.5rem] uppercase tracking-[.22em]"
            style={{ color: 'rgba(200,168,106,.20)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </Link>
    </article>
  );
};

/* ── CTA tile that fills the 4th grid cell ── */
const CtaTile = () => (
  <div
    className="glass-card relative flex flex-col items-center justify-center text-center p-8 overflow-hidden"
    style={{ borderRadius: 12, minHeight: 280 }}
  >
    {/* Giant transparent arrow background decoration */}
    <span
      aria-hidden="true"
      className="select-none pointer-events-none"
      style={{
        position: 'absolute',
        right: '-8%',
        bottom: '-12%',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 'clamp(10rem, 22vw, 18rem)',
        lineHeight: 1,
        color: 'transparent',
        WebkitTextStroke: '1px rgba(200,168,106,.05)',
      }}
    >
      →
    </span>
    <p
      className="font-mono text-[.6rem] uppercase tracking-[.32em] mb-5 relative z-10"
      style={{ color: 'rgba(200,168,106,.36)' }}
    >
      — Portfolio
    </p>
    <h3
      className="relative z-10"
      style={{
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
        letterSpacing: '-.055em',
        lineHeight: 1.05,
        color: 'var(--accent3)',
      }}
    >
      VOLLEDIG<br />
      <em
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontStyle: 'italic',
          fontWeight: 600,
          color: 'var(--accent)',
          fontSize: '1.08em',
          letterSpacing: '-.02em',
        }}
      >
        portfolio
      </em>
    </h3>
    <Link to="/portfolio" className="ghost-button mt-6 relative z-10">
      Bekijk alles <ArrowUpRight size={14} />
    </Link>
  </div>
);

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

  const [p0, p1, p2, p3] = projects;

  return (
    <section className="relative py-28 px-5 md:px-10 lg:px-16">
      {/* Faint glow */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[60vh] w-[50vw]"
        style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(200,168,106,.04), transparent 60%)' }}
        aria-hidden="true"
      />

      {/* Header with ghost project count */}
      <div ref={headRef} className="mb-16 flex items-end justify-between">
        <div className="flex-1 flex items-end gap-5 lg:gap-8">
          <div>
            <p
              className="font-mono text-[.65rem] uppercase tracking-[.38em] mb-4"
              style={{ color: 'var(--accent)' }}
            >
              — Geselecteerd werk
            </p>
            <h2
              className="font-heading font-bold uppercase leading-none tracking-[-0.055em]"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 'clamp(2.8rem, 7vw, 7.5rem)',
                color: 'var(--accent3)',
              }}
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
          {/* Ghost project count */}
          {!loading && projects.length > 0 && (
            <span
              aria-hidden="true"
              className="hidden lg:block self-end ghost-num"
              style={{ position: 'relative', fontSize: 'clamp(4rem, 8vw, 9rem)', bottom: '0.08em' }}
            >
              {String(projects.length).padStart(2, '0')}
            </span>
          )}
        </div>

        <Link
          to="/portfolio"
          className="hidden lg:inline-flex items-center gap-2 font-mono text-[.7rem] uppercase tracking-[.22em] pb-2 transition-colors"
          style={{ color: 'rgba(200,168,106,.36)', borderBottom: '1px solid rgba(200,168,106,.16)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(200,168,106,.36)'; }}
        >
          Volledig portfolio <ArrowUpRight size={12} />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4">
          <div className="animate-pulse rounded-2xl" style={{ aspectRatio: '21/9', background: 'rgba(200,168,106,.03)' }} />
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            {[2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl" style={{ aspectRatio: '4/3', background: 'rgba(200,168,106,.03)' }} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:gap-5">
          {/* Row 1: Hero card — full width */}
          {p0 && <MagazineHeroCard project={p0} />}

          {/* Row 2: P1 (60%) + P2 (40%) */}
          {(p1 || p2) && (
            <div className="grid gap-4 lg:gap-5 lg:grid-cols-[1.5fr_1fr]">
              {p1 && <MagazineCard project={p1} index={1} />}
              {p2 && <MagazineCard project={p2} index={2} />}
            </div>
          )}

          {/* Row 3: P3 (40%) + CTA tile (60%) */}
          {(p3 || projects.length >= 3) && (
            <div className="grid gap-4 lg:gap-5 lg:grid-cols-[1fr_1.5fr]">
              {p3 && <MagazineCard project={p3} index={3} />}
              <CtaTile />
            </div>
          )}
        </div>
      )}

      {/* Mobile portfolio link */}
      <div className="mt-10 lg:hidden">
        <Link to="/portfolio" className="ghost-button">
          Volledig portfolio <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
};

export default WorkShowcase;
