import React, { useState } from 'react';
import {
  QrCode,
  Search,
  CheckCircle2,
  Share2,
  ScanLine,
  Smartphone,
  ShieldCheck,
  Users,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';
import { ShareWhatsAppButton } from '../../components/ShareWhatsAppButton';
import { Guest } from '../../types';

export const GuestPassPage: React.FC = () => {
  const { guests, setSelectedGuestForPass, setShowQrCheckinModal, currentUser } = useEvent();
  const { navigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Guest | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();
    const found = guests.find(
      (g) =>
        g.name.toLowerCase().includes(query) ||
        g.checkInCode.toLowerCase() === query ||
        (g.phone && g.phone.replace(/[^0-9]/g, '').includes(query))
    );

    setSearchResult(found || null);
    setHasSearched(true);
  };

  return (
    <div id="guest-pass-page" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="Portal Tamu & E-Pass QR Check-in – AA Event Maker"
        description="Cek status undangan, unduh tiket QR E-Pass masuk acara pernikahan, dan panduan check-in cepat 0.5 detik bersama AA Event Maker."
        canonicalPath="/guest-pass"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3">
              <QrCode className="w-3.5 h-3.5" />
              <span>Portal Tamu & Registrasi Acara</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Cek E-Pass & Tiket QR Tamu
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Ketikkan nama lengkap atau nomor kontak Anda untuk melihat nomor meja VIP, kuota pax, dan tiket QR E-Pass masuk resepsi.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Pencarian Nama / Nomor Kontak / Kode Check-in:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: Hendra Gunawan, Sinta, atau Bpk..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  Cari Tiket Saya
                </button>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center space-x-1 pt-1">
                <Info className="w-3.5 h-3.5" />
                <span>Tips: Masukkan nama sesuai yang tertera pada pesan undangan WhatsApp Anda.</span>
              </div>
            </form>

            {/* Search Result */}
            {hasSearched && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                {searchResult ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 animate-in fade-in space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                          E-Pass Ditemukan
                        </span>
                        <h2 className="text-lg font-black text-slate-900 mt-2">{searchResult.name}</h2>
                        <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                          <div>
                            Kategori: <strong>{searchResult.group}</strong> • Meja:{' '}
                            <strong>{searchResult.tableNumber}</strong>
                          </div>
                          <div>
                            Kuota Kehadiran: <strong>{searchResult.pax} Orang</strong> • Status RSVP:{' '}
                            <span
                              className={`font-bold ${
                                searchResult.rsvpStatus === 'Confirmed'
                                  ? 'text-emerald-600'
                                  : 'text-amber-600'
                              }`}
                            >
                              {searchResult.rsvpStatus === 'Confirmed' ? 'Konfirmasi Hadir' : 'Menunggu RSVP'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono">Kode Tiket:</span>
                        <div className="text-xs font-mono font-bold text-blue-700">{searchResult.checkInCode}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-blue-100">
                      <button
                        onClick={() => setSelectedGuestForPass(searchResult)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Buka Tiket E-Pass QR Lengkap</span>
                      </button>

                      <ShareWhatsAppButton
                        guestName={searchResult.name}
                        tableNumber={searchResult.tableNumber}
                        checkInCode={searchResult.checkInCode}
                        variant="secondary"
                        size="sm"
                        label="Kirim ke WhatsApp"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-800 animate-in fade-in space-y-2">
                    <div className="font-bold">Nama belum ditemukan dalam daftar tamu acara.</div>
                    <p className="text-amber-700 leading-relaxed">
                      Pastikan ejaan nama sesuai dengan undangan, atau hubungi keluarga / panitia penyelenggara acara untuk konfirmasi penambahan nama.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Scanner Action for Receptionists / Organizers */}
          <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ScanLine className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Petugas Resepsi & Scanner Tamu</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Buka kamera scanner untuk memvalidasi QR tiket tamu di meja masuk (Hanya butuh 0.5 detik).
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowQrCheckinModal(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <ScanLine className="w-4 h-4 text-amber-400" />
              <span>Buka Scanner Kamera</span>
            </button>
          </div>

          {/* How It Works for Guests */}
          <div className="mt-14 space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Panduan Mudah Penggunaan E-Pass
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ikuti langkah sederhana ini untuk pengalaman masuk resepsi tanpa repot antre.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="text-sm font-bold text-slate-900">Buka & Konfirmasi RSVP</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Buka tautan undangan digital yang Anda terima melalui WhatsApp dan konfirmasi kehadiran Anda beserta jumlah pax.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-900">Simpan QR E-Pass</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Unduh gambar QR code atau lakukan tangkapan layar (screenshot) tiket E-Pass Anda agar mudah diakses saat tiba di venue.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
                  3
                </div>
                <h3 className="text-sm font-bold text-slate-900">Tunjukkan di Meja Resepsi</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Perlihatkan QR code kepada panitia penerima tamu untuk dipindai dalam 0.5 detik dan segera menuju meja VIP Anda.
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
