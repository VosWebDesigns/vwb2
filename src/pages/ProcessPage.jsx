import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle, Code, Lightbulb, MessageCircle, Palette, Rocket } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    number: '01', icon: <MessageCircle size={26} />, title: 'Kennismaking & Strategie', duration: '~1 week',
    description: 'We beginnen met een uitgebreid gesprek over uw bedrijf, doelen, en doelgroep. Hierbij analyseren we uw huidige situatie en concurrentie om een solide strategie te ontwikkelen.',
    activities: ['Intakegesprek en doelen bepalen', 'Doelgroep en persona research', 'Concurrentieanalyse', 'Projectscope en planning opstellen', 'Budget en timeline bespreken'],
  },
  {
    number: '02', icon: <Lightbulb size={26} />, title: 'Concept & Wireframing', duration: '1–2 weken',
    description: 'Op basis van de strategie creëren we concepten en wireframes. Dit geeft u een duidelijk beeld van de structuur en functionaliteit voordat we beginnen met design.',
    activities: ['Sitemap en informatiearchitectuur', 'Wireframes voor key pages', 'User flow mapping', 'Feedback sessies', 'Concept presentatie en goedkeuring'],
  },
  {
    number: '03', icon: <Palette size={26} />, title: 'Design & Prototyping', duration: '2–3 weken',
    description: 'Nu wordt het visueel! We ontwerpen hoogwaardige mockups van alle paginas, compleet met uw branding, kleuren, en beeldmateriaal. Interactive prototypes laten u de website al ervaren.',
    activities: ['Visual design alle paginas', 'Responsive design (desktop, tablet, mobiel)', 'Interactive prototype', 'Design review sessies', 'Finalisatie en goedkeuring'],
  },
  {
    number: '04', icon: <Code size={26} />, title: 'Development & Integratie', duration: '3–6 weken',
    description: 'De goedgekeurde designs worden omgezet in een volledig functionele website. We bouwen met de nieuwste technologieën en integreren alle benodigde systemen en tools.',
    activities: ['Frontend development', 'Backend development en database', 'CMS implementatie', 'Third-party integraties', 'Testen en quality assurance'],
  },
  {
    number: '05', icon: <Rocket size={26} />, title: 'Lancering & Optimalisatie', duration: '~1 week',
    description: 'Voor de lancering voeren we uitgebreide tests uit. Na lancering monitoren we de prestaties nauwlettend en optimaliseren waar nodig voor maximale resultaten.',
    activities: ['Pre-launch testing en bugfixes', 'Performance optimalisatie', 'SEO setup en implementatie', 'Analytics en tracking configuratie', 'Live gang en support'],
  },
];

const afterLaunch = [
  ['Onderhoud & Support',    'Technische updates, bugfixes, en content aanpassingen'],
  ['Performance Monitoring', 'Continue monitoring en optimalisatie voor beste resultaten'],
  ['SEO & Marketing',        'Doorlopende SEO optimalisatie en marketing support'],
  ['Groei & Uitbreidingen',  'Nieuwe features en functionaliteiten wanneer u deze nodig heeft'],
];

/* ── Horizontal pinned timeline (desktop only) ── */
const HorizontalTimeline = ({ steps }) => {
  const outerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const ctx = gsap.context(() => {
      const getScrollDistance = () => track.scrollWidth - outer.offsetWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start:   'top top',
          end:     () => `+=${getScrollDistance() + window.innerHeight}`,
          pin:     true,
          scrub:   1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track, {
        x:    () => -(getScrollDistance()),
        ease: 'none',
      });

      // Stagger-in each card as it enters view (driven by the timeline progress)
      const cards = track.querySelectorAll('.h-step-card');
      cards.forEach((card, i) => {
        tl.fromTo(card,
          { opacity: 0.1, scale: 0.93 },
          { opacity: 1,   scale: 1, ease: 'power2.out', duration: 0.18 },
          i * 0.18
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={outerRef} className="relative h-screen overflow-hidden">
      {/* Static label row */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-10 pt-8 pb-5"
        style={{ borderBottom: '1px solid rgba(201,169,110,.08)' }}>
        <div className="flex items-center gap-3">
          <span className="status-dot" />
          <p className="section-eyebrow">Werkwijze — stap voor stap</p>
        </div>
        <p className="font-mono text-[.62rem] uppercase tracking-[.3em]" style={{ color: 'rgba(201,169,110,.3)' }}>
          Scroll →
        </p>
      </div>

      {/* Horizontal rail */}
      <div
        ref={trackRef}
        className="absolute top-0 left-0 flex h-full items-center gap-6 pl-10 pr-24"
        style={{ paddingTop: '7rem' }}
      >
        {steps.map((step, i) => (
          <article
            key={step.number}
            className="h-step-card glass-card flex-shrink-0 rounded-3xl p-8 relative overflow-hidden"
            style={{ width: 'min(480px, 85vw)', minHeight: '420px' }}
          >
            {/* Top accent line */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(to right, transparent, var(--accent), transparent)', opacity: 0.5 }}
            />

            {/* Step number — large bg watermark */}
            <span
              className="absolute -bottom-2 -right-1 font-mono font-black leading-none select-none pointer-events-none"
              style={{
                fontSize: 'clamp(6rem,12vw,10rem)',
                letterSpacing: '-.05em',
                background: 'linear-gradient(135deg, rgba(201,169,110,.08), rgba(201,169,110,.02))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
              aria-hidden="true"
            >
              {step.number}
            </span>

            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--stroke)] bg-[rgba(201,169,110,.06)] text-[var(--accent)] flex-shrink-0">
                  {step.icon}
                </div>
                <span className="font-mono text-[.6rem] uppercase tracking-[.22em]" style={{ color: 'var(--accent2)' }}>
                  {step.duration}
                </span>
              </div>

              <h2 className="font-heading text-[clamp(1.5rem,2.2vw,2.2rem)] font-black leading-tight tracking-[-.05em] text-white">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300 flex-1">{step.description}</p>

              <div className="mt-5 pt-5 border-t border-[rgba(201,169,110,.08)] grid gap-2">
                {step.activities.slice(0, 4).map((a) => (
                  <div key={a} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <CheckCircle size={12} className="mt-0.5 shrink-0 text-[var(--accent2)]" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const ProcessPage = () => {
  const rootRef      = useRef(null);
  const timelineRef  = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
    // Only animate vertical timeline on mobile — desktop uses HorizontalTimeline's own animation
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) return;

    const el = timelineRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const line = el.querySelector('.timeline-draw-line');
      if (line) {
        gsap.fromTo(line,
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, duration: 2.2, ease: 'power2.out', scrollTrigger: { trigger: line, start: 'top 80%' } }
        );
      }

      const steps = el.querySelectorAll('.timeline-card');
      steps.forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
          }
        );
        const bubble = card.querySelector('.step-bubble');
        if (bubble) {
          gsap.fromTo(bubble,
            { scale: 0.6, opacity: 0 },
            {
              scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
              scrollTrigger: { trigger: card, start: 'top 88%' },
              delay: 0.15,
            }
          );
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Werkwijze - Vos Web Designs | Ons Development Process</title>
        <meta name="description" content="Ontdek hoe we te werk gaan bij Vos Web Designs. Van strategie tot lancering - een transparant proces met gegarandeerde resultaten." />
      </Helmet>

      <main ref={rootRef} className="cinema-bg overflow-hidden pt-24">

        {/* ── Hero ── */}
        <section className="cinematic-section relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'linear-gradient(rgba(201,169,110,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.06) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[1fr_.65fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="status-dot" />
                <p data-reveal className="section-eyebrow">Onze werkwijze</p>
              </div>
              <h1 data-reveal className="display-xl mt-0 text-[clamp(3rem,8vw,7rem)]">
                Van idee naar{' '}
                <span className="gradient-text-full">live resultaat</span>.
              </h1>
            </div>
            <aside data-reveal className="glass-card cyber-corner rounded-2xl p-6">
              <span className="hud-label block mb-3">Doorlooptijd globaal</span>
              <p className="text-lg leading-8 text-slate-300">
                Een bewezen proces dat consistente, hoogwaardige resultaten oplevert — van strategie tot lancering.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {[['1–2 wk', 'Kennismaking'], ['2–3 wk', 'Design'], ['3–6 wk', 'Development'], ['~1 wk', 'Launch']].map(([t, l]) => (
                  <div key={l} className="rounded-xl border border-[var(--stroke)] bg-white/[.02] p-3 text-center">
                    <p className="font-heading text-sm font-black text-[var(--accent)]">{t}</p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[.18em] text-slate-500">{l}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* ── Timeline — horizontal pinned rail (desktop) / vertical (mobile) ── */}
        <section className="cinematic-section pt-0 overflow-hidden" ref={timelineRef}>
          {/* ── Desktop: horizontal pinned scroll ── */}
          <div className="hidden lg:block">
            <HorizontalTimeline steps={processSteps} />
          </div>

          {/* ── Mobile: classic vertical timeline ── */}
          <div className="lg:hidden cinematic-container relative z-10">
            <div className="relative">
              <div
                className="timeline-draw-line absolute left-[14px] top-4 bottom-0 w-px md:left-[18px]"
                style={{ background: 'linear-gradient(to bottom, var(--accent), var(--accent2), transparent)' }}
                aria-hidden="true"
              />
              <div className="flex flex-col gap-6 pl-10 md:pl-12">
                {processSteps.map((step) => (
                  <article key={step.number} className="timeline-card relative">
                    <div
                      className="step-bubble absolute -left-10 top-5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[#06060c] text-[var(--accent)] shadow-[0_0_20px_rgba(201,169,110,.4)] md:-left-12 md:h-9 md:w-9"
                    >
                      <span className="font-mono text-[9px] font-black md:text-[10px]">{step.number}</span>
                    </div>
                    <div className="glass-card rounded-2xl p-5 md:p-7">
                      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-[var(--stroke)] bg-[rgba(201,169,110,.06)] text-[var(--accent)]">
                        {step.icon}
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--accent2)]">{step.duration}</span>
                      <h2 className="mt-2 font-heading text-[clamp(1.4rem,3vw,2rem)] font-black tracking-[-.05em] text-white">{step.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
                      <ul className="mt-4 grid gap-2">
                        {step.activities.map((a) => (
                          <li key={a} className="flex gap-2.5 items-start text-sm text-slate-300">
                            <CheckCircle size={13} className="mt-0.5 shrink-0 text-[var(--accent2)]" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── After launch ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            <div data-reveal className="glass-card rounded-3xl p-7 md:p-12 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 sci-fi-grid-fine opacity-20" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="status-dot" />
                  <p className="section-eyebrow">Na de lancering</p>
                </div>
                <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
                  <div>
                    <h2 className="display-xl text-[clamp(2rem,5vw,4rem)]">
                      We blijven{' '}
                      <span className="gradient-text-cyan">meekijken</span>.
                    </h2>
                    <p className="mt-5 text-base leading-8 text-slate-300">
                      Onze betrokkenheid stopt niet bij de lancering. We bieden continue support en staan klaar om uw website te laten groeien.
                    </p>
                    <Link to="/contact" className="glow-button mt-7">
                      Start uw project <ArrowRight size={16} />
                    </Link>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {afterLaunch.map(([title, text]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-[rgba(201,169,110,.14)] bg-[rgba(8,16,30,.5)] p-5 transition hover:border-[rgba(201,169,110,.28)]"
                      >
                        <h3 className="font-heading text-base font-black text-[var(--accent)]">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default ProcessPage;
