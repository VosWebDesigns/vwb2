import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
import MagneticButton from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  palette: Palette,
  code: Code,
  'shopping-cart': ShoppingCart,
  search: Search,
  zap: Zap,
};

const FAQ_ITEMS = [
  ['Moet ik vooraf betalen?', 'Nee. Wij werken zonder aanbetaling. We starten pas nadat alles duidelijk is afgestemd.'],
  ['Hoe lang duurt een project gemiddeld?', 'Starter-projecten zijn vaak binnen 1–2 weken klaar. Grotere projecten worden vooraf ingepland.'],
  ['Kan ik later uitbreiden?', 'Ja. Alle websites en webshops zijn zo opgebouwd dat uitbreiden altijd mogelijk is.'],
  ['Is support inbegrepen?', 'Ja. Na oplevering kun je altijd bij ons terecht voor vragen of kleine aanpassingen.'],
  ['Blijft de website mijn eigendom?', 'Ja. Na oplevering is de website volledig van jou.'],
];

const TRUST_ITEMS = [
  { label: 'Transparante prijzen', sub: 'Geen verborgen kosten' },
  { label: 'Geen aanbetaling',     sub: 'Betalen na oplevering' },
  { label: 'Snelle oplevering',    sub: 'Starter in 1–2 weken' },
  { label: 'Persoonlijk contact',  sub: 'Directe communicatie' },
];

const getCTA      = (name) => name === 'Starter' ? 'Start eenvoudig' : name === 'Groei' ? 'Beste keuze – start nu' : 'Plan een kennismaking';
const getDelivery = (name) => name === 'Starter' ? 'Meestal binnen 1–2 weken' : name === 'Groei' ? 'Meestal binnen 2–4 weken' : 'Planning in overleg';

const FaqItem = ({ question, answer, index }) => {
  const [open, setOpen]   = useState(false);
  const descRef           = useRef(null);
  const rowRef            = useRef(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          delay: index * 0.07,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power3.out' });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: 'power3.inOut' });
    }
  }, [open]);

  return (
    <div ref={rowRef} className="border-b" style={{ borderColor: 'rgba(201,169,110,.1)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors"
        style={{ color: open ? 'var(--accent)' : 'var(--accent3)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = open ? 'var(--accent)' : 'var(--accent3)'; }}
      >
        <span className="font-heading font-black text-base md:text-lg">{question}</span>
        <ArrowUpRight
          size={18}
          className="shrink-0 transition-all duration-400 ml-4"
          style={{ color: 'var(--accent)', transform: open ? 'rotate(135deg)' : 'none' }}
        />
      </button>
      <div ref={descRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <p
          className="pb-6 text-sm leading-[1.85]"
          style={{ color: 'rgba(240,235,227,.48)' }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
};

const PricingCard = ({ pkg, highlighted, serviceHighlightLabel }) => {
  const cardRef = useRef(null);
  const discount  = getPackageDiscount(pkg);
  const netPrice  = getPackageNetPrice(pkg);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 8,
      rotateX: -y * 8,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0, rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden transition-all duration-300"
      style={{
        border: `1px solid ${highlighted ? 'rgba(138,92,246,.45)' : 'rgba(201,169,110,.12)'}`,
        background: highlighted ? 'rgba(138,92,246,.06)' : 'rgba(8,8,16,.6)',
        padding: 'clamp(1.25rem, 2.5vw, 2rem)',
        boxShadow: highlighted ? '0 0 50px rgba(138,92,246,.12)' : 'none',
        backdropFilter: 'blur(20px)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {highlighted && (pkg.badge || serviceHighlightLabel) && (
        <span
          className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[.6rem] font-black uppercase tracking-[.16em]"
          style={{ background: 'var(--accent2)', color: '#06060c' }}
        >
          <Star size={10} />
          {pkg.badge || serviceHighlightLabel}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <h3
          className="font-heading font-black uppercase leading-none"
          style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', letterSpacing: '-.04em', color: 'var(--accent3)' }}
        >
          {pkg.name}
        </h3>
        <div className="text-right shrink-0">
          {discount > 0 && (
            <p
              className="font-mono text-[.6rem] line-through"
              style={{ color: 'rgba(240,235,227,.3)' }}
            >
              {formatPackagePrice(pkg.price)}
            </p>
          )}
          <p
            className="font-heading font-black leading-none"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              letterSpacing: '-.05em',
              color: highlighted ? 'var(--accent2)' : 'var(--accent)',
            }}
          >
            {formatPackagePrice(netPrice)}
            {pkg.recurring && (
              <span style={{ fontSize: '.5em', letterSpacing: '0' }}>{pkg.recurring}</span>
            )}
          </p>
        </div>
      </div>

      <p
        className="mt-2 font-mono text-[.55rem] uppercase tracking-[.25em]"
        style={{ color: 'rgba(201,169,110,.35)' }}
      >
        {getDelivery(pkg.name)} · Geen aanbetaling
      </p>

      <div className="mt-5 h-px" style={{ background: 'rgba(201,169,110,.08)' }} />

      <ul className="mt-5 grid gap-2.5">
        {pkg.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-3 text-sm"
            style={{ color: 'rgba(240,235,227,.55)' }}
          >
            <CheckCircle
              size={13}
              className="mt-0.5 shrink-0"
              style={{ color: highlighted ? 'var(--accent2)' : 'var(--accent)' }}
            />
            {f}
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        className={highlighted ? 'glow-button mt-6 w-full justify-center' : 'ghost-button mt-6 w-full justify-center'}
        style={{ fontSize: '.72rem' }}
      >
        {getCTA(pkg.name)} <ArrowUpRight size={13} />
      </Link>
    </div>
  );
};

const ServicesPage = () => {
  const heroRef    = useRef(null);
  const titleRef   = useRef(null);
  const [services, setServices] = useState(() => cloneDefaultServiceCatalog());
  const [loading,  setLoading]  = useState(true);

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

  return (
    <>
      <Helmet>
        <title>Diensten – Vos Web Designs</title>
        <meta name="description" content="Webdesign, webontwikkeling, e-commerce, SEO en performance pakketten van Vos Web Designs." />
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
            className="pointer-events-none absolute top-0 right-0 h-[60vh] w-[55vw]"
            style={{ background: 'radial-gradient(ellipse at 90% 5%, rgba(201,169,110,.07), transparent 60%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-[1400px] mx-auto w-full">
            <p
              className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-8"
              style={{ color: 'rgba(201,169,110,.38)' }}
            >
              — Diensten & pakketten
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
                DIEN
                <em
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    fontSize: '.9em',
                    letterSpacing: '-.03em',
                  }}
                >
                  sten
                </em>
                .
              </h1>
            </div>
            <p
              className="mt-8 max-w-xl text-base leading-[1.9]"
              style={{ color: 'rgba(240,235,227,.42)' }}
            >
              Van eerste website tot schaalbare online oplossing. Transparant, betaalbaar en zonder technische zorgen.
            </p>
          </div>
        </section>

        {/* ── Trust strip ── */}
        <section className="relative px-5 py-16 md:px-10 lg:px-16">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.12), transparent)' }}
            aria-hidden="true"
          />
          <div className="max-w-[1400px] mx-auto grid gap-3 grid-cols-2 md:grid-cols-4">
            {TRUST_ITEMS.map(({ label, sub }) => (
              <div
                key={label}
                className="flex flex-col gap-1.5 p-5 transition-all duration-300"
                style={{ border: '1px solid rgba(201,169,110,.1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.28)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.1)'; }}
              >
                <CheckCircle size={16} style={{ color: 'var(--accent)' }} />
                <p className="font-heading font-bold text-sm mt-1" style={{ color: 'var(--accent3)' }}>{label}</p>
                <p className="font-mono text-[.55rem] uppercase tracking-[.2em]" style={{ color: 'rgba(201,169,110,.38)' }}>{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Services ── */}
        <section className="relative px-5 py-16 md:px-10 lg:px-16">
          <div className="max-w-[1400px] mx-auto space-y-16">
            {loading && (
              <div className="py-20 text-center">
                <p
                  className="font-mono text-[.62rem] uppercase tracking-[.4em] animate-pulse"
                  style={{ color: 'rgba(201,169,110,.3)' }}
                >
                  Diensten laden…
                </p>
              </div>
            )}

            {services.map((service, serviceIndex) => {
              const Icon = iconMap[service.icon] || Palette;
              return (
                <article
                  key={service.title}
                  className="relative overflow-hidden"
                  style={{ border: '1px solid rgba(201,169,110,.1)' }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: 'linear-gradient(to right, transparent, var(--accent), transparent)', opacity: 0.45 }}
                    aria-hidden="true"
                  />

                  {/* Service header */}
                  <div
                    className="px-7 py-7 md:px-10 md:py-9 grid gap-6 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                    style={{
                      background: 'rgba(8,8,16,.6)',
                      backdropFilter: 'blur(20px)',
                      borderBottom: '1px solid rgba(201,169,110,.08)',
                    }}
                  >
                    <div
                      className="grid h-14 w-14 place-items-center rounded-full"
                      style={{ border: '1px solid rgba(201,169,110,.18)', background: 'rgba(201,169,110,.06)', color: 'var(--accent)' }}
                    >
                      <Icon size={26} />
                    </div>
                    <div>
                      <p
                        className="font-mono text-[.58rem] uppercase tracking-[.35em] mb-3"
                        style={{ color: 'rgba(201,169,110,.38)' }}
                      >
                        0{serviceIndex + 1} / dienst
                      </p>
                      <h2
                        className="font-heading font-black uppercase leading-none"
                        style={{
                          fontSize: 'clamp(1.8rem, 4vw, 4rem)',
                          letterSpacing: '-.06em',
                          color: 'var(--accent3)',
                        }}
                      >
                        {service.title}
                      </h2>
                    </div>
                    <div className="hidden sm:block overflow-hidden" style={{ borderRadius: 0 }}>
                      <SmartImage src={service.image} alt={service.title} className="h-24 w-44 object-cover" />
                    </div>
                  </div>

                  {/* Description + packages */}
                  <div className="grid gap-0 lg:grid-cols-[.9fr_1.1fr]">
                    <div
                      className="p-7 md:p-10"
                      style={{ borderRight: '1px solid rgba(201,169,110,.08)' }}
                    >
                      <p
                        className="text-base font-semibold leading-[1.85]"
                        style={{ color: 'var(--accent3)' }}
                      >
                        {service.shortDescription}
                      </p>
                      <p
                        className="mt-4 text-sm leading-[1.9]"
                        style={{ color: 'rgba(240,235,227,.45)' }}
                      >
                        {service.description}
                      </p>
                      <div className="mt-6 block sm:hidden overflow-hidden">
                        <SmartImage src={service.image} alt={service.title} className="h-44 w-full object-cover" />
                      </div>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 mt-7 font-mono text-[.65rem] uppercase tracking-[.22em] transition-colors"
                        style={{ color: 'rgba(201,169,110,.5)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(201,169,110,.5)'; }}
                      >
                        Vraag een offerte aan <ArrowRight size={12} />
                      </Link>
                    </div>

                    <div className="grid gap-3 p-5 md:p-7 content-start">
                      {service.packages.map((pkg) => {
                        const fallbackHighlightedId = service.packages.some(
                          (item) => item.id === service.highlightedPackageId
                        ) ? service.highlightedPackageId
                          : service.packages[1]?.id || service.packages[0]?.id;
                        const highlighted = pkg.id === fallbackHighlightedId;

                        return (
                          <PricingCard
                            key={pkg.id}
                            pkg={pkg}
                            highlighted={highlighted}
                            serviceHighlightLabel={service.highlightLabel}
                          />
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
        <section className="relative py-24 md:py-36 px-5 md:px-10 lg:px-16">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.12), transparent)' }}
            aria-hidden="true"
          />
          <div className="max-w-[1400px] mx-auto grid gap-16 lg:grid-cols-[.55fr_1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p
                className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-8"
                style={{ color: 'rgba(201,169,110,.38)' }}
              >
                — FAQ
              </p>
              <h2
                className="font-heading font-black uppercase leading-[.9]"
                style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', letterSpacing: '-.055em', color: 'var(--accent3)' }}
              >
                VEEL
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
                  gestelde
                </em>
                <br />
                VRAGEN
              </h2>
              <p
                className="mt-7 text-sm leading-[1.85]"
                style={{ color: 'rgba(240,235,227,.42)' }}
              >
                Staat uw vraag er niet bij? Neem dan gerust contact op.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-6 font-mono text-[.65rem] uppercase tracking-[.22em] transition-colors"
                style={{ color: 'rgba(201,169,110,.5)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(201,169,110,.5)'; }}
              >
                Stel uw vraag <ArrowRight size={12} />
              </Link>
            </div>

            <div style={{ borderTop: '1px solid rgba(201,169,110,.1)' }}>
              {FAQ_ITEMS.map(([q, a], i) => (
                <FaqItem key={q} question={q} answer={a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative py-24 md:py-36 px-5 md:px-10 lg:px-16">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.14), transparent)' }}
            aria-hidden="true"
          />
          <div className="max-w-[1400px] mx-auto text-center">
            <div className="inline-flex items-center gap-2.5 mb-10">
              <span className="status-dot" />
              <span
                className="font-mono text-[.62rem] uppercase tracking-[.38em]"
                style={{ color: 'rgba(201,169,110,.45)' }}
              >
                Beschikbaar voor nieuwe projecten
              </span>
            </div>
            <h2
              className="font-heading font-black uppercase leading-[.9]"
              style={{ fontSize: 'clamp(3rem, 10vw, 10rem)', letterSpacing: '-.06em', color: 'var(--accent3)' }}
            >
              KLAAR OM
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
                professioneel
              </em>
              <br />
              TE GROEIEN?
            </h2>
            <div className="mt-12">
              <MagneticButton to="/contact" className="glow-button">
                Start vandaag nog <ArrowRight size={16} />
              </MagneticButton>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default ServicesPage;
