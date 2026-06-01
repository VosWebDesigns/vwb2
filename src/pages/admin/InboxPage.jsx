import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Mail, Phone, RefreshCw, Save, Search, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { isSupabaseConfigured, supabase } from '@/lib/customSupabaseClient';
import { formatDateTimeNL } from '@/lib/formatDateTime';

const STATUSES = ['nieuw', 'opgevolgd', 'offerte gestuurd', 'klant geworden', 'afgewezen'];
const LEGACY_STATUS_MAP = {
  Nieuw: 'nieuw',
  'In gesprek': 'opgevolgd',
  Offerte: 'offerte gestuurd',
  Gewonnen: 'klant geworden',
  Verloren: 'afgewezen',
};
const statusLabel = {
  nieuw: 'Nieuw',
  opgevolgd: 'Opgevolgd',
  'offerte gestuurd': 'Offerte gestuurd',
  'klant geworden': 'Klant geworden',
  afgewezen: 'Afgewezen',
};
const statusClass = {
  nieuw: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  opgevolgd: 'border-violet-400/30 bg-violet-400/10 text-violet-200',
  'offerte gestuurd': 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  'klant geworden': 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  afgewezen: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
};

const normalizeStatus = (status) => LEGACY_STATUS_MAP[status] || status || 'nieuw';
const createId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `customer-${Date.now()}`);
const readLocalCustomers = () => {
  try { const parsed = JSON.parse(localStorage.getItem('vwb2_admin_customers') || '[]'); return Array.isArray(parsed) ? parsed : []; } catch (_error) { return []; }
};
const writeLocalCustomers = (customers) => localStorage.setItem('vwb2_admin_customers', JSON.stringify(customers));

const InboxPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('nieuw');
  const [selectedLead, setSelectedLead] = useState(null);
  const [query, setQuery] = useState('');
  const [noteDraft, setNoteDraft] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ variant: 'destructive', title: 'Inbox laden mislukt', description: error.message });
    } else {
      const normalized = (data || []).map((lead) => ({ ...lead, status: normalizeStatus(lead.status), notes: lead.notes || '' }));
      setLeads(normalized);
      if (selectedLead) {
        const fresh = normalized.find((lead) => lead.id === selectedLead.id);
        if (fresh) setSelectedLead(fresh);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  useEffect(() => {
    setNoteDraft(selectedLead?.notes || '');
  }, [selectedLead]);

  const filteredLeads = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const status = normalizeStatus(lead.status);
      const matchesStatus = activeStatus === 'Alle' || status === activeStatus;
      const haystack = [lead.name, lead.email, lead.company, lead.service, lead.message, lead.notes].join(' ').toLowerCase();
      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [activeStatus, leads, query]);

  const counts = useMemo(() => STATUSES.reduce((acc, status) => {
    acc[status] = leads.filter((lead) => normalizeStatus(lead.status) === status).length;
    return acc;
  }, { Alle: leads.length }), [leads]);

  const updateLead = async (leadId, patch, successMessage) => {
    const optimistic = leads.map((lead) => (lead.id === leadId ? { ...lead, ...patch } : lead));
    setLeads(optimistic);
    setSelectedLead((prev) => (prev?.id === leadId ? { ...prev, ...patch } : prev));

    const { data, error } = await supabase.from('leads').update(patch).eq('id', leadId).select('*').single();
    if (error) {
      toast({ variant: 'destructive', title: 'Lead niet bijgewerkt', description: error.message });
      fetchLeads();
      return null;
    }

    const normalized = { ...data, status: normalizeStatus(data.status), notes: data.notes || '' };
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? normalized : lead)));
    setSelectedLead(normalized);
    if (successMessage) toast({ title: successMessage });
    return normalized;
  };

  const updateStatus = (leadId, status) => updateLead(leadId, { status }, `Lead staat nu op ${statusLabel[status]}.`);
  const saveNote = () => selectedLead && updateLead(selectedLead.id, { notes: noteDraft }, 'Notitie opgeslagen');

  const createCustomerFromLead = async () => {
    if (!selectedLead) return;
    const customer = {
      id: createId(),
      name: selectedLead.name || '',
      company_name: selectedLead.company || '',
      email: selectedLead.email || '',
      phone: selectedLead.phone || '',
      address: '',
      postal_code: '',
      city: '',
      vat_number: '',
      notes: `Aangemaakt vanuit lead ${formatDateTimeNL(selectedLead.created_at)}.\n\n${selectedLead.message || ''}`,
      status: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('customers').insert(customer).select('*').single();
        if (error) throw error;
        await updateLead(selectedLead.id, { status: 'klant geworden', customer_id: data.id }, 'Klant aangemaakt vanuit lead');
        navigate(`/admin/customers?customerId=${data.id}`);
        return;
      } catch (_error) {
        toast({ variant: 'destructive', title: 'Supabase customers-tabel niet beschikbaar', description: 'Klant wordt lokaal opgeslagen.' });
      }
    }

    const localCustomers = readLocalCustomers();
    writeLocalCustomers([customer, ...localCustomers]);
    await updateLead(selectedLead.id, { status: 'klant geworden', customer_id: customer.id }, 'Klant lokaal aangemaakt vanuit lead');
    navigate(`/admin/customers?customerId=${customer.id}`);
  };

  const createQuoteFromLead = async () => {
    if (!selectedLead) return;
    await updateLead(selectedLead.id, { status: 'offerte gestuurd' }, 'Lead gemarkeerd voor offerte');
    navigate(`/admin/documents?type=quote&leadId=${selectedLead.id}&customerId=${selectedLead.customer_id || ''}`);
  };

  const mailto = selectedLead ? `mailto:${selectedLead.email}?subject=${encodeURIComponent('Re: aanvraag Vos Web Designs')}&body=${encodeURIComponent(`Hoi ${selectedLead.name},\n\nBedankt voor je aanvraag over ${selectedLead.service || 'je project'}.\n\n`)}` : '#';

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-3xl font-bold text-white">Inbox</h1><p className="mt-2 text-sm text-gray-400">Volg leads op zonder dat aanvragen verdwijnen: lead → klant → offerte → factuur.</p></div>
        <Button onClick={fetchLeads} variant="outline" className="gap-2 border-gray-700 text-gray-300"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Vernieuwen</Button>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-[#111827] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['Alle', ...STATUSES].map((status) => <button key={status} onClick={() => setActiveStatus(status)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${activeStatus === status ? 'border-[#38bdf8] bg-[#38bdf8] text-black' : 'border-gray-700 bg-black/20 text-gray-300 hover:border-gray-500'}`}>{status === 'Alle' ? 'Alle' : statusLabel[status]} <span className="ml-1 opacity-70">{counts[status] || 0}</span></button>)}
          </div>
          <label className="relative min-w-0 lg:w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek lead..." className="w-full rounded-xl border border-gray-700 bg-black/30 py-3 pl-10 pr-4 text-white outline-none focus:border-[#38bdf8]" /></label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_440px]">
        <div className="space-y-3">
          {loading ? <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8 text-center text-gray-400">Leads laden…</div> : filteredLeads.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-800 bg-[#111827] p-8 text-center text-gray-500">Geen leads gevonden.</div> : filteredLeads.map((lead) => {
            const status = normalizeStatus(lead.status);
            return <button key={lead.id} onClick={() => setSelectedLead({ ...lead, status })} className={`w-full rounded-2xl border p-4 text-left transition ${selectedLead?.id === lead.id ? 'border-[#38bdf8] bg-[#38bdf8]/10' : 'border-gray-800 bg-[#111827] hover:border-gray-700'}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-lg font-bold text-white">{lead.name}</h2><p className="text-sm text-gray-400">{lead.company || lead.email}</p><p className="mt-2 line-clamp-2 text-sm text-gray-300">{lead.message || 'Geen bericht.'}</p>{lead.notes && <p className="mt-2 text-xs text-[#38bdf8]">Notitie aanwezig</p>}</div><div className="flex shrink-0 flex-col gap-2 sm:items-end"><span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass[status] || statusClass.nieuw}`}>{statusLabel[status] || status}</span><span className="text-xs text-gray-500">{formatDateTimeNL(lead.created_at)}</span></div></div></button>;
          })}
        </div>

        <aside className={`fixed inset-x-0 bottom-0 z-40 max-h-[88svh] overflow-y-auto rounded-t-3xl border border-gray-800 bg-[#0b1220] p-5 shadow-2xl lg:sticky lg:top-8 lg:block lg:max-h-[calc(100vh-4rem)] lg:rounded-2xl ${selectedLead ? 'block' : 'hidden'}`}>
          {selectedLead && <div className="space-y-5">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#38bdf8]">Lead detail</p><h2 className="mt-2 text-2xl font-bold text-white">{selectedLead.name}</h2><p className="text-gray-400">{selectedLead.company || 'Geen bedrijfsnaam'}</p></div><button onClick={() => setSelectedLead(null)} className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white lg:hidden"><X size={20} /></button></div>
            <label className="grid gap-2 text-sm font-semibold text-gray-300">Status<select value={normalizeStatus(selectedLead.status)} onChange={(event) => updateStatus(selectedLead.id, event.target.value)} className="rounded-xl border border-gray-700 bg-black/30 p-3 text-white outline-none focus:border-[#38bdf8]">{STATUSES.map((status) => <option key={status} value={status}>{statusLabel[status]}</option>)}</select></label>
            <div className="grid gap-2 sm:grid-cols-2"><button onClick={createCustomerFromLead} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 font-semibold text-emerald-100 hover:bg-emerald-400/20"><UserPlus size={16} /> Klant maken</button><button onClick={createQuoteFromLead} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-3 font-semibold text-[#38bdf8] hover:bg-[#38bdf8]/20"><FileText size={16} /> Offerte maken</button></div>
            <div className="grid gap-2 sm:grid-cols-2"><a href={mailto} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#38bdf8] px-4 py-3 font-semibold text-black hover:bg-[#0ea5e9]"><Mail size={16} /> Mail klant</a>{selectedLead.phone ? <a href={`tel:${selectedLead.phone}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 py-3 font-semibold text-gray-200 hover:border-[#38bdf8]"><Phone size={16} /> Bel</a> : <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-800 px-4 py-3 text-gray-600"><Phone size={16} /> Geen tel.</span>}</div>
            <div className="grid gap-2"><label className="text-xs font-bold uppercase tracking-[.18em] text-gray-500">Interne notitie</label><textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} className="min-h-[120px] rounded-xl border border-gray-700 bg-black/30 p-3 text-white outline-none focus:border-[#38bdf8]" placeholder="Volgende stap, afspraken, belnotities..." /><Button onClick={saveNote} variant="outline" className="gap-2 border-gray-700 text-gray-200"><Save size={16} /> Notitie opslaan</Button></div>
            <dl className="grid gap-3 text-sm"><Detail label="Email" value={selectedLead.email} /><Detail label="Telefoon" value={selectedLead.phone} /><Detail label="Dienst" value={selectedLead.service} /><Detail label="Pakket" value={selectedLead.package} /><Detail label="Bron" value={selectedLead.source} /><Detail label="Aangemaakt" value={formatDateTimeNL(selectedLead.created_at)} /></dl>
            <div className="rounded-2xl border border-gray-800 bg-black/20 p-4"><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-gray-500">Bericht</p><p className="whitespace-pre-wrap text-gray-200">{selectedLead.message || '—'}</p></div>
          </div>}
        </aside>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => <div className="rounded-xl border border-gray-800 bg-black/20 p-3"><dt className="text-xs uppercase tracking-[.16em] text-gray-500">{label}</dt><dd className="mt-1 break-words font-semibold text-gray-200">{value || '—'}</dd></div>;

export default InboxPage;
