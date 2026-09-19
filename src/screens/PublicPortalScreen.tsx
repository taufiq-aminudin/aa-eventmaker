import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Users,
  Wallet,
  Mail,
  ShieldCheck,
  Search,
  ArrowRight,
  Smartphone,
  Eye,
  Star,
  Zap,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { AALogo } from '../components/AALogo';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

export const PublicPortalScreen: React.FC = () => {
  const {
    setShowAuthModal,
    setAuthModalMode,
    setShowPublicPreview,
    setShowPublicLanding,
    guests,
    setSelectedGuestForPass,
    setShowQrCheckinModal,
    showToast,
  } = useEvent();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    const q = searchQuery.toLowerCase();
    const found = guests.find(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.phone.includes(q) ||
        g.email.toLowerCase().includes(q)
    );
    setSearchResult(found || null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Top Public Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <AALogo variant="header" size="sm" onClick={() => setShowPublicLanding(false)} />

          <div className="flex items-center space-x-2 sm:space-x-3">
            <PWAInstallButton variant="navbar" />

            <button
              onClick={() => {
                setAuthModalMode('login');
                setShowAuthModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Masuk
            </button>

            <button
              onClick={() => {
                setAuthModalMode('register');
                setShowAuthModal(true);
              }}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              Daftar Gratis
            </button>

            <button
              onClick={() => setShowPublicLanding(false)}
              className="hidden md:inline-flex px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              Buka App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Platform No. 1 Persiapan Pernikahan & Manajemen Acara</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Plan • Manage • Make It Happen.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 bg-clip-text text-transparent">
              Wujudkan Event Sempurna Tanpa Ribet
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Dari undangan digital eksklusif, buku tamu QR check-in pintar, tracking konfirmasi RSVP otomatis, hingga kalkulator budget multi-mata uang untuk pengantin & vendor.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setAuthModalMode('register');
                setShowAuthModal(true);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Mulai Buat Acara Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowPublicPreview(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4 text-pink-600" />
              <span>Lihat Demo Undangan</span>
            </button>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Mobile & PWA Ready</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Support Android Play Store / TWA</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>QR Check-in Super Cepat</span>
            </div>
          </div>
        </div>
      </section>

      {/* Public Guest Portal: Search & Retrieve E-Pass */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Portal Undangan & E-Pass Tamu
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Cari Undangan & Tiket Masuk Anda
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan nama lengkap atau nomor telepon untuk melihat status E-Pass dan konfirmasi RSVP
            </p>
          </div>

          <form onSubmit={handleSearchGuest} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama Anda (contoh: Hendra, Sinta)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors shrink-0"
            >
              Cari E-Pass
            </button>
          </form>

          {/* Search Results */}
          {hasSearched && (
            <div className="mt-6 max-w-xl mx-auto">
              {searchResult ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                  <div className="text-center sm:text-left">
                    <div className="text-xs font-bold text-blue-700 uppercase">E-Pass Ditemukan</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">{searchResult.name}</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Kategori: <strong>{searchResult.group}</strong> • Meja: <strong>{searchResult.tableNumber}</strong> • Kuota: {searchResult.pax} Orang
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGuestForPass(searchResult);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                  >
                    Buka E-Pass QR
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 animate-in fade-in">
                  Nama tidak ditemukan dalam daftar tamu. Silakan periksa kembali ejaan atau hubungi pihak penyelenggara acara.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Solusi Lengkap & Modern
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1.5">
              Segala yang Anda Butuhkan untuk Sukseskan Acara
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Didesain khusus untuk memberikan kemudahan bagi Penyelenggara, Calon Pengantin, Vendor Rekanan, dan Tamu Undangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Undangan Digital Eksklusif</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Tema sinematik, musik latar syahdu, galeri foto pre-wedding, countdown otomatis, dan amplop digital transfer bank & QRIS.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Buku Tamu QR & E-Pass</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Check-in tamu kurang dari 2 detik via scanner kamera. Bebas antrean, tracking kehadiran VIP otomatis, dan cetak nomor meja.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Kalkulator Budget Realistis</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Dukungan multi-mata uang (IDR, USD, EUR, JPY, SGD). Pantau selisih anggaran rencana vs realisasi pengeluaran mingguan.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-black mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Jadwal Blast & Pengingat Otomatis</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Kirim pengingat RSVP via email & WhatsApp blast otomatis menjelang hari H agar estimasi konsumsi catering akurat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PWAInstallButton variant="banner" />
      </div>

      {/* AdSense Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoogleAdSlot />
      </div>

      {/* Pricing / Packages */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Pilihan Paket Fleksibel
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Biaya Transparan, Tanpa Biaya Tersembunyi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Starter Free</h3>
                <p className="text-xs text-slate-500 mt-0.5">Untuk acara syukuran keluarga kecil</p>
                <div className="mt-4 text-3xl font-black text-slate-900">Gratis</div>
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">✓ 1 Acara Aktif</div>
                  <div className="flex items-center gap-2">✓ Hingga 100 Tamu Undangan</div>
                  <div className="flex items-center gap-2">✓ Undangan Digital Standar</div>
                  <div className="flex items-center gap-2">✓ E-Pass QR Check-in</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setShowAuthModal(true);
                }}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Pilih Starter
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl relative flex flex-col justify-between">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-orange-500 text-[10px] font-black uppercase tracking-wider">
                Paling Favorit
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Wedding Professional</h3>
                <p className="text-xs text-blue-100 mt-0.5">Pilihan utama calon pengantin modern</p>
                <div className="mt-4 text-3xl font-black text-white">Rp 299.000</div>
                <div className="text-[11px] text-blue-200">Sekali bayar untuk 1 acara</div>
                <div className="mt-4 space-y-2 text-xs text-blue-100">
                  <div className="flex items-center gap-2">✓ Unlimited Tamu Undangan</div>
                  <div className="flex items-center gap-2">✓ Semua Template Sinematik & Custom Musik</div>
                  <div className="flex items-center gap-2">✓ Auto Reminder Blast RSVP</div>
                  <div className="flex items-center gap-2">✓ Dasbor Khusus Pengantin & Angpao Digital</div>
                  <div className="flex items-center gap-2">✓ Support PWA & Offline Scanner</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setShowAuthModal(true);
                }}
                className="mt-6 w-full py-2.5 rounded-xl bg-white text-blue-900 text-xs font-bold hover:bg-blue-50 shadow-md"
              >
                Pilih Professional
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">EO & Agency</h3>
                <p className="text-xs text-slate-500 mt-0.5">Untuk Wedding Organizer & Event Creator</p>
                <div className="mt-4 text-3xl font-black text-slate-900">Rp 899.000</div>
                <div className="text-[11px] text-slate-400">Lisensi tahunan per organizer</div>
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">✓ Kelola Banyak Proyek Acara Sekaligus</div>
                  <div className="flex items-center gap-2">✓ Portal Kolaborasi Multi-Vendor</div>
                  <div className="flex items-center gap-2">✓ Export Laporan Excel & PDF</div>
                  <div className="flex items-center gap-2">✓ Support Prioritas WhatsApp 24/7</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setShowAuthModal(true);
                }}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <AALogo variant="header" size="sm" className="text-white" />
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <button onClick={() => alert('Kebijakan Privasi: Data tamu dan privasi acara Anda dienkripsi secara aman.')} className="hover:text-white">
                Kebijakan Privasi
              </button>
              <button onClick={() => alert('Ketentuan Layanan AA-EventMaker berlaku untuk semua akun terdaftar.')} className="hover:text-white">
                Ketentuan Layanan
              </button>
              <button onClick={() => alert('Bantuan & Dukungan: Hubungi support@aa-eventmaker.com')} className="hover:text-white">
                Bantuan 24/7
              </button>
              <button onClick={() => setShowPublicLanding(false)} className="text-orange-400 hover:text-orange-300 font-bold">
                Kembali ke Aplikasi Utama
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              © 2026 AA-EventMaker. Hak Cipta Dilindungi Undang-Undang. Plan • Manage • Make It Happen.
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span>Google Search Console Verified</span>
              <span>•</span>
              <span>AdSense Ready</span>
              <span>•</span>
              <span>Play Store / TWA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
