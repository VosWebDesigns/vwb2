
import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { isSupabaseConfigured } from '@/lib/customSupabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error, profile } = await signIn(email, password);
    if (!error) {
      navigate(profile?.role === 'admin' ? '/admin/verify' : '/admin');
    }
    setLoading(false);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center px-4 text-white">
        <Helmet>
          <title>Admin configuratie ontbreekt - Vos Web Designs</title>
        </Helmet>
        <div className="glass-card relative z-10 w-full max-w-md rounded-3xl p-8 text-center">
          <h1 className="font-heading text-3xl font-black tracking-[-.05em]">Admin configuratie ontbreekt.</h1>
          <p className="mt-4 text-slate-300">Controleer Supabase environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell min-h-screen flex items-center justify-center px-4 text-white">
      <Helmet>
        <title>Admin Login - Vos Web Designs</title>
      </Helmet>
      <div className="glass-card relative z-10 w-full max-w-md rounded-3xl p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[rgba(201,169,110,.28)] bg-[rgba(201,169,110,.08)] font-heading text-lg font-black text-[var(--accent)] shadow-[0_0_24px_rgba(201,169,110,.18)]">V</span>
          <h1 className="mt-4 font-heading text-3xl font-black tracking-[-.05em] gradient-text-full">Admin Portal</h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[.24em] text-slate-500">Vos Web Designs</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[rgba(8,8,18,0.7)] border border-[rgba(201,169,110,0.18)] rounded-xl focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(201,169,110,.15)] focus:outline-none text-white transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[rgba(8,8,18,0.7)] border border-[rgba(201,169,110,0.18)] rounded-xl focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(201,169,110,.15)] focus:outline-none text-white transition"
              required
            />
          </div>
          <button
            type="submit"
            className="glow-button w-full justify-center disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Inloggen...' : 'Inloggen'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
