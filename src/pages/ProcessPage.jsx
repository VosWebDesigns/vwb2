import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Code, Lightbulb, MessageCircle, Palette, Rocket } from 'lucide-react';

const processSteps = [
  { number: '01', icon: <MessageCircle size={32} />, title: 'Kennismaking & Strategie', duration: '1 week', description: 'We beginnen met een uitgebreid gesprek over uw bedrijf, doelen, en doelgroep. Hierbij analyseren we uw huidige situatie en concurrentie om een solide strategie te ontwikkelen.', activities: ['Intakegesprek en doelen bepalen', 'Doelgroep en persona research', 'Concurrentieanalyse', 'Projectscope en planning opstellen', 'Budget en timeline bespreken'] },
  { number: '02', icon: <Lightbulb size={32} />, title: 'Concept & Wireframing', duration: '1-2 weken', description: 'Op basis van de strategie creëren we concepten en wireframes. Dit geeft u een duidelijk beeld van de structuur en functionaliteit voordat we beginnen met design.', activities: ['Sitemap en informatiearchitectuur', 'Wireframes voor key pages', 'User flow mapping', 'Feedback sessies', 'Concept presentatie en goedkeuring'] },
  { number: '03', icon: <Palette size={32} />, title: 'Design & Prototyping', duration: '2-3 weken', description: 'Nu wordt het visueel! We ontwerpen hoogwaardige mockups van alle paginas, compleet met uw branding, kleuren, en beeldmateriaal. Interactive prototypes laten u de website al ervaren.', activities: ['Visual design alle paginas', 'Responsive design (desktop, tablet, mobiel)', 'Interactive prototype', 'Design review sessies', 'Finalisatie en goedkeuring'] },
  { number: '04', icon: <Code size={32} />, title: 'Development & Integratie', duration: '3-6 weken', description: 'De goedgekeurde designs worden omgezet in een volledig functionele website. We bouwen met de nieuwste technologieën en integreren alle benodigde systemen en tools.', activities: ['Frontend development', 'Backend development en database', 'CMS implementatie', 'Third-party integraties', 'Testen en quality assurance'] },
  { number: '05', icon: <Rocket size={32} />, title: 'Lancering & Optimalisatie', duration: '1 week', description: 'Voor de lancering voeren we uitgebreide tests uit. Na lancering monitoren we de prestaties nauwlettend en optimaliseren waar nodig voor maximale resultaten.', activities: ['Pre-launch testing en bugfixes', 'Performance optimalisatie', 'SEO setup en implementatie', 'Analytics en tracking configuratie', 'Live gang en support'] },
];

const afterLaunch = [
  ['Onderhoud & Support', 'Technische updates, bugfixes, en content aanpassingen'],
  ['Performance Monitoring', 'Continue monitoring en optimalisatie voor beste resultaten'],
  ['SEO & Marketing', 'Doorlopende SEO optimalisatie en marketing support'],
  ['Groei & Uitbreidingen', 'Nieuwe features en functionaliteiten wanneer u deze nodig heeft'],
];

const ProcessPage = () => (
  <>
    <Helmet><title>Werkwijze - Vos Web Designs | Ons Development Process</title><meta name="description" content="Ontdek hoe we te werk gaan bij Vos Web Designs. Van strategie tot lancering - een transparant proces met gegarandeerde resultaten." /></Helmet>
    <main className="cinema-bg pt-24">
      <section className="cinematic-section">
        <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div><p className="eyebrow">Onze werkwijze</p><h1 className="display-title mt-4 text-[clamp(3.6rem,10vw,8rem)]">Een proces met ritme, focus en momentum.</h1></div>
          <aside className="panel cut p-6"><p className="text-lg leading-8 text-slate-300">Een bewezen proces dat consistente, hoogwaardige resultaten oplevert voor elk project — van strategie tot lancering.</p></aside>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10">
          <div className="timeline-spine grid gap-8">
            {processSteps.map((step) => (
              <article key={step.number} data-step={step.number} className="timeline-step">
                <div className="panel cut p-6 md:p-8">
                  <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
                    <div>
                      <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-[color:var(--stroke)] text-[color:var(--accent)]">{step.icon}</div>
                      <p className="eyebrow">{step.duration}</p>
                      <h2 className="mt-3 font-heading text-4xl font-black tracking-[-.06em]">{step.title}</h2>
                      <p className="mt-5 leading-8 text-slate-300">{step.description}</p>
                    </div>
                    <div className="grid content-start gap-3">
                      <span className="font-bold text-white">Belangrijkste activiteiten:</span>
                      {step.activities.map(activity => <div key={activity} className="flex gap-3 rounded-2xl border border-[color:var(--stroke)] bg-white/[.035] p-3 text-slate-300"><CheckCircle size={18} className="mt-1 shrink-0 text-[color:var(--accent2)]" />{activity}</div>)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10">
          <div className="panel cut p-7 md:p-10">
            <p className="eyebrow">Na de lancering</p><h2 className="display-title mt-4 text-5xl md:text-7xl">We blijven meekijken waar groei ontstaat.</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Onze betrokkenheid stopt niet bij de lancering. We bieden continue support, monitoren de prestaties, en staan klaar om uw website te laten groeien met uw bedrijf.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">{afterLaunch.map(([title, text]) => <div key={title} className="rounded-[1.5rem] border border-[color:var(--stroke)] bg-white/[.035] p-5"><h3 className="font-heading text-xl font-black text-[color:var(--accent)]">{title}</h3><p className="mt-2 text-slate-300">{text}</p></div>)}</div>
            <Link to="/contact" className="cta-link mt-8">Start uw project <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default ProcessPage;
