import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { getCategories, getPublishedProjects } from '@/lib/api/publicContent';
import { formatYear, truncate } from '@/lib/format';

const PortfolioPage = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('all');
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getPublishedProjects(), getCategories()]).then(([projectData, categoryData]) => {
      if (mounted) {
        setProjects(projectData);
        setCategories(categoryData);
        setActiveId(projectData[0]?.id || null);
      }
    });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => category === 'all' ? projects : projects.filter(project => project.category_id === category), [category, projects]);
  const active = filtered.find(project => project.id === activeId) || filtered[0];

  return (
    <>
      <Helmet><title>Portfolio — Case Library</title><meta name="description" content="Case library met gepubliceerde projecten uit de Vos Web Designs database." /></Helmet>
      <main className="px-5 pb-24 pt-28 md:px-10 lg:pl-28">
        <section className="mx-auto max-w-[1500px]">
          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:h-[calc(100svh-7rem)]">
              <span className="blueprint-label relative left-0 top-0">library view</span>
              <h1 className="mt-8 text-6xl font-black uppercase leading-[.8] tracking-[-.07em] md:text-8xl">Case library</h1>
              <div className="mt-8 flex flex-wrap gap-2">
                <button type="button" onClick={() => setCategory('all')} className={`stamp ${category === 'all' ? 'active' : ''}`}>alles</button>
                {categories.map(item => <button type="button" key={item.id} onClick={() => setCategory(item.id)} className={`stamp ${category === item.id ? 'active' : ''}`}>{item.name}</button>)}
              </div>
              <div className="mt-8 max-h-[42svh] overflow-y-auto border-l border-[color:var(--grid)]">
                {filtered.map((project, index) => (
                  <button type="button" key={project.id} onClick={() => setActiveId(project.id)} className={`library-row ${active?.id === project.id ? 'active' : ''}`}>
                    <span>0{index + 1}</span>{project.title}
                  </button>
                ))}
              </div>
            </aside>

            {!filtered.length ? <div className="empty-state">Nog geen projecten gevonden voor deze stempel.</div> : (
              <article className="case-preview">
                <div className="aspect-[16/10] overflow-hidden border border-[color:var(--grid)] bg-slate-900">
                  {active?.hero_image ? <img src={active.hero_image} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="blueprint-grid h-full" />}
                </div>
                <div className="grid gap-8 border-x border-b border-[color:var(--grid)] p-6 md:grid-cols-[1fr_280px] md:p-10">
                  <div>
                    <p className="mono text-xs uppercase tracking-[.3em] text-[color:var(--accent)]">{active?.categories?.name || 'case'} / {formatYear(active?.created_at)}</p>
                    <h2 className="mt-4 text-5xl font-black uppercase tracking-[-.06em] md:text-8xl">{active?.title}</h2>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{truncate(active?.description || active?.short_description, 320)}</p>
                  </div>
                  <div className="self-end">
                    <Link to={`/portfolio/${active?.id}`} className="blueprint-button w-full justify-center">Open case file</Link>
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default PortfolioPage;
