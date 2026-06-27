import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PublicShell = ({ children }) => (
  <div className="relative min-h-screen text-white">
    <Header />
    {children}
    <Footer />
  </div>
);

export default PublicShell;
