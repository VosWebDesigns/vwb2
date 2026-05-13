import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { MailMinus } from 'lucide-react';

const UnsubscribedPage = () => {
  const [params] = useSearchParams();
  const invalid = params.get('status') === 'invalid';

  return (
    <main className="min-h-[70vh] px-5 py-24 md:px-8">
      <Helmet><title>Nieuwsbrief afgemeld | Vos Web Designs</title></Helmet>
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[#07111f]/80 p-8 text-center shadow-2xl md:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
          <MailMinus size={34} />
        </div>
        <p className="eyebrow">Nieuwsbrief</p>
        <h1 className="mt-4 font-heading text-4xl font-black uppercase tracking-[-.05em] md:text-6xl">
          {invalid ? 'Afmeldlink ongeldig' : 'U bent afgemeld'}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
          {invalid
            ? 'We konden deze afmeldlink niet verifiëren. Neem gerust contact op als u hulp nodig heeft.'
            : 'Uw e-mailadres is uitgeschreven voor de nieuwsbrief. Bedankt voor uw interesse in Vos Web Designs.'}
        </p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] px-6 py-3 font-black text-black">Terug naar home</Link>
      </section>
    </main>
  );
};

export default UnsubscribedPage;
