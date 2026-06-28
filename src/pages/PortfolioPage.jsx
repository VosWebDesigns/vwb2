import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import SmartImage from '@/components/SmartImage';
import { trackAnalyticsEvent } from '@/components/CookieBanner';

const logError = (label, error) => {
  if (error) console.error(label, { message: error.message, details: error.details, hint: error.hint, code: error.code });
};

/* ── Full-width editorial hero card (first project) ── */
const EditorialHeroCard = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  const img = project.featured_preview_image || project.hero_image;

  return (
    <article
      className="relative overflow-hidden mb-4"
      style={{ borderRadius: 14 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={`/portfolio/${project.id}`}
        onClick={() => trackAnalyticsEvent('click_portfolio', { project_id: project.id })}
        className="block"
      >
        {/* 16/9 image */}
        <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <div
            className="h-full w-full transition-transform duration-700"
            style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
          >
            {img ? (
              <SmartImage src={img} alt={project.title} className="h-full w-full object-cover" />
            ) : (
              <div
                className="h-full w-full flex items-center justify-center"
                style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(204,255,0,.07), rgba(6,6,8,.95))' }}
              >
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'rgba(204,255,0,.20)' }}>
                  {project.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(6,6,8,.90) 100%)' }}
        />

        {/* Always-visible info bar */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-5 md:px-8 md:py-6 flex items-end justify-between">
          <div>
            <p className="font-mono text-[.58rem] uppercase tracking-[.26em] mb-2" style={{ color: 'rgba(204,255,0,.50)' }}>
              {project.categories?.name || 'Web Design'} — {new Date(project.created_at).getFullYear()}
            </p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(1.4rem, 3vw, 2.8rem)',
                letterSpacing: '-.04em',
                lineHeight: 1.0,
                color: 'var(--accent3)',
              }}
            >
              {project.title}
            </h2>
          </div>
          <div
            className="ml-4 shrink-0 grid h-11 w-11 place-items-center rounded-full transition-all duration-400"
            style={{
              border: '1px solid rgba(204,255,0,.40)',
              background: hovered ? 'var(--accent)' : 'transparent',
            }}
          >
            <ArrowUpRight size={16} style={{ color: hovered ? '#060608' : 'var(--accent)' }} />
          </div>
        </div>

        {/* Project index */}
        <div className="absolute top-5 left-6">
          <span className="font-mono text-[.56rem] uppercase tracking-[.28em]" style={{ color: 'rgba(204,255,0,.28)' }}>01</span>
        </div>
      </Link>
    </article>
  );
};

/* ── Masonry card for remaining projects ── */
const MasonryCard = ({ project, index }) => {
  const img = project.featured_preview_image || project.hero_image;
  const aspectRatio = index % 3 === 0 ? '3/4' : '4/3';

  return (
    <motion.article
      className="break-inside-avoid mb-4 overflow-hidden group"
      style={{ borderRadius: 12 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/portfolio/${project.id}`}
        onClick={() => trackAnalyticsEvent('click_portfolio', { project_id: project.id })}
        className="block"
      >
        {/* Image */}
        <div className="overflow-hidden" style={{ aspectRatio, borderRadius: 12 }}>
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
            {img ? (
              <SmartImage src={img} alt={project.title} className="h-full w-full object-cover" />
            ) : (
              <div
                className="h-full w-full flex items-center justify-center"
                style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(204,255,0,.07), rgba(6,6,8,.95))' }}
              >
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'rgba(204,255,0,.20)' }}>
                  {project.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info below image (always visible) */}
        <div className="pt-3 pb-1">
          <div className="flex items-center justify-between mb-1">
            <p className="font-mono text-[.52rem] uppercase tracking-[.22em]" style={{ color: 'rgba(204,255,0,.32)' }}>
              {project.categories?.name || 'Web Design'}
            </p>
            <p className="font-mono text-[.5rem] uppercase tracking-[.18em]" style={{ color: 'rgba(204,255,0,.20)' }}>
              {new Date(project.created_at).getFullYear()}
            </p>
          </div>
          <h3
            className="font-heading font-bold uppercase leading-tight"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 'clamp(.9rem, 2vw, 1.35rem)',
              letterSpacing: '-.04em',
              color: 'var(--accent3)',
              transition: 'color .3s',
            }}
          >
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.article>
  );
};

const PortfolioPage = () => {
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
          .select('id, title, short_description, description, hero_image, featured_preview_image, created_at, categories(name)')
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

  const filteredProjects = useMemo(
    () => activeFilter === 'Alle'
      ? projects
      : projects.filter((p) => p.categories?.name === activeFilter),
    [activeFilter, projects]
  );

  const heroProject = filteredProjects[0];
  const restProjects = filteredProjects.slice(1);

  return (
    <>
      <Helmet>
        <title>Portfolio - Vos Web Designs</title>
        <meta name="description" content="Bekijk ons portfolio met recente webdesign-, development- en e-commerce projecten." />
      </Helmet>

      <main className="cinema-bg min-h-screen overflow-hidden pt-24">

        {/* ── Hero header ── */}
        <section className="relative py-20 md:py-28 px-5 md:px-10 lg:px-16 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(204,255,0,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,.022) 1px, transparent 1px)',
              backgroundSize: '90px 90px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-[1180px] mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="status-dot" />
              <p className="font-mono text-[.62rem] uppercase tracking-[.38em]" style={{ color: 'rgba(204,255,0,.40)' }}>
                Portfolio
              </p>
            </div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(3rem, 9vw, 8rem)',
                letterSpacing: '-.065em',
                lineHeight: 0.88,
                color: 'var(--accent3)',
                margin: 0,
              }}
            >
              GESELECTEERDE<br />
              <em
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  fontSize: '1.04em',
                  letterSpacing: '-.02em',
                }}
              >
                projecten
              </em>
              .
            </h1>
          </div>
        </section>

        {/* ── Layout: sidebar (lg) + content ── */}
        <section className="relative px-5 md:px-10 lg:px-16 pb-28">
          <div className="max-w-[1180px] mx-auto flex gap-10 lg:gap-14 items-start">

            {/* ── Sidebar filter (desktop) ── */}
            <aside className="hidden lg:block w-44 shrink-0 sticky top-28">
              <p className="font-mono text-[.56rem] uppercase tracking-[.30em] mb-5" style={{ color: 'rgba(204,255,0,.30)' }}>
                Filter
              </p>
              <nav className="flex flex-col gap-1">
                {['Alle', ...categories.map((c) => c.name)].map((cat) => {
                  const isActive = activeFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveFilter(cat)}
                      className="text-left py-2 font-mono text-[.65rem] uppercase tracking-[.20em] transition-colors"
                      style={{
                        color: isActive ? 'var(--accent)' : 'rgba(204,255,0,.30)',
                        borderBottom: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
                {!loading && (
                  <p className="mt-6 font-mono text-[.52rem] uppercase tracking-[.20em]" style={{ color: 'rgba(204,255,0,.18)' }}>
                    {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projecten'}
                  </p>
                )}
              </nav>
            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0">
              {/* Mobile filter: horizontal scrollable pills */}
              <div className="lg:hidden mb-6 -mx-1 overflow-x-auto">
                <div className="flex gap-2 px-1 pb-2 min-w-max">
                  {['Alle', ...categories.map((c) => c.name)].map((cat) => {
                    const isActive = activeFilter === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveFilter(cat)}
                        className="shrink-0 rounded-full px-4 py-2 font-mono text-[.6rem] uppercase tracking-[.18em] transition-all"
                        style={{
                          border: `1px solid ${isActive ? 'var(--accent)' : 'rgba(204,255,0,.12)'}`,
                          background: isActive ? 'var(--accent)' : 'transparent',
                          color: isActive ? '#060608' : 'rgba(204,255,0,.40)',
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {loading ? (
                <div className="columns-1 md:columns-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="break-inside-avoid mb-4 animate-pulse rounded-xl"
                      style={{ aspectRatio: i % 3 === 0 ? '3/4' : '4/3', background: 'rgba(204,255,0,.03)' }}
                    />
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="glass-card rounded-2xl p-10 text-center">
                  <span className="status-dot mx-auto mb-4 block" />
                  <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(240,237,230,.35)' }}>
                    Geen projecten gevonden
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('Alle')}
                    className="font-mono text-[.65rem] uppercase tracking-[.18em] transition-colors"
                    style={{ color: 'var(--accent)' }}
                  >
                    Bekijk alles →
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={activeFilter}>
                    {/* First project: full-width editorial card */}
                    {heroProject && <EditorialHeroCard project={heroProject} />}

                    {/* Remaining: CSS masonry columns */}
                    {restProjects.length > 0 && (
                      <div className="columns-1 md:columns-2 gap-4">
                        {restProjects.map((project, i) => (
                          <MasonryCard key={project.id} project={project} index={i} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* CTA */}
              {!loading && filteredProjects.length > 0 && (
                <div className="mt-16 text-center">
                  <div className="h-px mb-12" style={{ background: 'linear-gradient(to right, transparent, rgba(204,255,0,.08), transparent)' }} />
                  <div className="inline-flex items-center gap-2.5 mb-6">
                    <span className="status-dot" />
                    <span className="font-mono text-[.6rem] uppercase tracking-[.28em]" style={{ color: 'rgba(204,255,0,.36)' }}>
                      Nieuw project starten
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                      letterSpacing: '-.055em',
                      color: 'var(--accent3)',
                    }}
                  >
                    Wil je hier ook staan?
                  </h2>
                  <p className="mt-4 text-base" style={{ color: 'rgba(240,237,230,.38)' }}>
                    Plan een vrijblijvend gesprek en ontdek wat wij voor jouw bedrijf kunnen bouwen.
                  </p>
                  <Link to="/contact" className="glow-button mt-7">
                    Start een project <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default PortfolioPage;
