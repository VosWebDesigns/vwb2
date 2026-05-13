import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import SmartImage from '@/components/SmartImage';

const logError = (label, error) => {
  if (error) console.error(label, { message: error.message, details: error.details, hint: error.hint, code: error.code });
};

const PortfolioPage = () => {
  const projectsRef = useRef(null);
  const projectsInView = useInView(projectsRef, { once: true, margin: '-100px' });
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Alle');
  const [loading, setLoading] = useState(true);

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

  const filteredProjects = useMemo(() => activeFilter === 'Alle' ? projects : projects.filter(project => project.categories?.name === activeFilter), [activeFilter, projects]);

  return (
    <>
      <Helmet>
        <title>Portfolio - Vos Web Designs</title>
        <meta name="description" content="Bekijk ons portfolio met recente webdesign-, development- en e-commerce projecten." />
      </Helmet>

      <main className="cinema-bg min-h-screen pt-24">
        <section className="cinematic-section">
          <div className="cinematic-container relative z-10">
            <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
              <div>
                <p className="eyebrow">Portfolio</p>
                <h1 className="display-title mt-4 text-[clamp(3.6rem,10vw,8rem)]">Case library met live projecten.</h1>
              </div>
              <p className="max-w-xl text-lg leading-8 text-slate-300 lg:justify-self-end">Een selectie van projecten waar we trots op zijn. Alles komt rechtstreeks uit Supabase en blijft publicatie-vriendelijk.</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 border-y border-[color:var(--stroke)] py-5">
              <button type="button" onClick={() => setActiveFilter('Alle')} className={activeFilter === 'Alle' ? 'cta-link !py-3' : 'ghost-link !py-3'}>Alle</button>
              {categories.map(cat => <button type="button" key={cat.id} onClick={() => setActiveFilter(cat.name)} className={activeFilter === cat.name ? 'cta-link !py-3' : 'ghost-link !py-3'}>{cat.name}</button>)}
            </div>
          </div>
        </section>

        <section ref={projectsRef} className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            {loading ? (
              <div className="panel cut p-8 text-center text-slate-300">Projecten laden…</div>
            ) : filteredProjects.length === 0 ? (
              <div className="panel cut p-8 text-center text-slate-300">Geen projecten gevonden voor deze filter. <Link to="/contact" className="text-[color:var(--accent)]">Start een nieuw project</Link>.</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, index) => (
                  <motion.article key={project.id} initial={{ opacity: 0, y: 30 }} animate={projectsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: index * 0.06 }} className="panel cut group overflow-hidden">
                    <Link to={`/portfolio/${project.id}`}>
                      <div className="aspect-[4/3] overflow-hidden bg-slate-950">
                        {project.hero_image ? <SmartImage src={project.hero_image} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-slate-500">Geen afbeelding</div>}
                      </div>
                      <div className="p-6">
                        <p className="eyebrow">{project.categories?.name || 'Project'}</p>
                        <h2 className="mt-3 font-heading text-3xl font-black tracking-[-.05em] transition group-hover:text-[color:var(--accent)]">{project.title}</h2>
                        <p className="mt-3 line-clamp-3 text-slate-300">{project.short_description || project.description || 'Bekijk de projectdetails.'}</p>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.16em] text-[color:var(--accent2)]">Bekijk project <ArrowRight size={16} /></span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default PortfolioPage;
