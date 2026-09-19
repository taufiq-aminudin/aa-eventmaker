import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Calendar, User, CheckCircle2, Circle } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export const PlannerScreen: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useEvent();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Decoration');
  const [newDueDate, setNewDueDate] = useState('');
  const [newAssignee, setNewAssignee] = useState('');

  const categories = [
    'All',
    'Decoration',
    'Wardrobe',
    'Invitations',
    'Venue',
    'Reception',
    'Catering',
    'Documentation',
  ];

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const percentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks =
    filterCategory === 'All'
      ? tasks
      : tasks.filter((t) => t.category.toLowerCase() === filterCategory.toLowerCase());

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(
      newTitle,
      newCategory,
      newDueDate || 'Segera',
      newAssignee || 'Unassigned'
    );
    setShowAddModal(false);
    setNewTitle('');
    setNewDueDate('');
    setNewAssignee('');
  };

  return (
    <div id="planner-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-amber-500" />
            <h1 className="text-lg font-bold text-slate-900">Event Planner & Checklist Acara</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Lacak seluruh daftar agenda, timeline vendor, dan pembagian tugas kepanitiaan acara.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#6d28d9] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#5b21b6] transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tugas Baru</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Kemajuan Persiapan Acara
          </span>
          <span className="text-xs font-bold text-amber-600">
            {completedCount} dari {tasks.length} Selesai ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Categories Toolbar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300/60'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 text-slate-400 text-xs">
            Belum ada tugas dalam kategori ini.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                task.isCompleted
                  ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200/80 text-slate-900 shadow-xs hover:border-amber-300'
              }`}
            >
              <div
                onClick={() => toggleTask(task.id)}
                className="flex items-start space-x-3 cursor-pointer flex-1 min-w-0 pr-4"
              >
                <div className="mt-0.5 shrink-0">
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-amber-500 transition-colors" />
                  )}
                </div>

                <div className="min-w-0">
                  <div
                    className={`text-xs font-bold leading-snug ${
                      task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{task.dueDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>PIC: {task.assignee}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Tambah Tugas Planner</h3>
            <p className="text-xs text-slate-500 mb-4">
              Cantumkan tanggung jawab kepanitiaan dan batas waktu pelaksanaan.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Tugas / Agenda
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Technical meeting dengan vendor katering"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Decoration">Decoration</option>
                    <option value="Wardrobe">Wardrobe</option>
                    <option value="Invitations">Invitations</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Reception">Reception</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batas Waktu (Deadline)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 20 Okt 2026"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Penanggung Jawab (PIC)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Andi (Groom) / WO"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
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
                  className="px-4 py-2 text-xs font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] rounded-lg shadow-xs"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
