import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ForbiddenPage = () => {
  const { user, profile } = useAuth();

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-24 text-center">
      <Helmet>
        <title>Geen toegang - Vos Web Designs</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="max-w-lg rounded-2xl border border-gray-800 bg-[#111827] p-8 shadow-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-300">
          <ShieldAlert size={32} />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white">Geen toegang</h1>
        <p className="mb-6 text-gray-300">
          U bent ingelogd, maar uw account heeft geen adminrechten. Alleen gebruikers met
          <span className="font-semibold text-white"> profiles.role = 'admin'</span> kunnen het beheerpaneel openen.
        </p>

        <dl className="mb-6 rounded-xl border border-gray-700 bg-black/20 p-4 text-left text-sm">
          <div className="mb-3">
            <dt className="font-semibold text-gray-300">Debug user.id</dt>
            <dd className="mt-1 break-all font-mono text-[#38bdf8]">{user?.id ?? 'Geen ingelogde gebruiker'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-300">Debug profile.role</dt>
            <dd className="mt-1 break-all font-mono text-[#38bdf8]">{profile?.role ?? 'Geen profiel/role gevonden'}</dd>
          </div>
        </dl>

        <Link to="/">
          <Button className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] text-black hover:opacity-90">
            Terug naar home
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default ForbiddenPage;
