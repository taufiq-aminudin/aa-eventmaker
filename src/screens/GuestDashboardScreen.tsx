import React, { useState } from 'react';
import {
  QrCode,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Navigation,
  Send,
  Sparkles,
  Ticket,
  Heart,
  Share2,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

export const GuestDashboardScreen: React.FC = () => {
  const { currentProject, currentUser, guests, submitRsvp, addMemory, showToast } = useEvent();

  // Find guest record matching current logged in guest or fallback to Hendra Gunawan
  const guest =
    guests.find((g) => g.email.toLowerCase() === currentUser?.email.toLowerCase()) ||
    guests[0];

  const [rsvpStatus, setRsvpStatus] = useState<'Confirmed' | 'Declined' | 'Maybe' | 'Pending'>(
    guest?.rsvpStatus || 'Confirmed'
  );
  const [paxCount, setPaxCount] = useState<number>(guest?.pax || 2);
  const [doaText, setDoaText] = useState('');
  const [doaSender, setDoaSender] = useState(currentUser?.name || guest?.name || '');

  const handleUpdateRsvp = (status: 'Confirmed' | 'Declined' | 'Maybe') => {
    setRsvpStatus(status);
    submitRsvp(guest?.name || 'Tamu Terhormat', status, paxCount, 'Konfirmasi via Dasbor Tamu');
    showToast(`Konfirmasi kehadiran berhasil diperbarui: ${status === 'Confirmed' ? 'Hadir' : status === 'Declined' ? 'Tidak Hadir' : 'Masih Ragu'}`);
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doaText.trim()) return;
    addMemory(doaSender || 'Sahabat Mempelai', doaText.trim());
    setDoaText('');
    showToast('Doa & ucapan terbaik Anda telah terkirim ke Buku Tamu Mempelai!');
  };

  // QR Code URL generator
  const qrData = `AA-EPASS-${guest?.id || 'GUEST-01'}-${currentProject.id}`;
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    qrData
  )}&bgcolor=ffffff&color=1d4ed8&qzone=1`;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs mb-3">
              <Ticket className="w-3.5 h-3.5" />
              <span>Tiket Digital & E-Pass Tamu Undangan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Halo, {currentUser?.name || guest?.name || 'Tamu Terhormat'}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-200" />
              <span>{currentProject.name} • {currentProject.date}</span>
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
            <div className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">Status Kehadiran</div>
            <div className="text-base font-extrabold mt-1">
              {rsvpStatus === 'Confirmed' ? '✓ Dikonfirmasi Hadir' : rsvpStatus === 'Declined' ? '✗ Tidak Hadir' : '? Belum Pasti'}
            </div>
            <div className="text-xs text-emerald-100 mt-0.5">Jumlah: {paxCount} Orang</div>
          </div>
        </div>
      </div>

      {/* E-Pass Ticket & RSVP Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket E-Pass Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col items-center text-center relative overflow-hidden">
          <div className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 p-3 rounded-2xl text-white mb-4">
            <div className="text-[10px] uppercase font-black tracking-widest text-blue-200">OFFICIAL GUEST E-PASS</div>
            <div className="text-sm font-black truncate">{currentProject.name}</div>
          </div>

          {/* QR Code */}
          <div className="p-3 bg-white border-2 border-dashed border-blue-200 rounded-2xl shadow-inner mb-3">
            <img
              src={qrImgUrl}
              alt="QR Check-in Tamu"
              className="w-44 h-44 object-contain rounded-lg"
            />
          </div>

          <div className="text-xs font-bold text-slate-800">{guest?.name || 'Bpk. Hendra Gunawan'}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Kategori: <strong className="text-blue-700">{guest?.group || 'VIP'}</strong> • Meja: <strong className="text-blue-700">{guest?.tableNumber || 'A-01'}</strong>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 bg-slate-100 px-3 py-1 rounded-full">
            Tunjukkan QR ini ke meja penerima tamu saat kedatangan
          </div>
        </div>

        {/* RSVP updater & Venue Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick RSVP Changer */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Perbarui Konfirmasi Kehadiran</h3>
            <p className="text-xs text-slate-500 mb-4">
              Bantu panitia mempersiapkan konsumsi & tempat duduk terbaik untuk Anda
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleUpdateRsvp('Confirmed')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  rsvpStatus === 'Confirmed'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">Pasti Hadir</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateRsvp('Maybe')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  rsvpStatus === 'Maybe'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold ring-2 ring-amber-600/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <span className="text-xs">Masih Ragu</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateRsvp('Declined')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  rsvpStatus === 'Declined'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-600/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-600" />
                <span className="text-xs">Tidak Bisa Hadir</span>
              </button>
            </div>
          </div>

          {/* Venue & Maps Navigation */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lokasi Venue Acara</div>
              <div className="text-base font-bold text-slate-900 mt-1">{currentProject.location}</div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dress code: Pakaian Formal / Batik / Pastel Elegan
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                currentProject.location
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>Petunjuk Rute Google Maps</span>
            </a>
          </div>

          {/* Send Blessings / Guestbook Note */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Kirim Doa & Ucapan Selamat</h3>
            <p className="text-xs text-slate-500 mb-3">
              Ucapan Anda akan langsung ditampilkan di Buku Tamu Digital Mempelai
            </p>

            <form onSubmit={handleSendWish} className="space-y-3">
              <textarea
                rows={2}
                value={doaText}
                onChange={(e) => setDoaText(e.target.value)}
                placeholder="Tuliskan doa restu terbaik untuk kedua mempelai..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Doa Restu</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <GoogleAdSlot />
    </div>
  );
};
