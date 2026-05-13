
import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
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
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen min-h-[100svh] bg-[color:var(--bg)] text-[color:var(--ink)]">
          <header className="fixed left-0 right-0 top-0 z-50 bg-[#0f172a]/95 shadow-lg">
            <nav className="container mx-auto flex items-center justify-between px-4 py-4">
              <a href="/" className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-2xl font-bold text-transparent">Vos Web Designs</a>
              <a href="/contact" className="hidden rounded-md bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] px-4 py-2 font-medium text-black sm:inline-flex">Plan een Gesprek</a>
            </nav>
          </header>
          <main className="flex min-h-screen min-h-[100svh] items-center justify-center px-4 pt-24">
            <section className="mx-auto max-w-4xl text-center">
              <p className="mb-6 inline-block rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-2 text-sm font-medium text-[#38bdf8]">Professioneel Webdesign Bureau</p>
              <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">Websites Die Uw <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">Bedrijf Laten Groeien</span></h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">Wij ontwikkelen luxe, conversie-gerichte websites voor ambitieuze bedrijven in Nederland.</p>
              <a href="/contact" className="inline-flex rounded-md bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] px-8 py-4 text-lg font-medium text-black">Plan een Gesprek</a>
            </section>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component to handle global SEO based on settings
const GlobalSEO = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const siteName = settings.site_name || 'Vos Web Designs';
  const description = settings.seo_meta_description || settings.site_description || 'Professioneel webdesign';
  const siteUrl = (import.meta.env.NEXT_PUBLIC_SITE_URL || import.meta.env.VITE_SITE_URL || 'https://voswebdesigns.nl').replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${location.pathname === '/' ? '/' : location.pathname}`;
  const ogImage = settings.og_image || `${siteUrl}/logo.jpeg`;

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
    </Helmet>
  );
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

const RootLayout = () => (
  <AuthProvider>
    <SettingsProvider>
      <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--ink)] flex flex-col">
        <GlobalSEO />
        <Outlet />
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
    <Route path="privacy" element={<PublicPageLayout><PrivacyPolicyPage /></PublicPageLayout>} />
    <Route path="voorwaarden" element={<PublicPageLayout><TermsPage /></PublicPageLayout>} />
    <Route path="newsletter/confirmed" element={<PublicPageLayout><ConfirmedPage /></PublicPageLayout>} />
    <Route path="newsletter/unsubscribed" element={<PublicPageLayout><UnsubscribedPage /></PublicPageLayout>} />
    <Route path="login" element={<LoginPage />} />
    <Route path="forbidden" element={<PublicPageLayout><ForbiddenPage /></PublicPageLayout>} />
    <Route path="admin/verify" element={<MfaVerifyPage />} />

    <Route path="admin" element={<AdminLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="projects" element={<ProjectsPage />} />
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
