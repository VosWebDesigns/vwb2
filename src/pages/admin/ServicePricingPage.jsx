import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, RotateCcw, Save, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import supabase from '@/lib/customSupabaseClient';
import { SERVICE_CATALOG_ID, SERVICE_CATALOG_STORAGE_KEY, cloneDefaultServiceCatalog, formatPackagePrice, getPackageDiscount, getPackageNetPrice, normalizeServiceCatalog } from '@/lib/serviceCatalog';

const BADGE_PRESETS = ['', 'Quick win', 'Laagdrempelig', 'Ideaal voor starters', 'Beste balans', 'Meest gekozen', 'Populair', 'Premium', 'Maatwerk', 'Beste resultaat', 'Structurele groei', 'Tijdelijke actie'];
const ICON_OPTIONS = [['palette', 'Palette'], ['code', 'Code'], ['shopping-cart', 'Shopping cart'], ['search', 'Search'], ['zap', 'Zap']];
const inputClass = 'w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#8cd6ff] focus:ring-2 focus:ring-[#8cd6ff]/20';
const textareaClass = `${inputClass} min-h-[92px] resize-y`;
const signature = (value) => JSON.stringify(normalizeServiceCatalog(value));

const Field = ({ label, children, hint }) => <label className="block space-y-2"><span className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{label}</span>{children}{hint && <span className="block text-xs text-slate-500">{hint}</span>}</label>;

const readBackupCatalog = () => {
  try { return normalizeServiceCatalog(JSON.parse(localStorage.getItem(SERVICE_CATALOG_STORAGE_KEY) || 'null')); } catch (_error) { return cloneDefaultServiceCatalog(); }
};

const ServicePricingPage = () => {
  const [catalog, setCatalog] = useState(() => cloneDefaultServiceCatalog());
  const [activeServiceId, setActiveServiceId] = useState('webdesign');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [savedSignature, setSavedSignature] = useState(() => signature(cloneDefaultServiceCatalog()));
  const service = catalog.find((item) => item.id === activeServiceId) || catalog[0];
  const hasUnsavedChanges = useMemo(() => signature(catalog) !== savedSignature, [catalog, savedSignature]);

  useEffect(() => {
    let mounted = true;
    const loadCatalog = async () => {
      const { data, error } = await supabase.from('service_catalog').select('catalog, updated_at').eq('id', SERVICE_CATALOG_ID).maybeSingle();
      if (!mounted) return;
      if (error && error.code !== 'PGRST116') console.error('SERVICE_CATALOG_LOAD_FAILED', { code: error.code, message: error.message });
      const next = data?.catalog ? normalizeServiceCatalog(data.catalog) : readBackupCatalog();
      setCatalog(next);
      setActiveServiceId(next[0]?.id || 'webdesign');
      setLastSavedAt(data?.updated_at || null);
      setSavedSignature(signature(next));
      setLoading(false);
    };
    loadCatalog();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handler = (event) => { if (hasUnsavedChanges) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  const persistCatalog = useCallback(async (nextCatalog, successTitle) => {
    const normalized = normalizeServiceCatalog(nextCatalog);
    setSaving(true);
    const { data, error } = await supabase.from('service_catalog').upsert({ id: SERVICE_CATALOG_ID, catalog: normalized, updated_at: new Date().toISOString() }, { onConflict: 'id' }).select('updated_at').single();
    setSaving(false);
    if (error) {
      console.error('SERVICE_CATALOG_SAVE_FAILED', { code: error.code, message: error.message });
      toast({ title: 'Opslaan mislukt', description: error.message || 'De dienstencatalogus kon niet worden opgeslagen.', variant: 'destructive' });
      return false;
    }
    localStorage.setItem(SERVICE_CATALOG_STORAGE_KEY, JSON.stringify(normalized));
    setCatalog(normalized);
    setActiveServiceId((current) => normalized.some((item) => item.id === current) ? current : normalized[0].id);
    setSavedSignature(signature(normalized));
    setLastSavedAt(data?.updated_at || new Date().toISOString());
    toast({ title: successTitle, description: 'De publieke dienstenpagina gebruikt deze centrale Supabase-catalogus.' });
    return true;
  }, []);

  const saveCatalog = () => persistCatalog(catalog, 'Diensten opgeslagen');
  const resetCatalog = () => { const next = cloneDefaultServiceCatalog(); setCatalog(next); setActiveServiceId(next[0].id); persistCatalog(next, 'Standaard diensten hersteld'); };
  const updateService = (field, value) => setCatalog((previous) => normalizeServiceCatalog(previous.map((item) => item.id === service.id ? { ...item, [field]: value } : item)));
  const updatePackage = (packageIndex, field, value) => setCatalog((previous) => normalizeServiceCatalog(previous.map((item) => item.id !== service.id ? item : { ...item, packages: item.packages.map((pkg, index) => index === packageIndex ? { ...pkg, [field]: value } : pkg) })));
  const addPackage = () => setCatalog((previous) => normalizeServiceCatalog(previous.map((item) => item.id !== service.id ? item : { ...item, packages: [...item.packages, { id: `${item.id}-package-${Date.now()}`, name: `Nieuw pakket ${item.packages.length + 1}`, price: 0, badge: 'Quick win', discountType: 'amount', discountValue: 0, recurring: '', features: ['Nieuwe dienstregel'] }] })));
  const removePackage = (packageIndex) => {
    if (service.packages.length <= 1) { toast({ title: 'Minimaal één pakket nodig', description: 'Een dienst moet altijd ten minste één pakket houden.', variant: 'destructive' }); return; }
    setCatalog((previous) => normalizeServiceCatalog(previous.map((item) => item.id !== service.id ? item : { ...item, packages: item.packages.filter((_, index) => index !== packageIndex) })));
  };
  const updateFeatures = (packageIndex, value) => updatePackage(packageIndex, 'features', value.split('\n').map((line) => line.trim()).filter(Boolean));

  return <><Helmet><title>Diensten & prijzen - Vos Admin</title></Helmet><div className="space-y-8">
    <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><p className="text-xs font-black uppercase tracking-[.22em] text-[#8cd6ff]">Vos Admin</p><h1 className="mt-3 text-3xl font-black tracking-[-.04em] text-white md:text-5xl">Diensten & prijzen</h1><p className="mt-3 max-w-2xl text-slate-400">Beheer de centrale Supabase-catalogus voor /diensten.</p><p className="mt-3 text-sm text-slate-500">{hasUnsavedChanges ? 'Niet-opgeslagen wijzigingen' : `Laatst opgeslagen: ${lastSavedAt ? new Date(lastSavedAt).toLocaleString('nl-NL') : 'nog niet bekend'}`}</p></div><div className="flex flex-wrap gap-3"><Button onClick={saveCatalog} disabled={saving || loading} className="gap-2 bg-[#8cd6ff] text-black hover:bg-[#6bc5f5]"><Save size={16} /> {saving ? 'Opslaan…' : 'Opslaan'}</Button><AlertDialog><AlertDialogTrigger asChild><Button disabled={saving || loading} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10"><RotateCcw size={16} /> Reset</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Standaard diensten herstellen?</AlertDialogTitle><AlertDialogDescription>Dit overschrijft de centrale Supabase-catalogus met de standaard diensten, pakketten en prijzen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Annuleren</AlertDialogCancel><AlertDialogAction onClick={resetCatalog}>Reset uitvoeren</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></header>
    {loading ? <Card className="border-white/10 bg-[rgba(12,22,40,0.72)] p-8 text-slate-300">Diensten laden…</Card> : <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]"><Card className="border-white/10 bg-[rgba(12,22,40,0.72)]"><CardHeader><CardTitle className="text-white">Diensten</CardTitle></CardHeader><CardContent className="space-y-3">{catalog.map((item) => <button key={item.id} type="button" onClick={() => setActiveServiceId(item.id)} className={`w-full rounded-2xl border px-4 py-3 text-left transition ${item.id === service.id ? 'border-[#8cd6ff]/60 bg-[#8cd6ff]/10 text-white' : 'border-white/10 bg-black/20 text-slate-300 hover:bg-white/10'}`}><span className="block font-black">{item.title}</span><span className="mt-1 block text-xs text-slate-500">{item.packages.length} pakketten</span></button>)}</CardContent></Card>
      <div className="space-y-6"><Card className="border-white/10 bg-[rgba(12,22,40,0.72)]"><CardHeader><CardTitle className="text-white">Dienstgegevens</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><Field label="Naam dienst"><input className={inputClass} value={service.title} onChange={(e) => updateService('title', e.target.value)} /></Field><Field label="Korte omschrijving"><input className={inputClass} value={service.shortDescription} onChange={(e) => updateService('shortDescription', e.target.value)} /></Field><Field label="Uitgebreide omschrijving"><textarea className={textareaClass} value={service.description} onChange={(e) => updateService('description', e.target.value)} /></Field><Field label="Afbeeldingspad of URL"><input className={inputClass} value={service.image} onChange={(e) => updateService('image', e.target.value)} /></Field><Field label="Icoonselectie"><select className={inputClass} value={service.icon} onChange={(e) => updateService('icon', e.target.value)}>{ICON_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Uitgelicht pakket"><select className={inputClass} value={service.highlightedPackageId} onChange={(e) => updateService('highlightedPackageId', e.target.value)}>{service.packages.map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}</select></Field></CardContent></Card>
      <Card className="border-white/10 bg-[rgba(12,22,40,0.72)]"><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-white">Pakketten / producten</CardTitle><Button type="button" onClick={addPackage} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10"><Plus size={16} /> Pakket</Button></CardHeader><CardContent className="space-y-5">{service.packages.map((pkg, index) => { const discount = getPackageDiscount(pkg); const net = getPackageNetPrice(pkg); return <div key={pkg.id} className="rounded-3xl border border-white/10 bg-black/20 p-5"><div className="mb-4 flex items-start justify-between gap-4"><div><p className="font-black text-white">{pkg.name || `Pakket ${index + 1}`}</p><p className="mt-1 text-sm text-slate-400">Netto prijs: <span className="font-black text-[#8cd6ff]">{formatPackagePrice(net)}</span>{discount > 0 ? ` · korting ${formatPackagePrice(discount)}` : ''}</p></div><Button type="button" onClick={() => removePackage(index)} variant="ghost" className="text-red-300 hover:bg-red-500/10"><Trash2 size={16} /></Button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Pakketnaam"><input className={inputClass} value={pkg.name} onChange={(e) => updatePackage(index, 'name', e.target.value)} /></Field><Field label="Badge / keuze"><select className={inputClass} value={BADGE_PRESETS.includes(pkg.badge || '') ? (pkg.badge || '') : ''} onChange={(e) => updatePackage(index, 'badge', e.target.value)}>{BADGE_PRESETS.map((badge) => <option key={badge || 'none'} value={badge}>{badge || 'Geen badge'}</option>)}</select></Field><Field label="Eigen badge tekst"><input className={inputClass} value={pkg.badge || ''} onChange={(e) => updatePackage(index, 'badge', e.target.value)} /></Field><Field label="Prijs excl. btw"><input type="number" min="0" step="0.01" className={inputClass} value={pkg.price} onChange={(e) => updatePackage(index, 'price', e.target.value)} /></Field><Field label="Korting soort"><select className={inputClass} value={pkg.discountType || 'amount'} onChange={(e) => updatePackage(index, 'discountType', e.target.value)}><option value="amount">Bedrag €</option><option value="percent">Percentage %</option></select></Field><Field label="Korting waarde"><input type="number" min="0" max={pkg.discountType === 'percent' ? '100' : undefined} step="0.01" className={inputClass} value={pkg.discountValue ?? 0} onChange={(e) => updatePackage(index, 'discountValue', e.target.value)} /></Field><Field label="Terugkerend"><input className={inputClass} placeholder="Bijv. / maand" value={pkg.recurring || ''} onChange={(e) => updatePackage(index, 'recurring', e.target.value)} /></Field><div className="md:col-span-2"><Field label="Features" hint="1 feature per regel"><textarea className={textareaClass} value={(pkg.features || []).join('\n')} onChange={(e) => updateFeatures(index, e.target.value)} /></Field></div></div></div>; })}</CardContent></Card></div></div>}
  </div></>;
};

export default ServicePricingPage;
