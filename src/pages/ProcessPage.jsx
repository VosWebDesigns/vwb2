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

const ProcessPage = () => {
  const rootRef      = useRef(null);
  const timelineRef  = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
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

        {/* ── Timeline ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            <div className="relative" ref={timelineRef}>
              <div
                className="timeline-draw-line absolute left-[14px] top-4 bottom-0 w-px md:left-[18px] lg:left-[22px]"
                style={{ background: 'linear-gradient(to bottom, var(--accent), var(--accent2), transparent)' }}
                aria-hidden="true"
              />

              <div className="flex flex-col gap-6 pl-10 md:pl-12 lg:pl-16">
                {processSteps.map((step, i) => (
                  <article key={step.number} className="timeline-card relative">
                    <div
                      className="step-bubble absolute -left-10 top-5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[#06060c] text-[var(--accent)] shadow-[0_0_20px_rgba(201,169,110,.4)] md:-left-12 md:h-9 md:w-9 lg:-left-16 lg:h-11 lg:w-11"
                      aria-hidden="true"
                    >
                      <span className="font-mono text-[9px] font-black md:text-[10px] lg:text-[11px]">{step.number}</span>
                    </div>

                    <div
                      className="absolute -left-[1rem] top-[1.5rem] h-2 w-2 rounded-full bg-[var(--accent2)] shadow-[0_0_8px_rgba(138,92,246,.8)] md:-left-[1.15rem] md:top-[1.65rem] lg:-left-[1.45rem]"
                      aria-hidden="true"
                    />

                    <div className="glass-card rounded-2xl p-5 md:p-7">
                      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
                        <div>
                          <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-[var(--stroke)] bg-[rgba(201,169,110,.06)] text-[var(--accent)]">
                            {step.icon}
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--accent2)]">
                            {step.duration}
                          </span>
                          <h2 className="mt-2 font-heading text-[clamp(1.5rem,2.5vw,2.4rem)] font-black tracking-[-.05em] text-white">
                            {step.title}
                          </h2>
                          <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
                        </div>

                        <div className="grid content-start gap-2.5">
                          <span className="hud-label mb-1">Activiteiten</span>
                          {step.activities.map((activity) => (
                            <div
                              key={activity}
                              className="flex gap-2.5 items-start rounded-xl border border-[var(--stroke)] bg-white/[.02] p-3 text-sm text-slate-300 transition hover:border-[rgba(201,169,110,.2)]"
                            >
                              <CheckCircle size={14} className="mt-0.5 shrink-0 text-[var(--accent2)]" />
                              {activity}
                            </div>
                          ))}
                        </div>
                      </div>
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
