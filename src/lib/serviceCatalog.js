export const SERVICE_CATALOG_ID = 'main';
export const SERVICE_CATALOG_STORAGE_KEY = 'vwb2_admin_service_catalog';

export const DEFAULT_SERVICE_CATALOG = [
  {
    id: 'webdesign', title: 'Webdesign', shortDescription: 'Professioneel design voor starters & kleine bedrijven', description: 'Perfect voor ondernemers die nét beginnen en een sterke, betrouwbare online uitstraling willen zonder hoge instapkosten.', image: '/webde.png', icon: 'palette', highlightedPackageId: 'webdesign-growth', packages: [
      { id: 'webdesign-starter', name: 'Starter', price: 349, badge: 'Ideaal voor starters', discountType: 'amount', discountValue: 0, recurring: '', features: ['1–2 pagina’s', 'Modern & responsive design', 'Contactformulier', 'Basis SEO'] },
      { id: 'webdesign-growth', name: 'Groei', price: 649, badge: 'Beste balans', discountType: 'amount', discountValue: 0, recurring: '', features: ['Tot 5 pagina’s', 'Conversiegericht ontwerp', 'Subtiele animaties', 'SEO & performance basis'] },
      { id: 'webdesign-pro', name: 'Pro', price: 995, badge: 'Meest gekozen', discountType: 'amount', discountValue: 0, recurring: '', features: ['Volledig maatwerk design', 'Unieke branding look', 'Uitbreidbaar voor groei', 'Persoonlijke begeleiding'] },
    ],
  },
  {
    id: 'webontwikkeling', title: 'Webontwikkeling', shortDescription: 'Betrouwbare techniek zonder onnodige complexiteit', description: 'Voor websites en webapplicaties die stabiel moeten werken en later eenvoudig uit te breiden zijn.', image: '/webon.png', icon: 'code', highlightedPackageId: 'webontwikkeling-growth', packages: [
      { id: 'webontwikkeling-starter', name: 'Starter', price: 595, badge: 'Laagdrempelig', discountType: 'amount', discountValue: 0, recurring: '', features: ['Professionele website', 'Snelle laadtijden', 'Eenvoudig beheerbaar'] },
      { id: 'webontwikkeling-growth', name: 'Groei', price: 995, badge: 'Beste balans', discountType: 'amount', discountValue: 0, recurring: '', features: ['Uitgebreide pagina’s', 'Formulieren & koppelingen', 'Performance optimalisatie'] },
      { id: 'webontwikkeling-pro', name: 'Pro', price: 1495, badge: 'Maatwerk', discountType: 'amount', discountValue: 0, recurring: '', features: ['Custom functionaliteit', 'Database of login systeem', 'Doorontwikkelbaar platform'] },
    ],
  },
  {
    id: 'ecommerce', title: 'E-commerce', shortDescription: 'Start eenvoudig met online verkopen', description: 'Ideaal voor ondernemers die hun eerste webshop willen starten zonder direct grote investeringen.', image: '/ecom.png', icon: 'shopping-cart', highlightedPackageId: 'ecommerce-starter', packages: [
      { id: 'ecommerce-starter', name: 'Starter', price: 895, badge: 'Quick win', discountType: 'amount', discountValue: 0, recurring: '', features: ['Tot 10 producten', 'iDEAL betalingen', 'Gebruiksvriendelijk beheer'] },
      { id: 'ecommerce-growth', name: 'Groei', price: 1495, badge: 'Meest gekozen', discountType: 'amount', discountValue: 0, recurring: '', features: ['Onbeperkt producten', 'Kortingen & acties', 'Conversiegericht design'] },
      { id: 'ecommerce-pro', name: 'Pro', price: 2495, badge: 'Premium', discountType: 'amount', discountValue: 0, recurring: '', features: ['Maatwerk webshop', 'Automatiseringen', 'Analytics & optimalisatie'] },
    ],
  },
  {
    id: 'seo-marketing', title: 'SEO & Marketing', shortDescription: 'Gevonden worden in Google, stap voor stap', description: 'Geen dure contracten, maar duidelijke maandelijkse optimalisatie gericht op zichtbaarheid en groei.', image: '/seo.png', icon: 'search', highlightedPackageId: 'seo-marketing-starter', packages: [
      { id: 'seo-marketing-starter', name: 'Starter', price: 149, badge: 'Quick win', discountType: 'amount', discountValue: 0, recurring: '/ maand', features: ['Technische SEO check', 'Basis optimalisatie', 'Maandelijkse rapportage'] },
      { id: 'seo-marketing-growth', name: 'Groei', price: 299, badge: 'Beste balans', discountType: 'amount', discountValue: 0, recurring: '/ maand', features: ['Content optimalisatie', 'Lokale SEO', 'Actieplan per maand'] },
      { id: 'seo-marketing-pro', name: 'Pro', price: 499, badge: 'Structurele groei', discountType: 'amount', discountValue: 0, recurring: '/ maand', features: ['Concurrentie analyse', 'Doorlopende optimalisatie', 'Structurele groei'] },
    ],
  },
  {
    id: 'performance-optimalisatie', title: 'Performance Optimalisatie', shortDescription: 'Snelle winst voor je website', description: 'Een snellere website zorgt direct voor betere gebruikservaring en hogere conversies.', image: '/performance.png', icon: 'zap', highlightedPackageId: 'performance-optimalisatie-starter', packages: [
      { id: 'performance-optimalisatie-starter', name: 'Starter', price: 295, badge: 'Quick win', discountType: 'amount', discountValue: 0, recurring: '', features: ['Snelheidsanalyse', 'Afbeelding optimalisatie', 'Basis caching'] },
      { id: 'performance-optimalisatie-growth', name: 'Groei', price: 495, badge: 'Beste balans', discountType: 'amount', discountValue: 0, recurring: '', features: ['Core Web Vitals', 'Lazy loading', 'Code optimalisatie'] },
      { id: 'performance-optimalisatie-pro', name: 'Pro', price: 795, badge: 'Beste resultaat', discountType: 'amount', discountValue: 0, recurring: '', features: ['Geavanceerde optimalisatie', 'Monitoring', 'Advies voor groei'] },
    ],
  },
];

const formatter = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
const slugify = (value, fallback) => String(value || fallback || 'item').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' en ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || fallback;

export const cloneDefaultServiceCatalog = () => JSON.parse(JSON.stringify(DEFAULT_SERVICE_CATALOG));
export const parseMoney = (value) => Math.max(0, Number.isFinite(Number.parseFloat(String(value ?? '').replace(',', '.'))) ? Number.parseFloat(String(value ?? '').replace(',', '.')) : 0);

export const getPackageDiscount = (pkg = {}) => {
  const price = parseMoney(pkg.price);
  const raw = parseMoney(pkg.discountValue);
  if (!price || !raw) return 0;
  return pkg.discountType === 'percent' ? Math.min(price, price * (Math.min(raw, 100) / 100)) : Math.min(price, raw);
};
export const getPackageNetPrice = (pkg = {}) => Math.max(0, parseMoney(pkg.price) - getPackageDiscount(pkg));
export const formatPackagePrice = (value) => formatter.format(parseMoney(value)).replace(',00', '');

export const normalizeServiceCatalog = (value) => {
  const source = Array.isArray(value) && value.length ? value : cloneDefaultServiceCatalog();
  const defaults = cloneDefaultServiceCatalog();
  const usedServiceIds = new Set();
  return source.map((rawService, serviceIndex) => {
    const fallback = defaults[serviceIndex] || defaults[0];
    let serviceId = slugify(rawService?.id || rawService?.title, fallback.id);
    if (usedServiceIds.has(serviceId)) serviceId = `${serviceId}-${serviceIndex + 1}`;
    usedServiceIds.add(serviceId);
    const rawPackages = Array.isArray(rawService?.packages) && rawService.packages.length ? rawService.packages : fallback.packages;
    const usedPackageIds = new Set();
    const packages = rawPackages.map((rawPackage, packageIndex) => {
      const packageFallback = fallback.packages[packageIndex] || fallback.packages[0];
      let packageId = slugify(rawPackage?.id || `${serviceId}-${rawPackage?.name || packageFallback.name}`, `${serviceId}-package-${packageIndex + 1}`);
      if (!packageId.startsWith(`${serviceId}-`) && !rawPackage?.id) packageId = `${serviceId}-${packageId}`;
      if (usedPackageIds.has(packageId)) packageId = `${packageId}-${packageIndex + 1}`;
      usedPackageIds.add(packageId);
      const price = parseMoney(rawPackage?.price ?? packageFallback.price);
      const discountType = rawPackage?.discountType === 'percent' ? 'percent' : 'amount';
      const discountValue = discountType === 'percent' ? Math.min(parseMoney(rawPackage?.discountValue), 100) : Math.min(parseMoney(rawPackage?.discountValue), price);
      return { id: packageId, name: String(rawPackage?.name || packageFallback.name || `Pakket ${packageIndex + 1}`), price, badge: String(rawPackage?.badge || ''), discountType, discountValue, recurring: String(rawPackage?.recurring || ''), features: Array.isArray(rawPackage?.features) ? rawPackage.features.map(String).filter(Boolean) : packageFallback.features };
    });
    const highlighted = packages.some((pkg) => pkg.id === rawService?.highlightedPackageId) ? rawService.highlightedPackageId : (packages[1]?.id || packages[0].id);
    return { id: serviceId, title: String(rawService?.title || fallback.title), shortDescription: String(rawService?.shortDescription || rawService?.description || fallback.shortDescription), description: String(rawService?.description || fallback.description), image: String(rawService?.image || fallback.image), icon: String(rawService?.icon || fallback.icon), highlightedPackageId: highlighted, packages };
  });
};
