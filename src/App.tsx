import React, { Suspense, useEffect, useState } from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ThemeMood } from './utils/themePresets';
import { soundManager } from './utils/ambientSound';

// Public Pages (Direct import for immediate first-paint and SEO)
import { HomePage } from './screens/public/HomePage';
import { TemplatesPage } from './screens/public/TemplatesPage';
import { FeaturesPage } from './screens/public/FeaturesPage';
import { GuestPassPage } from './screens/public/GuestPassPage';
import { PricingPage } from './screens/public/PricingPage';
import { AboutPage } from './screens/public/AboutPage';
import { ContactPage } from './screens/public/ContactPage';
import { HelpPage } from './screens/public/HelpPage';
import { PaymentPage } from './screens/public/PaymentPage';
import { PrivacyPolicyPage } from './screens/public/PrivacyPolicyPage';
import { TermsOfServicePage } from './screens/public/TermsOfServicePage';
import { AuthPage } from './screens/auth/AuthPage';
import { ForgotPasswordPage } from './screens/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './screens/auth/ResetPasswordPage';

// App Pages
import { ProjectsPage } from './screens/app/ProjectsPage';
import { CreateEventPage } from './screens/app/CreateEventPage';
import { SettingsPage } from './screens/app/SettingsPage';
import { AdminSuiteScreen } from './screens/admin/AdminSuiteScreen';
import { AdminLoginScreen } from './screens/admin/AdminLoginScreen';
import { AdminTab } from './components/admin/AdminLayout';

// Lazy Loaded Workspace Screens & Modals for performance
const HomeScreen = React.lazy(() =>
  import('./screens/HomeScreen').then((m) => ({ default: m.HomeScreen }))
);
const InvitationScreen = React.lazy(() =>
  import('./screens/InvitationScreen').then((m) => ({ default: m.InvitationScreen }))
);
const GuestScreen = React.lazy(() =>
  import('./screens/GuestScreen').then((m) => ({ default: m.GuestScreen }))
);
const PlannerScreen = React.lazy(() =>
  import('./screens/PlannerScreen').then((m) => ({ default: m.PlannerScreen }))
);
const BudgetScreen = React.lazy(() =>
  import('./screens/BudgetScreen').then((m) => ({ default: m.BudgetScreen }))
);
const StudioScreen = React.lazy(() =>
  import('./screens/StudioScreen').then((m) => ({ default: m.StudioScreen }))
);
const LocationMemoriesScreen = React.lazy(() =>
  import('./screens/LocationMemoriesScreen').then((m) => ({ default: m.LocationMemoriesScreen }))
);

const ClientDashboardScreen = React.lazy(() =>
  import('./screens/ClientDashboardScreen').then((m) => ({ default: m.ClientDashboardScreen }))
);
const VendorDashboardScreen = React.lazy(() =>
  import('./screens/VendorDashboardScreen').then((m) => ({ default: m.VendorDashboardScreen }))
);
const GuestDashboardScreen = React.lazy(() =>
  import('./screens/GuestDashboardScreen').then((m) => ({ default: m.GuestDashboardScreen }))
);

const QrCheckinModal = React.lazy(() =>
  import('./components/QrCheckinModal').then((m) => ({ default: m.QrCheckinModal }))
);
const GuestPassModal = React.lazy(() =>
  import('./components/GuestPassModal').then((m) => ({ default: m.GuestPassModal }))
);
const PublicInvitationView = React.lazy(() =>
  import('./components/PublicInvitationView').then((m) => ({ default: m.PublicInvitationView }))
);
const AuthModal = React.lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const UpgradeModal = React.lazy(() =>
  import('./components/UpgradeModal').then((m) => ({ default: m.UpgradeModal }))
);

const PageLoaderFallback: React.FC = () => (
  <div className="min-h-[400px] flex flex-col items-center justify-center p-8 space-y-3">
    <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    <span className="text-xs font-bold text-slate-400">Memuat modul acara...</span>
  </div>
);

// Top Route Navigation Progress Bar
const NavigationProgressBar: React.FC = () => {
  const { currentPath } = useRouter();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setNavigating(true);
    const timer = setTimeout(() => {
      setNavigating(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPath]);

  if (!navigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 shadow-[0_0_10px_rgba(99,102,241,0.65)] animate-route-progress" />
    </div>
  );
};

const AppWorkspace: React.FC<{ children: React.ReactNode; pageKey?: string }> = ({
  children,
  pageKey,
}) => {
  const { activeRole } = useEvent();
  const [themeMood, setThemeMood] = useState<ThemeMood>('indigo');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const handleToggleMusic = () => {
    const isNowPlaying = soundManager.toggleAmbientMelody();
    setIsPlayingMusic(isNowPlaying);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700">
      <OfflineIndicator />
      <Navbar />

      <main className="flex-1 pb-28 lg:pb-16 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div key={pageKey} className="animate-page-fade w-full">
          <Suspense fallback={<PageLoaderFallback />}>{children}</Suspense>
        </div>
      </main>

      <MobileBottomNav
        currentThemeMood={themeMood}
        onSelectThemeMood={setThemeMood}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
      />

      <footer className="hidden sm:block border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 text-center text-xs text-slate-500 mb-16 lg:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-black text-slate-900">AA Event Maker</span>
            <span>•</span>
            <span>Plan • Manage • Make It Happen</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Peran Aktif: <strong className="text-blue-700 uppercase">{activeRole}</strong> • Siap Produksi Play Store & Web PWA
          </div>
        </div>
      </footer>
    </div>
  );
};

const MainRouter: React.FC = () => {
  const { currentRoute, currentPath } = useRouter();
  const {
    activeTab,
    activeRole,
    showPublicPreview,
    setShowPublicPreview,
  } = useEvent();

  const [themeMood, setThemeMood] = useState<ThemeMood>('indigo');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const handleToggleMusic = () => {
    const isNowPlaying = soundManager.toggleAmbientMelody();
    setIsPlayingMusic(isNowPlaying);
  };

  // Sync hash routing e.g. #invitation/slug
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.startsWith('#invitation')) {
        setShowPublicPreview(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setShowPublicPreview]);

  const renderRouteContent = () => {
    // Route: Public Invitation View by slug or hash
    if (currentRoute === '/invitation/:slug' || showPublicPreview) {
      return (
        <Suspense fallback={<PageLoaderFallback />}>
          <PublicInvitationView />
        </Suspense>
      );
    }

    // Public Marketing & Informational Pages
    switch (currentRoute) {
      case '/':
        return <HomePage />;
      case '/templates':
        return <TemplatesPage />;
      case '/features':
        return <FeaturesPage />;
      case '/guest-pass':
        return <GuestPassPage />;
      case '/pricing':
        return <PricingPage />;
      case '/payment':
        return <PaymentPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/help':
        return <HelpPage />;
      case '/privacy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsOfServicePage />;
      case '/login':
        return <AuthPage initialMode="login" />;
      case '/signup':
        return <AuthPage initialMode="signup" />;
      case '/forgot-password':
        return <ForgotPasswordPage />;
      case '/reset-password':
        return <ResetPasswordPage />;

      // Dedicated Isolated Admin Authentication Route
      case '/admin/login':
        return <AdminLoginScreen />;

      // Admin Console Pages (Full Admin Suite with strict access control)
      case '/admin':
      case '/admin/dashboard':
        return <AdminSuiteScreen initialTab="dashboard" />;
      case '/admin/payments':
      case '/admin/payment-verification':
        return <AdminSuiteScreen initialTab="payments" />;
      case '/admin/transactions':
        return <AdminSuiteScreen initialTab="transactions" />;
      case '/admin/customers':
        return <AdminSuiteScreen initialTab="customers" />;
      case '/admin/invitations':
        return <AdminSuiteScreen initialTab="invitations" />;
      case '/admin/packages':
        return <AdminSuiteScreen initialTab="packages" />;
      case '/admin/templates':
      case '/admin/categories':
        return <AdminSuiteScreen initialTab="templates" />;
      case '/admin/revenue':
      case '/admin/reports':
        return <AdminSuiteScreen initialTab="revenue" />;
      case '/admin/settings':
        return <AdminSuiteScreen initialTab="settings" />;

      // App & Workspace Dedicated Pages
      case '/projects':
        return (
          <AppWorkspace pageKey={currentPath}>
            <ProjectsPage />
          </AppWorkspace>
        );
      case '/create':
        return (
          <AppWorkspace pageKey={currentPath}>
            <CreateEventPage />
          </AppWorkspace>
        );
      case '/settings':
        return (
          <AppWorkspace pageKey={currentPath}>
            <SettingsPage />
          </AppWorkspace>
        );
      case '/editor':
        return (
          <AppWorkspace pageKey={currentPath}>
            <InvitationScreen />
          </AppWorkspace>
        );
      case '/guests':
        return (
          <AppWorkspace pageKey={currentPath}>
            <GuestScreen />
          </AppWorkspace>
        );

      // Main App Dashboard / Role Views
      case '/dashboard':
      default:
        return (
          <AppWorkspace pageKey={`dash-${activeRole}-${activeTab}`}>
            {activeRole === 'ORGANIZER' && (
              <>
                {activeTab === 0 && (
                  <HomeScreen
                    currentThemeMood={themeMood}
                    onSelectThemeMood={setThemeMood}
                    isPlayingMusic={isPlayingMusic}
                    onToggleMusic={handleToggleMusic}
                  />
                )}
                {activeTab === 1 && <InvitationScreen />}
                {activeTab === 2 && <GuestScreen />}
                {activeTab === 3 && <PlannerScreen />}
                {activeTab === 4 && <BudgetScreen />}
                {activeTab === 5 && <StudioScreen />}
                {activeTab === 6 && <LocationMemoriesScreen />}
              </>
            )}

            {activeRole === 'CLIENT' && <ClientDashboardScreen />}
            {activeRole === 'VENDOR' && <VendorDashboardScreen />}
            {activeRole === 'GUEST' && <GuestDashboardScreen />}
          </AppWorkspace>
        );
    }
  };

  return (
    <div key={currentPath} className="animate-page-fade w-full min-h-screen">
      {renderRouteContent()}
    </div>
  );
};

export const App: React.FC = () => {
  const { toastMessage } = useEvent();

  return (
    <RouterProvider>
      <NavigationProgressBar />
      <MainRouter />

      {/* Global Modals loaded lazily */}
      <Suspense fallback={null}>
        <QrCheckinModal />
        <GuestPassModal />
        <AuthModal />
        <UpgradeModal />
      </Suspense>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-800 text-xs font-semibold flex items-center space-x-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </RouterProvider>
  );
};

export const RootApp: React.FC = () => {
  return (
    <EventProvider>
      <App />
    </EventProvider>
  );
};

export default RootApp;
