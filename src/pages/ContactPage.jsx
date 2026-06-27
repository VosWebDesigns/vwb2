import React, { useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { trackAnalyticsEvent } from '@/components/CookieBanner';
import { useReveal } from '@/hooks/useReveal';

const initial = {
  name: '', email: '', phone: '', company: '', service: '', package: '', message: '',
  website: '', company_website: '',
};

const getWhatsappUrl = (phone = '') => {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits.startsWith('00') ? digits.slice(2) : digits}`;
};

const ContactPage = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState(initial);
  const [status,   setStatus]   = useState('idle');
  const rootRef = useRef(null);
  useReveal(rootRef);

  const completion = useMemo(() => {
    const fields = ['name', 'email', 'service', 'message'];
    return Math.round((fields.filter((f) => formData[f]?.trim()).length / fields.length) * 100);
  }, [formData]);

  const handleChange = (event) =>
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
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

  const inputClass =
    'w-full rounded-xl border border-[rgba(140,214,255,.16)] bg-[rgba(8,16,30,.7)] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(140,214,255,.15)]';

  const labelClass = 'grid gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[var(--accent)]';

  const contactEmail = settings?.contact_email?.trim();
  const contactPhone = settings?.contact_phone?.trim();
  const whatsappUrl  = contactPhone ? getWhatsappUrl(contactPhone) : '';

  return (
    <>
      <Helmet>
        <title>Contact - Vos Web Designs | Neem Contact Op</title>
        <meta name="description" content="Klaar om uw project te starten? Neem contact op met Vos Web Designs voor een vrijblijvend gesprek." />
      </Helmet>

      <main ref={rootRef} className="cinema-bg min-h-screen overflow-hidden pt-24">
        <section className="cinematic-section relative overflow-hidden">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 30% 30%, rgba(14,165,233,.08), transparent)' }}
            aria-hidden="true"
          />

          <div className="cinematic-container relative z-10 grid gap-10 lg:grid-cols-[.85fr_1.15fr]">

            {/* ── Sidebar ── */}
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="flex items-center gap-3 mb-6">
                <span className="status-dot" />
                <p data-reveal className="section-eyebrow">Contact</p>
              </div>
              <h1 data-reveal className="display-xl mt-0 text-[clamp(3.2rem,8vw,7rem)]">
                Start uw{' '}
                <span className="gradient-text-full">project</span>.
              </h1>
              <p data-reveal className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                Vertel wat u wilt bereiken. We denken mee over structuur, design, techniek en de slimste volgende stap.
              </p>

              {/* Contact info */}
              <div data-reveal className="glass-card cyber-corner mt-8 rounded-2xl p-6 grid gap-3">
                <span className="hud-label block mb-2">Directe contactgegevens</span>
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="terminal-line flex items-center gap-3 text-slate-300 hover:text-[var(--accent)] transition"
                  >
                    <Mail size={14} className="shrink-0 text-[var(--accent)]" />
                    {contactEmail}
                  </a>
                )}
                {contactPhone && (
                  <a
                    href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
                    className="terminal-line flex items-center gap-3 text-slate-300 hover:text-[var(--accent)] transition"
                  >
                    <Phone size={14} className="shrink-0 text-[var(--accent)]" />
                    {contactPhone}
                  </a>
                )}
                {!contactEmail && !contactPhone && (
                  <p className="text-sm text-slate-500">Contactgegevens worden binnenkort aangevuld.</p>
                )}
              </div>

              {/* WhatsApp CTA */}
              {whatsappUrl && (
                <div data-reveal className="mt-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full border border-[var(--accent2)]/35 px-5 py-2.5 text-sm font-bold text-[var(--accent2)] transition hover:border-[var(--accent2)] hover:bg-[var(--accent2)] hover:text-black"
                  >
                    <MessageCircle size={15} />
                    WhatsApp ons direct
                  </a>
                </div>
              )}

              {/* Status readout */}
              <div data-reveal className="mt-6 flex flex-col gap-1.5">
                <span className="hud-label">Response tijd</span>
                <div className="flex items-center gap-2">
                  <span className="status-dot status-dot-cyan" />
                  <span className="font-mono text-[11px] text-[rgba(214,245,122,.65)]">Reactie binnen 24 uur</span>
                </div>
              </div>
            </aside>

            {/* ── Form ── */}
            <form
              data-reveal
              onSubmit={handleSubmit}
              className="glass-card grid gap-5 rounded-3xl p-6 md:p-8 relative overflow-hidden"
            >
              {/* Subtle top glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" aria-hidden="true" />

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="hidden"
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Progress bar */}
              <div>
                <div className="mb-2 flex justify-between">
                  <span className="hud-label">Formulier voortgang</span>
                  <span className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--accent2)]">{completion}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent2)] transition-all duration-500"
                    style={{ width: `${completion}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Name + Email */}
              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  Naam *
                  <input required name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Jan de Vries" />
                </label>
                <label className={labelClass}>
                  Email *
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="jan@bedrijf.nl" />
                </label>
              </div>

              {/* Phone + Company */}
              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  Telefoon
                  <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+31 6 12345678" />
                </label>
                <label className={labelClass}>
                  Bedrijf
                  <input name="company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="Bedrijfsnaam" />
                </label>
              </div>

              {/* Service + Budget */}
              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  Interesse *
                  <select required name="service" value={formData.service} onChange={handleChange} className={inputClass}>
                    <option value="">Kies dienst…</option>
                    <option>Website redesign</option>
                    <option>React/Supabase build</option>
                    <option>E-commerce</option>
                    <option>SEO/content systeem</option>
                  </select>
                </label>
                <label className={labelClass}>
                  Budget
                  <select name="package" value={formData.package} onChange={handleChange} className={inputClass}>
                    <option value="">Nog open</option>
                    <option>Starter</option>
                    <option>Groei</option>
                    <option>Pro</option>
                  </select>
                </label>
              </div>

              {/* Message */}
              <label className={labelClass}>
                Projectnotities *
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={7}
                  className={`${inputClass} resize-none`}
                  placeholder="Wat moet uw nieuwe website bereiken? Huidige situatie, doelen, deadline…"
                />
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className="glow-button w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Verzenden…' : status === 'sent' ? 'Verzonden ✓' : 'Verstuur bericht'}
                {status !== 'sent' && <Send size={16} />}
              </button>

              {status === 'sent' && (
                <p className="text-center font-mono text-xs uppercase tracking-[.18em] text-[var(--accent2)]">
                  Bedankt — we reageren binnen 24 uur.
                </p>
              )}
            </form>

          </div>
        </section>
      </main>
    </>
  );
};

export default ContactPage;
