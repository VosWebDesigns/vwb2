import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useReveal } from '@/hooks/useReveal';

const SECTIONS = [
  ['1. Inleiding', 'Vos Web Designs respecteert de privacy van alle gebruikers van haar site en draagt er zorg voor dat de persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld. Wij gebruiken uw gegevens om de dienstverlening zo snel en gemakkelijk mogelijk te laten verlopen. Dit privacybeleid is van toepassing op alle diensten van Vos Web Designs.'],
  ['2. Gegevensverwerking', 'Wanneer u zich aanmeldt voor een van onze diensten of contact met ons opneemt, vragen we u om persoonsgegevens te verstrekken. Deze gegevens worden gebruikt om de dienst uit te kunnen voeren. De gegevens worden opgeslagen op eigen beveiligde servers van Vos Web Designs of die van een derde partij.', ['NAW-gegevens', 'Telefoonnummer', 'E-mailadres', 'Bedrijfsgegevens']],
  ['3. Doeleinden', 'Wij verzamelen of gebruiken geen informatie voor andere doeleinden dan de doeleinden die worden beschreven in dit privacybeleid tenzij we van tevoren uw toestemming hiervoor hebben verkregen.'],
  ['4. Bewaartermijn', 'Wij bewaren uw gegevens niet langer dan noodzakelijk is voor de doeleinden waarvoor ze zijn verzameld, tenzij een langere bewaartermijn wettelijk verplicht is.'],
  ['5. Uw Rechten', 'U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heeft u het recht om uw eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van uw persoonsgegevens door Vos Web Designs.'],
  ['6. Contact', 'Als u vragen heeft over dit privacybeleid, kunt u contact met ons opnemen via info@voswebdesigns.nl.'],
];

const PrivacyPolicyPage = () => {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <>
      <Helmet>
        <title>Privacybeleid - Vos Web Designs</title>
        <meta name="description" content="Privacybeleid van Vos Web Designs. Lees hoe wij omgaan met uw gegevens volgens de AVG/GDPR richtlijnen." />
      </Helmet>

      <main ref={rootRef} className="cinema-bg min-h-screen overflow-hidden pt-24">
        <section className="cinematic-section">
          <div className="cinematic-container relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="status-dot" />
              <p data-reveal className="section-eyebrow">Juridisch</p>
            </div>
            <h1 data-reveal className="display-xl mt-0 text-[clamp(2.8rem,8vw,6rem)]">
              <span className="gradient-text-gold">Privacybeleid</span>
            </h1>

            <div className="mt-10 grid gap-4">
              {SECTIONS.map(([title, body, list]) => (
                <section key={title} data-reveal className="glass-card rounded-2xl p-6 md:p-8">
                  <h2 className="font-heading text-xl font-bold text-white md:text-2xl">{title}</h2>
                  <p className="mt-3 leading-8 text-slate-300">{body}</p>
                  {list && (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {list.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-slate-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
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

export default PrivacyPolicyPage;
