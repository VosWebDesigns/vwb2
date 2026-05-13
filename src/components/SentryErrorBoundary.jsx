import React from 'react';
import { captureException } from '@/lib/sentryClient';

class SentryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-[#050b14] px-6 py-24 text-center text-white">
          <p className="text-sm font-black uppercase tracking-[.2em] text-[#38bdf8]">Vos Web Designs</p>
          <h1 className="mt-4 text-4xl font-black">Er ging iets mis.</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">We hebben de fout automatisch gelogd en lossen dit zo snel mogelijk op.</p>
          <a href="/" className="mt-8 inline-flex rounded-full bg-[#38bdf8] px-6 py-3 font-black text-black">Terug naar home</a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SentryErrorBoundary;
