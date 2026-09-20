import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Palette,
  Camera,
  Sliders,
  Music,
  Video,
  Image as ImageIcon,
  MapPin,
  CheckCircle2,
  Users,
  Share2,
  Send,
  QrCode,
  ScanLine,
  Smartphone,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { globalAudioPlayer } from '../utils/audioPlayer';

interface FeatureDemo {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const FEATURE_LIST: FeatureDemo[] = [
  {
    id: 'builder',
    title: 'Invitation Builder',
    category: 'Pembuat Undangan',
    tagline: 'Langkah demi langkah terstruktur tanpa coding',
    description: 'Rancang undangan impian Anda hanya dalam 3 langkah mudah: pilih tema budaya, isi detail mempelai/acara, dan publish instan.',
    icon: Sparkles,
    accentColor: '#3b82f6',
  },
  {
    id: 'templates',
    title: 'Template Selection',
    category: 'Koleksi Tema',
    tagline: 'Puluhan tema budaya adat Nusantara & Modern',
    description: 'Jelajahi kekayaan adat Jawa Kraton, Sunda Siger, Bali Ayu, Modern Luxury, Minimalist Noir, hingga Aqiqah dan Wisuda.',
    icon: Palette,
    accentColor: '#8b5cf6',
  },
  {
    id: 'photo_upload',
    title: 'Photo Upload & Presets',
    category: 'Manajemen Foto',
    tagline: 'Kompresi instan & filter warna sinematik',
    description: 'Unggah foto cover, potret mempelai, dan galeri beresolusi tinggi. Otomatis teroptimasi cepat untuk jaringan seluler.',
    icon: Camera,
    accentColor: '#ec4899',
  },
  {
    id: 'customization',
    title: 'Customization Studio',
    category: 'Personalisasi Lengkap',
    tagline: 'Ubah font, aksen warna, dan tata letak secara real-time',
    description: 'Sesuaikan tipografi Serif klasik, Modern Sans, tata letak dekorasi, ayat suci, dan kutipan cinta sesuai selera.',
    icon: Sliders,
    accentColor: '#f59e0b',
  },
  {
    id: 'music',
    title: 'Background Music & Audio',
    category: 'Audio Syahdu',
    tagline: 'Alunan arpeggio romantis otomatis berputar',
    description: 'Lengkapi undangan Anda dengan backsound piano akustik, gamelan pelog lembut, atau lagu pilihan keluarga.',
    icon: Music,
    accentColor: '#10b981',
  },
  {
    id: 'video',
    title: 'Cinematic Video Embed',
    category: 'Sinematik Video',
    tagline: 'Tampilkan video prewedding & teaser momen',
    description: 'Sematkan video teaser YouTube / Vimeo atau klip MP4 beresolusi tinggi yang terputar mulus di semua smartphone.',
    icon: Video,
    accentColor: '#ef4444',
  },
  {
    id: 'gallery',
    title: 'Interactive Photo Gallery',
    category: 'Galeri Momen',
    tagline: 'Grid responsif dengan Lightbox Zoom layar penuh',
    description: 'Bagi kisah visual Anda dalam tata letak kisi rapi. Tamu dapat memperbesar foto dengan sentuhan mulus.',
    icon: ImageIcon,
    accentColor: '#6366f1',
  },
  {
    id: 'maps',
    title: 'Interactive Maps & Direction',
    category: 'Peta & Lokasi',
    tagline: 'Navigasi satu sentuhan ke Google Maps',
    description: 'Tamu tidak akan tersesat. Rute akurat menuju Masjid, Gereja, atau Ballroom tersemat langsung dengan estimasi waktu tiba.',
    icon: MapPin,
    accentColor: '#0ea5e9',
  },
  {
    id: 'rsvp',
    title: 'Real-Time RSVP Tracker',
    category: 'Konfirmasi Kehadiran',
    tagline: 'Rekap otomatis jumlah tamu & pax secara akurat',
    description: 'Tamu mengirimkan konfirmasi kehadiran, kuota jumlah orang (Pax), dan ucapan doa yang langsung masuk ke dasbor Anda.',
    icon: CheckCircle2,
    accentColor: '#14b8a6',
  },
  {
    id: 'guest_mgmt',
    title: 'Guest Management & VIP',
    category: 'Buku Tamu Cerdas',
    tagline: 'Atur alokasi meja VIP, Family, & Sahabat',
    description: 'Kelompokkan tamu berdasarkan kategori, atur nomor meja resepsi, dan unduh laporan Excel/PDF siap cetak.',
    icon: Users,
    accentColor: '#d97706',
  },
  {
    id: 'whatsapp_share',
    title: 'WhatsApp Personalized Sharing',
    category: 'Berbagi WhatsApp',
    tagline: 'Kirim undangan personal dengan nama tamu tercantum',
    description: 'Tautan dibuat khusus untuk setiap tamu (contoh: ?to=Bpk+Hendra). Format teks WhatsApp rapi lengkap dengan emoji.',
    icon: MessageCircle,
    accentColor: '#22c55e',
  },
  {
    id: 'whatsapp_blast',
    title: 'WhatsApp Broadcast & Blast',
    category: 'Pengingat Massal',
    tagline: 'Kirim pengingat H-7 dan H-1 ke ratusan tamu',
    description: 'Otomatisasi pengiriman pesan pengingat acara ke seluruh tamu yang belum mengisi RSVP dengan satu klik praktis.',
    icon: Send,
    accentColor: '#2563eb',
  },
  {
    id: 'qr_code',
    title: 'QR Code E-Pass Generation',
    category: 'Tiket QR Tamu',
    tagline: 'Tiket digital eksklusif bebas calo & bebas duplikat',
    description: 'Setiap tamu menerima kode QR E-Pass unik yang menyimpan informasi nama, kategori VIP, dan alokasi meja.',
    icon: QrCode,
    accentColor: '#4f46e5',
  },
  {
    id: 'qr_checkin',
    title: 'High-Speed QR Check-in',
    category: 'Resepsionis Kilat',
    tagline: 'Scan dengan kamera HP hanya dalam 0,5 detik',
    description: 'Buku tamu modern tanpa kertas antrean. Scan QR tamu di pintu masuk, verifikasi status, dan catat jam kehadiran instan.',
    icon: ScanLine,
    accentColor: '#059669',
  },
  {
    id: 'android_app',
    title: 'Android Mobile Application',
    category: 'Aplikasi Android & PWA',
    tagline: 'Akses penuh organizer kapan saja, bahkan saat offline',
    description: 'Sinkronisasi instan antara Web dan Aplikasi Android. Resepsionis dapat melakukan check-in tanpa koneksi internet stabil.',
    icon: Smartphone,
    accentColor: '#ea580c',
  },
];

export const PromotionalFeaturesShowcase: React.FC<{
  onTryBuilder?: () => void;
  onExploreTemplates?: () => void;
}> = ({ onTryBuilder, onExploreTemplates }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState(true);
  const [musicDemoPlaying, setMusicDemoPlaying] = useState(false);
  const [customColor, setCustomColor] = useState('#f59e0b');
  const [customFont, setCustomFont] = useState<'font-serif' | 'font-sans'>('font-serif');
  const [simulatedRsvpCount, setSimulatedRsvpCount] = useState(184);
  const [rsvpFeedback, setRsvpFeedback] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const activeFeature = FEATURE_LIST[activeIdx];

  // Auto progression
  useEffect(() => {
    if (!isPlayingAuto) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % FEATURE_LIST.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlayingAuto]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % FEATURE_LIST.length);
    setIsPlayingAuto(false);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + FEATURE_LIST.length) % FEATURE_LIST.length);
    setIsPlayingAuto(false);
  };

  const handleSelectFeature = (idx: number) => {
    setActiveIdx(idx);
    setIsPlayingAuto(false);
  };

  // Toggle ambient music in music demo
  const handleToggleMusicDemo = () => {
    const playing = globalAudioPlayer.toggle();
    setMusicDemoPlaying(playing);
  };

  const handleSimulateRsvp = (name: string) => {
    setSimulatedRsvpCount((c) => c + 2);
    setRsvpFeedback(`✓ RSVP Berhasil: ${name} (+2 Pax)`);
    setTimeout(() => setRsvpFeedback(null), 3000);
  };

  const handleSimulateScan = () => {
    setScannerActive(true);
    setScannedResult(null);
    setTimeout(() => {
      setScannerActive(false);
      setScannedResult('✓ VERIFIKASI SUKSES: Bpk. Hendra Kusuma (VIP 01 • 2 Pax)');
    }, 1200);
  };

  return (
    <section id="demo-fitur" className="py-20 bg-slate-950 text-white relative overflow-hidden border-y border-slate-800">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulasi Nyata & Demonstrasi Animasi Interaktif</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Eksplorasi Seluruh Fitur Unggulan
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2.5 max-w-2xl mx-auto leading-relaxed">
            Klik dan saksikan cara kerja AA Event Maker mengotomatisasi setiap fase acara Anda mulai dari pembuatan hingga penyambutan tamu di lokasi.
          </p>
        </div>

        {/* Feature Navigation Pills Carousel */}
        <div className="relative mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
            {FEATURE_LIST.map((feat, idx) => {
              const Icon = feat.icon;
              const isActive = idx === activeIdx;
              return (
                <button
                  key={feat.id}
                  onClick={() => handleSelectFeature(idx)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/25 scale-102'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{feat.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Demonstration Stage (Split Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Left Column: Feature Narrative & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Fitur #{activeIdx + 1} dari {FEATURE_LIST.length} • {activeFeature.category}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title={isPlayingAuto ? 'Jeda otomatis' : 'Mulai putar otomatis'}
                >
                  {isPlayingAuto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {activeFeature.title}
              </h3>
              <p className="text-sm font-semibold text-blue-400 mt-1">
                {activeFeature.tagline}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                {activeFeature.description}
              </p>
            </div>

            {/* Feature Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onTryBuilder}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Coba Buat Undangan</span>
              </button>
              <button
                onClick={onExploreTemplates}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Lihat Koleksi Template</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Live Animated Mockup Simulator */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 sm:p-6 min-h-[380px] flex items-center justify-center relative overflow-hidden">
            {/* 1. BUILDER SIMULATION */}
            {activeFeature.id === 'builder' && (
              <div className="w-full max-w-md space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-300">Live Builder Simulator</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-300 font-mono">
                    Status: Auto-Drafting
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/40 space-y-1.5">
                    <div className="flex items-center space-x-2 text-xs font-bold text-blue-400">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                      <span>Pilih Tema Acara</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-7">
                      Tema terpilih: <strong className="text-amber-300">Golden Night (Luxury Gold)</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                      <span>Data Mempelai & Jadwal</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-7">
                      Andi Pratama & Ayu Maharani • 24 Oktober 2026
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">3</span>
                      <span>Publikasikan & Dapatkan Link</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 pl-7 font-mono">
                      https://aa-eventmaker.my.id/#invitation/andi-ayu
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>✓ 100% Responsif di Layar HP & Tablet</span>
                  <span className="text-emerald-400 font-bold">Siap Dibagikan</span>
                </div>
              </div>
            )}

            {/* 2. TEMPLATES SLIDER SIMULATION */}
            {activeFeature.id === 'templates' && (
              <div className="w-full max-w-md space-y-4 animate-in fade-in">
                <div className="text-xs font-bold text-slate-300 text-center mb-2">
                  Preview Multi-Tema Berbudaya
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#271506] to-[#d97706] text-white text-center border border-amber-500/40 shadow-md">
                    <div className="text-lg">👑</div>
                    <div className="text-[11px] font-bold mt-1">Jawa Solo</div>
                    <div className="text-[9px] text-amber-200">Batik Kraton</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#064e3b] to-[#10b981] text-white text-center border border-emerald-500/40 shadow-md">
                    <div className="text-lg">🌿</div>
                    <div className="text-[11px] font-bold mt-1">Sunda Siger</div>
                    <div className="text-[9px] text-emerald-200">Bunga Melati</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#701a75] to-[#f59e0b] text-white text-center border border-purple-500/40 shadow-md">
                    <div className="text-lg">🌺</div>
                    <div className="text-[11px] font-bold mt-1">Bali Ayu</div>
                    <div className="text-[9px] text-pink-200">Candi Bentar</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#09090b] to-[#71717a] text-white text-center border border-slate-700 shadow-md">
                    <div className="text-lg">✨</div>
                    <div className="text-[11px] font-bold mt-1">Minimalist</div>
                    <div className="text-[9px] text-slate-300">Clean Noir</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#581c87] to-[#f43f5e] text-white text-center border border-pink-500/40 shadow-md">
                    <div className="text-lg">🎉</div>
                    <div className="text-[11px] font-bold mt-1">Birthday</div>
                    <div className="text-[9px] text-pink-200">Sweet 17th</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#0284c7] text-white text-center border border-blue-500/40 shadow-md">
                    <div className="text-lg">🏛️</div>
                    <div className="text-[11px] font-bold mt-1">Corporate</div>
                    <div className="text-[9px] text-blue-200">Gala Dinner</div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PHOTO UPLOAD SIMULATION */}
            {activeFeature.id === 'photo_upload' && (
              <div className="w-full max-w-md space-y-4 animate-in fade-in">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Photo Manager & Preset</span>
                  <span className="text-emerald-400 text-[10px]">Auto Compression 92%</span>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700 shadow-xl group">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                    alt="Photo Uploaded"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white text-xs">
                      <div className="font-bold">Potret Mempelai Berdua</div>
                      <div className="text-[10px] text-slate-300">preset: Warm 35mm Film Tone • 400KB WebP</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                  <span>✓ Drag & Drop</span>
                  <span>•</span>
                  <span>✓ Potong & Sesuaikan Posisi</span>
                  <span>•</span>
                  <span>✓ Galeri Tanpa Batas</span>
                </div>
              </div>
            )}

            {/* 4. CUSTOMIZATION SIMULATION */}
            {activeFeature.id === 'customization' && (
              <div className="w-full max-w-md space-y-4 animate-in fade-in">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Ubah Aksen Warna & Font Secara Interaktif:</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <div className="text-xs uppercase tracking-widest text-slate-400">The Wedding Of</div>
                  <h4
                    className={`text-2xl font-bold transition-all duration-300 ${customFont}`}
                    style={{ color: customColor }}
                  >
                    Andi Pratama & Ayu Maharani
                  </h4>
                  <p className="text-[11px] text-slate-400">Sabtu, 24 Oktober 2026 • Plataran Jakarta</p>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-400">Font:</span>
                    <button
                      onClick={() => setCustomFont('font-serif')}
                      className={`px-2.5 py-1 rounded-lg border text-xs ${
                        customFont === 'font-serif' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      Serif
                    </button>
                    <button
                      onClick={() => setCustomFont('font-sans')}
                      className={`px-2.5 py-1 rounded-lg border text-xs ${
                        customFont === 'font-sans' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      Sans
                    </button>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-400">Warna:</span>
                    {['#f59e0b', '#ec4899', '#10b981', '#38bdf8', '#a855f7'].map((col) => (
                      <button
                        key={col}
                        onClick={() => setCustomColor(col)}
                        className={`w-5 h-5 rounded-full border-2 transition-transform ${
                          customColor === col ? 'scale-125 border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. MUSIC & AUDIO SIMULATION */}
            {activeFeature.id === 'music' && (
              <div className="w-full max-w-md text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <Music className="w-8 h-8 animate-bounce" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">
                    {globalAudioPlayer.getCurrentTrackName()}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Alunan lembut mengiringi tamu saat membaca undangan
                  </p>
                </div>

                {/* Animated Equalizer Sound Waves */}
                <div className="flex items-center justify-center space-x-1.5 h-10">
                  {[40, 75, 100, 60, 85, 45, 95, 70, 50, 80].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-emerald-400 rounded-full transition-all duration-300"
                      style={{
                        height: musicDemoPlaying ? `${h}%` : '20%',
                        opacity: musicDemoPlaying ? 0.9 : 0.4,
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={handleToggleMusicDemo}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
                  >
                    {musicDemoPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{musicDemoPlaying ? 'Matikan Audio' : 'Tes Putar Audio Nyata'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 6. VIDEO EMBED SIMULATION */}
            {activeFeature.id === 'video' && (
              <div className="w-full max-w-md space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Cinematic Video Player</span>
                  <span className="text-rose-400 text-[10px]">Full HD Streaming</span>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl flex items-center justify-center group">
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="relative z-10 w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                  <div className="absolute bottom-3 left-3 text-white text-xs">
                    <div className="font-bold">Our Prewedding Cinematic Journey</div>
                    <div className="text-[10px] text-slate-300">03:42 • Directed by Mahkota Cinema</div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. GALLERY SIMULATION */}
            {activeFeature.id === 'gallery' && (
              <div className="w-full max-w-md space-y-2.5 animate-in fade-in">
                <div className="text-xs font-bold text-slate-300">Photo Gallery Lightbox</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=300&q=80',
                  ].map((url, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-800 hover:scale-105 transition-transform">
                      <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Sentuh foto untuk membuka mode zoom resolusi tinggi
                </p>
              </div>
            )}

            {/* 8. MAPS SIMULATION */}
            {activeFeature.id === 'maps' && (
              <div className="w-full max-w-md space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-300">Integrasi Navigasi Lokasi Google Maps</div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Grand Ballroom Plataran Dharmawangsa</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Jl. Dharmawangsa Raya No. 6, Kebayoran Baru, Jakarta Selatan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-emerald-400">✓ Titik koordinat GPS tersinkron</span>
                    <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300">1-Klik Rute</span>
                  </div>
                </div>
              </div>
            )}

            {/* 9. RSVP SIMULATION */}
            {activeFeature.id === 'rsvp' && (
              <div className="w-full max-w-md space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Simulasi Pengisian RSVP Nyata</span>
                  <span className="text-emerald-400 font-bold font-mono">Total Hadir: {simulatedRsvpCount} Pax</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="text-xs text-slate-300">Uji coba klik tombol untuk mengirimkan RSVP langsung:</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSimulateRsvp('Bpk. Suryautama & Keluarga')}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      + Konfirmasi Hadir (2 Pax)
                    </button>
                    <button
                      onClick={() => handleSimulateRsvp('dr. Indah Permatasari')}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      + Konfirmasi VIP (2 Pax)
                    </button>
                  </div>
                  {rsvpFeedback && (
                    <div className="text-[11px] text-emerald-300 font-semibold bg-emerald-950/80 p-2 rounded-lg text-center animate-in fade-in">
                      {rsvpFeedback}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 10. GUEST MANAGEMENT SIMULATION */}
            {activeFeature.id === 'guest_mgmt' && (
              <div className="w-full max-w-md space-y-2.5 animate-in fade-in">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Guest Roster & Seating Table</span>
                  <span className="text-purple-400 text-[10px]">Smart Filtering</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Bpk. Hendra Kusuma & Partner</div>
                      <div className="text-[10px] text-slate-400">Kode: AA-HK99 • 2 Pax</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 font-bold text-[10px]">
                      Meja VIP 01
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Keluarga Besar Sastroamidjojo</div>
                      <div className="text-[10px] text-slate-400">Kode: AA-SF42 • 4 Pax</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-300 font-bold text-[10px]">
                      Meja Family 02
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 11. WHATSAPP SHARING SIMULATION */}
            {activeFeature.id === 'whatsapp_share' && (
              <div className="w-full max-w-md space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-300 flex items-center space-x-1.5 text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>Preview Pesan WhatsApp Resmi</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0b141a] border border-[#222e35] text-[11px] text-slate-200 font-sans space-y-2 shadow-inner">
                  <div className="text-slate-400 text-[10px]">Kepada Yth. Bpk. Hendra Kusuma,</div>
                  <p className="leading-relaxed">
                    Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu untuk hadir pada perayaan pernikahan kami:
                    <br />
                    💍 *The Wedding of Andi & Ayu*
                    <br />
                    🗓️ *Sabtu, 24 Oktober 2026*
                    <br />
                    📍 *Plataran Dharmawangsa Jakarta*
                  </p>
                  <div className="p-2 rounded-lg bg-[#202c33] text-emerald-300 font-mono text-[10px] break-all">
                    https://aa-eventmaker.my.id/#invitation/andi-ayu?to=Hendra+Kusuma
                  </div>
                </div>
              </div>
            )}

            {/* 12. WHATSAPP BLAST SIMULATION */}
            {activeFeature.id === 'whatsapp_blast' && (
              <div className="w-full max-w-md space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Auto Broadcast & Blast</span>
                  <span className="text-blue-400 text-[10px]">H-3 Pengingat</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Sasaran Broadcast:</span>
                    <span className="font-bold text-white">48 Tamu Pending</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Terkirim: 36/48 Tamu</span>
                    <span className="text-emerald-400 font-bold">Terkonfirmasi</span>
                  </div>
                </div>
              </div>
            )}

            {/* 13. QR CODE PASS SIMULATION */}
            {activeFeature.id === 'qr_code' && (
              <div className="w-full max-w-xs text-center space-y-3 animate-in fade-in">
                <div className="p-5 bg-white text-slate-900 rounded-2xl shadow-xl space-y-2">
                  <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">E-PASS RESMI</div>
                  <div className="w-32 h-32 mx-auto bg-slate-100 rounded-xl p-2 border border-slate-200 flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <div className="text-xs font-black">Bpk. Hendra Kusuma</div>
                  <div className="text-[10px] text-slate-600 font-mono">KODE: AA-HK99 • MEJA VIP 01</div>
                </div>
              </div>
            )}

            {/* 14. QR CHECKIN SCANNER SIMULATION */}
            {activeFeature.id === 'qr_checkin' && (
              <div className="w-full max-w-md space-y-3 animate-in fade-in text-center">
                <div className="text-xs font-bold text-slate-300">Simulasi Scanner Kamera Android / Web</div>

                <div className="relative aspect-video rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                  <div className="w-36 h-36 border-2 border-emerald-400 rounded-xl relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-400/10 animate-pulse" />
                    <ScanLine className="w-10 h-10 text-emerald-400 animate-bounce" />
                  </div>
                  {scannerActive && (
                    <div className="absolute inset-0 bg-emerald-950/70 flex items-center justify-center text-xs font-bold text-emerald-300 animate-in fade-in">
                      Memindai QR E-Pass...
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSimulateScan}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Uji Coba Scan Kamera (0,5 Detik)
                </button>

                {scannedResult && (
                  <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-bold animate-in fade-in">
                    {scannedResult}
                  </div>
                )}
              </div>
            )}

            {/* 15. ANDROID APP SIMULATION */}
            {activeFeature.id === 'android_app' && (
              <div className="w-full max-w-md space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Android Companion & Native Sync</span>
                  <span className="text-orange-400 text-[10px]">Play Store Ready</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Izin Kamera & File Storage Resmi Android</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Offline PWA Caching untuk resepsionis tanpa sinyal</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Share2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Integrasi Native Android Share Sheet</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Nikmati pengalaman desktop dan mobile yang selalu sinkron tanpa jeda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
