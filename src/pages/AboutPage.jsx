import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Layers, Smartphone, MessagesSquare, Rocket } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  { icon: <Layers size={22} />,         title: 'Geen standaard template-flow', text: 'Elke site krijgt een eigen richting en visuele stijl — geen kant-en-klare blokken.' },
  { icon: <Smartphone size={22} />,     title: 'Snel en mobielvriendelijk',     text: 'Gebouwd voor bezoekers die snel willen begrijpen wat je doet, op elk apparaat.' },
  { icon: <MessagesSquare size={22} />, title: 'Persoonlijk contact',            text: 'Korte lijnen en duidelijke communicatie zonder tussenpersonen of ruis.' },
  { icon: <Rocket size={22} />,         title: 'Doorontwikkelbaar',              text: 'Techniek die later uitgebreid kan worden naarmate je bedrijf groeit.' },
];

const VALUES = [
  { num: '01', label: 'Transparantie', desc: 'Geen verborgen kosten, geen verrassingen. Alles wordt van tevoren afgestemd.' },
  { num: '02', label: 'Kwaliteit',     desc: 'Elk detail telt. Van typografie tot laadtijden — geen enkel compromis.' },
  { num: '03', label: 'Resultaat',     desc: 'Een mooie website is een middel, niet het doel. Jouw groei is het eindpunt.' },
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
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'linear-gradient(rgba(140,214,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(140,214,255,.06) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="cinematic-container relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="status-dot" />
              <p data-reveal className="section-eyebrow">Over Vos Web Designs</p>
            </div>
            <h1 data-reveal className="display-xl mt-0 text-[clamp(2.4rem,9vw,7.5rem)]">
              Eén specialist.{' '}
              <span className="gradient-text-full">Volledige focus.</span>{' '}
              Geen template-smaak.
            </h1>
          </div>
        </section>

        {/* ── Story ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            <article data-reveal className="glass-card cyber-corner rounded-3xl p-7 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <span className="status-dot status-dot-cyan" />
                <span className="hud-label">Studio verhaal</span>
              </div>
              <h2 className="font-heading text-[clamp(1.8rem,4vw,3.2rem)] font-black leading-tight tracking-[-.04em] text-white">
                Websites gebouwd met aandacht, strategie en techniek.
              </h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <p className="text-base leading-8 text-slate-300">
                  Mijn naam is Melvin Vos. Met Vos Web Designs help ik ondernemers aan snelle, professionele websites die vertrouwen wekken en niet voelen als een standaard template.
                </p>
                <p className="text-base leading-8 text-slate-400">
                  Elke website krijgt een eigen concept, eigen uitstraling en een duidelijke opbouw. Geen generieke blokken achter elkaar, maar een website die past bij het bedrijf — en die groeit met de ambities.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* ── Pillars ── */}
        <section className="cinematic-section pt-0">
          <div className="cinematic-container relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="status-dot" />
              <p className="section-eyebrow">Onze aanpak</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((pillar, i) => (
                <article
                  key={pillar.title}
                  data-reveal
                  data-reveal-delay={i * 0.08}
                  className="glass-card group rounded-2xl p-6 relative overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(140,214,255,.1)]"
                >
                  {/* Hover top line */}
                  <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-[var(--accent)] transition-transform duration-400 group-hover:scale-x-100" aria-hidden="true" />
                  <div className="capability-icon-wrap text-[var(--accent)]">{pillar.icon}</div>
                  <h3 className="mt-4 font-heading text-base font-bold text-white leading-tight">{pillar.title}</h3>
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
            style={{ background: 'radial-gradient(ellipse 60% 70% at 0% 50%, rgba(214,245,122,.04), transparent)' }}
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
                    <span className="font-mono text-[10px] uppercase tracking-[.28em] text-[var(--accent)]">{num}</span>
                    <h3 className="mt-3 font-heading text-2xl font-black text-white">{label}</h3>
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
              className="glass-card glass-card-lime cyber-corner rounded-3xl p-8 text-center md:p-14 relative overflow-hidden"
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
