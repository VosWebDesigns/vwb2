import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MailWarning } from 'lucide-react';

const ConfirmedPage = () => {
  const [params] = useSearchParams();
  const status = params.get('status');
  const isProblem = status === 'invalid' || status === 'error';

  return (
    <main className="min-h-[70vh] px-5 py-24 md:px-8">
      <Helmet><title>Nieuwsbrief bevestigd | Vos Web Designs</title></Helmet>
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[#07111f]/80 p-8 text-center shadow-2xl md:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
          {isProblem ? <MailWarning size={34} /> : <CheckCircle2 size={34} />}
        </div>
        <p className="eyebrow">Nieuwsbrief</p>
        <h1 className="mt-4 font-heading text-4xl font-black uppercase tracking-[-.05em] md:text-6xl">
          {isProblem ? 'Link verlopen' : 'Inschrijving bevestigd'}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
          {isProblem
            ? 'Deze bevestigingslink is ongeldig of al gebruikt. Schrijf u opnieuw in via de footer als u de nieuwsbrief wilt ontvangen.'
            : 'Bedankt voor uw bevestiging. U ontvangt voortaan maximaal 1x per maand tips, cases en updates van Vos Web Designs.'}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="rounded-full bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] px-6 py-3 font-black text-black">Terug naar home</Link>
          <Link to="/contact" className="rounded-full border border-white/10 px-6 py-3 font-bold text-white transition hover:border-[color:var(--accent)]">Contact opnemen</Link>
        </div>
      </section>
    </main>
  );
};

export default ConfirmedPage;
