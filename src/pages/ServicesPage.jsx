import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Code, Palette, Search, ShoppingCart, Star, Zap } from 'lucide-react';

const services = [
  { icon: <Palette size={32} />, title: 'Webdesign', shortDescription: 'Professioneel design voor starters & kleine bedrijven', description: 'Perfect voor ondernemers die nét beginnen en een sterke, betrouwbare online uitstraling willen zonder hoge instapkosten.', image: '/webde.png', highlightedPackage: 'Groei', highlightLabel: 'Meest gekozen', packages: [{ name: 'Starter', price: '€349', features: ['1–2 pagina’s', 'Modern & responsive design', 'Contactformulier', 'Basis SEO'] }, { name: 'Groei', price: '€649', features: ['Tot 5 pagina’s', 'Conversiegericht ontwerp', 'Subtiele animaties', 'SEO & performance basis'] }, { name: 'Pro', price: '€995', features: ['Volledig maatwerk design', 'Unieke branding look', 'Uitbreidbaar voor groei', 'Persoonlijke begeleiding'] }] },
  { icon: <Code size={32} />, title: 'Webontwikkeling', shortDescription: 'Betrouwbare techniek zonder onnodige complexiteit', description: 'Voor websites en webapplicaties die stabiel moeten werken en later eenvoudig uit te breiden zijn.', image: '/webon.png', highlightedPackage: 'Groei', highlightLabel: 'Beste balans', packages: [{ name: 'Starter', price: '€595', features: ['Professionele website', 'Snelle laadtijden', 'Eenvoudig beheerbaar'] }, { name: 'Groei', price: '€995', features: ['Uitgebreide pagina’s', 'Formulieren & koppelingen', 'Performance optimalisatie'] }, { name: 'Pro', price: '€1.495', features: ['Custom functionaliteit', 'Database of login systeem', 'Doorontwikkelbaar platform'] }] },
  { icon: <ShoppingCart size={32} />, title: 'E-commerce', shortDescription: 'Start eenvoudig met online verkopen', description: 'Ideaal voor ondernemers die hun eerste webshop willen starten zonder direct grote investeringen.', image: '/ecom.png', highlightedPackage: 'Starter', highlightLabel: 'Ideaal voor starters', packages: [{ name: 'Starter', price: '€895', features: ['Tot 10 producten', 'iDEAL betalingen', 'Gebruiksvriendelijk beheer'] }, { name: 'Groei', price: '€1.495', features: ['Onbeperkt producten', 'Kortingen & acties', 'Conversiegericht design'] }, { name: 'Pro', price: '€2.495', features: ['Maatwerk webshop', 'Automatiseringen', 'Analytics & optimalisatie'] }] },
  { icon: <Search size={32} />, title: 'SEO & Marketing', shortDescription: 'Gevonden worden in Google, stap voor stap', description: 'Geen dure contracten, maar duidelijke maandelijkse optimalisatie gericht op zichtbaarheid en groei.', image: '/seo.png', highlightedPackage: 'Starter', highlightLabel: 'Laagdrempelig', packages: [{ name: 'Starter', price: '€149 / maand', features: ['Technische SEO check', 'Basis optimalisatie', 'Maandelijkse rapportage'] }, { name: 'Groei', price: '€299 / maand', features: ['Content optimalisatie', 'Lokale SEO', 'Actieplan per maand'] }, { name: 'Pro', price: '€499 / maand', features: ['Concurrentie analyse', 'Doorlopende optimalisatie', 'Structurele groei'] }] },
  { icon: <Zap size={32} />, title: 'Performance Optimalisatie', shortDescription: 'Snelle winst voor je website', description: 'Een snellere website zorgt direct voor betere gebruikservaring en hogere conversies.', image: '/performance.png', highlightedPackage: 'Starter', highlightLabel: 'Quick win', packages: [{ name: 'Starter', price: '€295', features: ['Snelheidsanalyse', 'Afbeelding optimalisatie', 'Basis caching'] }, { name: 'Groei', price: '€495', features: ['Core Web Vitals', 'Lazy loading', 'Code optimalisatie'] }, { name: 'Pro', price: '€795', features: ['Geavanceerde optimalisatie', 'Monitoring', 'Advies voor groei'] }] },
];

const faq = [
  ['Moet ik vooraf betalen?', 'Nee. Wij werken zonder aanbetaling. We starten pas nadat alles duidelijk is afgestemd.'],
  ['Hoe lang duurt een project gemiddeld?', 'Starter-projecten zijn vaak binnen 1–2 weken klaar. Grotere projecten worden vooraf ingepland.'],
  ['Kan ik later uitbreiden?', 'Ja. Alle websites en webshops zijn zo opgebouwd dat uitbreiden altijd mogelijk is.'],
  ['Is support inbegrepen?', 'Ja. Na oplevering kun je altijd bij ons terecht voor vragen of kleine aanpassingen.'],
  ['Blijft de website mijn eigendom?', 'Ja. Na oplevering is de website volledig van jou.'],
];

const getCTA = (name) => name === 'Starter' ? 'Start eenvoudig' : name === 'Groei' ? 'Beste keuze – start nu' : 'Plan een kennismaking';
const getDelivery = (name) => name === 'Starter' ? 'Meestal binnen 1–2 weken opgeleverd' : name === 'Groei' ? 'Meestal binnen 2–4 weken opgeleverd' : 'Planning in overleg';

const ServicesPage = () => (
  <>
    <Helmet><title>Diensten – Vos Web Designs</title><meta name="description" content="Webdesign, webontwikkeling, e-commerce, SEO en performance pakketten van Vos Web Designs." /></Helmet>
    <main className="cinema-bg pt-24">
      <section className="cinematic-section">
        <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div><p className="eyebrow">Diensten & pakketten</p><h1 className="display-title mt-4 text-[clamp(3.6rem,10vw,8rem)]">Professionele websites die écht voor je werken.</h1></div>
          <div className="panel cut p-6"><p className="text-lg leading-8 text-slate-300">Van eerste website tot schaalbare online oplossing. Transparant, betaalbaar en zonder technische zorgen.</p><Link to="/contact" className="cta-link mt-6">Gratis kennismaking <ArrowRight size={18} /></Link></div>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10 grid gap-4 md:grid-cols-4">
          {['Transparante prijzen', 'Geen aanbetaling', 'Snelle oplevering', 'Persoonlijk contact'].map(item => <div key={item} className="panel cut p-5"><CheckCircle className="mb-4 text-[color:var(--accent2)]" /><p className="font-bold">{item}</p></div>)}
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10 space-y-20">
          {services.map((service, serviceIndex) => (
            <article key={service.title} className="panel cut overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[.8fr_1.2fr]">
                <div className="p-7 md:p-10">
                  <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-[color:var(--stroke)] text-[color:var(--accent)]">{service.icon}</div>
                  <p className="eyebrow">0{serviceIndex + 1} / service</p>
                  <h2 className="mt-4 font-heading text-5xl font-black tracking-[-.06em]">{service.title}</h2>
                  <p className="mt-5 text-xl text-white">{service.shortDescription}</p>
                  <p className="mt-4 leading-8 text-slate-300">{service.description}</p>
                  <div className="mt-8 overflow-hidden rounded-3xl border border-[color:var(--stroke)] bg-slate-950"> <img src={service.image} alt={service.title} className="h-64 w-full object-cover" /></div>
                </div>
                <div className="grid gap-4 border-t border-[color:var(--stroke)] p-5 md:p-7 lg:border-l lg:border-t-0">
                  {service.packages.map(pkg => {
                    const highlighted = pkg.name === service.highlightedPackage;
                    return (
                      <div key={pkg.name} className={`relative rounded-[1.75rem] border p-6 ${highlighted ? 'border-[color:var(--accent2)] bg-[color:var(--accent2)]/10 shadow-[0_0_50px_rgba(214,245,122,.12)]' : 'border-[color:var(--stroke)] bg-white/[.035]'}`}>
                        {highlighted && <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--accent2)] px-3 py-1 text-xs font-black uppercase tracking-[.14em] text-[#06101c]"><Star size={14} /> {service.highlightLabel}</span>}
                        <div className="flex flex-wrap items-end justify-between gap-3"><h3 className="font-heading text-3xl font-black">{pkg.name}</h3><p className="text-3xl font-black text-[color:var(--accent)]">{pkg.price}</p></div>
                        <p className="mt-2 text-sm text-slate-400">{getDelivery(pkg.name)} • Geen aanbetaling nodig</p>
                        <ul className="mt-5 grid gap-3">{pkg.features.map(f => <li key={f} className="flex gap-3 text-slate-300"><CheckCircle size={18} className="mt-1 shrink-0 text-[color:var(--accent2)]" />{f}</li>)}</ul>
                        <Link to="/contact" className={highlighted ? 'cta-link mt-6 w-full' : 'ghost-link mt-6 w-full'}>{getCTA(pkg.name)} <ArrowRight size={16} /></Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10 max-w-4xl">
          <p className="eyebrow">FAQ</p><h2 className="display-title mt-4 text-5xl md:text-7xl">Veelgestelde vragen.</h2>
          <div className="mt-10 grid gap-3">{faq.map(([q, a]) => <details key={q} className="panel cut group p-6"><summary className="cursor-pointer list-none font-heading text-xl font-black tracking-[-.03em] group-open:text-[color:var(--accent)]">{q}</summary><p className="mt-4 leading-7 text-slate-300">{a}</p></details>)}</div>
        </div>
      </section>

      <section className="cinematic-section pt-0"><div className="cinematic-container panel cut relative z-10 p-8 text-center md:p-12"><h2 className="display-title text-5xl md:text-7xl">Klaar om professioneel te groeien?</h2><p className="mx-auto mt-5 max-w-2xl text-slate-300">Plan vrijblijvend een kennismaking en ontdek welke oplossing het beste past bij jouw situatie.</p><Link to="/contact" className="cta-link mt-8">Start vandaag nog</Link></div></section>
    </main>
  </>
);

export default ServicesPage;
