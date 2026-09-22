import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  CreditCard,
  Users,
  Mail,
  Sparkles,
  Settings,
  BarChart3,
  Receipt,
  FolderTree,
  LogOut,
  Globe,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { AALogo } from '../AALogo';

export type AdminTab =
  | 'dashboard'
  | 'payments'
  | 'transactions'
  | 'customers'
  | 'invitations'
  | 'packages'
  | 'templates'
  | 'revenue'
  | 'settings';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  children,
}) => {
  const { currentUser, logout, payments } = useEvent();
  const { navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Strict Admin Authorization Check: Must be authenticated with verified ADMIN role
  const isAuthorizedAdmin =
    Boolean(currentUser) && currentUser?.role === 'ADMIN';

  // If not logged in or not authorized admin
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
              403 Akses Ditolak
            </span>
            <h1 className="text-xl font-black text-white">Area Khusus Administrator</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {currentUser ? (
                <>
                  Anda saat ini masuk sebagai <span className="font-bold text-slate-200">{currentUser.name}</span> ({currentUser.email}) dengan peran <span className="font-bold text-amber-400">{currentUser.role}</span>. Halaman konsol administrator ini hanya dapat diakses oleh akun Administrator Platform AA Event Maker.
                </>
              ) : (
                'Anda harus masuk terlebih dahulu dengan akun administrator resmi untuk mengakses konsol ini.'
              )}
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {currentUser ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Dasbor Saya</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Masuk ke Konsol Admin Privat</span>
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Halaman Depan Publik
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending payments count badge
  const pendingCount = payments.filter((p) => p.status === 'Pending' || p.status === 'Under Review').length;

  const navMenuItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Ringkasan & Metrik',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'payments' as AdminTab,
      label: 'Verifikasi Pembayaran',
      icon: CreditCard,
      badge: pendingCount > 0 ? `${pendingCount} Baru` : null,
      badgeColor: 'bg-amber-500 text-white animate-pulse',
    },
    {
      id: 'transactions' as AdminTab,
      label: 'Riwayat Transaksi',
      icon: Receipt,
      badge: `${payments.length}`,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'customers' as AdminTab,
      label: 'Manajemen Pelanggan',
      icon: Users,
      badge: null,
    },
    {
      id: 'invitations' as AdminTab,
      label: 'Undangan & Acara',
      icon: Mail,
      badge: null,
    },
    {
      id: 'packages' as AdminTab,
      label: 'Paket & Biaya',
      icon: Sparkles,
      badge: null,
    },
    {
      id: 'templates' as AdminTab,
      label: 'Katalog & Kategori',
      icon: FolderTree,
      badge: '9 Kategori',
      badgeColor: 'bg-blue-900/60 text-blue-300',
    },
    {
      id: 'revenue' as AdminTab,
      label: 'Omzet & Laporan',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as AdminTab,
      label: 'Pengaturan Admin',
      icon: Settings,
      badge: null,
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle Menu Admin"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-2.5">
            <AALogo variant="header" size="sm" className="text-white" onClick={() => handleSelectTab('dashboard')} />
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>ADMIN CONSOLE</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Links, Admin Identity, Logout */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => navigate('/')}
            className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Lihat Website Publik"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Publik</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Buka Dasbor Klien"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Dasbor Klien</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Admin User Chip */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <div className="font-bold text-white truncate max-w-[130px]">
                {currentUser?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-purple-400 font-semibold">SUPER ADMIN</div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-semibold flex items-center space-x-1"
            title="Keluar dari Admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Body: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-950/90 border-r border-slate-800/80 p-4 space-y-6 shrink-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Navigasi Admin
            </div>
            <nav className="space-y-1">
              {navMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* System Status info card */}
          <div className="mt-auto p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-slate-300">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sistem Aktif</span>
              </span>
              <span className="text-[10px] text-slate-500">v2.5.0</span>
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">
              Sistem verifikasi transaksi dan katalog acara real-time.
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between h-full z-10 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <AALogo variant="header" size="sm" className="text-white" />
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                      ADMIN
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/20 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center space-x-2"
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Website Publik</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-900 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
