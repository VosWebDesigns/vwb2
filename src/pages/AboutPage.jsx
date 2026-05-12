import React from 'react';
import { Helmet } from 'react-helmet';

const AboutPage = () => (
  <>
    <Helmet><title>Over ons — Vos Web Designs</title><meta name="description" content="Een digitaal atelier voor websites met technische precisie en editorial art direction." /></Helmet>
    <main className="px-5 pb-24 pt-28 md:px-10 lg:pl-28">
      <section className="mx-auto max-w-[1500px]">
        <div className="relative border border-[color:var(--grid)] p-6 md:p-12">
          <span className="blueprint-label">studio section</span>
          <h1 className="max-w-5xl text-[clamp(4rem,11vw,12rem)] font-black uppercase leading-[.76] tracking-[-.09em]">Wij ontwerpen alsof elke pixel dragend is.</h1>
          <div className="mt-12 grid gap-8 md:grid-cols-[1fr_1.2fr_.8fr]">
            <p className="text-xl leading-9 text-slate-300">Vos Web Designs werkt als een compact atelier: strategie, interface, development en beheer dicht op elkaar.</p>
            <div className="blueprint-grid min-h-72 border border-[color:var(--grid)] p-6"><p className="mono text-xs uppercase tracking-[.3em] text-[color:var(--accent)]">principle</p><p className="mt-20 text-3xl font-black uppercase tracking-[-.04em]">Geen decoratie zonder functie. Geen CMS zonder redactieplan.</p></div>
            <p className="self-end border-l border-[color:var(--accent)] pl-6 text-slate-300">Het resultaat: websites die voelen als maatwerk-publicaties en tegelijk eenvoudig te beheren blijven.</p>
          </div>
        </div>
      </section>
    </main>
  </>
);
export default AboutPage;
