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
  Building2,
  UtensilsCrossed,
  Camera,
  Palette,
  Shirt,
  Mail,
  Users,
  Music,
  Truck,
  Layers,
  LayoutGrid,
  ListOrdered,
  Edit2,
  Tag,
  Check,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { TaskItem } from '../types';

export interface CategoryMeta {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagBg: string;
  tagText: string;
  tagBorder: string;
  dotBg: string;
  badgeBg: string;
  bannerBg: string;
  accentColor: string;
  description: string;
}

export const CATEGORY_CONFIGS: Record<string, CategoryMeta> = {
  Venue: {
    key: 'Venue',
    label: 'Venue',
    icon: Building2,
    tagBg: 'bg-emerald-50',
    tagText: 'text-emerald-800',
    tagBorder: 'border-emerald-200/90',
    dotBg: 'bg-emerald-500',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    bannerBg: 'from-emerald-500/10 to-teal-500/5 border-emerald-200/70',
    accentColor: '#10b981',
    description: 'Lokasi gedung, ballroom, perizinan, dan tata letak ruangan',
  },
  Catering: {
    key: 'Catering',
    label: 'Catering',
    icon: UtensilsCrossed,
    tagBg: 'bg-amber-50',
    tagText: 'text-amber-800',
    tagBorder: 'border-amber-200/90',
    dotBg: 'bg-amber-500',
    badgeBg: 'bg-amber-100 text-amber-800',
    bannerBg: 'from-amber-500/10 to-orange-500/5 border-amber-200/70',
    accentColor: '#f59e0b',
    description: 'Menu buffet prasmanan, gubukan, food tasting, dan porsi tamu',
  },
  Photography: {
    key: 'Photography',
    label: 'Photography',
    icon: Camera,
    tagBg: 'bg-indigo-50',
    tagText: 'text-indigo-800',
    tagBorder: 'border-indigo-200/90',
    dotBg: 'bg-indigo-500',
    badgeBg: 'bg-indigo-100 text-indigo-800',
    bannerBg: 'from-indigo-500/10 to-blue-500/5 border-indigo-200/70',
    accentColor: '#6366f1',
    description: 'Foto sinematik, videografi akad/resepsi, drone, dan live stream',
  },
  Decoration: {
    key: 'Decoration',
    label: 'Decoration',
    icon: Palette,
    tagBg: 'bg-rose-50',
    tagText: 'text-rose-800',
    tagBorder: 'border-rose-200/90',
    dotBg: 'bg-rose-500',
    badgeBg: 'bg-rose-100 text-rose-800',
    bannerBg: 'from-rose-500/10 to-pink-500/5 border-rose-200/70',
    accentColor: '#f43f5e',
    description: 'Pelaminan, backdrop, floral arch, karpet jalan, dan lighting',
  },
  Wardrobe: {
    key: 'Wardrobe',
    label: 'Wardrobe',
    icon: Shirt,
    tagBg: 'bg-purple-50',
    tagText: 'text-purple-800',
    tagBorder: 'border-purple-200/90',
    dotBg: 'bg-purple-500',
    badgeBg: 'bg-purple-100 text-purple-800',
    bannerBg: 'from-purple-500/10 to-violet-500/5 border-purple-200/70',
    accentColor: '#a855f7',
    description: 'Kebaya akad, jas resepsi, MUA pengantin, keluarga & pagar ayu',
  },
  Invitations: {
    key: 'Invitations',
    label: 'Invitations',
    icon: Mail,
    tagBg: 'bg-sky-50',
    tagText: 'text-sky-800',
    tagBorder: 'border-sky-200/90',
    dotBg: 'bg-sky-500',
    badgeBg: 'bg-sky-100 text-sky-800',
    bannerBg: 'from-sky-500/10 to-cyan-500/5 border-sky-200/70',
    accentColor: '#0ea5e9',
    description: 'Undangan digital web, e-pass QR, blast WhatsApp, dan RSVP',
  },
  Reception: {
    key: 'Reception',
    label: 'Reception',
    icon: Users,
    tagBg: 'bg-teal-50',
    tagText: 'text-teal-800',
    tagBorder: 'border-teal-200/90',
    dotBg: 'bg-teal-500',
    badgeBg: 'bg-teal-100 text-teal-800',
    bannerBg: 'from-teal-500/10 to-emerald-500/5 border-teal-200/70',
    accentColor: '#14b8a6',
    description: 'Buku tamu, scanner barcode QR check-in, meja VIP, dan souvenir',
  },
  Entertainment: {
    key: 'Entertainment',
    label: 'Entertainment',
    icon: Music,
    tagBg: 'bg-fuchsia-50',
    tagText: 'text-fuchsia-800',
    tagBorder: 'border-fuchsia-200/90',
    dotBg: 'bg-fuchsia-500',
    badgeBg: 'bg-fuchsia-100 text-fuchsia-800',
    bannerBg: 'from-fuchsia-500/10 to-pink-500/5 border-fuchsia-200/70',
    accentColor: '#d946ef',
    description: 'Band akustik/musik tradisional, MC master of ceremonies, sound system',
  },
  Logistics: {
    key: 'Logistics',
    label: 'Logistics',
    icon: Truck,
    tagBg: 'bg-slate-100',
    tagText: 'text-slate-800',
    tagBorder: 'border-slate-300/80',
    dotBg: 'bg-slate-500',
    badgeBg: 'bg-slate-200 text-slate-800',
    bannerBg: 'from-slate-500/10 to-zinc-500/5 border-slate-200/80',
    accentColor: '#64748b',
    description: 'Transportasi keluarga, keamanan parkir, genset, dan kebersihan',
  },
};

export const DEFAULT_CATEGORY_META: CategoryMeta = {
  key: 'General',
  label: 'General',
  icon: Layers,
  tagBg: 'bg-slate-100',
  tagText: 'text-slate-700',
  tagBorder: 'border-slate-200',
  dotBg: 'bg-slate-400',
  badgeBg: 'bg-slate-100 text-slate-700',
  bannerBg: 'from-slate-500/10 to-slate-500/5 border-slate-200',
  accentColor: '#6b7280',
  description: 'Agenda kepanitiaan dan koordinasi umum acara',
};

export const getCategoryMeta = (categoryName: string): CategoryMeta => {
  const normalized = Object.keys(CATEGORY_CONFIGS).find(
    (k) => k.toLowerCase() === (categoryName || '').toLowerCase()
  );
  if (normalized) return CATEGORY_CONFIGS[normalized];
  if (categoryName?.toLowerCase() === 'documentation') return CATEGORY_CONFIGS['Photography'];
  return {
    ...DEFAULT_CATEGORY_META,
    label: categoryName || 'General',
    key: categoryName || 'General',
  };
};

export const ALL_CATEGORY_KEYS = [
  'Venue',
  'Catering',
  'Photography',
  'Decoration',
  'Wardrobe',
  'Invitations',
  'Reception',
  'Entertainment',
  'Logistics',
];

// Visual Category Badge Component
interface CategoryVisualTagProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CategoryVisualTag: React.FC<CategoryVisualTagProps> = ({
  category,
  size = 'sm',
  showDot = true,
  interactive = false,
  onClick,
  className = '',
}) => {
  const meta = getCategoryMeta(category);
  const IconComponent = meta.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <span
      onClick={interactive ? onClick : undefined}
      title={`Kategori: ${meta.label} — ${meta.description}`}
      className={`inline-flex items-center rounded-lg border transition-all select-none ${
        meta.tagBg
      } ${meta.tagText} ${meta.tagBorder} ${sizeClasses} ${
        interactive ? 'cursor-pointer hover:shadow-2xs hover:brightness-95 active:scale-95' : ''
      } ${className}`}
    >
      {showDot && (
        <span className={`${dotSizes} rounded-full ${meta.dotBg} shrink-0 ring-1 ring-white/60`} />
      )}
      <IconComponent className={`${iconSizes} shrink-0 opacity-85`} />
      <span>{meta.label}</span>
    </span>
  );
};

interface SortableTaskItemProps {
  task: TaskItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onSelectCategory: (newCategory: string) => void;
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
  onEdit,
  onSelectCategory,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const meta = getCategoryMeta(task.category);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
        isDragging
          ? 'opacity-35 border-dashed border-amber-400 bg-amber-50/70 shadow-inner'
          : task.isCompleted
          ? 'bg-slate-50/80 border-slate-200 text-slate-400'
          : 'bg-white border-slate-200/80 text-slate-900 shadow-xs hover:border-amber-300 hover:shadow-sm'
      }`}
    >
      {/* Left priority index & Drag Handle */}
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

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-[11px] text-slate-500 mt-1.5">
            {/* Visual Category Tag with click-to-change menu */}
            <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
              <CategoryVisualTag
                category={task.category}
                size="sm"
                interactive
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              />

              {showCategoryMenu && (
                <div className="absolute left-0 top-full mt-1 z-30 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 animate-page-fade">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                    <span>Ubah Kategori</span>
                    <Tag className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {ALL_CATEGORY_KEYS.map((catKey) => {
                      const cMeta = CATEGORY_CONFIGS[catKey];
                      const CIcon = cMeta.icon;
                      const isSelected = task.category.toLowerCase() === catKey.toLowerCase();
                      return (
                        <button
                          key={catKey}
                          type="button"
                          onClick={() => {
                            onSelectCategory(catKey);
                            setShowCategoryMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isSelected
                              ? `${cMeta.tagBg} ${cMeta.tagText} font-bold`
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${cMeta.dotBg}`} />
                            <CIcon className="w-3.5 h-3.5" />
                            <span>{cMeta.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <span className="flex items-center space-x-1 text-slate-500">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{task.dueDate}</span>
            </span>

            <span className="flex items-center space-x-1 text-slate-500">
              <User className="w-3 h-3 text-slate-400" />
              <span>PIC: {task.assignee}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Up/Down Quick Reorder Buttons, Edit, & Delete */}
      <div className="flex items-center space-x-0.5 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title="Edit detail tugas"
          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors mr-0.5"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

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
          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
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

      <div className="shrink-0">
        <CategoryVisualTag category={task.category} size="sm" />
      </div>
    </div>
  );
};

export const PlannerScreen: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    moveTask,
    resetTasksToDefault,
  } = useEvent();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Venue');
  const [newDueDate, setNewDueDate] = useState('');
  const [newAssignee, setNewAssignee] = useState('');

  // Edit task form state
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Venue');
  const [editDueDate, setEditDueDate] = useState('');
  const [editAssignee, setEditAssignee] = useState('');

  const [activeId, setActiveId] = useState<string | null>(null);

  const categories = ['All', ...ALL_CATEGORY_KEYS];

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
        distance: 4, // 4px distance required before drag starts, avoiding conflicts with clicks
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
      newTitle.trim(),
      newCategory,
      newDueDate.trim() || 'Segera',
      newAssignee.trim() || 'Unassigned'
    );
    setShowAddModal(false);
    setNewTitle('');
    setNewDueDate('');
    setNewAssignee('');
    setNewCategory('Venue');
  };

  const handleOpenEdit = (task: TaskItem) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditDueDate(task.dueDate);
    setEditAssignee(task.assignee);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;
    updateTask(editingTask.id, {
      title: editTitle.trim(),
      category: editCategory,
      dueDate: editDueDate.trim() || 'Segera',
      assignee: editAssignee.trim() || 'Unassigned',
    });
    setEditingTask(null);
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
            Lacak seluruh agenda dengan visual tags kategori (Venue, Catering, Photography, dll), serta drag-and-drop prioritas tugas.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="Tampilan daftar urutan terpadu"
              className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Daftar Terpadu</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grouped')}
              title="Kelompokkan tugas per kategori (Venue, Catering, Photography, dll)"
              className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                viewMode === 'grouped'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Per Kategori</span>
            </button>
          </div>

          <button
            type="button"
            onClick={resetTasksToDefault}
            title="Kembalikan urutan dan daftar tugas ke pengaturan awal"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#6d28d9] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#5b21b6] transition-colors flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas</span>
          </button>
        </div>
      </div>

      {/* Visual Category Showcase Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {[
          { key: 'Venue', title: 'Venue' },
          { key: 'Catering', title: 'Catering' },
          { key: 'Photography', title: 'Photography' },
          { key: 'Decoration', title: 'Decoration' },
          { key: 'Wardrobe', title: 'Wardrobe' },
          { key: 'Invitations', title: 'Invitations' },
        ].map(({ key, title }) => {
          const meta = CATEGORY_CONFIGS[key];
          const Icon = meta.icon;
          const categoryTasks = tasks.filter(
            (t) => t.category.toLowerCase() === key.toLowerCase()
          );
          const catDone = categoryTasks.filter((t) => t.isCompleted).length;
          const isCurrentFilter = filterCategory.toLowerCase() === key.toLowerCase();

          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilterCategory(isCurrentFilter ? 'All' : key)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isCurrentFilter
                  ? `${meta.tagBg} ${meta.tagBorder} ring-2 ring-offset-1 ring-amber-400/80 shadow-xs`
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${meta.tagBg} ${meta.tagText} border ${meta.tagBorder}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  {catDone}/{categoryTasks.length}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 truncate">{title}</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${meta.dotBg}`}
                  style={{
                    width: `${
                      categoryTasks.length > 0 ? (catDone / categoryTasks.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress & Drag Hint Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Kemajuan Persiapan Acara</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 font-extrabold">{percentage}% Selesai</span>
            </span>
            <span className="text-xs font-bold text-slate-700">
              {completedCount} dari {tasks.length} Agenda Terselesaikan
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 via-amber-50/50 to-orange-50 border border-amber-200/70 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 shrink-0">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-amber-950">Drag-and-Drop Prioritas:</span>
              <span className="text-[11px] text-amber-800/90 leading-tight block">
                Tahan ikon <strong className="font-semibold text-amber-950">⋮⋮</strong> untuk menyusun ulang, atau klik visual tag untuk mengganti kategori tugas secara instan.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar with Category Visual Tags */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center space-x-1">
          <Tag className="w-3.5 h-3.5" />
          <span>Kategori:</span>
        </span>

        {categories.map((cat) => {
          const isAll = cat === 'All';
          const isSelected = filterCategory.toLowerCase() === cat.toLowerCase();
          const count = isAll
            ? tasks.length
            : tasks.filter((t) => t.category.toLowerCase() === cat.toLowerCase()).length;

          if (isAll) {
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Semua Agenda</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          }

          const meta = getCategoryMeta(cat);
          const Icon = meta.icon;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                isSelected
                  ? `${meta.tagBg} ${meta.tagText} ${meta.tagBorder} ring-2 ring-amber-400/70 font-bold shadow-2xs`
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${meta.dotBg}`} />
              <Icon className="w-3.5 h-3.5" />
              <span>{meta.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? meta.badgeBg : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Checklist Body */}
      {viewMode === 'grouped' && filterCategory === 'All' ? (
        /* Grouped by Category View */
        <div className="space-y-6">
          {ALL_CATEGORY_KEYS.map((catKey) => {
            const meta = CATEGORY_CONFIGS[catKey];
            const Icon = meta.icon;
            const categoryTasks = tasks.filter(
              (t) => t.category.toLowerCase() === catKey.toLowerCase()
            );

            if (categoryTasks.length === 0) return null;

            const catCompleted = categoryTasks.filter((t) => t.isCompleted).length;

            return (
              <div
                key={catKey}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3"
              >
                {/* Category Group Header with Visual Tag Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.tagBg} ${meta.tagText} border ${meta.tagBorder} shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">
                          Kategori: {meta.label}
                        </h2>
                        <CategoryVisualTag category={catKey} size="sm" showDot />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{meta.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {catCompleted} / {categoryTasks.length} Selesai
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCategory(catKey);
                        setShowAddModal(true);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah di {meta.label}</span>
                    </button>
                  </div>
                </div>

                {/* Category Tasks List */}
                <div className="space-y-2">
                  {categoryTasks.map((task, idx) => (
                    <div
                      key={task.id}
                      className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                        task.isCompleted
                          ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
                      }`}
                    >
                      <div
                        onClick={() => toggleTask(task.id)}
                        className="flex items-start space-x-3 cursor-pointer flex-1 min-w-0"
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
                            className={`text-xs sm:text-sm font-bold leading-snug ${
                              task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{task.dueDate}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>PIC: {task.assignee}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(task)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="Edit tugas"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Hapus tugas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Unified Sortable Drag & Drop List View */
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
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-600 mb-1">
                    Belum ada tugas dalam kategori ini.
                  </p>
                  <p className="text-slate-400">
                    Klik tombol "Tambah Tugas" untuk menambahkan agenda acara dengan visual tag kategori.
                  </p>
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
                    onEdit={() => handleOpenEdit(task)}
                    onSelectCategory={(newCat) => updateTask(task.id, { category: newCat })}
                    onMoveUp={() => {
                      if (filterCategory === 'All') {
                        moveTask(task.id, 'up');
                      } else {
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

          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
          >
            {activeTask ? <TaskOverlayCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* ADD TASK MODAL WITH VISUAL CATEGORY PICKER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-page-fade max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Tambah Tugas Planner</h3>
                <p className="text-xs text-slate-500">
                  Pilih visual tag kategori dan tentukan penanggung jawab agenda.
                </p>
              </div>
              <CategoryVisualTag category={newCategory} size="sm" showDot />
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Agenda / Tugas Acara
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Technical meeting dengan vendor katering & venue"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                />
              </div>

              {/* Visual Category Picker Tiles */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Pilih Kategori Tugas (Visual Tag)</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Klik salah satu kategori
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_CATEGORY_KEYS.map((catKey) => {
                    const meta = CATEGORY_CONFIGS[catKey];
                    const Icon = meta.icon;
                    const isSelected = newCategory === catKey;
                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setNewCategory(catKey)}
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                          isSelected
                            ? `${meta.tagBg} ${meta.tagBorder} ${meta.tagText} ring-2 ring-offset-1 ring-amber-400 font-bold shadow-2xs`
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${meta.dotBg}`} />
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs truncate">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batas Waktu (Deadline)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 20 Okt 2026"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Andi / Vendor Catering"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] rounded-xl shadow-xs transition-colors"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-page-fade max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Tugas Planner</h3>
                <p className="text-xs text-slate-500">Ubah kategori, nama tugas, atau PIC.</p>
              </div>
              <CategoryVisualTag category={editCategory} size="sm" showDot />
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Agenda / Tugas Acara
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                />
              </div>

              {/* Visual Category Picker Tiles */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Kategori Tugas (Visual Tag)</span>
                  <span className="text-[11px] font-normal text-slate-400">Pilih kategori</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_CATEGORY_KEYS.map((catKey) => {
                    const meta = CATEGORY_CONFIGS[catKey];
                    const Icon = meta.icon;
                    const isSelected = editCategory === catKey;
                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setEditCategory(catKey)}
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                          isSelected
                            ? `${meta.tagBg} ${meta.tagBorder} ${meta.tagText} ring-2 ring-offset-1 ring-amber-400 font-bold shadow-2xs`
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${meta.dotBg}`} />
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs truncate">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batas Waktu (Deadline)
                  </label>
                  <input
                    type="text"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    value={editAssignee}
                    onChange={(e) => setEditAssignee(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] rounded-xl shadow-xs transition-colors"
                >
                  Perbarui Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
