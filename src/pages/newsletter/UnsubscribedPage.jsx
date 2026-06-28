import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { MailMinus } from 'lucide-react';
import { gsap } from 'gsap';

const UnsubscribedPage = () => {
  const [params] = useSearchParams();
  const invalid = params.get('status') === 'invalid';
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
      <Helmet><title>Nieuwsbrief afgemeld | Vos Web Designs</title></Helmet>
      <section className="glass-card cyber-corner relative z-10 mx-auto max-w-3xl rounded-3xl p-8 text-center md:p-12">
        <div data-nl className="flex items-center justify-center gap-2.5 mb-6">
          <span className="status-dot" />
          <span className="hud-label">Nieuwsbrief systeem</span>
        </div>
        <div data-nl className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(201,169,110,.3)] bg-[rgba(201,169,110,.08)] text-[var(--accent)]">
          <MailMinus size={34} />
        </div>
        <p data-nl className="section-eyebrow">Nieuwsbrief</p>
        <h1 data-nl className="mt-4 display-xl text-4xl md:text-6xl">
          {invalid ? 'Afmeldlink ongeldig' : <span className="gradient-text-gold">U bent afgemeld</span>}
        </h1>
        <p data-nl className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
          {invalid
            ? 'We konden deze afmeldlink niet verifiëren. Neem gerust contact op als u hulp nodig heeft.'
            : 'Uw e-mailadres is uitgeschreven voor de nieuwsbrief. Bedankt voor uw interesse in Vos Web Designs.'}
        </p>
        <div data-nl className="mt-8">
          <Link to="/" className="glow-button">Terug naar home</Link>
        </div>
      </section>
    </main>
  );
};

export default UnsubscribedPage;
