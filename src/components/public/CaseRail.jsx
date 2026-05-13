import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SmartImage from '@/components/SmartImage';
import { motion } from 'framer-motion';
import { formatYear, truncate } from '@/lib/format';

const CaseRail = ({ projects = [] }) => {
  const [activeId, setActiveId] = useState(projects[0]?.id);
  const active = useMemo(() => projects.find(project => project.id === activeId) || projects[0], [projects, activeId]);

  if (!projects.length) {
    return (
      <section className="sheet px-5 py-20 md:px-10 lg:pl-28">
        <div className="empty-state">Nog geen projecten in de case index. Publiceer een project in de admin om deze rail te vullen.</div>
      </section>
    );
  }

  return (
    <section className="sheet px-5 py-24 md:px-10 lg:pl-28" id="cases">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)]">
          <span className="blueprint-label relative left-0 top-0">case index rail</span>
          <h2 className="mt-8 text-[clamp(3rem,8vw,8rem)] font-black uppercase leading-[.78] tracking-[-.07em]">Selecteer een constructie.</h2>
          <motion.div key={active?.id} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="mt-8 border-l border-[color:var(--accent)] pl-6">
            <p className="mono text-xs uppercase tracking-[.3em] text-[color:var(--accent)]">{active?.categories?.name || 'digital build'} / {formatYear(active?.created_at)}</p>
            <h3 className="mt-3 text-3xl font-bold">{active?.title}</h3>
            <p className="mt-4 max-w-lg text-slate-300">{truncate(active?.short_description || active?.description, 220)}</p>
            <Link className="blueprint-link mt-6 inline-flex" to={`/portfolio/${active?.id}`}>Open case file →</Link>
          </motion.div>
        </aside>

        <div className="-mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-6 md:mx-0 md:px-0 lg:pt-24">
          {projects.map((project, index) => (
            <button
              type="button"
              key={project.id}
              onClick={() => setActiveId(project.id)}
              onMouseEnter={() => setActiveId(project.id)}
              className={`case-slab min-w-[78vw] snap-center text-left md:min-w-[420px] ${active?.id === project.id ? 'is-active' : ''}`}
            >
              <span className="mono text-xs uppercase tracking-[.25em] text-slate-400">0{index + 1} / {project.categories?.name || 'case'}</span>
              <div className="mt-5 aspect-[4/3] overflow-hidden border border-[color:var(--grid)] bg-slate-900">
                {project.hero_image ? <SmartImage src={project.hero_image} alt="" className="h-full w-full object-cover grayscale transition duration-500 hover:grayscale-0" /> : <div className="blueprint-grid h-full" />}
              </div>
              <h3 className="mt-5 text-2xl font-black uppercase tracking-[-.04em]">{project.title}</h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseRail;
