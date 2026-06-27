import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Layers, Smartphone, MessagesSquare, Rocket, CheckCircle } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  { icon: <Layers size={20} />,         title: 'Geen standaard template-flow', text: 'Elke site krijgt een eigen richting en visuele stijl — geen kant-en-klare blokken.' },
  { icon: <Smartphone size={20} />,     title: 'Snel en mobielvriendelijk',     text: 'Gebouwd voor bezoekers die snel willen begrijpen wat je doet, op elk apparaat.' },
  { icon: <MessagesSquare size={20} />, title: 'Persoonlijk contact',            text: 'Korte lijnen en duidelijke communicatie zonder tussenpersonen of ruis.' },
  { icon: <Rocket size={20} />,         title: 'Doorontwikkelbaar',              text: 'Techniek die later uitgebreid kan worden naarmate je bedrijf groeit.' },
];

const VALUES = [
  { num: '01', label: 'Transparantie', desc: 'Geen verborgen kosten, geen verrassingen. Alles wordt van tevoren afgestemd.' },
  { num: '02', label: 'Kwaliteit',     desc: 'Elk detail telt. Van typografie tot laadtijden — geen enkel compromis.' },
  { num: '03', label: 'Resultaat',     desc: 'Een mooie website is een middel, niet het doel. Jouw groei is het eindpunt.' },
];

const FACTS = [
  ['100%', 'Maatwerk'],
  ['0',    'Templates'],
  ['1',    'Specialist'],
];

const AboutPage = () => {
  const rootRef    = useRef(null);
  const valuesRef  = useRef(null);
  useReveal(rootRef);

  useEffect(() => {
    const el = valuesRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll('.value-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: { trigger: card, start: 'top 86%' },
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

      <main ref={rootRef} className="cinema-bg overflow-hidden pt-24">

        {/* ── Hero ── */}
        <section className="cinematic-section relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'linear-gradient(rgba(204,255,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,.05) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="cinematic-container relative z-10 grid gap-10 lg:grid-cols-[1fr_.55fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="status-dot" />
                <p data-reveal className="section-eyebrow">Over Vos Web Designs</p>
              </div>
              <h1 data-reveal className="display-xl mt-0 text-[clamp(2.4rem,8vw,7rem)]">
                Eén specialist.{' '}
                <span className="gradient-text-full">Volledige focus.</span>
              </h1>
            </div>
            <div data-reveal className="grid gap-4">
              {FACTS.map(([val, label]) => (
                <div
                  key={label}
                  className="glass-card rounded-2xl p-5 flex items-center gap-4"
                >
                  <span
                    className="font-heading text-3xl font-bold"
                    style={{ color: 'var(--accent)', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                  >
                    {val}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[.18em] text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Story ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            <article data-reveal className="glass-card cyber-corner rounded-3xl overflow-hidden">
              <div className="grid lg:grid-cols-[1fr_1px_1fr]">
                <div className="p-7 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="status-dot status-dot-cyan" />
                    <span className="hud-label">Studio verhaal</span>
                  </div>
                  <h2
                    className="font-heading font-bold leading-tight tracking-[-.04em] text-white"
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
                    }}
                  >
                    Websites gebouwd met aandacht, strategie en techniek.
                  </h2>
                  <p className="mt-6 text-base leading-8 text-slate-300">
                    Mijn naam is Melvin Vos. Met Vos Web Designs help ik ondernemers aan snelle, professionele websites die vertrouwen wekken en niet voelen als een standaard template.
                  </p>
                </div>
                <div className="bg-[var(--stroke)] hidden lg:block" aria-hidden="true" />
                <div
                  className="p-7 md:p-10"
                  style={{ borderTop: '1px solid var(--stroke)' }}
                >
                  <p className="text-base leading-8 text-slate-400">
                    Elke website krijgt een eigen concept, eigen uitstraling en een duidelijke opbouw. Geen generieke blokken achter elkaar, maar een website die past bij het bedrijf — en die groeit met de ambities.
                  </p>
                  <ul className="mt-7 grid gap-3">
                    {[
                      'Persoonlijk traject, geen standaard pakket',
                      'Volledige eigendom na oplevering',
                      'Doorontwikkelbaar naarmate je groeit',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                        <CheckCircle size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--accent2)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── Pillars ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <span className="status-dot" />
              <p className="section-eyebrow">Onze aanpak</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((pillar, i) => (
                <article
                  key={pillar.title}
                  data-reveal
                  data-reveal-delay={i * 0.08}
                  className="glass-card group rounded-2xl p-6 relative overflow-hidden transition-all duration-400 hover:-translate-y-1"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px scale-x-0 transition-transform duration-400 group-hover:scale-x-100"
                    style={{ background: 'var(--accent)' }}
                    aria-hidden="true"
                  />
                  <div className="capability-icon-wrap" style={{ color: 'var(--accent)' }}>
                    {pillar.icon}
                  </div>
                  <h3
                    className="mt-4 font-heading text-base font-bold text-white leading-tight"
                    style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{pillar.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="cinematic-section pt-0 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 0% 50%, rgba(255,63,0,.04), transparent)' }}
            aria-hidden="true"
          />
          <div className="cinematic-container relative z-10" ref={valuesRef}>
            <div className="flex items-center gap-3 mb-10">
              <span className="status-dot" />
              <p className="section-eyebrow">Kernwaarden</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {VALUES.map(({ num, label, desc }) => (
                <div key={num} className="value-card glass-card rounded-2xl p-7 relative overflow-hidden">
                  <span className="feature-num text-6xl sm:text-7xl absolute top-2 right-3 select-none">{num}</span>
                  <div className="relative">
                    <span className="font-mono text-[10px] uppercase tracking-[.26em]" style={{ color: 'var(--accent)' }}>
                      {num}
                    </span>
                    <h3
                      className="mt-3 font-heading text-2xl font-bold text-white"
                      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                    >
                      {label}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            <article
              data-reveal
              className="glass-card cyber-corner rounded-3xl p-8 text-center md:p-14 relative overflow-hidden"
              style={{ animation: 'glow-pulse 4s ease-in-out infinite' }}
            >
              <div className="pointer-events-none absolute inset-0 sci-fi-grid-fine opacity-20" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2.5 mb-6">
                  <span className="status-dot" />
                  <span className="hud-label">Vrijblijvend kennismaken</span>
                </div>
                <h2 className="display-xl text-[clamp(2.2rem,6vw,4.5rem)]">
                  Kennismaken?
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300">
                  Vertel waar je naartoe wilt groeien. Dan kijken we samen welke website daar het beste bij past.
                </p>
                <Link to="/contact" className="glow-button mt-8">
                  Contact opnemen <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          </div>
        </section>

      </main>
    </>
  );
};

export default AboutPage;
