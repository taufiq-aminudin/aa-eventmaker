import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  Edit2,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { BudgetItem } from '../types';

export const BudgetScreen: React.FC = () => {
  const { budgets, addBudgetItem, updateBudgetItem, deleteBudgetItem } = useEvent();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [category, setCategory] = useState('');
  const [planned, setPlanned] = useState<number>(0);
  const [actual, setActual] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const totalPlanned = budgets.reduce((acc, b) => acc + b.plannedAmount, 0);
  const totalActual = budgets.reduce((acc, b) => acc + b.actualAmount, 0);
  const difference = totalPlanned - totalActual;
  const isSurplus = difference >= 0;

  // Remaining budget calculations
  const remainingBudget = difference;
  const spentPercentage = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
  const remainingPercentage = totalPlanned > 0 ? (remainingBudget / totalPlanned) * 100 : 0;

  // Clamped percentages for visual bar rendering (0 to 100)
  const visualSpentWidth = Math.min(100, Math.max(0, spentPercentage));
  const visualRemainingWidth = isSurplus ? Math.max(0, Math.min(100, remainingPercentage)) : 0;

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) return;

    if (editingItem) {
      updateBudgetItem({
        ...editingItem,
        category,
        plannedAmount: planned,
        actualAmount: actual,
        notes,
      });
      setEditingItem(null);
    } else {
      addBudgetItem(category, planned, actual, notes);
    }

    setShowModal(false);
    setCategory('');
    setPlanned(0);
    setActual(0);
    setNotes('');
  };

  return (
    <div id="budget-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            <h1 className="text-lg font-bold text-slate-900">Kalkulator Anggaran & Biaya Acara</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen estimasi plafon anggaran vs realisasi pembayaran seluruh vendor pernikahan.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setCategory('');
            setPlanned(0);
            setActual(0);
            setNotes('');
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item Biaya</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div id="card-total-planned" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Rencana Anggaran
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {formatRupiah(totalPlanned)}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Plafon estimasi awal total acara</div>
        </div>

        <div id="card-total-actual" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Realisasi Biaya
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">
              {formatRupiah(totalActual)}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Teralokasi / Terbayar</span>
            <span className="font-bold text-emerald-700">
              {totalPlanned > 0 ? spentPercentage.toFixed(1) : '0'}%
            </span>
          </div>
        </div>

        <div id="card-remaining-budget" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sisa Saldo Anggaran
            </div>
            <div
              className={`text-xl sm:text-2xl font-extrabold ${
                isSurplus ? 'text-blue-600' : 'text-rose-600'
              }`}
            >
              {isSurplus ? formatRupiah(remainingBudget) : `-${formatRupiah(Math.abs(remainingBudget))}`}
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  !isSurplus
                    ? 'bg-rose-500 w-full'
                    : remainingPercentage > 20
                    ? 'bg-blue-600'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${isSurplus ? visualRemainingWidth : 100}%` }}
              />
            </div>
            <div className="text-[11px] mt-1.5 font-medium flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {isSurplus ? (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-blue-600 font-semibold">
                      {remainingPercentage.toFixed(1)}% Tersisa
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="text-rose-600 font-semibold">Defisit Melebihi Plafon</span>
                  </>
                )}
              </div>
              <span className="text-slate-400 text-[10px]">
                {isSurplus ? 'Surplus' : 'Overbudget'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar Section: Automated Remaining Budget Tracker */}
      <div id="remaining-budget-tracker" className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Visualisasi Penyerapan & Sisa Anggaran
              </h2>
              <p className="text-xs text-slate-500">
                Kalkulasi real-time selisih antara total rencana plafon vs realisasi pengeluaran.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {totalPlanned === 0 ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                Belum Menetapkan Rencana
              </span>
            ) : isSurplus ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sisa Tersedia: {remainingPercentage.toFixed(1)}% ({formatRupiah(remainingBudget)})</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Overbudget: Melebihi Plafon {formatRupiah(Math.abs(remainingBudget))}</span>
              </span>
            )}
          </div>
        </div>

        {/* Dual Stacked / Segmented Progress Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Terpakai: {totalPlanned > 0 ? spentPercentage.toFixed(1) : 0}% ({formatRupiah(totalActual)})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  isSurplus ? 'bg-blue-600' : 'bg-rose-500'
                }`}
              />
              <span className={isSurplus ? 'text-blue-700' : 'text-rose-700'}>
                {isSurplus
                  ? `Sisa Anggaran: ${remainingPercentage.toFixed(1)}% (${formatRupiah(remainingBudget)})`
                  : `Kelebihan Biaya: +${formatRupiah(Math.abs(remainingBudget))}`}
              </span>
            </div>
          </div>

          {/* Visual Bar */}
          <div className="w-full bg-slate-100 h-4 rounded-xl overflow-hidden flex relative shadow-inner">
            {totalPlanned === 0 ? (
              <div className="w-full h-full bg-slate-200 text-[10px] text-slate-500 flex items-center justify-center font-medium">
                Plafon anggaran masih Rp 0
              </div>
            ) : isSurplus ? (
              <>
                {/* Spent portion */}
                <div
                  className="h-full bg-emerald-600 transition-all duration-500 ease-out"
                  style={{ width: `${visualSpentWidth}%` }}
                  title={`Terpakai: ${spentPercentage.toFixed(1)}% (${formatRupiah(totalActual)})`}
                />
                {/* Remaining portion */}
                <div
                  className="h-full bg-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${visualRemainingWidth}%` }}
                  title={`Sisa Anggaran: ${remainingPercentage.toFixed(1)}% (${formatRupiah(remainingBudget)})`}
                />
              </>
            ) : (
              <>
                {/* Overbudget spent bar */}
                <div
                  className="h-full bg-emerald-600"
                  style={{ width: `${(totalPlanned / totalActual) * 100}%` }}
                  title={`Plafon Rencana: ${formatRupiah(totalPlanned)}`}
                />
                {/* Deficit / Exceeded portion */}
                <div
                  className="h-full bg-rose-500"
                  style={{ width: `${((totalActual - totalPlanned) / totalActual) * 100}%` }}
                  title={`Defisit / Melebihi Plafon: ${formatRupiah(Math.abs(remainingBudget))}`}
                />
              </>
            )}
          </div>
        </div>

        {/* Quick Analytical Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-[11px] font-medium text-slate-500">Kapasitas Plafon Rencana</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">{formatRupiah(totalPlanned)}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">100% dasar alokasi</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
            <div className="text-[11px] font-medium text-emerald-800">Realisasi yang Dikeluarkan</div>
            <div className="text-sm font-bold text-emerald-900 mt-0.5">{formatRupiah(totalActual)}</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">
              {totalPlanned > 0 ? spentPercentage.toFixed(1) : 0}% dari total rencana
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              isSurplus
                ? 'bg-blue-50/70 border-blue-200/60'
                : 'bg-rose-50/70 border-rose-200/60'
            }`}
          >
            <div
              className={`text-[11px] font-medium ${
                isSurplus ? 'text-blue-800' : 'text-rose-800'
              }`}
            >
              {isSurplus ? 'Sisa Saldo yang Masih Tersedia' : 'Defisit Pengeluaran'}
            </div>
            <div
              className={`text-sm font-bold mt-0.5 ${
                isSurplus ? 'text-blue-950' : 'text-rose-950'
              }`}
            >
              {isSurplus ? formatRupiah(remainingBudget) : `-${formatRupiah(Math.abs(remainingBudget))}`}
            </div>
            <div
              className={`text-[10px] mt-0.5 ${
                isSurplus ? 'text-blue-700' : 'text-rose-700'
              }`}
            >
              {isSurplus
                ? `${remainingPercentage.toFixed(1)}% anggaran siap digunakan`
                : 'Melebihi plafon estimasi awal'}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Kategori Pengeluaran</th>
                <th className="py-3 px-4 text-right">Rencana</th>
                <th className="py-3 px-4 text-right">Realisasi</th>
                <th className="py-3 px-4 text-right">Selisih</th>
                <th className="py-3 px-4">Catatan / Rincian</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {budgets.map((item) => {
                const diff = item.plannedAmount - item.actualAmount;
                const percent =
                  item.plannedAmount > 0
                    ? Math.round((item.actualAmount / item.plannedAmount) * 100)
                    : 0;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center justify-between gap-2">
                        <span>{item.category}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${
                          diff >= 0 ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {diff >= 0 ? `Sisa ${(100 - Math.min(100, percent))}%` : `Over ${percent - 100}%`}
                        </span>
                      </div>
                      <div className="w-full max-w-[160px] bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percent > 100 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      {formatRupiah(item.plannedAmount)}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      {formatRupiah(item.actualAmount)}
                    </td>

                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        diff >= 0 ? 'text-blue-600' : 'text-rose-600'
                      }`}
                    >
                      {diff >= 0 ? `+${formatRupiah(diff)}` : `-${formatRupiah(Math.abs(diff))}`}
                    </td>

                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{item.notes}</td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setCategory(item.category);
                            setPlanned(item.plannedAmount);
                            setActual(item.actualAmount);
                            setNotes(item.notes);
                            setShowModal(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBudgetItem(item.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingItem ? 'Edit Item Anggaran' : 'Tambah Item Anggaran'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Masukkan estimasi rencana biaya dan pengeluaran aktual vendor.
            </p>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Vendor / Pos Biaya
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Katering & Gubukan (500 Pax)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rencana Anggaran (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={planned}
                    onChange={(e) => setPlanned(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Realisasi Aktual (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={actual}
                    onChange={(e) => setActual(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Rincian
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan fasilitas atau termin pembayaran vendor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Simpan Pos Biaya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
