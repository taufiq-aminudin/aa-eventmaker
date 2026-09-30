import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  Plus,
  RefreshCw,
  X,
  Building2,
  Heart,
  Briefcase,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Filter,
  Layers,
  Bot,
  Info,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { TaskItem, AiTaskRecommendation } from '../types';
import { CategoryVisualTag, ALL_CATEGORY_KEYS } from '../screens/PlannerScreen';

interface AiTaskRecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksAdded?: (count: number) => void;
}

export const AiTaskRecommendationsModal: React.FC<AiTaskRecommendationsModalProps> = ({
  isOpen,
  onClose,
  onTasksAdded,
}) => {
  const { currentProject, tasks, addTask, updateTask } = useEvent();

  // Detect initial event type from current project
  const initialType =
    currentProject?.type?.toLowerCase().includes('corporate') ||
    currentProject?.type?.toLowerCase().includes('seminar') ||
    currentProject?.type?.toLowerCase().includes('conference')
      ? 'Corporate'
      : 'Wedding';

  const [selectedEventType, setSelectedEventType] = useState<'Wedding' | 'Corporate'>(initialType);
  const [eventDate, setEventDate] = useState<string>(currentProject?.date || '24 Oktober 2026');
  const [focusArea, setFocusArea] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<AiTaskRecommendation[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modelSource, setModelSource] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Fetch recommendations from API
  const fetchRecommendations = async (
    type: 'Wedding' | 'Corporate' = selectedEventType,
    date: string = eventDate,
    area: string = focusArea
  ) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/recommend-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: type,
          eventDate: date,
          existingTasks: tasks.map((t) => t.title),
          focusArea: area,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
        setModelSource(data.modelUsed || data.source || 'gemini-3.8-flash');
        // Pre-select all recommended tasks that aren't already duplicates
        const existingTitles = new Set(tasks.map((t) => t.title.toLowerCase().trim()));
        const newSelected = new Set<string>();
        data.recommendations.forEach((item: AiTaskRecommendation) => {
          if (!existingTitles.has(item.title.toLowerCase().trim())) {
            newSelected.add(item.id);
          }
        });
        setSelectedIds(newSelected);
      } else {
        throw new Error(data.message || 'Gagal memuat rekomendasi tugas.');
      }
    } catch (err: any) {
      console.warn('AI recommendation error, using local fallback:', err);
      setErrorMsg(err.message || 'Gagal memuat data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecommendations();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    const existingTitles = new Set(tasks.map((t) => t.title.toLowerCase().trim()));
    const all = new Set<string>();
    recommendations.forEach((r) => {
      if (!existingTitles.has(r.title.toLowerCase().trim())) {
        all.add(r.id);
      }
    });
    setSelectedIds(all);
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleApplyTasks = () => {
    const selectedList = recommendations.filter((r) => selectedIds.has(r.id));
    if (selectedList.length === 0) return;

    let addedCount = 0;
    const addedTaskMap = new Map<string, string>(); // title -> newTaskId

    selectedList.forEach((rec) => {
      const newTaskId = `task-ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      addTask(rec.title, rec.category, rec.dueDate || 'Segera', rec.assignee || 'Unassigned');
      addedTaskMap.set(rec.title.toLowerCase().trim(), newTaskId);
      addedCount++;
    });

    // Check if any added tasks have suggested prerequisites in the existing or newly added tasks
    selectedList.forEach((rec) => {
      if (rec.suggestedPrerequisite) {
        const prereqTitle = rec.suggestedPrerequisite.toLowerCase().trim();
        const matchingExisting = tasks.find(
          (t) => t.title.toLowerCase().trim().includes(prereqTitle) || prereqTitle.includes(t.title.toLowerCase().trim())
        );
        if (matchingExisting) {
          // If we found a matching task, we could link dependency if desired
        }
      }
    });

    if (onTasksAdded) {
      onTasksAdded(addedCount);
    }
    onClose();
  };

  const existingTitles = new Set(tasks.map((t) => t.title.toLowerCase().trim()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-page-fade">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border-b border-slate-200/80 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    AI Task Recommender
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200/60 flex items-center space-x-1">
                    <Bot className="w-3 h-3" />
                    <span>Gemini 3.8</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekomendasi checklist agenda otomatis berbasis tipe acara (Wedding vs Corporate) dan tanggal pelaksanaan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Event Type & Date Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200/60">
            {/* Event Type Toggle (Wedding vs Corporate) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Tipe Acara (Event Type)
              </label>
              <div className="grid grid-cols-2 gap-2 bg-white/80 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEventType('Wedding');
                    fetchRecommendations('Wedding', eventDate, focusArea);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                    selectedEventType === 'Wedding'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Pernikahan (Wedding)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedEventType('Corporate');
                    fetchRecommendations('Corporate', eventDate, focusArea);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                    selectedEventType === 'Corporate'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Perusahaan (Corporate)</span>
                </button>
              </div>
            </div>

            {/* Target Event Date */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Tanggal Acara (Target Event Date)
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="Contoh: 24 Oktober 2026"
                    className="w-full text-xs font-semibold px-3 py-2 pl-8 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="button"
                  onClick={() => fetchRecommendations(selectedEventType, eventDate, focusArea)}
                  disabled={isLoading}
                  title="Generate ulang rekomendasi"
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-3">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1 flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>Filter:</span>
            </span>
            {['All', ...ALL_CATEGORY_KEYS].map((cat) => {
              const isActive = focusArea.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFocusArea(cat);
                    fetchRecommendations(selectedEventType, eventDate, cat);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  {cat === 'All' ? 'Semua Kategori' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700">
                {recommendations.length} Rekomendasi Ditemukan
              </span>
              <span>•</span>
              <span className="text-indigo-600 font-semibold">{selectedIds.size} dipilih</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
              >
                Pilih Semua
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-700"
              >
                Batalkan Pilihan
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                AI sedang menganalisis kebutuhan agenda {selectedEventType}...
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Menyesuaikan timeline persiapan untuk tanggal {eventDate} dan menyusun tugas prioritas.
              </p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                Semua tugas rekomendasi standar sudah ada di checklist Anda!
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Ganti kategori filter atau ubah tipe acara untuk melihat ide persiapan lainnya.
              </p>
            </div>
          ) : (
            recommendations.map((rec) => {
              const isSelected = selectedIds.has(rec.id);
              const isAlreadyInChecklist = existingTitles.has(rec.title.toLowerCase().trim());

              return (
                <div
                  key={rec.id}
                  onClick={() => !isAlreadyInChecklist && toggleSelect(rec.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all text-left flex items-start gap-3.5 ${
                    isAlreadyInChecklist
                      ? 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-white border-indigo-400 shadow-sm ring-2 ring-indigo-500/20 cursor-pointer'
                      : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        isAlreadyInChecklist
                          ? 'bg-slate-300 border-slate-300 text-white'
                          : isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected || isAlreadyInChecklist ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : null}
                    </div>
                  </div>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <CategoryVisualTag category={rec.category} size="sm" showDot />

                      {rec.timelinePhase && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {rec.timelinePhase}
                        </span>
                      )}

                      {rec.priority === 'high' && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                          Prioritas Tinggi
                        </span>
                      )}

                      {isAlreadyInChecklist && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Sudah di Checklist
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {rec.title}
                    </h4>

                    {/* AI Explanation / Reason */}
                    {rec.reason && (
                      <p className="text-[11px] text-slate-600 mt-1.5 bg-amber-50/60 p-2 rounded-xl border border-amber-200/50 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{rec.reason}</span>
                      </p>
                    )}

                    {/* Prerequisite suggestion */}
                    {rec.suggestedPrerequisite && (
                      <div className="mt-1.5 text-[10px] text-slate-500 flex items-center space-x-1">
                        <span className="font-semibold text-slate-600">Disarankan setelah:</span>
                        <span className="text-indigo-600 font-medium truncate">
                          "{rec.suggestedPrerequisite}"
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Deadline: {rec.dueDate}</span>
                      </span>

                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>PIC: {rec.assignee}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span className="font-semibold text-slate-800">
              {selectedIds.size} dari {recommendations.length} tugas terpilih
            </span>
            <span className="hidden sm:inline"> • Otomatis ditambahkan ke checklist acara Anda</span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={selectedIds.size === 0}
              onClick={handleApplyTasks}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-[#6d28d9] to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-[#5b21b6] hover:to-indigo-700 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambahkan ke Checklist (+{selectedIds.size})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
