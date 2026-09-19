import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Users,
  Gift,
  Share2,
  Eye,
  CheckCircle2,
  Copy,
  Sparkles,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

export const ClientDashboardScreen: React.FC = () => {
  const {
    currentProject,
    invitation,
    guests,
    formatCost,
    setShowPublicPreview,
    showToast,
    memories,
    setActiveTab,
  } = useEvent();

  // Countdown calculations
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 14,
    minutes: 35,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalGuests = guests.length;
  const confirmedGuests = guests.filter((g) => g.rsvpStatus === 'Confirmed');
  const pendingGuests = guests.filter((g) => g.rsvpStatus === 'Pending');
  const totalPaxConfirmed = confirmedGuests.reduce((acc, g) => acc + (g.pax || 1), 0);

  // Digital gifts / angpao mockup calculations
  const totalAngpao = 18500000;
  const angpaoCount = 24;

  const handleCopyLink = () => {
    const url = window.location.origin + '/#invitation';
    navigator.clipboard?.writeText(url);
    showToast('Link undangan digital berhasil disalin ke clipboard!');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome & Countdown Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs mb-3">
              <Heart className="w-3.5 h-3.5 fill-current text-pink-200" />
              <span>Dasbor Calon Pengantin & Klien</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{currentProject.name}</h1>
            <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-xl flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-200" />
              <span>{currentProject.date} • {currentProject.time}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{currentProject.location}</span>
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-[11px] font-bold text-pink-100 uppercase tracking-wider text-center mb-2">
              Hitung Mundur Hari Bahagia
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white/20 rounded-xl p-2 min-w-[54px]">
                <div className="text-xl sm:text-2xl font-black">{timeLeft.days}</div>
                <div className="text-[9px] uppercase font-bold text-pink-200">Hari</div>
              </div>
              <div className="bg-white/20 rounded-xl p-2 min-w-[54px]">
                <div className="text-xl sm:text-2xl font-black">{timeLeft.hours}</div>
                <div className="text-[9px] uppercase font-bold text-pink-200">Jam</div>
              </div>
              <div className="bg-white/20 rounded-xl p-2 min-w-[54px]">
                <div className="text-xl sm:text-2xl font-black">{timeLeft.minutes}</div>
                <div className="text-[9px] uppercase font-bold text-pink-200">Menit</div>
              </div>
              <div className="bg-white/20 rounded-xl p-2 min-w-[54px]">
                <div className="text-xl sm:text-2xl font-black">{timeLeft.seconds}</div>
                <div className="text-[9px] uppercase font-bold text-pink-200">Detik</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/15 flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowPublicPreview(true)}
            className="px-4 py-2 rounded-xl bg-white text-pink-700 hover:bg-pink-50 text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Lihat Undangan Digital</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <Copy className="w-4 h-4" />
            <span>Salin Link Undangan</span>
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Daftar Tamu ({totalGuests})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Konfirmasi RSVP</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{confirmedGuests.length}</span>
            <span className="text-xs text-slate-500">dari {totalGuests} undangan</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Estimasi Hadir:</span>
            <span className="font-bold text-emerald-600">{totalPaxConfirmed} Orang (Pax)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amplop & Kado Digital</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{formatCost(totalAngpao)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Total Donasi Tamu:</span>
            <span className="font-bold text-purple-600">{angpaoCount} Kiriman Masuk</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doa & Ucapan Masuk</span>
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{memories.length}</span>
            <span className="text-xs text-slate-500">ucapan dari sahabat & keluarga</span>
          </div>
          <div className="mt-2 text-xs text-pink-600 font-semibold truncate">
            Tersimpan di Buku Tamu Digital
          </div>
        </div>
      </div>

      {/* Couple Rundown Guide & Wedding Organizer PIC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Agenda & Susunan Acara Pengantin</h3>
              <p className="text-xs text-slate-500">Jadwal penting yang perlu diperhatikan saat hari H</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-pink-50 text-pink-700">
              Rundown Hari-H
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-16 shrink-0 font-bold text-xs text-pink-600">06:00 - 08:00</div>
              <div>
                <div className="text-xs font-bold text-slate-900">Makeup & Busana Pengantin (MUA)</div>
                <div className="text-[11px] text-slate-500">Kamar Pengantin Lt. 2 • PIC: Mba Rini MUA</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-16 shrink-0 font-bold text-xs text-pink-600">08:30 - 10:00</div>
              <div>
                <div className="text-xs font-bold text-slate-900">Prosesi Akad Nikah & Ijab Qabul</div>
                <div className="text-[11px] text-slate-500">Ruang Utama Masjid / Chapel • Penghulu & Saksi</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-16 shrink-0 font-bold text-xs text-pink-600">11:00 - 14:00</div>
              <div>
                <div className="text-xs font-bold text-slate-900">Resepsi Utama & Temu Undangan</div>
                <div className="text-[11px] text-slate-500">Grand Ballroom • Catering live buffet & photo booth</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-16 shrink-0 font-bold text-xs text-pink-600">14:00 - 15:00</div>
              <div>
                <div className="text-xs font-bold text-slate-900">Foto Bersama Keluarga Inti & Penutupan</div>
                <div className="text-[11px] text-slate-500">Pelaminan Utama • Dokumentasi Mahkota Photography</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wedding Organizer PIC Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Kontak PIC Wedding Organizer</h3>
            <p className="text-xs text-slate-500 mb-4">
              Tim penanggung jawab yang siap mendampingi Anda 24/7
            </p>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 mb-4">
              <div className="font-bold text-xs text-purple-900">Dimas Aditya (Lead Planner)</div>
              <div className="text-[11px] text-purple-700 mt-0.5">Pratama Event & Wedding Organizer</div>
              <div className="text-[11px] text-slate-600 mt-2">
                &ldquo;Kami memastikan seluruh alur acara berjalan sempurna sesuai impian Anda.&rdquo;
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </a>
            <button
              onClick={() => alert('Menghubungi Hotline EO: +62 812-3456-7890')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Telepon Langsung PIC</span>
            </button>
          </div>
        </div>
      </div>

      <GoogleAdSlot />
    </div>
  );
};
