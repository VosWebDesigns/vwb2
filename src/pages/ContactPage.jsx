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
      toast({ title: 'Intake verzonden', description: 'We reageren binnen 24 uur met een eerste bouwschets.' });
      setFormData(initial);
      setStatus('sent');
    } catch (error) {
      console.error('CONTACT_FORM_SUBMIT_ERROR', error);
      toast({ title: 'Verzenden mislukt', description: 'Probeer opnieuw of mail ons direct.', variant: 'destructive' });
      setStatus('idle');
    }
  };

  const inputClass = 'w-full border border-[color:var(--grid)] bg-[color:var(--bg)] px-4 py-4 text-white outline-none transition focus:border-[color:var(--accent)]';

  return (
    <>
      <Helmet><title>Contact — Intake Sheet</title><meta name="description" content="Start een website build met Vos Web Designs via de intake sheet." /></Helmet>
      <main className="px-5 pb-24 pt-28 md:px-10 lg:pl-28">
        <section className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <aside className="lg:sticky lg:top-24 lg:h-[70svh]"><span className="blueprint-label relative left-0 top-0">intake sheet</span><h1 className="mt-8 text-[clamp(4rem,10vw,11rem)] font-black uppercase leading-[.76] tracking-[-.09em]">Start a build.</h1><div className="mt-8 border-l border-[color:var(--accent)] pl-6 text-slate-300"><a href={`mailto:${settings?.contact_email || 'info@voswebdesigns.nl'}`}>{settings?.contact_email || 'info@voswebdesigns.nl'}</a>{settings?.contact_phone && <a className="mt-2 block" href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>}</div></aside>
          <form onSubmit={handleSubmit} className="contact-sheet">
            <div className="mb-8"><div className="mb-2 flex justify-between mono text-xs uppercase tracking-[.25em]"><span>sheet completion</span><span>{completion}%</span></div><div className="h-2 bg-slate-900"><div className="h-full bg-[color:var(--accent)] transition-all" style={{ width: `${completion}%` }} /></div></div>
            <input type="text" name="company_website" value={formData.company_website} onChange={handleChange} className="hidden" tabIndex="-1" autoComplete="off" />
            <div className="grid gap-5 md:grid-cols-2"><label>Naam *<input required name="name" value={formData.name} onChange={handleChange} className={inputClass} /></label><label>Email *<input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} /></label></div>
            <div className="grid gap-5 md:grid-cols-2"><label>Telefoon<input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></label><label>Bedrijf<input name="company" value={formData.company} onChange={handleChange} className={inputClass} /></label></div>
            <div className="grid gap-5 md:grid-cols-2"><label>Interesse *<select required name="service" value={formData.service} onChange={handleChange} className={inputClass}><option value="">Kies laag</option><option>Website redesign</option><option>React/Supabase build</option><option>E-commerce</option><option>SEO/content systeem</option></select></label><label>Budget band<select name="package" value={formData.package} onChange={handleChange} className={inputClass}><option value="">Nog open</option><option>Starter</option><option>Groei</option><option>Pro</option></select></label></div>
            <label>Projectnotities *<textarea required name="message" value={formData.message} onChange={handleChange} rows="7" className={`${inputClass} resize-none`} placeholder="Wat moet deze digitale constructie doen?" /></label>
            <button type="submit" disabled={status === 'sending'} className="blueprint-button w-full justify-center disabled:opacity-60">{status === 'sending' ? 'Verzenden…' : 'Verstuur intake'}<Send size={18} /></button>
          </form>
        </section>
      </main>
    </>
  );
};
export default ContactPage;
