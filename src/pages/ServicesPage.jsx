import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, CheckCircle, Code, Palette, Search, ShoppingCart, Star, Zap, ArrowUpRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
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

const FaqItem = ({ q, a, index, isOpen, onToggle }) => {
  const answerRef = useRef(null);

  useEffect(() => {
    const el = answerRef.current;
    if (!el) return;
    if (isOpen) {
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.55, ease: 'power2.out' }
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' });
    }
  }, [isOpen]);

  return (
    <div style={{ borderBottom: '1px solid rgba(200,168,106,.06)' }}>
      <button
        type="button"
        onClick={() => onToggle(index)}
        className="w-full flex items-baseline justify-between gap-6 py-6 text-left"
      >
        <span
          className="font-bold text-lg transition-colors duration-300"
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            letterSpacing: '-.03em',
            color: isOpen ? 'var(--accent)' : 'var(--accent3)',
          }}
        >
          {q}
        </span>
        <span
          className="shrink-0 font-mono text-xl leading-none transition-colors duration-300"
          style={{ color: isOpen ? 'var(--accent)' : 'rgba(200,168,106,.30)' }}
        >
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div ref={answerRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <p className="pb-6 text-base leading-8" style={{ color: 'rgba(240,237,230,.45)' }}>{a}</p>
      </div>
    </div>
  );
};

const ServicesPage = () => {
  const [services, setServices] = useState(() => cloneDefaultServiceCatalog());
  const [loading,  setLoading]  = useState(true);
  const [openFaq,  setOpenFaq]  = useState(null);

  const toggleFaq = (index) => setOpenFaq((prev) => prev === index ? null : index);

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

      <main className="cinema-bg overflow-hidden pt-24">

        {/* ── Hero ── */}
        <section className="relative py-20 md:py-28 px-5 md:px-10 lg:px-16 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(200,168,106,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,106,.022) 1px, transparent 1px)',
              backgroundSize: '90px 90px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-[1180px] mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="status-dot" />
              <p className="font-mono text-[.62rem] uppercase tracking-[.38em]" style={{ color: 'rgba(200,168,106,.40)' }}>
                Diensten & pakketten
              </p>
            </div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(3rem, 9vw, 8rem)',
                letterSpacing: '-.065em',
                lineHeight: 0.88,
                color: 'var(--accent3)',
                margin: 0,
              }}
            >
              ONZE<br />
              <em
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  fontSize: '1.04em',
                  letterSpacing: '-.02em',
                }}
              >
                diensten
              </em>
              .
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8" style={{ color: 'rgba(240,237,230,.42)' }}>
              Van eerste website tot schaalbare online oplossing. Transparant geprijsd, zonder technische zorgen.
            </p>
          </div>
        </section>

        {/* ── Trust strip ── */}
        <section className="px-5 md:px-10 lg:px-16 pb-10">
          <div
            className="max-w-[1180px] mx-auto grid grid-cols-2 md:grid-cols-4"
            style={{ borderTop: '1px solid rgba(200,168,106,.06)', borderBottom: '1px solid rgba(200,168,106,.06)' }}
          >
            {TRUST_ITEMS.map(({ label, sub }, i) => (
              <div
                key={label}
                className="flex flex-col gap-1.5 py-6 pr-6"
                style={{
                  borderRight: i < TRUST_ITEMS.length - 1 ? '1px solid rgba(200,168,106,.06)' : 'none',
                }}
              >
                <p
                  className="font-bold text-sm"
                  style={{ color: 'var(--accent3)', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                >
                  {label}
                </p>
                <p className="font-mono text-[.58rem] uppercase tracking-[.18em]" style={{ color: 'rgba(200,168,106,.30)' }}>
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Services ── */}
        <section className="px-5 md:px-10 lg:px-16 py-16">
          <div className="max-w-[1180px] mx-auto space-y-16">
            {loading && (
              <div className="text-center py-20">
                <span className="status-dot mx-auto mb-4 block" />
                <p className="font-mono text-[.65rem] uppercase tracking-[.20em] animate-pulse" style={{ color: 'rgba(200,168,106,.28)' }}>
                  Diensten laden…
                </p>
              </div>
            )}

            {services.map((service, serviceIndex) => {
              const Icon = iconMap[service.icon] || Palette;
              return (
                <article
                  key={service.title}
                  className="relative overflow-hidden rounded-3xl"
                  style={{ border: '1px solid rgba(200,168,106,.06)' }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(200,168,106,.20), transparent)' }}
                    aria-hidden="true"
                  />

                  {/* Service header */}
                  <div
                    className="relative overflow-hidden px-7 py-6 md:px-10 md:py-8 grid gap-6 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                    style={{
                      background: 'rgba(16,11,32,.60)',
                      borderBottom: '1px solid rgba(200,168,106,.06)',
                    }}
                  >
                    {/* Ghost service number */}
                    <div
                      className="pointer-events-none select-none absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block"
                      aria-hidden="true"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontStyle: 'italic',
                        fontWeight: 600,
                        fontSize: 'clamp(8rem, 18vw, 16rem)',
                        letterSpacing: '-.03em',
                        lineHeight: 1,
                        color: 'transparent',
                        WebkitTextStroke: '1px rgba(200,168,106,.06)',
                      }}
                    >
                      0{serviceIndex + 1}
                    </div>

                    {/* Icon */}
                    <div
                      className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
                      style={{
                        border: '1px solid rgba(200,168,106,.12)',
                        background: 'rgba(200,168,106,.04)',
                        color: 'var(--accent)',
                      }}
                    >
                      <Icon size={26} />
                    </div>

                    {/* Title */}
                    <div className="relative z-10">
                      <p className="font-mono text-[.58rem] uppercase tracking-[.26em] mb-2" style={{ color: 'rgba(200,168,106,.35)' }}>
                        0{serviceIndex + 1} / dienst
                      </p>
                      <h2
                        style={{
                          fontFamily: "'Space Grotesk', system-ui, sans-serif",
                          fontWeight: 700,
                          letterSpacing: '-.05em',
                          lineHeight: 1,
                          color: 'var(--accent3)',
                          fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                        }}
                      >
                        {service.title}
                      </h2>
                    </div>

                    {/* Image (desktop) */}
                    <div className="relative z-10 hidden sm:block overflow-hidden rounded-xl" style={{ border: '1px solid rgba(200,168,106,.06)' }}>
                      <SmartImage src={service.image} alt={service.title} className="h-24 w-40 object-cover" />
                    </div>
                  </div>

                  {/* Description + packages */}
                  <div className="grid gap-0 lg:grid-cols-[.9fr_1.1fr]">
                    {/* Left: description */}
                    <div
                      className="p-7 md:p-10"
                      style={{ borderRight: '1px solid rgba(200,168,106,.06)' }}
                    >
                      <p className="text-xl font-medium leading-8" style={{ color: 'var(--accent3)' }}>{service.shortDescription}</p>
                      <p className="mt-4 leading-8" style={{ color: 'rgba(240,237,230,.45)' }}>{service.description}</p>
                      <div className="mt-6 block sm:hidden overflow-hidden rounded-xl" style={{ border: '1px solid rgba(200,168,106,.06)' }}>
                        <SmartImage src={service.image} alt={service.title} className="h-44 w-full object-cover" />
                      </div>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 mt-7 font-mono text-[.65rem] uppercase tracking-[.16em] transition-opacity"
                        style={{ color: 'var(--accent)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.65'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                      >
                        Vraag een offerte aan <ArrowRight size={13} />
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
                              border: `1px solid ${highlighted ? 'rgba(124,92,191,.35)' : 'rgba(200,168,106,.08)'}`,
                              background: highlighted ? 'rgba(124,92,191,.04)' : 'rgba(200,168,106,.02)',
                              boxShadow: highlighted ? '0 0 40px rgba(124,92,191,.07)' : 'none',
                            }}
                          >
                            {highlighted && (pkg.badge || service.highlightLabel) && (
                              <span
                                className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[.12em]"
                                style={{ background: 'var(--accent2)', color: '#08050F' }}
                              >
                                <Star size={11} />
                                {pkg.badge || service.highlightLabel}
                              </span>
                            )}

                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <h3
                                className="font-bold text-xl"
                                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: 'var(--accent3)', letterSpacing: '-.03em' }}
                              >
                                {pkg.name}
                              </h3>
                              <div className="text-right">
                                {discount > 0 && (
                                  <p className="text-xs font-bold line-through" style={{ color: 'rgba(240,237,230,.25)' }}>
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

                            <p className="mt-1 font-mono text-[.58rem] uppercase tracking-[.10em]" style={{ color: 'rgba(200,168,106,.25)' }}>
                              {getDelivery(pkg.name)} · Geen aanbetaling
                            </p>

                            <ul className="mt-4 grid gap-2">
                              {pkg.features.map((f) => (
                                <li key={f} className="flex gap-2.5 text-sm" style={{ color: 'rgba(240,237,230,.55)' }}>
                                  <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: highlighted ? 'var(--accent2)' : 'var(--accent)' }} />
                                  {f}
                                </li>
                              ))}
                            </ul>

                            <Link
                              to="/contact"
                              className="inline-flex items-center gap-2 mt-5 w-full justify-center rounded-full py-2.5 font-mono text-[.62rem] uppercase tracking-[.16em] transition-all"
                              style={highlighted ? {
                                background: 'var(--accent2)',
                                color: '#08050F',
                                border: '1px solid var(--accent2)',
                              } : {
                                border: '1px solid rgba(200,168,106,.20)',
                                color: 'var(--accent)',
                              }}
                              onMouseEnter={(e) => {
                                if (!highlighted) e.currentTarget.style.background = 'rgba(200,168,106,.08)';
                              }}
                              onMouseLeave={(e) => {
                                if (!highlighted) e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              {getCTA(pkg.name)} <ArrowUpRight size={13} />
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
        <section className="px-5 md:px-10 lg:px-16 py-20">
          <div className="max-w-[1180px] mx-auto">
            <div className="grid gap-12 lg:grid-cols-[.6fr_1fr] lg:items-start">

              {/* Left: heading */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="status-dot" />
                  <p className="font-mono text-[.62rem] uppercase tracking-[.38em]" style={{ color: 'rgba(200,168,106,.40)' }}>
                    Veelgestelde vragen
                  </p>
                </div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                    letterSpacing: '-.065em',
                    lineHeight: 0.9,
                    color: 'var(--accent3)',
                    margin: 0,
                  }}
                >
                  ALLES<br />
                  <em
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontSize: '1.04em',
                      letterSpacing: '-.02em',
                    }}
                  >
                    duidelijk
                  </em>
                  ?
                </h2>
                <p className="mt-5 text-base leading-8" style={{ color: 'rgba(240,237,230,.40)' }}>
                  Staat jouw vraag er niet bij? Neem dan gerust contact op.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 mt-6 font-mono text-[.65rem] uppercase tracking-[.16em] transition-opacity"
                  style={{ color: 'var(--accent)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.65'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  Stel je vraag <ArrowRight size={13} />
                </Link>
              </div>

              {/* Right: accordion */}
              <div style={{ borderTop: '1px solid rgba(200,168,106,.06)' }}>
                {faq.map(([q, a], i) => (
                  <FaqItem
                    key={q}
                    q={q}
                    a={a}
                    index={i}
                    isOpen={openFaq === i}
                    onToggle={toggleFaq}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative py-28 px-5 md:px-10 lg:px-16">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[50vw] -translate-x-1/2"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(200,168,106,.06), transparent 60%)' }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(200,168,106,.15), transparent)' }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1180px] mx-auto text-center">
            <div className="inline-flex items-center gap-2.5 mb-8">
              <span className="status-dot" />
              <span className="font-mono text-[.62rem] uppercase tracking-[.36em]" style={{ color: 'rgba(200,168,106,.40)' }}>
                Beschikbaar voor nieuwe projecten
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(2.4rem, 6vw, 6rem)',
                letterSpacing: '-.06em',
                lineHeight: 0.9,
                color: 'var(--accent3)',
              }}
            >
              KLAAR OM<br />
              <em
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  fontSize: '1.04em',
                  letterSpacing: '-.02em',
                }}
              >
                samen
              </em>
              {' '}TE BOUWEN?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8" style={{ color: 'rgba(240,237,230,.40)' }}>
              Plan een vrijblijvend gesprek en ontdek welke oplossing het beste past bij jouw situatie.
            </p>
            <Link to="/contact" className="glow-button mt-10">
              Start vandaag nog <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>
    </>
  );
};

export default ServicesPage;
