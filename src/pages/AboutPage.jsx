import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Lightbulb, Target, Users } from 'lucide-react';

const values = [
  { icon: <Heart size={28} />, title: 'Passie voor Kwaliteit', description: 'Elk project behandelen we met maximale aandacht voor detail. Geen snelle oplossingen, maar duurzaam vakwerk.' },
  { icon: <Target size={28} />, title: 'Resultaatgericht', description: 'Design en techniek zijn middelen. Het doel is groei, conversie en meetbaar resultaat.' },
  { icon: <Lightbulb size={28} />, title: 'Innovatie', description: 'We werken uitsluitend met moderne technologieën en blijven continu verbeteren.' },
  { icon: <Users size={28} />, title: 'Persoonlijk', description: 'Direct contact, korte lijnen en één aanspreekpunt. Geen ruis, geen tussenlagen.' },
];

const AboutPage = () => (
  <>
    <Helmet><title>Over Ons - Vos Web Designs</title><meta name="description" content="Leer Vos Web Designs kennen. Persoonlijk, resultaatgericht en gebouwd op moderne technologie." /></Helmet>
    <main className="cinema-bg pt-24">
      <section className="cinematic-section">
        <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[1fr_.65fr] lg:items-end">
          <div><p className="eyebrow">Over Vos Web Designs</p><h1 className="display-title mt-4 text-[clamp(3.6rem,10vw,8rem)]">Eén specialist. Volledige focus. Maximale kwaliteit.</h1></div>
          <aside className="panel cut p-6"><p className="text-lg leading-8 text-slate-300">Geen templates, geen ruis. Alleen oplossingen die werken — met strategie, design en techniek strak op elkaar afgestemd.</p></aside>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <aside className="panel cut p-6 lg:-rotate-2"><p className="eyebrow">Editorial note</p><p className="mt-4 font-heading text-3xl font-black leading-tight tracking-[-.05em]">Vos Web Designs is opgericht vanuit frustratie over trage, generieke websites zonder resultaat.</p></aside>
          <div className="panel cut overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-7 md:p-10"><h2 className="font-heading text-4xl font-black tracking-[-.05em]">Mijn verhaal</h2><p className="mt-6 leading-8 text-slate-300">Vos Web Designs is opgericht vanuit de frustratie over trage, generieke websites zonder resultaat.</p><p className="mt-4 leading-8 text-slate-300">Mijn focus ligt op maatwerk: snelle websites, sterke gebruikerservaring en code die klopt.</p><p className="mt-4 leading-8 text-slate-300">Geen templates, geen ruis. Alleen oplossingen die werken.</p></div>
              <img src="/werk.png" alt="Werkplek Vos Web Designs" className="h-full min-h-[320px] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10">
          <p className="eyebrow">Waarden</p><h2 className="display-title mt-4 text-5xl md:text-7xl">De principes achter elk project.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{values.map((value, index) => <article key={value.title} className={`panel cut p-6 ${index % 2 ? 'lg:translate-y-8' : ''}`}><div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-[color:var(--stroke)] text-[color:var(--accent)]">{value.icon}</div><h3 className="font-heading text-2xl font-black tracking-[-.04em]">{value.title}</h3><p className="mt-3 leading-7 text-slate-300">{value.description}</p></article>)}</div>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div className="panel cut p-7 md:p-10"><p className="eyebrow">Wie zit er achter</p><h2 className="mt-4 font-heading text-5xl font-black tracking-[-.06em]">Melvin Vos</h2><p className="mt-2 text-[color:var(--accent)]">Founder & Lead Developer</p><p className="mt-6 text-lg leading-8 text-slate-300">Met een sterke focus op performance, schaalbaarheid en design bouw ik premium websites en webapplicaties die bedrijven écht verder helpen.</p></div>
          <div className="panel cut overflow-hidden p-5"><img src="/logo.jpeg" alt="Melvin Vos" className="h-[420px] w-full rounded-[1.4rem] object-cover" /></div>
        </div>
      </section>

      <section className="cinematic-section pt-0"><div className="cinematic-container panel cut relative z-10 p-8 text-center md:p-12"><h2 className="display-title text-5xl md:text-7xl">Kennismaken?</h2><p className="mx-auto mt-5 max-w-2xl text-slate-300">Vertel waar je naartoe wilt groeien. Dan kijken we samen welke website daar het beste bij past.</p><Link to="/contact" className="cta-link mt-8">Plan een gesprek <ArrowRight size={18} /></Link></div></section>
    </main>
  </>
);

export default AboutPage;
