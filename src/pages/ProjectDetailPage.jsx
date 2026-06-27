import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Layers, TrendingUp } from 'lucide-react';
import PortfolioGallery from '@/components/portfolio/PortfolioGallery';
import { useSettings } from '@/contexts/SettingsContext';
import { useReveal } from '@/hooks/useReveal';
import { getPortfolioByIdWithImages } from '@/lib/portfolio';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const rootRef = useRef(null);
  useReveal(rootRef, [loading, project]);
  const siteName = settings.site_name || 'Vos Web Designs';
  const siteUrl = (import.meta.env.NEXT_PUBLIC_SITE_URL || import.meta.env.VITE_SITE_URL || 'https://voswebdesigns.nl').replace(/\/$/, '');

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
    return <main className="cinema-bg min-h-screen pt-32"><div className="cinematic-container glass-card rounded-2xl p-8 text-center text-slate-300">Project laden…</div></main>;
  }

  if (!project) {
    return <main className="cinema-bg min-h-screen pt-32"><div className="cinematic-container glass-card rounded-2xl p-8 text-center text-slate-300">Project niet gevonden. <Link to="/portfolio" className="text-[color:var(--accent)]">Terug naar portfolio</Link></div></main>;
  }

  const projectDescription = project.short_description || project.description?.slice(0, 160) || 'Project uitgevoerd door Vos Web Designs';
  const projectUrl = `${siteUrl}/portfolio/${projectId}`;
  const projectImage = toAbsoluteUrl(project.hero_image, siteUrl);
  const projectSchema = pruneSchema({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: projectDescription,
    url: projectUrl,
    image: projectImage,
    creator: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    sameAs: project.live_url || undefined,
  });

  return (
    <>
      <Helmet>
        <title>{project.title} – Portfolio | Vos Web Designs</title>
        <meta name="description" content={projectDescription} />
        <script type="application/ld+json">{JSON.stringify(projectSchema)}</script>
      </Helmet>

      <main ref={rootRef} className="cinema-bg min-h-screen overflow-hidden pt-24">
        <section className="cinematic-section pb-8">
          <div className="cinematic-container relative z-10">
            <Link to="/portfolio" className="ghost-button mb-8"><ArrowLeft size={16} /> Terug naar portfolio</Link>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <div>
                <p data-reveal className="section-eyebrow">{project.categories?.name || 'Project case'}</p>
                <h1 data-reveal className="display-xl mt-4 text-[clamp(3.4rem,9vw,7.5rem)]">{project.title}</h1>
                {project.client && <p data-reveal className="mt-5 text-xl text-slate-300">Voor {project.client}</p>}
              </div>
              <div data-reveal className="glass-card grid gap-4 rounded-2xl p-5 sm:grid-cols-3">
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
              <aside data-reveal className="glass-card h-fit rounded-2xl p-6">
                <p className="section-eyebrow">Projectinfo</p>
                <p className="mt-4 text-2xl font-bold leading-tight">{project.short_description || 'Een maatwerk project van Vos Web Designs.'}</p>
                <div className="mt-6 grid gap-3">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="glow-button w-full justify-center">
                      Bekijk live website <ExternalLink size={16} />
                    </a>
                  )}
                  {project.stack && (
                    <div className="rounded-2xl border border-[rgba(140,214,255,.14)] bg-[rgba(8,16,30,.5)] p-4">
                      <span className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-[color:var(--accent)]"><Layers size={14} /> Stack</span>
                      <p className="mt-2 font-bold text-white">{project.stack}</p>
                    </div>
                  )}
                  {project.resultaat && (
                    <div className="rounded-2xl border border-[#38bdf8]/30 bg-[#38bdf8]/10 p-4">
                      <span className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-[#38bdf8]"><TrendingUp size={14} /> Resultaat</span>
                      <p className="mt-2 text-xl font-black text-white">{project.resultaat}</p>
                    </div>
                  )}
                </div>
              </aside>
              <article data-reveal className="glass-card rounded-2xl p-6 md:p-9">
                <h2 className="font-heading text-4xl font-black tracking-[-.05em]">Projectbeschrijving</h2>
                {project.description ? <div className="mt-6 whitespace-pre-wrap text-lg leading-9 text-slate-300">{project.description}</div> : <p className="mt-6 text-slate-400">Er is geen projectbeschrijving toegevoegd.</p>}
              </article>
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/portfolio" className="ghost-button"><ArrowLeft size={16} /> Terug naar portfolio</Link>
              <Link to="/contact" className="glow-button">Start uw project <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const toAbsoluteUrl = (value, siteUrl) => {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
};

const pruneSchema = (value) => {
  if (Array.isArray(value)) {
    return value.map(pruneSchema).filter((item) => item !== undefined);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, entry]) => [key, pruneSchema(entry)])
        .filter(([, entry]) => entry !== undefined && !(Array.isArray(entry) && entry.length === 0))
    );
  }

  return value === '' ? undefined : value;
};

const InfoBlock = ({ label, value }) => (
  <div className="rounded-2xl border border-[color:var(--stroke)] bg-white/[.035] p-4">
    <span className="text-xs uppercase tracking-[.18em] text-[color:var(--accent)]">{label}</span>
    <p className="mt-2 font-bold text-white">{value}</p>
  </div>
);

export default ProjectDetailPage;
