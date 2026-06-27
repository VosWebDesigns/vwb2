import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Code, Palette, Search, ShoppingCart, Star, Zap, ArrowUpRight, ChevronDown } from 'lucide-react';
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
const getDelivery = (name) => name === 'Starter' ? 'Meestal binnen 1–2 weken' : name === 'Groei' ? 'Meestal binnen 2–4 weken' : 'Planning in overleg';

const TRUST_ITEMS = [
  { label: 'Transparante prijzen', sub: 'Geen verborgen kosten' },
  { label: 'Geen aanbetaling',     sub: 'Betalen na oplevering' },
  { label: 'Snelle oplevering',    sub: 'Starter in 1–2 weken' },
  { label: 'Persoonlijk contact',  sub: 'Directe communicatie' },
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
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(204,255,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,.05) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="cinematic-container relative z-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="status-dot" />
                <p data-reveal className="section-eyebrow">Diensten & pakketten</p>
              </div>
              <h1
                data-reveal
                className="display-xl mt-0 text-[clamp(3rem,8vw,7rem)]"
              >
                Professionele websites{' '}
                <span className="gradient-text-full">die écht voor je werken</span>.
              </h1>
              <p data-reveal className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Van eerste website tot schaalbare online oplossing. Transparant, betaalbaar en zonder technische zorgen.
              </p>
            </div>
          </div>
        </section>

        {/* ── Trust strip ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10 grid gap-3 grid-cols-2 md:grid-cols-4">
            {TRUST_ITEMS.map(({ label, sub }, i) => (
              <div
                key={label}
                data-reveal
                data-reveal-delay={i * 0.07}
                className="glass-card rounded-2xl p-5 flex flex-col gap-1.5 transition-all duration-300 hover:-translate-y-0.5"
                style={{ '--hover-shadow': '0 12px 40px rgba(204,255,0,.08)' }}
              >
                <CheckCircle size={18} style={{ color: 'var(--accent)' }} />
                <p className="font-bold text-white text-sm mt-1">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Services ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10 space-y-16">
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
                <article
                  key={service.title}
                  data-reveal
                  className="relative overflow-hidden rounded-3xl"
                  style={{ border: '1px solid var(--stroke)' }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: 'linear-gradient(to right, transparent, var(--accent), transparent)', opacity: 0.5 }}
                    aria-hidden="true"
                  />

                  {/* Service header */}
                  <div
                    className="backdrop-blur-sm px-7 py-6 md:px-10 md:py-8 grid gap-6 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                    style={{
                      background: 'rgba(8,8,12,.65)',
                      borderBottom: '1px solid var(--stroke)',
                    }}
                  >
                    <div
                      className="grid h-14 w-14 place-items-center rounded-2xl"
                      style={{
                        border: '1px solid var(--stroke)',
                        background: 'rgba(204,255,0,.04)',
                        color: 'var(--accent)',
                      }}
                    >
                      <Icon size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="status-dot status-dot-cyan" />
                        <p className="eyebrow">0{serviceIndex + 1} / dienst</p>
                      </div>
                      <h2
                        className="font-heading font-bold tracking-[-.05em] leading-none text-white"
                        style={{
                          fontFamily: "'Space Grotesk', system-ui, sans-serif",
                          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                        }}
                      >
                        {service.title}
                      </h2>
                    </div>
                    <div className="hidden sm:block overflow-hidden rounded-xl" style={{ border: '1px solid var(--stroke)' }}>
                      <SmartImage src={service.image} alt={service.title} className="h-24 w-40 object-cover" />
                    </div>
                  </div>

                  {/* Description + packages */}
                  <div className="grid gap-0 lg:grid-cols-[.9fr_1.1fr]">
                    {/* Left: description */}
                    <div
                      className="p-7 md:p-10"
                      style={{ borderBottom: '1px solid var(--stroke)' }}
                    >
                      <p className="text-xl text-white font-medium leading-8">{service.shortDescription}</p>
                      <p className="mt-4 leading-8 text-slate-300">{service.description}</p>
                      <div className="mt-6 block sm:hidden overflow-hidden rounded-xl" style={{ border: '1px solid var(--stroke)' }}>
                        <SmartImage src={service.image} alt={service.title} className="h-44 w-full object-cover" />
                      </div>
                      <Link to="/contact" className="ghost-link mt-7 inline-flex text-sm">
                        Vraag een offerte aan <ArrowRight size={14} />
                      </Link>
                    </div>

                    {/* Right: packages */}
                    <div className="grid gap-3 p-5 md:p-7 content-start">
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
                            className="relative rounded-[1.5rem] p-5 transition-all duration-300"
                            style={{
                              border: `1px solid ${highlighted ? 'var(--accent2)' : 'var(--stroke)'}`,
                              background: highlighted ? 'rgba(255,63,0,.05)' : 'rgba(255,255,255,.02)',
                              boxShadow: highlighted ? '0 0 40px rgba(255,63,0,.08)' : 'none',
                            }}
                          >
                            {highlighted && (pkg.badge || service.highlightLabel) && (
                              <span
                                className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[.12em]"
                                style={{ background: 'var(--accent2)', color: '#060608' }}
                              >
                                <Star size={11} />
                                {pkg.badge || service.highlightLabel}
                              </span>
                            )}

                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <h3 className="font-heading text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                                {pkg.name}
                              </h3>
                              <div className="text-right">
                                {discount > 0 && (
                                  <p className="text-xs font-bold text-slate-500 line-through">
                                    {formatPackagePrice(pkg.price)}
                                  </p>
                                )}
                                <p
                                  className="text-xl font-black"
                                  style={{ color: highlighted ? 'var(--accent2)' : 'var(--accent)' }}
                                >
                                  {formatPackagePrice(netPrice)}
                                  {pkg.recurring ? ` ${pkg.recurring}` : ''}
                                </p>
                              </div>
                            </div>

                            <p className="mt-1 text-[11px] font-mono uppercase tracking-[.10em] text-slate-500">
                              {getDelivery(pkg.name)} · Geen aanbetaling
                            </p>

                            <ul className="mt-4 grid gap-2">
                              {pkg.features.map((f) => (
                                <li key={f} className="flex gap-2.5 text-sm text-slate-300">
                                  <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: highlighted ? 'var(--accent2)' : 'var(--accent)' }} />
                                  {f}
                                </li>
                              ))}
                            </ul>

                            <Link
                              to="/contact"
                              className={highlighted ? 'cta-link mt-5 w-full text-sm' : 'ghost-link mt-5 w-full text-sm'}
                            >
                              {getCTA(pkg.name)} <ArrowUpRight size={14} />
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
          <div className="cinematic-container relative z-10">
            <div className="grid gap-12 lg:grid-cols-[.6fr_1fr] lg:items-start">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="status-dot" />
                  <p data-reveal className="section-eyebrow">FAQ</p>
                </div>
                <h2 data-reveal className="display-xl text-[clamp(2.4rem,5vw,4.5rem)]">
                  Veelgestelde <span className="gradient-text-cyan">vragen</span>.
                </h2>
                <p className="mt-5 text-slate-400 leading-7">
                  Staat jouw vraag er niet bij? Neem dan gerust contact op.
                </p>
                <Link to="/contact" className="ghost-link mt-6 inline-flex text-sm">
                  Stel je vraag <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid gap-2.5">
                {faq.map(([q, a]) => (
                  <details
                    key={q}
                    data-reveal
                    className="glass-card group rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <summary
                      className="flex items-center justify-between cursor-pointer list-none p-5 font-heading text-base font-bold tracking-[-.03em] transition group-open:text-[var(--accent)]"
                      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                    >
                      {q}
                      <ChevronDown
                        size={16}
                        className="shrink-0 transition-transform duration-300 group-open:rotate-180"
                        style={{ color: 'var(--accent)' }}
                      />
                    </summary>
                    <div style={{ borderTop: '1px solid var(--stroke)' }} className="px-5 pb-5 pt-4">
                      <p className="leading-7 text-slate-300 text-sm">{a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cinematic-section pt-0">
          <div
            data-reveal
            className="cinematic-container cyber-corner relative z-10 rounded-3xl p-8 text-center md:p-12 overflow-hidden"
            style={{
              border: '1px solid var(--stroke)',
              background: 'rgba(8,8,12,.85)',
              animation: 'glow-pulse 4s ease-in-out infinite',
            }}
          >
            <div className="pointer-events-none absolute inset-0 sci-fi-grid-fine opacity-25" aria-hidden="true" />
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
