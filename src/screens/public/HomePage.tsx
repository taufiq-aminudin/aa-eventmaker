import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  QrCode,
  Share2,
  Palette,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Smartphone,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter, Link } from '../../context/RouterContext';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';
import { TemplateDetailModal } from '../../components/TemplateDetailModal';
import { TemplateItem } from '../../types';

export const HomePage: React.FC = () => {
  const { templates, selectTemplate, setShowPublicPreview } = useEvent();
  const { navigate } = useRouter();

  const [activePreviewTemplate, setActivePreviewTemplate] = useState<TemplateItem | null>(null);
  const [heroThemeIndex, setHeroThemeIndex] = useState(0);

  const heroThemes = [
    {
      name: 'Golden Night Luxury',
      category: 'Wedding',
      bgClass: 'from-[#0a0f1d] via-[#1e1b4b] to-[#b45309]',
      accentColor: '#fbbf24',
      couple: 'Andi Pratama & Ayu Maharani',
      date: 'Sabtu, 24 Oktober 2026',
      venue: 'Plataran Dharmawangsa Jakarta',
      badge: 'Gold Luxury Edition',
      photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Keraton Solo Hadiningrat',
      category: 'Adat Jawa',
      bgClass: 'from-[#1c1917] via-[#451a03] to-[#b45309]',
      accentColor: '#d97706',
      couple: 'K.R.T. Dananjaya & Sekar Langit',
      date: 'Sabtu, 14 November 2026',
      venue: 'Pendopo Ndalem Danukusuman, Surakarta',
      badge: 'Adat Basahan & Beludru',
      photo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Sunda Siger Halus',
      category: 'Adat Sunda',
      bgClass: 'from-[#064e3b] via-[#047857] to-[#10b981]',
      accentColor: '#34d399',
      couple: 'Rizky Ramadhan & Neng Farah Diba',
      date: 'Ahad, 18 Oktober 2026',
      venue: 'Gedung Bale Asri Pusdai, Bandung',
      badge: 'Ronce Melati & Kujang Emas',
      photo: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Bali Ayu Dewata',
      category: 'Adat Bali',
      bgClass: 'from-[#581c87] via-[#701a75] to-[#f59e0b]',
      accentColor: '#f59e0b',
      couple: 'I Putu Arya & Ni Luh Putu Gayatri',
      date: 'Jumat, 04 Desember 2026',
      venue: 'Taman Bhagawan Nusa Dua, Bali',
      badge: 'Prada Emas & Janur Hias',
      photo: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Pick top 3 featured templates for clean, non-overcrowded homepage display
  const featuredTemplates = templates.slice(0, 3);

  const handleUseTemplate = (tmpl: TemplateItem) => {
    selectTemplate(tmpl.title);
    navigate('/create');
  };

  return (
    <div id="homepage" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="AA Event Maker – Platform Undangan Digital & E-Pass Tamu Modern"
        description="Buat undangan digital sinematik dengan musik latar, RSVP real-time WhatsApp, dan check-in E-Pass QR 0.5 detik bersama AA Event Maker."
        canonicalPath="/"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-blue-50/80 via-white to-slate-50">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-200/30 via-indigo-200/20 to-orange-200/30 blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold mb-6 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Platform Undangan Digital & Manajemen Tamu Modern No. 1</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-tight"
              >
                Create. Customize. Celebrate.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
              >
                Hadirkan keanggunan seni visual budaya dan kecanggihan teknologi digital.
                Undangan interaktif memukau dengan musik syahdu, RSVP WhatsApp otomatis, serta scan QR tamu tanpa antrean.
              </motion.p>

              {/* Main Call To Actions */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
              >
                <button
                  onClick={() => navigate('/create')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-102"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Create Your Invitation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/templates')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-indigo-600" />
                  <span>Explore Templates</span>
                </button>

                <button
                  onClick={() => navigate('/features')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>View Features</span>
                </button>
              </motion.div>

              {/* Proof Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Google OAuth 2.0 Instant Login</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-Time WhatsApp RSVP Sync</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>QR Check-in & Buku Tamu Digital</span>
                </div>
              </div>
            </div>

            {/* Interactive Phone Mockup */}
            <div className="mt-14 max-w-5xl mx-auto relative">
              <div className="flex items-center justify-center space-x-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                {heroThemes.map((thm, idx) => (
                  <button
                    key={thm.name}
                    onClick={() => setHeroThemeIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      heroThemeIndex === idx
                        ? 'bg-slate-900 text-white shadow-md scale-105'
                        : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {thm.name}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center justify-center">
                {/* Floating Elements on Desktop */}
                <div className="hidden md:flex absolute -left-6 top-12 z-20 items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">WhatsApp RSVP Blast</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">✓ 142 Tamu Terkirim Otomatis</div>
                  </div>
                </div>

                <div className="hidden md:flex absolute -right-6 top-16 z-20 items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">RSVP Masuk Real-Time</div>
                    <div className="text-[10px] text-purple-600 font-semibold">Bpk. Hendra Kusuma (+2 Pax)</div>
                  </div>
                </div>

                {/* Central Smartphone Container */}
                <div className="relative w-[300px] sm:w-[340px] h-[580px] sm:h-[620px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800">
                  <div className="w-full h-full rounded-[36px] bg-gradient-to-b text-white p-5 flex flex-col justify-between overflow-hidden relative shadow-inner"
                       style={{ backgroundImage: 'linear-gradient(to bottom, #0f172a, #1e1b4b, #312e81)' }}>
                    <div className="relative z-10 pt-6 text-center">
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white">
                        {heroThemes[heroThemeIndex].badge}
                      </span>
                      <div className="text-[11px] uppercase tracking-widest text-slate-200 mt-3">The Wedding Of</div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1 leading-snug">
                        {heroThemes[heroThemeIndex].couple}
                      </h3>
                    </div>

                    <div className="relative z-10 my-auto">
                      <div className="w-36 h-48 sm:w-40 sm:h-52 mx-auto rounded-2xl overflow-hidden border-2 border-white/40 shadow-2xl relative">
                        <img
                          src={heroThemes[heroThemeIndex].photo}
                          alt="Couple Portrait"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="relative z-10 text-center space-y-2 pb-2">
                      <div className="text-[11px] text-slate-200 font-semibold">
                        {heroThemes[heroThemeIndex].date}
                      </div>
                      <div className="text-[10px] text-slate-300">
                        {heroThemes[heroThemeIndex].venue}
                      </div>
                      <button
                        onClick={() => setShowPublicPreview(true)}
                        className="w-full py-2.5 rounded-xl bg-white text-slate-900 text-xs font-black shadow-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Buka Undangan Digital
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED TEMPLATES (Curated 3 items only) */}
        <section className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-2">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Koleksi Terpilih</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Template Undangan Populer
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Pilihan tema estetik dengan ornamen budaya otentik dan palet warna elegan.
                </p>
              </div>

              <Link
                to="/templates"
                className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span>Lihat Semua Koleksi Template</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <img
                        src={tmpl.defaultCoverPhoto}
                        alt={tmpl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
                          {tmpl.styleTag}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                          {tmpl.category}
                        </div>
                        <h3 className="text-base font-serif font-bold text-white truncate">
                          {tmpl.sampleHosts || tmpl.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{tmpl.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {tmpl.description}
                        </p>
                      </div>
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

                  <div className="p-5 pt-0 flex items-center space-x-2 border-t border-slate-100 mt-2">
                    <button
                      type="button"
                      onClick={() => setActivePreviewTemplate(tmpl)}
                      className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(tmpl)}
                      className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Gunakan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/templates"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <span>Lihat Seluruh Katalog Template (15+ Desain)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CORE FEATURE OVERVIEW (Focused 4 pillars) */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Solusi Lengkap Acara
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
                Semua yang Dibutuhkan untuk Acara Impian
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Dari pembuatan undangan digital hingga penerimaan tamu di meja resepsionis hari-H.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Undangan Sinematik</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Animasi elegan, musik syahdu, galeri foto, kisah cinta, dan countdown hari-H otomatis.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-4">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Buku Tamu QR & E-Pass</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Check-in 0.5 detik tanpa antre, nomor meja VIP, dan rekap tamu otomatis real-time.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-4">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Auto RSVP WhatsApp</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Sebar undangan dengan nama personal ke WhatsApp dan pantau konfirmasi kehadiran seketika.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-black mb-4">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">PWA & Offline Scanner</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Bisa diinstall ke Android & iPhone, scanner tetap bekerja lancar meski sinyal ballroom drop.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/features"
                className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span>Pelajari Seluruh 15+ Fitur Unggulan Secara Rinci</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (3 Simple Steps) */}
        <section className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Alur Praktis & Mudah
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Cara Kerja AA Event Maker
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Hanya butuh 3 langkah mudah untuk menyelesaikan undangan dan menyebarkannya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Pilih Tema & Desain</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Eksplorasi katalog template pernikahan adat nusantara, modern minimalis, ataupun acara perusahaan.
                </p>
              </div>

              <div className="text-center space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">Lengkapi Info & Foto</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Masukkan jadwal acara, lokasi Google Maps, foto galeri prewedding, dan tentukan daftar tamu undangan.
                </p>
              </div>

              <div className="text-center space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">Sebar & Sambut Tamu</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Kirim link personal via WhatsApp, rekap RSVP otomatis, dan scan tiket QR E-Pass tamu di hari resepsi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SHORT PRICING PREVIEW */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Investasi Acara
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Paket Fleksibel & Terjangkau
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Mulai gratis untuk syukuran keluarga, atau upgrade untuk pernikahan penuh keanggunan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Starter */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Starter Free</h3>
                  <div className="text-2xl font-black text-slate-900 mt-2">Rp 0</div>
                  <p className="text-xs text-slate-500 mt-1">Hingga 100 tamu & E-Pass QR standar</p>
                </div>
                <Link
                  to="/pricing"
                  className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 text-center"
                >
                  Detail Paket ➔
                </Link>
              </div>

              {/* Pro */}
              <div className="p-6 rounded-2xl bg-blue-600 text-white shadow-xl flex flex-col justify-between relative">
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-orange-500 text-[10px] font-black uppercase">
                  Terfavorit
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Wedding Pro</h3>
                  <div className="text-2xl font-black text-white mt-2">Rp 299.000</div>
                  <p className="text-xs text-blue-100 mt-1">Unlimited tamu, tema sinematik & WhatsApp blast</p>
                </div>
                <Link
                  to="/pricing"
                  className="mt-6 w-full py-2.5 rounded-xl bg-white text-blue-900 text-xs font-bold hover:bg-blue-50 text-center shadow-md"
                >
                  Pilih Professional ➔
                </Link>
              </div>

              {/* EO */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">EO & Agency</h3>
                  <div className="text-2xl font-black text-slate-900 mt-2">Rp 899.000</div>
                  <p className="text-xs text-slate-500 mt-1">Multi-event, vendor portal & rekap Excel</p>
                </div>
                <Link
                  to="/pricing"
                  className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 text-center"
                >
                  Detail Paket ➔
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/pricing"
                className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span>Bandingkan Fitur Lengkap di Halaman Paket Harga</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-16 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Siap Menghadirkan Undangan Impian Anda?
            </h2>
            <p className="text-xs sm:text-base text-blue-100 mt-3 max-w-xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan calon pengantin dan event organizer yang telah mempercayakan perayaan mereka bersama AA Event Maker.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/create')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer"
              >
                Mulai Buat Undangan Sekarang
              </button>
              <button
                onClick={() => navigate('/templates')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
              >
                Jelajahi Pilihan Desain
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      {activePreviewTemplate && (
        <TemplateDetailModal
          template={activePreviewTemplate}
          onClose={() => setActivePreviewTemplate(null)}
          onUseTemplate={(tmpl) => {
            handleUseTemplate(tmpl);
            setActivePreviewTemplate(null);
          }}
        />
      )}
    </div>
  );
};
