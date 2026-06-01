import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Heart, Lightbulb, Target, Users } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Passie voor kwaliteit',
    description: 'Geen snelle template-oplossing, maar websites waar aandacht, uitstraling en techniek kloppen.',
  },
  {
    icon: Target,
    title: 'Resultaatgericht',
    description: 'Een website moet vertrouwen wekken, aanvragen opleveren en jouw bedrijf sterker neerzetten.',
  },
  {
    icon: Lightbulb,
    title: 'Modern maatwerk',
    description: 'Ik bouw met moderne techniek, snelle laadtijden en layouts die niet voelen als standaard WordPress.',
  },
  {
    icon: Users,
    title: 'Persoonlijk contact',
    description: 'Korte lijnen, duidelijk advies en direct contact met degene die jouw website daadwerkelijk bouwt.',
  },
];

const promises = [
  'Geen standaard template-flow',
  'Mobielvriendelijk en snel',
  'Duidelijke communicatie',
  'Gebouwd om later uit te breiden',
];

const AboutPage = () => (
  <>
    <Helmet>
      <title>Over ons - Vos Web Designs</title>
      <meta
        name="description"
        content="Maak kennis met Vos Web Designs. Persoonlijk webdesign, moderne techniek en websites zonder template-uitstraling."
      />
    </Helmet>

    <main className="min-h-screen bg-[#050b14] pt-24 text-white">
      <section className="cinematic-section">
        <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div>
            <p className="eyebrow">Over Vos Web Designs</p>
            <h1 className="display-title mt-4 text-[clamp(3.5rem,10vw,8rem)]">
              Eén specialist. Volledige focus. Geen template-smaak.
            </h1>
          </div>

          <aside className="panel cut p-6 md:p-8">
            <p className="text-lg leading-8 text-slate-300">
              Vos Web Designs helpt ondernemers met websites die professioneel ogen, snel laden en vertrouwen wekken. Geen standaard blokken achter elkaar, maar een eigen uitstraling per bedrijf.
            </p>
            <Link to="/contact" className="cta-link mt-7">
              Kennismaken <ArrowRight size={18} />
            </Link>
          </aside>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-stretch">
          <aside className="panel cut flex flex-col justify-between p-7 md:p-10 lg:-rotate-2">
            <div>
              <p className="eyebrow">Waarom gestart</p>
              <p className="mt-5 font-heading text-3xl font-black leading-tight tracking-[-.05em] md:text-5xl">
                Uit frustratie over trage, generieke websites die niet verkopen.
              </p>
            </div>
            <div className="mt-10 h-1 w-24 rounded-full bg-[color:var(--accent)]" />
          </aside>

          <article className="panel cut overflow-hidden">
            <div className="grid min-h-[420px] md:grid-cols-2">
              <div className="p-7 md:p-10">
                <p className="eyebrow">Mijn verhaal</p>
                <h2 className="mt-4 font-heading text-4xl font-black tracking-[-.05em] md:text-5xl">
                  Ik bouw websites alsof het mijn eigen bedrijf is.
                </h2>
                <div className="mt-6 space-y-4 leading-8 text-slate-300">
                  <p>
                    Mijn naam is Melvin Vos. Met Vos Web Designs focus ik op websites die er niet alleen mooi uitzien, maar ook logisch werken voor bezoekers.
                  </p>
                  <p>
                    De meeste websites lijken op elkaar: standaard hero, standaard cards, standaard reviews en een simpele CTA. Dat wil ik juist doorbreken met een eigen concept, duidelijke structuur en sterke details.
                  </p>
                  <p>
                    Strategie, design en techniek komen samen in één proces. Daardoor blijft het persoonlijk, snel en overzichtelijk.
                  </p>
                </div>
              </div>

              <div className="relative min-h-[320px] overflow-hidden border-t border-[color:var(--stroke)] bg-[#07111f] md:border-l md:border-t-0">
                <img
                  src="/werk.png"
                  alt="Werkplek Vos Web Designs"
                  className="h-full min-h-[320px] w-full object-cover opacity-85"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
                  <p className="text-sm font-bold uppercase tracking-[.18em] text-[color:var(--accent2)]">Maatwerk</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Elke website krijgt een eigen richting, eigen uitstraling en eigen opbouw.</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10">
          <p className="eyebrow">Waarden</p>
          <h2 className="display-title mt-4 text-5xl md:text-7xl">De principes achter elk project.</h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className={`panel cut p-6 ${index % 2 ? 'lg:translate-y-8' : ''}`}>
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-[color:var(--stroke)] text-[color:var(--accent)]">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-heading text-2xl font-black tracking-[-.04em]">{value.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container relative z-10 grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div className="panel cut p-7 md:p-10">
            <p className="eyebrow">Wie zit erachter</p>
            <h2 className="mt-4 font-heading text-5xl font-black tracking-[-.06em] md:text-7xl">Melvin Vos</h2>
            <p className="mt-2 text-[color:var(--accent)]">Founder & webdeveloper</p>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Met een sterke focus op performance, schaalbaarheid en uniek design bouw ik websites en webapplicaties die bedrijven professioneel laten groeien.
            </p>
          </div>

          <div className="panel cut p-7 md:p-10">
            <p className="eyebrow">Wat je mag verwachten</p>
            <div className="mt-6 grid gap-4">
              {promises.map((promise) => (
                <div key={promise} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4 text-slate-200">
                  <CheckCircle2 size={20} className="shrink-0 text-[color:var(--accent2)]" />
                  <span className="font-semibold">{promise}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cinematic-section pt-0">
        <div className="cinematic-container panel cut relative z-10 p-8 text-center md:p-12">
          <h2 className="display-title text-5xl md:text-7xl">Kennismaken?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-slate-300">
            Vertel waar je naartoe wilt groeien. Dan kijken we samen welke website daar het beste bij past.
          </p>
          <Link to="/contact" className="cta-link mt-8">
            Plan een gesprek <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  </>
);

export default AboutPage;
