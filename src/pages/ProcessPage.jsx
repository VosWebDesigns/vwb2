import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle, Code, Lightbulb, MessageCircle, Palette, Rocket } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: '01', Icon: MessageCircle, title: 'Kennismaking & Strategie', duration: '~1 week',
    description: 'We beginnen met een uitgebreid gesprek over uw bedrijf, doelen en doelgroep. We analyseren uw huidige situatie en concurrentie om een solide strategie te ontwikkelen.',
    activities: ['Intakegesprek en doelen bepalen', 'Doelgroep en persona research', 'Concurrentieanalyse', 'Projectscope en planning opstellen'],
  },
  {
    number: '02', Icon: Lightbulb, title: 'Concept & Wireframing', duration: '1–2 weken',
    description: 'Op basis van de strategie creëren we concepten en wireframes. Dit geeft u een duidelijk beeld van de structuur voordat we met design beginnen.',
    activities: ['Sitemap en informatiearchitectuur', 'Wireframes voor key pages', 'User flow mapping', 'Concept presentatie en goedkeuring'],
  },
  {
    number: '03', Icon: Palette, title: 'Design & Prototyping', duration: '2–3 weken',
    description: 'We ontwerpen hoogwaardige mockups van alle pagina\'s, compleet met uw branding, kleuren en beeldmateriaal. Interactive prototypes laten u de website al ervaren.',
    activities: ['Visual design alle pagina\'s', 'Responsive design (desktop, tablet, mobiel)', 'Interactive prototype', 'Design review en goedkeuring'],
  },
  {
    number: '04', Icon: Code, title: 'Development & Integratie', duration: '3–6 weken',
    description: 'De goedgekeurde designs worden omgezet in een volledig functionele website. We bouwen met de nieuwste technologieën en integreren alle benodigde systemen.',
    activities: ['Frontend development', 'Backend en database', 'CMS implementatie', 'Testen en quality assurance'],
  },
  {
    number: '05', Icon: Rocket, title: 'Lancering & Optimalisatie', duration: '~1 week',
    description: 'Voor de lancering voeren we uitgebreide tests uit. Na lancering monitoren we de prestaties nauwlettend en optimaliseren waar nodig voor maximale resultaten.',
    activities: ['Pre-launch testing', 'Performance optimalisatie', 'SEO setup en implementatie', 'Live gang en support'],
  },
];

const AFTER_LAUNCH = [
  ['Onderhoud & Support',    'Technische updates, bugfixes en content aanpassingen'],
  ['Performance Monitoring', 'Continue monitoring en optimalisatie voor beste resultaten'],
  ['SEO & Marketing',        'Doorlopende SEO optimalisatie en marketing support'],
  ['Groei & Uitbreidingen',  'Nieuwe features wanneer u ze nodig heeft'],
];

const ProcessPage = () => {
  const heroRef     = useRef(null);
  const titleRef    = useRef(null);
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.set(titleRef.current, { clipPath: 'inset(0 100% 0 0)' });
        gsap.to(titleRef.current, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.1,
          ease: 'power4.out',
          delay: 0.25,
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section  = sectionRef.current;
    const track    = trackRef.current;
    const progress = progressRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getAmt = () => -(track.scrollWidth - section.offsetWidth + 80);

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.abs(getAmt())}`,
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(track, { x: getAmt() * self.progress });
          if (progress) progress.style.transform = `scaleX(${self.progress})`;
        },
      });

      return () => st.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Werkwijze - Vos Web Designs | Ons Development Process</title>
        <meta name="description" content="Ontdek hoe we te werk gaan bij Vos Web Designs. Van strategie tot lancering — een transparant proces." />
      </Helmet>

      <main className="overflow-hidden" style={{ background: '#03030a' }}>

        {/* ── Cinematic Hero ── */}
        <section
          ref={heroRef}
          className="relative flex min-h-[80vh] flex-col justify-end overflow-hidden px-5 pt-32 pb-16 md:px-10 lg:px-16"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(201,169,110,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.035) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-[60vh] w-[55vw]"
            style={{ background: 'radial-gradient(ellipse at 90% 100%, rgba(138,92,246,.07), transparent 60%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-[1400px] mx-auto w-full">
            <p
              className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-8"
              style={{ color: 'rgba(201,169,110,.38)' }}
            >
              — Onze werkwijze
            </p>
            <div ref={titleRef}>
              <h1
                className="font-heading font-black uppercase leading-[.88]"
                style={{
                  fontSize: 'clamp(3.5rem, 11vw, 13rem)',
                  letterSpacing: '-.07em',
                  color: 'var(--accent3)',
                }}
              >
                WERK
                <em
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    fontSize: '.88em',
                    letterSpacing: '-.03em',
                  }}
                >
                  wijze
                </em>
                .
              </h1>
            </div>
            <p
              className="mt-8 max-w-xl text-base leading-[1.9]"
              style={{ color: 'rgba(240,235,227,.42)' }}
            >
              Van eerste gesprek tot live lancering — een bewezen proces dat consistente, hoogwaardige resultaten oplevert.
            </p>
          </div>
        </section>

        {/* ── Pinned Horizontal Timeline ── */}
        <section
          ref={sectionRef}
          className="relative overflow-hidden"
          style={{ height: '100vh' }}
        >
          {/* Step label */}
          <div
            className="pointer-events-none absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-10 flex items-center"
            aria-hidden="true"
          >
            <span
              className="font-mono text-[.5rem] uppercase tracking-[.5em]"
              style={{
                color: 'rgba(201,169,110,.2)',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              Scroll
            </span>
          </div>

          <div
            ref={trackRef}
            className="flex h-full items-center gap-5 pl-16 md:pl-20 lg:pl-24 pr-8 will-change-transform"
          >
            {STEPS.map((step, i) => (
              <article
                key={step.number}
                className="process-card flex-shrink-0 h-[72vh] max-h-[600px] flex flex-col justify-between overflow-hidden relative"
                style={{
                  width: 'clamp(300px, 70vw, 650px)',
                  border: '1px solid rgba(201,169,110,.1)',
                  background: 'rgba(8,8,16,.72)',
                  backdropFilter: 'blur(28px)',
                  padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                }}
              >
                {/* Top section: number + title */}
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <span
                      className="font-mono"
                      style={{ fontSize: '.65rem', letterSpacing: '.3em', color: 'rgba(201,169,110,.38)' }}
                    >
                      {step.number} / 0{STEPS.length}
                    </span>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ border: '1px solid rgba(201,169,110,.18)', color: 'var(--accent)' }}
                    >
                      <step.Icon size={18} />
                    </div>
                  </div>

                  {/* Giant step number watermark */}
                  <div
                    className="absolute right-4 top-2 font-heading font-black leading-none pointer-events-none select-none"
                    style={{
                      fontSize: 'clamp(5rem, 15vw, 14rem)',
                      letterSpacing: '-.1em',
                      color: 'rgba(201,169,110,.04)',
                    }}
                    aria-hidden="true"
                  >
                    {step.number}
                  </div>

                  <div
                    className="font-mono text-[.58rem] uppercase tracking-[.32em] mb-3"
                    style={{ color: 'var(--accent)' }}
                  >
                    {step.duration}
                  </div>
                  <h2
                    className="font-heading font-black uppercase leading-[.9]"
                    style={{
                      fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
                      letterSpacing: '-.05em',
                      color: 'var(--accent3)',
                    }}
                  >
                    {step.title}
                  </h2>
                  <p
                    className="mt-4 text-sm leading-[1.85]"
                    style={{ color: 'rgba(240,235,227,.45)' }}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Activities */}
                <div>
                  <div
                    className="h-px mb-5"
                    style={{ background: 'rgba(201,169,110,.08)' }}
                  />
                  <ul className="grid gap-2">
                    {step.activities.map((a) => (
                      <li
                        key={a}
                        className="flex items-start gap-3 text-xs"
                        style={{ color: 'rgba(240,235,227,.48)' }}
                      >
                        <CheckCircle
                          size={12}
                          className="mt-0.5 shrink-0"
                          style={{ color: 'var(--accent)' }}
                        />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="absolute bottom-0 inset-x-0"
            style={{ height: 1, background: 'rgba(201,169,110,.08)' }}
          >
            <div
              ref={progressRef}
              style={{
                height: '100%',
                transformOrigin: 'left',
                transform: 'scaleX(0)',
                background: 'linear-gradient(to right, var(--accent), var(--accent2))',
              }}
            />
          </div>
        </section>

        {/* ── After launch ── */}
        <section className="relative py-24 md:py-36 px-5 md:px-10 lg:px-16">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.14), transparent)' }}
            aria-hidden="true"
          />
          <div className="max-w-[1400px] mx-auto">
            <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr] lg:items-start">
              <div>
                <p
                  className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-8"
                  style={{ color: 'rgba(201,169,110,.38)' }}
                >
                  — Na de lancering
                </p>
                <h2
                  className="font-heading font-black uppercase leading-[.9]"
                  style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', letterSpacing: '-.055em', color: 'var(--accent3)' }}
                >
                  WE BLIJVEN
                  <br />
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
                    meekijken
                  </em>
                  .
                </h2>
                <p
                  className="mt-7 text-base leading-[1.9]"
                  style={{ color: 'rgba(240,235,227,.45)' }}
                >
                  Onze betrokkenheid stopt niet bij de lancering. We bieden continue support en staan klaar om uw website te laten groeien.
                </p>
                <div className="mt-9">
                  <MagneticButton to="/contact" className="glow-button">
                    Start uw project <ArrowRight size={16} />
                  </MagneticButton>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {AFTER_LAUNCH.map(([title, text]) => (
                  <div
                    key={title}
                    className="p-6 transition-all duration-400"
                    style={{
                      border: '1px solid rgba(201,169,110,.1)',
                      background: 'rgba(8,8,16,.5)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.28)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.1)'; }}
                  >
                    <h3
                      className="font-heading font-black uppercase leading-none"
                      style={{ fontSize: '1.1rem', letterSpacing: '-.04em', color: 'var(--accent)' }}
                    >
                      {title}
                    </h3>
                    <p
                      className="mt-3 text-sm leading-[1.8]"
                      style={{ color: 'rgba(240,235,227,.45)' }}
                    >
                      {text}
                    </p>
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
