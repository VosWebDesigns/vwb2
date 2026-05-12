import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const services = [
  ['Interface architecture', 'Navigatie, story structure en responsive spreads die niet als template voelen.'],
  ['React + Supabase builds', 'Snelle Vite frontends met beheerbare content, auth en databasegedreven cases.'],
  ['Conversion instruments', 'Meetbare flows, formulieren, SEO metadata en contentmodules die actie uitlokken.'],
  ['Launch hardening', 'Performance, toegankelijkheid, redirects en overdracht zodat de site zelfstandig kan draaien.'],
];

const ServicesPage = () => (
  <>
    <Helmet><title>Diensten — Blueprint Atelier</title><meta name="description" content="Diensten voor strategy, design, React development en Supabase implementatie." /></Helmet>
    <main className="blueprint-grid px-5 pb-24 pt-28 md:px-10 lg:pl-28">
      <section className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="lg:sticky lg:top-24 lg:h-[70svh]"><span className="blueprint-label relative left-0 top-0">service plates</span><h1 className="mt-8 text-[clamp(4rem,10vw,11rem)] font-black uppercase leading-[.76] tracking-[-.09em]">Bouwlagen, geen pakketten.</h1></div>
          <div className="space-y-6 lg:pt-28">
            {services.map(([title, text], index) => <article key={title} className={`service-plate ${index % 2 ? 'md:translate-x-12' : ''}`}><span>0{index + 1}</span><h2>{title}</h2><p>{text}</p></article>)}
            <Link to="/contact" className="blueprint-button">Vraag een bouwplan aan</Link>
          </div>
        </div>
      </section>
    </main>
  </>
);
export default ServicesPage;
