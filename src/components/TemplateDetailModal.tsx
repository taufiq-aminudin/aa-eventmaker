import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Monitor,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Send,
  Camera,
  Share2,
} from 'lucide-react';
import { TemplateItem, InvitationData } from '../types';
import { useEvent } from '../context/EventContext';

interface TemplateDetailModalProps {
  template: TemplateItem | null;
  onClose: () => void;
  onUseTemplate?: (tmpl: TemplateItem) => void;
}

export const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
  template,
  onClose,
  onUseTemplate,
}) => {
  const {
    invitation,
    selectTemplate,
    currentUser,
    setShowAuthModal,
    setShowPublicLanding,
    setActiveTab,
    showToast,
  } = useEvent();

  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'Hadir' | 'Tidak Hadir' | 'Ragu-ragu'>('Hadir');
  const [rsvpPax, setRsvpPax] = useState('2');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  if (!template) return null;

  const handleApplyTemplate = () => {
    selectTemplate(template.title);
    if (onUseTemplate) {
      onUseTemplate(template);
    }
    if (!currentUser) {
      showToast(`Silakan masuk dengan Google untuk mengkustomisasi tema "${template.title}".`);
      setShowAuthModal(true);
    } else {
      setShowPublicLanding(false);
      setActiveTab(1); // Go to Invitation editor screen
      showToast(`Tema "${template.title}" berhasil diterapkan!`);
      onClose();
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setRsvpSubmitted(true);
  };

  // Thematic elements based on template pattern
  const isJawa = template.patternType === 'batik' || template.title.toLowerCase().includes('jawa');
  const isSunda = template.patternType === 'siger' || template.title.toLowerCase().includes('sunda');
  const isBali = template.patternType === 'balinese' || template.title.toLowerCase().includes('bali');
  const isFloral = template.patternType === 'floral' || template.title.toLowerCase().includes('garden');
  const isFestive = template.patternType === 'festive' || template.category === 'Birthday';
  const isCorporate = template.patternType === 'corporate' || template.category === 'Corporate';
  const isBaby = template.patternType === 'stars' || template.category === 'Baby';

  // Sample or uploaded display photos
  const displayCover =
    invitation.coverPhoto ||
    template.defaultCoverPhoto ||
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80';

  const displayCouple =
    invitation.couplePhoto ||
    template.defaultCouplePhoto ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

  const hostsText = template.sampleHosts || invitation.hosts;
  const dateText = template.sampleDate || invitation.date;
  const venueText = template.sampleVenue || invitation.venue;
  const quoteText = template.sampleQuote || invitation.quote || 'Cinta adalah anugerah terindah yang menyatukan dua jiwa.';
  const openingText = template.sampleOpening || invitation.opening;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Control Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20"
              style={{ backgroundColor: template.accentColor || '#f59e0b' }}
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">{template.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                  {template.category} • {template.styleTag}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block truncate max-w-md">
                {template.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View Mode Toggle: Mobile vs Desktop */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewDevice === 'mobile'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Smartphone"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewDevice === 'desktop'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Desktop / Layar Penuh"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            {/* Music Toggle */}
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Musik Tema"
            >
              {isPlayingMusic ? (
                <Volume2 className="w-4 h-4 text-pink-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Apply Template Button */}
            <button
              onClick={handleApplyTemplate}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gunakan Template Ini</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Tutup Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="overflow-y-auto flex-1 bg-slate-950 p-3 sm:p-6 flex justify-center items-start">
          <div
            className={`transition-all duration-300 w-full ${
              previewDevice === 'mobile'
                ? 'max-w-[410px] rounded-[36px] border-[6px] border-slate-800 shadow-2xl overflow-hidden'
                : 'max-w-2xl rounded-2xl border border-slate-800 shadow-xl overflow-hidden'
            }`}
          >
            {/* Mobile Top Notch if in mobile mode */}
            {previewDevice === 'mobile' && (
              <div className="bg-black/90 py-1 px-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>09:41</span>
                <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
                <span>5G 100%</span>
              </div>
            )}

            {/* Simulated Live Invitation Content */}
            <div className="bg-[#0b0f19] text-slate-100 min-h-screen">
              {/* Hero Banner with Cover Photo & Thematic Overlay */}
              <div
                className={`relative px-6 py-20 text-center ${template.gradientTheme} overflow-hidden`}
              >
                {/* Visual Cover Photo Background with blur/vignette */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
                  style={{ backgroundImage: `url(${displayCover})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-black/40 to-transparent" />

                <div className="relative z-10 max-w-sm mx-auto space-y-4">
                  {/* Cultural / Thematic Badge */}
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-bold tracking-widest uppercase text-amber-200 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>
                      {isCorporate
                        ? 'OFFICIAL EVENT INVITATION'
                        : isFestive
                        ? 'BIRTHDAY CELEBRATION'
                        : isBaby
                        ? 'TASYAKURAN AQIQAH & DOIR'
                        : 'THE WEDDING CELEBRATION'}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-wide drop-shadow-md">
                    {hostsText}
                  </h1>

                  <p className="text-xs text-slate-200 italic font-serif leading-relaxed max-w-xs mx-auto">
                    "{quoteText}"
                  </p>

                  <div className="pt-2">
                    <span className="inline-block px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/15 text-xs font-semibold text-white tracking-wider">
                      {dateText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Couple / Host Photo Showcase */}
              <div className="px-6 py-10 text-center border-b border-slate-800/80 bg-slate-900/40">
                <div className="relative inline-block mb-5">
                  <div
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 mx-auto shadow-xl overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${template.gradientColors[0]}, ${template.gradientColors[1]}, ${template.accentColor || '#eab308'})`,
                    }}
                  >
                    <img
                      src={displayCouple}
                      alt={hostsText}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  {/* Thematic Badge Icon */}
                  <div className="absolute bottom-1 right-2 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-md">
                    {isJawa ? (
                      <span className="text-xs">👑</span>
                    ) : isSunda ? (
                      <span className="text-xs">🌿</span>
                    ) : isBali ? (
                      <span className="text-xs">🌺</span>
                    ) : isFestive ? (
                      <span className="text-xs">🎉</span>
                    ) : isCorporate ? (
                      <span className="text-xs">💼</span>
                    ) : (
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                    )}
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h2 className="text-xl font-serif font-bold text-white">{hostsText}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {openingText}
                  </p>
                </div>
              </div>

              {/* Event Schedule & Location */}
              <div className="px-6 py-10 space-y-6">
                <div className="text-center">
                  <h3
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: template.accentColor || '#ec4899' }}
                  >
                    Rangkaian Acara
                  </h3>
                  <h4 className="text-2xl font-serif font-bold text-white">Waktu & Lokasi</h4>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  {/* Session 1 */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-amber-300">
                        {isCorporate ? 'Sesi Pleno / Keynote' : isFestive ? 'Pesta Utama' : 'Akad Nikah / Pemberkatan'}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                        08:00 - 10:00 WIB
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-300">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>{dateText}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5" />
                        <span>{venueText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Session 2 */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-pink-300">
                        {isCorporate ? 'Networking & Gala Dinner' : isFestive ? 'Games & Music Session' : 'Resepsi & Jamuan Bersama'}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                        11:00 - Selesai
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-300">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" />
                        <span>{dateText}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-pink-400 mt-0.5" />
                        <span>{venueText}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(venueText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center space-x-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-colors border border-slate-700"
                  >
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                    <span>Petunjuk Lokasi Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Gallery Highlight */}
              <div className="px-6 py-8 border-t border-slate-800/80 bg-slate-900/30">
                <div className="text-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Galeri Momen
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                  {(
                    invitation.galleryPhotos || [
                      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80',
                    ]
                  ).map((photo, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-800"
                    >
                      <img src={photo} alt="Momen" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive RSVP Preview Form */}
              <div className="px-6 py-10 bg-slate-900/70 border-t border-slate-800">
                <div className="text-center mb-5">
                  <h4 className="text-xl font-serif font-bold text-white">Konfirmasi Kehadiran</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Fitur RSVP digital langsung terhubung ke dasbor buku tamu.
                  </p>
                </div>

                {rsvpSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="text-sm font-bold text-emerald-200">
                      Konfirmasi Demo Berhasil!
                    </div>
                    <p className="text-xs text-emerald-300">
                      Tamu atas nama <strong>{rsvpName}</strong> akan langsung tercatat di dasbor
                      tamu EO dengan status: {rsvpStatus}.
                    </p>
                    <button
                      onClick={() => setRsvpSubmitted(false)}
                      className="text-xs text-emerald-400 underline font-semibold mt-2"
                    >
                      Uji Coba Lagi
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-3 max-w-md mx-auto">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nama Tamu
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Bpk. Bambang & Istri"
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        required
                        className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['Hadir', 'Tidak Hadir', 'Ragu-ragu'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setRsvpStatus(st)}
                          className={`text-xs py-1.5 rounded-lg border font-semibold transition-all ${
                            rsvpStatus === st
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Konfirmasi Kehadiran</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Invitation Footer */}
              <div className="py-6 text-center text-[11px] text-slate-500 border-t border-slate-900 bg-black/40">
                <span>Dibuat dengan eksklusif menggunakan </span>
                <strong className="text-slate-300">AA-EventMaker</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-slate-900 border-t border-slate-800 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Kustomisasi foto, teks, waktu, peta, dan musik dapat diubah kapan saja di editor.
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
            >
              Kembali
            </button>

            <button
              onClick={handleApplyTemplate}
              className="w-1/2 sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Gunakan Template Ini</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
