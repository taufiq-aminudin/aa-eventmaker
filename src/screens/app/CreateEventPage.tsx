import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Heart,
  Palette,
  ArrowRight,
  ArrowLeft,
  Check,
  Eye,
  Crown,
  Filter,
  CheckCircle2,
  HelpCircle,
  FileText,
  Clock,
  Landmark,
  Layers,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { TemplateDetailModal } from '../../components/TemplateDetailModal';
import { TemplateItem, EventType } from '../../types';
import { CategoryIcon } from '../../components/admin/EventCategoryAdmin';
import { CULTURAL_STYLES } from '../../data/eventCatalog';

export const CreateEventPage: React.FC = () => {
  const {
    eventCategories,
    templates,
    createProject,
    selectTemplate,
    updateInvitation,
    canUseTemplate,
    activeSubscriptionTier,
    triggerUpgradePrompt,
    showToast,
  } = useEvent();
  const { navigate } = useRouter();

  // Wizard Steps: 1 -> 2 -> 3 -> 4 -> 5
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Category
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    eventCategories[0]?.id || 'cat-wedding'
  );

  // Step 2: Event Type
  const currentCategory = useMemo(() => {
    return eventCategories.find((c) => c.id === selectedCategoryId) || eventCategories[0];
  }, [eventCategories, selectedCategoryId]);

  const [selectedTypeId, setSelectedTypeId] = useState<string>('type-wedding');

  // Keep type updated when category changes
  const currentType = useMemo(() => {
    if (!currentCategory) return undefined;
    const found = currentCategory.eventTypes.find((t) => t.id === selectedTypeId);
    return found || currentCategory.eventTypes[0];
  }, [currentCategory, selectedTypeId]);

  // Step 3: Subtype & Cultural Style
  const [selectedSubtype, setSelectedSubtype] = useState<string>('Akad & Resepsi Lengkap');
  const [selectedCulturalStyle, setSelectedCulturalStyle] = useState<string>('Jawa');

  // Step 4: Form details with smart defaults
  const [formData, setFormData] = useState({
    title: 'The Wedding of Dimas & Sinta',
    hosts: 'Dimas Pratama & Sinta Maharani',
    date: '2026-11-20',
    time: '10:00 - 14:00 WIB',
    venue: 'Plataran Dharmawangsa Jakarta',
    address: 'Jl. Dharmawangsa VIII No. 26, Kebayoran Baru, Jakarta Selatan',
    openingGreeting:
      'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho-Nya, kami mengundang Bapak/Ibu/Saudara/i.',
    quote:
      '"Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya." (QS. Ar-Rum: 21)',
    notes: 'Acara intimate dengan busana adat tradisional.',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 5: Template Selection
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>('Javanese Heritage');
  const [filterAllTemplates, setFilterAllTemplates] = useState<boolean>(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);

  // When user selects a category
  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    const cat = eventCategories.find((c) => c.id === catId);
    if (cat && cat.eventTypes.length > 0) {
      const firstType = cat.eventTypes[0];
      setSelectedTypeId(firstType.id);
      applySmartDefaults(firstType);
    }
    setStep(2);
  };

  // When user selects an event type
  const handleSelectType = (typeId: string) => {
    setSelectedTypeId(typeId);
    const typeObj = currentCategory?.eventTypes.find((t) => t.id === typeId);
    if (typeObj) {
      applySmartDefaults(typeObj);
    }
    setStep(3);
  };

  // Apply smart defaults from event type definition
  const applySmartDefaults = (typeObj: typeof currentType) => {
    if (!typeObj) return;

    // Subtype
    if (typeObj.subtypes && typeObj.subtypes.length > 0) {
      setSelectedSubtype(typeObj.subtypes[0]);
    } else {
      setSelectedSubtype(typeObj.name);
    }

    // Cultural style
    if (typeObj.culturalTags && typeObj.culturalTags.length > 0) {
      setSelectedCulturalStyle(typeObj.culturalTags[0]);
    }

    // Smart title & opening
    const def = typeObj.defaultContent;
    const placeholderTitle = def.titleTemplate
      ? def.titleTemplate.replace('{hosts}', 'Dimas & Sinta')
      : `${typeObj.name} Acara`;

    setFormData((prev) => ({
      ...prev,
      title: placeholderTitle,
      openingGreeting: def.defaultOpening || prev.openingGreeting,
      quote: def.defaultQuote || prev.quote,
    }));

    // Pre-select recommended template if available
    if (typeObj.recommendedTemplates && typeObj.recommendedTemplates.length > 0) {
      setSelectedTemplateName(typeObj.recommendedTemplates[0]);
    }
  };

  // Validation for Step 4
  const validateStep4 = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Judul acara wajib diisi';
    if (!formData.hosts.trim()) errors.hosts = 'Nama tuan rumah / mempelai wajib diisi';
    if (!formData.date) errors.date = 'Tanggal acara wajib diisi';
    if (!formData.venue.trim()) errors.venue = 'Nama venue wajib diisi';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextFromStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) {
      showToast('Mohon lengkapi data acara yang bertanda bintang (*)');
      return;
    }
    setStep(5);
  };

  // Step 5: Finish & Open in Editor
  const handleFinishAndCreate = () => {
    // Map event type name to standard EventType or 'Custom Event'
    let mappedType: EventType = 'Custom Event';
    const typeNameLower = (currentType?.name || '').toLowerCase();
    if (typeNameLower.includes('wedding') || typeNameLower.includes('nikah') || typeNameLower.includes('reception')) {
      mappedType = 'Wedding';
    } else if (typeNameLower.includes('birthday') || typeNameLower.includes('ulang tahun')) {
      mappedType = 'Birthday';
    } else if (typeNameLower.includes('baby') || typeNameLower.includes('aqiqah')) {
      mappedType = 'Baby Shower';
    } else if (typeNameLower.includes('graduation') || typeNameLower.includes('wisuda')) {
      mappedType = 'Graduation';
    } else if (typeNameLower.includes('corporate') || typeNameLower.includes('seminar')) {
      mappedType = 'Corporate';
    }

    const newProject = createProject(
      formData.title,
      mappedType,
      formData.date,
      formData.time,
      formData.venue,
      {
        category: currentCategory?.name,
        subtype: selectedSubtype,
        culturalStyle: selectedCulturalStyle,
        notes: formData.notes,
      }
    );

    if (!newProject) {
      return;
    }

    selectTemplate(selectedTemplateName);
    updateInvitation({
      projectId: newProject.id,
      title: formData.title,
      hosts: formData.hosts,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      address: formData.address,
      openingGreeting: formData.openingGreeting,
      quote: formData.quote,
      category: currentCategory?.name,
      eventType: mappedType,
      eventSubtype: selectedSubtype,
      culturalStyle: selectedCulturalStyle,
      templateName: selectedTemplateName,
    });

    showToast(`Acara "${formData.title}" berhasil dibuat! Membuka editor...`);
    navigate('/editor');
  };

  // Filter templates for Step 5
  const displayedTemplates = useMemo(() => {
    if (filterAllTemplates || !currentType) {
      return templates;
    }
    const recs = currentType.recommendedTemplates || [];
    const recommendedList = templates.filter((t) => recs.includes(t.title));
    if (recommendedList.length > 0) {
      return recommendedList;
    }
    // Fallback if none match
    return templates;
  }, [filterAllTemplates, currentType, templates]);

  return (
    <div id="create-event-wizard" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Wizard Progress Indicator */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, label: 'Kategori' },
            { num: 2, label: 'Tipe Acara' },
            { num: 3, label: 'Gaya Adat' },
            { num: 4, label: 'Detail' },
            { num: 5, label: 'Desain' },
          ].map((s, idx) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < step) setStep(s.num as any);
                  }}
                  disabled={s.num > step}
                  className={`flex flex-col items-center space-y-1 transition-all ${
                    s.num <= step ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-purple-600 text-white ring-4 ring-purple-100 shadow-xs'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-bold hidden sm:inline-block ${
                      isCurrent ? 'text-purple-700' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
                {idx < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                      step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ================= STEP 1: CATEGORY SELECTION ================= */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Langkah 1 dari 5</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Pilih Kategori Acara Anda</h1>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Tersedia 12 kategori utama perayaan nusantara, mulai dari resepsi pernikahan, adat daerah, syukuran kelahiran, hingga acara korporat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventCategories.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              return (
                <div
                  key={category.id}
                  onClick={() => handleSelectCategory(category.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group hover:border-purple-300 hover:shadow-md ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/40 ring-2 ring-purple-100 shadow-xs'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <CategoryIcon name={category.icon} className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {category.eventTypes.length} Tipe Acara
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {category.name}
                      </h3>
                      <div className="text-xs font-semibold text-purple-600">{category.indonesianName}</div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                    <span>Pilih Kategori</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= STEP 2: EVENT TYPE SELECTION ================= */}
      {step === 2 && currentCategory && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
              <CategoryIcon name={currentCategory.icon} className="w-3.5 h-3.5" />
              <span>{currentCategory.indonesianName}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Pilih Tipe Acara Spesifik</h1>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Pilih jenis perayaan yang paling tepat untuk mengaktifkan teks pembuka, doa, dan rekomendasi ornamen yang relevan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCategory.eventTypes.map((typeItem) => {
              const isSelected = selectedTypeId === typeItem.id;
              const isLocked =
                typeItem.requiredTier === 'agency' && activeSubscriptionTier !== 'agency';
              const isProLocked =
                typeItem.requiredTier === 'professional' && activeSubscriptionTier === 'starter';

              return (
                <div
                  key={typeItem.id}
                  onClick={() => {
                    if (isLocked || isProLocked) {
                      triggerUpgradePrompt(
                        typeItem.requiredTier || 'professional',
                        `Tipe acara "${typeItem.name}" membutuhkan paket ${typeItem.requiredTier?.toUpperCase()}.`
                      );
                      return;
                    }
                    handleSelectType(typeItem.id);
                  }}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group hover:border-purple-300 hover:shadow-md ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/40 ring-2 ring-purple-100 shadow-xs'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {typeItem.name}
                      </h3>
                      {typeItem.requiredTier === 'agency' && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>AGENCY</span>
                        </span>
                      )}
                      {typeItem.requiredTier === 'professional' && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                          PRO
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                      {typeItem.description}
                    </p>

                    {/* Cultural tags preview */}
                    {typeItem.culturalTags && typeItem.culturalTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {typeItem.culturalTags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                    <span>{isLocked || isProLocked ? 'Perlu Upgrade' : 'Pilih Tipe Ini'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Kategori</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: SUBTYPE & CULTURAL STYLE ================= */}
      {step === 3 && currentType && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
              <Landmark className="w-3.5 h-3.5" />
              <span>Sentuhan Budaya & Ragam Format</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Format Subtipe & Gaya Adat: {currentType.name}
            </h1>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Pilih format rangkaian acara (misal: Akad saja, Resepsi, atau Lengkap) serta sentuhan adat budaya yang diinginkan.
            </p>
          </div>

          {/* Subtype Selection */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Pilihan Subtipe / Format Rangkaian Acara:</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(currentType.subtypes && currentType.subtypes.length > 0
                ? currentType.subtypes
                : ['Format Lengkap / Standar']
              ).map((sub, idx) => {
                const isSelected = selectedSubtype === sub;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSubtype(sub)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-200 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{sub}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cultural Style Selection */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Landmark className="w-4 h-4 text-purple-600" />
              <span>Gaya Adat & Tradisi Budaya:</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {CULTURAL_STYLES.map((style) => {
                const isSelected = selectedCulturalStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedCulturalStyle(style.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-200 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{style.label}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{style.musicStyle}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Tipe Acara</span>
            </button>

            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 shadow-xs cursor-pointer"
            >
              <span>Lanjut ke Detail Acara</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: EVENT DETAILS FORM ================= */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6 animate-in fade-in">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>Langkah 4 dari 5: Detail & Teks Acara</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Informasi Jadwal & Tempat</h1>
            <p className="text-xs text-slate-500">
              Data telah disesuaikan secara otomatis berdasarkan pilihan ({currentType?.name} - {selectedSubtype}).
            </p>
          </div>

          <form onSubmit={handleNextFromStep4} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama / Judul Acara <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: The Wedding of Dimas & Sinta"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  formErrors.title ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:ring-2 focus:ring-purple-600'
                }`}
              />
              {formErrors.title && <p className="text-[11px] text-rose-500 mt-1">{formErrors.title}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {currentType?.defaultContent.hostsLabel || 'Nama Mempelai / Tuan Rumah'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Heart className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.hosts}
                  onChange={(e) => setFormData({ ...formData, hosts: e.target.value })}
                  placeholder="Contoh: Dimas Pratama & Sinta Maharani"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                    formErrors.hosts ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:ring-2 focus:ring-purple-600'
                  }`}
                />
              </div>
              {formErrors.hosts && <p className="text-[11px] text-rose-500 mt-1">{formErrors.hosts}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tanggal Acara <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 bg-white"
                  />
                </div>
                {formErrors.date && <p className="text-[11px] text-rose-500 mt-1">{formErrors.date}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Waktu Pelaksanaan</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="Contoh: 10:00 - 14:00 WIB"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Venue / Tempat <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Contoh: Plataran Dharmawangsa Jakarta"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                    formErrors.venue ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:ring-2 focus:ring-purple-600'
                  }`}
                />
              </div>
              {formErrors.venue && <p className="text-[11px] text-rose-500 mt-1">{formErrors.venue}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap Venue</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Dharmawangsa VIII No. 26, Kebayoran Baru, Jakarta Selatan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Teks Salam & Pembuka</label>
              <textarea
                rows={2}
                value={formData.openingGreeting}
                onChange={(e) => setFormData({ ...formData, openingGreeting: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kutipan / Ayat Suci / Motto</label>
              <textarea
                rows={2}
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                ← Kembali ke Gaya Adat
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Lanjut: Pilih Tema Desain</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= STEP 5: TEMPLATE SELECTION ================= */}
      {step === 5 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Langkah 5 dari 5: Kurasi Desain</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">Pilih Tema Desain Undangan</h1>
              <p className="text-xs text-slate-500">
                Templat di bawah telah diprioritaskan berdasarkan tipe acara {currentType?.name} dan gaya adat {selectedCulturalStyle}.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setFilterAllTemplates(!filterAllTemplates)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  filterAllTemplates
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{filterAllTemplates ? 'Menampilkan Semua Templat' : 'Lihat Semua Templat'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTemplates.map((tmpl) => {
              const isSelected = selectedTemplateName === tmpl.title;
              const isRecommended = currentType?.recommendedTemplates?.includes(tmpl.title);
              const tierCheck = canUseTemplate(tmpl);

              return (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    if (!tierCheck.allowed) {
                      triggerUpgradePrompt(tierCheck.requiredTier, tierCheck.reason);
                      return;
                    }
                    setSelectedTemplateName(tmpl.title);
                  }}
                  className={`rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-600 ring-4 ring-purple-100 bg-white shadow-xl'
                      : 'border-slate-200 bg-white shadow-xs hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src={tmpl.defaultCoverPhoto}
                        alt={tmpl.title}
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {isRecommended && (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                              Rekomendasi ⭐
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-amber-300">
                            {tmpl.styleTag}
                          </span>
                        </div>

                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="text-sm font-serif font-bold text-white truncate">{tmpl.title}</h4>
                        <div className="text-[10px] text-slate-300 truncate">{tmpl.category}</div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-xs text-slate-500 line-clamp-2">{tmpl.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(tmpl);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!tierCheck.allowed) {
                          triggerUpgradePrompt(tierCheck.requiredTier, tierCheck.reason);
                          return;
                        }
                        setSelectedTemplateName(tmpl.title);
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                        isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isSelected ? 'Terpilih ✓' : 'Pilih Ini'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              ← Kembali ke Detail Acara
            </button>

            <button
              onClick={handleFinishAndCreate}
              className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Buat Acara & Buka di Editor ➔</span>
            </button>
          </div>
        </div>
      )}

      {previewTemplate && (
        <TemplateDetailModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={(tmpl) => {
            setSelectedTemplateName(tmpl.title);
            setPreviewTemplate(null);
          }}
        />
      )}
    </div>
  );
};
