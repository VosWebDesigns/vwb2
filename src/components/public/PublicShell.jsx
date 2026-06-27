import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PublicShell = ({ children }) => (
  <div className="min-h-screen text-white" style={{ background: '#020810' }}>
    <Header />
    {children}
    <Footer />
  </div>
);

export default PublicShell;
