import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN || import.meta.env.NEXT_PUBLIC_SENTRY_DSN;

if (sentryDsn && typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.__VWB_SENTRY_DSN__ = sentryDsn;
  const script = document.createElement('script');
  script.src = 'https://browser.sentry-cdn.com/8.55.0/bundle.tracing.replay.min.js';
  script.crossOrigin = 'anonymous';
  script.onload = () => {
    window.Sentry?.init?.({
      dsn: sentryDsn,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0.1,
    });
  };
  document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
