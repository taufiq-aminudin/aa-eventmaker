import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Coins,
  Smartphone,
  LogOut,
  Sparkles,
  CheckCircle2,
  FolderKanban,
  SlidersHorizontal,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { CurrencyCode, UserRole } from '../../types';
import { EventCategoryAdmin } from '../../components/admin/EventCategoryAdmin';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    activeRole,
    switchRole,
    currency,
    setCurrency,
    logout,
    showToast,
  } = useEvent();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<'general' | 'catalog'>('general');

  const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'IDR', label: 'Rupiah Indonesia', symbol: 'Rp' },
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$' },
    { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  ];

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'ORGANIZER', title: 'Penyelenggara / WO', desc: 'Akses penuh ke semua modul, export Excel, budgeting, dan manajemen vendor.' },
    { role: 'CLIENT', title: 'Calon Pengantin / Tuan Rumah', desc: 'Fokus pada personalisasi undangan, foto, daftar tamu VIP, dan buku tamu.' },
    { role: 'VENDOR', title: 'Vendor Acara', desc: 'Fokus pada timeline rundown, daftar kebutuhan katering/dekorasi, dan koordinasi.' },
    { role: 'GUEST', title: 'Tamu Undangan', desc: 'Akses ke konfirmasi RSVP, peta lokasi venue, dan tiket E-Pass QR.' },
    { role: 'ADMIN', title: 'Platform Super Admin', desc: 'Akses kontrol penuh ke katalog kategori A-L, tipe acara, templat rekomendasi, dan pengaturan sistem.' },
  ];

  const handleLogout = () => {
    logout();
    showToast('Anda telah keluar dari akun.');
    navigate('/');
  };

  return (
    <div id="settings-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
              <Settings className="w-3.5 h-3.5" />
              <span>Pengaturan Akun & Preferensi</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Pengaturan Aplikasi</h1>
            <p className="text-xs text-slate-500 mt-1">
              Atur profil, mata uang default anggaran, serta kelola katalog kategori acara nusantara.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'general'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Umum & Profil</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Katalog Kategori Acara</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <EventCategoryAdmin />
      ) : (
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Informasi Pengguna</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">Nama Tampilan</span>
                <div className="font-bold text-slate-900 text-sm">
                  {currentUser?.name || 'Pengguna AA Event Maker'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">Alamat Email</span>
                <div className="font-bold text-slate-900 text-sm">
                  {currentUser?.email || 'admin@aa-eventmaker.my.id'}
                </div>
              </div>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Peran Pengguna Aktif (Role Simulator)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Ubah sudut pandang dasbor untuk melihat fitur sesuai akses Penyelenggara, Pengantin, Vendor, Tamu, atau Platform Admin.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map((r) => {
                const isCurrent = activeRole === r.role;
                return (
                  <div
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      showToast(`Mode peran beralih ke: ${r.title}`);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{r.title}</span>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Currency Switcher */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>Mata Uang Default Anggaran</span>
            </h2>
            <p className="text-xs text-slate-500">
              Digunakan pada modul Budget & Rencana Biaya Acara.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {currencies.map((curr) => {
                const isSelected = currency === curr.code;
                return (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code);
                      showToast(`Mata uang diatur ke: ${curr.code}`);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900 ring-2 ring-emerald-200'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs'
                    }`}
                  >
                    <div className="text-base font-black">{curr.symbol}</div>
                    <div className="text-xs font-bold">{curr.code}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{curr.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout Action */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

