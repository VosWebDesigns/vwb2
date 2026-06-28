import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { useSettings } from '@/contexts/SettingsContext';
import { getPortfolioByIdWithImages } from '@/lib/portfolio';

gsap.registerPlugin(ScrollTrigger);

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

const MetaCell = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex-1 min-w-[130px] px-6 py-5" style={{ borderRight: '1px solid rgba(204,255,0,.06)' }}>
      <p className="font-mono uppercase tracking-[.24em] mb-2" style={{ fontSize: '.44rem', color: 'rgba(204,255,0,.28)' }}>
        {label}
      </p>
      <p className="font-heading font-bold text-sm leading-tight" style={{ color: 'var(--accent3)' }}>
        {value}
      </p>
    </div>
  );
};

const SectionDivider = ({ num, label }) => (
  <div className="flex items-center gap-4 mb-10">
    <span className="font-mono uppercase tracking-[.28em]" style={{ fontSize: '.46rem', color: 'rgba(204,255,0,.28)' }}>
      {num}
    </span>
    <div className="flex-1 h-px" style={{ background: 'rgba(204,255,0,.08)' }} />
    <span className="font-mono uppercase tracking-[.28em]" style={{ fontSize: '.46rem', color: 'rgba(204,255,0,.28)' }}>
      {label}
    </span>
  </div>
);

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  const rootRef    = useRef(null);
  const heroImgRef = useRef(null);
  const catRef     = useRef(null);
  const titleRef   = useRef(null);
  const metaRef    = useRef(null);

  const siteName = settings.site_name || 'Vos Web Designs';
  const siteUrl  = (import.meta.env.NEXT_PUBLIC_SITE_URL || import.meta.env.VITE_SITE_URL || 'https://voswebdesigns.nl').replace(/\/$/, '');

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

  useEffect(() => {
    if (loading || !project || !heroImgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(heroImgRef.current, { clipPath: 'inset(100% 0 0 0)' });
      gsap.set([catRef.current, titleRef.current], { opacity: 0, y: 28 });
      gsap.set(metaRef.current, { opacity: 0, y: 16 });

      const tl = gsap.timeline({ delay: 0.05, defaults: { ease: 'power4.out' } });
      tl.to(heroImgRef.current, { clipPath: 'inset(0% 0 0 0)', duration: 1.3 })
        .to(catRef.current,   { opacity: 1, y: 0, duration: 0.7 }, '-=0.65')
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.9 }, '-=0.60')
        .to(metaRef.current,  { opacity: 1, y: 0, duration: 0.7 }, '-=0.50');
    }, rootRef);
    return () => ctx.revert();
  }, [loading, project]);

  if (loading) {
    return (
      <main className="min-h-screen pt-32" style={{ background: 'var(--bg)' }}>
        <div className="mx-auto max-w-6xl px-5 py-24 text-center">
          <span className="status-dot mx-auto mb-4 block" />
          <p className="font-mono text-xs uppercase tracking-widest animate-pulse" style={{ color: 'rgba(204,255,0,.25)' }}>
            Project laden…
          </p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen pt-32" style={{ background: 'var(--bg)' }}>
        <div className="mx-auto max-w-6xl px-5 py-24 text-center">
          <p className="text-slate-400 mb-6">Project niet gevonden.</p>
          <Link to="/portfolio" className="ghost-button">
            <ArrowLeft size={15} /> Terug naar portfolio
          </Link>
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

  const year = project.year || (project.created_at ? new Date(project.created_at).getFullYear() : null);
  const heroImg = project.hero_image || images[0]?.url;
  const [firstGalleryImg, ...restGalleryImgs] = images;

  return (
    <>
      <Helmet>
        <title>{project.title} – Portfolio | {siteName}</title>
        <meta name="description" content={projectDescription} />
        <script type="application/ld+json">{JSON.stringify(projectSchema)}</script>
      </Helmet>

      <main ref={rootRef} style={{ background: 'var(--bg)' }} className="overflow-hidden">

        {/* ── CINEMATIC HERO ── */}
        <section className="relative overflow-hidden" style={{ height: '75vh', minHeight: 500 }}>
          {/* Back link */}
          <div className="absolute top-0 left-0 z-20 pt-24 px-6 md:px-10">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 font-mono uppercase tracking-[.24em] opacity-70 hover:opacity-100 transition-opacity"
              style={{ fontSize: '.5rem', color: 'var(--accent)' }}
            >
              <ArrowLeft size={12} /> Portfolio
            </Link>
          </div>

          {/* Hero image with clip-path reveal */}
          <div ref={heroImgRef} className="absolute inset-0">
            {heroImg ? (
              <SmartImage
                src={heroImg}
                alt={project.title}
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(204,255,0,.12), rgba(6,6,8,1) 65%)' }}
              />
            )}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(6,6,8,1) 0%, rgba(6,6,8,.55) 38%, rgba(6,6,8,.08) 72%, rgba(6,6,8,.40) 100%)' }}
            />
          </div>

          {/* Title overlay — bottom left */}
          <div className="absolute bottom-0 left-0 z-10 px-6 pb-10 md:px-10 md:pb-14 lg:px-16">
            <p
              ref={catRef}
              className="font-mono uppercase tracking-[.28em] mb-4"
              style={{ fontSize: '.5rem', color: 'var(--accent)' }}
            >
              {project.categories?.name || 'Project'}
            </p>
            <h1
              ref={titleRef}
              className="font-heading font-bold uppercase leading-none"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 'clamp(2.6rem, 7vw, 7.5rem)',
                letterSpacing: '-.055em',
                color: 'var(--accent3)',
              }}
            >
              {project.title}
            </h1>
          </div>
        </section>

        {/* ── META STRIP ── */}
        <div
          ref={metaRef}
          className="overflow-x-auto"
          style={{ borderBottom: '1px solid rgba(204,255,0,.06)' }}
        >
          <div className="flex" style={{ borderTop: '1px solid rgba(204,255,0,.06)', minWidth: 'max-content' }}>
            <MetaCell label="Client"       value={project.client} />
            <MetaCell label="Jaar"         value={year?.toString()} />
            <MetaCell label="Categorie"    value={project.categories?.name} />
            <MetaCell label="Doorlooptijd" value={project.duration} />
            <MetaCell label="Stack"        value={project.stack} />
            {project.live_url && (
              <div className="flex-1 min-w-[120px] px-6 py-5 flex items-center">
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[.24em] opacity-70 hover:opacity-100 transition-opacity"
                  style={{ fontSize: '.46rem', color: 'var(--accent)' }}
                >
                  Live site <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── LEDE / SHORT DESCRIPTION ── */}
        {project.short_description && (
          <section className="px-6 py-16 md:px-10 lg:px-16 xl:px-24">
            <div className="mx-auto max-w-3xl">
              <p
                className="font-heading font-bold leading-[1.18] tracking-[-0.03em]"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 'clamp(1.4rem, 2.6vw, 2.5rem)',
                  color: 'var(--accent3)',
                }}
              >
                {project.short_description}
              </p>
            </div>
          </section>
        )}

        {/* ── FIRST GALLERY IMAGE — cinematic 21/9 ── */}
        {firstGalleryImg && (
          <section className="px-6 pb-4 md:px-10 lg:px-16 xl:px-24">
            <div
              className="overflow-hidden rounded-2xl"
              style={{ aspectRatio: '21/9' }}
            >
              <SmartImage
                src={firstGalleryImg.url}
                alt={firstGalleryImg.alt || project.title}
                className="h-full w-full object-cover"
              />
            </div>
          </section>
        )}

        {/* ── DESCRIPTION (2-column editorial) ── */}
        {project.description && (
          <section className="px-6 py-16 md:px-10 lg:px-16 xl:px-24">
            <SectionDivider num="01" label="Projectbeschrijving" />
            <div
              className="lg:columns-2 gap-12 text-base leading-9 whitespace-pre-wrap"
              style={{ color: 'rgba(240,237,230,.52)' }}
            >
              {project.description}
            </div>
          </section>
        )}

        {/* ── RESULTAAT ── */}
        {project.resultaat && (
          <section
            className="relative px-6 py-24 md:px-10 lg:px-16 xl:px-24 overflow-hidden text-center"
            style={{ borderTop: '1px solid rgba(204,255,0,.06)', borderBottom: '1px solid rgba(204,255,0,.06)' }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(204,255,0,.05), transparent)' }}
              aria-hidden="true"
            />
            <p className="relative font-mono uppercase tracking-[.32em] mb-6" style={{ fontSize: '.5rem', color: 'rgba(204,255,0,.35)' }}>
              — Resultaat
            </p>
            <p
              className="relative font-heading font-bold leading-none"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 'clamp(2.8rem, 8vw, 8rem)',
                letterSpacing: '-.06em',
                color: 'var(--accent)',
              }}
            >
              {project.resultaat}
            </p>
          </section>
        )}

        {/* ── REST OF GALLERY ── */}
        {restGalleryImgs.length > 0 && (
          <section className="px-6 py-14 md:px-10 lg:px-16 xl:px-24">
            <SectionDivider num="02" label="Beeldmateriaal" />
            <div className="grid gap-4 md:grid-cols-2">
              {restGalleryImgs.map((img, i) => (
                <div
                  key={img.id || img.url}
                  className="overflow-hidden rounded-2xl"
                  style={{ aspectRatio: i % 3 === 0 ? '3/4' : '4/3' }}
                >
                  <SmartImage
                    src={img.url}
                    alt={img.alt || `${project.title} — afbeelding ${i + 2}`}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── BOTTOM CTA ── */}
        <section
          className="relative px-6 py-24 md:px-10 lg:px-16 xl:px-24 overflow-hidden"
          style={{ borderTop: '1px solid rgba(204,255,0,.06)' }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(204,255,0,.22), transparent)' }}
            aria-hidden="true"
          />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <Link to="/portfolio" className="ghost-button">
              <ArrowLeft size={14} /> Terug naar portfolio
            </Link>
            <div className="flex flex-col items-start md:items-end gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="glow-button"
                  data-magnetic
                >
                  Bekijk live website <ArrowUpRight size={14} />
                </a>
              )}
              <Link to="/contact" className="ghost-button" data-magnetic>
                Start uw project <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default ProjectDetailPage;
