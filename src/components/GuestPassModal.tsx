import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share2, CheckCircle2, MapPin, Calendar, Clock, Download } from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { getCheckInUrl } from '../utils/templateEngine';

export const GuestPassModal: React.FC = () => {
  const {
    selectedGuestForPass,
    setSelectedGuestForPass,
    invitation,
    currentProject,
    checkInGuest,
    showToast,
  } = useEvent();

  const [copied, setCopied] = useState(false);

  if (!selectedGuestForPass) return null;

  const guest = selectedGuestForPass;
  const checkInUrl = getCheckInUrl(guest, invitation.slug);

  // QR Payload as structured JSON
  const qrPayload = JSON.stringify({
    app: 'AA_EVENT_MAKER',
    type: 'EVENT_PASS',
    id: guest.id,
    code: guest.checkInCode,
    name: guest.name,
    pax: guest.pax,
    table: guest.tableNumber,
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(checkInUrl);
    setCopied(true);
    showToast('Tautan E-Pass berhasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWa = () => {
    const text = `Halo ${guest.name}, berikut adalah E-Pass digital resmi untuk menghadiri ${
      invitation.title || currentProject.name
    }:\n\nNomor Meja: ${guest.tableNumber}\nKuota: ${
      guest.pax
    } Orang\nKode Check-In: ${guest.checkInCode}\n\nTautan Tiket & QR Code:\n${checkInUrl}\n\nSampai jumpa di hari bahagia kami!`;
    const waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
      guest.phone || ''
    )}&text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div
      id="guest-pass-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#6d28d9] to-[#ec4899] p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full">
              VIP E-PASS
            </span>
            <span className="text-xs text-white/80 font-mono">#{guest.checkInCode}</span>
          </div>
          <button
            onClick={() => setSelectedGuestForPass(null)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Body */}
        <div className="p-6 text-center overflow-y-auto space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#6d28d9] mb-1">
              {currentProject.name}
            </h4>
            <h3 className="text-xl font-serif font-bold text-slate-900 leading-tight">
              {invitation.title}
            </h3>
          </div>

          {/* QR Container */}
          <div className="bg-gradient-to-b from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100 flex flex-col items-center justify-center">
            <div className="bg-white p-3 rounded-xl shadow-xs border border-purple-100">
              <QRCodeSVG
                value={qrPayload}
                size={180}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: '/assets/icon.svg',
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  excavate: true,
                }}
              />
            </div>
            <div className="mt-2 text-xs font-mono font-bold text-[#6d28d9] tracking-wider">
              {guest.checkInCode}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Tunjukkan QR Code ini kepada resepsionis saat memasuki gedung
            </p>
          </div>

          {/* Guest Specifics */}
          <div className="bg-slate-50 p-3.5 rounded-xl text-left border border-slate-100 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-xs text-slate-500">Nama Tamu</span>
              <span className="text-xs font-bold text-slate-900">{guest.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-xs text-slate-500">Kategori & Meja</span>
              <span className="text-xs font-bold text-[#6d28d9]">
                {guest.group} • {guest.tableNumber}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-xs text-slate-500">Alokasi Kursi</span>
              <span className="text-xs font-bold text-slate-900">{guest.pax} Orang</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Status Kehadiran</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  guest.isCheckedIn
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {guest.isCheckedIn ? `✓ Hadir (${guest.checkInTime})` : 'Belum Check-In'}
              </span>
            </div>
          </div>

          {/* Event Metadata */}
          <div className="text-left space-y-1.5 text-xs text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-[#6d28d9] shrink-0" />
              <span>{invitation.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-[#6d28d9] shrink-0" />
              <span>{invitation.time}</span>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#6d28d9] shrink-0 mt-0.5" />
              <span className="line-clamp-2">{invitation.venue}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin URL'}</span>
            </button>

            <button
              onClick={handleShareWa}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Kirim WA</span>
            </button>
          </div>

          {!guest.isCheckedIn && (
            <button
              onClick={() => {
                checkInGuest(guest.id);
                setSelectedGuestForPass(null);
              }}
              className="w-full py-2 bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tandai Tamu Sudah Hadir</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
