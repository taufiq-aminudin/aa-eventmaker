import React, { useState } from 'react';
import {
  FolderPlus,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Sparkles,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  Crown,
  Heart,
  Cake,
  Baby,
  Moon,
  Landmark,
  Shield,
  GraduationCap,
  Briefcase,
  Users,
  Home,
  Flag,
  Flower2,
  Layers,
  ChevronDown,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { EventCategoryDefinition, EventTypeDefinition, SubscriptionTier } from '../../types';
import { CULTURAL_STYLES } from '../../data/eventCatalog';

export const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  switch (name.toLowerCase()) {
    case 'heart':
      return <Heart className={className} />;
    case 'cake':
      return <Cake className={className} />;
    case 'baby':
      return <Baby className={className} />;
    case 'moon':
      return <Moon className={className} />;
    case 'landmark':
      return <Landmark className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'graduationcap':
      return <GraduationCap className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'users':
      return <Users className={className} />;
    case 'home':
      return <Home className={className} />;
    case 'flag':
      return <Flag className={className} />;
    case 'flower2':
      return <Flower2 className={className} />;
    default:
      return <Layers className={className} />;
  }
};

export const EventCategoryAdmin: React.FC = () => {
  const {
    eventCategories,
    addEventCategory,
    updateEventCategory,
    deleteEventCategory,
    addEventType,
    updateEventType,
    deleteEventType,
    toggleEventTypeActive,
    assignTemplatesToEventType,
    resetEventCatalogToDefault,
    templates,
    showToast,
  } = useEvent();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(eventCategories[0]?.id || null);

  // Category modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EventCategoryDefinition | null>(null);
  const [catName, setCatName] = useState('');
  const [catIndonesianName, setCatIndonesianName] = useState('');
  const [catIcon, setCatIcon] = useState('Heart');
  const [catDescription, setCatDescription] = useState('');
  const [catDisplayOrder, setCatDisplayOrder] = useState(1);

  // Event Type modal states
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [targetCategoryId, setTargetCategoryId] = useState<string>('');
  const [editingType, setEditingType] = useState<EventTypeDefinition | null>(null);
  const [typeName, setTypeName] = useState('');
  const [typeDescription, setTypeDescription] = useState('');
  const [typeSubtypes, setTypeSubtypes] = useState('');
  const [typeCulturalTags, setTypeCulturalTags] = useState<string[]>([]);
  const [typeThemeTags, setTypeThemeTags] = useState('');
  const [typeAnimation, setTypeAnimation] = useState('');
  const [typeMusicStyle, setTypeMusicStyle] = useState('');
  const [typeRequiredTier, setTypeRequiredTier] = useState<SubscriptionTier>('starter');
  const [typeRecommendedTemplates, setTypeRecommendedTemplates] = useState<string[]>([]);
  const [typeTitleTemplate, setTypeTitleTemplate] = useState('The Event of {hosts}');
  const [typeHostsLabel, setTypeHostsLabel] = useState('Nama Tuan Rumah / Mempelai');
  const [typeDefaultOpening, setTypeDefaultOpening] = useState('');
  const [typeDefaultQuote, setTypeDefaultQuote] = useState('');

  // Reordering helpers
  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= eventCategories.length) return;

    const list = [...eventCategories];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Update display orders
    list.forEach((c, idx) => {
      updateEventCategory({ ...c, displayOrder: idx + 1 });
    });
    showToast('Urutan kategori berhasil diperbarui.');
  };

  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatIndonesianName('');
    setCatIcon('Heart');
    setCatDescription('');
    setCatDisplayOrder(eventCategories.length + 1);
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: EventCategoryDefinition) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatIndonesianName(cat.indonesianName);
    setCatIcon(cat.icon);
    setCatDescription(cat.description);
    setCatDisplayOrder(cat.displayOrder);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catIndonesianName.trim()) {
      showToast('Nama kategori dan nama Indonesia wajib diisi.');
      return;
    }

    if (editingCategory) {
      updateEventCategory({
        ...editingCategory,
        name: catName.trim(),
        indonesianName: catIndonesianName.trim(),
        icon: catIcon,
        description: catDescription.trim(),
        displayOrder: Number(catDisplayOrder) || 1,
      });
    } else {
      addEventCategory({
        name: catName.trim(),
        indonesianName: catIndonesianName.trim(),
        icon: catIcon,
        description: catDescription.trim(),
        displayOrder: Number(catDisplayOrder) || 1,
        isActive: true,
        eventTypes: [],
      });
    }

    setShowCategoryModal(false);
  };

  const handleOpenNewType = (catId: string) => {
    setTargetCategoryId(catId);
    setEditingType(null);
    setTypeName('');
    setTypeDescription('');
    setTypeSubtypes('');
    setTypeCulturalTags(['Modern', 'Contemporary Indonesian']);
    setTypeThemeTags('');
    setTypeAnimation('Luxury Shimmer & Golden Sparks');
    setTypeMusicStyle('Acoustic Warm Harmony');
    setTypeRequiredTier('starter');
    setTypeRecommendedTemplates([]);
    setTypeTitleTemplate('The Event of {hosts}');
    setTypeHostsLabel('Nama Penyelenggara');
    setTypeDefaultOpening('Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i.');
    setTypeDefaultQuote('');
    setShowTypeModal(true);
  };

  const handleOpenEditType = (catId: string, item: EventTypeDefinition) => {
    setTargetCategoryId(catId);
    setEditingType(item);
    setTypeName(item.name);
    setTypeDescription(item.description);
    setTypeSubtypes((item.subtypes || []).join(', '));
    setTypeCulturalTags(item.culturalTags || []);
    setTypeThemeTags((item.themeTags || []).join(', '));
    setTypeAnimation(item.defaultAnimation || '');
    setTypeMusicStyle(item.defaultMusicStyle || '');
    setTypeRequiredTier(item.requiredTier || 'starter');
    setTypeRecommendedTemplates(item.recommendedTemplates || []);
    setTypeTitleTemplate(item.defaultContent.titleTemplate || 'The Event of {hosts}');
    setTypeHostsLabel(item.defaultContent.hostsLabel || 'Nama Tuan Rumah');
    setTypeDefaultOpening(item.defaultContent.defaultOpening || '');
    setTypeDefaultQuote(item.defaultContent.defaultQuote || '');
    setShowTypeModal(true);
  };

  const handleSaveType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) {
      showToast('Nama tipe acara wajib diisi.');
      return;
    }

    const subtypesArr = typeSubtypes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const themeTagsArr = typeThemeTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingType) {
      updateEventType({
        ...editingType,
        name: typeName.trim(),
        description: typeDescription.trim(),
        subtypes: subtypesArr,
        culturalTags: typeCulturalTags,
        themeTags: themeTagsArr,
        defaultAnimation: typeAnimation,
        defaultMusicStyle: typeMusicStyle,
        requiredTier: typeRequiredTier,
        isPremium: typeRequiredTier !== 'starter',
        recommendedTemplates: typeRecommendedTemplates,
        defaultContent: {
          ...editingType.defaultContent,
          titleTemplate: typeTitleTemplate,
          hostsLabel: typeHostsLabel,
          defaultOpening: typeDefaultOpening,
          defaultQuote: typeDefaultQuote,
        },
      });
    } else {
      addEventType(targetCategoryId, {
        categoryId: targetCategoryId,
        name: typeName.trim(),
        description: typeDescription.trim(),
        subtypes: subtypesArr,
        culturalTags: typeCulturalTags,
        themeTags: themeTagsArr,
        defaultAnimation: typeAnimation,
        defaultMusicStyle: typeMusicStyle,
        requiredTier: typeRequiredTier,
        isPremium: typeRequiredTier !== 'starter',
        recommendedTemplates: typeRecommendedTemplates,
        displayOrder: 99,
        isActive: true,
        defaultContent: {
          titleTemplate: typeTitleTemplate,
          hostsLabel: typeHostsLabel,
          defaultOpening: typeDefaultOpening,
          defaultQuote: typeDefaultQuote,
          recommendedSections: {
            showCountdown: true,
            showAgenda: true,
            showRsvp: true,
            showWishes: true,
            showDigitalGift: true,
            showMaps: true,
            showGallery: true,
            showVideo: false,
          },
        },
      });
    }

    setShowTypeModal(false);
  };

  const filteredCategories = eventCategories.filter((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchCat = cat.name.toLowerCase().includes(q) || cat.indonesianName.toLowerCase().includes(q);
    const matchType = cat.eventTypes.some(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.culturalTags && t.culturalTags.some((tag) => tag.toLowerCase().includes(q))) ||
        (t.subtypes && t.subtypes.some((s) => s.toLowerCase().includes(q)))
    );
    return matchCat || matchType;
  });

  return (
    <div id="event-category-admin-panel" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Admin Catalog Manager</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Katalog Kategori & Tipe Acara Indonesia</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Kelola ragam kategori (A-L), tipe acara nusantara, paket langganan terkait, preferensi animasi, serta kurasi templat rekomendasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleOpenNewCategory}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Tambah Kategori</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Kembalikan semua kategori dan tipe acara ke pengaturan awal default sistem?')) {
                resetEventCatalogToDefault();
              }
            }}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Reset Catalog to Default"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari kategori, tipe acara (Aqiqah, Wisuda, Lamaran, Siraman, Khitanan...), atau adat..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.map((category, index) => {
          const isExpanded = expandedCategoryId === category.id;
          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
            >
              {/* Category Header Row */}
              <div
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/75 transition-colors ${
                  isExpanded ? 'bg-slate-50/50 border-b border-slate-100' : ''
                }`}
                onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                    <CategoryIcon name={category.icon} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-slate-900 truncate">{category.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                        {category.indonesianName}
                      </span>
                      {!category.isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold">
                          Non-aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{category.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <span className="hidden sm:inline-block text-[11px] font-bold text-slate-500 mr-2">
                    {category.eventTypes.length} Tipe Acara
                  </span>

                  {/* Reorder Buttons */}
                  <div className="flex items-center space-x-0.5">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveCategory(index, 'up')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Pindah ke Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={index === filteredCategories.length - 1}
                      onClick={() => handleMoveCategory(index, 'down')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Pindah ke Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenEditCategory(category)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Edit Kategori"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus kategori "${category.name}" beserta tipe acaranya?`)) {
                        deleteEventCategory(category.id);
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Event Types Under Category */}
              {isExpanded && (
                <div className="p-4 sm:p-5 space-y-3 bg-slate-50/30">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <div className="text-xs font-bold text-slate-700">Daftar Tipe Acara Terdaftar:</div>
                    <button
                      type="button"
                      onClick={() => handleOpenNewType(category.id)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Tipe Acara</span>
                    </button>
                  </div>

                  {category.eventTypes.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Belum ada tipe acara di kategori ini. Silakan klik tombol "Tambah Tipe Acara".
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.eventTypes.map((eventType) => (
                        <div
                          key={eventType.id}
                          className={`p-4 rounded-xl border bg-white transition-all ${
                            eventType.isActive ? 'border-slate-200/90' : 'border-slate-200 opacity-60 bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-slate-900">{eventType.name}</span>
                                {eventType.requiredTier === 'agency' && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black uppercase flex items-center space-x-1">
                                    <Crown className="w-2.5 h-2.5" />
                                    <span>Agency</span>
                                  </span>
                                )}
                                {eventType.requiredTier === 'professional' && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-black uppercase">
                                    Pro
                                  </span>
                                )}
                                {(!eventType.requiredTier || eventType.requiredTier === 'starter') && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase">
                                    Free
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{eventType.description}</p>
                            </div>

                            <div className="flex items-center space-x-1 shrink-0">
                              <button
                                onClick={() => toggleEventTypeActive(eventType.id)}
                                className={`p-1 rounded-md text-xs font-bold transition-colors ${
                                  eventType.isActive
                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                    : 'text-slate-400 hover:bg-slate-100'
                                }`}
                                title={eventType.isActive ? 'Non-aktifkan' : 'Aktifkan'}
                              >
                                {eventType.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleOpenEditType(category.id, eventType)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Hapus tipe acara "${eventType.name}"?`)) {
                                    deleteEventType(eventType.id);
                                  }
                                }}
                                className="p-1 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Subtypes */}
                          {eventType.subtypes && eventType.subtypes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {eventType.subtypes.map((sub, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Cultural tags */}
                          {eventType.culturalTags && eventType.culturalTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {eventType.culturalTags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold"
                                >
                                  Adat {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Recommended templates info */}
                          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span>
                              {eventType.recommendedTemplates?.length || 0} Templat Rekomendasi
                            </span>
                            <span className="text-slate-400 truncate max-w-[160px]">
                              {eventType.defaultAnimation || 'Standar Shimmer'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? 'Edit Kategori Acara' : 'Tambah Kategori Acara Baru'}
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kategori (Bahasa Inggris / Formal)</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Contoh: Wedding & Romance"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Bahasa Indonesia</label>
                <input
                  type="text"
                  required
                  value={catIndonesianName}
                  onChange={(e) => setCatIndonesianName(e.target.value)}
                  placeholder="Contoh: Pernikahan & Romansa"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ikon</label>
                  <select
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="Heart">Heart (Pernikahan/Cinta)</option>
                    <option value="Cake">Cake (Ulang Tahun)</option>
                    <option value="Baby">Baby (Kelahiran/Aqiqah)</option>
                    <option value="Moon">Moon (Religius/Islam)</option>
                    <option value="Landmark">Landmark (Adat Nusantara)</option>
                    <option value="Shield">Shield (Khitanan/Perlindungan)</option>
                    <option value="GraduationCap">GraduationCap (Wisuda/Akademik)</option>
                    <option value="Briefcase">Briefcase (Korporat/Bisnis)</option>
                    <option value="Users">Users (Komunitas/Sosial)</option>
                    <option value="Home">Home (Rumah/Keluarga)</option>
                    <option value="Flag">Flag (Nasional/Musiman)</option>
                    <option value="Flower2">Flower2 (Memorial/Duka)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Urutan Tampilan</label>
                  <input
                    type="number"
                    min="1"
                    value={catDisplayOrder}
                    onChange={(e) => setCatDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Kategori</label>
                <textarea
                  rows={3}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Penjelasan cakupan acara dalam kategori ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVENT TYPE MODAL */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingType ? 'Edit Tipe Acara' : 'Tambah Tipe Acara Baru'}
              </h3>
              <button
                onClick={() => setShowTypeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveType} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Tipe Acara</label>
                <input
                  type="text"
                  required
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  placeholder="Contoh: Akad Nikah, Aqiqah, Tedak Siten, Wisuda..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows={2}
                  value={typeDescription}
                  onChange={(e) => setTypeDescription(e.target.value)}
                  placeholder="Deskripsi singkat selebrasi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtipe Acara (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={typeSubtypes}
                  onChange={(e) => setTypeSubtypes(e.target.value)}
                  placeholder="Contoh: Akad Masjid, Akad Resepsi Intim, Sunset Outdoor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Paket Minimum</label>
                  <select
                    value={typeRequiredTier}
                    onChange={(e) => setTypeRequiredTier(e.target.value as SubscriptionTier)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="starter">Starter (Gratis)</option>
                    <option value="professional">Professional</option>
                    <option value="agency">Agency (EO & Agency)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Animasi Pembuka Default</label>
                  <input
                    type="text"
                    value={typeAnimation}
                    onChange={(e) => setTypeAnimation(e.target.value)}
                    placeholder="Contoh: Gunungan Wayang Reveal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Cultural Tags Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ragam Budaya & Gaya Nusantara Terkait
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CULTURAL_STYLES.map((style) => {
                    const isSelected = typeCulturalTags.includes(style.id);
                    return (
                      <button
                        type="button"
                        key={style.id}
                        onClick={() => {
                          if (isSelected) {
                            setTypeCulturalTags(typeCulturalTags.filter((t) => t !== style.id));
                          } else {
                            setTypeCulturalTags([...typeCulturalTags, style.id]);
                          }
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {style.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recommended templates selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Templat Rekomendasi (Klik untuk pilih)
                </label>
                <div className="max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-xl space-y-1 bg-slate-50/50">
                  {templates.map((tmpl) => {
                    const isPicked = typeRecommendedTemplates.includes(tmpl.title);
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          if (isPicked) {
                            setTypeRecommendedTemplates(
                              typeRecommendedTemplates.filter((t) => t !== tmpl.title)
                            );
                          } else {
                            setTypeRecommendedTemplates([...typeRecommendedTemplates, tmpl.title]);
                          }
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          isPicked ? 'bg-purple-100/70 text-purple-900 font-bold' : 'hover:bg-white text-slate-700'
                        }`}
                      >
                        <span>{tmpl.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-500">{tmpl.category}</span>
                          {isPicked ? <Check className="w-3.5 h-3.5 text-purple-700" /> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Smart defaults */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-slate-800">Teks Pembuka & Kalimat Default Undangan:</div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Format Judul</label>
                  <input
                    type="text"
                    value={typeTitleTemplate}
                    onChange={(e) => setTypeTitleTemplate(e.target.value)}
                    placeholder="Contoh: Tasyakuran Aqiqah {hosts}"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Label Kolom Nama Tuan Rumah</label>
                  <input
                    type="text"
                    value={typeHostsLabel}
                    onChange={(e) => setTypeHostsLabel(e.target.value)}
                    placeholder="Contoh: Nama Bayi & Orang Tua"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Teks Pembuka Default</label>
                  <textarea
                    rows={2}
                    value={typeDefaultOpening}
                    onChange={(e) => setTypeDefaultOpening(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTypeModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Simpan Tipe Acara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
