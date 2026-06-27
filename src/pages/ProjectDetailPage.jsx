import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Layers, TrendingUp } from 'lucide-react';
import PortfolioGallery from '@/components/portfolio/PortfolioGallery';
import { useSettings } from '@/contexts/SettingsContext';
import { useReveal } from '@/hooks/useReveal';
import { getPortfolioByIdWithImages } from '@/lib/portfolio';

const toAbsoluteUrl = (value, siteUrl) => {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
};

const pruneSchema = (value) => {
  if (Array.isArray(value)) return value.map(pruneSchema).filter((item) => item !== undefined);
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
  <div className="rounded-xl border border-[var(--stroke)] bg-white/[.035] p-4">
    <span className="hud-label block mb-2">{label}</span>
    <p className="font-bold text-white text-sm">{value}</p>
  </div>
);

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const rootRef   = useRef(null);
  const siteName  = settings.site_name || 'Vos Web Designs';
  const siteUrl   = (import.meta.env.NEXT_PUBLIC_SITE_URL || import.meta.env.VITE_SITE_URL || 'https://voswebdesigns.nl').replace(/\/$/, '');

  useReveal(rootRef, [loading, project]);

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
    return (
      <main className="cinema-bg min-h-screen pt-32">
        <div className="cinematic-container">
          <div className="glass-card rounded-2xl p-12 text-center">
            <span className="status-dot mx-auto mb-4 block" />
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">
              Project laden…
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="cinema-bg min-h-screen pt-32">
        <div className="cinematic-container">
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-slate-400 mb-6">Project niet gevonden.</p>
            <Link to="/portfolio" className="ghost-button">
              <ArrowLeft size={15} /> Terug naar portfolio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const projectDescription = project.short_description || project.description?.slice(0, 160) || 'Project uitgevoerd door Vos Web Designs';
  const projectUrl         = `${siteUrl}/portfolio/${projectId}`;
  const projectImage       = toAbsoluteUrl(project.hero_image, siteUrl);
  const projectSchema      = pruneSchema({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: projectDescription,
    url: projectUrl,
    image: projectImage,
    creator: { '@type': 'Organization', name: siteName, url: siteUrl },
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

        {/* ── Hero ── */}
        <section className="cinematic-section pb-8 relative overflow-hidden">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,169,110,.1), transparent)' }}
            aria-hidden="true"
          />
          <div className="cinematic-container relative z-10">
            <Link to="/portfolio" className="ghost-button mb-10 inline-flex">
              <ArrowLeft size={15} /> Terug naar portfolio
            </Link>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="status-dot" />
                  <p data-reveal className="section-eyebrow">
                    {project.categories?.name || 'Project case'}
                  </p>
                </div>
                <h1 data-reveal className="display-xl mt-0 text-[clamp(3rem,8vw,7rem)]">
                  {project.title}
                </h1>
                {project.client && (
                  <p data-reveal className="mt-5 text-xl text-slate-300">
                    Voor <span className="text-white font-bold">{project.client}</span>
                  </p>
                )}
              </div>

              <div data-reveal className="glass-card cyber-corner rounded-2xl p-5">
                <span className="hud-label block mb-4">Projectmeta</span>
                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoBlock label="Client"      value={project.client || 'Niet opgegeven'} />
                  <InfoBlock label="Jaar"         value={project.year || (project.created_at ? new Date(project.created_at).getFullYear() : '—')} />
                  <InfoBlock label="Projectduur"  value={project.duration || 'Niet gespecificeerd'} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            <PortfolioGallery title={project.title} images={images} fallbackImage={project.hero_image} />

            <div className="grid gap-8 lg:grid-cols-[300px_1fr] mt-4">
              {/* Sidebar */}
              <aside data-reveal className="glass-card h-fit rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="status-dot status-dot-cyan" />
                  <span className="section-eyebrow text-[10px]">Projectinfo</span>
                </div>
                <p className="text-lg font-bold leading-tight text-white">
                  {project.short_description || 'Een maatwerk project van Vos Web Designs.'}
                </p>
                <div className="mt-6 grid gap-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="glow-button w-full justify-center"
                    >
                      Bekijk live website <ExternalLink size={15} />
                    </a>
                  )}
                  {project.stack && (
                    <div className="rounded-xl border border-[rgba(201,169,110,.14)] bg-[rgba(8,16,30,.5)] p-4">
                      <span className="flex items-center gap-2 hud-label">
                        <Layers size={12} /> Stack
                      </span>
                      <p className="mt-2 text-sm font-bold text-white">{project.stack}</p>
                    </div>
                  )}
                  {project.resultaat && (
                    <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/8 p-4">
                      <span className="flex items-center gap-2 hud-label text-[var(--accent)]">
                        <TrendingUp size={12} /> Resultaat
                      </span>
                      <p className="mt-2 text-xl font-black text-white">{project.resultaat}</p>
                    </div>
                  )}
                </div>
              </aside>

              {/* Main content */}
              <article data-reveal className="glass-card rounded-2xl p-7 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="status-dot status-dot-cyan" />
                  <h2 className="font-heading text-3xl font-black tracking-[-.04em]">
                    Projectbeschrijving
                  </h2>
                </div>
                {project.description ? (
                  <div className="whitespace-pre-wrap text-base leading-9 text-slate-300">
                    {project.description}
                  </div>
                ) : (
                  <p className="text-slate-500 font-mono text-sm">
                    Er is geen projectbeschrijving toegevoegd.
                  </p>
                )}
              </article>
            </div>

            {/* Bottom nav */}
            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/portfolio" className="ghost-button">
                <ArrowLeft size={15} /> Terug naar portfolio
              </Link>
              <Link to="/contact" className="glow-button">
                Start uw project <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default ProjectDetailPage;
