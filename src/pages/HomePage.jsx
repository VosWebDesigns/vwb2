import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, CheckCircle, Cpu, Globe, Layers, Quote, Shield, Zap, ArrowUpRight,
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import SmartImage from '@/components/SmartImage';
import FuturisticHero from '@/components/FuturisticHero';
import TechMarquee from '@/components/TechMarquee';

gsap.registerPlugin(ScrollTrigger);

const logSupabaseError = (label, error) => {
  if (!error) return;
  console.error(label, { message: error.message, code: error.code });
};

const HOME_PROJECT_SELECT =
  'id,title,short_description,hero_image,featured_preview_image,home_featured,is_featured,created_at,categories(name)';

const CAPABILITIES = [
  {
    icon: <Globe size={22} />,
    title: '3D Web Experiences',
    description: 'Realtime Three.js / WebGL scènes, particle systems en cinematische scroll animaties die bezoekers omhullen.',
    tag: 'Three.js · WebGL',
    accent: 'cyan',
  },
  {
    icon: <Layers size={22} />,
    title: 'Glassmorphism UI',
    description: 'Interface systemen met backdrop-blur, floating grids en premium glassmorphism panels — als een futuristisch OS.',
    tag: 'Figma · CSS3',
    accent: 'lime',
  },
  {
    icon: <Zap size={22} />,
    title: 'GSAP Animaties',
    description: 'Cinematische reveals, ScrollTrigger-gedreven parallax en gestaggerde typografie animaties op Apple-niveau.',
    tag: 'GSAP · ScrollTrigger',
    accent: 'cyan',
  },
  {
    icon: <Cpu size={22} />,
    title: 'Supabase Backend',
    description: 'Realtime database, auth, en opslag — schaalbaar en veilig direct vanuit de browser zonder tussenlaag.',
    tag: 'Supabase · PostgreSQL',
    accent: 'lime',
  },
  {
    icon: <Shield size={22} />,
    title: 'Performance & SEO',
    description: 'Vite-gebundeld, code-split en geoptimaliseerd voor Core Web Vitals. Sub-2-seconde laadtijden standaard.',
    tag: 'Vite · Lighthouse 100',
    accent: 'cyan',
  },
  {
    icon: <CheckCircle size={22} />,
    title: 'Full-service Studio',
    description: 'Van strategie en wireframes tot live deployment en groei-analyses. Eén team, geen tussenpersonen.',
    tag: 'End-to-end',
    accent: 'lime',
  },
];

const PROCESS = [
  { num: '01', title: 'Discovery & Strategie', desc: 'We verkennen uw doelen, doelgroep en concurrentie. Resultaat: een helder strategisch fundament en scope-document.' },
  { num: '02', title: 'Design System', desc: 'UI-componenten, kleurpaletten en typografie gebouwd in Figma. U ziet het complete visuele systeem vóór één regel code.' },
  { num: '03', title: 'Development Sprint', desc: 'React + Vite + Supabase. Dagelijkse deploys naar staging zodat u de voortgang realtime volgt.' },
  { num: '04', title: 'Launch & Groei', desc: 'Live-zetten, SEO-check, analytics en 3 maanden post-launch support. Uw investering begint direct te renderen.' },
];

const STATS = [
  { value: 48,   suffix: 'u',  label: 'Gemiddelde doorlooptijd design', prefix: '' },
  { value: 3,    suffix: '×',  label: 'Meer conversies vs template-sites', prefix: '' },
  { value: 99,   suffix: '%',  label: 'Klant-tevredenheidsscore', prefix: '' },
  { value: 2,    suffix: 's',  label: 'Gemiddelde laadtijd', prefix: '<' },
];

/* ── Animated stat counter ── */
const StatCard = ({ value, suffix, prefix, label, index }) => {
  const ref    = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const el    = ref.current;
    const numEl = numRef.current;
    if (!el || !numEl) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
      tl.fromTo(el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, delay: index * 0.12, ease: 'power3.out' }
      ).fromTo({ n: 0 },
        { n: 0 },
        {
          n: value,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: function () { numEl.textContent = Math.round(this.targets()[0].n); },
        },
        '<0.3'
      );
    });
    return () => ctx.revert();
  }, [index, value]);

  return (
    <div ref={ref} className="glass-card cyber-corner rounded-2xl p-6 text-center relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(140,214,255,.08), transparent 70%)' }}
        aria-hidden="true"
      />
      <p className="stat-num text-[clamp(2.6rem,5vw,4.5rem)] leading-none tabular-nums">
        <span className="text-[var(--accent2)]">{prefix}</span>
        <span ref={numRef}>{value}</span>
        <span className="text-[var(--accent2)]">{suffix}</span>
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[.22em] text-slate-500">{label}</p>
    </div>
  );
};

/* ── Capability card ── */
const CapabilityCard = ({ cap, index }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 36, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7,
          delay: (index % 3) * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  const isCyan = cap.accent === 'cyan';

  return (
    <article ref={ref} className="glass-card group rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(140,214,255,.12)]">
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: isCyan
            ? 'radial-gradient(circle at 0% 0%, rgba(140,214,255,.07), transparent 65%)'
            : 'radial-gradient(circle at 0% 0%, rgba(214,245,122,.06), transparent 65%)',
        }}
        aria-hidden="true"
      />
      {/* Top accent line on hover */}
      <div
        className={`absolute inset-x-0 top-0 h-px scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${isCyan ? 'bg-[var(--accent)]' : 'bg-[var(--accent2)]'}`}
        aria-hidden="true"
      />
      <div className="flex items-start gap-4 relative">
        <div
          className={`capability-icon-wrap ${isCyan ? 'text-[var(--accent)]' : 'text-[var(--accent2)]'}`}
        >
          {cap.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-bold text-white leading-tight">{cap.title}</h3>
          <span className="holo-tag mt-2 text-[10px]">{cap.tag}</span>
        </div>
      </div>
      <p className="text-sm leading-7 text-slate-400 relative">{cap.description}</p>
    </article>
  );
};

/* ── Project card ── */
const ProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const img = project.featured_preview_image || project.hero_image;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, delay: index * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <article ref={ref} className="project-card group">
      <Link to={`/portfolio/${project.id}`} className="block">
        <div className="overflow-hidden relative">
          {img ? (
            <SmartImage src={img} alt={project.title} className="project-card-img" />
          ) : (
            <div className="project-card-img bg-[radial-gradient(circle_at_30%_30%,rgba(140,214,255,.15),transparent_50%)] flex items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-600">No preview</span>
            </div>
          )}
          {/* Scan overlay on hover */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(2,8,16,.6))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="p-5">
          <span className="holo-tag text-[10px]">{project.categories?.name || 'Maatwerk'}</span>
          <h3 className="mt-3 font-heading text-xl font-bold text-white tracking-tight">{project.title}</h3>
          {project.short_description && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{project.short_description}</p>
          )}
          <div className="mt-4 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.18em] text-[var(--accent)] transition-all duration-300 group-hover:gap-2.5">
            Open case <ArrowUpRight size={12} />
          </div>
        </div>
      </Link>
    </article>
  );
};

/* ── Testimonial card ── */
const TestimonialCard = ({ testimonial, featured = false, index = 0 }) => {
  const ref  = useRef(null);
  const text = testimonial?.text?.trim() || 'Reviewtekst ontbreekt';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, delay: index * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <figure ref={ref} className={`glass-card rounded-2xl relative overflow-hidden ${featured ? 'p-8 md:p-10' : 'p-6'}`}>
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-12 h-12 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-0 w-px h-6 bg-[var(--accent2)]" />
        <div className="absolute top-0 left-0 h-px w-6 bg-[var(--accent2)]" />
      </div>
      <Quote className={`${featured ? 'mb-5 h-8 w-8' : 'mb-4 h-6 w-6'} text-[var(--accent2)]`} aria-hidden="true" />
      <blockquote className={`font-heading text-white ${featured ? 'text-xl leading-8 md:text-2xl' : 'text-base leading-7'} ${!featured && 'line-clamp-5'}`}>
        {text}
      </blockquote>
      <figcaption className="mt-5 font-mono text-[11px] uppercase tracking-[.22em] text-[var(--accent)]">
        {testimonial?.name || 'Anonieme klant'}
        {testimonial?.company ? ` — ${testimonial.company}` : ''}
      </figcaption>
    </figure>
  );
};

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="status-dot" />
    <p className="section-eyebrow">{children}</p>
  </div>
);

const Divider = ({ lime = false }) => (
  <div className={`h-px w-full ${lime ? 'divider-lime' : 'divider-glow'}`} aria-hidden="true" />
);

/* ── Main page ── */
const HomePage = () => {
  const [projects,     setProjects]     = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading,      setLoading]      = useState(true);

  const procRef    = useRef(null);
  const missionRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const fetchHomeData = async () => {
      setLoading(true);

      const { data: featuredData, error: featuredError } = await supabase
        .from('projects')
        .select(HOME_PROJECT_SELECT)
        .or('is_published.is.null,is_published.eq.true')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      logSupabaseError('HOME_FEATURED_PROJECTS_ERROR', featuredError);

      let projectData = featuredData || [];
      if (!featuredError && projectData.length === 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('projects')
          .select(HOME_PROJECT_SELECT)
          .or('is_published.is.null,is_published.eq.true')
          .order('created_at', { ascending: false })
          .limit(3);
        logSupabaseError('HOME_PROJECTS_FALLBACK_ERROR', fallbackError);
        projectData = fallbackData || [];
      }

      const { data: testimonialData, error: testimonialError } = await supabase
        .from('testimonials')
        .select('id,name,company,text,rating,is_visible,sort_order,created_at')
        .or('is_visible.is.null,is_visible.eq.true')
        .order('sort_order', { ascending: true })
        .limit(3);

      logSupabaseError('TESTIMONIALS_FETCH_ERROR', testimonialError);

      if (mounted) {
        setProjects(projectData);
        setTestimonials(testimonialData || []);
        setLoading(false);
      }
    };

    fetchHomeData();
    return () => { mounted = false; };
  }, []);

  /* Mission statement reveal */
  useEffect(() => {
    const el = missionRef.current;
    if (!el) return;
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      const words = el.querySelectorAll('.mission-word');
      gsap.fromTo(words,
        isMobile ? { opacity: 0, y: 40 } : { opacity: 0, y: 50, rotateX: 25 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 1.1, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 78%' },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  /* Process steps reveal */
  useEffect(() => {
    const el = procRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const steps = el.querySelectorAll('.process-step');
      steps.forEach((step, i) => {
        gsap.fromTo(step,
          { opacity: 0, y: 30, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 88%' },
            delay: i * 0.1,
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const smallTestimonials = useMemo(() => testimonials.slice(1, 3), [testimonials]);

  const missionWords = ['Geen', 'templates.', 'Geen', 'compromissen.', 'Alleen', 'resultaat.'];

  return (
    <>
      <Helmet>
        <title>Vos Web Designs — Futuristic 3D Web Design Studio Nederland</title>
        <meta
          name="description"
          content="Premium webdesign bureau met 3D interfaces, cinematische animaties en futuristische UI. Wij bouwen ervaringen die indruk maken."
        />
      </Helmet>

      <main className="overflow-hidden">

        {/* ── Hero ── */}
        <FuturisticHero />

        {/* ── Tech Stack Marquee ── */}
        <TechMarquee />

        {/* ── Stats ── */}
        <section
          className="relative py-16 px-5 md:py-24 md:px-10"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,165,233,.07) 0%, transparent 70%)' }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
              <div>
                <SectionLabel>In cijfers</SectionLabel>
                <h2 className="display-xl text-[clamp(2.4rem,6vw,5.5rem)]">
                  Resultaten die{' '}
                  <span className="gradient-text-cyan">spreken</span>
                </h2>
              </div>
              <p className="text-base leading-8 text-slate-400 lg:max-w-sm">
                Meetbare resultaten voor elke klant — van snelheid en conversie tot tevredenheid.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <StatCard key={s.label} {...s} index={i} />
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Mission Statement ── */}
        <section className="relative py-24 px-5 md:px-10 overflow-hidden">
          {/* Faint grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'linear-gradient(rgba(140,214,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(140,214,255,.06) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-5xl text-center" ref={missionRef} style={{ perspective: '700px' }}>
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="status-dot status-dot-cyan" />
              <span className="hud-label">Studio Statement 2025</span>
              <span className="status-dot status-dot-cyan" />
            </div>
            <h2
              className="font-heading text-[clamp(2.2rem,9vw,8rem)] font-black uppercase leading-[.85] tracking-[-.06em] text-white"
              aria-label={missionWords.join(' ')}
            >
              {missionWords.map((w, i) => (
                <span
                  key={i}
                  className={`mission-word inline-block mr-[0.22em] ${i % 2 !== 0 ? 'gradient-text-full' : ''}`}
                >
                  {w}
                </span>
              ))}
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-400">
              Wij geloven dat elk bedrijf een website verdient die voelt als de toekomst —
              niet als een gratis theme. Maatwerk van A tot Z, zonder tussenlaag.
            </p>
            <Link
              to="/over-ons"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-[rgba(140,214,255,.25)] px-6 py-3 text-sm font-bold uppercase tracking-[.14em] text-[var(--accent)] transition hover:bg-[rgba(140,214,255,.08)] hover:border-[rgba(140,214,255,.5)]"
            >
              Over ons <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <Divider lime />

        {/* ── Capabilities ── */}
        <section className="relative py-24 px-5 md:px-10 sci-fi-grid">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <SectionLabel>Wat wij bouwen</SectionLabel>
                <h2 className="display-xl text-[clamp(2.4rem,6vw,5.5rem)]">
                  De complete{' '}
                  <span className="gradient-text-full">tech stack</span>{' '}
                  voor uw toekomst.
                </h2>
              </div>
              <Link to="/diensten" className="ghost-button shrink-0 self-start sm:self-auto">
                Alle diensten <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((cap, i) => (
                <CapabilityCard key={cap.title} cap={cap} index={i} />
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Featured Projects ── */}
        <section className="relative py-24 px-5 md:px-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 55% 55% at 80% 40%, rgba(14,165,233,.05), transparent)' }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>Portfolio</SectionLabel>
                <h2 className="display-xl text-[clamp(2.8rem,7vw,6rem)]">
                  Uitgelichte{' '}
                  <span className="gradient-text-cyan">projecten</span>
                </h2>
              </div>
              <Link to="/portfolio" className="ghost-button shrink-0 self-start sm:self-auto">
                Alle projecten <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card rounded-2xl aspect-[4/5] animate-pulse" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4">Nog geen projecten</p>
                <p className="text-slate-400 mb-6">Voeg projecten toe via de admin om ze hier te tonen.</p>
                <Link to="/contact" className="glow-button">
                  Start uw eerste project <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Divider lime />

        {/* ── Process ── */}
        <section
          ref={procRef}
          className="relative py-24 px-5 md:px-10"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(214,245,122,.04) 0%, transparent 60%)' }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-end">
              <div>
                <SectionLabel>Werkwijze</SectionLabel>
                <h2 className="display-xl text-[clamp(2.4rem,6vw,5.5rem)]">
                  Van idee naar{' '}
                  <span className="gradient-text-full">live website</span>
                </h2>
              </div>
              <p className="text-base leading-8 text-slate-400 lg:max-w-md">
                Ons proces is transparant en gebouwd voor snelheid. Geen verrassingen — wel een verbluffend resultaat.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((step, i) => (
                <div key={step.num} className="process-step glass-card rounded-2xl p-6 relative overflow-hidden">
                  <span className="feature-num absolute -top-1 right-2 select-none pointer-events-none">{step.num}</span>
                  <div className="relative">
                    <span className="font-mono text-[10px] uppercase tracking-[.24em] text-[var(--accent2)]">{step.num}</span>
                    <h3 className="mt-3 font-heading text-lg font-bold text-white leading-tight">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link to="/werkwijze" className="ghost-button">
                Volledige werkwijze <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Testimonials ── */}
        {testimonials.length > 0 && (
          <section className="relative py-24 px-5 md:px-10">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(14,165,233,.05), transparent)' }}
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-6xl">
              <div className="mb-16">
                <SectionLabel>Klantreacties</SectionLabel>
                <h2 className="display-xl text-[clamp(2.8rem,7vw,6rem)]">
                  Wat klanten{' '}
                  <span className="gradient-text-cyan">zeggen</span>
                </h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
                {testimonials[0] && (
                  <TestimonialCard testimonial={testimonials[0]} featured index={0} />
                )}
                <div className="flex flex-col gap-4">
                  {smallTestimonials.map((t, i) => (
                    <TestimonialCard key={t.id || i} testimonial={t} index={i + 1} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <Divider lime />

        {/* ── CTA ── */}
        <section className="relative py-28 px-5 md:px-10 cta-section-bg">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,214,255,.4)] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,214,255,.2)] to-transparent" />

          <div
            className="mx-auto max-w-4xl glass-card cyber-corner rounded-3xl p-6 md:p-10 lg:p-16 text-center relative overflow-hidden"
            style={{ animation: 'glow-pulse 4s ease-in-out infinite' }}
          >
            <div className="pointer-events-none absolute inset-0 sci-fi-grid-fine opacity-40" aria-hidden="true" />
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-center gap-2.5">
                <span className="status-dot" />
                <span className="holo-tag inline-flex">
                  Beschikbaar voor nieuwe projecten
                </span>
                <span className="status-dot" />
              </div>
              <h2 className="display-xl text-[clamp(2.4rem,6vw,5.5rem)] mt-4">
                Klaar om te bouwen
                <br />
                <span className="gradient-text-full">aan de toekomst?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-400">
                Plan een vrijblijvend gesprek en ontdek hoe wij uw digitale aanwezigheid transformeren naar een premium ervaring.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <Link to="/contact" className="glow-button">
                  Start een project <ArrowRight size={16} />
                </Link>
                <Link to="/portfolio" className="ghost-button">
                  Bekijk portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default HomePage;
