import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { MailMinus } from 'lucide-react';

const UnsubscribedPage = () => {
  const [params] = useSearchParams();
  const invalid = params.get('status') === 'invalid';

  return (
    <main className="cinema-bg flex min-h-screen items-center overflow-hidden px-5 py-24 md:px-8">
      <Helmet><title>Nieuwsbrief afgemeld | Vos Web Designs</title></Helmet>
      <section className="glass-card relative z-10 mx-auto max-w-3xl rounded-3xl p-8 text-center md:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(140,214,255,.3)] bg-[rgba(140,214,255,.1)] text-[var(--accent)]">
          <MailMinus size={34} />
        </div>
        <p className="section-eyebrow">Nieuwsbrief</p>
        <h1 className="mt-4 display-xl text-4xl md:text-6xl">
          {invalid ? 'Afmeldlink ongeldig' : <span className="gradient-text-cyan">U bent afgemeld</span>}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
          {invalid
            ? 'We konden deze afmeldlink niet verifiëren. Neem gerust contact op als u hulp nodig heeft.'
            : 'Uw e-mailadres is uitgeschreven voor de nieuwsbrief. Bedankt voor uw interesse in Vos Web Designs.'}
        </p>
        <Link to="/" className="glow-button mt-8">Terug naar home</Link>
      </section>
    </main>
  );
};

export default UnsubscribedPage;
