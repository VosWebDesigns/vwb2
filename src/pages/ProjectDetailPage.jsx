import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { getProjectWithImages } from '@/lib/api/publicContent';
import { formatYear } from '@/lib/format';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProjectWithImages(projectId).then(({ project: item, images: gallery }) => {
      if (mounted) {
        setProject(item);
        setImages(gallery);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [projectId]);

  const gallery = useMemo(() => {
    const cover = project?.hero_image ? [{ id: 'hero', url: project.hero_image, alt: project.title, is_cover: true }] : [];
    const rest = images.filter(image => image.url !== project?.hero_image);
    return [...cover, ...rest];
  }, [images, project]);

  if (loading) return <main className="px-5 py-32 lg:pl-28"><div className="empty-state">Case file laden…</div></main>;
  if (!project) return <main className="px-5 py-32 lg:pl-28"><div className="empty-state">Case file niet gevonden. <Link to="/portfolio" className="blueprint-link">Terug naar library</Link></div></main>;

  return (
    <>
      <Helmet><title>{project.title} — Case File</title><meta name="description" content={project.short_description || project.description || project.title} /></Helmet>
      <main className="px-5 pb-24 pt-28 md:px-10 lg:pl-28">
        <article className="mx-auto max-w-[1500px]">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
            <div>
              <span className="blueprint-label relative left-0 top-0">case file / {project.categories?.name || 'digital'}</span>
              <h1 className="mt-8 text-[clamp(4rem,11vw,12rem)] font-black uppercase leading-[.76] tracking-[-.09em]">{project.title}</h1>
            </div>
            <div className="border border-[color:var(--grid)] bg-[color:var(--panel)] p-6">
              <dl className="grid grid-cols-2 gap-5 mono text-xs uppercase tracking-[.22em] text-slate-300">
                <div><dt className="text-[color:var(--accent)]">year</dt><dd>{formatYear(project.created_at)}</dd></div>
                <div><dt className="text-[color:var(--accent)]">category</dt><dd>{project.categories?.name || 'maatwerk'}</dd></div>
                <div><dt className="text-[color:var(--accent)]">status</dt><dd>published</dd></div>
                <div><dt className="text-[color:var(--accent)]">layer</dt><dd>UI / CMS</dd></div>
              </dl>
            </div>
          </div>

          <div className="mt-10 overflow-hidden border border-[color:var(--grid)] bg-slate-900">
            {project.hero_image ? <img src={project.hero_image} alt="" className="max-h-[72svh] w-full object-cover" /> : <div className="blueprint-grid h-[52svh]" />}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[360px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:h-80 border-l border-[color:var(--accent)] pl-6">
              <p className="mono text-xs uppercase tracking-[.3em] text-[color:var(--accent)]">brief</p>
              <p className="mt-4 text-2xl font-bold leading-tight">{project.short_description || 'Een maatwerk case uit de Vos Web Designs database.'}</p>
            </aside>
            <div className="prose-blueprint text-lg leading-9 text-slate-300 whitespace-pre-line">{project.description || project.short_description}</div>
          </div>

          <section className="mt-16">
            <h2 className="mb-6 text-4xl font-black uppercase tracking-[-.05em]">Gallery layers</h2>
            {!gallery.length ? <div className="empty-state">Nog geen afbeeldingen gekoppeld.</div> : (
              <div className="gallery-mosaic">
                {gallery.map((image, index) => (
                  <button type="button" key={image.id || image.url} onClick={() => setLightbox(image)} className={index % 3 === 0 ? 'wide' : ''}>
                    <img src={image.url} alt={image.alt || project.title} loading="lazy" />
                    <span>{image.is_cover ? 'cover' : `layer ${index}`}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </article>
      </main>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)} role="presentation">
          <button type="button" aria-label="Sluit lightbox" onClick={() => setLightbox(null)}><X /></button>
          <img src={lightbox.url} alt={lightbox.alt || project.title} />
        </div>
      )}
    </>
  );
};

export default ProjectDetailPage;
