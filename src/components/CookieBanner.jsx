import React, { useEffect, useMemo, useState } from 'react';

const CONSENT_KEY = 'vwb_analytics_consent';

const analyticsConfig = () => ({
  plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || import.meta.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  gaId: import.meta.env.VITE_GA_ID || import.meta.env.NEXT_PUBLIC_GA_ID,
});

const injectScript = ({ plausibleDomain, gaId }) => {
  if (typeof document === 'undefined') return;

  if (plausibleDomain && !document.querySelector('script[data-vwb-plausible]')) {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.vwbPlausible = 'true';
    script.dataset.domain = plausibleDomain;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
    return;
  }

  if (gaId && !document.querySelector('script[data-vwb-ga]')) {
    const script = document.createElement('script');
    script.async = true;
    script.dataset.vwbGa = 'true';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { anonymize_ip: true });
  }
};

const CookieBanner = () => {
  const config = useMemo(() => analyticsConfig(), []);
  const analyticsEnabled = Boolean(config.plausibleDomain || config.gaId);
  const [consent, setConsent] = useState(() => {
    if (!analyticsEnabled || typeof window === 'undefined') return 'not-needed';
    return window.localStorage.getItem(CONSENT_KEY) || 'unknown';
  });

  useEffect(() => {
    if (analyticsEnabled && consent === 'accepted') injectScript(config);
  }, [analyticsEnabled, config, consent]);

  useEffect(() => {
    if (!analyticsEnabled || consent !== 'accepted') return undefined;
    const onClick = (event) => {
      const link = event.target?.closest?.('a[href]');
      if (link?.getAttribute('href')?.includes('/contact')) {
        trackAnalyticsEvent('click_contact', { location: window.location.pathname });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [analyticsEnabled, consent]);

  if (!analyticsEnabled || consent !== 'unknown') return null;

  const choose = (value) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-3xl rounded-3xl border border-[color:var(--stroke)] bg-[#07111f]/95 p-5 text-white shadow-2xl backdrop-blur-xl">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[.18em] text-[color:var(--accent2)]">Cookies & analytics</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">We gebruiken privacyvriendelijke analytics pas na toestemming om de website te verbeteren.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => choose('rejected')} className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-white/40 hover:text-white">Weigeren</button>
          <button type="button" onClick={() => choose('accepted')} className="rounded-full bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] px-5 py-3 text-sm font-black text-black transition hover:scale-[1.02]">Accepteren</button>
        </div>
      </div>
    </div>
  );
};

export const trackAnalyticsEvent = (name, props = {}) => {
  if (typeof window === 'undefined' || window.localStorage.getItem(CONSENT_KEY) !== 'accepted') return;
  if (window.plausible) window.plausible(name, { props });
  if (window.gtag) window.gtag('event', name, props);
};

export default CookieBanner;
