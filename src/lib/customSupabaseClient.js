import { createClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabaseConfigStatus = {
  hasUrl: Boolean(supabaseUrl),
  hasAnonKey: Boolean(supabaseAnonKey),
};

const createSupabaseUnavailableError = () => ({
  message: 'Supabase is niet geconfigureerd voor deze frontend build.',
  details: null,
  hint: 'Set VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY. Gebruik nooit een service-role key in de frontend.',
  code: 'SUPABASE_ENV_MISSING',
});

const warnMissingConfig = (method) => {
  if (import.meta.env.DEV && isBrowser) {
    console.warn(`Supabase ${method} overgeslagen: ontbrekende publieke Vite env vars.`, supabaseConfigStatus);
  }
};

const emptyResult = () => ({ data: null, error: createSupabaseUnavailableError(), count: 0 });

const createNoopQueryBuilder = () => {
  const builder = {};
  const chain = () => builder;
  const resolve = () => Promise.resolve(emptyResult());

  [
    'select',
    'insert',
    'update',
    'upsert',
    'delete',
    'eq',
    'neq',
    'gt',
    'gte',
    'lt',
    'lte',
    'is',
    'in',
    'contains',
    'containedBy',
    'rangeGt',
    'rangeGte',
    'rangeLt',
    'rangeLte',
    'rangeAdjacent',
    'overlaps',
    'textSearch',
    'match',
    'not',
    'or',
    'filter',
    'order',
    'limit',
    'range',
    'single',
    'maybeSingle',
  ].forEach((method) => {
    builder[method] = chain;
  });

  builder.then = (onFulfilled, onRejected) => resolve().then(onFulfilled, onRejected);
  builder.catch = (onRejected) => resolve().catch(onRejected);
  builder.finally = (onFinally) => resolve().finally(onFinally);

  return builder;
};

const createNoopChannel = (name = 'unconfigured-channel') => ({
  topic: name,
  on() {
    return this;
  },
  subscribe(callback) {
    warnMissingConfig('realtime subscription');
    if (typeof callback === 'function') callback('CHANNEL_ERROR', createSupabaseUnavailableError());
    return this;
  },
  unsubscribe() {
    return Promise.resolve('ok');
  },
});

const createNoopStorageBucket = () => ({
  upload: () => Promise.resolve(emptyResult()),
  remove: () => Promise.resolve(emptyResult()),
  list: () => Promise.resolve({ data: [], error: createSupabaseUnavailableError() }),
  getPublicUrl: () => ({ data: { publicUrl: '' } }),
});

const createSafeFallbackClient = () => ({
  from: (table) => {
    warnMissingConfig(`query (${table})`);
    return createNoopQueryBuilder();
  },
  channel: createNoopChannel,
  removeChannel: (channel) => {
    if (channel?.unsubscribe) channel.unsubscribe();
    return Promise.resolve('ok');
  },
  storage: {
    from: () => createNoopStorageBucket(),
  },
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ data: null, error: createSupabaseUnavailableError() }),
    signInWithPassword: () => Promise.resolve({ data: null, error: createSupabaseUnavailableError() }),
    signOut: () => Promise.resolve({ error: null }),
  },
});

const customSupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
        detectSessionInUrl: isBrowser,
      },
    })
  : createSafeFallbackClient();

export default customSupabaseClient;
export { customSupabaseClient, customSupabaseClient as supabase };
