import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Copy, Download, FileText, Plus, Printer, ReceiptText, Save, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { isSupabaseConfigured, supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const STORAGE_KEY = 'vwb2_admin_business_documents';
const CUSTOMER_STORAGE_KEY = 'vwb2_admin_customers';
const DRAFT_STORAGE_KEY = 'vwb2_admin_current_business_document_draft';

const FALLBACK_COMPANY = {
  name: 'Voswebdesigns',
  address: 'Jol 37-29',
  city: 'Lelystad',
  postalCode: '',
  iban: 'NL07 ABNA 0137 6395 54',
  kvk: '97280410',
  website: 'https://www.voswebdesigns.nl',
  email: 'info@voswebdesigns.nl',
  phone: '',
  logo: '/logo.jpeg',
};

const SERVICE_CATALOG = [
  { title: 'Webdesign', description: 'Professioneel design voor starters & kleine bedrijven', packages: [{ name: 'Starter', price: 349, features: ['1-2 pagina\'s', 'Modern & responsive design', 'Contactformulier', 'Basis SEO'] }, { name: 'Groei', price: 649, features: ['Tot 5 pagina\'s', 'Conversiegericht ontwerp', 'Subtiele animaties', 'SEO & performance basis'] }, { name: 'Pro', price: 995, features: ['Volledig maatwerk design', 'Unieke branding look', 'Uitbreidbaar voor groei', 'Persoonlijke begeleiding'] }] },
  { title: 'Webontwikkeling', description: 'Betrouwbare techniek zonder onnodige complexiteit', packages: [{ name: 'Starter', price: 595, features: ['Professionele website', 'Snelle laadtijden', 'Eenvoudig beheerbaar'] }, { name: 'Groei', price: 995, features: ['Uitgebreide pagina\'s', 'Formulieren & koppelingen', 'Performance optimalisatie'] }, { name: 'Pro', price: 1495, features: ['Custom functionaliteit', 'Database of login systeem', 'Doorontwikkelbaar platform'] }] },
  { title: 'E-commerce', description: 'Start eenvoudig met online verkopen', packages: [{ name: 'Starter', price: 895, features: ['Tot 10 producten', 'iDEAL betalingen', 'Gebruiksvriendelijk beheer'] }, { name: 'Groei', price: 1495, features: ['Onbeperkt producten', 'Kortingen & acties', 'Conversiegericht design'] }, { name: 'Pro', price: 2495, features: ['Maatwerk webshop', 'Automatiseringen', 'Analytics & optimalisatie'] }] },
  { title: 'SEO & Marketing', description: 'Gevonden worden in Google, stap voor stap', packages: [{ name: 'Starter', price: 149, recurring: '/ maand', features: ['Technische SEO check', 'Basis optimalisatie', 'Maandelijkse rapportage'] }, { name: 'Groei', price: 299, recurring: '/ maand', features: ['Content optimalisatie', 'Lokale SEO', 'Actieplan per maand'] }, { name: 'Pro', price: 499, recurring: '/ maand', features: ['Concurrentie analyse', 'Doorlopende optimalisatie', 'Structurele groei'] }] },
  { title: 'Performance Optimalisatie', description: 'Snelle winst voor je website', packages: [{ name: 'Starter', price: 295, features: ['Snelheidsanalyse', 'Afbeelding optimalisatie', 'Basis caching'] }, { name: 'Groei', price: 495, features: ['Core Web Vitals', 'Lazy loading', 'Code optimalisatie'] }, { name: 'Pro', price: 795, features: ['Geavanceerde optimalisatie', 'Monitoring', 'Advies voor groei'] }] },
];

const QUOTE_STATUS_LABELS = { concept: 'Concept', sent: 'Verzonden', accepted: 'Akkoord', rejected: 'Afgewezen', expired: 'Verlopen' };
const INVOICE_STATUS_LABELS = { concept: 'Concept', sent: 'Verzonden', paid: 'Betaald', overdue: 'Verlopen', cancelled: 'Geannuleerd' };
const PAYMENT_TERMS = [7, 14, 30];
const VAT_OPTIONS = [
  { value: 21, label: '21%' },
  { value: 9, label: '9%' },
  { value: 0, label: '0%' },
  { value: 'exempt', label: 'Vrijgesteld' },
];
const TERMS_LINE = 'Op alle werkzaamheden zijn onze algemene voorwaarden van toepassing: https://www.voswebdesigns.nl/voorwaarden';

const currency = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (dateString, days) => {
  const date = new Date(`${dateString || todayISO()}T12:00:00`);
  date.setDate(date.getDate() + Number(days || 14));
  return date.toISOString().slice(0, 10);
};
const createId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `doc-${Date.now()}-${Math.random().toString(16).slice(2)}`);
const parseMoney = (value) => {
  const parsed = Number.parseFloat(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};
const vatPercent = (value) => (value === 'exempt' ? 0 : parseMoney(value));
const formatDate = (dateString) => (!dateString ? '-' : new Intl.DateTimeFormat('nl-NL').format(new Date(`${dateString}T12:00:00`)));
const getService = (title) => SERVICE_CATALOG.find((service) => service.title === title) || SERVICE_CATALOG[0];
const getPackage = (service, packageName) => service.packages.find((pkg) => pkg.name === packageName) || service.packages[0];
const buildWorkDescription = (service, pkg) => `${service.title} pakket ${pkg.name}${pkg.recurring ? ` ${pkg.recurring}` : ''} - ${service.description}.${pkg.features?.length ? ` Inclusief: ${pkg.features.join(', ')}.` : ''}`;

const getSafeStorage = () => {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; } catch (_error) { return null; }
};
const readLocalDocuments = () => {
  try { const parsed = JSON.parse(getSafeStorage()?.getItem(STORAGE_KEY) || '[]'); return Array.isArray(parsed) ? parsed : []; } catch (_error) { return []; }
};
const writeLocalDocuments = (documents) => getSafeStorage()?.setItem(STORAGE_KEY, JSON.stringify(documents));
const readLocalCustomers = () => {
  try { const parsed = JSON.parse(getSafeStorage()?.getItem(CUSTOMER_STORAGE_KEY) || '[]'); return Array.isArray(parsed) ? parsed : []; } catch (_error) { return []; }
};
const readDraftDocument = () => {
  try {
    const parsed = JSON.parse(getSafeStorage()?.getItem(DRAFT_STORAGE_KEY) || 'null');
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (_error) { return null; }
};
const writeDraftDocument = (document) => {
  const storage = getSafeStorage();
  if (!storage || !document?.id) return;
  storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ ...document, updatedAt: new Date().toISOString() }));
};

const getLineTotal = (item) => parseMoney(item.quantity) * parseMoney(item.unitPrice);
const getLineVat = (item) => getLineTotal(item) * (vatPercent(item.vatRate) / 100);
const statusLabelsFor = (kind) => (kind === 'invoice' ? INVOICE_STATUS_LABELS : QUOTE_STATUS_LABELS);
const calculateTotals = (document) => {
  const items = Array.isArray(document?.items) ? document.items : [];
  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const vat = items.reduce((sum, item) => sum + getLineVat(item), 0);
  const gross = subtotal + vat;
  const rawDiscount = parseMoney(document?.discountValue);
  const discount = document?.discountType === 'percent'
    ? Math.min(gross, Math.max(0, gross * (rawDiscount / 100)))
    : Math.min(gross, Math.max(0, rawDiscount));
  return { subtotal, vat, gross, discount, total: Math.max(0, gross - discount) };
};

const nextDocumentNumber = (kind, existingDocuments = []) => {
  const prefix = kind === 'invoice' ? 'FAC' : 'OFF';
  const year = new Date().getFullYear();
  const regex = new RegExp(`^${prefix}-${year}-(\\d{4})$`);
  const highest = existingDocuments.reduce((max, document) => {
    const match = String(document.number || '').match(regex);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${prefix}-${year}-${String(highest + 1).padStart(4, '0')}`;
};

const createDefaultDocument = (kind = 'quote', existingDocuments = [], settings = {}) => {
  const service = SERVICE_CATALOG[0];
  const pkg = service.packages[1];
  const issueDate = todayISO();
  const paymentTermDays = Number(settings.default_payment_term_days || 14);
  const quoteValidityDays = Number(settings.default_quote_validity_days || 14);
  const defaultVat = settings.default_vat_rate ?? 21;

  return {
    id: createId(),
    kind,
    status: 'concept',
    number: nextDocumentNumber(kind, existingDocuments),
    issueDate,
    validUntil: addDays(issueDate, quoteValidityDays),
    dueDate: addDays(issueDate, paymentTermDays),
    paymentTermDays,
    quoteValidityDays,
    customerId: '',
    customerName: '',
    companyName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerPostalCode: '',
    customerCity: '',
    customerVatNumber: '',
    workType: service.title,
    packageName: pkg.name,
    title: kind === 'invoice' ? 'Factuur website werkzaamheden' : 'Offerte website werkzaamheden',
    intro: kind === 'invoice'
      ? 'Bedankt voor de samenwerking. Hieronder vind je de factuur voor de uitgevoerde werkzaamheden.'
      : 'Bedankt voor je aanvraag. Hieronder vind je een duidelijke offerte op basis van de gekozen werkzaamheden.',
    items: [{ id: createId(), description: buildWorkDescription(service, pkg), quantity: 1, unitPrice: pkg.price, vatRate: defaultVat }],
    discountType: 'amount',
    discountValue: 0,
    discountLabel: 'Korting',
    notes: kind === 'invoice'
      ? `Graag betalen binnen ${paymentTermDays} dagen op IBAN ${settings.iban || FALLBACK_COMPANY.iban} t.n.v. ${settings.site_name || FALLBACK_COMPANY.name}.`
      : `Deze offerte is ${quoteValidityDays} dagen geldig. Na akkoord plannen we samen de startdatum en exacte oplevermomenten.`,
    termsLine: TERMS_LINE,
    sourceQuoteId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const normalizeDocument = (document, existingDocuments = [], settings = {}) => {
  const fallback = createDefaultDocument(document?.kind || document?.type || 'quote', existingDocuments, settings);
  const normalized = {
    ...fallback,
    ...(document || {}),
    id: document?.id || fallback.id,
    kind: document?.kind || document?.type || fallback.kind,
    status: document?.status || fallback.status,
    number: document?.number || fallback.number,
    customerId: document?.customerId || document?.customer_id || '',
    customerName: document?.customerName || document?.customer_name || '',
    companyName: document?.companyName || document?.company_name || '',
    customerEmail: document?.customerEmail || '',
    customerPhone: document?.customerPhone || '',
    customerAddress: document?.customerAddress || '',
    customerPostalCode: document?.customerPostalCode || '',
    customerCity: document?.customerCity || '',
    customerVatNumber: document?.customerVatNumber || '',
    items: Array.isArray(document?.items) && document.items.length ? document.items : fallback.items,
    discountType: document?.discountType === 'percent' ? 'percent' : 'amount',
    discountValue: document?.discountValue ?? 0,
    discountLabel: document?.discountLabel || 'Korting',
    termsLine: document?.termsLine || TERMS_LINE,
    updatedAt: new Date().toISOString(),
  };

  return normalized;
};

const toDatabaseRow = (document, userId) => {
  const totals = calculateTotals(document);
  return {
    id: document.id,
    type: document.kind,
    status: document.status,
    number: document.number,
    customer_id: document.customerId || null,
    customer_name: document.customerName,
    company_name: document.companyName,
    total_ex_vat: totals.subtotal,
    vat_total: totals.vat,
    total_inc_vat: totals.total,
    due_date: document.kind === 'invoice' ? document.dueDate : null,
    issue_date: document.issueDate || todayISO(),
    document_json: document,
    created_by: userId || null,
    updated_at: new Date().toISOString(),
  };
};

const fromDatabaseRow = (row) => normalizeDocument({
  ...(row.document_json || {}),
  id: row.id,
  kind: row.document_json?.kind || row.type || 'quote',
  status: row.status || row.document_json?.status || 'concept',
  number: row.number || row.document_json?.number || '',
  customerId: row.customer_id || row.document_json?.customerId || '',
  customerName: row.customer_name || row.document_json?.customerName || '',
  companyName: row.company_name || row.document_json?.companyName || '',
  dueDate: row.document_json?.dueDate || row.due_date || '',
  issueDate: row.document_json?.issueDate || row.issue_date || todayISO(),
});

const Field = ({ label, children, hint }) => (
  <label className="block space-y-2">
    <span className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{label}</span>
    {children}
    {hint && <span className="block text-xs text-slate-500">{hint}</span>}
  </label>
);
const inputClass = 'w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20';
const textareaClass = `${inputClass} min-h-[110px] resize-y`;

const QuotesInvoicesPage = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();
  const editorRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(() => createDefaultDocument('quote'));
  const [loading, setLoading] = useState(true);
  const [storageMode, setStorageMode] = useState('local');

  const company = useMemo(() => ({
    name: settings.site_name || FALLBACK_COMPANY.name,
    address: settings.address_street || FALLBACK_COMPANY.address,
    city: settings.address_city || FALLBACK_COMPANY.city,
    postalCode: settings.address_postal_code || FALLBACK_COMPANY.postalCode,
    iban: settings.iban || FALLBACK_COMPANY.iban,
    kvk: settings.kvk || FALLBACK_COMPANY.kvk,
    website: settings.website || FALLBACK_COMPANY.website,
    email: settings.contact_email || FALLBACK_COMPANY.email,
    phone: settings.contact_phone || FALLBACK_COMPANY.phone,
    logo: settings.logo_url || settings.logo || FALLBACK_COMPANY.logo,
  }), [settings]);

  const totals = useMemo(() => calculateTotals(currentDocument), [currentDocument]);
  const selectedService = getService(currentDocument.workType);
  const selectedPackage = getPackage(selectedService, currentDocument.packageName);
  const kindLabel = currentDocument.kind === 'invoice' ? 'Factuur' : 'Offerte';
  const customerDisplay = currentDocument.companyName || currentDocument.customerName || 'Nieuwe klant';

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      const requestedKind = searchParams.get('type') === 'invoice' ? 'invoice' : 'quote';
      const requestedDocumentId = searchParams.get('documentId');
      const localDocs = readLocalDocuments().map((document) => normalizeDocument(document, [], settings));
      const localCustomers = readLocalCustomers();

      const pickInitialDocument = (availableDocs) => {
        const requestedDocument = requestedDocumentId ? availableDocs.find((doc) => doc.id === requestedDocumentId) : null;
        if (requestedDocument) return normalizeDocument(requestedDocument, availableDocs, settings);
        const draftDocument = readDraftDocument();
        if (draftDocument?.id) return normalizeDocument(draftDocument, availableDocs, settings);
        return createDefaultDocument(requestedKind, availableDocs, settings);
      };

      if (!isSupabaseConfigured) {
        if (active) {
          setDocuments(localDocs);
          setCustomers(localCustomers);
          setStorageMode('local');
          setCurrentDocument(pickInitialDocument(localDocs));
          setLoading(false);
        }
        return;
      }

      try {
        const [documentsRes, customersRes] = await Promise.all([
          supabase.from('business_documents').select('*').order('updated_at', { ascending: false }).limit(200),
          supabase.from('customers').select('*').order('company_name', { ascending: true }),
        ]);
        if (documentsRes.error) throw documentsRes.error;
        const dbDocs = (documentsRes.data || []).map(fromDatabaseRow).map((document) => normalizeDocument(document, [], settings));
        const dbCustomers = customersRes.error ? localCustomers : (customersRes.data || []);
        const availableDocs = dbDocs.length ? dbDocs : localDocs;
        if (active) {
          setDocuments(availableDocs);
          setCustomers(dbCustomers);
          setStorageMode('supabase');
          setCurrentDocument(pickInitialDocument(availableDocs));
        }
      } catch (error) {
        if (active) {
          setDocuments(localDocs);
          setCustomers(localCustomers);
          setStorageMode('local');
          setCurrentDocument(pickInitialDocument(localDocs));
          toast({ variant: 'destructive', title: 'Documenten lokaal geladen', description: 'Controleer of de Supabase migraties zijn uitgevoerd.' });
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadData();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loading) writeDraftDocument(currentDocument);
  }, [currentDocument, loading]);

  useEffect(() => {
    if (loading) return undefined;
    const persistDraft = () => writeDraftDocument(currentDocument);
    const persistWhenHidden = () => { if (document.visibilityState === 'hidden') persistDraft(); };
    window.addEventListener('pagehide', persistDraft);
    document.addEventListener('visibilitychange', persistWhenHidden);
    return () => {
      persistDraft();
      window.removeEventListener('pagehide', persistDraft);
      document.removeEventListener('visibilitychange', persistWhenHidden);
    };
  }, [currentDocument, loading]);

  useEffect(() => {
    const customerId = searchParams.get('customerId');
    if (customerId && customers.length > 0) {
      const customer = customers.find((item) => item.id === customerId);
      if (customer) applyCustomer(customer);
    }
  }, [customers, searchParams]);

  const updateDocument = (field, value) => setCurrentDocument((previous) => ({ ...previous, [field]: value, updatedAt: new Date().toISOString() }));
  const updateServicePreset = (serviceTitle, packageName) => {
    const service = getService(serviceTitle);
    const pkg = getPackage(service, packageName);
    setCurrentDocument((previous) => ({ ...previous, workType: service.title, packageName: pkg.name, updatedAt: new Date().toISOString() }));
  };
  const updateLineItem = (itemId, field, value) => setCurrentDocument((previous) => ({ ...previous, items: previous.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)), updatedAt: new Date().toISOString() }));
  const addLineItem = () => setCurrentDocument((previous) => ({ ...previous, items: [...previous.items, { id: createId(), description: 'Extra werkzaamheden', quantity: 1, unitPrice: 0, vatRate: settings.default_vat_rate ?? 21 }], updatedAt: new Date().toISOString() }));
  const addSelectedPackage = () => {
    const service = getService(currentDocument.workType);
    const pkg = getPackage(service, currentDocument.packageName);
    const item = { id: createId(), description: buildWorkDescription(service, pkg), quantity: 1, unitPrice: pkg.price, vatRate: settings.default_vat_rate ?? 21 };
    setCurrentDocument((previous) => ({ ...previous, items: [...previous.items, item], updatedAt: new Date().toISOString() }));
    toast({ title: 'Pakket toegevoegd', description: `${service.title} ${pkg.name} staat nu als extra regel in de offerte.` });
  };
  const replaceFirstLineWithPackage = () => {
    const service = getService(currentDocument.workType);
    const pkg = getPackage(service, currentDocument.packageName);
    setCurrentDocument((previous) => ({
      ...previous,
      items: previous.items.map((item, index) => index === 0 ? { ...item, description: buildWorkDescription(service, pkg), quantity: 1, unitPrice: pkg.price, vatRate: settings.default_vat_rate ?? item.vatRate ?? 21 } : item),
      updatedAt: new Date().toISOString(),
    }));
  };
  const removeLineItem = (itemId) => setCurrentDocument((previous) => ({ ...previous, items: previous.items.length === 1 ? previous.items : previous.items.filter((item) => item.id !== itemId), updatedAt: new Date().toISOString() }));

  const applyCustomer = (customer) => setCurrentDocument((previous) => ({
    ...previous,
    customerId: customer.id,
    customerName: customer.name || '',
    companyName: customer.company_name || '',
    customerEmail: customer.email || '',
    customerPhone: customer.phone || '',
    customerAddress: customer.address || '',
    customerPostalCode: customer.postal_code || '',
    customerCity: customer.city || '',
    customerVatNumber: customer.vat_number || '',
    updatedAt: new Date().toISOString(),
  }));

  const persistLocal = (documentToSave) => {
    const existing = readLocalDocuments();
    const next = [documentToSave, ...existing.filter((document) => document.id !== documentToSave.id)];
    writeLocalDocuments(next);
    setDocuments(next);
  };

  const saveDocument = async () => {
    const documentToSave = normalizeDocument({ ...currentDocument, updatedAt: new Date().toISOString() }, documents, settings);
    setCurrentDocument(documentToSave);
    writeDraftDocument(documentToSave);

    if (storageMode === 'supabase' && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('business_documents').upsert(toDatabaseRow(documentToSave, user?.id)).select('*').single();
        if (error) throw error;
        const savedDocument = normalizeDocument(fromDatabaseRow(data), documents, settings);
        setCurrentDocument(savedDocument);
        writeDraftDocument(savedDocument);
        setDocuments((previous) => [savedDocument, ...previous.filter((document) => document.id !== savedDocument.id)]);
        toast({ title: `${kindLabel} bijgewerkt`, description: `${savedDocument.number} is opgeslagen.` });
        return;
      } catch (error) {
        setStorageMode('local');
        toast({ variant: 'destructive', title: 'Supabase opslag mislukt', description: 'Document is tijdelijk lokaal opgeslagen.' });
      }
    }

    persistLocal(documentToSave);
    toast({ title: `${kindLabel} lokaal bijgewerkt`, description: `${documentToSave.number} is opgeslagen in deze browser.` });
  };

  const createNewDocument = (kind) => {
    const nextDocument = createDefaultDocument(kind, documents, settings);
    setCurrentDocument(nextDocument);
    writeDraftDocument(nextDocument);
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const loadDocument = (documentToOpen) => {
    const nextDocument = normalizeDocument(documentToOpen, documents, settings);
    setCurrentDocument(nextDocument);
    writeDraftDocument(nextDocument);
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast({ title: `${nextDocument.kind === 'invoice' ? 'Factuur' : 'Offerte'} geopend`, description: `${nextDocument.number} staat klaar om te bewerken.` });
  };
  const duplicateDocument = () => {
    const duplicate = { ...normalizeDocument(currentDocument, documents, settings), id: createId(), number: nextDocumentNumber(currentDocument.kind, documents), status: 'concept', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setCurrentDocument(duplicate);
    writeDraftDocument(duplicate);
    toast({ title: 'Kopie gemaakt', description: 'Je kunt deze kopie aanpassen en opslaan.' });
  };
  const convertQuoteToInvoice = () => {
    if (currentDocument.kind !== 'quote') return;
    const base = normalizeDocument(currentDocument, documents, settings);
    const invoice = {
      ...base,
      id: createId(),
      kind: 'invoice',
      status: 'concept',
      number: nextDocumentNumber('invoice', documents),
      title: base.title.replace(/offerte/i, 'Factuur') || 'Factuur website werkzaamheden',
      intro: 'Bedankt voor de samenwerking. Hieronder vind je de factuur op basis van de akkoord gegeven offerte.',
      dueDate: addDays(todayISO(), base.paymentTermDays || settings.default_payment_term_days || 14),
      issueDate: todayISO(),
      sourceQuoteId: base.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentDocument(invoice);
    writeDraftDocument(invoice);
    toast({ title: 'Factuur aangemaakt', description: `${invoice.number} is gevuld op basis van ${base.number}.` });
  };
  const deleteDocument = async (documentId) => {
    const next = documents.filter((document) => document.id !== documentId);
    setDocuments(next);
    writeLocalDocuments(next);
    if (storageMode === 'supabase' && isSupabaseConfigured) await supabase.from('business_documents').delete().eq('id', documentId);
    if (currentDocument.id === documentId) createNewDocument('quote');
    toast({ title: 'Document verwijderd' });
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(normalizeDocument(currentDocument, documents, settings), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentDocument.number || 'document'}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Offertes & facturen - Vos Admin</title>
        <style>{`@media print { body * { visibility: hidden !important; } .document-print-area, .document-print-area * { visibility: visible !important; } .document-print-area { position: absolute !important; inset: 0 !important; width: 100% !important; min-height: auto !important; margin: 0 !important; box-shadow: none !important; border: 0 !important; border-radius: 0 !important; } .no-print { display: none !important; } @page { size: A4; margin: 12mm; } }`}</style>
      </Helmet>

      <div className="space-y-8" ref={editorRef}>
        <header className="no-print flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#38bdf8]">Vos Admin</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-.04em] text-white md:text-5xl">Offertes & facturen</h1>
            <p className="mt-3 max-w-2xl text-slate-400">Open bestaande offertes, pas ze aan, voeg meerdere pakketten toe en sla wijzigingen op hetzelfde document op.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => createNewDocument('quote')} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10"><FileText size={16} /> Nieuwe offerte</Button>
            <Button onClick={() => createNewDocument('invoice')} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10"><ReceiptText size={16} /> Nieuwe factuur</Button>
            <Button onClick={saveDocument} className="gap-2 bg-[#38bdf8] text-black hover:bg-[#0ea5e9]"><Save size={16} /> Wijzigingen opslaan</Button>
          </div>
        </header>

        <div className="no-print grid gap-4 md:grid-cols-4">
          <SummaryCard label="Actief document" value={currentDocument.number || 'Nieuw'} hint={currentDocument.id ? 'Dit document bewerk je nu.' : ''} accent />
          <SummaryCard label="Type" value={kindLabel} />
          <SummaryCard label="Totaal incl. btw" value={currency.format(totals.total)} />
          <SummaryCard label="Korting" value={totals.discount > 0 ? currency.format(totals.discount) : 'Geen'} hint={currentDocument.discountType === 'percent' && parseMoney(currentDocument.discountValue) > 0 ? `${currentDocument.discountValue}% korting` : ''} />
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_520px]">
          <div className="no-print space-y-6">
            <Card className="border-white/10 bg-[#111827]">
              <CardHeader><CardTitle className="text-white">Documentgegevens</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label="Soort document"><select className={inputClass} value={currentDocument.kind} onChange={(e) => createNewDocument(e.target.value)}><option value="quote">Offerte</option><option value="invoice">Factuur</option></select></Field>
                <Field label="Status"><select className={inputClass} value={currentDocument.status} onChange={(e) => updateDocument('status', e.target.value)}>{Object.entries(statusLabelsFor(currentDocument.kind)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
                <Field label="Nummer"><input className={inputClass} value={currentDocument.number} onChange={(e) => updateDocument('number', e.target.value)} /></Field>
                <Field label="Datum"><input type="date" className={inputClass} value={currentDocument.issueDate} onChange={(e) => updateDocument('issueDate', e.target.value)} /></Field>
                {currentDocument.kind === 'quote' ? <Field label="Geldig tot"><input type="date" className={inputClass} value={currentDocument.validUntil} onChange={(e) => updateDocument('validUntil', e.target.value)} /></Field> : <Field label="Betalingstermijn"><select className={inputClass} value={currentDocument.paymentTermDays} onChange={(e) => { const days = Number(e.target.value); setCurrentDocument((prev) => ({ ...prev, paymentTermDays: days, dueDate: addDays(prev.issueDate, days) })); }}>{PAYMENT_TERMS.map((days) => <option key={days} value={days}>{days} dagen</option>)}</select></Field>}
                {currentDocument.kind === 'invoice' && <Field label="Vervaldatum"><input type="date" className={inputClass} value={currentDocument.dueDate} onChange={(e) => updateDocument('dueDate', e.target.value)} /></Field>}
                <div className="md:col-span-2"><Field label="Titel"><input className={inputClass} value={currentDocument.title} onChange={(e) => updateDocument('title', e.target.value)} /></Field></div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#111827]">
              <CardHeader><CardTitle className="text-white">Klantgegevens</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2"><Field label="Bestaande klant kiezen" hint="Kies een klant om gegevens automatisch te vullen."><select className={inputClass} value={currentDocument.customerId || ''} onChange={(e) => { const customer = customers.find((item) => item.id === e.target.value); if (customer) applyCustomer(customer); else updateDocument('customerId', ''); }}><option value="">Geen klant geselecteerd</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.company_name || customer.name} {customer.email ? `• ${customer.email}` : ''}</option>)}</select></Field></div>
                <Field label="Naam klant"><input className={inputClass} value={currentDocument.customerName} onChange={(e) => updateDocument('customerName', e.target.value)} /></Field>
                <Field label="Bedrijf"><input className={inputClass} value={currentDocument.companyName} onChange={(e) => updateDocument('companyName', e.target.value)} /></Field>
                <Field label="E-mail"><input type="email" className={inputClass} value={currentDocument.customerEmail} onChange={(e) => updateDocument('customerEmail', e.target.value)} /></Field>
                <Field label="Telefoon"><input className={inputClass} value={currentDocument.customerPhone} onChange={(e) => updateDocument('customerPhone', e.target.value)} /></Field>
                <Field label="Adres"><input className={inputClass} value={currentDocument.customerAddress} onChange={(e) => updateDocument('customerAddress', e.target.value)} /></Field>
                <Field label="Postcode"><input className={inputClass} value={currentDocument.customerPostalCode} onChange={(e) => updateDocument('customerPostalCode', e.target.value)} /></Field>
                <Field label="Plaats"><input className={inputClass} value={currentDocument.customerCity} onChange={(e) => updateDocument('customerCity', e.target.value)} /></Field>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#111827]">
              <CardHeader><CardTitle className="text-white">Pakketten toevoegen</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Type werkzaamheden"><select className={inputClass} value={currentDocument.workType} onChange={(e) => updateServicePreset(e.target.value, getService(e.target.value).packages[0].name)}>{SERVICE_CATALOG.map((service) => <option key={service.title} value={service.title}>{service.title}</option>)}</select></Field>
                  <Field label="Pakket"><select className={inputClass} value={currentDocument.packageName} onChange={(e) => updateServicePreset(currentDocument.workType, e.target.value)}>{selectedService.packages.map((pkg) => <option key={pkg.name} value={pkg.name}>{pkg.name} - {currency.format(pkg.price)} {pkg.recurring || ''}</option>)}</select></Field>
                </div>
                <div className="rounded-2xl border border-[#38bdf8]/20 bg-[#38bdf8]/10 p-4 text-sm leading-7 text-slate-200"><strong className="text-white">Gekozen pakket:</strong> {selectedService.title} {selectedPackage.name} - {currency.format(selectedPackage.price)} {selectedPackage.recurring || ''}</div>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" onClick={addSelectedPackage} className="gap-2 bg-[#38bdf8] text-black hover:bg-[#0ea5e9]"><Plus size={16} /> Pakket toevoegen</Button>
                  <Button type="button" onClick={replaceFirstLineWithPackage} variant="outline" className="border-white/10 text-white hover:bg-white/10">Eerste regel vervangen</Button>
                </div>
                <Field label="Intro / omschrijving"><textarea className={textareaClass} value={currentDocument.intro} onChange={(e) => updateDocument('intro', e.target.value)} /></Field>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#111827]">
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-white">Kostenregels</CardTitle><Button type="button" onClick={addLineItem} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10"><Plus size={16} /> Handmatige regel</Button></CardHeader>
              <CardContent className="space-y-4">
                {currentDocument.items.map((item, index) => <div key={item.id} className="rounded-3xl border border-white/10 bg-black/20 p-4"><div className="mb-4 flex items-center justify-between gap-4"><p className="font-black text-white">Regel {index + 1}</p><Button type="button" onClick={() => removeLineItem(item.id)} variant="ghost" className="text-red-300 hover:bg-red-500/10 hover:text-red-200"><Trash2 size={16} /></Button></div><div className="grid gap-4 md:grid-cols-[1.3fr_.45fr_.55fr_.45fr]"><Field label="Omschrijving"><textarea className={`${textareaClass} min-h-[92px]`} value={item.description} onChange={(e) => updateLineItem(item.id, 'description', e.target.value)} /></Field><Field label="Aantal"><input type="number" min="0" step="0.01" className={inputClass} value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)} /></Field><Field label="Prijs excl."><input type="number" min="0" step="0.01" className={inputClass} value={item.unitPrice} onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)} /></Field><Field label="Btw"><select className={inputClass} value={item.vatRate} onChange={(e) => updateLineItem(item.id, 'vatRate', e.target.value)}>{VAT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field></div><p className="mt-4 text-right text-sm text-slate-400">Regeltotaal incl. btw: <span className="font-black text-white">{currency.format(getLineTotal(item) + getLineVat(item))}</span></p></div>)}

                <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <div className="mb-4"><p className="font-black text-white">Korting</p><p className="mt-1 text-sm text-amber-100/80">Korting wordt toegepast op het totaal inclusief btw.</p></div>
                  <div className="grid gap-4 md:grid-cols-[1fr_.45fr_.55fr]">
                    <Field label="Label"><input className={inputClass} value={currentDocument.discountLabel || 'Korting'} onChange={(e) => updateDocument('discountLabel', e.target.value)} /></Field>
                    <Field label="Soort"><select className={inputClass} value={currentDocument.discountType || 'amount'} onChange={(e) => updateDocument('discountType', e.target.value)}><option value="amount">Bedrag €</option><option value="percent">Percentage %</option></select></Field>
                    <Field label="Waarde"><input type="number" min="0" step="0.01" className={inputClass} value={currentDocument.discountValue ?? 0} onChange={(e) => updateDocument('discountValue', e.target.value)} /></Field>
                  </div>
                  <p className="mt-4 text-right text-sm text-slate-300">Korting: <span className="font-black text-amber-100">-{currency.format(totals.discount)}</span></p>
                </div>

                <Field label="Opmerkingen / betaalgegevens"><textarea className={textareaClass} value={currentDocument.notes} onChange={(e) => updateDocument('notes', e.target.value)} /></Field>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="no-print border-white/10 bg-[#111827]"><CardHeader><CardTitle className="text-white">Acties</CardTitle></CardHeader><CardContent className="grid gap-3">
              <Button onClick={saveDocument} className="gap-2 bg-[#38bdf8] text-black hover:bg-[#0ea5e9]"><Save size={16} /> Wijzigingen opslaan</Button>
              {currentDocument.kind === 'quote' && <Button onClick={convertQuoteToInvoice} variant="outline" className="gap-2 border-emerald-400/30 text-emerald-100 hover:bg-emerald-400/10"><ReceiptText size={16} /> Maak factuur van offerte</Button>}
              <Button onClick={() => window.print()} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10"><Printer size={16} /> Print / opslaan als PDF</Button>
              <Button onClick={duplicateDocument} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10"><Copy size={16} /> Kopiëren</Button>
              <Button onClick={exportJson} variant="ghost" className="gap-2 text-slate-300 hover:bg-white/10 hover:text-white"><Download size={16} /> JSON export</Button>
            </CardContent></Card>

            <Card className="no-print border-white/10 bg-[#111827]"><CardHeader><CardTitle className="text-white">Opgeslagen documenten</CardTitle></CardHeader><CardContent className="space-y-3 max-h-[520px] overflow-y-auto">
              {loading && <p className="text-sm text-slate-500">Documenten laden...</p>}
              {!loading && documents.length === 0 && <p className="text-sm text-slate-500">Nog niets opgeslagen.</p>}
              {documents.map((documentItem) => {
                const active = documentItem.id === currentDocument.id;
                return (
                  <div key={documentItem.id} className={`rounded-2xl border p-4 ${active ? 'border-[#38bdf8]/60 bg-[#38bdf8]/10' : 'border-white/10 bg-black/20'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-black text-white">{documentItem.number}</p>
                        <p className="mt-1 text-sm text-slate-400">{documentItem.kind === 'invoice' ? 'Factuur' : 'Offerte'} • {documentItem.companyName || documentItem.customerName || 'Geen klantnaam'}</p>
                        <p className="mt-1 text-xs text-slate-500">{statusLabelsFor(documentItem.kind)[documentItem.status] || documentItem.status} • {formatDate(documentItem.updatedAt?.slice?.(0, 10) || documentItem.issueDate)}</p>
                        {active && <p className="mt-2 text-xs font-black uppercase tracking-[.16em] text-[#38bdf8]">Nu geopend</p>}
                      </div>
                      <button type="button" onClick={() => deleteDocument(documentItem.id)} className="rounded-xl p-2 text-red-300 hover:bg-red-500/10"><Trash2 size={15} /></button>
                    </div>
                    <Button type="button" onClick={() => loadDocument(documentItem)} className="mt-4 w-full bg-white text-slate-950 hover:bg-slate-200">Openen / bewerken</Button>
                  </div>
                );
              })}
            </CardContent></Card>

            <DocumentPreview company={company} document={currentDocument} totals={totals} kindLabel={kindLabel} customerDisplay={customerDisplay} />
          </aside>
        </div>
      </div>
    </>
  );
};

const SummaryCard = ({ label, value, hint, accent }) => <Card className="border-white/10 bg-[#111827]"><CardContent className="p-5"><p className="text-xs font-black uppercase tracking-[.18em] text-slate-500">{label}</p><p className={`mt-2 text-2xl font-black ${accent ? 'text-[#38bdf8]' : 'text-white'}`}>{value}</p>{hint && <p className="mt-1 text-xs text-amber-200">{hint}</p>}</CardContent></Card>;

const DocumentPreview = ({ company, document, totals, kindLabel, customerDisplay }) => (
  <article className="document-print-area overflow-hidden rounded-[2rem] border border-white/10 bg-white text-slate-950 shadow-2xl">
    <div className="bg-slate-950 p-8 text-white">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          {company.logo && <img src={company.logo} alt="Vos Web Designs logo" className="h-14 w-14 rounded-2xl bg-white object-contain p-1" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
          <div><p className="text-xs font-black uppercase tracking-[.24em] text-[#38bdf8]">{company.name}</p><h2 className="mt-4 text-4xl font-black tracking-[-.05em]">{kindLabel}</h2><p className="mt-2 text-slate-300">{document.title}</p></div>
        </div>
        <div className="text-right text-sm text-slate-300"><p className="font-black text-white">{document.number}</p><p>Datum: {formatDate(document.issueDate)}</p>{document.kind === 'quote' ? <p>Geldig tot: {formatDate(document.validUntil)}</p> : <p>Vervaldatum: {formatDate(document.dueDate)}</p>}<p>Status: {statusLabelsFor(document.kind)[document.status] || document.status}</p></div>
      </div>
    </div>
    <div className="space-y-8 p-8">
      <section className="grid gap-6 border-b border-slate-200 pb-6 sm:grid-cols-2"><div><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Van</p><p className="mt-2 font-black">{company.name}</p><p>{company.address}</p><p>{[company.postalCode, company.city].filter(Boolean).join(' ')}</p><p>KVK: {company.kvk}</p><p>{company.website}</p><p>{company.email}</p></div><div><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Voor</p><p className="mt-2 font-black">{customerDisplay}</p>{document.customerName && document.companyName && <p>T.a.v. {document.customerName}</p>}{document.customerAddress && <p>{document.customerAddress}</p>}{(document.customerPostalCode || document.customerCity) && <p>{[document.customerPostalCode, document.customerCity].filter(Boolean).join(' ')}</p>}{document.customerEmail && <p>{document.customerEmail}</p>}{document.customerPhone && <p>{document.customerPhone}</p>}{document.customerVatNumber && <p>BTW: {document.customerVatNumber}</p>}</div></section>
      <section><p className="leading-7 text-slate-700">{document.intro}</p></section>
      <section className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-slate-100 text-xs uppercase tracking-[.12em] text-slate-500"><tr><th className="p-4">Werkzaamheden</th><th className="p-4 text-right">Aantal</th><th className="p-4 text-right">Prijs excl.</th><th className="p-4 text-right">Btw</th><th className="p-4 text-right">Totaal</th></tr></thead><tbody>{document.items.map((item) => <tr key={item.id} className="border-t border-slate-200 align-top"><td className="p-4 font-medium leading-6">{item.description}</td><td className="p-4 text-right">{item.quantity}</td><td className="p-4 text-right">{currency.format(parseMoney(item.unitPrice))}</td><td className="p-4 text-right">{item.vatRate === 'exempt' ? 'Vrijgesteld' : `${parseMoney(item.vatRate)}%`}</td><td className="p-4 text-right font-black">{currency.format(getLineTotal(item) + getLineVat(item))}</td></tr>)}</tbody></table></section>
      <section className="ml-auto max-w-sm space-y-3 rounded-2xl bg-slate-100 p-5"><div className="flex justify-between gap-6 text-sm"><span>Subtotaal excl. btw</span><strong>{currency.format(totals.subtotal)}</strong></div><div className="flex justify-between gap-6 text-sm"><span>Btw</span><strong>{currency.format(totals.vat)}</strong></div>{totals.discount > 0 && <div className="flex justify-between gap-6 text-sm text-amber-700"><span>{document.discountLabel || 'Korting'}{document.discountType === 'percent' ? ` (${document.discountValue}%)` : ''}</span><strong>-{currency.format(totals.discount)}</strong></div>}<div className="border-t border-slate-300 pt-3 text-xl font-black"><div className="flex justify-between gap-6"><span>Totaal incl. btw</span><span>{currency.format(totals.total)}</span></div></div></section>
      {document.notes && <section className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Opmerking</p><p className="mt-3 whitespace-pre-line leading-7 text-slate-700">{document.notes}</p></section>}
      <p className="text-xs leading-6 text-slate-500">{document.termsLine || TERMS_LINE}</p>
    </div>
    <footer className="border-t border-slate-200 bg-slate-50 p-6 text-xs leading-6 text-slate-600"><div className="grid gap-3 sm:grid-cols-2"><p><strong>{company.name}</strong><br />{company.address}, {company.city}<br />KVK {company.kvk}</p><p className="sm:text-right">IBAN {company.iban}<br />{company.website}<br />{company.email}</p></div></footer>
  </article>
);

export default QuotesInvoicesPage;
