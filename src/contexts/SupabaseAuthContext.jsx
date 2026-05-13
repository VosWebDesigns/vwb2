import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

const logSupabaseError = (label, error) => {
  if (!error) return;
  console.error(label, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
};

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (authUser) => {
    if (!authUser?.id) {
      setProfile(null);
      setIsAdmin(false);
      setProfileLoading(false);
      return null;
    }

    setProfileLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, role, full_name')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (error) {
      logSupabaseError('PROFILE_FETCH_ERROR', error);
      setProfile(null);
      setIsAdmin(false);
      setProfileLoading(false);
      return null;
    }

    setProfile(data ?? null);
    setIsAdmin(data?.role === 'admin');
    setProfileLoading(false);
    return data ?? null;
  }, []);

  const handleSession = useCallback(async (nextSession) => {
    setLoading(true);
    const nextUser = nextSession?.user ?? null;

    setSession(nextSession);
    setUser(nextUser);
    await fetchProfile(nextUser);
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        logSupabaseError('AUTH_SESSION_ERROR', error);
      }
      if (mounted) {
        await handleSession(currentSession);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        if (mounted) {
          await handleSession(nextSession);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      logSupabaseError('AUTH_SIGN_UP_ERROR', error);
      toast({
        variant: 'destructive',
        title: 'Registreren mislukt',
        description: error.message || 'Er ging iets mis',
      });
    }

    return { error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logSupabaseError('AUTH_SIGN_IN_ERROR', error);
      toast({
        variant: 'destructive',
        title: 'Inloggen mislukt',
        description: error.message || 'Er ging iets mis',
      });
    }

    let nextProfile = null;
    if (!error && data?.user) {
      nextProfile = await fetchProfile(data.user);

      if (nextProfile?.role === 'admin') {
        try {
          const response = await fetch('/api/admin/request-mfa', {
            method: 'POST',
            headers: { Authorization: `Bearer ${data.session?.access_token || ''}` },
          });

          if (!response.ok) {
            console.error('AUTH_MFA_REQUEST_ERROR', { status: response.status, body: await response.text() });
            toast({
              variant: 'destructive',
              title: 'Verificatiecode niet verstuurd',
              description: 'Vraag opnieuw een code aan op de verificatiepagina.',
            });
          }
        } catch (mfaError) {
          console.error('AUTH_MFA_REQUEST_UNEXPECTED_ERROR', mfaError);
        }
      }
    }

    return { error, data, profile: nextProfile };
  }, [toast, fetchProfile]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      logSupabaseError('AUTH_SIGN_OUT_ERROR', error);
      toast({
        variant: 'destructive',
        title: 'Uitloggen mislukt',
        description: error.message || 'Er ging iets mis',
      });
    } else {
      setProfile(null);
      setIsAdmin(false);
      setProfileLoading(false);
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    profile,
    isAdmin,
    profileLoading,
    loading,
    refreshProfile: () => fetchProfile(user),
    signUp,
    signIn,
    signOut,
  }), [user, session, profile, isAdmin, profileLoading, loading, fetchProfile, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
