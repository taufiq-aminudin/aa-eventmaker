import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  User,
  CheckCircle2,
  Circle,
  GripVertical,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { TaskItem } from '../types';

interface SortableTaskItemProps {
  task: TaskItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({
  task,
  index,
  isFirst,
  isLast,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
        isDragging
          ? 'opacity-35 border-dashed border-amber-400 bg-amber-50/70 shadow-inner'
          : task.isCompleted
          ? 'bg-slate-50/80 border-slate-200 text-slate-400'
          : 'bg-white border-slate-200/80 text-slate-900 shadow-xs hover:border-amber-300 hover:shadow-sm'
      }`}
    >
      {/* Drag Handle & Priority Index */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Tarik untuk mengubah urutan tugas: ${task.title}`}
          title="Tahan dan tarik (drag) untuk memindahkan urutan prioritas"
          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 active:bg-amber-100 cursor-grab active:cursor-grabbing transition-colors touch-none"
        >
          <GripVertical className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[24px] text-center select-none ${
            task.isCompleted
              ? 'bg-slate-200/80 text-slate-500'
              : 'bg-amber-100 text-amber-800'
          }`}
          title={`Prioritas urutan #${index + 1}`}
        >
          #{index + 1}
        </span>
      </div>

      {/* Checkbox & Task Content */}
      <div
        onClick={onToggle}
        className="flex items-start space-x-3 cursor-pointer flex-1 min-w-0 pr-2 select-none"
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
            className={`text-xs sm:text-sm font-bold leading-snug break-words ${
              task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
            }`}
          >
            {task.title}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-500 mt-1">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{task.dueDate}</span>
            </span>
            <span className="flex items-center space-x-1">
              <User className="w-3 h-3 text-slate-400" />
              <span>PIC: {task.assignee}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[10px]">
              {task.category}
            </span>
          </div>
        </div>
      </div>

      {/* Up/Down Quick Reorder Buttons & Delete */}
      <div className="flex items-center space-x-0.5 shrink-0">
        <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 mr-1">
          <button
            type="button"
            disabled={isFirst}
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            title="Pindahkan prioritas ke atas"
            className="p-1 text-slate-400 hover:text-amber-600 disabled:opacity-20 disabled:pointer-events-none rounded hover:bg-white transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            title="Pindahkan prioritas ke bawah"
            className="p-1 text-slate-400 hover:text-amber-600 disabled:opacity-20 disabled:pointer-events-none rounded hover:bg-white transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Hapus tugas"
          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const TaskOverlayCard: React.FC<{ task: TaskItem }> = ({ task }) => {
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-amber-400 bg-white text-slate-900 shadow-2xl flex items-center justify-between gap-3 rotate-1 scale-[1.02] cursor-grabbing">
      <div className="flex items-center space-x-2 shrink-0">
        <div className="p-1.5 rounded-lg text-amber-600 bg-amber-50">
          <GripVertical className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
          Memindahkan...
        </span>
      </div>

      <div className="flex items-start space-x-3 flex-1 min-w-0 pr-2">
        <div className="mt-0.5 shrink-0">
          {task.isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300" />
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {task.title}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
            <span>{task.dueDate}</span>
            <span>•</span>
            <span>PIC: {task.assignee}</span>
          </div>
        </div>
      </div>

      <div className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold shrink-0">
        {task.category}
      </div>
    </div>
  );
};

export const PlannerScreen: React.FC = () => {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    moveTask,
    resetTasksToDefault,
  } = useEvent();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Decoration');
  const [newDueDate, setNewDueDate] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const activeTask = tasks.find((t) => t.id === activeId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4, // 4px distance required before drag starts, preventing accidental drags on click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    if (filterCategory === 'All') {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTasks(arrayMove(tasks, oldIndex, newIndex));
      }
    } else {
      // Reordering within filtered category view
      const oldFilteredIndex = filteredTasks.findIndex((t) => t.id === active.id);
      const newFilteredIndex = filteredTasks.findIndex((t) => t.id === over.id);
      if (oldFilteredIndex !== -1 && newFilteredIndex !== -1) {
        const movedTask = filteredTasks[oldFilteredIndex];
        const targetTask = filteredTasks[newFilteredIndex];
        const oldMasterIndex = tasks.findIndex((t) => t.id === movedTask.id);
        const newMasterIndex = tasks.findIndex((t) => t.id === targetTask.id);
        if (oldMasterIndex !== -1 && newMasterIndex !== -1) {
          reorderTasks(arrayMove(tasks, oldMasterIndex, newMasterIndex));
        }
      }
    }
  };

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
            Lacak seluruh daftar agenda, timeline vendor, dan urutkan prioritas tugas kepanitiaan acara dengan drag-and-drop.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={resetTasksToDefault}
            title="Kembalikan urutan dan daftar tugas ke pengaturan awal"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Urutan</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#6d28d9] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#5b21b6] transition-colors flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas Baru</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Reorder Helper Hint */}
      <div className="bg-gradient-to-r from-amber-50 via-amber-50/50 to-orange-50 border border-amber-200/70 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 shrink-0">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">Drag-and-Drop Reordering Aktif:</span>{' '}
            <span className="text-amber-800/90">
              Tahan dan geser ikon gagang <strong className="font-semibold text-amber-950">⋮⋮</strong> pada setiap tugas untuk menyusun ulang prioritas agenda, atau gunakan tombol panah (↑/↓) di sisi kanan.
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-1.5 text-[11px] font-semibold text-amber-700 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Tersimpan Otomatis</span>
        </div>
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
        {categories.map((cat) => {
          const count =
            cat === 'All'
              ? tasks.length
              : tasks.filter((t) => t.category.toLowerCase() === cat.toLowerCase()).length;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                filterCategory === cat
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300/60 shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterCategory === cat
                    ? 'bg-amber-200/80 text-amber-950 font-bold'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sortable Tasks List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 text-slate-400 text-xs">
                Belum ada tugas dalam kategori ini. Klik "Tambah Tugas Baru" untuk menambahkan agenda acara.
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === filteredTasks.length - 1}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onMoveUp={() => {
                    if (filterCategory === 'All') {
                      moveTask(task.id, 'up');
                    } else {
                      // Move up within filtered list
                      if (index > 0) {
                        const targetTask = filteredTasks[index - 1];
                        const oldIdx = tasks.findIndex((t) => t.id === task.id);
                        const newIdx = tasks.findIndex((t) => t.id === targetTask.id);
                        if (oldIdx !== -1 && newIdx !== -1) {
                          reorderTasks(arrayMove(tasks, oldIdx, newIdx));
                        }
                      }
                    }
                  }}
                  onMoveDown={() => {
                    if (filterCategory === 'All') {
                      moveTask(task.id, 'down');
                    } else {
                      // Move down within filtered list
                      if (index < filteredTasks.length - 1) {
                        const targetTask = filteredTasks[index + 1];
                        const oldIdx = tasks.findIndex((t) => t.id === task.id);
                        const newIdx = tasks.findIndex((t) => t.id === targetTask.id);
                        if (oldIdx !== -1 && newIdx !== -1) {
                          reorderTasks(arrayMove(tasks, oldIdx, newIdx));
                        }
                      }
                    }
                  }}
                />
              ))
            )}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeTask ? <TaskOverlayCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-page-fade">
            <h3 className="text-base font-bold text-slate-900 mb-1">Tambah Tugas Planner</h3>
            <p className="text-xs text-slate-500 mb-4">
              Cantumkan tanggung jawab kepanitiaan dan batas waktu pelaksanaan agenda acara.
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
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
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
