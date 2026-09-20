import React, { useState } from 'react';
import {
  Home,
  Mail,
  Users,
  CheckSquare,
  Menu,
  X,
  Wallet,
  Sparkles,
  MapPin,
  QrCode,
  Eye,
  Music,
  Palette,
  Globe,
  Briefcase,
  Heart,
  Camera,
  Ticket,
  ChevronRight,
  Coins,
  Download,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { UserRole } from '../types';
import { THEME_PRESETS, ThemeMood } from '../utils/themePresets';
import { soundManager } from '../utils/ambientSound';
import { CurrencySwitcher } from './CurrencySwitcher';
import { PWAInstallButton } from './PWAInstallButton';
import { useRouter } from '../context/RouterContext';
import { FolderKanban } from 'lucide-react';

interface MobileBottomNavProps {
  currentThemeMood: ThemeMood;
  onSelectThemeMood: (mood: ThemeMood) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentThemeMood,
  onSelectThemeMood,
  isPlayingMusic,
  onToggleMusic,
}) => {
  const {
    activeTab,
    setActiveTab,
    activeRole,
    switchRole,
    guests,
    tasks,
    setShowQrCheckinModal,
    setShowPublicPreview,
    setShowPublicLanding,
  } = useEvent();

  const { navigate, currentPath } = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Unconfirmed / pending RSVPs
  const pendingRsvpCount = guests.filter((g) => g.rsvpStatus === 'Pending').length;
  // Pending tasks
  const pendingTasksCount = tasks.filter((t) => !t.isCompleted).length;

  const currentTheme = THEME_PRESETS[currentThemeMood] || THEME_PRESETS.indigo;

  const roleLabels: Record<UserRole, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
    ORGANIZER: { label: 'EO / Admin', icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
    CLIENT: { label: 'Klien / Pengantin', icon: Heart, color: 'text-pink-600 bg-pink-50' },
    VENDOR: { label: 'Vendor Partner', icon: Camera, color: 'text-orange-600 bg-orange-50' },
    GUEST: { label: 'Tamu Undangan', icon: Ticket, color: 'text-emerald-600 bg-emerald-50' },
  };

  const handleTabClick = (tabId: number) => {
    soundManager.playTapSound();
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Quick Floating Action Button on Mobile (Scan QR) */}
      <div className="lg:hidden fixed bottom-[76px] right-4 z-40">
        <button
          onClick={() => {
            soundManager.playTapSound();
            setShowQrCheckinModal(true);
          }}
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-full shadow-lg text-white font-bold text-xs ${currentTheme.buttonClass} active:scale-95 transition-transform backdrop-blur-md`}
          aria-label="Scan QR Tamu Cepat"
        >
          <QrCode className="w-4 h-4" />
          <span className="text-[11px] tracking-wide">Scan QR</span>
        </button>
      </div>

      {/* Fixed Bottom Dock Navigation Bar */}
      <nav
        aria-label="Navigasi Mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl safe-area-bottom"
      >
        <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1 items-center">
          {/* Tab 0: Home */}
          <button
            onClick={() => {
              soundManager.playTapSound();
              navigate('/dashboard');
              setActiveTab(0);
              setIsMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center h-full transition-all active:scale-90 relative ${
              (currentPath === '/dashboard' || activeTab === 0) && !isMenuOpen
                ? 'text-slate-900 font-extrabold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Home className="w-5 h-5" />
              {(currentPath === '/dashboard' || activeTab === 0) && !isMenuOpen && (
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: currentTheme.accentColor }}
                />
              )}
            </div>
            <span className="text-[10px] mt-1">Beranda</span>
          </button>

          {/* Tab 1: Templates */}
          <button
            onClick={() => {
              soundManager.playTapSound();
              navigate('/templates');
              setIsMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center h-full transition-all active:scale-90 relative ${
              currentPath === '/templates' && !isMenuOpen
                ? 'text-slate-900 font-extrabold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Palette className="w-5 h-5" />
              {currentPath === '/templates' && !isMenuOpen && (
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: currentTheme.accentColor }}
                />
              )}
            </div>
            <span className="text-[10px] mt-1">Template</span>
          </button>

          {/* Tab 2: Proyek */}
          <button
            onClick={() => {
              soundManager.playTapSound();
              navigate('/projects');
              setIsMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center h-full transition-all active:scale-90 relative ${
              currentPath === '/projects' && !isMenuOpen
                ? 'text-slate-900 font-extrabold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <FolderKanban className="w-5 h-5" />
              {currentPath === '/projects' && !isMenuOpen && (
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: currentTheme.accentColor }}
                />
              )}
            </div>
            <span className="text-[10px] mt-1">Proyek</span>
          </button>

          {/* Tab 3: Tamu */}
          <button
            onClick={() => {
              soundManager.playTapSound();
              navigate('/guests');
              setActiveTab(2);
              setIsMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center h-full transition-all active:scale-90 relative ${
              (currentPath === '/guests' || activeTab === 2) && !isMenuOpen
                ? 'text-slate-900 font-extrabold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Users className="w-5 h-5" />
              {pendingRsvpCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.2 min-w-4 text-center">
                  {pendingRsvpCount}
                </span>
              )}
              {(currentPath === '/guests' || activeTab === 2) && !isMenuOpen && (
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: currentTheme.accentColor }}
                />
              )}
            </div>
            <span className="text-[10px] mt-1">Tamu</span>
          </button>

          {/* Tab 4: More / Menu */}
          <button
            onClick={() => {
              soundManager.playTapSound();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`flex flex-col items-center justify-center h-full transition-all active:scale-90 relative ${
              isMenuOpen ? 'text-slate-900 font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              {isMenuOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
            </div>
            <span className="text-[10px] mt-1">{isMenuOpen ? 'Tutup' : 'Menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer / Bottom Sheet */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full bg-white rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 border-t border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Handle */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.accentColor }} />
                <span className="font-extrabold text-sm text-slate-900">Menu & Fitur Acara</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Audio & Ambient Mood Atmosphere */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50/50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onToggleMusic}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isPlayingMusic
                      ? 'bg-purple-600 text-white shadow-md animate-pulse'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                  aria-label="Toggle Musik Suasana"
                >
                  <Music className="w-5 h-5" />
                </button>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>Musik Suasana Acara</span>
                    {isPlayingMusic && (
                      <span className="text-[10px] text-purple-600 font-normal animate-pulse">● Berputar</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isPlayingMusic ? 'Melodi akustik pengiring' : 'Ketuk ikon untuk memutar'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-[11px]">Tema</span>
              </button>
            </div>

            {/* Theme Picker Dropdown inside Sheet */}
            {showThemePicker && (
              <div className="p-3 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-2">
                <div className="text-[11px] font-bold uppercase text-slate-400">Pilih Suasana Visual Acara:</div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(THEME_PRESETS) as ThemeMood[]).map((moodKey) => {
                    const preset = THEME_PRESETS[moodKey];
                    const isSelected = currentThemeMood === moodKey;
                    return (
                      <button
                        key={moodKey}
                        onClick={() => {
                          onSelectThemeMood(moodKey);
                          setShowThemePicker(false);
                        }}
                        className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all ${
                          isSelected ? 'border-purple-600 bg-purple-50/70 font-bold' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: preset.accentColor }}
                        />
                        <div className="truncate">
                          <div className="text-xs text-slate-900 truncate">{preset.name}</div>
                          <div className="text-[10px] text-slate-400">{preset.tagline}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Remaining Core Screens */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modul EO & Perencanaan:</div>
              <div className="grid grid-cols-3 gap-2">
                {/* Budget */}
                <button
                  onClick={() => handleTabClick(4)}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1 ${
                    activeTab === 4 && activeRole === 'ORGANIZER'
                      ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-800'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  <span className="text-[11px]">Budget</span>
                </button>

                {/* Studio */}
                <button
                  onClick={() => handleTabClick(5)}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1 ${
                    activeTab === 5 && activeRole === 'ORGANIZER'
                      ? 'border-purple-500 bg-purple-50 font-bold text-purple-800'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-[11px]">Studio Foto</span>
                </button>

                {/* Lokasi */}
                <button
                  onClick={() => handleTabClick(6)}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1 ${
                    activeTab === 6 && activeRole === 'ORGANIZER'
                      ? 'border-blue-500 bg-blue-50 font-bold text-blue-800'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-[11px]">Lokasi</span>
                </button>
              </div>
            </div>

            {/* Quick Role Switcher */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dasbor Berdasarkan Peran:</div>
              <div className="grid grid-cols-2 gap-2">
                {(['ORGANIZER', 'CLIENT', 'VENDOR', 'GUEST'] as UserRole[]).map((role) => {
                  const info = roleLabels[role];
                  const Icon = info.icon;
                  const isRoleActive = activeRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition-all ${
                        isRoleActive
                          ? 'border-blue-600 bg-blue-50 font-bold text-blue-900 shadow-xs'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${info.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs">{info.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Currency & Public Web Link */}
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 flex items-center space-x-1.5">
                  <Coins className="w-4 h-4 text-slate-400" />
                  <span>Mata Uang</span>
                </span>
                <CurrencySwitcher variant="compact" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowPublicPreview(true);
                  }}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Preview Undangan</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/');
                  }}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Web Publik</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/create');
                  }}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  <span>+ Buat Acara Baru</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  <span>⚙ Pengaturan Akun</span>
                </button>
              </div>

              <div className="pt-1">
                <PWAInstallButton variant="inline" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
