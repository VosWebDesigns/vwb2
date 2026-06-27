import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import SmartImage from '@/components/SmartImage';
import { trackAnalyticsEvent } from '@/components/CookieBanner';

gsap.registerPlugin(ScrollTrigger);

const logError = (label, error) => {
  if (error) console.error(label, { message: error.message, details: error.details, hint: error.hint, code: error.code });
};

const SPAN_MAP = [3, 2, 2, 3, 2, 3, 2, 2];

const ProjectCard = ({ project, index }) => {
  const ref      = useRef(null);
  const imgRef   = useRef(null);
  const infoRef  = useRef(null);
  const numStr   = String(index + 1).padStart(2, '0');
  const img      = project.hero_image;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          delay: (index % 3) * 0.1,
          scrollTrigger: { trigger: el, start: 'top 90%' },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  const handleEnter = () => {
    gsap.to(imgRef.current, { scale: 1.07, duration: 0.9, ease: 'power3.out' });
    gsap.to(infoRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
  };
  const handleLeave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.9, ease: 'power3.out' });
    gsap.to(infoRef.current, { opacity: 0, y: 14, duration: 0.35 });
  };

  return (
    <article
      ref={ref}
      className="group relative overflow-hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ gridRowEnd: `span ${SPAN_MAP[index % SPAN_MAP.length]}` }}
    >
      <Link
        to={`/portfolio/${project.id}`}
        onClick={() => trackAnalyticsEvent('click_portfolio', { project_id: project.id })}
        className="block h-full"
        data-cursor="VIEW"
      >
        {/* Giant number watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex items-end justify-start p-4 select-none z-10"
          aria-hidden="true"
        >
          <span
            className="font-heading font-black leading-none"
            style={{
              fontSize: 'clamp(4rem, 10vw, 12rem)',
              letterSpacing: '-.09em',
              color: 'rgba(240,235,227,.05)',
              lineHeight: 0.85,
            }}
          >
            {numStr}
          </span>
        </div>

        {/* Image */}
        <div className="h-full min-h-[220px] overflow-hidden" style={{ background: 'rgba(10,10,18,.9)' }}>
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
              className="h-full w-full flex items-center justify-center min-h-[220px]"
              style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(201,169,110,.08), rgba(6,6,12,.95))' }}
            >
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: 'rgba(201,169,110,.25)' }}
              >
                {project.title}
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(3,3,9,.92) 100%)', opacity: 0.7 }}
          />
        </div>

        {/* Info overlay */}
        <div
          ref={infoRef}
          className="absolute bottom-0 left-0 right-0 p-5 z-20"
          style={{ opacity: 0, transform: 'translateY(14px)' }}
        >
          <div className="flex items-end justify-between gap-2">
            <div>
              <p
                className="font-mono text-[.52rem] uppercase tracking-[.3em] mb-1.5"
                style={{ color: 'rgba(201,169,110,.5)' }}
              >
                {project.categories?.name || 'Web Design'}
              </p>
              <h3
                className="font-heading font-black uppercase leading-none"
                style={{
                  fontSize: 'clamp(1.1rem, 2.2vw, 1.8rem)',
                  letterSpacing: '-.04em',
                  color: 'var(--accent3)',
                }}
              >
                {project.title}
              </h3>
            </div>
            <div
              className="shrink-0 grid h-9 w-9 place-items-center rounded-full"
              style={{ border: '1px solid rgba(201,169,110,.4)', background: 'rgba(201,169,110,.1)' }}
            >
              <ArrowUpRight size={14} style={{ color: 'var(--accent)' }} />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

const PortfolioPage = () => {
  const heroRef        = useRef(null);
  const titleRef       = useRef(null);
  const [projects,     setProjects]     = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [activeFilter, setActiveFilter] = useState('Alle');
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchPortfolio = async () => {
      setLoading(true);
      const [projectsResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('projects')
          .select('id, title, short_description, description, hero_image, created_at, categories(name)')
          .or('is_published.is.null,is_published.eq.true')
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name').order('name', { ascending: true }),
      ]);

      logError('PORTFOLIO_PROJECTS_ERROR', projectsResponse.error);
      logError('PORTFOLIO_CATEGORIES_ERROR', categoriesResponse.error);

      if (mounted) {
        setProjects(projectsResponse.data || []);
        setCategories(categoriesResponse.data || []);
        setLoading(false);
      }
    };
    fetchPortfolio();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.set(titleRef.current, { clipPath: 'inset(0 100% 0 0)' });
        gsap.to(titleRef.current, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.1,
          ease: 'power4.out',
          delay: 0.25,
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const filteredProjects = useMemo(
    () => activeFilter === 'Alle'
      ? projects
      : projects.filter((p) => p.categories?.name === activeFilter),
    [activeFilter, projects]
  );

  return (
    <>
      <Helmet>
        <title>Portfolio - Vos Web Designs</title>
        <meta name="description" content="Bekijk ons portfolio met recente webdesign-, development- en e-commerce projecten." />
      </Helmet>

      <main className="overflow-hidden" style={{ background: '#03030a' }}>

        {/* ── Cinematic Hero ── */}
        <section
          ref={heroRef}
          className="relative flex min-h-[80vh] flex-col justify-end overflow-hidden px-5 pt-32 pb-16 md:px-10 lg:px-16"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(201,169,110,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.035) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-0 right-0 h-[60vh] w-[55vw]"
            style={{ background: 'radial-gradient(ellipse at 90% 5%, rgba(138,92,246,.07), transparent 60%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-[1400px] mx-auto w-full">
            <p
              className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-8"
              style={{ color: 'rgba(201,169,110,.38)' }}
            >
              — Geselecteerde cases
            </p>
            <div ref={titleRef}>
              <h1
                className="font-heading font-black uppercase leading-[.88]"
                style={{
                  fontSize: 'clamp(3.5rem, 11vw, 14rem)',
                  letterSpacing: '-.07em',
                  color: 'var(--accent3)',
                }}
              >
                PORT
                <em
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    fontSize: '.95em',
                    letterSpacing: '-.03em',
                  }}
                >
                  fo
                </em>
                LIO.
              </h1>
            </div>
            <p
              className="mt-8 max-w-xl text-base leading-[1.9]"
              style={{ color: 'rgba(240,235,227,.42)' }}
            >
              Een selectie van projecten die aantonen wat premium webdesign en maatwerk techniek vermogen.
            </p>
          </div>
        </section>

        {/* ── Filter bar ── */}
        <div
          className="sticky top-[60px] z-40 px-5 md:px-10 lg:px-16 py-4 backdrop-blur-xl"
          style={{
            background: 'rgba(3,3,9,.88)',
            borderBottom: '1px solid rgba(201,169,110,.08)',
          }}
        >
          <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-2">
            {['Alle', ...categories.map((c) => c.name)].map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className="font-mono text-[.6rem] uppercase tracking-[.22em] rounded-full px-4 py-2 transition-all duration-300"
                  style={{
                    border: `1px solid ${isActive ? 'var(--accent)' : 'rgba(201,169,110,.16)'}`,
                    background: isActive ? 'rgba(201,169,110,.12)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'rgba(240,235,227,.4)',
                  }}
                >
                  {f}
                </button>
              );
            })}
            {!loading && (
              <span
                className="ml-auto font-mono text-[.55rem] uppercase tracking-[.3em]"
                style={{ color: 'rgba(201,169,110,.28)' }}
              >
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projecten'}
              </span>
            )}
          </div>
        </div>

        {/* ── Masonry Grid ── */}
        <section className="relative px-5 py-16 md:px-10 lg:px-16">
          <div className="max-w-[1400px] mx-auto">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" style={{ gridAutoRows: '80px' }}>
                {[3, 2, 2, 3, 2, 3].map((span, i) => (
                  <div
                    key={i}
                    className="animate-pulse"
                    style={{
                      gridRowEnd: `span ${span}`,
                      background: 'rgba(201,169,110,.04)',
                      borderRadius: 0,
                    }}
                  />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="py-32 text-center">
                <p
                  className="font-mono text-[.62rem] uppercase tracking-[.4em]"
                  style={{ color: 'rgba(201,169,110,.28)' }}
                >
                  Geen projecten gevonden
                </p>
                <button
                  type="button"
                  onClick={() => setActiveFilter('Alle')}
                  className="mt-6 font-mono text-[.68rem] uppercase tracking-[.2em] transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  Bekijk alles →
                </button>
              </div>
            ) : (
              <div
                className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
                style={{ gridAutoRows: '80px' }}
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        {!loading && (
          <section className="relative py-24 md:py-36 px-5 md:px-10 lg:px-16">
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.14), transparent)' }}
              aria-hidden="true"
            />
            <div className="max-w-[1400px] mx-auto text-center">
              <h2
                className="font-heading font-black uppercase leading-[.9]"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 8rem)', letterSpacing: '-.06em', color: 'var(--accent3)' }}
              >
                WIL JE HIER
                <br />
                <em
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    fontSize: '1.06em',
                    letterSpacing: '-.03em',
                  }}
                >
                  ook
                </em>
                {' '}STAAN?
              </h2>
              <p
                className="mx-auto mt-7 max-w-lg text-base leading-[1.85]"
                style={{ color: 'rgba(240,235,227,.42)' }}
              >
                Plan een vrijblijvend gesprek en ontdek wat wij voor jouw bedrijf kunnen bouwen.
              </p>
              <Link to="/contact" className="glow-button mt-10" data-magnetic="">
                Start een project <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        )}

      </main>
    </>
  );
};

export default PortfolioPage;
