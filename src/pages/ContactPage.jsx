import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { gsap } from 'gsap';
import { Mail, MapPin, MessageCircle, Phone, Send, CheckCircle } from 'lucide-react';
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

const cleanPhoneHref = (phone = '') => phone.replace(/[^+\d]/g, '');

const Field = ({ label, required, children }) => (
  <label className="grid gap-2">
    <span
      className="font-mono text-[.58rem] uppercase tracking-[.24em]"
      style={{ color: 'rgba(201,169,110,.55)' }}
    >
      {label}{required && ' *'}
    </span>
    {children}
  </label>
);

const inputStyle = {
  background: 'rgba(10,10,18,.75)',
  border: '1px solid rgba(201,169,110,.14)',
  color: 'var(--accent3)',
};
const inputClass = 'w-full rounded-2xl px-4 py-3.5 text-sm outline-none transition-all duration-300 placeholder:opacity-25';

const ContactPage = () => {
  const { settings }              = useSettings();
  const heroRef                   = useRef(null);
  const titleRef                  = useRef(null);
  const [formData, setFormData]   = useState(initial);
  const [status,   setStatus]     = useState('idle');

  const completion = useMemo(() => {
    const fields = ['name', 'email', 'service', 'message'];
    return Math.round((fields.filter((f) => formData[f]?.trim()).length / fields.length) * 100);
  }, [formData]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      console.error('CONTACT_FORM_SUBMIT_ERROR', err);
      toast({ title: 'Verzenden mislukt', description: 'Probeer opnieuw of mail ons direct.', variant: 'destructive' });
      setStatus('idle');
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.set(titleRef.current, { clipPath: 'inset(0 100% 0 0)' });
        gsap.to(titleRef.current, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.1,
          ease: 'power4.out',
          delay: 0.25,
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const contactEmail = settings?.contact_email?.trim();
  const contactPhone = settings?.contact_phone?.trim();
  const location     = [settings?.address_street, settings?.address_city].filter(Boolean).join(', ');
  const whatsappUrl  = contactPhone ? getWhatsappUrl(contactPhone) : '';

  const CONTACT_ITEMS = [
    contactEmail && { Icon: Mail,    href: `mailto:${contactEmail}`, label: contactEmail },
    contactPhone && { Icon: Phone,   href: `tel:${cleanPhoneHref(contactPhone)}`, label: contactPhone },
    location     && { Icon: MapPin,  href: null, label: location },
  ].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>Contact - Vos Web Designs | Neem Contact Op</title>
        <meta name="description" content="Klaar om uw project te starten? Neem contact op met Vos Web Designs voor een vrijblijvend gesprek." />
      </Helmet>

      <main className="overflow-hidden" style={{ background: '#03030a' }}>

        {/* ── Cinematic hero ── */}
        <section
          ref={heroRef}
          className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden px-5 pt-32 pb-16 md:px-10 lg:px-16"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(201,169,110,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,.035) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-0 left-0 h-[60vh] w-[55vw]"
            style={{ background: 'radial-gradient(ellipse at 10% 5%, rgba(201,169,110,.07), transparent 60%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-[1400px] mx-auto w-full">
            <p
              className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-8"
              style={{ color: 'rgba(201,169,110,.38)' }}
            >
              — Laten we kennismaken
            </p>
            <div ref={titleRef}>
              <h1
                className="font-heading font-black uppercase leading-[.88]"
                style={{
                  fontSize: 'clamp(3.5rem, 11vw, 13rem)',
                  letterSpacing: '-.07em',
                  color: 'var(--accent3)',
                }}
              >
                CON
                <em
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    fontSize: '.95em',
                    letterSpacing: '-.03em',
                  }}
                >
                  ta
                </em>
                CT.
              </h1>
            </div>
          </div>
        </section>

        {/* ── Split Layout ── */}
        <section className="relative px-5 py-16 md:px-10 lg:px-16">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,.12), transparent)' }}
            aria-hidden="true"
          />
          <div className="max-w-[1400px] mx-auto grid gap-16 lg:grid-cols-[2fr_3fr] lg:items-start">

            {/* ── Left: info panel ── */}
            <aside className="lg:sticky lg:top-28">
              <p
                className="font-mono text-[.62rem] uppercase tracking-[.45em] mb-8"
                style={{ color: 'rgba(201,169,110,.38)' }}
              >
                — Directe contact
              </p>
              <h2
                className="font-heading font-black uppercase leading-[.9]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-.055em', color: 'var(--accent3)' }}
              >
                START EEN
                <br />
                <em
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    fontSize: '1.06em',
                    letterSpacing: '-.02em',
                  }}
                >
                  project
                </em>
              </h2>
              <p
                className="mt-6 text-sm leading-[1.95]"
                style={{ color: 'rgba(240,235,227,.45)' }}
              >
                Vertel wat u wilt bereiken. We denken mee over structuur, design en techniek — en de slimste volgende stap.
              </p>

              {/* Contact items */}
              {CONTACT_ITEMS.length > 0 && (
                <div className="mt-10 grid gap-4">
                  {CONTACT_ITEMS.map(({ Icon, href, label }) => {
                    const El = href ? 'a' : 'p';
                    return (
                      <El
                        key={label}
                        {...(href ? { href } : {})}
                        className="flex items-center gap-4 text-sm transition-colors"
                        style={{ color: 'rgba(240,235,227,.5)' }}
                        onMouseEnter={href ? (e) => { e.currentTarget.style.color = 'var(--accent3)'; } : undefined}
                        onMouseLeave={href ? (e) => { e.currentTarget.style.color = 'rgba(240,235,227,.5)'; } : undefined}
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                          style={{ border: '1px solid rgba(201,169,110,.18)', background: 'rgba(201,169,110,.06)' }}
                        >
                          <Icon size={14} style={{ color: 'var(--accent)' }} />
                        </span>
                        {label}
                      </El>
                    );
                  })}
                </div>
              )}

              {/* WhatsApp */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[.14em] transition-all"
                  style={{ border: '1px solid rgba(201,169,110,.22)', color: 'var(--accent)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.color = '#06060c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                >
                  <MessageCircle size={14} />
                  WhatsApp direct
                </a>
              )}

              {/* Response time */}
              <div className="mt-10 flex items-center gap-3">
                <span className="status-dot" />
                <span
                  className="font-mono text-[.58rem] uppercase tracking-[.3em]"
                  style={{ color: 'rgba(201,169,110,.38)' }}
                >
                  Reactie binnen 24 uur
                </span>
              </div>
            </aside>

            {/* ── Right: form ── */}
            <div
              className="relative overflow-hidden rounded-2xl p-7 md:p-10"
              style={{
                border: '1px solid rgba(201,169,110,.1)',
                background: 'rgba(8,8,16,.72)',
                backdropFilter: 'blur(28px)',
              }}
            >
              {/* Top accent */}
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, var(--accent), transparent)', opacity: 0.4 }}
                aria-hidden="true"
              />

              {status === 'sent' ? (
                <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
                  <CheckCircle size={48} style={{ color: 'var(--accent)' }} />
                  <p
                    className="font-heading font-black uppercase leading-none"
                    style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-.05em', color: 'var(--accent3)' }}
                  >
                    Verzonden.
                  </p>
                  <p
                    className="max-w-sm text-sm leading-relaxed"
                    style={{ color: 'rgba(240,235,227,.45)' }}
                  >
                    Bedankt voor uw bericht. Wij nemen binnen 24 uur contact met u op.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5">
                  {/* Honeypot */}
                  <input type="text" name="website" value={formData.website} onChange={handleChange} className="hidden" tabIndex="-1" autoComplete="off" aria-hidden="true" />

                  {/* Progress */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className="font-mono text-[.55rem] uppercase tracking-[.28em]"
                        style={{ color: 'rgba(201,169,110,.38)' }}
                      >
                        Voortgang
                      </span>
                      <span
                        className="font-mono text-[.55rem] uppercase tracking-[.24em]"
                        style={{ color: 'var(--accent)' }}
                      >
                        {completion}%
                      </span>
                    </div>
                    <div style={{ height: 1, background: 'rgba(201,169,110,.1)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${completion}%`,
                          background: 'linear-gradient(to right, var(--accent), var(--accent2))',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Naam" required>
                      <input
                        required name="name" value={formData.name} onChange={handleChange}
                        className={inputClass} style={inputStyle} placeholder="Jan de Vries"
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.42)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.14)'; }}
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        required type="email" name="email" value={formData.email} onChange={handleChange}
                        className={inputClass} style={inputStyle} placeholder="jan@bedrijf.nl"
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.42)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.14)'; }}
                      />
                    </Field>
                  </div>

                  {/* Phone + Company */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Telefoon">
                      <input
                        name="phone" value={formData.phone} onChange={handleChange}
                        className={inputClass} style={inputStyle} placeholder="+31 6 12345678"
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.42)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.14)'; }}
                      />
                    </Field>
                    <Field label="Bedrijf">
                      <input
                        name="company" value={formData.company} onChange={handleChange}
                        className={inputClass} style={inputStyle} placeholder="Bedrijfsnaam"
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.42)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.14)'; }}
                      />
                    </Field>
                  </div>

                  {/* Service + Package */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Interesse" required>
                      <select
                        required name="service" value={formData.service} onChange={handleChange}
                        className={inputClass} style={{ ...inputStyle, appearance: 'none' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.42)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.14)'; }}
                      >
                        <option value="">Kies dienst…</option>
                        <option>Website redesign</option>
                        <option>React/Supabase build</option>
                        <option>E-commerce</option>
                        <option>SEO/content systeem</option>
                      </select>
                    </Field>
                    <Field label="Budget">
                      <select
                        name="package" value={formData.package} onChange={handleChange}
                        className={inputClass} style={{ ...inputStyle, appearance: 'none' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.42)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.14)'; }}
                      >
                        <option value="">Nog open</option>
                        <option>Starter</option>
                        <option>Groei</option>
                        <option>Pro</option>
                      </select>
                    </Field>
                  </div>

                  {/* Message */}
                  <Field label="Projectnotities" required>
                    <textarea
                      required name="message" value={formData.message} onChange={handleChange}
                      rows={6} className={`${inputClass} resize-none`} style={inputStyle}
                      placeholder="Wat moet uw nieuwe website bereiken? Huidige situatie, doelen, deadline…"
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.42)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,169,110,.14)'; }}
                    />
                  </Field>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="glow-button w-full justify-center"
                    style={{ opacity: status === 'sending' ? 0.7 : 1 }}
                  >
                    {status === 'sending' ? 'Versturen…' : 'Verstuur bericht'}
                    {status !== 'sending' && <Send size={15} />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default ContactPage;
