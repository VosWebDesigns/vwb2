
import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

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

  return (
    <div className="min-h-screen cinema-bg flex items-center justify-center px-4 text-white">
      <Helmet>
        <title>Admin Login - Vos Web Designs</title>
      </Helmet>
      <div className="panel cut p-8 w-full max-w-md">
        <h1 className="font-heading text-3xl font-black tracking-[-.05em] mb-6 text-center">Admin Portal</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#0f172a] border border-gray-800 rounded-lg focus:border-[#38bdf8] focus:outline-none text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#0f172a] border border-gray-800 rounded-lg focus:border-[#38bdf8] focus:outline-none text-white"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] font-bold text-black hover:opacity-90"
            disabled={loading}
          >
            {loading ? 'Inloggen...' : 'Inloggen'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
