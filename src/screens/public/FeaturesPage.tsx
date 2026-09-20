import React from 'react';
import {
  Mail,
  Camera,
  Video,
  Music,
  MapPin,
  CheckCircle2,
  Users,
  Share2,
  Zap,
  QrCode,
  ScanLine,
  Palette,
  Smartphone,
  Globe,
  Wallet,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';

export const FeaturesPage: React.FC = () => {
  const { navigate } = useRouter();

  const featurePillars = [
    {
      category: 'Desain & Estetika Undangan',
      items: [
        {
          icon: Mail,
          color: 'text-purple-600 bg-purple-50',
          title: 'Undangan Animasi Sinematik',
          description:
            'Animasi pembuka cover yang halus, efek transisi modern, dan tampilan visual beresolusi tinggi yang memukau tamu di layar ponsel.',
          badge: 'Estetik',
        },
        {
          icon: Camera,
          color: 'text-pink-600 bg-pink-50',
          title: 'Unggah Galeri Foto HD & Optimasi Otomatis',
          description:
            'Sematkan foto prewedding dengan kompresi cerdas WebP otomatis tanpa penurunan ketajaman warna.',
          badge: 'Kompresi Cepat',
        },
        {
          icon: Video,
          color: 'text-rose-600 bg-rose-50',
          title: 'Dukungan Video & Teaser Sinematik',
          description:
            'Tautkan video teaser prewedding atau live streaming YouTube / Instagram langsung di dalam badan undangan.',
          badge: 'Video Ready',
        },
        {
          icon: Music,
          color: 'text-indigo-600 bg-indigo-50',
          title: 'Musik Latar & Audio Ambience',
          description:
            'Iringi undangan dengan alunan piano romantis atau gamelan pelog lembut dengan tombol play/mute mengambang yang ramah pengguna.',
          badge: 'Autoplay Ramah',
        },
        {
          icon: Palette,
          color: 'text-amber-600 bg-amber-50',
          title: 'Kustomisasi Tipografi & Adat Nusantara',
          description:
            'Pilihan ornamen otentik Jawa, Sunda, Bali, Minang, Modern Chic, hingga Luxury Gold yang dapat disesuaikan.',
          badge: 'Budaya Otentik',
        },
        {
          icon: Smartphone,
          color: 'text-blue-600 bg-blue-50',
          title: 'Desain Responsif Mobile-First',
          description:
            'Tampilan sempurna di iPhone, Android, tablet, hingga desktop tanpa elemen yang terpotong atau lambat.',
          badge: '100% Responsif',
        },
      ],
    },
    {
      category: 'Manajemen Tamu & RSVP Interaktif',
      items: [
        {
          icon: CheckCircle2,
          color: 'text-emerald-600 bg-emerald-50',
          title: 'Formulir RSVP Real-Time',
          description:
            'Tamu mengonfirmasi kehadiran (Hadir, Ragu, Maaf Tidak Bisa) dengan jumlah pax dan ucapan doa yang langsung tercatat di dasbor.',
          badge: 'Real-Time Sync',
        },
        {
          icon: Users,
          color: 'text-blue-600 bg-blue-50',
          title: 'Pengelompokan Tamu & Nomor Meja VIP',
          description:
            'Atur kategori Keluarga, Teman, Kolega, dan VIP serta alokasi nomor meja secara rapi agar penerimaan tamu teratur.',
          badge: 'VIP Tables',
        },
        {
          icon: Share2,
          color: 'text-teal-600 bg-teal-50',
          title: 'Sebar Undangan WhatsApp Personal',
          description:
            'Kirim pesan WhatsApp berformat resmi dengan otomatis mencantumkan nama khusus tamu (Kepada Yth. Bpk/Ibu...).',
          badge: '1-Click WhatsApp',
        },
        {
          icon: Zap,
          color: 'text-orange-600 bg-orange-50',
          title: 'Penjadwal Pengingat (Auto Reminder Blast)',
          description:
            'Sistem penjadwalan otomatis H-7 atau H-1 untuk mengingatkan tamu agar konfirmasi konsumsi dan tempat duduk akurat.',
          badge: 'Otomatisasi',
        },
      ],
    },
    {
      category: 'Buku Tamu Digital & E-Pass Check-in',
      items: [
        {
          icon: QrCode,
          color: 'text-amber-600 bg-amber-50',
          title: 'Tiket QR E-Pass Eksklusif',
          description:
            'Setiap tamu memiliki tiket QR unik yang dapat diunduh atau disimpan ke screenshot untuk proses registrasi di lokasi.',
          badge: 'Anti Duplikasi',
        },
        {
          icon: ScanLine,
          color: 'text-cyan-600 bg-cyan-50',
          title: 'Scanner Kamera Super Cepat (0.5 Detik)',
          description:
            'Penerima tamu di meja resepsi cukup mengarahkan kamera ponsel tanpa perlu mengetik nama manual atau mengantre panjang.',
          badge: '0.5s Check-in',
        },
        {
          icon: MapPin,
          color: 'text-red-600 bg-red-50',
          title: 'Navigasi Google Maps & Panduan Rute',
          description:
            'Peta lokasi interaktif yang langsung membuka aplikasi Google Maps atau Waze di perangkat tamu dengan satu sentuhan.',
          badge: 'Petunjuk Arah',
        },
        {
          icon: Globe,
          color: 'text-violet-600 bg-violet-50',
          title: 'Tautan Publik & Social Share Cards',
          description:
            'Setiap undangan memiliki URL khusus dengan kartu pratinjau Open Graph cantik saat dibagikan ke WhatsApp, Instagram, atau Facebook.',
          badge: 'SEO & Social Card',
        },
      ],
    },
    {
      category: 'Alat Perencanaan & Ekspor Data',
      items: [
        {
          icon: Wallet,
          color: 'text-emerald-600 bg-emerald-50',
          title: 'Kalkulator Budget Multi-Mata Uang',
          description:
            'Pantau rencana anggaran vs realisasi pengeluaran mingguan dengan konversi multi-currency (IDR, USD, EUR, SGD, JPY).',
          badge: 'Multi-Currency',
        },
        {
          icon: Download,
          color: 'text-slate-600 bg-slate-100',
          title: 'Ekspor Laporan Tamu ke Excel & PDF',
          description:
            'Unduh rekapitulasi kehadiran tamu, daftar meja, dan catatan angpao/ucapan ke format spreadsheet Excel sekali klik.',
          badge: 'Export Excel',
        },
      ],
    },
  ];

  return (
    <div id="features-page" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="Fitur Unggulan – AA Event Maker"
        description="Pelajari seluruh fitur AA Event Maker: Undangan sinematik, buku tamu QR E-Pass, integrasi RSVP WhatsApp, budgeting, dan scanner offline."
        canonicalPath="/features"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Banner */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Teknologi Modern untuk Acara Anda</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Fitur Unggulan AA Event Maker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Didesain khusus untuk memberikan kemudahan bagi Calon Pengantin, Penyelenggara Acara (EO / WO), dan kenyamanan Tamu Undangan.
            </p>
          </div>

          {/* Grouped Feature Sections */}
          <div className="space-y-14">
            {featurePillars.map((pillar, pIdx) => (
              <div key={pillar.category} className="space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                    <span>{pillar.category}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pillar.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${item.color}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              {item.badge}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Card */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ingin Mencoba Semua Fitur Ini Secara Langsung?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-xl mx-auto leading-relaxed">
              Mulai buat proyek acara Anda hari ini tanpa biaya. Eksplorasi template, kelola daftar tamu, dan bagikan undangan dalam hitungan menit.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/create')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-all cursor-pointer"
              >
                Mulai Buat Undangan ➔
              </button>
              <button
                onClick={() => navigate('/templates')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-800/80 text-white font-bold text-xs sm:text-sm border border-white/20 hover:bg-blue-800 transition-all cursor-pointer"
              >
                Lihat Koleksi Template
              </button>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
