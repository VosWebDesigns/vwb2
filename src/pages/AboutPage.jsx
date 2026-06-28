import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  { num: '01', title: 'Geen standaard template-flow', text: 'Elke site krijgt een eigen richting en visuele stijl — geen kant-en-klare blokken.' },
  { num: '02', title: 'Snel en mobielvriendelijk',    text: 'Gebouwd voor bezoekers die snel willen begrijpen wat je doet, op elk apparaat.' },
  { num: '03', title: 'Persoonlijk contact',           text: 'Korte lijnen en duidelijke communicatie zonder tussenpersonen of ruis.' },
  { num: '04', title: 'Doorontwikkelbaar',             text: 'Techniek die later uitgebreid kan worden naarmate je bedrijf groeit.' },
];

const FACTS = [
  { value: '100%', label: 'Maatwerk' },
  { value: '0',    label: 'Templates' },
  { value: '1',    label: 'Specialist' },
  { value: '5+',   label: 'Jaar ervaring' },
];

const AboutPage = () => {
  const heroRef    = useRef(null);
  const storyRef   = useRef(null);
  const pillarsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero animate */
      gsap.fromTo(heroRef.current.querySelectorAll('[data-reveal]'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );

      /* Story section */
      gsap.fromTo(storyRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 80%' } }
      );

      /* Pillar rows */
      const rows = pillarsRef.current?.querySelectorAll('.pillar-row');
      rows?.forEach((row, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%' },
            delay: i * 0.07,
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Over ons – Vos Web Designs</title>
        <meta name="description" content="Eén specialist, volledige focus en geen template-smaak. Maak kennis met Vos Web Designs." />
      </Helmet>

      <main className="cinema-bg overflow-hidden pt-24">

        {/* ── Section A: Identity ── */}
        <section ref={heroRef} className="relative py-24 md:py-32 px-5 md:px-10 lg:px-16 overflow-hidden">
          {/* Grid backdrop */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(200,168,106,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,106,.022) 1px, transparent 1px)',
              backgroundSize: '90px 90px',
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-0 top-0 h-[70vh] w-[55vw]"
            style={{ background: 'radial-gradient(ellipse at 10% 10%, rgba(200,168,106,.07), transparent 55%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-[1180px] mx-auto">
            {/* Status */}
            <div data-reveal className="flex items-center gap-3 mb-10">
              <span className="status-dot" />
              <p className="font-mono text-[.62rem] uppercase tracking-[.38em]" style={{ color: 'rgba(200,168,106,.40)' }}>
                Over Vos Web Designs
              </p>
            </div>

            {/* Editorial 2-line heading */}
            <h1 data-reveal style={{ margin: 0 }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(3rem, 10vw, 10rem)',
                  letterSpacing: '-.065em',
                  lineHeight: 0.87,
                  color: 'var(--accent3)',
                }}
              >
                ÉÉN SPECIALIST.
              </div>
              <div
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: 'clamp(3.2rem, 10.5vw, 10.5rem)',
                  letterSpacing: '-.03em',
                  lineHeight: 0.87,
                  color: 'var(--accent)',
                  paddingLeft: 'clamp(2rem, 8vw, 10rem)',
                }}
              >
                Volledige focus.
              </div>
            </h1>

            {/* Divider + facts data cells */}
            <div
              data-reveal
              className="mt-12 pt-8 grid grid-cols-2 md:grid-cols-4 gap-0"
              style={{ borderTop: '1px solid rgba(200,168,106,.08)' }}
            >
              {FACTS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="flex flex-col gap-1.5 py-6 pr-6"
                  style={{
                    borderRight: i < FACTS.length - 1 ? '1px solid rgba(200,168,106,.07)' : 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: 'clamp(2rem, 4.5vw, 4rem)',
                      letterSpacing: '-.06em',
                      lineHeight: 1,
                      color: 'var(--accent)',
                    }}
                  >
                    {value}
                  </span>
                  <span
                    className="font-mono text-[.58rem] uppercase tracking-[.22em]"
                    style={{ color: 'rgba(200,168,106,.30)' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section B: Story (editorial 2-column text) ── */}
        <section className="relative py-20 px-5 md:px-10 lg:px-16">
          <div className="max-w-[1180px] mx-auto">
            {/* Title row with horizontal rule */}
            <div className="flex items-center gap-6 mb-10">
              <p className="font-mono text-[.6rem] uppercase tracking-[.38em] shrink-0" style={{ color: 'rgba(200,168,106,.40)' }}>
                Studio verhaal
              </p>
              <div className="flex-1 h-px" style={{ background: 'rgba(200,168,106,.08)' }} />
            </div>

            {/* Newspaper 2-column body text */}
            <div ref={storyRef} className="lg:columns-2 gap-12">
              <h2
                className="font-heading font-bold mb-6 break-inside-avoid"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  letterSpacing: '-.04em',
                  lineHeight: 1.1,
                  color: 'var(--accent3)',
                  columnSpan: 'all',
                }}
              >
                Websites gebouwd met aandacht, strategie en techniek.
              </h2>
              <p className="text-base leading-8 mb-5" style={{ color: 'rgba(240,237,230,.50)' }}>
                Mijn naam is Melvin Vos. Met Vos Web Designs help ik ondernemers aan snelle,
                professionele websites die vertrouwen wekken en niet voelen als een standaard template.
              </p>
              <p className="text-base leading-8 mb-5" style={{ color: 'rgba(240,237,230,.44)' }}>
                Elke website krijgt een eigen concept, eigen uitstraling en een duidelijke opbouw.
                Geen generieke blokken achter elkaar, maar een website die past bij het bedrijf —
                en die groeit met de ambities.
              </p>
              <p className="text-base leading-8" style={{ color: 'rgba(240,237,230,.38)' }}>
                Persoonlijk traject, geen standaard pakket. Volledige eigendom na oplevering.
                Doorontwikkelbaar naarmate je groeit.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section C: Pillars as numbered rule list ── */}
        <section className="relative py-20 px-5 md:px-10 lg:px-16">
          <div className="max-w-[1180px] mx-auto">
            {/* Section label */}
            <div className="flex items-center gap-6 mb-8">
              <p className="font-mono text-[.6rem] uppercase tracking-[.38em] shrink-0" style={{ color: 'rgba(200,168,106,.40)' }}>
                Onze aanpak
              </p>
              <div className="flex-1 h-px" style={{ background: 'rgba(200,168,106,.08)' }} />
            </div>

            <div
              ref={pillarsRef}
              style={{ borderTop: '1px solid rgba(200,168,106,.06)' }}
            >
              {PILLARS.map(({ num, title, text }) => (
                <div
                  key={num}
                  className="pillar-row group flex items-baseline gap-6 md:gap-10 py-6 md:py-8 cursor-default"
                  style={{ borderBottom: '1px solid rgba(200,168,106,.06)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('.pillar-num').style.color = 'var(--accent)';
                    e.currentTarget.querySelector('.pillar-title').style.color = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector('.pillar-num').style.color = 'rgba(200,168,106,.28)';
                    e.currentTarget.querySelector('.pillar-title').style.color = 'var(--accent3)';
                  }}
                >
                  {/* Number */}
                  <span
                    className="pillar-num font-mono shrink-0"
                    style={{
                      fontSize: 'clamp(1.4rem, 3vw, 2.8rem)',
                      fontWeight: 700,
                      letterSpacing: '-.04em',
                      lineHeight: 1,
                      color: 'rgba(200,168,106,.28)',
                      transition: 'color .3s ease',
                    }}
                  >
                    {num}
                  </span>

                  {/* Divider rule */}
                  <div className="hidden md:block h-px flex-1 max-w-[3rem]" style={{ background: 'rgba(200,168,106,.12)', marginBottom: '0.15em' }} />

                  {/* Title + description */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-baseline md:gap-8">
                    <h3
                      className="pillar-title font-heading font-bold uppercase leading-none shrink-0"
                      style={{
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        fontSize: 'clamp(1rem, 2.2vw, 1.8rem)',
                        letterSpacing: '-.04em',
                        color: 'var(--accent3)',
                        transition: 'color .3s ease',
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      className="mt-2 md:mt-0 text-sm leading-[1.75]"
                      style={{ color: 'rgba(240,237,230,.40)' }}
                    >
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section D: CTA ── */}
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
                Vrijblijvend kennismaken
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(2.5rem, 7vw, 7rem)',
                letterSpacing: '-.06em',
                lineHeight: 0.9,
                color: 'var(--accent3)',
              }}
            >
              KENNISMAKEN?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8" style={{ color: 'rgba(240,237,230,.40)' }}>
              Vertel waar je naartoe wilt groeien. Dan kijken we samen welke website daar het beste bij past.
            </p>
            <Link to="/contact" className="glow-button mt-10">
              Contact opnemen <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>
    </>
  );
};

export default AboutPage;
