import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingEnv = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY',
].filter(Boolean);

const missingEnvMessage = missingEnv.length > 0
  ? `Supabase configuratie ontbreekt: ${missingEnv.join(', ')}. Voeg deze variabelen toe aan Vercel en lokaal aan .env.`
  : '';

const createUnavailableQuery = () => {
  const result = Promise.resolve({ data: null, error: { message: missingEnvMessage, code: 'SUPABASE_CONFIG_MISSING' } });

  return new Proxy(result, {
    get(target, prop) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        return target[prop].bind(target);
      }

      if (prop === Symbol.toStringTag) {
        return 'Promise';
      }

      return () => createUnavailableQuery();
    },
  });
};

const createUnavailableSupabaseClient = () => ({
  from: () => createUnavailableQuery(),
  removeChannel: () => undefined,
  channel: () => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => undefined }) }),
    subscribe: () => ({ unsubscribe: () => undefined }),
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
    signUp: async () => ({ data: null, error: { message: missingEnvMessage, code: 'SUPABASE_CONFIG_MISSING' } }),
    signInWithPassword: async () => ({ data: null, error: { message: missingEnvMessage, code: 'SUPABASE_CONFIG_MISSING' } }),
    signOut: async () => ({ error: null }),
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: { message: missingEnvMessage, code: 'SUPABASE_CONFIG_MISSING' } }),
      remove: async () => ({ data: null, error: { message: missingEnvMessage, code: 'SUPABASE_CONFIG_MISSING' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
});

if (missingEnv.length > 0) {
  console.error(missingEnvMessage);
}

const customSupabaseClient = missingEnv.length === 0
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createUnavailableSupabaseClient();

export default customSupabaseClient;

export {
  customSupabaseClient,
  customSupabaseClient as supabase,
};
