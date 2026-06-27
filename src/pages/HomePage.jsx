import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle, Cpu, Globe, Layers, Quote, Shield, Zap } from 'lucide-react';
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
  },
  {
    icon: <Layers size={22} />,
    title: 'Glassmorphism UI',
    description: 'Interface systemen met backdrop-blur, floating grids en premium glassmorphism panels — als een futuristisch OS.',
    tag: 'Figma · CSS3',
  },
  {
    icon: <Zap size={22} />,
    title: 'GSAP Animaties',
    description: 'Cinematische reveals, ScrollTrigger-gedreven parallax en gestaggerde typografie animaties op Apple-niveau.',
    tag: 'GSAP · ScrollTrigger',
  },
  {
    icon: <Cpu size={22} />,
    title: 'Supabase Backend',
    description: 'Realtime database, auth, en opslag — schaalbaar en veilig direct vanuit de browser zonder tussenlaag.',
    tag: 'Supabase · PostgreSQL',
  },
  {
    icon: <Shield size={22} />,
    title: 'Performance & SEO',
    description: 'Vite-gebundeld, code-split en geoptimaliseerd voor Core Web Vitals. Sub-2-seconde laadtijden standaard.',
    tag: 'Vite · Lighthouse 100',
  },
  {
    icon: <CheckCircle size={22} />,
    title: 'Full-service Studio',
    description: 'Van strategie en wireframes tot live deployment en groei-analyses. Eén team, geen tussenpersonen.',
    tag: 'End-to-end',
  },
];

const PROCESS = [
  { num: '01', title: 'Discovery & Strategie', desc: 'We verkennen uw doelen, doelgroep en concurrentie. Resultaat: een helder strategisch fundament en scope-document.' },
  { num: '02', title: 'Design System', desc: 'UI-componenten, kleurpaletten en typografie gebouwd in Figma. U ziet het complete visuele systeem vóór één regel code.' },
  { num: '03', title: 'Development Sprint', desc: 'React + Vite + Supabase. Dagelijkse deploys naar staging zodat u de voortgang realtime volgt.' },
  { num: '04', title: 'Launch & Groei', desc: 'Live-zetten, SEO-check, analytics en 3 maanden post-launch support. Uw investering begint direct te renderen.' },
];

const STATS = [
  { value: '48', suffix: 'u', label: 'Gemiddelde doorlooptijd design' },
  { value: '3×', suffix: '', label: 'Meer conversies vs template-sites' },
  { value: '99', suffix: '%', label: 'Klant-tevredenheidsscore' },
  { value: '<2', suffix: 's', label: 'Gemiddelde laadtijd' },
];

const StatCard = ({ value, suffix, label, index }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={ref} className="glass-card rounded-2xl p-6 text-center">
      <p className="stat-num text-[clamp(2.8rem,6vw,5rem)]">
        {value}
        <span className="text-[var(--accent2)]">{suffix}</span>
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[.2em] text-slate-400">{label}</p>
    </div>
  );
};

const CapabilityCard = ({ cap, index }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 36, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: (index % 3) * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <article ref={ref} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="capability-icon-wrap text-[var(--accent)]">{cap.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-bold text-white leading-tight">{cap.title}</h3>
          <span className="holo-tag mt-2 text-[10px]">{cap.tag}</span>
        </div>
      </div>
      <p className="text-sm leading-7 text-slate-400">{cap.description}</p>
    </article>
  );
};

const ProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const img = project.featured_preview_image || project.hero_image;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <article ref={ref} className="project-card group">
      <Link to={`/portfolio/${project.id}`} className="block">
        <div className="overflow-hidden">
          {img ? (
            <SmartImage
              src={img}
              alt={project.title}
              className="project-card-img"
            />
          ) : (
            <div className="project-card-img bg-[radial-gradient(circle_at_30%_30%,rgba(140,214,255,.15),transparent_50%)] flex items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-600">No preview</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <span className="holo-tag text-[10px]">{project.categories?.name || 'Maatwerk'}</span>
          <h3 className="mt-3 font-heading text-xl font-bold text-white tracking-tight">{project.title}</h3>
          {project.short_description && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{project.short_description}</p>
          )}
          <div className="mt-4 flex items-center gap-1 font-mono text-[11px] uppercase tracking-[.18em] text-[var(--accent)] transition-all duration-300 group-hover:gap-2">
            Open case <ArrowRight size={12} />
          </div>
        </div>
      </Link>
    </article>
  );
};

const TestimonialCard = ({ testimonial, featured = false, index = 0 }) => {
  const ref = useRef(null);
  const text = testimonial?.text?.trim() || 'Reviewtekst ontbreekt';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <figure ref={ref} className={`glass-card rounded-2xl ${featured ? 'p-8 md:p-10' : 'p-6'}`}>
      <Quote
        className={`${featured ? 'mb-5 h-8 w-8' : 'mb-4 h-6 w-6'} text-[var(--accent2)]`}
        aria-hidden="true"
      />
      <blockquote
        className={`font-heading text-white ${featured ? 'text-xl leading-8 md:text-2xl' : 'text-base leading-7'} ${!featured && 'line-clamp-5'}`}
      >
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
  <p className="section-eyebrow mb-4">{children}</p>
);

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const statsRef = useRef(null);
  const capRef = useRef(null);
  const procRef = useRef(null);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (procRef.current) {
        const steps = procRef.current.querySelectorAll('.process-step');
        steps.forEach((step, i) => {
          gsap.fromTo(
            step,
            { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: step, start: 'top 85%' },
            }
          );
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const smallTestimonials = useMemo(() => testimonials.slice(1, 3), [testimonials]);

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
          ref={statsRef}
          className="relative py-24 px-5 md:px-10"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,165,233,.07) 0%, transparent 70%)',
          }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <SectionLabel>In cijfers</SectionLabel>
              <h2 className="display-xl text-[clamp(2.8rem,7vw,6rem)]">
                Resultaten die{' '}
                <span className="gradient-text-cyan">spreken</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <StatCard key={s.label} {...s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Capabilities ── */}
        <section
          ref={capRef}
          className="relative py-24 px-5 md:px-10 sci-fi-grid"
          style={{ '--tw-bg-opacity': 1 }}
        >
          <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-14 max-w-3xl">
              <SectionLabel>Wat wij bouwen</SectionLabel>
              <h2 className="display-xl text-[clamp(2.8rem,7vw,6rem)]">
                De complete{' '}
                <span className="gradient-text-full">tech stack</span>
                <br />voor uw toekomst.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">
                Van interactieve 3D interfaces tot snelle backends — wij beheersen de volledige keten van moderne webdevelopment.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((cap, i) => (
                <CapabilityCard key={cap.title} cap={cap} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Projects ── */}
        <section className="relative py-24 px-5 md:px-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,214,255,.3)] to-transparent" />
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>Portfolio</SectionLabel>
                <h2 className="display-xl text-[clamp(2.8rem,7vw,6rem)]">
                  Uitgelichte{' '}
                  <span className="gradient-text-cyan">projecten</span>
                </h2>
              </div>
              <Link
                to="/portfolio"
                className="ghost-button shrink-0 self-start sm:self-auto"
              >
                Alle projecten <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="glass-card rounded-2xl aspect-[4/5] animate-pulse"
                  />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4">
                  Nog geen projecten
                </p>
                <p className="text-slate-400 mb-6">
                  Voeg projecten toe via de admin om ze hier te tonen.
                </p>
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

        {/* ── Process ── */}
        <section
          ref={procRef}
          className="relative py-24 px-5 md:px-10"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(214,245,122,.04) 0%, transparent 60%)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(214,245,122,.25)] to-transparent" />
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 max-w-2xl">
              <SectionLabel>Werkwijze</SectionLabel>
              <h2 className="display-xl text-[clamp(2.8rem,7vw,6rem)]">
                Vier stappen naar{' '}
                <span className="gradient-text-full">resultaat</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-400">
                Ons proces is transparant, iteratief en gebouwd voor snelheid. Geen verrassingen, wel verbluffende uitkomsten.
              </p>
            </div>

            <div className="relative pl-0 md:pl-0">
              <div className="process-connector hidden md:block" />
              <div className="flex flex-col gap-6 md:pl-20">
                {PROCESS.map((step, i) => (
                  <div key={step.num} className="process-step glass-card rounded-2xl p-6 md:p-8 relative">
                    <div className="absolute -left-6 top-6 hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-[var(--accent)] bg-[#020810]">
                      <span className="font-mono text-xs font-bold text-[var(--accent)]">{step.num}</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[var(--accent)] bg-[rgba(12,22,40,.9)] shrink-0">
                        <span className="font-mono text-[10px] font-bold text-[var(--accent)]">{step.num}</span>
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-bold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        {testimonials.length > 0 && (
          <section className="relative py-24 px-5 md:px-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,214,255,.3)] to-transparent" />
            <div className="mx-auto max-w-6xl">
              <div className="mb-14">
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

        {/* ── CTA ── */}
        <section className="relative py-28 px-5 md:px-10 cta-section-bg">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,214,255,.4)] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,214,255,.2)] to-transparent" />

          <div
            className="mx-auto max-w-4xl glass-card rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
            style={{ animation: 'glow-pulse 4s ease-in-out infinite' }}
          >
            <div className="pointer-events-none absolute inset-0 sci-fi-grid-fine opacity-40" aria-hidden="true" />
            <div className="relative z-10">
              <span className="holo-tag mb-6 inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent2)] animate-pulse" />
                Beschikbaar voor nieuwe projecten
              </span>
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
