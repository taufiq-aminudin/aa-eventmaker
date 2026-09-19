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
} from 'lucide-react';
import { useEvent } from '../context/EventContext';

export const HomeScreen: React.FC = () => {
  const {
    currentProject,
    invitation,
    guests,
    tasks,
    budgets,
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
    <div id="home-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#db2777] p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        {/* Abstract circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-36 -top-12 w-48 h-48 rounded-full bg-pink-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentProject.type} Management Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {currentProject.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-purple-100 pt-1">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-purple-200" />
                <span>{currentProject.date}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-purple-200" />
                <span>{currentProject.time}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-purple-200" />
                <span className="truncate max-w-xs">{currentProject.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
            <button
              id="home-btn-scanner"
              onClick={() => setShowQrCheckinModal(true)}
              className="px-4 py-2.5 bg-white text-[#6d28d9] font-bold text-xs rounded-xl shadow-md hover:bg-purple-50 transition-colors flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Check-In</span>
            </button>
            <button
              id="home-btn-preview"
              onClick={() => setShowPublicPreview(true)}
              className="px-4 py-2.5 bg-purple-900/40 hover:bg-purple-900/60 border border-white/20 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-2 backdrop-blur-md"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Undangan</span>
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
};
