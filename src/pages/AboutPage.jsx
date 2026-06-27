import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Smartphone, MessagesSquare, Rocket } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const PILLARS = [
  { icon: <Layers size={22} />, title: 'Geen standaard template-flow', text: 'Elke site krijgt een eigen richting en visuele stijl.' },
  { icon: <Smartphone size={22} />, title: 'Snel en mobielvriendelijk', text: 'Gebouwd voor bezoekers die snel willen begrijpen wat je doet.' },
  { icon: <MessagesSquare size={22} />, title: 'Persoonlijk contact', text: 'Korte lijnen en duidelijke communicatie zonder ruis.' },
  { icon: <Rocket size={22} />, title: 'Doorontwikkelbaar', text: 'Techniek die later uitgebreid kan worden.' },
];

const AboutPage = () => {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <>
      <Helmet>
        <title>Over ons – Vos Web Designs</title>
        <meta name="description" content="Eén specialist, volledige focus en geen template-smaak. Maak kennis met Vos Web Designs." />
      </Helmet>

      <main ref={rootRef} className="cinema-bg overflow-hidden pt-24">
        <section className="cinematic-section">
          <div className="cinematic-container relative z-10">
            <p data-reveal className="section-eyebrow">Over Vos Web Designs</p>
            <h1 data-reveal className="display-xl mt-5 text-[clamp(3.2rem,9vw,7.5rem)]">
              Eén specialist. <span className="gradient-text-full">Volledige focus.</span> Geen template-smaak.
            </h1>

            <article data-reveal className="glass-card mt-12 rounded-3xl p-7 md:p-10">
              <h2 className="font-heading text-[clamp(1.8rem,4vw,3.2rem)] font-black leading-tight tracking-[-.04em] text-white">
                Websites gebouwd met aandacht, strategie en techniek.
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Mijn naam is Melvin Vos. Met Vos Web Designs help ik ondernemers aan snelle, professionele websites die vertrouwen wekken en niet voelen als een standaard template.
              </p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-400">
                Elke website krijgt een eigen concept, eigen uitstraling en een duidelijke opbouw. Geen generieke blokken achter elkaar, maar een website die past bij het bedrijf.
              </p>
            </article>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((pillar, i) => (
                <article key={pillar.title} data-reveal data-reveal-delay={i * 0.08} className="glass-card rounded-2xl p-6">
                  <div className="capability-icon-wrap text-[var(--accent)]">{pillar.icon}</div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{pillar.text}</p>
                </article>
              ))}
            </div>

            <article data-reveal className="glass-card glass-card-lime mt-6 rounded-3xl p-8 text-center md:p-14">
              <h2 className="display-xl text-[clamp(2.2rem,6vw,4.5rem)]">
                Kennismaken?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300">
                Vertel waar je naartoe wilt groeien. Dan kijken we samen welke website daar het beste bij past.
              </p>
              <Link to="/contact" className="glow-button mt-8">
                Contact opnemen <ArrowRight size={16} />
              </Link>
            </article>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;
