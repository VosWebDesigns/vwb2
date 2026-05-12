import React from 'react';

const steps = [
  ['01', 'Survey', 'We meten doelen, doelgroepen, content-schuld en technische randvoorwaarden.'],
  ['02', 'Draft', 'We tekenen flows als lagen: narrative, interface, CMS en conversiepunten.'],
  ['03', 'Construct', 'React, Tailwind en Supabase worden modulair gebouwd, getest en gevuld.'],
  ['04', 'Handover', 'Lancering met performance-check, beheerinstructies en iteratieplan.'],
];

const ProcessSchematics = () => (
  <section className="blueprint-grid px-5 py-24 md:px-10 lg:pl-28" id="process">
    <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[.75fr_1.25fr]">
      <div className="lg:sticky lg:top-24 lg:h-[70svh]">
        <span className="blueprint-label relative left-0 top-0">process as schematics</span>
        <h2 className="mt-8 text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[.8] tracking-[-.07em]">Van meting naar machine.</h2>
      </div>
      <div className="relative space-y-8 lg:space-y-20">
        <div className="absolute left-7 top-0 hidden h-full border-l border-dashed border-[color:var(--accent)]/50 md:block" />
        {steps.map(([nr, title, text], index) => (
          <article key={nr} className={`schematic-step ${index % 2 ? 'md:ml-28' : ''}`}>
            <span className="measure-line" />
            <div className="mono text-[color:var(--accent)]">{nr}</div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSchematics;
