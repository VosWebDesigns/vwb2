import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const MfaVerifyPage = () => {
  const { session, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const requestCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/request-mfa', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token || ''}` },
      });
      if (!response.ok) throw new Error(await response.text());
      toast({ title: 'Code verstuurd', description: 'Controleer uw mailbox voor een nieuwe code.' });
    } catch (error) {
      console.error('ADMIN_MFA_RESEND_ERROR', error);
      toast({ variant: 'destructive', title: 'Code versturen mislukt', description: 'Probeer opnieuw of neem contact op.' });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token || ''}` },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error(await response.text());
      toast({ title: 'Verificatie gelukt', description: 'Welkom terug in Vos Admin.' });
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('ADMIN_MFA_VERIFY_CLIENT_ERROR', error);
      toast({ variant: 'destructive', title: 'Verificatie mislukt', description: 'Controleer de 6-cijferige code.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen cinema-bg flex items-center justify-center px-4 text-white">
      <Helmet><title>Admin verificatie - Vos Web Designs</title></Helmet>
      <section className="panel cut w-full max-w-md p-8 text-center">
        <ShieldCheck className="mx-auto mb-5 text-[color:var(--accent2)]" size={42} />
        <p className="eyebrow">Admin beveiliging</p>
        <h1 className="mt-3 font-heading text-4xl font-black tracking-[-.06em]">Verifieer uw login</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">Vul de 6-cijferige code in die naar uw admin e-mailadres is gestuurd.</p>
        <form onSubmit={verifyCode} className="mt-7 grid gap-4">
          <input
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength="6"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full rounded-2xl border border-[color:var(--stroke)] bg-black px-5 py-4 text-center text-2xl tracking-[.4em] text-white outline-none focus:border-[color:var(--accent)]"
            placeholder="000000"
            required
          />
          <Button type="submit" disabled={loading || code.length !== 6} className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] font-bold text-black">Verifieer code</Button>
        </form>
        <div className="mt-5 flex flex-col gap-2 text-sm sm:flex-row sm:justify-center">
          <button type="button" onClick={requestCode} disabled={loading} className="text-[color:var(--accent)] hover:text-white disabled:opacity-60">Opnieuw sturen</button>
          <button type="button" onClick={signOut} className="text-slate-400 hover:text-white">Uitloggen</button>
        </div>
      </section>
    </main>
  );
};

export default MfaVerifyPage;
