import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN || import.meta.env.NEXT_PUBLIC_SENTRY_DSN || import.meta.env.SENTRY_DSN;

if (sentryDsn) {
  console.info('SENTRY_DSN_CONFIGURED');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
