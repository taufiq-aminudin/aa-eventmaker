import React, { useState, useEffect } from 'react';
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
  Copy,
  Check,
  MessageCircle,
  Image as ImageIcon,
  Gift,
  CreditCard,
  QrCode,
  Play,
  MailOpen,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEvent } from '../context/EventContext';
import { globalAudioPlayer } from '../utils/audioPlayer';
import { ShareWhatsAppButton } from './ShareWhatsAppButton';

export const PublicInvitationView: React.FC = () => {
  const {
    invitation,
    memories,
    submitRsvp,
    setShowPublicPreview,
    setShowPublicLanding,
    templates,
    showToast,
  } = useEvent();

  // State
  const [isOpenEnvelope, setIsOpenEnvelope] = useState(false);
  const [recipientName, setRecipientName] = useState<string>('Tamu Undangan');
  const [guestName, setGuestName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'Confirmed' | 'Declined' | 'Maybe'>('Confirmed');
  const [pax, setPax] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 34,
    hours: 12,
    minutes: 45,
    seconds: 18,
  });

  // Extract recipient name from query params (?to=Nama or ?guest=Nama)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let toParam = urlParams.get('to') || urlParams.get('guest');

      if (!toParam && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        toParam = hashParams.get('to') || hashParams.get('guest');
      }

      if (toParam) {
        const cleanName = decodeURIComponent(toParam).replace(/\+/g, ' ');
        setRecipientName(cleanName);
        setGuestName(cleanName);
      }
    } catch (e) {
      console.warn('Could not parse query params', e);
    }
  }, []);

  // Countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const matchedTemplate = templates.find((t) => t.title === invitation.templateName);

  const isSunda = invitation.templateName.toLowerCase().includes('sunda');
  const isJawa = invitation.templateName.toLowerCase().includes('jawa') || invitation.templateName.toLowerCase().includes('solo');
  const isBali = invitation.templateName.toLowerCase().includes('bali');
  const isGarden = invitation.templateName.toLowerCase().includes('garden');
  const isCorporate = matchedTemplate?.category === 'Corporate';
  const isBirthday = matchedTemplate?.category === 'Birthday';
  const isBaby = matchedTemplate?.category === 'Baby' || matchedTemplate?.category === 'Kids';

  const themeGradient = isSunda
    ? 'from-[#064e3b] via-[#047857] to-[#10b981]'
    : isJawa
    ? 'from-[#271506] via-[#5c2a0b] to-[#d97706]'
    : isBali
    ? 'from-[#701a75] via-[#9d174d] to-[#f59e0b]'
    : isGarden
    ? 'from-[#14532d] via-[#15803d] to-[#84cc16]'
    : isBirthday
    ? 'from-[#581c87] via-[#a21caf] to-[#f43f5e]'
    : isCorporate
    ? 'from-[#0f172a] via-[#1e293b] to-[#0284c7]'
    : isBaby
    ? 'from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd]'
    : 'from-[#0f172a] via-[#312e81] to-[#701a75]';

  const displayCover =
    invitation.coverPhoto ||
    matchedTemplate?.defaultCoverPhoto ||
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80';

  const displayCouple =
    invitation.couplePhoto ||
    matchedTemplate?.defaultCouplePhoto ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

  const galleryList =
    invitation.galleryPhotos && invitation.galleryPhotos.length > 0
      ? invitation.galleryPhotos
      : [
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1519225429712-421b9ec76fbe?auto=format&fit=crop&w=600&q=80',
        ];

  // Open envelope handler
  const handleOpenEnvelope = () => {
    setIsOpenEnvelope(true);
    // Fire celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    // Start ambient music
    globalAudioPlayer.start();
    setIsPlayingMusic(true);
  };

  const handleToggleMusic = () => {
    const state = globalAudioPlayer.toggle();
    setIsPlayingMusic(state);
  };

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    submitRsvp(guestName, rsvpStatus, pax, notes);
    setSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const invitationUrl = `${window.location.origin}/#invitation/${invitation.slug}?to=${encodeURIComponent(recipientName)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopiedLink(true);
    showToast('Tautan undangan dengan nama tamu berhasil disalin!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyAccount = (acc: string, label: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(acc);
    showToast(`Nomor rekening ${label} berhasil disalin!`);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Kepada Yth. *${recipientName}*,\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk menghadiri perayaan *${invitation.title}* (${invitation.hosts}).\n\nBuka undangan digital resmi kami melalui tautan berikut:\n${invitationUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleClose = () => {
    globalAudioPlayer.stop();
    setShowPublicPreview(false);
    if (window.location.hash.startsWith('#invitation')) {
      window.location.hash = '';
      setShowPublicLanding(true);
    }
  };

  return (
    <div
      id="public-invitation-view"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col items-center justify-start selection:bg-purple-500 selection:text-white"
    >
      {/* 1. ENVELOPE / WAX SEAL OPENING GATEWAY MODAL */}
      {!isOpenEnvelope && (
        <div className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gradient-to-b from-[#111827] to-[#0b0f19] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95">
            {/* Background shimmer */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Undangan Pernikahan Resmi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-white pt-2">
                {invitation.hosts}
              </h2>
              <p className="text-xs text-slate-300 italic font-serif">"{invitation.title}"</p>
            </div>

            {/* Couple Cover Thumbnail */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full p-1 border-2 border-amber-400/50 shadow-xl overflow-hidden">
              <img
                src={displayCouple}
                alt={invitation.hosts}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Recipient Greeting Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Kepada Yth. Bapak/Ibu/Saudara/i:</div>
              <div className="text-base font-bold text-amber-300">{recipientName}</div>
              <div className="text-[10px] text-slate-400">Mohon maaf bila ada kesalahan penulisan nama & gelar</div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleOpenEnvelope}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-102"
              >
                <MailOpen className="w-4 h-4" />
                <span>Buka Undangan Digital</span>
              </button>

              <button
                onClick={handleClose}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TOP FLOATING APP BAR */}
      <div className="sticky top-0 z-30 w-full max-w-2xl bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs font-bold text-slate-200 truncate">
            {invitation.hosts} • {invitation.templateName}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button
            onClick={handleCopyLink}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
            title="Salin Tautan Khusus Tamu Ini"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
          </button>

          <ShareWhatsAppButton
            invitationUrl={invitationUrl}
            guestName={guestName !== 'Tamu Undangan' ? guestName : undefined}
            eventTitle={invitation.title}
            hosts={invitation.hosts}
            date={invitation.date}
            time={invitation.time}
            venue={invitation.venue}
            address={invitation.address}
            size="sm"
            variant="compact"
            label="WhatsApp"
          />

          {/* Equalizer Audio Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`p-1.5 rounded-xl transition-all flex items-center space-x-1 ${
              isPlayingMusic ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
            title="Nyalakan / Matikan Musik"
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {isPlayingMusic && (
              <div className="flex items-center space-x-0.5 h-3 px-1">
                <span className="w-0.5 h-2 bg-slate-950 animate-bounce" />
                <span className="w-0.5 h-3 bg-slate-950 animate-pulse" />
                <span className="w-0.5 h-1.5 bg-slate-950 animate-bounce" />
              </div>
            )}
          </button>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Tutup & Ke Beranda"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. MAIN INVITATION BODY */}
      <div className="w-full max-w-xl min-h-screen bg-[#0b0f19] border-x border-slate-800 shadow-2xl flex flex-col">
        {/* Cover Hero Banner */}
        <div className={`relative px-6 py-20 sm:py-28 text-center bg-gradient-to-b ${themeGradient} overflow-hidden`}>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
            style={{ backgroundImage: `url(${displayCover})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-black/35 to-transparent" />

          <div className="relative z-10 max-w-md mx-auto space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isCorporate
                  ? 'OFFICIAL INVITATION'
                  : isBirthday
                  ? 'BIRTHDAY CELEBRATION'
                  : isBaby
                  ? 'TASYAKURAN AQIQAH'
                  : 'THE WEDDING CELEBRATION'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-wide drop-shadow-md">
              {invitation.hosts}
            </h1>

            <p className="text-sm text-white/90 italic font-serif max-w-sm mx-auto leading-relaxed">
              "{invitation.title}"
            </p>

            <div className="pt-2">
              <div className="inline-block px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/15 text-xs font-semibold tracking-wider">
                {invitation.date}
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Welcome Pill */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 text-center">
          <div className="text-[11px] text-slate-400">Turut Mengundang yang Terhormat:</div>
          <div className="text-sm font-bold text-amber-300 mt-0.5">{recipientName}</div>
        </div>

        {/* COUNTDOWN TIMER SECTION */}
        <div className="px-6 py-8 bg-slate-950 text-center border-b border-slate-800/80">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Menghitung Hari Menuju Hari Bahagia
          </div>
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeLeft.days}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Hari</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeLeft.hours}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Jam</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeLeft.minutes}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Menit</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{timeLeft.seconds}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Detik</div>
            </div>
          </div>
        </div>

        {/* Mempelai Photo & Greeting Section */}
        <div className="px-6 py-10 text-center border-b border-slate-800/80 bg-slate-900/40">
          <div className="relative inline-block mb-4">
            <div
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 mx-auto shadow-2xl overflow-hidden cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${matchedTemplate?.gradientColors?.[0] || '#78350f'}, ${matchedTemplate?.accentColor || '#f59e0b'})`,
              }}
              onClick={() => setSelectedPhotoModal(displayCouple)}
            >
              <img
                src={displayCouple}
                alt={invitation.hosts}
                className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute bottom-1 right-2 w-9 h-9 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-lg">
              {isJawa ? (
                <span className="text-sm">👑</span>
              ) : isSunda ? (
                <span className="text-sm">🌿</span>
              ) : isBali ? (
                <span className="text-sm">🌺</span>
              ) : (
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              )}
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-serif font-bold text-white">{invitation.hosts}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {invitation.opening}
            </p>
          </div>
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
            {/* Session 1 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-sm font-bold text-amber-300">
                  {isCorporate ? 'Sesi Utama / Acara Inti' : isBirthday ? 'Pesta Ulang Tahun' : 'Akad Nikah / Pemberkatan'}
                </span>
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

            {/* Session 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-pink-500/40 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-sm font-bold text-pink-300">
                  {isCorporate ? 'Gala Dinner & Networking' : isBirthday ? 'Makan Malam & Games' : 'Resepsi Pernikahan'}
                </span>
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
                className="mt-2 inline-flex items-center justify-center space-x-1.5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-colors border border-slate-700"
              >
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>Buka Petunjuk Arah Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* CINEMATIC VIDEO PREVIEW SECTION */}
        <div className="px-6 py-10 bg-slate-950 border-t border-slate-800">
          <div className="text-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              Video Sinematik
            </h3>
            <h2 className="text-2xl font-serif font-bold text-white">Prewedding Teaser</h2>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-center group">
            <img
              src={displayCover}
              alt="Video Thumbnail"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="relative z-10 w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 ml-0.5" />
            </div>
            <div className="absolute bottom-3 left-4 text-white text-xs">
              <div className="font-bold">Kisah Perjalanan & Harapan Masa Depan</div>
              <div className="text-[10px] text-slate-300">Sinematografi 4K Ultra HD</div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="px-6 py-10 bg-slate-900/50 border-t border-slate-800">
          <div className="text-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#a855f7] mb-1">
              Galeri Kenangan
            </h3>
            <h2 className="text-2xl font-serif font-bold text-white">Momen Bahagia Kami</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {galleryList.map((imgUrl, i) => (
              <div
                key={i}
                onClick={() => setSelectedPhotoModal(imgUrl)}
                className="group relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-800 cursor-pointer shadow-md bg-slate-900"
              >
                <img
                  src={imgUrl}
                  alt={`Momen ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white drop-shadow-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIGITAL GIFT & ANGPAO (AMPLOP DIGITAL) */}
        <div className="px-6 py-10 bg-slate-950 border-t border-slate-800">
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Tanda Kasih & Doa Restu</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Amplop Digital (Angpao)</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Doa restu Anda merupakan karunia terindah. Namun jika ingin memberikan tanda kasih secara digital:
            </p>
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            {/* BCA */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-blue-400">BANK BCA</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">8830 1928 3341</div>
                <div className="text-[11px] text-slate-400">a/n Andi Pratama</div>
              </div>
              <button
                onClick={() => handleCopyAccount('883019283341', 'BCA')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1"
              >
                {copiedAccount === '883019283341' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            {/* MANDIRI */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-amber-400">BANK MANDIRI</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">1370 0293 8472</div>
                <div className="text-[11px] text-slate-400">a/n Ayu Maharani</div>
              </div>
              <button
                onClick={() => handleCopyAccount('137002938472', 'Mandiri')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1"
              >
                {copiedAccount === '137002938472' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RSVP Form Section */}
        <div className="px-6 py-10 bg-slate-900/70 border-t border-slate-800">
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
            <div className="bg-emerald-950/60 border border-emerald-800 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-base text-emerald-200">Terima Kasih Banyak!</h4>
              <p className="text-xs text-emerald-300">
                Konfirmasi kehadiran atas nama <strong className="text-white">{guestName}</strong>{' '}
                telah tersimpan di sistem resepsionis.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <ShareWhatsAppButton
                  invitationUrl={invitationUrl}
                  guestName={guestName !== 'Tamu Undangan' ? guestName : undefined}
                  eventTitle={invitation.title}
                  hosts={invitation.hosts}
                  date={invitation.date}
                  time={invitation.time}
                  venue={invitation.venue}
                  address={invitation.address}
                  variant="primary"
                  size="sm"
                  label="Bagikan Undangan ke Kerabat"
                />
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                >
                  Kirim Konfirmasi Baru
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitRsvp} className="space-y-4">
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
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-xs font-black rounded-xl shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Konfirmasi Kehadiran & Doa</span>
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

      {/* Lightbox / Zoom Photo Modal */}
      {selectedPhotoModal && (
        <div
          onClick={() => setSelectedPhotoModal(null)}
          className="fixed inset-0 z-60 bg-black/90 p-4 flex items-center justify-center cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={selectedPhotoModal}
              alt="Zoomed Photo"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
