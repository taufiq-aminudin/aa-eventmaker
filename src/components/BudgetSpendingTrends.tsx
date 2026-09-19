import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Sparkles,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useEvent } from '../context/EventContext';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatRupiah: (num: number) => string;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  formatRupiah,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-xl text-xs max-w-xs space-y-1.5 pointer-events-none">
        <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] font-normal text-slate-500">{data.dateRange}</span>
        </div>
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between gap-4 text-emerald-700">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>Pengeluaran Minggu Ini:</span>
            </span>
            <span className="font-bold">{formatRupiah(data.amount)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-blue-700">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              <span>Akumulasi Total:</span>
            </span>
            <span className="font-bold">{formatRupiah(data.cumulativeTotal)}</span>
          </div>
        </div>
        {data.note && (
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 italic">
            &ldquo;{data.note}&rdquo;
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const BudgetSpendingTrends: React.FC = () => {
  const { weeklyExpenses, addWeeklyExpense, deleteWeeklyExpense, budgets } = useEvent();

  const [viewMode, setViewMode] = useState<'combined' | 'graph' | 'list'>('combined');
  const [chartType, setChartType] = useState<'cumulative' | 'weekly'>('cumulative');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [weekLabel, setWeekLabel] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const formatRupiahShort = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + ' M';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + ' Jt';
    }
    return (num / 1000).toFixed(0) + ' Rb';
  };

  // Compute cumulative spending over time
  const processedChartData = useMemo(() => {
    let runningTotal = 0;
    return weeklyExpenses.map((exp) => {
      runningTotal += exp.amount;
      return {
        ...exp,
        cumulativeTotal: runningTotal,
        displayLabel: `${exp.weekLabel}`,
      };
    });
  }, [weeklyExpenses]);

  const totalSpentHistorical = useMemo(() => {
    return weeklyExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [weeklyExpenses]);

  const averageWeeklySpend = useMemo(() => {
    if (weeklyExpenses.length === 0) return 0;
    return Math.round(totalSpentHistorical / weeklyExpenses.length);
  }, [weeklyExpenses, totalSpentHistorical]);

  const peakWeeklySpend = useMemo(() => {
    if (weeklyExpenses.length === 0) return { amount: 0, weekLabel: '-' };
    return weeklyExpenses.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev), {
      amount: 0,
      weekLabel: '-',
    });
  }, [weeklyExpenses]);

  const handleOpenAddModal = () => {
    const nextWeekNum = weeklyExpenses.length + 1;
    setWeekLabel(`Minggu ${nextWeekNum}`);
    setDateRange('');
    setAmount(0);
    setNote('');
    setSelectedCategory(budgets[0]?.category || 'Vendor Acara');
    setShowAddModal(true);
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    addWeeklyExpense({
      weekLabel: weekLabel.trim() || `Minggu ${weeklyExpenses.length + 1}`,
      dateRange: dateRange.trim() || 'Baru Saja',
      amount,
      note: note.trim() || 'Pengeluaran pembayaran vendor acara',
      categories: selectedCategory ? [selectedCategory] : ['Operasional'],
    });

    setShowAddModal(false);
  };

  return (
    <div
      id="spending-trends-container"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      {/* Container Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Tren Pengeluaran & Riwayat Historis Mingguan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pantau laju pengeluaran acara secara historis dari minggu ke minggu beserta akumulasi total
            realisasinya.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* View mode switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('combined')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'combined'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                viewMode === 'graph'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Grafik Tren</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Daftar Riwayat</span>
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* KPI Trend Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100 border-b border-slate-100 bg-slate-50/50">
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Historis Tercatat
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            {formatRupiah(totalSpentHistorical)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {weeklyExpenses.length} periode pencairan mingguan
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Rata-Rata Mingguan
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-700 mt-1">
            {formatRupiah(averageWeeklySpend)}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Laju pengeluaran per minggu</div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Puncak Pengeluaran Tertinggi
          </div>
          <div className="text-base sm:text-lg font-bold text-blue-700 mt-1">
            {formatRupiah(peakWeeklySpend.amount)}
          </div>
          <div className="text-[10px] text-blue-600 mt-0.5">
            Terjadi pada {peakWeeklySpend.weekLabel}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Status Kecepatan Laju
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-800 mt-1 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Terkendali & Terstruktur</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Termin pembayaran sesuai jadwal</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* GRAPH SECTION */}
        {(viewMode === 'combined' || viewMode === 'graph') && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Grafik Tren Pengeluaran Historis
                </h3>
              </div>

              {/* Sub-selector for chart type */}
              <div className="flex items-center space-x-2 text-xs font-medium">
                <span className="text-slate-400 text-[11px]">Tipe Grafik:</span>
                <button
                  onClick={() => setChartType('cumulative')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    chartType === 'cumulative'
                      ? 'bg-blue-100 text-blue-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Akumulasi Total
                </button>
                <button
                  onClick={() => setChartType('weekly')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    chartType === 'weekly'
                      ? 'bg-emerald-100 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Per Minggu
                </button>
              </div>
            </div>

            {/* Recharts Component */}
            <div className="h-64 sm:h-72 w-full pt-2">
              {processedChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Belum ada data pengeluaran mingguan tercatat.
                </div>
              ) : chartType === 'cumulative' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={processedChartData}
                    margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="displayLabel"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatRupiahShort}
                    />
                    <Tooltip
                      content={<CustomChartTooltip formatRupiah={formatRupiah} />}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(val) => {
                        if (val === 'cumulativeTotal') return 'Akumulasi Total Pengeluaran (Rp)';
                        if (val === 'amount') return 'Pengeluaran Minggu Bersangkutan (Rp)';
                        return val;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeTotal"
                      name="cumulativeTotal"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#cumulativeGradient)"
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      name="amount"
                      stroke="#059669"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#weeklyGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={processedChartData}
                    margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="displayLabel"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatRupiahShort}
                    />
                    <Tooltip
                      content={<CustomChartTooltip formatRupiah={formatRupiah} />}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(val) => {
                        if (val === 'amount') return 'Nominal Pengeluaran Minggu Ini (Rp)';
                        return val;
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      name="amount"
                      fill="#059669"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* HISTORICAL LIST SECTION */}
        {(viewMode === 'combined' || viewMode === 'list') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Daftar Riwayat Pengeluaran Mingguan ({weeklyExpenses.length} Periode)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Kronologis pencairan dana vendor
              </span>
            </div>

            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {processedChartData.map((item, idx) => {
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.25 }}
                      className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      {/* Left: Week and description */}
                      <div className="flex items-start space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center font-extrabold text-xs shrink-0 border border-blue-100">
                          <span>W{idx + 1}</span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="font-bold text-xs text-slate-900">
                              {item.weekLabel}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{item.dateRange}</span>
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-1">
                            {item.note}
                          </p>

                          {/* Category chips */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.categories.map((cat, cIdx) => (
                              <span
                                key={cIdx}
                                className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Amounts & delete */}
                      <div className="flex items-center justify-between sm:justify-end sm:space-x-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <div className="text-xs font-bold text-emerald-700 flex items-center sm:justify-end space-x-1">
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                            <span>+{formatRupiah(item.amount)}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Akumulasi: {formatRupiah(item.cumulativeTotal)}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteWeeklyExpense(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus riwayat pengeluaran ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {weeklyExpenses.length === 0 && (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                  Belum ada catatan pengeluaran mingguan. Klik tombol &ldquo;Catat Pengeluaran&rdquo; untuk menambahkan.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD WEEKLY EXPENSE */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Catat Pengeluaran Mingguan Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Masukkan nominal pencairan dana untuk memantau grafik tren pengeluaran.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitExpense} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Label Periode
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Minggu 7"
                      value={weekLabel}
                      onChange={(e) => setWeekLabel(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Rentang Tanggal
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 12 – 18 Sep 2026"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nominal Pencairan / Pengeluaran (Rp)
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={100000}
                    required
                    placeholder="Contoh: 15000000"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold text-emerald-700"
                  />
                  {amount > 0 && (
                    <div className="text-[11px] text-emerald-700 font-medium mt-1">
                      {formatRupiah(amount)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Pengeluaran
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {budgets.map((b) => (
                      <option key={b.id} value={b.category}>
                        {b.category}
                      </option>
                    ))}
                    <option value="Biaya Tak Terduga / Operasional">
                      Biaya Tak Terduga / Operasional
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan / Rincian Pencairan
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Contoh: Pelunasan sisa gubukan katering & tip kru dekorasi"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Simpan Pengeluaran
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
