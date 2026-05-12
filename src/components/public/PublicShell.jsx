import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PublicShell = ({ children }) => (
  <div className="min-h-screen bg-[color:var(--ink)] text-white">
    <Header />
    {children}
    <Footer />
  </div>
);

export default PublicShell;
