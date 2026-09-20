import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  Share2,
  QrCode,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { AALogo } from '../components/AALogo';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { GoogleAdSlot } from '../components/GoogleAdSlot';
import { TemplateDetailModal } from '../components/TemplateDetailModal';
import { PromotionalFeaturesShowcase } from '../components/PromotionalFeaturesShowcase';
import { ShareWhatsAppButton } from '../components/ShareWhatsAppButton';
import { SeoMetadata } from '../components/SeoMetadata';
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

  // Hero Mockup Interactive State
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
      date: 'Sabtu, 31 Oktober 2026',
      venue: 'Puri Santrian Sanur Pavilion, Denpasar',
      badge: 'Payas Agung & Candi Bentar',
      photo: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Modern Minimalist Serif',
      category: 'Editorial Modern',
      bgClass: 'from-[#09090b] via-[#18181b] to-[#71717a]',
      accentColor: '#e4e4e7',
      couple: 'Julian Alexander & Samantha Grace',
      date: 'Jumat, 16 Oktober 2026',
      venue: 'The Glasshouse Senayan, Jakarta',
      badge: 'Clean Monochrome Editorial',
      photo: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Auto rotate hero mockup themes every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroThemeIndex((prev) => (prev + 1) % heroThemes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroThemes.length]);

  const categories = [
    'Semua',
    'Wedding',
    'Adat Nusantara',
    'Modern Minimalist',
    'Birthday',
    'Corporate',
    'Islamic',
    'Anniversary',
    'Graduation',
    'Kids',
  ];

  const filteredTemplates =
    selectedCategory === 'Semua'
      ? templates
      : templates.filter((t) => {
          if (selectedCategory === 'Wedding') return t.category === 'Wedding';
          if (selectedCategory === 'Adat Nusantara')
            return t.category === 'Adat Heritage' || t.title.toLowerCase().includes('jawa') || t.title.toLowerCase().includes('sunda') || t.title.toLowerCase().includes('bali');
          if (selectedCategory === 'Modern Minimalist') return t.category === 'Modern' || t.title.toLowerCase().includes('minimalist');
          if (selectedCategory === 'Birthday') return t.category === 'Birthday';
          if (selectedCategory === 'Corporate') return t.category === 'Corporate';
          if (selectedCategory === 'Islamic') return t.category === 'Islamic';
          if (selectedCategory === 'Anniversary') return t.category === 'Anniversary';
          if (selectedCategory === 'Graduation') return t.category === 'Graduation';
          if (selectedCategory === 'Kids') return t.category === 'Kids' || t.category === 'Baby';
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
      <SeoMetadata
        title="AA Event Maker – Create Beautiful Digital Invitations"
        description="Create beautiful animated digital invitations for weddings, engagements, birthdays, and special events with AA Event Maker."
        canonicalPath="/"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

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
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-blue-50/80 via-white to-slate-50">
        {/* Background radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-200/30 via-indigo-200/20 to-orange-200/30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold mb-6 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Platform Undangan Digital & Manajemen Tamu Modern No. 1</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-tight"
            >
              Create. Customize. Celebrate.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: 'easeOut' }}
              className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              Create beautiful animated digital invitations, manage your guests, share instantly, and make every event memorable.
            </motion.p>

            {/* Primary Call to Actions with entrance animation & Share via WhatsApp */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.36, ease: 'easeOut' }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
            >
              <button
                onClick={handleCreateInvitationCTA}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Create Invitation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToTemplates}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Palette className="w-4 h-4 text-indigo-600" />
                <span>Explore Templates</span>
              </button>

              <button
                onClick={() => setShowPublicPreview(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-pink-600" />
                <span>Lihat Live Preview</span>
              </button>

              <ShareWhatsAppButton
                variant="secondary"
                size="md"
                label="Share via WhatsApp"
                className="w-full sm:w-auto"
              />
            </motion.div>

            {/* Micro proof badges with entrance animation */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
              className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500 font-medium"
            >
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
            </motion.div>
          </div>

          {/* ANIMATED MOCKUP HERO SHOWCASE (Mobile Phone + Desktop Preview + Floating UI) */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.62, ease: 'easeOut' }}
            className="mt-14 max-w-5xl mx-auto relative"
          >
            {/* Theme Selector Tabs above Mockup */}
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

            {/* Center Stage: Framed Phone Mockup & Surrounding Floating Badges */}
            <div className="relative flex items-center justify-center">
              {/* Floating Element 1 (Top Left): WhatsApp Guest Blast Status */}
              <div className="hidden md:flex absolute -left-6 top-12 z-20 items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 animate-bounce duration-1000">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <Share2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">WhatsApp RSVP Blast</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">✓ 142 Tamu Terkirim Otomatis</div>
                </div>
              </div>

              {/* Floating Element 2 (Bottom Left): Live Music Equalizer */}
              <div className="hidden md:flex absolute -left-4 bottom-16 z-20 items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">Harmoni Romantis</div>
                  <div className="text-[10px] text-blue-600 font-semibold">🎵 Piano & Gamelan Pelog Halus</div>
                </div>
              </div>

              {/* Floating Element 3 (Top Right): Realtime RSVP Counter */}
              <div className="hidden md:flex absolute -right-6 top-16 z-20 items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">RSVP Masuk Real-Time</div>
                  <div className="text-[10px] text-purple-600 font-semibold">Bpk. Hendra Kusuma (+2 Pax)</div>
                </div>
              </div>

              {/* Floating Element 4 (Bottom Right): QR Scanner Verified */}
              <div className="hidden md:flex absolute -right-4 bottom-12 z-20 items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">E-Pass Terverifikasi</div>
                  <div className="text-[10px] text-emerald-600 font-bold">✓ Scan Kamera 0.5 Detik</div>
                </div>
              </div>

              {/* Central Smartphone Container Mockup */}
              <div className="relative w-[300px] sm:w-[340px] h-[580px] sm:h-[620px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/10">
                {/* Speaker notch / dynamic island */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>

                {/* Phone Screen Contents with Dynamic Theme Transition */}
                <div
                  className={`w-full h-full rounded-[36px] bg-gradient-to-b ${heroThemes[heroThemeIndex].bgClass} text-white p-5 flex flex-col justify-between overflow-hidden relative transition-all duration-700 shadow-inner`}
                >
                  {/* Subtle Pattern Overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Header inside phone */}
                  <div className="relative z-10 pt-6 text-center">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white">
                      {heroThemes[heroThemeIndex].badge}
                    </span>
                    <div className="text-[11px] uppercase tracking-widest text-slate-200 mt-3">The Wedding Of</div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1 leading-snug">
                      {heroThemes[heroThemeIndex].couple}
                    </h3>
                  </div>

                  {/* Middle: Couple Photo Box */}
                  <div className="relative z-10 my-auto">
                    <div className="w-36 h-48 sm:w-40 sm:h-52 mx-auto rounded-2xl overflow-hidden border-2 border-white/40 shadow-2xl relative group">
                      <img
                        src={heroThemes[heroThemeIndex].photo}
                        alt="Couple Portrait"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  </div>

                  {/* Footer inside phone */}
                  <div className="relative z-10 text-center space-y-2 pb-2">
                    <div className="text-[11px] text-slate-200 font-semibold">
                      {heroThemes[heroThemeIndex].date}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      {heroThemes[heroThemeIndex].venue}
                    </div>
                    <button
                      onClick={() => setShowPublicPreview(true)}
                      className="w-full py-2.5 rounded-xl bg-white text-slate-900 text-xs font-black shadow-lg hover:bg-slate-100 transition-colors"
                    >
                      Buka Undangan Digital
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION: PROMOTIONAL ANIMATED FEATURES SHOWCASE */}
      <PromotionalFeaturesShowcase
        onTryBuilder={handleCreateInvitationCTA}
        onExploreTemplates={scrollToTemplates}
      />

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
                <motion.div
                  key={tmpl.id}
                  whileHover={{ y: -8, scale: 1.025 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-blue-300/80 transition-shadow duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Realistic Visual Thumbnail with Cover Image & Motifs */}
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <img
                        src={tmpl.defaultCoverPhoto}
                        alt={tmpl.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90"
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
                </motion.div>
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

                  <div className="flex items-center space-x-2 shrink-0">
                    <ShareWhatsAppButton
                      guestName={searchResult.name}
                      tableNumber={searchResult.tableNumber}
                      checkInCode={searchResult.checkInCode}
                      variant="secondary"
                      size="sm"
                      label="Kirim ke WA"
                    />
                    <button
                      onClick={() => {
                        setSelectedGuestForPass(searchResult);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                    >
                      Buka E-Pass QR
                    </button>
                  </div>
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
