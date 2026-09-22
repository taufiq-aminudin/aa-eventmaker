import React, { useState } from 'react';
import {
  MessageCircle,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  X,
  UserCheck,
  Send,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';

export interface ShareWhatsAppButtonProps {
  /** Target invitation URL to share. Defaults to current invitation slug URL */
  invitationUrl?: string;
  /** Optional pre-filled guest name */
  guestName?: string;
  /** Event title, e.g. "The Wedding Celebration" */
  eventTitle?: string;
  /** Hosts / Couple names, e.g. "Andi Pratama & Ayu Maharani" */
  hosts?: string;
  /** Event date */
  date?: string;
  /** Event time */
  time?: string;
  /** Venue name */
  venue?: string;
  /** Venue address */
  address?: string;
  /** Optional guest phone number (if known) */
  phoneNumber?: string;
  /** Optional E-Pass check-in code */
  checkInCode?: string;
  /** Optional assigned table */
  tableNumber?: string;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'compact' | 'pill';
  /** Button sizing */
  size?: 'sm' | 'md' | 'lg';
  /** Custom label */
  label?: string;
  /** Additional CSS class names */
  className?: string;
  /** Whether to open personalization dialog on click */
  enablePersonalizeModal?: boolean;
}

export const generatePersonalizedWhatsAppMessage = ({
  guestName = 'Bapak/Ibu/Saudara/i',
  eventTitle,
  hosts,
  date,
  time,
  venue,
  address,
  invitationUrl,
  checkInCode,
  tableNumber,
  tone = 'formal',
}: {
  guestName?: string;
  eventTitle: string;
  hosts: string;
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
  invitationUrl: string;
  checkInCode?: string;
  tableNumber?: string;
  tone?: 'formal' | 'casual';
}) => {
  const recipient = guestName.trim() || 'Bapak/Ibu/Saudara/i';
  const querySeparator = invitationUrl.includes('?') ? '&' : '?';
  const personalizedUrl = `${invitationUrl}${querySeparator}to=${encodeURIComponent(recipient)}`;

  if (tone === 'casual') {
    return `Halo *${recipient}*! ✨\n\nKami mengundang kamu untuk hadir dan merayakan momen bahagia kami di acara *${eventTitle}* (${hosts})!\n\n🗓️ Tanggal: *${date || 'Segera Dilaksanakan'}*\n⏰ Waktu: *${time || 'Sesuai Jadwal'}*\n📍 Lokasi: *${venue || 'Venue Acara'}*\n${address ? `🗺️ Alamat: ${address}\n` : ''}\nBuka undangan digital resmi kami melalui tautan berikut:\n${personalizedUrl}\n\nDitunggu kehadiran dan doa restunya ya! Mohon bantu isi RSVP di dalam undangan 🙌\n\nTerima kasih!`;
  }

  return `Kepada Yth. *${recipient}*,\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri perayaan *${eventTitle}* (${hosts}).\n\n🗓️ Hari/Tanggal: *${date || 'Segera Dilaksanakan'}*\n⏰ Waktu: *${time || 'Sesuai Jadwal'}*\n📍 Tempat: *${venue || 'Venue Acara'}*${address ? `\n🗺️ Alamat: ${address}` : ''}${checkInCode ? `\n🎫 Kode E-Pass: *${checkInCode}*` : ''}${tableNumber ? ` (Meja: ${tableNumber})` : ''}\n\nBuka undangan digital resmi Anda melalui tautan di bawah ini:\n${personalizedUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Mohon konfirmasi kehadiran (RSVP) melalui tautan di atas.\n\nTerima kasih banyak atas perhatian dan doa restu Bapak/Ibu/Saudara/i.`;
};

export const ShareWhatsAppButton: React.FC<ShareWhatsAppButtonProps> = ({
  invitationUrl,
  guestName: initialGuestName,
  eventTitle: propTitle,
  hosts: propHosts,
  date: propDate,
  time: propTime,
  venue: propVenue,
  address: propAddress,
  phoneNumber,
  checkInCode,
  tableNumber,
  variant = 'primary',
  size = 'md',
  label = 'Share via WhatsApp',
  className = '',
  enablePersonalizeModal = true,
}) => {
  const { invitation, showToast } = useEvent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientInput, setRecipientInput] = useState(initialGuestName || '');
  const [phoneInput, setPhoneInput] = useState(phoneNumber || '');
  const [tone, setTone] = useState<'formal' | 'casual'>('formal');
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Derived effective values
  const effectiveUrl =
    invitationUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/#invitation/${invitation.slug}`
      : `https://aieventmaker.app/#invitation/${invitation.slug}`);

  const effectiveTitle = propTitle || invitation.title || 'Undangan Acara';
  const effectiveHosts = propHosts || invitation.hosts || 'Penyelenggara';
  const effectiveDate = propDate || invitation.date;
  const effectiveTime = propTime || invitation.time;
  const effectiveVenue = propVenue || invitation.venue;
  const effectiveAddress = propAddress || invitation.address;

  // Build the message
  const generatedMessage = generatePersonalizedWhatsAppMessage({
    guestName: recipientInput || initialGuestName || 'Tamu Undangan',
    eventTitle: effectiveTitle,
    hosts: effectiveHosts,
    date: effectiveDate,
    time: effectiveTime,
    venue: effectiveVenue,
    address: effectiveAddress,
    invitationUrl: effectiveUrl,
    checkInCode,
    tableNumber,
    tone,
  });

  const getWhatsAppLink = (customPhone?: string) => {
    let cleanPhone = (customPhone || phoneInput).replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const encodedText = encodeURIComponent(generatedMessage);
    return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
  };

  const handleLaunchWhatsApp = () => {
    const link = getWhatsAppLink();
    const a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Membuka WhatsApp...');
    setIsModalOpen(false);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopiedMessage(true);
    showToast('Pesan WhatsApp disalin ke clipboard!');
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleCopyPersonalizedUrl = () => {
    const querySeparator = effectiveUrl.includes('?') ? '&' : '?';
    const finalUrl = recipientInput
      ? `${effectiveUrl}${querySeparator}to=${encodeURIComponent(recipientInput.trim())}`
      : effectiveUrl;
    navigator.clipboard.writeText(finalUrl);
    setCopiedUrl(true);
    showToast('Tautan undangan personal berhasil disalin!');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleClickMainButton = (e: React.MouseEvent) => {
    e.preventDefault();
    if (enablePersonalizeModal) {
      setIsModalOpen(true);
    } else {
      handleLaunchWhatsApp();
    }
  };

  // Sizing styles
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-2 rounded-xl gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 rounded-xl gap-2.5',
  }[size];

  // Variant styles
  const variantClasses = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 active:scale-98 transition-all',
    secondary:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition-all',
    outline:
      'bg-transparent hover:bg-emerald-50 text-emerald-700 border border-emerald-500 font-bold transition-all',
    compact:
      'bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold shadow-xs transition-all',
    pill:
      'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-full shadow-lg shadow-emerald-500/25 transition-all',
  }[variant];

  return (
    <>
      <button
        type="button"
        id="btn-share-whatsapp"
        onClick={handleClickMainButton}
        className={`inline-flex items-center justify-center cursor-pointer transition-all duration-200 select-none ${sizeClasses} ${variantClasses} ${className}`}
        title="Bagikan undangan digital via WhatsApp dengan nama tamu personal"
      >
        <MessageCircle className={size === 'sm' ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0'} />
        <span className="whitespace-nowrap">{label}</span>
      </button>

      {/* PERSONALIZED SHARING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-emerald-50/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Bagikan Undangan via WhatsApp</h3>
                  <p className="text-[11px] text-emerald-800">
                    Kirim pesan personal dengan nama tamu & tautan otomatis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
              {/* Recipient Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Nama Tamu Undangan (Personal)</span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Otomatis masuk ke pesan & amplop digital</span>
                  </span>
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    placeholder="Contoh: Bpk. Dr. Hendra Kusuma & Istri"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Optional Phone Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Tamu (Opsional)
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Contoh: 081382000412 atau 6281382000412"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Bila diisi, pesan langsung tertuju ke chat kontak tersebut. Bila dikosongkan, WhatsApp akan membuka daftar kontak Anda.
                </span>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gaya Bahasa Pesan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTone('formal')}
                    className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      tone === 'formal'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Resmi & Sopan (Standar)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone('casual')}
                    className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      tone === 'casual'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Santai & Akrab (Teman/Keluarga)
                  </button>
                </div>
              </div>

              {/* Live Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700">Preview Pesan WhatsApp</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleCopyPersonalizedUrl}
                      className="text-[11px] text-blue-600 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUrl ? 'Tautan Tersalin' : 'Salin Link'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="text-[11px] text-emerald-700 hover:underline flex items-center space-x-1 cursor-pointer font-semibold"
                    >
                      {copiedMessage ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedMessage ? 'Pesan Tersalin' : 'Salin Teks'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto shadow-inner select-text">
                  {generatedMessage}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMessage ? 'Tersalin' : 'Salin Teks'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLaunchWhatsApp}
                  className="px-4 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/25 flex items-center space-x-1.5 transition-all cursor-pointer hover:scale-102"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
