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
  Palette,
  Heart,
  ExternalLink,
  ChevronRight,
  Camera,
  Layers,
  Clock,
  MapPin,
  LogIn,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { AALogo } from '../components/AALogo';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { GoogleAdSlot } from '../components/GoogleAdSlot';
import { TemplateDetailModal } from '../components/TemplateDetailModal';
import { TemplateItem } from '../types';

export const PublicPortalScreen: React.FC = () => {
  const {
    setShowAuthModal,
    setShowPublicPreview,
    setShowPublicLanding,
    setActiveTab,
    currentUser,
    guests,
    setSelectedGuestForPass,
    templates,
    selectTemplate,
    showToast,
  } = useEvent();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<TemplateItem | null>(null);

  const categories = [
    'Semua',
    'Wedding',
    'Adat Nusantara',
    'Modern Minimalist',
    'Birthday',
    'Corporate',
    'Baby',
  ];

  const filteredTemplates =
    selectedCategory === 'Semua'
      ? templates
      : templates.filter((t) => {
          if (selectedCategory === 'Wedding') return t.category === 'Wedding';
          if (selectedCategory === 'Adat Nusantara')
            return t.category === 'Adat Heritage' || t.title.toLowerCase().includes('jawa') || t.title.toLowerCase().includes('sunda') || t.title.toLowerCase().includes('bali');
          if (selectedCategory === 'Modern Minimalist') return t.category === 'Modern';
          if (selectedCategory === 'Birthday') return t.category === 'Birthday';
          if (selectedCategory === 'Corporate') return t.category === 'Corporate';
          if (selectedCategory === 'Baby') return t.category === 'Baby';
          return true;
        });

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

  const handleCreateInvitationCTA = () => {
    if (currentUser) {
      setShowPublicLanding(false);
      setActiveTab(1); // Go to Invitation editor
    } else {
      showToast('Masuk dengan Google untuk langsung mulai membuat undangan Anda.');
      setShowAuthModal(true);
    }
  };

  const handleSelectTemplateCTA = (tmpl: TemplateItem) => {
    selectTemplate(tmpl.title);
    if (currentUser) {
      setShowPublicLanding(false);
      setActiveTab(1);
      showToast(`Template "${tmpl.title}" siap diedit!`);
    } else {
      showToast(`Masuk dengan Google untuk mengkustomisasi template "${tmpl.title}".`);
      setShowAuthModal(true);
    }
  };

  const scrollToTemplates = () => {
    const el = document.getElementById('templates-explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="public-homepage" className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Top Public Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <AALogo variant="header" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

          {/* Navigation links on desktop */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-600">
            <button
              onClick={scrollToTemplates}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Koleksi Template
            </button>
            <a href="#fitur-utama" className="hover:text-blue-600 transition-colors">
              Fitur Unggulan
            </a>
            <a href="#portal-tamu" className="hover:text-blue-600 transition-colors">
              Cek E-Pass Tamu
            </a>
            <a href="#paket-harga" className="hover:text-blue-600 transition-colors">
              Paket Harga
            </a>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <PWAInstallButton variant="navbar" />

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPublicLanding(false)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5"
                >
                  <span>Buka Dasbor Saya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-600" />
                  <span>Masuk dengan Google</span>
                </button>

                <button
                  onClick={handleCreateInvitationCTA}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 hover:opacity-95 text-white font-bold text-xs shadow-xs transition-all"
                >
                  Buat Undangan
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Platform No. 1 Pembuat Undangan Digital & Manajemen Acara</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Plan • Manage • Make It Happen.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 bg-clip-text text-transparent">
              Undangan Digital Cantik & Manajemen Tamu Cepat
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pilih dari puluhan tema adat Nusantara & modern, unggah foto momen terbaik Anda, kelola konfirmasi RSVP instan via WhatsApp, dan percepat antrean masuk dengan E-Pass QR code cerdas.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleCreateInvitationCTA}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Buat Undangan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToTemplates}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Jelajahi Template</span>
            </button>

            <button
              onClick={() => setShowPublicPreview(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-pink-600" />
              <span>Contoh Undangan Nyata</span>
            </button>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Foto Otomatis Terkompresi Cepat</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Responsif Smartphone</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Login Instan dengan Akun Google</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>QR Check-in Buku Tamu</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: EXPLORE REALISTIC TEMPLATES */}
      <section id="templates-explorer" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-3">
              <Palette className="w-3.5 h-3.5" />
              <span>Katalog Undangan Terlengkap</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Pilihan Tema Estetik & Realistis
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Setiap template dirancang dengan ornamen budaya otentik, palet warna elegan, dan tipografi berkualitas tinggi yang siap Anda sematkan foto-foto terbaik.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center space-x-2 overflow-x-auto no-scrollbar pb-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tmpl) => {
              return (
                <div
                  key={tmpl.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Realistic Visual Thumbnail with Cover Image & Motifs */}
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <img
                        src={tmpl.defaultCoverPhoto}
                        alt={tmpl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-white/10 shadow-xs">
                          {tmpl.styleTag}
                        </span>
                        <span
                          className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                          style={{ backgroundColor: tmpl.accentColor || '#f59e0b' }}
                          title="Warna Aksen Tema"
                        />
                      </div>

                      {/* Host & Date Preview inside thumbnail */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                          {tmpl.category}
                        </div>
                        <h3 className="text-base font-serif font-bold text-white drop-shadow-md truncate">
                          {tmpl.sampleHosts || tmpl.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {tmpl.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {tmpl.description}
                        </p>
                      </div>

                      {/* Sample Venue & Date Metadata */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[11px] text-slate-600">
                        <div className="flex items-center space-x-1.5 truncate">
                          <Calendar className="w-3 h-3 text-blue-500 shrink-0" />
                          <span>{tmpl.sampleDate || 'Sabtu, 24 Oktober 2026'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 truncate">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{tmpl.sampleVenue || 'Ballroom Hotel Indonesia'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0 flex items-center space-x-2 border-t border-slate-100 mt-2">
                    <button
                      type="button"
                      onClick={() => setActivePreviewTemplate(tmpl)}
                      className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Realistis</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectTemplateCTA(tmpl)}
                      className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Gunakan</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={handleCreateInvitationCTA}
              className="inline-flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>Ingin kustomisasi sendiri atau unggah foto Anda? Buka Pembuat Undangan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Public Guest Portal: Search & Retrieve E-Pass */}
      <section id="portal-tamu" className="py-14 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Portal Undangan & E-Pass Tamu
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
              Cek E-Pass & Buku Tamu Anda
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan nama lengkap atau nomor kontak untuk melihat status undangan dan tiket QR masuk Anda
            </p>
          </div>

          <form onSubmit={handleSearchGuest} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama Anda (contoh: Hendra, Dimas, Sinta)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
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
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/90 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
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
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-600 animate-in fade-in">
                  Nama belum terdaftar. Silakan hubungi pihak penyelenggara acara untuk konfirmasi.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section id="fitur-utama" className="py-16 bg-white">
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
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Undangan Digital Eksklusif</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Tema sinematik, musik latar syahdu, galeri foto momen, countdown otomatis, serta panduan Google Maps terintegrasi.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Buku Tamu QR & E-Pass</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Check-in tamu cepat via scanner kamera ponsel. Bebas antrean panjang, penataan nomor meja VIP, dan rekap otomatis.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Kalkulator Budget Realistis</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Dukungan multi-mata uang (IDR, USD, EUR, JPY, SGD). Pantau selisih anggaran rencana vs realisasi pengeluaran mingguan.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-black mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Auto RSVP & Blast WhatsApp</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Kirim pengingat konfirmasi RSVP otomatis menjelang hari H agar estimasi konsumsi catering dan souvenir akurat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PWAInstallButton variant="banner" />
      </div>

      {/* Pricing / Packages */}
      <section id="paket-harga" className="py-16 bg-white border-t border-slate-200/80">
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
                onClick={handleCreateInvitationCTA}
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
                onClick={handleCreateInvitationCTA}
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
                onClick={handleCreateInvitationCTA}
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
              <button
                onClick={() =>
                  showToast('Kebijakan Privasi: Data tamu dan privasi acara Anda terlindungi dan aman.')
                }
                className="hover:text-white"
              >
                Kebijakan Privasi
              </button>
              <button
                onClick={() =>
                  showToast('Ketentuan Layanan AA-EventMaker berlaku untuk seluruh pengguna.')
                }
                className="hover:text-white"
              >
                Ketentuan Layanan
              </button>
              <button
                onClick={handleCreateInvitationCTA}
                className="text-orange-400 hover:text-orange-300 font-bold"
              >
                Mulai Buat Undangan Sekarang ➔
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              © 2026 AA-EventMaker. Hak Cipta Dilindungi Undang-Undang. Plan • Manage • Make It Happen.
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span>Google OAuth 2.0 Ready</span>
              <span>•</span>
              <span>PWA Mobile Offline Enabled</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Realistic Template Detail Preview Modal */}
      {activePreviewTemplate && (
        <TemplateDetailModal
          template={activePreviewTemplate}
          onClose={() => setActivePreviewTemplate(null)}
          onUseTemplate={(tmpl) => {
            handleSelectTemplateCTA(tmpl);
            setActivePreviewTemplate(null);
          }}
        />
      )}
    </div>
  );
};
