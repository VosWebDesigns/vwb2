import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PortfolioGallery from '@/components/portfolio/PortfolioGallery';
import { getPortfolioByIdWithImages } from '@/lib/portfolio';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProject = async () => {
      setLoading(true);
      const { portfolio, images: galleryImages } = await getPortfolioByIdWithImages(projectId);
      if (mounted) {
        setProject(portfolio);
        setImages(galleryImages || []);
        setLoading(false);
      }
    };

    fetchProject();
    return () => { mounted = false; };
  }, [projectId]);

  if (loading) {
    return <main className="cinema-bg min-h-screen pt-32"><div className="cinematic-container panel cut p-8 text-center text-slate-300">Project laden…</div></main>;
  }

  if (!project) {
    return <main className="cinema-bg min-h-screen pt-32"><div className="cinematic-container panel cut p-8 text-center text-slate-300">Project niet gevonden. <Link to="/portfolio" className="text-[color:var(--accent)]">Terug naar portfolio</Link></div></main>;
  }

  return (
    <>
      <Helmet>
        <title>{project.title} – Portfolio | Vos Web Designs</title>
        <meta name="description" content={project.short_description || project.description?.slice(0, 160) || 'Project uitgevoerd door Vos Web Designs'} />
      </Helmet>

      <main className="cinema-bg min-h-screen pt-24">
        <section className="cinematic-section pb-8">
          <div className="cinematic-container relative z-10">
            <Link to="/portfolio" className="ghost-link mb-8"><ArrowLeft size={18} /> Terug naar portfolio</Link>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <div>
                <p className="eyebrow">{project.categories?.name || 'Project case'}</p>
                <h1 className="display-title mt-4 text-[clamp(3.6rem,10vw,8rem)]">{project.title}</h1>
                {project.client && <p className="mt-5 text-xl text-slate-300">Voor {project.client}</p>}
              </div>
              <div className="panel cut grid gap-4 p-5 sm:grid-cols-3">
                <InfoBlock label="Client" value={project.client || 'Niet opgegeven'} />
                <InfoBlock label="Jaar" value={project.year || (project.created_at ? new Date(project.created_at).getFullYear() : '—')} />
                <InfoBlock label="Projectduur" value={project.duration || 'Niet gespecificeerd'} />
              </div>
            </div>
          </div>
        </section>

        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            <PortfolioGallery title={project.title} images={images} fallbackImage={project.hero_image} />
            <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
              <aside className="panel cut h-fit p-6">
                <p className="eyebrow">Projectinfo</p>
                <p className="mt-4 text-2xl font-bold leading-tight">{project.short_description || 'Een maatwerk project van Vos Web Designs.'}</p>
              </aside>
              <article className="panel cut p-6 md:p-9">
                <h2 className="font-heading text-4xl font-black tracking-[-.05em]">Projectbeschrijving</h2>
                {project.description ? <div className="mt-6 whitespace-pre-wrap text-lg leading-9 text-slate-300">{project.description}</div> : <p className="mt-6 text-slate-400">Er is geen projectbeschrijving toegevoegd.</p>}
              </article>
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/portfolio" className="ghost-link"><ArrowLeft size={18} /> Terug naar portfolio</Link>
              <Link to="/contact" className="cta-link">Start uw project <ArrowRight size={18} /></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const InfoBlock = ({ label, value }) => (
  <div className="rounded-2xl border border-[color:var(--stroke)] bg-white/[.035] p-4">
    <span className="text-xs uppercase tracking-[.18em] text-[color:var(--accent)]">{label}</span>
    <p className="mt-2 font-bold text-white">{value}</p>
  </div>
);

export default ProjectDetailPage;
