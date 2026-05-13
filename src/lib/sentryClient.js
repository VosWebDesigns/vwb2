import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN || import.meta.env.NEXT_PUBLIC_SENTRY_DSN;
const tracesSampleRate = Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0.1);

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENV || import.meta.env.MODE || 'production',
    integrations: [Sentry.browserTracingIntegration()].filter(Boolean),
    tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0.1,
  });
}

export { Sentry };
export const capture = (err, ctx) => {
  if (dsn) Sentry.captureException(err, ctx);
};
