import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import FuturisticHero from '@/components/FuturisticHero';
import TechMarquee from '@/components/TechMarquee';
import ServicesSection from '@/components/ServicesSection';
import WorkShowcase from '@/components/WorkShowcase';
import { isWebGLAvailable } from '@/components/three/AmbientBackdrop';

const ScrollCamera3D = lazy(() => import('@/components/three/ScrollCamera3D'));

gsap.registerPlugin(ScrollTrigger);

const HOME_PROJECT_SELECT =
  'id,title,short_description,hero_image,featured_preview_image,is_featured,created_at,categories(name)';

const STATS = [
  { value: 48,  suffix: 'u',  label: 'Gemiddelde doorlooptijd design', prefix: '' },
  { value: 3,   suffix: '×',  label: 'Meer conversies vs template-sites', prefix: '' },
  { value: 99,  suffix: '%',  label: 'Klant-tevredenheidsscore', prefix: '' },
  { value: 2,   suffix: 's',  label: 'Gemiddelde laadtijd', prefix: '<' },
];

/* ── Word-by-word statement reveal ── */
const StatementSection = () => {
  const ref = useRef(null);
  const WORDS = ['Geen', 'templates.', 'Geen', 'compromissen.', 'Alleen', 'resultaat.'];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // Clip-path + Y reveal per word — more premium than plain opacity
      gsap.fromTo(el.querySelectorAll('.stmt-word'),
        { clipPath: 'inset(0 0 100% 0)', y: 40, opacity: 0 },
        {
          clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1,
          duration: 1.1, stagger: 0.10, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 74%' },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-36 px-5 md:px-10 lg:px-16 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,169,110,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.025) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
        }}
        aria-hidden="true"
      />
      <div ref={ref} className="relative mx-auto text-center" style={{ perspective: '900px' }}>
        <p
          className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-10"
          style={{ color: 'rgba(201,169,110,.38)' }}
        >
          — Studio Statement
        </p>
        <h2
          className="font-heading font-black uppercase leading-[.88] tracking-[-0.06em]"
          style={{ fontSize: 'clamp(3rem, 11vw, 11rem)', color: 'var(--accent3)' }}
          aria-label={WORDS.join(' ')}
        >
          {WORDS.map((word, i) => (
            <span
              key={i}
              className="stmt-word inline-block mr-[.2em]"
              style={i % 2 !== 0 ? {
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                fontWeight: 600,
                color: 'var(--accent)',
                fontSize: '1.06em',
                letterSpacing: '-.02em',
              } : undefined}
            >
              {word}
            </span>
          ))}
        </h2>
        <p
          className="mx-auto mt-10 max-w-xl text-base leading-8"
          style={{ color: 'rgba(240,235,227,.4)' }}
        >
          Wij geloven dat elk bedrijf een website verdient die voelt als de toekomst —
          niet als een gratis theme. Maatwerk van A tot Z, zonder tussenlaag.
        </p>
      </div>
    </section>
  );
};

/* ── Animated stat counter ── */
const StatItem = ({ value, suffix, prefix, label, index }) => {
  const ref    = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const el    = ref.current;
    const numEl = numRef.current;
    if (!el || !numEl) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } })
        .fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, delay: index * 0.1, ease: 'power3.out' })
        .fromTo({ n: 0 }, { n: 0 }, {
          n: value, duration: 1.4, ease: 'power2.out',
          onUpdate: function () { numEl.textContent = Math.round(this.targets()[0].n); },
        }, '<0.3');
    });
    return () => ctx.revert();
  }, [index, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3 py-10">
      <p
        className="font-heading font-black leading-none tabular-nums"
        style={{ fontSize: 'clamp(2.8rem, 6.5vw, 6rem)', letterSpacing: '-.05em', color: 'var(--accent3)' }}
      >
        <span style={{ color: 'rgba(201,169,110,.5)' }}>{prefix}</span>
        <span ref={numRef}>{value}</span>
        <span style={{ color: 'var(--accent)', fontSize: '.68em' }}>{suffix}</span>
      </p>
      <p
        className="font-mono text-[.6rem] uppercase tracking-[.25em] text-center"
        style={{ color: 'rgba(201,169,110,.35)' }}
      >
        {label}
      </p>
    </div>
  );
};

/* ── Single centered testimonial ── */
const TestimonialFeature = ({ testimonial }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  if (!testimonial) return null;

  return (
    <section className="relative py-28 px-5 md:px-10 lg:px-16 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(201,169,110,.04), transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.1), transparent)' }}
        aria-hidden="true"
      />
      <figure ref={ref} className="relative mx-auto max-w-4xl text-center">
        <p
          className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-10"
          style={{ color: 'rgba(201,169,110,.38)' }}
        >
          — Klantreacties
        </p>
        <div
          className="font-heading font-black leading-none mb-4 select-none pointer-events-none"
          style={{ fontSize: '9rem', color: 'rgba(201,169,110,.07)', lineHeight: 0.55 }}
          aria-hidden="true"
        >
          "
        </div>
        <blockquote
          className="font-heading font-black uppercase leading-[.9] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(1.8rem, 4.5vw, 4rem)', color: 'var(--accent3)' }}
        >
          {testimonial.text}
        </blockquote>
        <figcaption
          className="mt-8 font-mono text-[.7rem] uppercase tracking-[.28em]"
          style={{ color: 'var(--accent)' }}
        >
          {testimonial.name}{testimonial.company ? ` — ${testimonial.company}` : ''}
        </figcaption>
      </figure>
    </section>
  );
};

/* ── Full-width CTA ── */
const CtaSection = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-36 px-5 md:px-10 lg:px-16 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.28), transparent)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[50vw] -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,.07), transparent 60%)' }}
        aria-hidden="true"
      />

      <div ref={ref} className="relative mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2.5 mb-10">
          <span className="status-dot" />
          <span
            className="font-mono text-[.62rem] uppercase tracking-[.38em]"
            style={{ color: 'rgba(201,169,110,.45)' }}
          >
            Beschikbaar voor nieuwe projecten
          </span>
        </div>
        <h2
          className="font-heading font-black uppercase leading-[.88] tracking-[-0.055em]"
          style={{ fontSize: 'clamp(3rem, 10vw, 10rem)', color: 'var(--accent3)' }}
        >
          KLAAR OM<br />
          <em
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontWeight: 600,
              color: 'var(--accent)',
              fontSize: '1.06em',
              letterSpacing: '-.02em',
            }}
          >
            samen
          </em>
          {' '}TE BOUWEN?
        </h2>
        <p
          className="mx-auto mt-8 max-w-xl text-base leading-8"
          style={{ color: 'rgba(240,235,227,.4)' }}
        >
          Plan een vrijblijvend gesprek en ontdek hoe wij uw digitale aanwezigheid
          transformeren naar een premium ervaring die klanten nooit vergeten.
        </p>
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link to="/contact" className="glow-button">
            Start een project <ArrowRight size={16} />
          </Link>
          <Link to="/portfolio" className="ghost-button hidden md:inline-flex">
            Bekijk portfolio
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ── Main page ── */
const HomePage = () => {
  const [projects,     setProjects]     = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const { data: featuredData, error: featuredError } = await supabase
        .from('projects')
        .select(HOME_PROJECT_SELECT)
        .or('is_published.is.null,is_published.eq.true')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

      let projectData = featuredData || [];
      if (!featuredError && projectData.length === 0) {
        const { data: fallbackData } = await supabase
          .from('projects')
          .select(HOME_PROJECT_SELECT)
          .or('is_published.is.null,is_published.eq.true')
          .order('created_at', { ascending: false })
          .limit(4);
        projectData = fallbackData || [];
      }

      const { data: testimonialData } = await supabase
        .from('testimonials')
        .select('id,name,company,text,is_visible,sort_order')
        .or('is_visible.is.null,is_visible.eq.true')
        .order('sort_order', { ascending: true })
        .limit(1);

      if (mounted) {
        setProjects(projectData);
        setTestimonials(testimonialData || []);
        setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Helmet>
        <title>Vos Web Designs — Premium 3D Web Design Studio Nederland</title>
        <meta
          name="description"
          content="Premium webdesign bureau met 3D interfaces, cinematische animaties en futuristische UI. Wij bouwen ervaringen die indruk maken."
        />
      </Helmet>

      <main className="overflow-hidden">
        <FuturisticHero />
        <TechMarquee />
        <StatementSection />
        <ServicesSection />
        <WorkShowcase projects={projects} loading={loading} />

        {/* Scroll-driven 3D flythrough section */}
        {isWebGLAvailable() && (
          <Suspense fallback={
            <div
              className="relative h-screen w-full flex items-center justify-center"
              style={{ background: 'var(--bg)' }}
            >
              <span className="status-dot" />
            </div>
          }>
            <ScrollCamera3D />
          </Suspense>
        )}

        {/* Stats strip */}
        <section className="relative">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.12), transparent)' }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.12), transparent)' }}
            aria-hidden="true"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ borderLeft: '1px solid rgba(201,169,110,.06)' }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ borderRight: '1px solid rgba(201,169,110,.06)' }}>
                <StatItem {...s} index={i} />
              </div>
            ))}
          </div>
        </section>

        <TestimonialFeature testimonial={testimonials[0]} />
        <CtaSection />
      </main>
    </>
  );
};

export default HomePage;
