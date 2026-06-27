import React, { useEffect, useRef, useState } from 'react';
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
  const ref     = useRef(null);
  const lineRef = useRef(null);
  const WORDS = ['Geen', 'templates.', 'Geen', 'compromissen.', 'Alleen', 'resultaat.'];

  useEffect(() => {
    const el   = ref.current;
    const line = lineRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 72%' },
      });
      tl.fromTo(el.querySelectorAll('.stmt-word'),
        { opacity: 0, y: 60, rotateX: 22 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out' }
      );
      if (line) {
        gsap.set(line, { scaleX: 0, transformOrigin: 'center' });
        tl.to(line, { scaleX: 1, duration: 1.3, ease: 'power3.out' }, '-=0.4');
      }
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
        {/* Animated signature line */}
        <div
          ref={lineRef}
          className="mx-auto mt-14"
          style={{
            height: 1,
            maxWidth: '32rem',
            background: 'linear-gradient(to right, transparent, var(--accent), transparent)',
            opacity: 0.5,
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

/* ── Animated stat counter — giant numbers ── */
const StatItem = ({ value, suffix, prefix, label, index }) => {
  const ref    = useRef(null);
  const numRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el    = ref.current;
    const numEl = numRef.current;
    const wrap  = wrapRef.current;
    if (!el || !numEl) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } });
      if (wrap) {
        gsap.set(wrap, { clipPath: 'inset(0 100% 0 0)' });
        tl.to(wrap, { clipPath: 'inset(0 0% 0 0)', duration: 1.0, ease: 'power4.out', delay: index * 0.1 });
      }
      tl.fromTo({ n: 0 }, { n: 0 }, {
        n: value, duration: 1.6, ease: 'power2.out',
        onUpdate: function () { numEl.textContent = Math.round(this.targets()[0].n); },
      }, index === 0 ? '<0.2' : '<0');
    });
    return () => ctx.revert();
  }, [index, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 py-10 md:py-14 overflow-hidden">
      <div ref={wrapRef} style={{ clipPath: 'inset(0 0% 0 0)' }}>
        <p
          className="font-heading font-black leading-none tabular-nums"
          style={{ fontSize: 'clamp(4rem, 11vw, 11rem)', letterSpacing: '-.06em', color: 'var(--accent3)' }}
        >
          <span style={{ color: 'rgba(201,169,110,.5)', fontSize: '.7em' }}>{prefix}</span>
          <span ref={numRef}>{value}</span>
          <span style={{ color: 'var(--accent)', fontSize: '.55em' }}>{suffix}</span>
        </p>
      </div>
      <p
        className="font-mono text-[.55rem] uppercase tracking-[.28em] text-center px-2"
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

/* ── Full-width CTA with animated gradient ── */
const CTA_WORDS = ['jouw', 'samen', 'vandaag'];

const CtaSection = () => {
  const ref      = useRef(null);
  const tickerRef = useRef(null);
  const [wordIdx, setWordIdx] = useState(0);

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

  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % CTA_WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-36 px-5 md:px-10 lg:px-16 overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="pointer-events-none absolute inset-0 animate-[gradient-drift_8s_ease_infinite]"
        style={{
          background: 'radial-gradient(ellipse 80% 55% at 50% 50%, rgba(201,169,110,.06) 0%, rgba(138,92,246,.04) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.28), transparent)' }}
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
          <span
            className="inline-block overflow-hidden align-bottom"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontWeight: 600,
              color: 'var(--accent)',
              fontSize: '1.06em',
              letterSpacing: '-.02em',
              height: '1.05em',
              verticalAlign: 'bottom',
            }}
          >
            <span
              className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateY(-${wordIdx * 100}%)` }}
            >
              {CTA_WORDS.map((w) => (
                <span key={w} className="block">{w}</span>
              ))}
            </span>
          </span>
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
          <Link to="/contact" className="glow-button" data-magnetic="">
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
