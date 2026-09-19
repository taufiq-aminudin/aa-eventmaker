import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  Send,
  ExternalLink,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';

export const PublicInvitationView: React.FC = () => {
  const { invitation, currentProject, memories, submitRsvp, setShowPublicPreview } = useEvent();

  const [guestName, setGuestName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'Confirmed' | 'Declined' | 'Maybe'>('Confirmed');
  const [pax, setPax] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    submitRsvp(guestName, rsvpStatus, pax, notes);
    setSubmitted(true);
  };

  // Determine background style based on selected template
  const isSunda = invitation.templateName.toLowerCase().includes('sunda');
  const isJawa = invitation.templateName.toLowerCase().includes('jawa');
  const isBali = invitation.templateName.toLowerCase().includes('bali');

  const themeGradient = isSunda
    ? 'from-[#064e3b] via-[#047857] to-[#10b981]'
    : isJawa
    ? 'from-[#451a03] via-[#78350f] to-[#b45309]'
    : isBali
    ? 'from-[#881337] via-[#be123c] to-[#f59e0b]'
    : 'from-[#0f172a] via-[#312e81] to-[#701a75]';

  return (
    <div
      id="public-invitation-view"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col items-center justify-start"
    >
      {/* Top Floating Bar */}
      <div className="sticky top-0 z-30 w-full max-w-2xl bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300">
            Preview Undangan • {invitation.templateName}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Musik Latar"
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4 text-pink-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowPublicPreview(false)}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Tutup Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Invitation Container */}
      <div className="w-full max-w-xl min-h-screen bg-[#0b0f19] border-x border-slate-800 shadow-2xl flex flex-col">
        {/* Hero Section */}
        <div
          className={`relative px-6 py-20 text-center bg-gradient-to-b ${themeGradient} overflow-hidden`}
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 max-w-md mx-auto space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-widest uppercase text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE WEDDING CELEBRATION</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-wide drop-shadow-md">
              {invitation.hosts}
            </h1>

            <p className="text-sm text-white/90 italic font-serif max-w-sm mx-auto leading-relaxed">
              "{invitation.title}"
            </p>

            <div className="pt-2">
              <div className="inline-block px-4 py-1.5 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 text-xs font-medium tracking-wider">
                {invitation.date}
              </div>
            </div>
          </div>
        </div>

        {/* Opening Greeting */}
        <div className="px-6 py-10 text-center border-b border-slate-800/80 bg-slate-900/40">
          <Heart className="w-6 h-6 text-pink-500 mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto font-light">
            {invitation.opening}
          </p>
        </div>

        {/* Event Schedule & Venue */}
        <div className="px-6 py-10 space-y-6">
          <div className="text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#ec4899] mb-1">
              Rangkaian Acara
            </h3>
            <h2 className="text-2xl font-serif font-bold text-white">Waktu & Tempat</h2>
          </div>

          <div className="space-y-4">
            {/* Akad Nikah Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-sm font-bold text-amber-300">Akad Nikah / Pemberkatan</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-purple-900/50 text-purple-300">
                  08:00 WIB
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{invitation.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{invitation.time.split('|')[0] || invitation.time}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>{invitation.venue}</span>
                </div>
              </div>
            </div>

            {/* Resepsi Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-pink-500/40 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-sm font-bold text-pink-300">Resepsi Pernikahan</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-pink-900/50 text-pink-300">
                  11:00 - Selesai
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>{invitation.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>{invitation.time.split('|')[1] || invitation.time}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                  <span>{invitation.address}</span>
                </div>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  invitation.venue + ' ' + invitation.address
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center space-x-1.5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>Buka Petunjuk Arah Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* RSVP Form Section */}
        <div className="px-6 py-10 bg-slate-900/60 border-t border-slate-800">
          <div className="text-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#6d28d9] mb-1">
              Konfirmasi Kehadiran
            </h3>
            <h2 className="text-2xl font-serif font-bold text-white">RSVP Digital</h2>
            <p className="text-xs text-slate-400 mt-1">
              Mohon isi formulir di bawah ini untuk membantu kami mengatur jamuan terbaik.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/60 border border-emerald-800 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-base text-emerald-200">Terima Kasih Banyak!</h4>
              <p className="text-xs text-emerald-300">
                Konfirmasi kehadiran atas nama <strong className="text-white">{guestName}</strong>{' '}
                telah tersimpan di sistem resepsionis.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-semibold text-emerald-400 underline hover:text-emerald-300"
              >
                Kirim Konfirmasi Baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Bambang & Istri"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Status Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('Confirmed')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      rsvpStatus === 'Confirmed'
                        ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    ✓ Hadir
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('Maybe')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      rsvpStatus === 'Maybe'
                        ? 'bg-amber-900/60 border-amber-500 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    ? Ragu-ragu
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('Declined')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      rsvpStatus === 'Declined'
                        ? 'bg-rose-900/60 border-rose-500 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    ✕ Berhalangan
                  </button>
                </div>
              </div>

              {rsvpStatus !== 'Declined' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jumlah Tamu Hadir
                  </label>
                  <select
                    value={pax}
                    onChange={(e) => setPax(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value={1}>1 Orang</option>
                    <option value={2}>2 Orang</option>
                    <option value={3}>3 Orang</option>
                    <option value={4}>4 Orang</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ucapan & Doa Restu
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan ucapan dan doa tulus untuk kedua mempelai..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#6d28d9] to-[#ec4899] text-white text-xs font-bold rounded-xl shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Konfirmasi Kehadiran</span>
              </button>
            </form>
          )}
        </div>

        {/* Guest Wishes & Memories Wall */}
        <div className="px-6 py-10">
          <div className="text-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#ec4899] mb-1">
              Doa & Harapan
            </h3>
            <h2 className="text-2xl font-serif font-bold text-white">Buku Tamu Digital</h2>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">{mem.guestName}</span>
                  <span className="text-[10px] text-slate-500">{mem.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{mem.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto px-6 py-8 text-center border-t border-slate-800 bg-slate-950 text-slate-500 text-xs">
          <p className="font-semibold text-slate-400">AA : Event Maker</p>
          <p className="text-[11px] mt-0.5">
            Platform Pembuat Undangan & Manajemen Acara Profesional
          </p>
        </div>
      </div>
    </div>
  );
};
