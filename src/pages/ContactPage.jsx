import React, { useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { trackAnalyticsEvent } from '@/components/CookieBanner';
import { useReveal } from '@/hooks/useReveal';

const initial = { name: '', email: '', phone: '', company: '', service: '', package: '', message: '', website: '', company_website: '' };

const ContactPage = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState(initial);
  const [status, setStatus] = useState('idle');
  const rootRef = useRef(null);
  useReveal(rootRef);

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
      trackAnalyticsEvent('submit_contact', { service: formData.service || 'unknown' });
      toast({ title: 'Bericht verzonden', description: 'We reageren binnen 24 uur met een eerste voorstel.' });
      setFormData(initial);
      setStatus('sent');
    } catch (error) {
      console.error('CONTACT_FORM_SUBMIT_ERROR', error);
      toast({ title: 'Verzenden mislukt', description: 'Probeer opnieuw of mail ons direct.', variant: 'destructive' });
      setStatus('idle');
    }
  };

  const inputClass = 'w-full rounded-2xl border border-[rgba(140,214,255,.16)] bg-[rgba(8,16,30,.6)] px-4 py-4 text-white outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[rgba(140,214,255,.18)]';

  return (
    <>
      <Helmet><title>Contact - Vos Web Designs | Neem Contact Op</title><meta name="description" content="Klaar om uw project te starten? Neem contact op met Vos Web Designs voor een vrijblijvend gesprek." /></Helmet>
      <main ref={rootRef} className="cinema-bg min-h-screen overflow-hidden pt-24">
        <section className="cinematic-section">
          <div className="cinematic-container relative z-10 grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <p data-reveal className="section-eyebrow">Contact</p>
              <h1 data-reveal className="display-xl mt-4 text-[clamp(3.4rem,9vw,7.5rem)]">Start uw <span className="gradient-text-full">project</span>.</h1>
              <p data-reveal className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Vertel wat u wilt bereiken. We denken mee over structuur, design, techniek en de slimste volgende stap.</p>
              <div data-reveal className="glass-card mt-8 rounded-2xl p-6 text-slate-300">
                <a className="block hover:text-[color:var(--accent)]" href={`mailto:${settings?.contact_email || 'info@voswebdesigns.nl'}`}>{settings?.contact_email || 'info@voswebdesigns.nl'}</a>
                {settings?.contact_phone && <a className="mt-2 block hover:text-[color:var(--accent)]" href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>}
              </div>
            </aside>

            <form data-reveal onSubmit={handleSubmit} className="glass-card grid gap-5 rounded-3xl p-6 md:p-8">
              <div>
                <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[.2em] text-slate-400"><span>Formulier voortgang</span><span>{completion}%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-[color:var(--accent2)] transition-all" style={{ width: `${completion}%` }} /></div>
              </div>
              <input type="text" name="website" value={formData.website} onChange={handleChange} className="hidden" tabIndex="-1" autoComplete="off" aria-hidden="true" />
              <div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Naam *<input required name="name" value={formData.name} onChange={handleChange} className={inputClass} /></label><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Email *<input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} /></label></div>
              <div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Telefoon<input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></label><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Bedrijf<input name="company" value={formData.company} onChange={handleChange} className={inputClass} /></label></div>
              <div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Interesse *<select required name="service" value={formData.service} onChange={handleChange} className={inputClass}><option value="">Kies dienst</option><option>Website redesign</option><option>React/Supabase build</option><option>E-commerce</option><option>SEO/content systeem</option></select></label><label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Budget<select name="package" value={formData.package} onChange={handleChange} className={inputClass}><option value="">Nog open</option><option>Starter</option><option>Groei</option><option>Pro</option></select></label></div>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[.14em] text-[color:var(--accent)]">Projectnotities *<textarea required name="message" value={formData.message} onChange={handleChange} rows="7" className={`${inputClass} resize-none`} placeholder="Wat moet uw nieuwe website bereiken?" /></label>
              <button type="submit" disabled={status === 'sending'} className="glow-button w-full justify-center disabled:opacity-60">{status === 'sending' ? 'Verzenden…' : 'Verstuur bericht'}<Send size={16} /></button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};
export default ContactPage;
