import React, { useState, useEffect } from 'react';
import { Navigate, Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { LayoutDashboard, FolderKanban, MessageSquare, Layers, LogOut, Menu, X, Mail, Inbox, FileText, Users, BadgePercent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured } from '@/lib/customSupabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { user, loading, isAdmin, profileLoading, signOut } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mfaStatus, setMfaStatus] = useState('checking');

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    let active = true;
    const checkMfa = async () => {
      if (loading || profileLoading || !user || !isAdmin) {
        if (active) setMfaStatus('checking');
        return;
      }
      try {
        const response = await fetch('/api/admin/mfa-status', { credentials: 'include' });
        const data = await response.json().catch(() => ({}));
        if (active) setMfaStatus(data?.ok ? 'ok' : 'required');
      } catch (error) {
        console.error('ADMIN_MFA_STATUS_ERROR', error);
        if (active) setMfaStatus('required');
      }
    };
    checkMfa();
    return () => { active = false; };
  }, [loading, profileLoading, user, isAdmin]);

  if (loading || profileLoading) {
    return <div className="min-h-screen cinema-bg text-white flex items-center justify-center"><div className="animate-pulse text-[#38bdf8]">Laden...</div></div>;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen cinema-bg text-white flex items-center justify-center px-4">
        <div className="panel cut max-w-xl p-8 text-center">
          <h1 className="text-2xl font-black text-white">Admin configuratie ontbreekt.</h1>
          <p className="mt-3 text-gray-300">Controleer Supabase environment variables.</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/forbidden" replace />;
  if (mfaStatus === 'checking') return <div className="min-h-screen cinema-bg text-white flex items-center justify-center"><div className="animate-pulse text-[#38bdf8]">Beveiliging controleren...</div></div>;
  if (mfaStatus === 'required') return <Navigate to="/admin/verify" replace />;

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <FolderKanban size={20} />, label: 'Projecten', path: '/admin/projects' },
    { icon: <Inbox size={20} />, label: 'Inbox', path: '/admin/inbox' },
    { icon: <Users size={20} />, label: 'Klanten', path: '/admin/customers' },
    { icon: <FileText size={20} />, label: 'Offertes & facturen', path: '/admin/documents' },
    { icon: <BadgePercent size={20} />, label: 'Diensten & prijzen', path: '/admin/service-pricing' },
    { icon: <MessageSquare size={20} />, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: <Layers size={20} />, label: 'Categorieën', path: '/admin/categories' },
    { icon: <Layers size={20} />, label: 'Instellingen', path: '/admin/settings' },
    { icon: <Mail size={20} />, label: 'Nieuwsbrief', path: '/admin/newsletter' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#07111f]/95 backdrop-blur-xl border-r border-[color:var(--stroke)]">
      <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0"><span className="text-xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">Vos Admin</span></div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            {item.icon}<span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800 shrink-0"><Button onClick={() => signOut()} variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10"><LogOut size={20} />Uitloggen</Button></div>
    </div>
  );

  return (
    <div className="min-h-screen cinema-bg text-white flex flex-col lg:flex-row relative">
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#07111f]/95 backdrop-blur-xl border-b border-[color:var(--stroke)] z-50 flex items-center justify-between px-4">
        <span className="text-lg font-bold bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">Vos Admin</span>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md active:bg-gray-700" aria-label="Open menu"><Menu size={24} /></button>
      </header>
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30"><SidebarContent /></aside>
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.3 }} className="fixed inset-y-0 left-0 w-72 bg-[#07111f] z-50 shadow-2xl lg:hidden flex flex-col">
              <div className="absolute top-4 right-4 z-10"><button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white"><X size={24} /></button></div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <main className="flex-1 w-full min-h-screen transition-all lg:pl-64 flex flex-col">
        <div className="h-16 lg:hidden shrink-0" />
        <div className="flex-1 p-4 lg:p-8 w-full max-w-[100vw] overflow-x-hidden"><Outlet /></div>
      </main>
    </div>
  );
};

export default AdminLayout;
