import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { trackAnalyticsEvent } from '@/components/CookieBanner';

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
    'w-full rounded-xl border border-[rgba(200,168,106,.12)] bg-[rgba(16,11,32,.7)] px-5 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(200,168,106,.12)]';

  const labelClass = 'grid gap-2.5 text-[10px] font-bold uppercase tracking-[.18em] text-[var(--accent)]';

  const contactEmail = settings?.contact_email?.trim();
  const contactPhone = settings?.contact_phone?.trim();
  const whatsappUrl  = contactPhone ? getWhatsappUrl(contactPhone) : '';

  return (
    <>
      <Helmet>
        <title>Contact - Vos Web Designs | Neem Contact Op</title>
        <meta name="description" content="Klaar om uw project te starten? Neem contact op met Vos Web Designs voor een vrijblijvend gesprek." />
      </Helmet>

      <main className="cinema-bg min-h-screen overflow-hidden pt-24">
        <section className="relative overflow-hidden">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 20% 30%, rgba(200,168,106,.06), transparent)' }}
            aria-hidden="true"
          />
          {/* Grid */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(200,168,106,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,106,.018) 1px, transparent 1px)',
              backgroundSize: '100px 100px',
              maskImage: 'radial-gradient(ellipse 70% 50% at 30% 30%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 30% 30%, black, transparent)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 grid gap-0 lg:grid-cols-[1fr_1.15fr] min-h-screen">

            {/* ── LEFT: sticky identity panel ── */}
            <aside
              className="flex flex-col justify-between px-5 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24 lg:sticky lg:top-0 lg:h-screen"
              style={{ borderRight: '1px solid rgba(200,168,106,.06)' }}
            >
              <div>
                {/* HUD label */}
                <div className="flex items-center gap-3 mb-10">
                  <span className="status-dot" />
                  <p className="font-mono text-[.6rem] uppercase tracking-[.38em]" style={{ color: 'rgba(200,168,106,.40)' }}>
                    Contact
                  </p>
                </div>

                {/* Large headline */}
                <h1
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(2.8rem, 7vw, 7rem)',
                    letterSpacing: '-.065em',
                    lineHeight: 0.88,
                    color: 'var(--accent3)',
                    margin: 0,
                  }}
                >
                  LATEN<br />WE<br />
                  <em
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontSize: '1.04em',
                      letterSpacing: '-.02em',
                    }}
                  >
                    praten
                  </em>
                  .
                </h1>

                <p className="mt-8 text-base leading-8 max-w-sm" style={{ color: 'rgba(240,237,230,.42)' }}>
                  Vertel wat u wilt bereiken. We denken mee over structuur, design, techniek en de slimste volgende stap.
                </p>
              </div>

              {/* Contact details as terminal rows */}
              <div className="mt-10 lg:mt-0">
                <p className="font-mono text-[.56rem] uppercase tracking-[.28em] mb-5" style={{ color: 'rgba(200,168,106,.28)' }}>
                  Directe contactgegevens
                </p>
                <div className="grid gap-3">
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-3 font-mono text-[.72rem] transition-colors"
                      style={{ color: 'rgba(240,237,230,.50)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,237,230,.50)'; }}
                    >
                      <Mail size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      {contactEmail}
                    </a>
                  )}
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
                      className="flex items-center gap-3 font-mono text-[.72rem] transition-colors"
                      style={{ color: 'rgba(240,237,230,.50)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,237,230,.50)'; }}
                    >
                      <Phone size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      {contactPhone}
                    </a>
                  )}
                  {!contactEmail && !contactPhone && (
                    <p className="font-mono text-[.65rem]" style={{ color: 'rgba(200,168,106,.25)' }}>
                      Contactgegevens worden binnenkort aangevuld.
                    </p>
                  )}
                </div>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 mt-5 rounded-full px-5 py-2.5 font-mono text-[.62rem] uppercase tracking-[.16em] transition-all"
                    style={{
                      border: '1px solid rgba(124,92,191,.35)',
                      color: 'var(--accent2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent2)';
                      e.currentTarget.style.color = '#08050F';
                      e.currentTarget.style.borderColor = 'var(--accent2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--accent2)';
                      e.currentTarget.style.borderColor = 'rgba(124,92,191,.35)';
                    }}
                  >
                    <MessageCircle size={13} />
                    WhatsApp ons direct
                  </a>
                )}

                {/* Response time */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="status-dot" />
                  <span className="font-mono text-[.62rem]" style={{ color: 'rgba(200,168,106,.48)' }}>
                    Reactie binnen 24 uur
                  </span>
                </div>
              </div>
            </aside>

            {/* ── RIGHT: contact form ── */}
            <div className="px-5 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24">
              <form onSubmit={handleSubmit} className="grid gap-6 max-w-xl">
                {/* Ghost header */}
                <p className="font-mono text-[.6rem] uppercase tracking-[.38em] mb-2" style={{ color: 'rgba(200,168,106,.30)' }}>
                  — Stuur een bericht
                </p>

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

                {/* Name */}
                <label className={labelClass}>
                  Naam *
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Jan de Vries"
                  />
                </label>

                {/* Email */}
                <label className={labelClass}>
                  Email *
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="jan@bedrijf.nl"
                  />
                </label>

                {/* Phone */}
                <label className={labelClass}>
                  Telefoon
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="+31 6 12345678"
                  />
                </label>

                {/* Company */}
                <label className={labelClass}>
                  Bedrijf
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Bedrijfsnaam"
                  />
                </label>

                {/* Service */}
                <label className={labelClass}>
                  Interesse *
                  <select
                    required
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Kies dienst…</option>
                    <option>Website redesign</option>
                    <option>React/Supabase build</option>
                    <option>E-commerce</option>
                    <option>SEO/content systeem</option>
                  </select>
                </label>

                {/* Budget */}
                <label className={labelClass}>
                  Budget
                  <select
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Nog open</option>
                    <option>Starter</option>
                    <option>Groei</option>
                    <option>Pro</option>
                  </select>
                </label>

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

                {/* Response time confidence line */}
                <p className="text-center font-mono text-[.58rem] uppercase tracking-[.18em]" style={{ color: 'rgba(200,168,106,.30)' }}>
                  {status === 'sent'
                    ? 'Bedankt — we reageren binnen 24 uur.'
                    : 'Reactie altijd binnen 24 uur · Geen verplichtingen'
                  }
                </p>
              </form>
            </div>

          </div>
        </section>
      </main>
    </>
  );
};

export default ContactPage;
