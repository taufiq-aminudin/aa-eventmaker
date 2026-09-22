import React, { useState } from 'react';
import {
  Home,
  Mail,
  Users,
  CheckSquare,
  Wallet,
  Sparkles,
  MapPin,
  QrCode,
  Eye,
  Plus,
  ChevronDown,
  Globe,
  User,
  LogOut,
  Briefcase,
  Heart,
  Camera,
  Ticket,
  CreditCard,
  Shield,
  Bell,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { EventType, UserRole } from '../types';
import { AALogo } from './AALogo';
import { PWAInstallButton } from './PWAInstallButton';
import { NotificationCenterModal } from './NotificationCenterModal';
import { useRouter } from '../context/RouterContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentProject,
    projects,
    selectProject,
    createProject,
    setShowPublicPreview,
    setShowQrCheckinModal,
    currentUser,
    activeRole,
    switchRole,
    clearAuthenticationState,
    setShowAuthModal,
    setAuthModalMode,
    logout,
    setShowPublicLanding,
  } = useEvent();

  const { navigate, currentPath } = useRouter();

  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<EventType>('Wedding');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');

  // Fetch live unread notifications count
  React.useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/notifications?unreadOnly=true');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const navItems = [
    { id: 0, label: 'Home', icon: Home },
    { id: 1, label: 'Undangan', icon: Mail },
    { id: 2, label: 'Tamu', icon: Users },
    { id: 3, label: 'Planner', icon: CheckSquare },
    { id: 4, label: 'Budget', icon: Wallet },
    { id: 5, label: 'Studio', icon: Sparkles },
    { id: 6, label: 'Lokasi & Memori', icon: MapPin },
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createProject(
      newName,
      newType,
      newDate || 'Tanggal Belum Ditentukan',
      newTime || '10:00 - 15:00 WIB',
      newLocation || 'Jakarta'
    );
    setShowNewProjectModal(false);
    setNewName('');
    setNewDate('');
    setNewTime('');
    setNewLocation('');
  };

  const roleBadges: Record<UserRole, { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
    ORGANIZER: { label: 'EO / Planner', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: Briefcase },
    CLIENT: { label: 'Klien / Pengantin', bg: 'bg-pink-50 border-pink-200', text: 'text-pink-700', icon: Heart },
    VENDOR: { label: 'Vendor Partner', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', icon: Camera },
    GUEST: { label: 'Tamu Undangan', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: Ticket },
    ADMIN: { label: 'Platform Admin', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', icon: Shield },
  };

  const CurrentRoleIcon = roleBadges[activeRole].icon;

  return (
    <>
      <header
        id="app-header"
        className="sticky top-0 z-40 bg-white border-b border-[#e4e7ec] shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Project Selector */}
            <div className="flex items-center space-x-3">
              <AALogo
                variant="header"
                size="sm"
                onClick={() => navigate('/')}
              />

              <div className="relative">
                <button
                  id="project-selector-btn"
                  onClick={() => setShowProjectMenu(!showProjectMenu)}
                  className="hidden sm:flex items-center space-x-2 text-left px-2 py-1.5 rounded-lg hover:bg-[#f1f5f9] transition-colors"
                >
                  <div className="border-l border-slate-200 pl-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                        PILIH ACARA
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 max-w-[140px] md:max-w-[200px] truncate">
                      {currentProject.name}
                    </div>
                  </div>
                </button>

                {showProjectMenu && (
                  <div
                    id="project-menu-dropdown"
                    className="absolute left-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95"
                  >
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Daftar Proyek Acara
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {projects.map((proj) => (
                        <button
                          key={proj.id}
                          onClick={() => {
                            selectProject(proj);
                            setShowProjectMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm flex flex-col hover:bg-slate-50 transition-colors ${
                            proj.id === currentProject.id
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'text-slate-700'
                          }`}
                        >
                          <span className="truncate">{proj.name}</span>
                          <span className="text-xs text-slate-400 font-normal">
                            {proj.type} • {proj.date}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 mt-2 pt-2 px-2">
                      <button
                        onClick={() => {
                          setShowProjectMenu(false);
                          setShowNewProjectModal(true);
                        }}
                        className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Buat Acara Baru</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation Tabs (Active only for Organizer/Full view) */}
            {activeRole === 'ORGANIZER' && (
              <nav
                id="desktop-nav"
                aria-label="Navigasi Utama"
                className="hidden lg:flex items-center space-x-1"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-tab-${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`}
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Header Action Buttons & User Menu */}
            <div className="flex items-center space-x-2">
              {/* Public Portal Switcher */}
              <button
                onClick={() => navigate('/')}
                title="Lihat Tampilan Web & Portal Publik"
                className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Web Publik</span>
              </button>

              {/* PWA Install Button */}
              <PWAInstallButton variant="navbar" />

              {/* QR Scanner Shortcut */}
              <button
                id="btn-quick-qr-scanner"
                onClick={() => setShowQrCheckinModal(true)}
                title="Buka QR Scanner Tamu"
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-blue-700" />
                <span className="hidden xl:inline">Check-In</span>
              </button>

              {/* Preview Undangan */}
              <button
                id="btn-quick-preview-invitation"
                onClick={() => setShowPublicPreview(true)}
                title="Lihat Undangan Publik"
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 rounded-lg shadow-xs transition-opacity"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              {/* Notification Center Bell */}
              <button
                id="btn-navbar-notifications"
                onClick={() => setShowNotificationCenter(true)}
                title="Pusat Notifikasi"
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-xs animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* User State & Role Switcher */}
              {!currentUser ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Masuk</span>
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Daftar</span>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${roleBadges[activeRole].bg} ${roleBadges[activeRole].text}`}
                  >
                    <CurrentRoleIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{roleBadges[activeRole].label}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in zoom-in-95 text-slate-800">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {currentUser.email}
                        </div>
                        <div className="mt-1 inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          Peran Akun: {currentUser.role}
                        </div>
                      </div>

                      <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Ganti Tampilan Dasbor:
                      </div>

                      <button
                        onClick={() => {
                          switchRole('ORGANIZER');
                          setShowUserMenu(false);
                        }}
                        className={`w-full px-3.5 py-2 text-xs flex items-center space-x-2 text-left hover:bg-slate-50 ${
                          activeRole === 'ORGANIZER' ? 'bg-blue-50 text-blue-700 font-bold' : ''
                        }`}
                      >
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        <div>
                          <div>Penyelenggara / EO</div>
                          <div className="text-[10px] text-slate-400 font-normal">Dasbor penuh acara</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          switchRole('CLIENT');
                          setShowUserMenu(false);
                        }}
                        className={`w-full px-3.5 py-2 text-xs flex items-center space-x-2 text-left hover:bg-slate-50 ${
                          activeRole === 'CLIENT' ? 'bg-pink-50 text-pink-700 font-bold' : ''
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 text-pink-600" />
                        <div>
                          <div>Calon Pengantin / Klien</div>
                          <div className="text-[10px] text-slate-400 font-normal">Countdown & angpao</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          switchRole('VENDOR');
                          setShowUserMenu(false);
                        }}
                        className={`w-full px-3.5 py-2 text-xs flex items-center space-x-2 text-left hover:bg-slate-50 ${
                          activeRole === 'VENDOR' ? 'bg-orange-50 text-orange-700 font-bold' : ''
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5 text-orange-600" />
                        <div>
                          <div>Vendor Partner</div>
                          <div className="text-[10px] text-slate-400 font-normal">Jadwal termin & loading</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          switchRole('GUEST');
                          setShowUserMenu(false);
                        }}
                        className={`w-full px-3.5 py-2 text-xs flex items-center space-x-2 text-left hover:bg-slate-50 ${
                          activeRole === 'GUEST' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
                        }`}
                      >
                        <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                        <div>
                          <div>Tamu Undangan</div>
                          <div className="text-[10px] text-slate-400 font-normal">E-Pass QR & rute lokasi</div>
                        </div>
                      </button>

                      <div className="border-t border-slate-100 my-1 pt-1">
                        {currentUser?.role === 'ADMIN' && (
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate('/admin');
                            }}
                            className="w-full px-3.5 py-2 text-xs flex items-center space-x-2 text-left hover:bg-slate-50 text-purple-700 font-bold"
                          >
                            <Shield className="w-3.5 h-3.5 text-purple-600" />
                            <span>Konsol Administrator</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setShowPublicLanding(true);
                          }}
                          className="w-full px-3.5 py-2 text-xs flex items-center space-x-2 text-left hover:bg-slate-50 text-slate-700"
                        >
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          <span>Buka Halaman Web Publik</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            clearAuthenticationState();
                            navigate('/login');
                          }}
                          className="w-full px-3.5 py-2 text-xs flex items-center space-x-2 text-left hover:bg-blue-50 text-blue-600 font-bold cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Ganti / Masuk Akun</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full px-3.5 py-2 text-xs flex items-center space-x-2 text-left hover:bg-rose-50 text-rose-600 font-medium cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar (Logout)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar (Shown for Organizer) */}
        {activeRole === 'ORGANIZER' && (
          <div className="lg:hidden relative border-t border-slate-200/80 bg-slate-50/95 overflow-hidden">
            {/* Subtle right gradient fade affordance to visually indicate scrollability */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-100 to-transparent z-10" />

            <div
              className="flex items-center overflow-x-auto scroll-smooth px-3 py-2 space-x-1.5 scrollbar-none pr-10"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold min-w-max transition-all active:scale-95 ${
                      isActive
                        ? 'bg-white text-blue-700 shadow-xs border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 bg-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                    <span className="shrink-0">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Buat Acara Baru</h3>
            <p className="text-xs text-slate-500 mb-4">
              Mulai manajemen persiapan, undangan digital, dan buku tamu untuk acara baru Anda.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Acara / Pasangan
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Dimas & Sinta Wedding"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Acara
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as EventType)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Wedding">Wedding (Pernikahan)</option>
                  <option value="Birthday">Ulang Tahun (Birthday)</option>
                  <option value="Corporate">Corporate Gathering</option>
                  <option value="Baby Shower">Baby Shower / Aqiqah</option>
                  <option value="Graduation">Wisuda / Kelulusan</option>
                  <option value="Custom Event">Acara Kustom Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Acara
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="Contoh: 25 Oktober 2026"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="10:00 - 14:00 WIB"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lokasi Venue
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Nama Hotel / Gedung / Kota"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Simpan & Buka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onOpenSettings={() => {
          setShowNotificationCenter(false);
          navigate('/settings');
        }}
      />
    </>
  );
};
