import React from 'react';
import { capture } from '@/lib/sentryClient';

const Fallback = () => (
  <div className="min-h-screen bg-[#050b14] px-6 py-24 text-center text-white">
    <p className="text-sm font-black uppercase tracking-[.2em] text-[#38bdf8]">Vos Web Designs</p>
    <h1 className="mt-4 text-4xl font-black">Er ging iets mis met het laden van deze sectie.</h1>
    <p className="mx-auto mt-3 max-w-xl text-slate-300">
      De rest van de website blijft beschikbaar. Probeer de pagina te vernieuwen of neem contact op als dit blijft gebeuren.
    </p>
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex rounded-full bg-[#38bdf8] px-6 py-3 font-black text-black"
      >
        Refresh
      </button>
      <a href="/contact" className="inline-flex rounded-full border border-[#38bdf8]/50 px-6 py-3 font-black text-[#38bdf8]">
        Contact opnemen
      </a>
    </div>
  </div>
);

class SentryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    capture(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) return <Fallback />;
    return this.props.children;
  }
}

export default SentryErrorBoundary;
