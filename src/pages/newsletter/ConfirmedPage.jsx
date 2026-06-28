import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MailWarning } from 'lucide-react';
import { gsap } from 'gsap';

const ConfirmedPage = () => {
  const [params] = useSearchParams();
  const status = params.get('status');
  const isProblem = status === 'invalid' || status === 'error';
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-nl]',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="cinema-bg flex min-h-screen items-center overflow-hidden px-5 py-24 md:px-8">
      <Helmet><title>Nieuwsbrief bevestigd | Vos Web Designs</title></Helmet>
      <section className="glass-card cyber-corner relative z-10 mx-auto max-w-3xl rounded-3xl p-8 text-center md:p-12">
        <div data-nl className="flex items-center justify-center gap-2.5 mb-6">
          <span className="status-dot" />
          <span className="hud-label">Nieuwsbrief systeem</span>
        </div>
        <div data-nl className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(201,169,110,.3)] bg-[rgba(201,169,110,.08)] text-[var(--accent)]">
          {isProblem ? <MailWarning size={34} /> : <CheckCircle2 size={34} />}
        </div>
        <p data-nl className="section-eyebrow">Nieuwsbrief</p>
        <h1 data-nl className="mt-4 display-xl text-4xl md:text-6xl">
          {isProblem ? 'Link verlopen' : <span className="gradient-text-gold">Inschrijving bevestigd</span>}
        </h1>
        <p data-nl className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
          {isProblem
            ? 'Deze bevestigingslink is ongeldig of al gebruikt. Schrijf u opnieuw in via de footer als u de nieuwsbrief wilt ontvangen.'
            : 'Bedankt voor uw bevestiging. U ontvangt voortaan maximaal 1x per maand tips, cases en updates van Vos Web Designs.'}
        </p>
        <div data-nl className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="glow-button">Terug naar home</Link>
          <Link to="/contact" className="ghost-button">Contact opnemen</Link>
        </div>
      </section>
    </main>
  );
};

export default ConfirmedPage;
