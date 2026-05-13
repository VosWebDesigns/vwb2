const dsn = import.meta.env.VITE_SENTRY_DSN || import.meta.env.NEXT_PUBLIC_SENTRY_DSN;
const environment = import.meta.env.VITE_SENTRY_ENV || import.meta.env.MODE || 'production';
const tracesSampleRate = Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0.1);

let initialized = false;
let sentryPromise = null;

const loadSentry = () => {
  if (!dsn || typeof window === 'undefined' || typeof document === 'undefined') return Promise.resolve(null);
  if (window.Sentry) return Promise.resolve(window.Sentry);
  if (sentryPromise) return sentryPromise;

  sentryPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/8.55.0/bundle.tracing.replay.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(window.Sentry || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return sentryPromise;
};

export const initSentryClient = async () => {
  if (!dsn || initialized) return null;
  const Sentry = await loadSentry();
  if (!Sentry || initialized) return Sentry;

  Sentry.init({
    dsn,
    environment,
    integrations: [Sentry.browserTracingIntegration?.()].filter(Boolean),
    tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
  });
  initialized = true;
  return Sentry;
};

export const captureException = async (error, context = {}) => {
  const Sentry = await initSentryClient();
  Sentry?.captureException?.(error, context);
};

initSentryClient();
