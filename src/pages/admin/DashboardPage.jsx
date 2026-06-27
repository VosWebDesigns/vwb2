import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '@/lib/customSupabaseClient';
import useSafeAdminRealtime from '@/hooks/useSafeAdminRealtime';
import { formatDateTimeNL } from '@/lib/formatDateTime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, ArrowRight, CheckCircle2, Download, Eye, FileText, FolderKanban, Inbox, Layers, MessageSquare, Plus, ReceiptText, Users } from 'lucide-react';

const currency = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
const OPEN_INVOICE_STATUSES = ['sent', 'overdue'];
const TYPE_LABELS = { project: 'Project', testimonial: 'Review', category: 'Categorie', settings: 'Instellingen' };
const ACTION_LABELS = { created: 'toegevoegd', updated: 'bijgewerkt', deleted: 'verwijderd' };

const getTargetRoute = (activity) => ({ project: '/admin/projects', testimonial: '/admin/testimonials', category: '/admin/categories', settings: '/admin/settings' }[activity.type] || null);
const formatActivityText = (a) => `${TYPE_LABELS[a.type] || 'Item'} "${a.title || ''}" ${ACTION_LABELS[a.action] || ''}`;
const isMissingTable = (error) => error?.code === '42P01' || /does not exist|Could not find the table|schema cache/i.test(error?.message || '');

const safeCount = async (table, query = (builder) => builder) => {
  try {
    const { count, error } = await query(supabase.from(table).select('id', { count: 'exact', head: true }));
    if (error) throw error;
    return { count: count || 0, missing: false, error: null };
  } catch (error) {
    return { count: 0, missing: isMissingTable(error), error };
  }
};

const safeRows = async (table, query = (builder) => builder) => {
  try {
    const { data, error } = await query(supabase.from(table).select('*'));
    if (error) throw error;
    return { data: data || [], missing: false, error: null };
  } catch (error) {
    return { data: [], missing: isMissingTable(error), error };
  }
};

const DashboardPage = () => {
  const { user, session, isAdmin, profileLoading, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ leads: 0, projects: 0, testimonials: 0, quotes: 0, invoices: 0, openInvoices: 0, openInvoiceValue: 0 });
  const [missingTables, setMissingTables] = useState([]);
  const [healthChecks, setHealthChecks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const openLeads = stats.leads;

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const missing = new Set();

      const [leads, projects, testimonials, quotes, invoices, featuredProjects, visibleTestimonials, settingsRows, publishedProjects, activityRows] = await Promise.all([
        safeCount('leads', (q) => q.in('status', ['nieuw', 'Nieuw', 'opgevolgd', 'In gesprek', 'offerte gestuurd', 'Offerte'])),
        safeCount('projects'),
        safeCount('testimonials'),
        safeCount('business_documents', (q) => q.eq('type', 'quote')),
        safeCount('business_documents', (q) => q.eq('type', 'invoice')),
        safeCount('projects', (q) => q.eq('is_featured', true).or('is_published.is.null,is_published.eq.true')),
        safeCount('testimonials', (q) => q.or('is_visible.is.null,is_visible.eq.true')),
        safeRows('site_settings', (q) => q.limit(1)),
        safeCount('projects', (q) => q.or('is_published.is.null,is_published.eq.true')),
        safeRows('activity_log', (q) => q.order('created_at', { ascending: false }).limit(8)),
      ]);

      [
        ['leads', leads], ['projects', projects], ['testimonials', testimonials], ['business_documents', quotes], ['business_documents', invoices], ['site_settings', settingsRows], ['activity_log', activityRows]
      ].forEach(([table, result]) => { if (result.missing) missing.add(table); });

      const invoiceRows = await safeRows('business_documents', (q) => q.eq('type', 'invoice').in('status', OPEN_INVOICE_STATUSES).select('total_inc_vat,status,due_date,document_json'));
      if (invoiceRows.missing) missing.add('business_documents');
      const openInvoiceValue = invoiceRows.data.reduce((sum, row) => sum + Number(row.total_inc_vat || row.document_json?.totals?.total || 0), 0);
      const overdueInvoices = invoiceRows.data.filter((row) => row.status === 'overdue' || (row.due_date && new Date(row.due_date) < new Date())).length;

      setStats({ leads: leads.count, projects: projects.count, testimonials: testimonials.count, quotes: quotes.count, invoices: invoices.count, openInvoices: invoiceRows.data.length, openInvoiceValue });
      setMissingTables(Array.from(missing));
      setActivities(activityRows.data || []);

      const settings = settingsRows.data?.[0] || {};
      const socials = ['social_instagram', 'social_linkedin', 'social_facebook', 'social_twitter', 'social_tiktok', 'social_youtube'];
      setHealthChecks([
        { id: 'contact-details', ok: Boolean(settings?.contact_email && settings?.contact_phone), message: 'Geen contactgegevens ingesteld', fix: '/admin/settings' },
        { id: 'visible-testimonials', ok: visibleTestimonials.count > 0, message: 'Geen zichtbare testimonials', fix: '/admin/testimonials' },
        { id: 'featured-projects', ok: featuredProjects.count > 0, message: 'Geen uitgelichte projecten', fix: '/admin/projects' },
        { id: 'published-projects', ok: publishedProjects.count > 0, message: 'Portfolio heeft 0 gepubliceerde projecten', fix: '/admin/projects' },
        { id: 'footer-socials', ok: socials.some((field) => settings?.[field]), message: 'Footer socials zijn leeg', fix: '/admin/settings' },
        { id: 'open-invoices', ok: overdueInvoices === 0, message: `${overdueInvoices} openstaande/verlopen factuur(en) vragen aandacht`, fix: '/admin/documents' },
      ]);
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const handleActivityChange = useCallback((payload) => {
    const activity = payload?.new;
    if (!activity) return;
    setActivities((prev) => [activity, ...prev].slice(0, 8));
    toast({ title: 'Nieuwe activiteit', description: `${formatActivityText(activity)} ${activity.user_id === user?.id ? '(door jou)' : '(door andere gebruiker)'}` });
  }, [user?.id]);

  useSafeAdminRealtime({ enabled: Boolean(isSupabaseConfigured && user && session && isAdmin && !authLoading && !profileLoading), channelName: 'activity-log-realtime', table: 'activity_log', event: 'INSERT', onChange: handleActivityChange });

  const downloadExport = async (format = 'json', table) => {
    try {
      const token = session?.access_token;
      if (!token) throw new Error('Geen actieve sessie gevonden.');
      const params = new URLSearchParams();
      if (format === 'csv') { params.set('format', 'csv'); params.set('table', table || 'leads'); }
      const response = await fetch(`/api/admin/export${params.toString() ? `?${params}` : ''}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(await response.text());
      const blob = await response.blob();
      const filename = (response.headers.get('Content-Disposition') || '').match(/filename="?([^";]+)"?/)?.[1] || `vwb2-export.${format}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast({ title: 'Backup gestart', description: `${filename} wordt gedownload.` });
    } catch (_error) {
      toast({ variant: 'destructive', title: 'Export mislukt', description: 'Controleer of je adminsessie actief is en migraties zijn uitgevoerd.' });
    }
  };

  const healthWarnings = useMemo(() => [...healthChecks.filter((check) => !check.ok), ...missingTables.map((table) => ({ id: `missing-${table}`, message: `Supabase tabel ontbreekt of is niet bereikbaar: ${table}`, fix: '/admin/settings' }))], [healthChecks, missingTables]);

  const StatCard = ({ title, value, icon: Icon, href, accent }) => <Card className="bg-[rgba(12,22,40,0.72)] border-[rgba(140,214,255,0.12)]"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle><Icon className={`h-4 w-4 ${accent ? 'text-[#8cd6ff]' : 'text-slate-400'}`} /></CardHeader><CardContent><div className="text-2xl font-bold text-white">{loading ? '-' : value}</div>{href && <Button variant="link" className="px-0 text-[#8cd6ff] h-auto mt-2 text-xs flex items-center gap-1" onClick={() => navigate(href)}>Beheren <ArrowRight size={12} /></Button>}</CardContent></Card>;

  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold text-white">Bedrijfscockpit</h1><p className="text-gray-400 mt-2">Overzicht van leads, klanten, portfolio, documenten en bedrijfsgezondheid.</p></div>

      <Card className="bg-[rgba(12,22,40,0.72)] border-[rgba(140,214,255,0.12)]"><CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><CardTitle className="text-white">Waarschuwingen & backup</CardTitle><p className="mt-1 text-sm text-gray-400">Snelle checks die conversie, administratie en vertrouwen beschermen.</p></div><div className="flex flex-col gap-2 sm:flex-row"><Button onClick={() => downloadExport('json')} className="gap-2 bg-[#8cd6ff] text-black hover:bg-[#6bc5f5]"><Download size={16} /> Download backup (JSON)</Button><select onChange={(event) => event.target.value && downloadExport('csv', event.target.value)} defaultValue="" className="rounded-lg border border-[rgba(140,214,255,0.16)] bg-black/30 px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#8cd6ff]"><option value="" disabled>CSV export...</option><option value="leads">Leads</option><option value="customers">Klanten</option><option value="business_documents">Offertes/facturen</option><option value="projects">Projecten</option><option value="testimonials">Testimonials</option><option value="site_settings">Site settings</option></select></div></CardHeader><CardContent>{healthWarnings.length === 0 ? <div className="flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-100"><CheckCircle2 size={20} /> Alles staat klaar voor bezoekers en administratie.</div> : <div className="grid gap-3 md:grid-cols-2">{healthWarnings.map((check) => <div key={check.id} className="flex items-start justify-between gap-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4"><div className="flex gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-amber-300" size={18} /><p className="text-sm font-medium text-amber-100">{check.message}</p></div><Button onClick={() => navigate(check.fix)} variant="link" className="h-auto p-0 text-[#8cd6ff]">Bekijk</Button></div>)}</div>}</CardContent></Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Open leads" value={openLeads} icon={Inbox} href="/admin/inbox" accent />
        <StatCard title="Projecten" value={stats.projects} icon={FolderKanban} href="/admin/projects" />
        <StatCard title="Reviews" value={stats.testimonials} icon={MessageSquare} href="/admin/testimonials" />
        <StatCard title="Offertes" value={stats.quotes} icon={FileText} href="/admin/documents" />
        <StatCard title="Facturen" value={stats.invoices} icon={ReceiptText} href="/admin/documents" />
        <StatCard title="Openstaande facturen" value={stats.openInvoices} icon={AlertTriangle} href="/admin/documents" accent />
        <StatCard title="Waarde openstaand" value={currency.format(stats.openInvoiceValue)} icon={ReceiptText} href="/admin/documents" accent />
        <StatCard title="Configuratie meldingen" value={healthWarnings.length} icon={Layers} href="/admin/settings" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-[rgba(12,22,40,0.72)] border-[rgba(140,214,255,0.12)]"><CardHeader><CardTitle className="text-white">Recente activiteit</CardTitle></CardHeader><CardContent><div className="space-y-4">{activities.length === 0 && <p className="text-gray-500 text-sm">Nog geen activiteit.</p>}{activities.map((a) => { const route = getTargetRoute(a); return <div key={a.id} onClick={() => route && navigate(route)} className={`flex items-center gap-4 text-sm border-b border-[rgba(140,214,255,0.12)] pb-3 last:border-0 ${route ? 'cursor-pointer hover:bg-[#222]' : ''} p-2 rounded`}><div className="h-2 w-2 rounded-full bg-[#8cd6ff]" /><div className="flex-1"><p className="text-gray-300">{formatActivityText(a)}<span className="text-xs text-gray-500 ml-2">{a.user_id === user?.id ? '• door jou' : '• andere gebruiker'}</span></p></div><span className="text-gray-500 text-xs">{formatDateTimeNL(a.created_at)}</span></div>; })}</div></CardContent></Card>

        <Card className="col-span-3 bg-[rgba(12,22,40,0.72)] border-[rgba(140,214,255,0.12)]"><CardHeader><CardTitle className="text-white">Snelle acties</CardTitle></CardHeader><CardContent className="grid gap-3"><Button onClick={() => navigate('/admin/documents?type=quote')} className="h-12 justify-start gap-3 bg-[#8cd6ff] text-black hover:bg-[#6bc5f5]"><Plus size={18} /> Nieuwe offerte</Button><Button onClick={() => navigate('/admin/documents?type=invoice')} variant="outline" className="h-12 justify-start gap-3 border-[rgba(140,214,255,0.16)] text-gray-300"><ReceiptText size={18} className="text-[#8cd6ff]" /> Nieuwe factuur</Button><Button onClick={() => navigate('/admin/customers')} variant="outline" className="h-12 justify-start gap-3 border-[rgba(140,214,255,0.16)] text-gray-300"><Users size={18} className="text-[#8cd6ff]" /> Nieuwe klant</Button><Button onClick={() => navigate('/admin/projects?new=true')} variant="outline" className="h-12 justify-start gap-3 border-[rgba(140,214,255,0.16)] text-gray-300"><FolderKanban size={18} className="text-[#8cd6ff]" /> Nieuw project</Button><Button onClick={() => navigate('/admin/inbox')} variant="outline" className="h-12 justify-start gap-3 border-[rgba(140,214,255,0.16)] text-gray-300"><Inbox size={18} className="text-[#8cd6ff]" /> Inbox bekijken</Button><Button onClick={() => window.open('/', '_blank')} variant="ghost" className="h-12 gap-2 text-gray-400 hover:text-[#8cd6ff]"><Eye size={16} /> Website bekijken</Button></CardContent></Card>
      </div>
    </div>
  );
};

export default DashboardPage;
