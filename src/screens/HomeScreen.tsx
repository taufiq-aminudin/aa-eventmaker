import React from 'react';
import {
  Mail,
  Users,
  CheckSquare,
  Wallet,
  Sparkles,
  MapPin,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Clock,
  Calendar,
  Eye,
  TrendingUp,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { DynamicEventHeader } from '../components/DynamicEventHeader';
import { ThemeMood } from '../utils/themePresets';
import { soundManager } from '../utils/ambientSound';

interface HomeScreenProps {
  currentThemeMood?: ThemeMood;
  onSelectThemeMood?: (mood: ThemeMood) => void;
  isPlayingMusic?: boolean;
  onToggleMusic?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentThemeMood = 'indigo',
  onSelectThemeMood = () => {},
  isPlayingMusic = false,
  onToggleMusic = () => {},
}) => {
  const {
    currentProject,
    invitation,
    guests,
    tasks,
    budgets,
    addTask,
    showToast,
    setActiveTab,
    setShowPublicPreview,
    setShowQrCheckinModal,
    formatCost,
  } = useEvent();

  // Metrics Calculations
  const totalGuests = guests.length;
  const totalPax = guests.reduce((acc, g) => acc + g.pax, 0);
  const confirmedGuests = guests.filter((g) => g.rsvpStatus === 'Confirmed');
  const confirmedPax = confirmedGuests.reduce((acc, g) => acc + g.pax, 0);
  const checkedInCount = guests.filter((g) => g.isCheckedIn).length;
  const checkedInPax = guests
    .filter((g) => g.isCheckedIn)
    .reduce((acc, g) => acc + g.pax, 0);

  const totalPlannedBudget = budgets.reduce((acc, b) => acc + b.plannedAmount, 0);
  const totalActualBudget = budgets.reduce((acc, b) => acc + b.actualAmount, 0);
  const budgetPercentage =
    totalPlannedBudget > 0 ? Math.round((totalActualBudget / totalPlannedBudget) * 100) : 0;

  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const taskPercentage =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const featureCards = [
    {
      id: 1,
      tab: 1,
      title: 'Undangan Digital',
      desc: 'Atur tema desain, informasi mempelai, waktu, dan publikasikan tautan.',
      icon: Mail,
      color: 'from-purple-500 to-indigo-600',
      badge: invitation.isPublished ? 'Published' : 'Draft',
    },
    {
      id: 2,
      tab: 2,
      title: 'Buku Tamu & E-Pass',
      desc: 'Kirim blast WA/email, pantau RSVP, dan scan QR check-in resepsionis.',
      icon: Users,
      color: 'from-pink-500 to-rose-600',
      badge: `${totalGuests} Tamu`,
    },
    {
      id: 3,
      tab: 3,
      title: 'Checklist Planner',
      desc: 'Lacak kelengkapan persiapan vendor, busana, catering, dan dekorasi.',
      icon: CheckSquare,
      color: 'from-amber-500 to-orange-600',
      badge: `${taskPercentage}% Siap`,
    },
    {
      id: 4,
      tab: 4,
      title: 'Anggaran & Biaya',
      desc: 'Kalkulator estimasi vs realisasi pengeluaran seluruh vendor acara.',
      icon: Wallet,
      color: 'from-emerald-500 to-teal-600',
      badge: formatCost(totalActualBudget),
    },
    {
      id: 5,
      tab: 5,
      title: 'Creative Studio',
      desc: 'Preset tone foto sinematik, panduan video TikTok/Reels, dan konsep AI.',
      icon: Sparkles,
      color: 'from-violet-500 to-purple-600',
      badge: 'AI Creator',
    },
    {
      id: 6,
      tab: 6,
      title: 'Lokasi & Memori',
      desc: 'Petunjuk peta Google Maps gedung dan arsip ucapan doa para tamu.',
      icon: MapPin,
      color: 'from-blue-500 to-cyan-600',
      badge: 'Buku Tamu',
    },
  ];

  return (
    <div id="home-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Dynamic Visual Hero Header with Real-Time Countdown & Atmosphere Settings */}
      <DynamicEventHeader
        currentThemeMood={currentThemeMood}
        onSelectThemeMood={onSelectThemeMood}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={onToggleMusic}
      />

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* RSVP Card */}
        <div
          onClick={() => setActiveTab(2)}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              RSVP & Hadir
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-[#6d28d9] group-hover:bg-purple-100 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {confirmedPax}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ {totalPax} Pax Hadir</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2.5">
            <span>Check-in Hari-H:</span>
            <span className="font-bold text-emerald-600">
              {checkedInCount} Tamu ({checkedInPax} Pax)
            </span>
          </div>
        </div>

        {/* Budget Card */}
        <div
          onClick={() => setActiveTab(4)}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Realisasi Biaya
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {formatCost(totalActualBudget)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2.5">
            <span>Rencana: {formatCost(totalPlannedBudget)}</span>
            <span
              className={`font-bold ${
                budgetPercentage <= 100 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {budgetPercentage}% Terpakai
            </span>
          </div>
        </div>

        {/* Tasks Card */}
        <div
          onClick={() => setActiveTab(3)}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kesiapan Acara
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {tasks.length} Tugas Selesai
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${taskPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feature Grid Navigation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Modul Fitur AA Event Maker</h2>
          <span className="text-xs text-slate-500">Pilih modul untuk mengelola acara</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={`feature-card-${card.id}`}
                onClick={() => setActiveTab(card.tab)}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-xs`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#6d28d9] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#6d28d9] group-hover:translate-x-0.5 transition-transform">
                  <span>Buka Modul</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Panel: Recent Guests & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Guests Panel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#6d28d9]" />
              <h3 className="text-sm font-bold text-slate-900">Status Terkini Tamu Undangan</h3>
            </div>
            <button
              onClick={() => setActiveTab(2)}
              className="text-xs font-semibold text-[#6d28d9] hover:underline"
            >
              Lihat Semua ({guests.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {guests.slice(0, 4).map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">{g.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-purple-100 text-[#6d28d9] font-medium">
                      {g.group}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Meja: {g.tableNumber} • {g.pax} Orang
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      g.isCheckedIn
                        ? 'bg-emerald-100 text-emerald-800'
                        : g.rsvpStatus === 'Confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {g.isCheckedIn ? '✓ Hadir' : g.rsvpStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Tasks Panel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-[#6d28d9]" />
              <h3 className="text-sm font-bold text-slate-900">Tugas & Agenda Terdekat</h3>
            </div>
            <button
              onClick={() => setActiveTab(3)}
              className="text-xs font-semibold text-[#6d28d9] hover:underline"
            >
              Buka Planner ({tasks.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      t.isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {t.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`text-xs font-medium block truncate ${
                        t.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {t.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      PIC: {t.assignee} • Batas: {t.dueDate}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 shrink-0">
                  {t.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Specific Event Tasks */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white rounded-2xl p-5 sm:p-6 border border-purple-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Rekomendasi Spesifik Acara</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Agenda & Persiapan Khas: {currentProject.name}
            </h3>
            <p className="text-xs text-slate-500">
              Disesuaikan untuk {currentProject.category || currentProject.type} {currentProject.culturalStyle ? `(Adat ${currentProject.culturalStyle})` : ''}
            </p>
          </div>

          <button
            onClick={() => setActiveTab(3)}
            className="text-xs font-bold text-purple-700 hover:text-purple-800 bg-white hover:bg-purple-50 px-3.5 py-1.5 rounded-xl border border-purple-200 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            Buka Checklist Planner →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(() => {
            const catLower = (currentProject.category || currentProject.type || '').toLowerCase();
            let items = [
              { title: 'Finalisasi Rundown Akad & Resepsi', tag: 'Acara', assignee: 'Wedding Planner' },
              { title: 'Konfirmasi Menu Katering & Food Tasting', tag: 'Katering', assignee: 'Keluarga' },
              { title: 'Persiapan Kotak Mahar & Seserahan Adat', tag: 'Perlengkapan', assignee: 'Calon Pengantin' },
              { title: 'Fitting Busana Adat & MUA Pengantin', tag: 'Busana & Rias', assignee: 'Mempelai' },
            ];

            if (catLower.includes('birthday') || catLower.includes('ulang tahun')) {
              items = [
                { title: 'Pemesanan Kue Ulang Tahun & Lilin', tag: 'Konsumsi', assignee: 'Tuan Rumah' },
                { title: 'Dekorasi Balon, Backdrop & Photobooth', tag: 'Dekorasi', assignee: 'EO' },
                { title: 'Pengadaan Goodie Bag & Souvenir', tag: 'Souvenir', assignee: 'Panitia' },
                { title: 'Persiapan MC & Playlist Musik', tag: 'Hiburan', assignee: 'MC' },
              ];
            } else if (catLower.includes('baby') || catLower.includes('aqiqah') || catLower.includes('kelahiran')) {
              items = [
                { title: 'Pemesanan Kambing Aqiqah Bersertifikat', tag: 'Aqiqah', assignee: 'Ayah' },
                { title: 'Pengadaan Paket Nasi Box Berkat', tag: 'Katering', assignee: 'Keluarga' },
                { title: 'Perlengkapan Cukur Rambut Bayi', tag: 'Tradisi', assignee: 'Ibu' },
                { title: 'Cetak Buku Doa & Souvenir Tasyakuran', tag: 'Souvenir', assignee: 'Panitia' },
              ];
            } else if (catLower.includes('khitan') || catLower.includes('circumcision')) {
              items = [
                { title: 'Konfirmasi Dokter / Medis Khitan Modern', tag: 'Medis', assignee: 'Orang Tua' },
                { title: 'Pakaian Khitan Lengkap (Koko & Sarung)', tag: 'Busana', assignee: 'Ibu' },
                { title: 'Hadiah / Santunan untuk Anak', tag: 'Hadiah', assignee: 'Keluarga' },
                { title: 'Pemesanan Tumpeng Walimah Khitan', tag: 'Konsumsi', assignee: 'Tuan Rumah' },
              ];
            } else if (catLower.includes('corporate') || catLower.includes('seminar') || catLower.includes('education')) {
              items = [
                { title: 'Booking Venue Hall & Sound System LED', tag: 'Venue', assignee: 'Event Manager' },
                { title: 'Konfirmasi Keynote Speaker & Moderator', tag: 'Narasumber', assignee: 'Divisi Acara' },
                { title: 'Registrasi Peserta & ID Card Lanyard', tag: 'Registrasi', assignee: 'Sekretariat' },
                { title: 'Pemesanan Coffee Break & Lunch Box', tag: 'Konsumsi', assignee: 'Logistik' },
              ];
            }

            return items.map((item, idx) => {
              const alreadyAdded = tasks.some((t) => t.title.toLowerCase() === item.title.toLowerCase());
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-purple-100 shadow-2xs flex flex-col justify-between space-y-2 hover:border-purple-300 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">
                        {item.tag}
                      </span>
                      <span className="text-slate-400">PIC: {item.assignee}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-snug">{item.title}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (alreadyAdded) {
                        showToast(`Agenda "${item.title}" sudah ada di planner.`);
                        return;
                      }
                      const dueDate = currentProject.date || '2026-11-20';
                      addTask(item.title, item.tag, dueDate, item.assignee);
                      showToast(`✓ Ditambahkan ke checklist: "${item.title}"`);
                    }}
                    className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                      alreadyAdded
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {alreadyAdded ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Sudah Ditambahkan</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3 text-purple-600" />
                        <span>+ Tambah ke Planner</span>
                      </>
                    )}
                  </button>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
};
