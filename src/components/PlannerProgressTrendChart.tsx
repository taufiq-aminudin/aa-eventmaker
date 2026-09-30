import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  ArrowUpRight,
  AlertTriangle,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { useEvent } from '../context/EventContext';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomProgressTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPastOrCurrent = data.isActualRecorded;
    const isEventDay = data.isEventDay;

    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-xl text-xs max-w-xs space-y-2 pointer-events-none">
        <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>{label}</span>
          </div>
          {isEventDay ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Hari H Acara
            </span>
          ) : data.isCurrent ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              Posisi Hari Ini
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-medium">{data.timelineNote}</span>
          )}
        </div>

        <div className="space-y-1.5">
          {data.actualPercent !== undefined && isPastOrCurrent && (
            <div className="flex items-center justify-between gap-4 text-emerald-700 bg-emerald-50/70 px-2 py-1 rounded-lg">
              <span className="flex items-center space-x-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                <span>Progres Aktual:</span>
              </span>
              <span className="font-extrabold">{data.actualPercent}%</span>
            </div>
          )}

          {data.projectedPercent !== undefined && !isPastOrCurrent && (
            <div className="flex items-center justify-between gap-4 text-indigo-700 bg-indigo-50/70 px-2 py-1 rounded-lg">
              <span className="flex items-center space-x-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                <span>Proyeksi Laju:</span>
              </span>
              <span className="font-extrabold">{data.projectedPercent}%</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 text-amber-800 bg-amber-50/70 px-2 py-1 rounded-lg">
            <span className="flex items-center space-x-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <span>Target Ideal (S-Curve):</span>
            </span>
            <span className="font-extrabold">{data.targetPercent}%</span>
          </div>

          <div className="pt-1 text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-100">
            <span>Milestone:</span>
            <span className="font-semibold text-slate-800">{data.milestoneTitle}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const PlannerProgressTrendChart: React.FC = () => {
  const { tasks, currentProject } = useEvent();
  const [showTargetLine, setShowTargetLine] = useState(true);
  const [showProjectionLine, setShowProjectionLine] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const currentPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Build timeline progression leading up to event date
  const { chartData, currentTargetPercent, variance, paceStatus, eventDateLabel, daysRemaining } =
    useMemo(() => {
      const eventDateStr = currentProject?.date || '24 Oktober 2026';

      // Estimate days remaining to event (default approx 24 days for demo project)
      const days = 24;

      // Milestone points from 8 weeks before event to the event date
      // We calculate a realistic progression curve where the 'Current' point matches currentPercentage exactly!
      const points = [
        {
          key: 'w-8',
          label: 'H-60 (Ags)',
          timelineNote: '8 Minggu Lalu',
          milestoneTitle: 'Kickoff & Pembentukan Panitia',
          targetPercent: 15,
          actualPercent: 15,
          projectedPercent: 15,
          isActualRecorded: true,
          isCurrent: false,
          isEventDay: false,
        },
        {
          key: 'w-6',
          label: 'H-45 (Sep Awal)',
          timelineNote: '6 Minggu Lalu',
          milestoneTitle: 'Booking Venue & Katering',
          targetPercent: 30,
          actualPercent: Math.min(30, Math.max(15, Math.round(currentPercentage * 0.5))),
          projectedPercent: Math.min(30, Math.max(15, Math.round(currentPercentage * 0.5))),
          isActualRecorded: true,
          isCurrent: false,
          isEventDay: false,
        },
        {
          key: 'w-4',
          label: 'H-30 (Sep Akhir)',
          timelineNote: '4 Minggu Lalu',
          milestoneTitle: 'Foto/Video & Fitting Busana',
          targetPercent: 45,
          actualPercent: Math.min(45, Math.max(20, Math.round(currentPercentage * 0.8))),
          projectedPercent: Math.min(45, Math.max(20, Math.round(currentPercentage * 0.8))),
          isActualRecorded: true,
          isCurrent: false,
          isEventDay: false,
        },
        {
          key: 'current',
          label: 'Hari Ini',
          timelineNote: 'Posisi Aktual Saat Ini',
          milestoneTitle: `${completedTasks} dari ${totalTasks} Agenda Selesai`,
          targetPercent: 55,
          actualPercent: currentPercentage,
          projectedPercent: currentPercentage,
          isActualRecorded: true,
          isCurrent: true,
          isEventDay: false,
        },
        {
          key: 'w-2',
          label: 'H-14 (Okt Awal)',
          timelineNote: '2 Minggu Menuju Hari H',
          milestoneTitle: 'Blast Undangan Digital & RSVP',
          targetPercent: 75,
          actualPercent: undefined,
          projectedPercent: Math.min(
            100,
            Math.round(currentPercentage + (100 - currentPercentage) * 0.45)
          ),
          isActualRecorded: false,
          isCurrent: false,
          isEventDay: false,
        },
        {
          key: 'w-1',
          label: 'H-7 (Gladi)',
          timelineNote: '1 Minggu Menuju Hari H',
          milestoneTitle: 'Technical Meeting & Gladi Bersih',
          targetPercent: 90,
          actualPercent: undefined,
          projectedPercent: Math.min(
            100,
            Math.round(currentPercentage + (100 - currentPercentage) * 0.8)
          ),
          isActualRecorded: false,
          isCurrent: false,
          isEventDay: false,
        },
        {
          key: 'event-day',
          label: 'Hari H (24 Okt)',
          timelineNote: 'Pelaksanaan Acara Puncak',
          milestoneTitle: 'Akad Nikah & Resepsi Puncak',
          targetPercent: 100,
          actualPercent: undefined,
          projectedPercent: 100,
          isActualRecorded: false,
          isCurrent: false,
          isEventDay: true,
        },
      ];

      const currentPoint = points.find((p) => p.isCurrent);
      const targetNow = currentPoint ? currentPoint.targetPercent : 55;
      const diff = currentPercentage - targetNow;

      let status: 'ahead' | 'on_track' | 'behind' = 'on_track';
      if (diff >= 5) status = 'ahead';
      else if (diff <= -5) status = 'behind';

      return {
        chartData: points,
        currentTargetPercent: targetNow,
        variance: diff,
        paceStatus: status,
        eventDateLabel: eventDateStr,
        daysRemaining: days,
      };
    }, [tasks, currentProject, completedTasks, totalTasks, currentPercentage]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Top Header & Overview Bar */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                <span>Tren Progres Checklist Menuju Hari H</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Visualisasi Recharts
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Memantau laju penyelesaian tugas terhadap target kurva rencana (S-Curve) hingga tanggal acara ({eventDateLabel}).
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Collapse Button */}
        <div className="flex items-center space-x-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowTargetLine(!showTargetLine)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
              showTargetLine
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="Tampilkan / sembunyikan garis target rencana ideal"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Target Rencana</span>
          </button>

          <button
            type="button"
            onClick={() => setShowProjectionLine(!showProjectionLine)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
              showProjectionLine
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-2xs'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="Tampilkan / sembunyikan garis proyeksi laju ke depan"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Proyeksi Laju</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title={isCollapsed ? 'Buka grafik tren' : 'Ciutkan grafik'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Key Trend Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1: Actual Progress */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Kemajuan Saat Ini</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </span>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-slate-900">{currentPercentage}%</span>
                <span className="text-xs text-slate-500 font-semibold">
                  ({completedTasks}/{totalTasks} Tugas)
                </span>
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                Terselesaikan secara nyata
              </div>
            </div>

            {/* Metric 2: Target Benchmark */}
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
                <span>Target Minggu Ini</span>
                <Target className="w-3.5 h-3.5 text-amber-600" />
              </span>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-amber-950">{currentTargetPercent}%</span>
                <span className="text-xs text-amber-800 font-semibold">S-Curve Ideal</span>
              </div>
              <div className="text-[10px] text-amber-800 font-semibold mt-1">
                Sasaran timeline persiapan
              </div>
            </div>

            {/* Metric 3: Pace Status */}
            <div
              className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                paceStatus === 'ahead'
                  ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                  : paceStatus === 'behind'
                  ? 'bg-rose-50/50 border-rose-200/80 text-rose-900'
                  : 'bg-blue-50/50 border-blue-200/80 text-blue-900'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Status Laju</span>
                {paceStatus === 'ahead' ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                ) : paceStatus === 'behind' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                )}
              </span>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-lg sm:text-xl font-black">
                  {paceStatus === 'ahead'
                    ? `+${variance}% Ahead`
                    : paceStatus === 'behind'
                    ? `${variance}% Perlu Dikejar`
                    : 'Tepat Sesuai Rencana'}
                </span>
              </div>
              <div className="text-[10px] font-semibold mt-1 opacity-90">
                {paceStatus === 'ahead'
                  ? 'Lebih cepat dari target ideal'
                  : paceStatus === 'behind'
                  ? 'Tingkatkan eksekusi tugas'
                  : 'Kecepatan stabil & on track'}
              </div>
            </div>

            {/* Metric 4: Days to Event Date */}
            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200/80 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-between">
                <span>Hari H Acara</span>
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
              </span>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-indigo-950">{daysRemaining} Hari</span>
                <span className="text-xs text-indigo-700 font-semibold">Tersisa</span>
              </div>
              <div className="text-[10px] text-indigo-700 font-semibold mt-1 truncate">
                Target: {eventDateLabel}
              </div>
            </div>
          </div>

          {/* Recharts Composed Area & Line Chart */}
          <div className="w-full h-72 sm:h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 25, left: -10, bottom: 10 }}
              >
                <defs>
                  {/* Actual Progress Green Gradient */}
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Projected Purple Gradient */}
                  <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  unit="%"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />

                <Tooltip content={<CustomProgressTooltip />} />

                <Legend
                  verticalAlign="top"
                  align="right"
                  height={32}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                />

                {/* 100% Target Reference Line */}
                <ReferenceLine
                  y={100}
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Target 100% Siap',
                    position: 'insideTopLeft',
                    fill: '#64748b',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />

                {/* Current Date Vertical Reference Line */}
                <ReferenceLine
                  x="Hari Ini"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{
                    value: `Hari Ini (${currentPercentage}%)`,
                    position: 'top',
                    fill: '#b45309',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />

                {/* Event Day Vertical Reference Line */}
                <ReferenceLine
                  x="Hari H (24 Okt)"
                  stroke="#10b981"
                  strokeWidth={2}
                  label={{
                    value: 'Hari H 🎉',
                    position: 'top',
                    fill: '#047857',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />

                {/* Projected Progress Area / Line */}
                {showProjectionLine && (
                  <Area
                    type="monotone"
                    dataKey="projectedPercent"
                    name="Proyeksi Laju (%)"
                    stroke="#6366f1"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="url(#projectedGradient)"
                    dot={{ fill: '#6366f1', r: 3 }}
                    connectNulls
                  />
                )}

                {/* Actual Recorded Progress Area */}
                <Area
                  type="monotone"
                  dataKey="actualPercent"
                  name="Progres Aktual (%)"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#actualGradient)"
                  dot={{
                    fill: '#10b981',
                    stroke: '#ffffff',
                    strokeWidth: 2,
                    r: 5,
                  }}
                  activeDot={{
                    r: 7,
                    fill: '#047857',
                    stroke: '#ffffff',
                    strokeWidth: 2,
                  }}
                  connectNulls={false}
                />

                {/* Planned Target S-Curve Line */}
                {showTargetLine && (
                  <Line
                    type="monotone"
                    dataKey="targetPercent"
                    name="Target Ideal S-Curve (%)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 3 }}
                    strokeDasharray="3 3"
                  />
                )}

                {/* Prominent Reference Dot on Current Position */}
                <ReferenceDot
                  x="Hari Ini"
                  y={currentPercentage}
                  r={7}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Legend & Milestone Checkpoints Strip */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 text-slate-600">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
                <span className="font-semibold text-slate-800">Garis Hijau:</span>
                <span>Progres yang telah diselesaikan</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-amber-500 border-t border-dashed inline-block" />
                <span className="font-semibold text-slate-800">Garis Putus Oranye:</span>
                <span>Target ideal per fase persiapan</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-indigo-500 border-t border-dashed inline-block" />
                <span className="font-semibold text-slate-800">Garis Putus Ungu:</span>
                <span>Prakiraan laju menuju 100%</span>
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Otomatis Sinkron dengan Checklist</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
