
import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import CookieBanner from '@/components/CookieBanner';
import ScrollToTop from '@/components/ScrollToTop';
import { capture } from '@/lib/sentryClient';

import PublicShell from '@/components/public/PublicShell';
import HomePage from '@/pages/HomePage';
import PortfolioPage from '@/pages/PortfolioPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import ServicesPage from '@/pages/ServicesPage';
import AboutPage from '@/pages/AboutPage';
import ProcessPage from '@/pages/ProcessPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';
import ConfirmedPage from '@/pages/newsletter/ConfirmedPage';
import UnsubscribedPage from '@/pages/newsletter/UnsubscribedPage';
import ForbiddenPage from '@/pages/ForbiddenPage';

// Admin Imports
import LoginPage from '@/pages/admin/LoginPage';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import ProjectsPage from '@/pages/admin/ProjectsPage';
import TestimonialsPage from '@/pages/admin/TestimonialsPage';
import CategoriesPage from '@/pages/admin/CategoriesPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import MfaVerifyPage from '@/pages/admin/MfaVerifyPage';
import NewsletterPage from '@/pages/admin/NewsletterPage';
import InboxPage from '@/pages/admin/InboxPage';



class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ADMIN_RENDER_ERROR', error, errorInfo);
    capture(error, { extra: errorInfo });
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return <AdminErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}

const AdminErrorFallback = ({ onRetry }) => (
  <div className="min-h-screen cinema-bg flex items-center justify-center px-4 text-white">
    <section className="panel cut max-w-xl p-8 text-center">
      <p className="text-sm font-black uppercase tracking-[.2em] text-[#38bdf8]">Vos Admin</p>
      <h1 className="mt-4 text-3xl font-black text-white">Er ging iets mis in het beheerpaneel.</h1>
      <p className="mt-4 text-gray-300">De publieke website blijft beschikbaar. Probeer het beheerpaneel opnieuw te laden.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-7 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] px-6 py-3 font-black text-black hover:opacity-90"
      >
        Opnieuw proberen
      </button>
    </section>
  </div>
);

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('APP_RENDER_ERROR', error, errorInfo);
    capture(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback fullPage />;
    }

    return this.props.children;
  }
}

class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.warn('SECTION_RENDER_ERROR', error, errorInfo);
    }
    capture(error, { extra: errorInfo });
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ fullPage = false }) => {
  const content = (
    <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
      <p className="text-sm font-black uppercase tracking-[.2em] text-[color:var(--accent2)]">Vos Web Designs</p>
      <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Er ging iets mis met het laden van deze sectie.</h1>
      <p className="mt-4 text-slate-300">De rest van de website blijft beschikbaar. Probeer de pagina te vernieuwen of neem contact op als dit blijft gebeuren.</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <a href="/" className="rounded-full border border-white/15 px-5 py-3 font-black text-white">Naar home</a>
        <a href="/contact" className="rounded-full bg-[color:var(--accent2)] px-5 py-3 font-black text-black">Contact opnemen</a>
      </div>
    </section>
  );

  if (!fullPage) return <div className="px-4 py-16">{content}</div>;

  return (
    <div className="min-h-screen min-h-[100svh] bg-[color:var(--bg)] px-4 py-24 text-[color:var(--ink)]">
      {content}
    </div>
  );
};

// Component to handle global SEO based on settings
const GlobalSEO = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const siteName = settings.site_name || 'Vos Web Designs';
  const description = settings.seo_meta_description || settings.site_description || 'Professioneel webdesign';
  const siteUrl = (import.meta.env.NEXT_PUBLIC_SITE_URL || import.meta.env.VITE_SITE_URL || 'https://voswebdesigns.nl').replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${location.pathname === '/' ? '/' : location.pathname}`;
  const ogImage = toAbsoluteUrl(settings.og_image || '/logo.jpeg', siteUrl);
  const sameAs = [
    settings.social_instagram,
    settings.social_linkedin,
    settings.social_facebook,
    settings.social_twitter,
    settings.social_tiktok,
    settings.social_youtube,
  ].filter(Boolean);
  const schema = [
    pruneSchema({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: siteName,
      url: siteUrl,
      image: ogImage,
      email: settings.contact_email || undefined,
      telephone: settings.contact_phone || undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address_street || undefined,
        addressLocality: settings.address_city || undefined,
        postalCode: settings.address_postal_code || undefined,
        addressCountry: settings.address_country || 'NL',
      },
      sameAs: sameAs.length ? sameAs : undefined,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    },
    pruneSchema({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: siteName,
      url: canonicalUrl,
      description,
    }),
  ];

  return (
    <Helmet>
      <title>{siteName}</title>
      <meta name="description" content={description} />
      {settings.seo_keywords && <meta name="keywords" content={settings.seo_keywords} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteName} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

const toAbsoluteUrl = (value, siteUrl) => {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
};

const pruneSchema = (value) => {
  if (Array.isArray(value)) {
    return value.map(pruneSchema).filter((item) => item !== undefined);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, entry]) => [key, pruneSchema(entry)])
        .filter(([, entry]) => entry !== undefined && !(Array.isArray(entry) && entry.length === 0))
    );
  }

  return value === '' ? undefined : value;
};

function App() {
  return (
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  );
}

const PublicPageLayout = ({ children }) => (
  <PublicShell>{children}</PublicShell>
);

const RouteErrorBoundary = ({ children }) => {
  const location = useLocation();
  return <SectionErrorBoundary resetKey={location.pathname}>{children}</SectionErrorBoundary>;
};


const AdminRouteErrorBoundary = ({ children }) => {
  const location = useLocation();
  return <AdminErrorBoundary resetKey={location.pathname}>{children}</AdminErrorBoundary>;
};

const RootLayout = () => (
  <AuthProvider>
    <SettingsProvider>
      <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--ink)] flex flex-col">
        <GlobalSEO />
        <ScrollToTop />
        <RouteErrorBoundary>
          <Outlet />
        </RouteErrorBoundary>
        <CookieBanner />
        <Toaster />
      </div>
    </SettingsProvider>
  </AuthProvider>
);

const routes = createRoutesFromElements(
  <Route path="/" element={<RootLayout />}>
    <Route index element={<PublicPageLayout><HomePage /></PublicPageLayout>} />
    <Route path="portfolio" element={<PublicPageLayout><PortfolioPage /></PublicPageLayout>} />
    <Route path="portfolio/:projectId" element={<PublicPageLayout><ProjectDetailPage /></PublicPageLayout>} />
    <Route path="diensten" element={<PublicPageLayout><ServicesPage /></PublicPageLayout>} />
    <Route path="over-ons" element={<PublicPageLayout><AboutPage /></PublicPageLayout>} />
    <Route path="werkwijze" element={<PublicPageLayout><ProcessPage /></PublicPageLayout>} />
    <Route path="contact" element={<PublicPageLayout><ContactPage /></PublicPageLayout>} />
    <Route path="offerte" element={<Navigate to="/contact" replace />} />
    <Route path="privacy" element={<PublicPageLayout><PrivacyPolicyPage /></PublicPageLayout>} />
    <Route path="voorwaarden" element={<PublicPageLayout><TermsPage /></PublicPageLayout>} />
    <Route path="newsletter/confirmed" element={<PublicPageLayout><ConfirmedPage /></PublicPageLayout>} />
    <Route path="newsletter/unsubscribed" element={<PublicPageLayout><UnsubscribedPage /></PublicPageLayout>} />
    <Route path="login" element={<LoginPage />} />
    <Route path="forbidden" element={<PublicPageLayout><ForbiddenPage /></PublicPageLayout>} />
    <Route path="admin/login" element={<LoginPage />} />
    <Route path="admin/verify" element={<AdminRouteErrorBoundary><MfaVerifyPage /></AdminRouteErrorBoundary>} />

    <Route path="admin" element={<AdminRouteErrorBoundary><AdminLayout /></AdminRouteErrorBoundary>}>
      <Route index element={<DashboardPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="inbox" element={<InboxPage />} />
      <Route path="testimonials" element={<TestimonialsPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="newsletter" element={<NewsletterPage />} />
    </Route>

    <Route path="*" element={<PublicPageLayout><NotFoundPage /></PublicPageLayout>} />
  </Route>
);

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export default App;
