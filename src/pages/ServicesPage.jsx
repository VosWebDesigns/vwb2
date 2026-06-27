import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Code, Palette, Search, ShoppingCart, Star, Zap } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { useReveal } from '@/hooks/useReveal';
import supabase from '@/lib/customSupabaseClient';
import { SERVICE_CATALOG_ID, cloneDefaultServiceCatalog, formatPackagePrice, getPackageDiscount, getPackageNetPrice, normalizeServiceCatalog } from '@/lib/serviceCatalog';

const iconMap = {
  palette: Palette,
  code: Code,
  'shopping-cart': ShoppingCart,
  search: Search,
  zap: Zap,
};

const faq = [
  ['Moet ik vooraf betalen?', 'Nee. Wij werken zonder aanbetaling. We starten pas nadat alles duidelijk is afgestemd.'],
  ['Hoe lang duurt een project gemiddeld?', 'Starter-projecten zijn vaak binnen 1–2 weken klaar. Grotere projecten worden vooraf ingepland.'],
  ['Kan ik later uitbreiden?', 'Ja. Alle websites en webshops zijn zo opgebouwd dat uitbreiden altijd mogelijk is.'],
  ['Is support inbegrepen?', 'Ja. Na oplevering kun je altijd bij ons terecht voor vragen of kleine aanpassingen.'],
  ['Blijft de website mijn eigendom?', 'Ja. Na oplevering is de website volledig van jou.'],
];

const getCTA = (name) => name === 'Starter' ? 'Start eenvoudig' : name === 'Groei' ? 'Beste keuze – start nu' : 'Plan een kennismaking';
const getDelivery = (name) => name === 'Starter' ? 'Meestal binnen 1–2 weken opgeleverd' : name === 'Groei' ? 'Meestal binnen 2–4 weken opgeleverd' : 'Planning in overleg';

const ServicesPage = () => {
  const [services, setServices] = useState(() => cloneDefaultServiceCatalog());
  const [loading, setLoading] = useState(true);
  const rootRef = useRef(null);
  useReveal(rootRef, [loading, services]);

  useEffect(() => {
    let mounted = true;
    const loadCatalog = async () => {
      const { data, error } = await supabase.from('service_catalog').select('catalog').eq('id', SERVICE_CATALOG_ID).maybeSingle();
      if (!mounted) return;
      if (error) console.error('SERVICE_CATALOG_PUBLIC_LOAD_FAILED', { code: error.code, message: error.message });
      setServices(data?.catalog ? normalizeServiceCatalog(data.catalog) : cloneDefaultServiceCatalog());
      setLoading(false);
    };
    loadCatalog();
    return () => { mounted = false; };
  }, []);

  return (
  <>
    <Helmet><title>Diensten – Vos Web Designs</title><meta name="description" content="Webdesign, webontwikkeling, e-commerce, SEO en performance pakketten van Vos Web Designs." /></Helmet>
    <main ref={rootRef} className="cinema-bg overflow-hidden pt-24">
      <section className="cinematic-section">
        <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div><p data-reveal className="section-eyebrow">Diensten & pakketten</p><h1 data-reveal className="display-xl mt-4 text-[clamp(3.4rem,9vw,7.5rem)]">Professionele websites die <span className="gradient-text-full">écht voor je werken</span>.</h1></div>
          <div data-reveal className="glass-card rounded-2xl p-6"><p className="text-lg leading-8 text-slate-300">Van eerste website tot schaalbare online oplossing. Transparant, betaalbaar en zonder technische zorgen.</p><Link to="/contact" className="glow-button mt-6">Gratis kennismaking <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10 grid gap-4 md:grid-cols-4">
          {['Transparante prijzen', 'Geen aanbetaling', 'Snelle oplevering', 'Persoonlijk contact'].map((item, i) => <div key={item} data-reveal data-reveal-delay={i * 0.06} className="glass-card rounded-2xl p-5"><CheckCircle className="mb-4 text-[color:var(--accent2)]" /><p className="font-bold">{item}</p></div>)}
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10 space-y-20">
          {loading && <div className="panel cut p-6 text-slate-300">Diensten laden…</div>}
          {services.map((service, serviceIndex) => {
            const Icon = iconMap[service.icon] || Palette;
            return (
            <article key={service.title} data-reveal className="glass-card overflow-hidden rounded-3xl">
              <div className="grid gap-0 lg:grid-cols-[.8fr_1.2fr]">
                <div className="p-7 md:p-10">
                  <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-[color:var(--stroke)] text-[color:var(--accent)]"><Icon size={32} /></div>
                  <p className="eyebrow">0{serviceIndex + 1} / service</p>
                  <h2 className="mt-4 font-heading text-5xl font-black tracking-[-.06em]">{service.title}</h2>
                  <p className="mt-5 text-xl text-white">{service.shortDescription}</p>
                  <p className="mt-4 leading-8 text-slate-300">{service.description}</p>
                  <div className="mt-8 overflow-hidden rounded-3xl border border-[color:var(--stroke)] bg-slate-950"> <SmartImage src={service.image} alt={service.title} className="h-64 w-full object-cover" /></div>
                </div>
                <div className="grid gap-4 border-t border-[color:var(--stroke)] p-5 md:p-7 lg:border-l lg:border-t-0">
                  {service.packages.map(pkg => {
                    const fallbackHighlightedId = service.packages.some((item) => item.id === service.highlightedPackageId) ? service.highlightedPackageId : (service.packages[1]?.id || service.packages[0]?.id);
                    const highlighted = pkg.id === fallbackHighlightedId;
                    const discount = getPackageDiscount(pkg);
                    const netPrice = getPackageNetPrice(pkg);
                    return (
                      <div key={pkg.id} className={`relative rounded-[1.75rem] border p-6 ${highlighted ? 'border-[color:var(--accent2)] bg-[color:var(--accent2)]/10 shadow-[0_0_50px_rgba(214,245,122,.12)]' : 'border-[color:var(--stroke)] bg-white/[.035]'}`}>
                        {highlighted && (pkg.badge || service.highlightLabel) && <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--accent2)] px-3 py-1 text-xs font-black uppercase tracking-[.14em] text-[#06101c]"><Star size={14} /> {pkg.badge || service.highlightLabel}</span>}
                        <div className="flex flex-wrap items-end justify-between gap-3"><h3 className="font-heading text-3xl font-black">{pkg.name}</h3><div className="text-right">{discount > 0 && <p className="text-sm font-bold text-slate-500 line-through">{formatPackagePrice(pkg.price)}</p>}<p className="text-3xl font-black text-[color:var(--accent)]">{formatPackagePrice(netPrice)}{pkg.recurring ? ` ${pkg.recurring}` : ''}</p></div></div>
                        <p className="mt-2 text-sm text-slate-400">{getDelivery(pkg.name)} • Geen aanbetaling nodig</p>
                        <ul className="mt-5 grid gap-3">{pkg.features.map(f => <li key={f} className="flex gap-3 text-slate-300"><CheckCircle size={18} className="mt-1 shrink-0 text-[color:var(--accent2)]" />{f}</li>)}</ul>
                        <Link to="/contact" className={highlighted ? 'cta-link mt-6 w-full' : 'ghost-link mt-6 w-full'}>{getCTA(pkg.name)} <ArrowRight size={16} /></Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
          })}
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10 max-w-4xl">
          <p data-reveal className="section-eyebrow">FAQ</p><h2 data-reveal className="display-xl mt-4 text-5xl md:text-7xl">Veelgestelde <span className="gradient-text-cyan">vragen</span>.</h2>
          <div className="mt-10 grid gap-3">{faq.map(([q, a]) => <details key={q} data-reveal className="glass-card group rounded-2xl p-6"><summary className="cursor-pointer list-none font-heading text-xl font-black tracking-[-.03em] group-open:text-[color:var(--accent)]">{q}</summary><p className="mt-4 leading-7 text-slate-300">{a}</p></details>)}</div>
        </div>
      </section>

      <section className="cinematic-section pt-0"><div data-reveal className="cinematic-container glass-card relative z-10 rounded-3xl p-8 text-center md:p-12"><h2 className="display-xl text-5xl md:text-7xl">Klaar om <span className="gradient-text-full">professioneel te groeien</span>?</h2><p className="mx-auto mt-5 max-w-2xl text-slate-300">Plan vrijblijvend een kennismaking en ontdek welke oplossing het beste past bij jouw situatie.</p><Link to="/contact" className="glow-button mt-8">Start vandaag nog</Link></div></section>
    </main>
  </>
  );
};

export default ServicesPage;
