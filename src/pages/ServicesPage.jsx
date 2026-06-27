import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Code, Palette, Search, ShoppingCart, Star, Zap, ArrowUpRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { useReveal } from '@/hooks/useReveal';
import supabase from '@/lib/customSupabaseClient';
import {
  SERVICE_CATALOG_ID,
  cloneDefaultServiceCatalog,
  formatPackagePrice,
  getPackageDiscount,
  getPackageNetPrice,
  normalizeServiceCatalog,
} from '@/lib/serviceCatalog';

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

const getCTA      = (name) => name === 'Starter' ? 'Start eenvoudig' : name === 'Groei' ? 'Beste keuze – start nu' : 'Plan een kennismaking';
const getDelivery = (name) => name === 'Starter' ? 'Meestal binnen 1–2 weken opgeleverd' : name === 'Groei' ? 'Meestal binnen 2–4 weken opgeleverd' : 'Planning in overleg';

const TRUST_ITEMS = [
  { label: 'Transparante prijzen', icon: '⬡' },
  { label: 'Geen aanbetaling',     icon: '⬡' },
  { label: 'Snelle oplevering',    icon: '⬡' },
  { label: 'Persoonlijk contact',  icon: '⬡' },
];

const ServicesPage = () => {
  const [services, setServices] = useState(() => cloneDefaultServiceCatalog());
  const [loading,  setLoading]  = useState(true);
  const rootRef = useRef(null);
  useReveal(rootRef, [loading, services]);

  useEffect(() => {
    let mounted = true;
    const loadCatalog = async () => {
      const { data, error } = await supabase
        .from('service_catalog')
        .select('catalog')
        .eq('id', SERVICE_CATALOG_ID)
        .maybeSingle();
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
      <Helmet>
        <title>Diensten – Vos Web Designs</title>
        <meta name="description" content="Webdesign, webontwikkeling, e-commerce, SEO en performance pakketten van Vos Web Designs." />
      </Helmet>

      <main ref={rootRef} className="cinema-bg overflow-hidden pt-24">

        {/* ── Hero ── */}
        <section className="cinematic-section relative overflow-hidden">
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(140,214,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(140,214,255,.06) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="status-dot" />
                <p data-reveal className="section-eyebrow">Diensten & pakketten</p>
              </div>
              <h1
                data-reveal
                className="display-xl mt-0 text-[clamp(3.4rem,9vw,7.5rem)]"
              >
                Professionele websites die{' '}
                <span className="gradient-text-full">écht voor je werken</span>.
              </h1>
            </div>
            <div data-reveal className="glass-card cyber-corner rounded-2xl p-7">
              <span className="hud-label block mb-3">Studio diensten</span>
              <p className="text-lg leading-8 text-slate-300">
                Van eerste website tot schaalbare online oplossing. Transparant, betaalbaar en zonder technische zorgen.
              </p>
              <Link to="/contact" className="glow-button mt-6">
                Gratis kennismaking <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Trust strip ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10 grid gap-3 grid-cols-2 md:grid-cols-4">
            {TRUST_ITEMS.map(({ label }, i) => (
              <div
                key={label}
                data-reveal
                data-reveal-delay={i * 0.07}
                className="glass-card group rounded-2xl p-5 flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(140,214,255,.1)]"
              >
                <CheckCircle className="shrink-0 text-[var(--accent2)]" size={20} />
                <p className="font-bold text-white text-sm">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Services ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10 space-y-20">
            {loading && (
              <div className="glass-card rounded-2xl p-8 text-center">
                <span className="status-dot mx-auto mb-4 block" />
                <p className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">
                  Diensten laden…
                </p>
              </div>
            )}

            {services.map((service, serviceIndex) => {
              const Icon = iconMap[service.icon] || Palette;
              return (
                <article key={service.title} data-reveal className="glass-card overflow-hidden rounded-3xl relative">
                  {/* Top accent line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60" aria-hidden="true" />

                  <div className="grid gap-0 lg:grid-cols-[.8fr_1.2fr]">
                    {/* Left: service info */}
                    <div className="p-7 md:p-10">
                      <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-[var(--stroke)] bg-[rgba(140,214,255,.06)] text-[var(--accent)]">
                        <Icon size={32} />
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="status-dot status-dot-cyan" />
                        <p className="eyebrow">0{serviceIndex + 1} / dienst</p>
                      </div>
                      <h2 className="font-heading text-[clamp(2.4rem,5vw,4rem)] font-black tracking-[-.06em] leading-none">
                        {service.title}
                      </h2>
                      <p className="mt-5 text-xl text-white font-medium">{service.shortDescription}</p>
                      <p className="mt-4 leading-8 text-slate-300">{service.description}</p>
                      <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-slate-950">
                        <SmartImage src={service.image} alt={service.title} className="h-48 sm:h-56 md:h-64 lg:h-72 w-full object-cover" />
                      </div>
                    </div>

                    {/* Right: packages */}
                    <div className="grid gap-4 border-t border-[var(--stroke)] p-5 md:p-7 lg:border-l lg:border-t-0 content-start">
                      {service.packages.map((pkg) => {
                        const fallbackHighlightedId = service.packages.some(
                          (item) => item.id === service.highlightedPackageId
                        )
                          ? service.highlightedPackageId
                          : service.packages[1]?.id || service.packages[0]?.id;
                        const highlighted = pkg.id === fallbackHighlightedId;
                        const discount    = getPackageDiscount(pkg);
                        const netPrice    = getPackageNetPrice(pkg);

                        return (
                          <div
                            key={pkg.id}
                            className={`relative rounded-[1.75rem] border p-6 transition-all duration-300 ${
                              highlighted
                                ? 'border-[var(--accent2)] bg-[rgba(214,245,122,.07)] shadow-[0_0_50px_rgba(214,245,122,.12)] hover:shadow-[0_0_70px_rgba(214,245,122,.18)]'
                                : 'border-[var(--stroke)] bg-white/[.03] hover:border-[rgba(140,214,255,.3)]'
                            }`}
                          >
                            {/* Highlight badge */}
                            {highlighted && (pkg.badge || service.highlightLabel) && (
                              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent2)] px-3 py-1 text-xs font-black uppercase tracking-[.14em] text-[#06101c]">
                                <Star size={12} />
                                {pkg.badge || service.highlightLabel}
                              </span>
                            )}

                            <div className="flex flex-wrap items-end justify-between gap-3">
                              <h3 className="font-heading text-2xl font-black">{pkg.name}</h3>
                              <div className="text-right">
                                {discount > 0 && (
                                  <p className="text-sm font-bold text-slate-500 line-through">
                                    {formatPackagePrice(pkg.price)}
                                  </p>
                                )}
                                <p className={`text-2xl font-black ${highlighted ? 'text-[var(--accent2)]' : 'text-[var(--accent)]'}`}>
                                  {formatPackagePrice(netPrice)}
                                  {pkg.recurring ? ` ${pkg.recurring}` : ''}
                                </p>
                              </div>
                            </div>

                            <p className="mt-2 text-xs font-mono uppercase tracking-[.14em] text-slate-500">
                              {getDelivery(pkg.name)} · Geen aanbetaling
                            </p>

                            <ul className="mt-5 grid gap-2.5">
                              {pkg.features.map((f) => (
                                <li key={f} className="flex gap-3 text-sm text-slate-300">
                                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-[var(--accent2)]" />
                                  {f}
                                </li>
                              ))}
                            </ul>

                            <Link
                              to="/contact"
                              className={highlighted ? 'cta-link mt-6 w-full' : 'ghost-link mt-6 w-full'}
                            >
                              {getCTA(pkg.name)} <ArrowUpRight size={15} />
                            </Link>
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

        {/* ── FAQ ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="status-dot" />
              <p data-reveal className="section-eyebrow">FAQ</p>
            </div>
            <h2 data-reveal className="display-xl text-[clamp(2.8rem,7vw,6rem)]">
              Veelgestelde <span className="gradient-text-cyan">vragen</span>.
            </h2>
            <div className="mt-12 grid gap-3">
              {faq.map(([q, a]) => (
                <details
                  key={q}
                  data-reveal
                  className="glass-card group rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none p-6 font-heading text-lg font-black tracking-[-.03em] transition group-open:text-[var(--accent)]">
                    {q}
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-[var(--accent)] transition-transform duration-300 group-open:rotate-90"
                    />
                  </summary>
                  <div className="border-t border-[var(--stroke)] px-6 pb-6 pt-4">
                    <p className="leading-7 text-slate-300">{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cinematic-section pt-0">
          <div
            data-reveal
            className="cinematic-container glass-card cyber-corner relative z-10 rounded-3xl p-8 text-center md:p-12 overflow-hidden"
            style={{ animation: 'glow-pulse 4s ease-in-out infinite' }}
          >
            <div className="pointer-events-none absolute inset-0 sci-fi-grid-fine opacity-30" aria-hidden="true" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2.5 mb-6">
                <span className="status-dot" />
                <span className="hud-label">Beschikbaar voor nieuwe projecten</span>
                <span className="status-dot" />
              </div>
              <h2 className="display-xl text-[clamp(2.4rem,6vw,5.5rem)]">
                Klaar om{' '}
                <span className="gradient-text-full">professioneel te groeien</span>?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-slate-300">
                Plan vrijblijvend een kennismaking en ontdek welke oplossing het beste past bij jouw situatie.
              </p>
              <Link to="/contact" className="glow-button mt-8">
                Start vandaag nog <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default ServicesPage;
