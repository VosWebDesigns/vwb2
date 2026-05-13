import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import SentryErrorBoundary from '@/components/SentryErrorBoundary';
import '@/lib/sentryClient';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SentryErrorBoundary>
      <App />
    </SentryErrorBoundary>
  </React.StrictMode>
);
