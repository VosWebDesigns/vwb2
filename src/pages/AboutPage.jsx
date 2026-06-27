import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, CheckCircle } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const FACTS = [
  { value: '100%', label: 'Maatwerk' },
  { value: '0',    label: 'Templates' },
  { value: '1',    label: 'Specialist' },
];

const VALUES = [
  { num: '01', label: 'Transparantie', desc: 'Geen verborgen kosten, geen verrassingen. Alles wordt van tevoren afgestemd en schriftelijk vastgelegd.' },
  { num: '02', label: 'Kwaliteit',     desc: 'Elk detail telt. Van typografie tot laadtijden — wij accepteren geen enkel compromis op kwaliteit.' },
  { num: '03', label: 'Resultaat',     desc: 'Een mooie website is een middel, niet het doel. Jouw groei en conversie zijn het eindpunt van elk project.' },
];

const ValueItem = ({ num, label, desc }) => {
  const [open, setOpen]   = useState(false);
  const descRef           = useRef(null);

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
    <div className="border-b" style={{ borderColor: 'rgba(201,169,110,.10)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between py-6 md:py-8 text-left"
        style={{ color: 'var(--accent3)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent3)'; }}
      >
        <div className="flex items-baseline gap-5">
          <span
            className="font-mono shrink-0"
            style={{ fontSize: '.65rem', letterSpacing: '.28em', color: 'rgba(201,169,110,.38)' }}
          >
            {num}
          </span>
          <span
            className="font-heading font-black uppercase leading-none transition-colors duration-300"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 4.5rem)', letterSpacing: '-.05em' }}
          >
            {label}
          </span>
        </div>
        <ArrowUpRight
          size={22}
          className="shrink-0 transition-all duration-400"
          style={{ color: 'var(--accent)', transform: open ? 'rotate(135deg)' : 'none' }}
        />
      </button>
      <div ref={descRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <p
          className="pb-8 pl-[calc(.65rem+1.25rem+2rem)] md:pl-[calc(.65rem+1.25rem+3rem)] max-w-2xl text-base leading-[1.9]"
          style={{ color: 'rgba(240,235,227,.48)' }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const heroRef  = useRef(null);
  const titleRef = useRef(null);
  const factsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = titleRef.current;
      if (title) {
        gsap.set(title, { clipPath: 'inset(0 100% 0 0)' });
        gsap.to(title, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power4.out',
          delay: 0.3,
          scrollTrigger: { trigger: title, start: 'top 85%' },
        });
      }

      const facts = factsRef.current?.querySelectorAll('.fact-item');
      if (facts) {
        gsap.fromTo(facts,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: factsRef.current, start: 'top 80%' },
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Over ons – Vos Web Designs</title>
        <meta name="description" content="Eén specialist, volledige focus en geen template-smaak. Maak kennis met Vos Web Designs." />
      </Helmet>

      <main className="overflow-hidden" style={{ background: '#03030a' }}>

        {/* ── Cinematic Hero ── */}
        <section ref={heroRef} className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden px-5 pt-32 pb-16 md:px-10 lg:px-16">
          {/* Grid bg */}
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
          {/* Glow */}
          <div
            className="pointer-events-none absolute top-0 left-0 h-[60vh] w-[55vw]"
            style={{ background: 'radial-gradient(ellipse at 10% 5%, rgba(201,169,110,.08), transparent 60%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-[1400px] mx-auto w-full">
            <p
              className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-8"
              style={{ color: 'rgba(201,169,110,.38)' }}
            >
              — Over Vos Web Designs
            </p>

            {/* Oversized headline with clip-path reveal */}
            <div
              ref={titleRef}
              style={{ clipPath: 'inset(0 0% 0 0)' }}
            >
              <h1
                className="font-heading font-black uppercase leading-[.88]"
                style={{
                  fontSize: 'clamp(3.5rem, 11vw, 13rem)',
                  letterSpacing: '-.07em',
                  color: 'var(--accent3)',
                }}
              >
                OVER<br />
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
                  ons
                </em>
                .
              </h1>
            </div>

            <p
              className="mt-8 max-w-xl text-base leading-[1.9]"
              style={{ color: 'rgba(240,235,227,.45)' }}
            >
              Eén specialist. Volledige focus. Wij bouwen premium digitale ervaringen zonder tussenpersonen, zonder compromissen, zonder templates.
            </p>
          </div>
        </section>

        {/* ── Oversized Facts ── */}
        <section className="relative py-20 md:py-32 px-5 md:px-10 lg:px-16 overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.14), transparent)' }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.14), transparent)' }}
            aria-hidden="true"
          />

          <div
            ref={factsRef}
            className="max-w-[1400px] mx-auto grid grid-cols-3 gap-0"
            style={{ borderLeft: '1px solid rgba(201,169,110,.07)' }}
          >
            {FACTS.map(({ value, label }) => (
              <div
                key={label}
                className="fact-item flex flex-col items-center gap-2 py-10 md:py-16"
                style={{ borderRight: '1px solid rgba(201,169,110,.07)' }}
              >
                <p
                  className="font-heading font-black leading-none stat-giant text-center"
                  style={{ color: 'var(--accent3)' }}
                >
                  {value}
                </p>
                <p
                  className="font-mono text-[.55rem] uppercase tracking-[.3em] text-center"
                  style={{ color: 'rgba(201,169,110,.38)' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Story ── */}
        <section className="relative py-24 md:py-36 px-5 md:px-10 lg:px-16">
          <div className="max-w-[1400px] mx-auto grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <p
                className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-8"
                style={{ color: 'rgba(201,169,110,.38)' }}
              >
                — Studio verhaal
              </p>
              <h2
                className="font-heading font-black uppercase leading-[.9]"
                style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', letterSpacing: '-.055em', color: 'var(--accent3)' }}
              >
                GEBOUWD MET
                <br />
                <em
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    fontSize: '1.05em',
                    letterSpacing: '-.02em',
                  }}
                >
                  aandacht
                </em>
              </h2>
              <p
                className="mt-8 text-base leading-[1.95]"
                style={{ color: 'rgba(240,235,227,.48)' }}
              >
                Mijn naam is Melvin Vos. Met Vos Web Designs help ik ondernemers aan snelle, professionele websites die vertrouwen wekken en niet voelen als een standaard template. Elke website krijgt een eigen concept, eigen uitstraling en een duidelijke opbouw.
              </p>
              <p
                className="mt-5 text-base leading-[1.95]"
                style={{ color: 'rgba(240,235,227,.38)' }}
              >
                Geen generieke blokken achter elkaar, maar een website die past bij het bedrijf — en die groeit met de ambities. Strategie, design en techniek in één hand.
              </p>
              <ul className="mt-9 grid gap-3">
                {[
                  'Persoonlijk traject, geen standaard pakket',
                  'Volledige eigendom na oplevering',
                  'Doorontwikkelbaar naarmate je groeit',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(240,235,227,.55)' }}>
                    <CheckCircle
                      size={14}
                      className="mt-0.5 shrink-0"
                      style={{ color: 'var(--accent)' }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stat card */}
            <div
              className="panel cut p-8 md:p-10"
            >
              <p
                className="font-mono text-[.55rem] uppercase tracking-[.38em] mb-6"
                style={{ color: 'rgba(201,169,110,.38)' }}
              >
                01 / Specialist
              </p>
              <p
                className="font-heading font-black leading-none"
                style={{ fontSize: 'clamp(5rem, 12vw, 11rem)', letterSpacing: '-.07em', color: 'var(--accent)' }}
              >
                48+
              </p>
              <p
                className="font-mono text-[.6rem] uppercase tracking-[.28em] mt-3"
                style={{ color: 'rgba(201,169,110,.38)' }}
              >
                Tevreden klanten
              </p>
              <div className="mt-8 h-px" style={{ background: 'rgba(201,169,110,.1)' }} />
              <p
                className="mt-6 text-sm leading-[1.85]"
                style={{ color: 'rgba(240,235,227,.4)' }}
              >
                Elk project persoonlijk begeleid — van eerste schets tot live lancering. Geen projectmanagers, geen communicatieverlies.
              </p>
            </div>
          </div>
        </section>

        {/* ── Values accordion ── */}
        <section className="relative py-24 md:py-36 px-5 md:px-10 lg:px-16 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 0% 50%, rgba(138,92,246,.04), transparent)' }}
            aria-hidden="true"
          />
          <div className="max-w-[1400px] mx-auto">
            <p
              className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-12"
              style={{ color: 'rgba(201,169,110,.38)' }}
            >
              — Kernwaarden
            </p>
            <div style={{ borderTop: '1px solid rgba(201,169,110,.1)' }}>
              {VALUES.map((v) => <ValueItem key={v.num} {...v} />)}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative py-24 md:py-36 px-5 md:px-10 lg:px-16">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.18), transparent)' }}
            aria-hidden="true"
          />
          <div className="max-w-[1400px] mx-auto text-center">
            <div className="inline-flex items-center gap-2.5 mb-8">
              <span className="status-dot" />
              <span
                className="font-mono text-[.62rem] uppercase tracking-[.38em]"
                style={{ color: 'rgba(201,169,110,.45)' }}
              >
                Vrijblijvend kennismaken
              </span>
            </div>
            <h2
              className="font-heading font-black uppercase leading-[.9]"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', letterSpacing: '-.06em', color: 'var(--accent3)' }}
            >
              KENNISMAKEN?
            </h2>
            <p
              className="mx-auto mt-8 max-w-xl text-base leading-[1.85]"
              style={{ color: 'rgba(240,235,227,.42)' }}
            >
              Vertel waar je naartoe wilt groeien. Dan kijken we samen welke website daar het beste bij past.
            </p>
            <div className="mt-10">
              <MagneticButton to="/contact" className="glow-button">
                Contact opnemen <ArrowRight size={16} />
              </MagneticButton>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default AboutPage;
