import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    number: '01', title: 'Kennismaking & Strategie', duration: '~1 week',
    description: 'We beginnen met een uitgebreid gesprek over uw bedrijf, doelen en doelgroep. Hierbij analyseren we uw huidige situatie en concurrentie om een solide strategie te ontwikkelen.',
    activities: ['Intakegesprek en doelen bepalen', 'Doelgroep en persona research', 'Concurrentieanalyse', 'Projectscope en planning opstellen', 'Budget en timeline bespreken'],
  },
  {
    number: '02', title: 'Concept & Wireframing', duration: '1–2 weken',
    description: 'Op basis van de strategie creëren we concepten en wireframes. Dit geeft u een duidelijk beeld van de structuur en functionaliteit voordat we beginnen met design.',
    activities: ['Sitemap en informatiearchitectuur', 'Wireframes voor key pages', 'User flow mapping', 'Feedback sessies', 'Concept presentatie en goedkeuring'],
  },
  {
    number: '03', title: 'Design & Prototyping', duration: '2–3 weken',
    description: 'Nu wordt het visueel. We ontwerpen hoogwaardige mockups van alle pagina\'s, compleet met uw branding, kleuren en beeldmateriaal. Interactive prototypes laten u de website al ervaren.',
    activities: ['Visual design alle pagina\'s', 'Responsive design (desktop, tablet, mobiel)', 'Interactive prototype', 'Design review sessies', 'Finalisatie en goedkeuring'],
  },
  {
    number: '04', title: 'Development & Integratie', duration: '3–6 weken',
    description: 'De goedgekeurde designs worden omgezet in een volledig functionele website. We bouwen met de nieuwste technologieën en integreren alle benodigde systemen en tools.',
    activities: ['Frontend development', 'Backend development en database', 'CMS implementatie', 'Third-party integraties', 'Testen en quality assurance'],
  },
  {
    number: '05', title: 'Lancering & Optimalisatie', duration: '~1 week',
    description: 'Voor de lancering voeren we uitgebreide tests uit. Na lancering monitoren we de prestaties nauwlettend en optimaliseren waar nodig voor maximale resultaten.',
    activities: ['Pre-launch testing en bugfixes', 'Performance optimalisatie', 'SEO setup en implementatie', 'Analytics en tracking configuratie', 'Live gang en support'],
  },
];

const afterLaunch = [
  ['Onderhoud & Support',    'Technische updates, bugfixes en content aanpassingen'],
  ['Performance Monitoring', 'Continue monitoring en optimalisatie voor beste resultaten'],
  ['SEO & Marketing',        'Doorlopende SEO optimalisatie en marketing support'],
  ['Groei & Uitbreidingen',  'Nieuwe features en functionaliteiten wanneer u deze nodig heeft'],
];

/* ── Single pinned chapter section ── */
const ChapterSection = ({ step, index, total }) => {
  const secRef     = useRef(null);
  const ghostRef   = useRef(null);
  const contentRef = useRef(null);
  const isEven     = index % 2 === 0;

  useEffect(() => {
    const el = secRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=100%',
        pin: !isMobile,
        pinSpacing: !isMobile,
      });

      gsap.fromTo(ghostRef.current,
        { scale: 0.85, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      );
      gsap.fromTo(contentRef.current,
        { x: isEven ? -40 : 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
          delay: 0.2,
        }
      );
    });

    return () => ctx.revert();
  }, [isEven]);

  return (
    <div
      ref={secRef}
      className="chapter-section relative flex items-center overflow-hidden"
      style={{ minHeight: '100vh', padding: '7rem 1.25rem 4rem' }}
    >
      {/* Alternating radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isEven
            ? 'radial-gradient(ellipse 55% 55% at 12% 50%, rgba(200,168,106,.04), transparent)'
            : 'radial-gradient(ellipse 55% 55% at 88% 50%, rgba(124,92,191,.04), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Ghost step number */}
      <span
        ref={ghostRef}
        aria-hidden="true"
        className="ghost-num"
        style={{
          fontSize: 'clamp(12rem, 30vw, 40rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          left: isEven ? '-0.1em' : 'auto',
          right: isEven ? 'auto' : '-0.1em',
          lineHeight: 1,
        }}
      >
        {step.number}
      </span>

      {/* Content grid */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[1180px] mx-auto grid gap-8 lg:gap-12 lg:grid-cols-2 items-center px-4 md:px-6 lg:px-8"
      >
        {/* Left panel: step info */}
        <div className={isEven ? '' : 'lg:order-2'}>
          <p
            className="font-mono text-[.6rem] uppercase tracking-[.30em] mb-5"
            style={{ color: 'rgba(200,168,106,.36)' }}
          >
            STAP {step.number} — {step.duration}
          </p>
          <h2
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4.5vw, 4.2rem)',
              letterSpacing: '-.055em',
              lineHeight: 0.92,
              color: 'var(--accent3)',
            }}
          >
            {step.title}
          </h2>
          <p
            className="mt-6 text-base leading-[1.85]"
            style={{ color: 'rgba(240,237,230,.46)', maxWidth: '38ch' }}
          >
            {step.description}
          </p>
        </div>

        {/* Right panel: deliverables glass card */}
        <div className={`glass-card rounded-2xl p-6 md:p-8 ${isEven ? '' : 'lg:order-1'}`}>
          <p
            className="font-mono text-[.56rem] uppercase tracking-[.26em] mb-5"
            style={{ color: 'rgba(200,168,106,.34)' }}
          >
            Activiteiten
          </p>
          <div className="grid gap-0">
            {step.activities.map((act, i) => (
              <div
                key={i}
                className="flex items-start gap-4 py-3.5"
                style={{ borderBottom: i < step.activities.length - 1 ? '1px solid rgba(200,168,106,.06)' : 'none' }}
              >
                <span
                  className="font-mono text-[.54rem] shrink-0 mt-0.5"
                  style={{ color: 'rgba(200,168,106,.28)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-[1.7]" style={{ color: 'rgba(240,237,230,.52)' }}>
                  {act}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar: shows how far through the 5 steps */}
      <div
        className="absolute bottom-0 left-0 h-[2px]"
        style={{
          width: `${((index + 1) / total) * 100}%`,
          background: 'linear-gradient(to right, var(--accent), var(--accent2))',
          transition: 'width .4s ease',
        }}
      />
    </div>
  );
};

const ProcessPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('[data-hero-reveal]'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Werkwijze - Vos Web Designs | Ons Development Process</title>
        <meta name="description" content="Ontdek hoe we te werk gaan bij Vos Web Designs. Van strategie tot lancering - een transparant proces met gegarandeerde resultaten." />
      </Helmet>

      <main className="cinema-bg overflow-hidden pt-24">

        {/* ── Hero: full-bleed 80vh ── */}
        <section
          ref={heroRef}
          className="relative flex flex-col justify-end overflow-hidden px-5 md:px-10 lg:px-16 pb-16 md:pb-24"
          style={{ minHeight: '80vh' }}
        >
          {/* Grid backdrop */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(200,168,106,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,106,.025) 1px, transparent 1px)',
              backgroundSize: '90px 90px',
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          {/* Lime glow */}
          <div
            className="pointer-events-none absolute left-0 top-0 h-[70vh] w-[60vw]"
            style={{ background: 'radial-gradient(ellipse at 10% 10%, rgba(200,168,106,.07), transparent 55%)' }}
            aria-hidden="true"
          />

          {/* Ghost large "01–05" mark */}
          <span
            className="ghost-num"
            aria-hidden="true"
            style={{ fontSize: 'clamp(12rem, 32vw, 42rem)', right: '-0.05em', top: '50%', transform: 'translateY(-50%)', lineHeight: 1 }}
          >
            05
          </span>

          <div className="relative z-10 max-w-[1180px] mx-auto w-full">
            <div data-hero-reveal className="flex items-center gap-3 mb-8">
              <span className="status-dot" />
              <p className="font-mono text-[.62rem] uppercase tracking-[.38em]" style={{ color: 'rgba(200,168,106,.40)' }}>
                Onze werkwijze
              </p>
            </div>

            <h1
              data-hero-reveal
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(3rem, 9vw, 9rem)',
                letterSpacing: '-.065em',
                lineHeight: 0.88,
                color: 'var(--accent3)',
              }}
            >
              VAN IDEE<br />
              <em
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  fontSize: '1.05em',
                  letterSpacing: '-.02em',
                }}
              >
                naar live
              </em>
              .
            </h1>

            <div data-hero-reveal className="mt-10 flex items-center gap-8 flex-wrap">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[.6rem] uppercase tracking-[.24em]" style={{ color: 'rgba(200,168,106,.28)' }}>Stappen</span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
                    letterSpacing: '-.05em',
                    color: 'var(--accent)',
                  }}
                >
                  5
                </span>
              </div>
              <div className="h-8 w-px" style={{ background: 'rgba(200,168,106,.10)' }} />
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[.6rem] uppercase tracking-[.24em]" style={{ color: 'rgba(200,168,106,.28)' }}>Gemiddeld</span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
                    letterSpacing: '-.05em',
                    color: 'var(--accent3)',
                  }}
                >
                  6–12 weken
                </span>
              </div>
              <div className="h-8 w-px" style={{ background: 'rgba(200,168,106,.10)' }} />
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[.6rem] uppercase tracking-[.24em]" style={{ color: 'rgba(200,168,106,.28)' }}>Resultaat</span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
                    letterSpacing: '-.05em',
                    color: 'var(--accent3)',
                  }}
                >
                  Live product
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pinned chapter sections ── */}
        {processSteps.map((step, i) => (
          <ChapterSection key={step.number} step={step} index={i} total={processSteps.length} />
        ))}

        {/* ── After launch ── */}
        <section className="relative py-28 px-5 md:px-10 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,168,106,.03), transparent)' }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1180px] mx-auto">
            <p className="font-mono text-[.65rem] uppercase tracking-[.38em] mb-4" style={{ color: 'var(--accent)' }}>
              — Na de lancering
            </p>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start mb-12">
              <div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                    letterSpacing: '-.055em',
                    lineHeight: 0.92,
                    color: 'var(--accent3)',
                  }}
                >
                  WE BLIJVEN<br />
                  <em style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 600, color: 'var(--accent)', fontSize: '1.05em', letterSpacing: '-.02em' }}>
                    meekijken
                  </em>
                  .
                </h2>
                <p className="mt-5 text-base leading-8" style={{ color: 'rgba(240,237,230,.44)' }}>
                  Onze betrokkenheid stopt niet bij de lancering. We bieden continue support en staan klaar om uw website te laten groeien.
                </p>
                <Link to="/contact" className="glow-button mt-8">
                  Start uw project <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {afterLaunch.map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl p-5 transition-all duration-300"
                    style={{
                      border: '1px solid rgba(200,168,106,.08)',
                      background: 'rgba(8,8,12,.55)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(200,168,106,.20)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(200,168,106,.08)'; }}
                  >
                    <h3
                      className="font-heading font-bold text-base mb-2"
                      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: 'var(--accent)' }}
                    >
                      {title}
                    </h3>
                    <p className="text-sm leading-6" style={{ color: 'rgba(240,237,230,.44)' }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default ProcessPage;
