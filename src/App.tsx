import React, { useEffect } from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { QrCheckinModal } from './components/QrCheckinModal';
import { GuestPassModal } from './components/GuestPassModal';
import { PublicInvitationView } from './components/PublicInvitationView';
import { AuthModal } from './components/AuthModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SeoManager } from './components/SeoManager';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { InvitationScreen } from './screens/InvitationScreen';
import { GuestScreen } from './screens/GuestScreen';
import { PlannerScreen } from './screens/PlannerScreen';
import { BudgetScreen } from './screens/BudgetScreen';
import { StudioScreen } from './screens/StudioScreen';
import { LocationMemoriesScreen } from './screens/LocationMemoriesScreen';

// Role Dashboards & Public Portal
import { ClientDashboardScreen } from './screens/ClientDashboardScreen';
import { VendorDashboardScreen } from './screens/VendorDashboardScreen';
import { GuestDashboardScreen } from './screens/GuestDashboardScreen';
import { PublicPortalScreen } from './screens/PublicPortalScreen';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    activeRole,
    showPublicPreview,
    setShowPublicPreview,
    toastMessage,
    showPublicLanding,
  } = useEvent();

  // Listen to hash and pathname changes for standalone public invitation links (e.g. #invitation/... or /invitation/...)
  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      if (hash.startsWith('#invitation') || pathname.startsWith('/invitation')) {
        setShowPublicPreview(true);
      }
    };
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, [setShowPublicPreview]);

  // If user opened Public Web Portal (Tampilan Web/App untuk umum)
  if (showPublicLanding) {
    return (
      <>
        <SeoManager />
        <PublicPortalScreen />
        <AuthModal />
        <OfflineIndicator />
        {showPublicPreview && <PublicInvitationView />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700">
      <SeoManager />
      <OfflineIndicator />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area: Routed by Role */}
      <main className="flex-1 pb-16 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeRole === 'ORGANIZER' && (
          <>
            {activeTab === 0 && <HomeScreen />}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-black text-slate-900">AA-EventMaker</span>
            <span>•</span>
            <span>Plan • Manage • Make It Happen</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Peran Aktif: <strong className="text-blue-700 uppercase">{activeRole}</strong> • Siap Produksi Play Store & Web PWA
          </div>
        </div>
      </footer>

      {/* Global Modals & Previews */}
      <QrCheckinModal />
      <GuestPassModal />
      <AuthModal />
      {showPublicPreview && <PublicInvitationView />}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-800 text-xs font-semibold flex items-center space-x-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <EventProvider>
      <MainAppContent />
    </EventProvider>
  );
};

export default App;
