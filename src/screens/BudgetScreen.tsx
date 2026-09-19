import React, { useState } from 'react';
import { Wallet, Plus, Trash2, Edit2, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
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
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Total Rencana Anggaran
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {formatRupiah(totalPlanned)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Plafon estimasi awal</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Total Realisasi Biaya
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">
            {formatRupiah(totalActual)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0}% teralokasi
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Sisa Saldo Anggaran
          </div>
          <div
            className={`text-xl sm:text-2xl font-extrabold ${
              isSurplus ? 'text-blue-600' : 'text-rose-600'
            }`}
          >
            {formatRupiah(Math.abs(difference))}
          </div>
          <div className="text-[11px] mt-1 font-medium flex items-center space-x-1">
            {isSurplus ? (
              <>
                <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-600">Surplus / Hemat Anggaran</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-rose-600">Defisit Melebihi Plafon</span>
              </>
            )}
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
                      <div>{item.category}</div>
                      <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full rounded-full ${
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
