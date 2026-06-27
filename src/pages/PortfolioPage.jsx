import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import SmartImage from '@/components/SmartImage';
import { trackAnalyticsEvent } from '@/components/CookieBanner';

const logError = (label, error) => {
  if (error) console.error(label, { message: error.message, details: error.details, hint: error.hint, code: error.code });
};

const PortfolioPage = () => {
  const projectsRef    = useRef(null);
  const projectsInView = useInView(projectsRef, { once: true, margin: '-100px' });
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

  const filteredProjects = useMemo(
    () => activeFilter === 'Alle'
      ? projects
      : projects.filter((project) => project.categories?.name === activeFilter),
    [activeFilter, projects]
  );

  return (
    <>
      <Helmet>
        <title>Portfolio - Vos Web Designs</title>
        <meta name="description" content="Bekijk ons portfolio met recente webdesign-, development- en e-commerce projecten." />
      </Helmet>

      <main className="cinema-bg min-h-screen overflow-hidden pt-24">

        {/* ── Hero ── */}
        <section className="cinematic-section relative overflow-hidden">
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(204,255,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,.05) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="cinematic-container relative z-10">
            <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="status-dot" />
                  <p className="section-eyebrow">Portfolio</p>
                </div>
                <h1 className="display-xl mt-0 text-[clamp(3.4rem,9vw,7.5rem)]">
                  Case library met{' '}
                  <span className="gradient-text-full">live projecten</span>.
                </h1>
              </div>
              <div className="glass-card cyber-corner rounded-2xl p-6 lg:justify-self-end lg:max-w-md">
                <span className="hud-label block mb-3">Geselecteerde cases</span>
                <p className="text-lg leading-8 text-slate-300">
                  Een selectie van projecten waar we trots op zijn. Alles rechtstreeks uit Supabase — altijd up-to-date.
                </p>
              </div>
            </div>

            {/* Filter bar */}
            <div className="mt-10 flex flex-wrap items-center gap-3 border-y border-[rgba(204,255,0,.10)] py-5">
              <span className="hud-label mr-2 hidden sm:inline">Filter:</span>
              <button
                type="button"
                onClick={() => setActiveFilter('Alle')}
                className={activeFilter === 'Alle' ? 'cta-link !py-2.5' : 'ghost-link !py-2.5'}
              >
                Alle
              </button>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.name)}
                  className={activeFilter === cat.name ? 'cta-link !py-2.5' : 'ghost-link !py-2.5'}
                >
                  {cat.name}
                </button>
              ))}
              {!loading && (
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[.2em] text-slate-600">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projecten'}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── Grid ── */}
        <section ref={projectsRef} className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="glass-card rounded-2xl aspect-[4/3] animate-pulse" />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <span className="status-dot mx-auto mb-4 block" />
                <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">
                  Geen projecten gevonden
                </p>
                <p className="text-slate-400 mb-6">
                  Geen projecten voor deze categorie.{' '}
                  <button
                    type="button"
                    onClick={() => setActiveFilter('Alle')}
                    className="text-[var(--accent)] underline-offset-4 hover:underline"
                  >
                    Bekijk alles
                  </button>
                </p>
                <Link to="/contact" className="glow-button">
                  Start een nieuw project <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, index) => (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 32 }}
                    animate={projectsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="project-card group relative"
                  >
                    <Link
                      to={`/portfolio/${project.id}`}
                      onClick={() => trackAnalyticsEvent('click_portfolio', { project_id: project.id })}
                      className="block"
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] overflow-hidden bg-slate-950 relative">
                        {project.hero_image ? (
                          <SmartImage
                            src={project.hero_image}
                            alt={project.title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full place-items-center">
                            <span className="font-mono text-xs uppercase tracking-widest text-slate-600">Geen afbeelding</span>
                          </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,8,16,.7)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                        {/* Arrow icon */}
                        <div className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-[#06060c] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="h-1 w-1 rounded-full bg-[var(--accent2)]" />
                          <p className="eyebrow text-[10px]">{project.categories?.name || 'Project'}</p>
                        </div>
                        <h2 className="font-heading text-2xl font-black tracking-[-.05em] transition-colors duration-200 group-hover:text-[var(--accent)]">
                          {project.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                          {project.short_description || project.description || 'Bekijk de projectdetails.'}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[.16em] text-[var(--accent2)] transition-all duration-200 group-hover:gap-2.5">
                          Bekijk project <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        {!loading && (
          <section className="cinematic-section pt-4">
            <div className="cinematic-container relative z-10 text-center">
              <div className="glass-card cyber-corner mx-auto max-w-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 sci-fi-grid-fine opacity-25" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2.5 mb-6">
                    <span className="status-dot" />
                    <span className="hud-label">Nieuw project starten</span>
                  </div>
                  <h2 className="font-heading text-3xl font-black tracking-tight">
                    Wil je hier ook staan?
                  </h2>
                  <p className="mt-4 text-slate-400">
                    Plan een vrijblijvend gesprek en ontdek wat wij voor jouw bedrijf kunnen bouwen.
                  </p>
                  <Link to="/contact" className="glow-button mt-7">
                    Start een project <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
    </>
  );
};

export default PortfolioPage;
