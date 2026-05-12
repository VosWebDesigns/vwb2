import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useSettings } from '@/contexts/SettingsContext';

const initial = { name: '', email: '', phone: '', company: '', service: '', package: '', message: '', company_website: '' };

const ContactPage = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState(initial);
  const [status, setStatus] = useState('idle');

  const completion = useMemo(() => {
    const fields = ['name', 'email', 'service', 'message'];
    return Math.round((fields.filter(field => formData[field]?.trim()).length / fields.length) * 100);
  }, [formData]);

  const handleChange = event => setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async event => {
    event.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: 'Bericht verzonden', description: 'We reageren binnen 24 uur met een eerste voorstel.' });
      setFormData(initial);
      setStatus('sent');
    } catch (error) {
      console.error('CONTACT_FORM_SUBMIT_ERROR', error);
      toast({ title: 'Verzenden mislukt', description: 'Probeer opnieuw of mail ons direct.', variant: 'destructive' });
      setStatus('idle');
    }
  };

  const inputClass = 'w-full rounded-2xl border border-[color:var(--stroke)] bg-white/[.04] px-4 py-4 text-white outline-none transition focus:border-[color:var(--accent)]';

  return (
    <>
      <Helmet><title>Contact - Vos Web Designs | Neem Contact Op</title><meta name="description" content="Klaar om uw project te starten? Neem contact op met Vos Web Designs voor een vrijblijvend gesprek." /></Helmet>
      <main className="cinema-bg min-h-screen pt-24">
        <section className="cinematic-section">
          <div className="cinematic-container relative z-10 grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <p className="eyebrow">Contact</p>
              <h1 className="display-title mt-4 text-[clamp(3.6rem,10vw,8rem)]">Start uw project.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Vertel wat u wilt bereiken. We denken mee over structuur, design, techniek en de slimste volgende stap.</p>
              <div className="panel cut mt-8 p-6 text-slate-300">
                <a className="block hover:text-[color:var(--accent)]" href={`mailto:${settings?.contact_email || 'info@voswebdesigns.nl'}`}>{settings?.contact_email || 'info@voswebdesigns.nl'}</a>
                {settings?.contact_phone && <a className="mt-2 block hover:text-[color:var(--accent)]" href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>}
              </div>
            </aside>

            <form onSubmit={handleSubmit} className="panel cut grid gap-5 p-6 md:p-8">
              <div>
                <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[.2em] text-slate-400"><span>Formulier voortgang</span><span>{completion}%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-[color:var(--accent2)] transition-all" style={{ width: `${completion}%` }} /></div>
              </div>
              <input type="text" name="company_website" value={formData.company_website} onChange={handleChange} className="hidden" tabIndex="-1" autoComplete="off" />
              <div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Naam *<input required name="name" value={formData.name} onChange={handleChange} className={inputClass} /></label><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Email *<input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} /></label></div>
              <div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Telefoon<input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></label><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Bedrijf<input name="company" value={formData.company} onChange={handleChange} className={inputClass} /></label></div>
              <div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Interesse *<select required name="service" value={formData.service} onChange={handleChange} className={inputClass}><option value="">Kies dienst</option><option>Website redesign</option><option>React/Supabase build</option><option>E-commerce</option><option>SEO/content systeem</option></select></label><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Budget<select name="package" value={formData.package} onChange={handleChange} className={inputClass}><option value="">Nog open</option><option>Starter</option><option>Groei</option><option>Pro</option></select></label></div>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Projectnotities *<textarea required name="message" value={formData.message} onChange={handleChange} rows="7" className={`${inputClass} resize-none`} placeholder="Wat moet uw nieuwe website bereiken?" /></label>
              <button type="submit" disabled={status === 'sending'} className="cta-link w-full disabled:opacity-60">{status === 'sending' ? 'Verzenden…' : 'Verstuur bericht'}<Send size={18} /></button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};
export default ContactPage;
