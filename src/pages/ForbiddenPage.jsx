import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { gsap } from 'gsap';

const ForbiddenPage = () => {
  const { user, profile } = useAuth();
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-forbidden]',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out' }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="cinema-bg flex min-h-screen items-center justify-center overflow-hidden px-4 py-24 text-center">
      <Helmet>
        <title>Geen toegang - Vos Web Designs</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="glass-card cyber-corner relative z-10 max-w-lg rounded-3xl p-8 md:p-10">
        <div data-forbidden className="flex items-center justify-center gap-2.5 mb-6">
          <span className="status-dot" style={{ background: 'rgba(248,113,113,1)', boxShadow: '0 0 8px rgba(248,113,113,.6)' }} />
          <span className="hud-label text-red-400">Toegang geweigerd</span>
        </div>
        <div data-forbidden className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 text-red-300">
          <ShieldAlert size={32} />
        </div>
        <h1 data-forbidden className="mb-3 font-heading text-3xl font-black text-white">Geen toegang</h1>
        <p data-forbidden className="mb-6 leading-7 text-slate-300">
          U bent ingelogd, maar uw account heeft geen adminrechten. Alleen gebruikers met
          <span className="font-semibold text-white"> profiles.role = 'admin'</span> kunnen het beheerpaneel openen.
        </p>

        <dl data-forbidden className="mb-6 rounded-2xl border border-[color:var(--stroke)] bg-[rgba(10,10,20,.7)] p-4 text-left text-sm">
          <div className="mb-3">
            <dt className="font-semibold text-slate-300">Debug user.id</dt>
            <dd className="mono mt-1 break-all text-[var(--accent)]">{user?.id ?? 'Geen ingelogde gebruiker'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-300">Debug profile.role</dt>
            <dd className="mono mt-1 break-all text-[var(--accent)]">{profile?.role ?? 'Geen profiel/role gevonden'}</dd>
          </div>
        </dl>

        <div data-forbidden>
          <Link to="/" className="glow-button">Terug naar home</Link>
        </div>
      </section>
    </main>
  );
};

export default ForbiddenPage;
