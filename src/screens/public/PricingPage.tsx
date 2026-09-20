import React from 'react';
import {
  Check,
  X,
  CreditCard,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';

export const PricingPage: React.FC = () => {
  const { navigate } = useRouter();

  const plans = [
    {
      id: 'starter',
      name: 'Starter Free',
      badge: 'Syukuran & Keluarga',
      price: 'Rp 0',
      period: 'Gratis Selamanya',
      description: 'Cocok untuk acara keluarga kecil, syukuran khitanan, atau perayaan ulang tahun sederhana.',
      features: [
        '1 Acara / Proyek Aktif',
        'Hingga 100 Tamu Undangan',
        'Template Digital Standar',
        'Tiket QR E-Pass & Buku Tamu Standar',
        'Formulir RSVP Sederhana',
        'Petunjuk Lokasi Google Maps',
        'Masa Aktif Undangan 3 Bulan',
      ],
      cta: 'Mulai Gratis',
      isPopular: false,
      buttonClass: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
    {
      id: 'professional',
      name: 'Wedding Professional',
      badge: 'Paling Favorit',
      price: 'Rp 299.000',
      period: 'Sekali Bayar / Acara',
      description: 'Pilihan utama calon pengantin modern yang menginginkan kemewahan visual dan integrasi lengkap.',
      features: [
        'Unlimited Tamu Undangan',
        'Seluruh Template Sinematik & Adat Nusantara',
        'Custom Musik Latar & Audio Ambience',
        'Galeri Foto HD & Video Teaser Prewedding',
        'Auto Reminder RSVP Blast ke WhatsApp Tamu',
        'Scanner E-Pass Cepat 0.5 Detik (PWA Offline)',
        'Dasbor Khusus Pengantin & Rekap Angpao',
        'Masa Aktif Undangan 1 Tahun',
      ],
      cta: 'Pilih Professional',
      isPopular: true,
      buttonClass: 'bg-white text-blue-900 hover:bg-blue-50 shadow-md font-black',
    },
    {
      id: 'agency',
      name: 'EO & Agency',
      badge: 'Wedding Organizer',
      price: 'Rp 899.000',
      period: 'Lisensi 1 Tahun / Organizer',
      description: 'Didesain untuk Wedding Organizer, Event Planner, dan Agensi yang menangani banyak klien sekaligus.',
      features: [
        'Kelola Banyak Proyek Acara Tanpa Batas',
        'Semua Fitur Wedding Professional',
        'Portal Kolaborasi Multi-Vendor (Foto, Catering)',
        'Ekspor Laporan Tamu & Kehadiran ke Excel/PDF',
        'Kalkulator Budgeting Multi-Mata Uang',
        'Bebas Watermark & Branding Fleksibel',
        'Dukungan Prioritas WhatsApp 24/7',
      ],
      cta: 'Pilih Agency',
      isPopular: false,
      buttonClass: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
  ];

  const comparisonRows = [
    { name: 'Kapasitas Tamu Undangan', starter: '100 Tamu', pro: 'Tanpa Batas (Unlimited)', agency: 'Tanpa Batas (Unlimited)' },
    { name: 'Akses Template Adat & Sinematik', starter: 'Koleksi Dasar', pro: 'Seluruh Katalog (15+ Tema)', agency: 'Seluruh Katalog (15+ Tema)' },
    { name: 'Unggah Foto & Galeri', starter: '3 Foto', pro: 'Hingga 20 Foto HD', agency: 'Foto & Video Tanpa Batas' },
    { name: 'Musik Latar & Audio Ambience', starter: 'Musik Default', pro: 'Custom Lagu / MP3 Bebas', agency: 'Custom Lagu / MP3 Bebas' },
    { name: 'Sebar WhatsApp dengan Nama Tamu', starter: true, pro: true, agency: true },
    { name: 'Auto WhatsApp RSVP Reminder Blast', starter: false, pro: true, agency: true },
    { name: 'Tiket QR E-Pass & Buku Tamu Digital', starter: true, pro: true, agency: true },
    { name: 'Scanner Kamera PWA Offline 0.5 Detik', starter: false, pro: true, agency: true },
    { name: 'Dasbor Budgeting Multi-Currency', starter: false, pro: true, agency: true },
    { name: 'Portal Kolaborasi Vendor & Pengantin', starter: false, pro: false, agency: true },
    { name: 'Ekspor Rekapitulasi Excel & PDF', starter: false, pro: true, agency: true },
    { name: 'Dukungan Prioritas WhatsApp 24/7', starter: 'Email Standar', pro: 'Chat WhatsApp Prioritas', agency: 'Dedicated Account Manager' },
  ];

  return (
    <div id="pricing-page" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="Paket Harga & Biaya Transparan – AA Event Maker"
        description="Pilihan paket undangan digital mulai dari gratis hingga Wedding Pro Rp 299.000 tanpa biaya tersembunyi bersama AA Event Maker."
        canonicalPath="/pricing"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Biaya Transparan & Fleksibel</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Pilihan Paket Tanpa Biaya Tersembunyi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Pilih paket yang paling tepat sesuai skala acara Anda. Dari syukuran hangat keluarga hingga resepsi akbar bernuansa keraton.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 items-stretch">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  p.isPopular
                    ? 'bg-gradient-to-b from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-2xl relative scale-102 sm:-translate-y-2'
                    : 'bg-white border border-slate-200 shadow-xs hover:shadow-lg text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        p.isPopular ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black mt-4">{p.name}</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${p.isPopular ? 'text-blue-100' : 'text-slate-500'}`}>
                    {p.description}
                  </p>

                  <div className="mt-6">
                    <div className="text-3xl sm:text-4xl font-black">{p.price}</div>
                    <div className={`text-xs mt-1 ${p.isPopular ? 'text-blue-200' : 'text-slate-400'}`}>
                      {p.period}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t space-y-2.5 text-xs border-inherit/20">
                    {p.features.map((feat) => (
                      <div key={feat} className="flex items-start space-x-2">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${p.isPopular ? 'text-amber-300' : 'text-emerald-500'}`} />
                        <span className={p.isPopular ? 'text-blue-50' : 'text-slate-700'}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => navigate(`/payment?package=${p.id}`)}
                    className={`w-full py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center justify-center space-x-1.5 ${p.buttonClass}`}
                  >
                    <span>Choose Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Guarantee & Method Banner */}
          <div className="max-w-4xl mx-auto mb-16 p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Metode Pembayaran Resmi AA Event Maker
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tersedia via <span className="font-bold text-slate-900">Bank Mandiri (1850007334896)</span> &amp; <span className="font-bold text-slate-900">DANA (081382000412)</span> a.n. Taufiq Aminudin.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/payment')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Halaman Pembayaran ➔</span>
            </button>
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-16">
            <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Tabel Perbandingan Fitur Seluruh Paket
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Periksa detail kapabilitas setiap paket untuk memastikan seluruh kebutuhan acara Anda terpenuhi.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="py-3.5 px-6 font-bold text-slate-700">Fitur & Layanan</th>
                    <th className="py-3.5 px-6 font-bold text-slate-700">Starter Free</th>
                    <th className="py-3.5 px-6 font-bold text-blue-700">Wedding Pro</th>
                    <th className="py-3.5 px-6 font-bold text-slate-700">EO & Agency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row) => (
                    <tr key={row.name} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-6 font-semibold text-slate-900">{row.name}</td>
                      <td className="py-3 px-6 text-slate-600">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300" />
                          )
                        ) : (
                          row.starter
                        )}
                      </td>
                      <td className="py-3 px-6 font-bold text-blue-700">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300" />
                          )
                        ) : (
                          row.pro
                        )}
                      </td>
                      <td className="py-3 px-6 text-slate-600">
                        {typeof row.agency === 'boolean' ? (
                          row.agency ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300" />
                          )
                        ) : (
                          row.agency
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing FAQ */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Pertanyaan Seputar Pembayaran & Paket
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  Apakah ada biaya bulanan atau langganan berulang untuk paket Wedding Pro?
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Tidak. Paket Wedding Professional adalah sekali bayar (one-time payment) sebesar Rp 299.000 untuk 1 acara aktif selama 1 tahun penuh tanpa perpanjangan otomatis atau tagihan tersembunyi.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  Bagaimana jika saya ingin mencoba membuat undangan terlebih dahulu sebelum bayar?
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Tentu bisa! Anda dapat langsung menggunakan paket Starter Free atau mendesain undangan Anda terlebih dahulu di Studio kami. Anda baru perlu melakukan upgrade saat ingin menyebarkan ke lebih banyak tamu atau mengaktifkan fitur WhatsApp blast otomatis.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  Metode pembayaran apa saja yang didukung?
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Kami mendukung pembayaran instan via QRIS (GoPay, OVO, Dana, ShopeePay), Transfer Bank Virtual Account (BCA, Mandiri, BNI, BRI), dan kartu kredit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
