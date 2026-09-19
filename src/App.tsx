import React, { useEffect } from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { QrCheckinModal } from './components/QrCheckinModal';
import { GuestPassModal } from './components/GuestPassModal';
import { PublicInvitationView } from './components/PublicInvitationView';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { InvitationScreen } from './screens/InvitationScreen';
import { GuestScreen } from './screens/GuestScreen';
import { PlannerScreen } from './screens/PlannerScreen';
import { BudgetScreen } from './screens/BudgetScreen';
import { StudioScreen } from './screens/StudioScreen';
import { LocationMemoriesScreen } from './screens/LocationMemoriesScreen';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    showPublicPreview,
    setShowPublicPreview,
    toastMessage,
  } = useEvent();

  // Listen to hash changes for standalone public invitation link (e.g. #invitation/...)
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

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans text-slate-800 antialiased selection:bg-purple-100 selection:text-[#6d28d9]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 0 && <HomeScreen />}
        {activeTab === 1 && <InvitationScreen />}
        {activeTab === 2 && <GuestScreen />}
        {activeTab === 3 && <PlannerScreen />}
        {activeTab === 4 && <BudgetScreen />}
        {activeTab === 5 && <StudioScreen />}
        {activeTab === 6 && <LocationMemoriesScreen />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-700">AA Event Maker</strong> • Modern Wedding & Event Management System
          </div>
          <div className="text-[11px] text-slate-400">
            QR E-Pass • Broadcast Blast • Checklist Planner • Budgeting • Creative Studio
          </div>
        </div>
      </footer>

      {/* Global Modals & Previews */}
      <QrCheckinModal />
      <GuestPassModal />
      {showPublicPreview && <PublicInvitationView />}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-800 text-xs font-semibold flex items-center space-x-2 backdrop-blur-md animate-bounce-short">
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
