import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingEnv = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY',
].filter(Boolean);

if (missingEnv.length > 0) {
  const message = `Supabase configuratie ontbreekt: ${missingEnv.join(', ')}. Voeg deze variabelen toe aan Vercel en lokaal aan .env.`;

  if (import.meta.env.PROD) {
    throw new Error(message);
  }

  console.error(message);
}

const customSupabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '');

export default customSupabaseClient;

export {
  customSupabaseClient,
  customSupabaseClient as supabase,
};
