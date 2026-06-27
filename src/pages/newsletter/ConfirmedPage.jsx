import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MailWarning } from 'lucide-react';

const ConfirmedPage = () => {
  const [params] = useSearchParams();
  const status = params.get('status');
  const isProblem = status === 'invalid' || status === 'error';

  return (
    <main className="cinema-bg flex min-h-screen items-center overflow-hidden px-5 py-24 md:px-8">
      <Helmet><title>Nieuwsbrief bevestigd | Vos Web Designs</title></Helmet>
      <section className="glass-card cyber-corner relative z-10 mx-auto max-w-3xl rounded-3xl p-8 text-center md:p-12">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <span className={`status-dot ${isProblem ? '' : ''}`} />
          <span className="hud-label">Nieuwsbrief systeem</span>
        </div>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(140,214,255,.3)] bg-[rgba(140,214,255,.1)] text-[var(--accent)]">
          {isProblem ? <MailWarning size={34} /> : <CheckCircle2 size={34} />}
        </div>
        <p className="section-eyebrow">Nieuwsbrief</p>
        <h1 className="mt-4 display-xl text-4xl md:text-6xl">
          {isProblem ? 'Link verlopen' : <span className="gradient-text-cyan">Inschrijving bevestigd</span>}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
          {isProblem
            ? 'Deze bevestigingslink is ongeldig of al gebruikt. Schrijf u opnieuw in via de footer als u de nieuwsbrief wilt ontvangen.'
            : 'Bedankt voor uw bevestiging. U ontvangt voortaan maximaal 1x per maand tips, cases en updates van Vos Web Designs.'}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="glow-button">Terug naar home</Link>
          <Link to="/contact" className="ghost-button">Contact opnemen</Link>
        </div>
      </section>
    </main>
  );
};

export default ConfirmedPage;
