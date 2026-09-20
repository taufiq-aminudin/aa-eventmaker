import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sparkles,
  QrCode,
  Share2,
  Phone,
  Camera,
  Layers,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';

export const HelpPage: React.FC = () => {
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const guides = [
    {
      category: 'Memulai & Pembuatan Undangan',
      icon: BookOpen,
      items: [
        {
          q: 'Bagaimana cara membuat undangan digital pertama kali?',
          a: 'Klik tombol "Buat Undangan" di pojok kanan atas atau buka halaman Koleksi Template. Pilih desain yang Anda sukai, masukkan nama mempelai/tuan rumah, tanggal, dan alamat venue. Tautan undangan Anda langsung siap dibagikan.',
        },
        {
          q: 'Apakah saya bisa mengganti tema setelah undangan dibuat?',
          a: 'Bisa kapan saja! Masuk ke menu Editor Undangan Anda dan pilih tab "Ganti Tema". Seluruh data acara, foto, dan nama tamu akan otomatis tersimpan dan menyesuaikan dengan tampilan tema baru.',
        },
        {
          q: 'Apakah undangan digital bisa disesuaikan dengan bahasa daerah atau adat khusus?',
          a: 'Ya, Anda dapat menyesuaikan teks pembuka, doa pernikahan adat, hingga gelar keluarga sesuai adat Sunda, Jawa, Bali, Minang, Batak, maupun teks bilingual Indonesia-Inggris.',
        },
      ],
    },
    {
      category: 'Foto, Galeri & Musik',
      icon: Camera,
      items: [
        {
          q: 'Berapa jumlah foto yang dapat diunggah ke galeri?',
          a: 'Pada paket Free Anda dapat mengunggah hingga 3 foto, sedangkan pada paket Wedding Pro Anda dapat mengunggah hingga 20 foto resolusi tinggi. Sistem kompresi cerdas kami akan menjaga foto tetap tajam namun ringan diakses ponsel tamu.',
        },
        {
          q: 'Bagaimana cara mengganti lagu pengiring undangan?',
          a: 'Buka menu Editor Undangan > Tab Pengaturan Musik. Anda dapat memilih dari daftar koleksi musik romantis bebas royalti kami, atau menempelkan URL lagu MP3 pilihan Anda sendiri.',
        },
      ],
    },
    {
      category: 'Penyebaran WhatsApp & RSVP',
      icon: Share2,
      items: [
        {
          q: 'Bagaimana cara mengirim undangan dengan nama khusus per tamu?',
          a: 'Di dasbor Manajemen Tamu, klik tombol WhatsApp di sebelah nama tamu. Sistem akan otomatis membuka WhatsApp dengan teks resmi dan tautan khusus yang menyertakan nama tamu tersebut (contoh: Kepada Yth. Bpk. Hendra Kusuma).',
        },
        {
          q: 'Bagaimana saya mengetahui jika tamu sudah mengisi konfirmasi RSVP?',
          a: 'Setiap kali tamu mengklik tombol Hadir atau Maaf Tidak Bisa, data langsung terupdate secara real-time di tabel Manajemen Tamu Anda lengkap dengan jumlah pax dan ucapan selamat mereka.',
        },
      ],
    },
    {
      category: 'Scanner QR E-Pass & Hari-H',
      icon: QrCode,
      items: [
        {
          q: 'Bagaimana cara kerja check-in tamu di meja resepsi pada hari-H?',
          a: 'Panitia atau penerima tamu cukup membuka halaman Cek E-Pass Tamu > Buka Scanner Kamera di ponsel mereka. Arahkan kamera ke QR code tiket tamu, sistem akan memvalidasi kehadiran dalam 0.5 detik dan menampilkan nomor meja tamu.',
        },
        {
          q: 'Apakah scanner tetap berfungsi jika koneksi internet di lokasi acara lemah?',
          a: 'Ya! AA Event Maker dilengkapi teknologi Progressive Web App (PWA) yang memungkinkan pemindaian kode check-in offline untuk mencegah penumpukan antrean di meja masuk.',
        },
      ],
    },
  ];

  const allItems = guides.flatMap((g) => g.items);
  const filteredGuides = searchQuery.trim()
    ? guides
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (it) =>
              it.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              it.a.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((g) => g.items.length > 0)
    : guides;

  return (
    <div id="help-page" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="Pusat Bantuan & Panduan – AA Event Maker"
        description="Temukan jawaban dan panduan lengkap seputar pembuatan undangan digital, WhatsApp blast, pengelolaan tamu, dan scanner QR E-Pass."
        canonicalPath="/help"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Banner */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pusat Bantuan & Tanya Jawab</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Panduan & FAQ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Jawaban cepat untuk seluruh pertanyaan umum mengenai pembuatan dan pengelolaan acara Anda.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto mb-12">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik bantuan (misal: WhatsApp, scan QR, foto, musik)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden shadow-xs"
            />
          </div>

          {/* Grouped Guides Accordion */}
          <div className="space-y-10">
            {filteredGuides.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.category} className="space-y-4">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <Icon className="w-4 h-4 text-blue-600" />
                    <span>{group.category}</span>
                  </h2>

                  <div className="space-y-3">
                    {group.items.map((item, idx) => {
                      const globalIdx = guides.findIndex((g) => g.category === group.category) * 10 + idx;
                      const isOpen = openIndex === globalIdx;

                      return (
                        <div
                          key={item.q}
                          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-colors"
                        >
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                            className="w-full py-4 px-5 text-left flex items-center justify-between space-x-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                          >
                            <span className="text-xs sm:text-sm font-bold text-slate-900">{item.q}</span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Still Need Help Box */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Belum Menemukan Jawaban Anda?</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tim spesialis kami siap membantu konfigurasi acara Anda secara langsung melalui WhatsApp setiap hari.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Hubungi Dukungan Langsung ➔
              </button>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
