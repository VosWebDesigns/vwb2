import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useReveal } from '@/hooks/useReveal';

const SECTIONS = [
  ['Artikel 1. Definities', 'In deze algemene voorwaarden wordt verstaan onder: Vos Web Designs: de gebruiker van deze algemene voorwaarden. Opdrachtgever: de wederpartij van Vos Web Designs.'],
  ['Artikel 2. Toepasselijkheid', 'Deze voorwaarden zijn van toepassing op alle aanbiedingen en overeenkomsten tussen Vos Web Designs en Opdrachtgever, tenzij schriftelijk anders is overeengekomen.'],
  ['Artikel 3. Offertes', 'Alle offertes en aanbiedingen van Vos Web Designs zijn vrijblijvend, tenzij in de offerte een termijn voor aanvaarding is gesteld. Een offerte vervalt indien het product waarop de offerte betrekking heeft in de tussentijd niet meer beschikbaar is.'],
  ['Artikel 4. Uitvoering van de overeenkomst', 'Vos Web Designs zal de overeenkomst naar beste inzicht en vermogen en overeenkomstig de eisen van goed vakmanschap uitvoeren. Indien en voor zover een goede uitvoering van de overeenkomst dit vereist, heeft Vos Web Designs het recht bepaalde werkzaamheden te laten verrichten door derden.'],
  ['Artikel 5. Betaling', 'Betaling dient te geschieden binnen 14 dagen na factuurdatum, op een door Vos Web Designs aan te geven wijze in de valuta waarin is gefactureerd.'],
  ['Artikel 6. Aansprakelijkheid', 'Vos Web Designs is niet aansprakelijk voor schade, van welke aard ook, ontstaan doordat Vos Web Designs is uitgegaan van door of namens de Opdrachtgever verstrekte onjuiste en/of onvolledige gegevens.'],
  ['Artikel 7. Intellectueel eigendom', 'Vos Web Designs behoudt zich de rechten en bevoegdheden voor die hem toekomen op grond van de Auteurswet en andere intellectuele wet- en regelgeving.'],
];

const TermsPage = () => {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <>
      <Helmet>
        <title>Algemene Voorwaarden - Vos Web Designs</title>
        <meta name="description" content="Algemene Voorwaarden van Vos Web Designs. Lees hier onze leveringsvoorwaarden en condities." />
      </Helmet>

      <main ref={rootRef} className="cinema-bg min-h-screen overflow-hidden pt-24">
        <section className="cinematic-section">
          <div className="cinematic-container relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="status-dot" />
              <p data-reveal className="section-eyebrow">Juridisch</p>
            </div>
            <h1 data-reveal className="display-xl mt-0 text-[clamp(2.4rem,7vw,5.5rem)]">
              <span className="gradient-text-cyan">Algemene Voorwaarden</span>
            </h1>

            <div className="mt-10 grid gap-4">
              {SECTIONS.map(([title, body]) => (
                <section key={title} data-reveal className="glass-card rounded-2xl p-6 md:p-8">
                  <h2 className="font-heading text-xl font-bold text-white md:text-2xl">{title}</h2>
                  <p className="mt-3 leading-8 text-slate-300">{body}</p>
                </section>
              ))}
              <p data-reveal className="mono mt-2 text-xs uppercase tracking-[.2em] text-slate-500">
                Laatst bijgewerkt: 4 januari 2026
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default TermsPage;
