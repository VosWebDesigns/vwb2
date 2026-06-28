import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Edit, Plus, RefreshCw, Save, Search, Trash2, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { isSupabaseConfigured, supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const STORAGE_KEY = 'vwb2_admin_customers';
const STATUS_OPTIONS = [
  { value: 'lead', label: 'Lead' },
  { value: 'customer', label: 'Klant' },
  { value: 'former', label: 'Oud-klant' },
];

const emptyCustomer = () => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `customer-${Date.now()}`,
  name: '',
  company_name: '',
  email: '',
  phone: '',
  address: '',
  postal_code: '',
  city: '',
  vat_number: '',
  notes: '',
  status: 'lead',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const inputClass = 'w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(201,169,110,.15)]';
const labelClass = 'text-xs font-black uppercase tracking-[.16em] text-slate-400';

const readLocalCustomers = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const writeLocalCustomers = (customers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
};

const normalizeCustomer = (customer) => ({
  ...emptyCustomer(),
  ...customer,
  name: customer.name || '',
  company_name: customer.company_name || '',
  email: customer.email || '',
  phone: customer.phone || '',
  address: customer.address || '',
  postal_code: customer.postal_code || '',
  city: customer.city || '',
  vat_number: customer.vat_number || '',
  notes: customer.notes || '',
  status: customer.status || 'lead',
  updated_at: new Date().toISOString(),
});

const CustomersPage = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(() => emptyCustomer());
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [storageMode, setStorageMode] = useState('local');

  const loadCustomers = async () => {
    setLoading(true);
    const localCustomers = readLocalCustomers();

    if (!isSupabaseConfigured) {
      setCustomers(localCustomers);
      setStorageMode('local');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
      setStorageMode('supabase');
    } catch (error) {
      setCustomers(localCustomers);
      setStorageMode('local');
      toast({
        variant: 'destructive',
        title: 'Klanten lokaal geladen',
        description: 'De Supabase customers-tabel ontbreekt mogelijk nog. Run de nieuwe migratie.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCustomers(); }, []);

  const filteredCustomers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const haystack = [customer.name, customer.company_name, customer.email, customer.phone, customer.city, customer.notes]
        .join(' ')
        .toLowerCase();
      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [customers, query, statusFilter]);

  const updateField = (field, value) => {
    setCurrentCustomer((previous) => ({ ...previous, [field]: value }));
  };

  const startNewCustomer = () => {
    setCurrentCustomer(emptyCustomer());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editCustomer = (customer) => {
    setCurrentCustomer(normalizeCustomer(customer));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const persistLocal = (customerToSave) => {
    const next = [customerToSave, ...customers.filter((customer) => customer.id !== customerToSave.id)];
    setCustomers(next);
    writeLocalCustomers(next);
  };

  const saveCustomer = async (event) => {
    event.preventDefault();
    const customerToSave = normalizeCustomer({ ...currentCustomer, created_by: user?.id || currentCustomer.created_by || null });

    if (!customerToSave.name.trim() && !customerToSave.company_name.trim()) {
      toast({ variant: 'destructive', title: 'Naam ontbreekt', description: 'Vul minimaal een klantnaam of bedrijfsnaam in.' });
      return;
    }

    if (storageMode === 'supabase' && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .upsert(customerToSave)
          .select('*')
          .single();

        if (error) throw error;
        const savedCustomer = normalizeCustomer(data);
        setCustomers((previous) => [savedCustomer, ...previous.filter((customer) => customer.id !== savedCustomer.id)]);
        setCurrentCustomer(savedCustomer);
        toast({ title: 'Klant opgeslagen', description: `${savedCustomer.company_name || savedCustomer.name} is bijgewerkt.` });
        return;
      } catch (error) {
        setStorageMode('local');
        toast({ variant: 'destructive', title: 'Supabase opslag mislukt', description: 'Klant wordt tijdelijk lokaal opgeslagen.' });
      }
    }

    persistLocal(customerToSave);
    setCurrentCustomer(customerToSave);
    toast({ title: 'Klant lokaal opgeslagen', description: 'Run de Supabase migratie voor gedeelde opslag.' });
  };

  const deleteCustomer = async (customerId) => {
    const next = customers.filter((customer) => customer.id !== customerId);
    setCustomers(next);
    writeLocalCustomers(next);

    if (storageMode === 'supabase' && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('customers').delete().eq('id', customerId);
        if (error) throw error;
      } catch (_error) {
        toast({ variant: 'destructive', title: 'Verwijderen in Supabase mislukt', description: 'Controleer je migratie/RLS policies.' });
      }
    }

    if (currentCustomer.id === customerId) startNewCustomer();
    toast({ title: 'Klant verwijderd' });
  };

  return (
    <div className="space-y-8 pb-24">
      <Helmet><title>Klanten - Vos Admin</title></Helmet>

      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[.22em] text-[var(--accent)]">Vos Admin CRM</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-.04em] text-white md:text-5xl">Klantenbeheer</h1>
          <p className="mt-3 max-w-2xl text-slate-400">Leg leads en klanten centraal vast, zodat offertes en facturen direct klantgegevens kunnen hergebruiken.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={loadCustomers} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Vernieuwen</Button>
          <Button onClick={startNewCustomer} className="gap-2 bg-[var(--accent)] text-black hover:bg-[#6bc5f5]"><Plus size={16} /> Nieuwe klant</Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="border-white/10 bg-[rgba(8,8,18,.82)]">
          <CardHeader>
            <CardTitle className="text-white">{customers.some((customer) => customer.id === currentCustomer.id) ? 'Klant bewerken' : 'Klant aanmaken'}</CardTitle>
            <p className="text-sm text-slate-500">Opslag: {storageMode === 'supabase' ? 'Supabase' : 'Browser lokaal'}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveCustomer} className="space-y-4">
              <div className="grid gap-2"><label className={labelClass}>Klantnaam</label><input className={inputClass} value={currentCustomer.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Jan Jansen" /></div>
              <div className="grid gap-2"><label className={labelClass}>Bedrijfsnaam</label><input className={inputClass} value={currentCustomer.company_name} onChange={(e) => updateField('company_name', e.target.value)} placeholder="Jansen Bouw B.V." /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><label className={labelClass}>E-mail</label><input type="email" className={inputClass} value={currentCustomer.email} onChange={(e) => updateField('email', e.target.value)} /></div>
                <div className="grid gap-2"><label className={labelClass}>Telefoon</label><input className={inputClass} value={currentCustomer.phone} onChange={(e) => updateField('phone', e.target.value)} /></div>
              </div>
              <div className="grid gap-2"><label className={labelClass}>Adres</label><input className={inputClass} value={currentCustomer.address} onChange={(e) => updateField('address', e.target.value)} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><label className={labelClass}>Postcode</label><input className={inputClass} value={currentCustomer.postal_code} onChange={(e) => updateField('postal_code', e.target.value)} /></div>
                <div className="grid gap-2"><label className={labelClass}>Plaats</label><input className={inputClass} value={currentCustomer.city} onChange={(e) => updateField('city', e.target.value)} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><label className={labelClass}>BTW-nummer</label><input className={inputClass} value={currentCustomer.vat_number} onChange={(e) => updateField('vat_number', e.target.value)} /></div>
                <div className="grid gap-2"><label className={labelClass}>Status</label><select className={inputClass} value={currentCustomer.status} onChange={(e) => updateField('status', e.target.value)}>{STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
              </div>
              <div className="grid gap-2"><label className={labelClass}>Notities</label><textarea className={`${inputClass} min-h-[120px]`} value={currentCustomer.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Follow-up, voorkeuren, afspraken..." /></div>
              <Button type="submit" className="w-full gap-2 bg-[var(--accent)] text-black hover:bg-[#6bc5f5]"><Save size={16} /> Opslaan</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-white/10 bg-[rgba(8,8,18,.82)]">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <label className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek op naam, bedrijf, e-mail, plaats..." className={`${inputClass} pl-10`} />
                </label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} lg:w-52`}>
                  <option value="all">Alle statussen</option>
                  {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[rgba(8,8,18,.82)] p-8 text-center text-slate-400">Klanten laden…</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[rgba(8,8,18,.82)] p-12 text-center text-slate-500">
              <Users size={44} className="mx-auto mb-4 opacity-40" />
              Nog geen klanten gevonden. Maak je eerste klant aan of zet een lead om naar klant.
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredCustomers.map((customer) => (
                <article key={customer.id} className="rounded-2xl border border-white/10 bg-[rgba(8,8,18,.82)] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <button type="button" onClick={() => editCustomer(customer)} className="text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-black text-white">{customer.company_name || customer.name}</h2>
                        <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-[var(--accent)]">{STATUS_OPTIONS.find((option) => option.value === customer.status)?.label || customer.status}</span>
                      </div>
                      {customer.company_name && customer.name && <p className="mt-1 text-sm text-slate-400">T.a.v. {customer.name}</p>}
                      <p className="mt-2 text-sm text-slate-500">{[customer.email, customer.phone, customer.city].filter(Boolean).join(' • ') || 'Geen contactgegevens'}</p>
                    </button>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => editCustomer(customer)}><Edit size={16} /></Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteCustomer(customer.id)}><Trash2 className="text-red-400" size={16} /></Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
