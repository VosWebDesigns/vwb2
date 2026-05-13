const dsn = import.meta.env.VITE_SENTRY_DSN;

const reportDisabled = () => import.meta.env.DEV && !dsn;

export const capture = (err, ctx) => {
  if (reportDisabled()) {
    console.warn('Sentry client monitoring is disabled; skipping capture.', { err, ctx });
  }
};
