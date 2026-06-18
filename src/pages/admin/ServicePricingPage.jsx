import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, RotateCcw, Save, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'vwb2_admin_service_catalog';
const BADGE_PRESETS = ['', 'Quick win', 'Laagdrempelig', 'Ideaal voor starters', 'Beste balans', 'Meest gekozen', 'Populair', 'Premium', 'Maatwerk', 'Beste resultaat', 'Structurele groei', 'Tijdelijke actie'];
const currency = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });

const DEFAULT_CATALOG = [
  { title: 'Webdesign', description: 'Professioneel design voor starters & kleine bedrijven', packages: [
    { name: 'Starter', price: 349, badge: 'Ideaal voor starters', discountType: 'amount', discountValue: 0, recurring: '', features: ['1-2 pagina\'s', 'Modern & responsive design', 'Contactformulier', 'Basis SEO'] },
    { name: 'Groei', price: 649, badge: 'Beste balans', discountType: 'amount', discountValue: 0, recurring: '', features: ['Tot 5 pagina\'s', 'Conversiegericht ontwerp', 'Subtiele animaties', 'SEO & performance basis'] },
    { name: 'Pro', price: 995, badge: 'Meest gekozen', discountType: 'amount', discountValue: 0, recurring: '', features: ['Volledig maatwerk design', 'Unieke branding look', 'Uitbreidbaar voor groei', 'Persoonlijke begeleiding'] },
  ] },
  { title: 'Webontwikkeling', description: 'Betrouwbare techniek zonder onnodige complexiteit', packages: [
    { name: 'Starter', price: 595, badge: 'Laagdrempelig', discountType: 'amount', discountValue: 0, recurring: '', features: ['Professionele website', 'Snelle laadtijden', 'Eenvoudig beheerbaar'] },
    { name: 'Groei', price: 995, badge: 'Beste balans', discountType: 'amount', discountValue: 0, recurring: '', features: ['Uitgebreide pagina\'s', 'Formulieren & koppelingen', 'Performance optimalisatie'] },
    { name: 'Pro', price: 1495, badge: 'Maatwerk', discountType: 'amount', discountValue: 0, recurring: '', features: ['Custom functionaliteit', 'Database of login systeem', 'Doorontwikkelbaar platform'] },
  ] },
  { title: 'E-commerce', description: 'Start eenvoudig met online verkopen', packages: [
    { name: 'Starter', price: 895, badge: 'Quick win', discountType: 'amount', discountValue: 0, recurring: '', features: ['Tot 10 producten', 'iDEAL betalingen', 'Gebruiksvriendelijk beheer'] },
    { name: 'Groei', price: 1495, badge: 'Meest gekozen', discountType: 'amount', discountValue: 0, recurring: '', features: ['Onbeperkt producten', 'Kortingen & acties', 'Conversiegericht design'] },
    { name: 'Pro', price: 2495, badge: 'Premium', discountType: 'amount', discountValue: 0, recurring: '', features: ['Maatwerk webshop', 'Automatiseringen', 'Analytics & optimalisatie'] },
  ] },
  { title: 'SEO & Marketing', description: 'Gevonden worden in Google, stap voor stap', packages: [
    { name: 'Starter', price: 149, badge: 'Quick win', discountType: 'amount', discountValue: 0, recurring: '/ maand', features: ['Technische SEO check', 'Basis optimalisatie', 'Maandelijkse rapportage'] },
    { name: 'Groei', price: 299, badge: 'Beste balans', discountType: 'amount', discountValue: 0, recurring: '/ maand', features: ['Content optimalisatie', 'Lokale SEO', 'Actieplan per maand'] },
    { name: 'Pro', price: 499, badge: 'Structurele groei', discountType: 'amount', discountValue: 0, recurring: '/ maand', features: ['Concurrentie analyse', 'Doorlopende optimalisatie', 'Structurele groei'] },
  ] },
];

const inputClass = 'w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20';
const textareaClass = `${inputClass} min-h-[92px] resize-y`;
const cloneDefaultCatalog = () => JSON.parse(JSON.stringify(DEFAULT_CATALOG));
const readCatalog = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(parsed) && parsed.length ? parsed : cloneDefaultCatalog();
  } catch (_error) {
    return cloneDefaultCatalog();
  }
};
const parseMoney = (value) => {
  const parsed = Number.parseFloat(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};
const getDiscount = (pkg) => {
  const price = parseMoney(pkg.price);
  const raw = parseMoney(pkg.discountValue);
  if (!price || !raw) return 0;
  return pkg.discountType === 'percent' ? Math.min(price, price * (raw / 100)) : Math.min(price, raw);
};
const getNetPrice = (pkg) => Math.max(0, parseMoney(pkg.price) - getDiscount(pkg));

const Field = ({ label, children, hint }) => (
  <label className="block space-y-2">
    <span className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{label}</span>
    {children}
    {hint && <span className="block text-xs text-slate-500">{hint}</span>}
  </label>
);

const ServicePricingPage = () => {
  const [catalog, setCatalog] = useState(readCatalog);
  const [activeService, setActiveService] = useState(() => readCatalog()[0]?.title || DEFAULT_CATALOG[0].title);
  const service = catalog.find((item) => item.title === activeService) || catalog[0];

  const saveCatalog = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
    toast({ title: 'Diensten opgeslagen', description: 'Prijzen, labels en kortingen zijn bijgewerkt.' });
  };

  const resetCatalog = () => {
    const next = cloneDefaultCatalog();
    setCatalog(next);
    setActiveService(next[0].title);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    toast({ title: 'Standaard diensten hersteld' });
  };

  const updateService = (field, value) => {
    setCatalog((previous) => previous.map((item) => item.title === service.title ? { ...item, [field]: value } : item));
    if (field === 'title') setActiveService(value);
  };

  const updatePackage = (packageIndex, field, value) => {
    setCatalog((previous) => previous.map((item) => item.title !== service.title ? item : {
      ...item,
      packages: item.packages.map((pkg, index) => index === packageIndex ? { ...pkg, [field]: value } : pkg),
    }));
  };

  const addPackage = () => {
    setCatalog((previous) => previous.map((item) => item.title !== service.title ? item : {
      ...item,
      packages: [...item.packages, { name: `Nieuw pakket ${item.packages.length + 1}`, price: 0, badge: 'Quick win', discountType: 'amount', discountValue: 0, recurring: '', features: ['Nieuwe dienstregel'] }],
    }));
  };

  const removePackage = (packageIndex) => {
    setCatalog((previous) => previous.map((item) => item.title !== service.title ? item : {
      ...item,
      packages: item.packages.filter((_, index) => index !== packageIndex),
    }));
  };

  const updateFeatures = (packageIndex, value) => {
    updatePackage(packageIndex, 'features', value.split('\n').map((line) => line.trim()).filter(Boolean));
  };

  return (
    <>
      <Helmet><title>Diensten & prijzen - Vos Admin</title></Helmet>
      <div className="space-y-8">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#38bdf8]">Vos Admin</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-.04em] text-white md:text-5xl">Diensten & prijzen</h1>
            <p className="mt-3 max-w-2xl text-slate-400">Los admin-onderdeel voor prijzen, badges en productkortingen. Dit staat niet in je offerte-editor.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={saveCatalog} className="gap-2 bg-[#38bdf8] text-black hover:bg-[#0ea5e9]"><Save size={16} /> Opslaan</Button>
            <Button onClick={resetCatalog} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10"><RotateCcw size={16} /> Reset</Button>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="border-white/10 bg-[#111827]">
            <CardHeader><CardTitle className="text-white">Diensten</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {catalog.map((item) => (
                <button key={item.title} type="button" onClick={() => setActiveService(item.title)} className={`w-full rounded-2xl border px-4 py-3 text-left transition ${item.title === service.title ? 'border-[#38bdf8]/60 bg-[#38bdf8]/10 text-white' : 'border-white/10 bg-black/20 text-slate-300 hover:bg-white/10'}`}>
                  <span className="block font-black">{item.title}</span>
                  <span className="mt-1 block text-xs text-slate-500">{item.packages.length} pakketten</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-[#111827]">
              <CardHeader><CardTitle className="text-white">Dienstgegevens</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label="Naam dienst"><input className={inputClass} value={service.title} onChange={(e) => updateService('title', e.target.value)} /></Field>
                <Field label="Omschrijving"><input className={inputClass} value={service.description || ''} onChange={(e) => updateService('description', e.target.value)} /></Field>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#111827]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Pakketten / producten</CardTitle>
                <Button type="button" onClick={addPackage} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10"><Plus size={16} /> Pakket</Button>
              </CardHeader>
              <CardContent className="space-y-5">
                {service.packages.map((pkg, index) => {
                  const discount = getDiscount(pkg);
                  const net = getNetPrice(pkg);
                  return (
                    <div key={`${pkg.name}-${index}`} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-white">{pkg.name || `Pakket ${index + 1}`}</p>
                          <p className="mt-1 text-sm text-slate-400">Netto prijs: <span className="font-black text-[#38bdf8]">{currency.format(net)}</span>{discount > 0 ? ` · korting ${currency.format(discount)}` : ''}</p>
                        </div>
                        <Button type="button" onClick={() => removePackage(index)} variant="ghost" className="text-red-300 hover:bg-red-500/10"><Trash2 size={16} /></Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Pakketnaam"><input className={inputClass} value={pkg.name} onChange={(e) => updatePackage(index, 'name', e.target.value)} /></Field>
                        <Field label="Badge / keuze"><select className={inputClass} value={BADGE_PRESETS.includes(pkg.badge || '') ? (pkg.badge || '') : ''} onChange={(e) => updatePackage(index, 'badge', e.target.value)}>{BADGE_PRESETS.map((badge) => <option key={badge || 'none'} value={badge}>{badge || 'Geen badge'}</option>)}</select></Field>
                        <Field label="Eigen badge tekst" hint="Bijv. Quick win, meest gekozen of iets eigens"><input className={inputClass} value={pkg.badge || ''} onChange={(e) => updatePackage(index, 'badge', e.target.value)} /></Field>
                        <Field label="Prijs excl. btw"><input type="number" min="0" step="0.01" className={inputClass} value={pkg.price} onChange={(e) => updatePackage(index, 'price', e.target.value)} /></Field>
                        <Field label="Korting soort"><select className={inputClass} value={pkg.discountType || 'amount'} onChange={(e) => updatePackage(index, 'discountType', e.target.value)}><option value="amount">Bedrag €</option><option value="percent">Percentage %</option></select></Field>
                        <Field label="Korting waarde"><input type="number" min="0" step="0.01" className={inputClass} value={pkg.discountValue ?? 0} onChange={(e) => updatePackage(index, 'discountValue', e.target.value)} /></Field>
                        <Field label="Terugkerend"><input className={inputClass} placeholder="Bijv. / maand" value={pkg.recurring || ''} onChange={(e) => updatePackage(index, 'recurring', e.target.value)} /></Field>
                        <div className="md:col-span-2"><Field label="Features" hint="1 feature per regel"><textarea className={textareaClass} value={(pkg.features || []).join('\n')} onChange={(e) => updateFeatures(index, e.target.value)} /></Field></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePricingPage;
