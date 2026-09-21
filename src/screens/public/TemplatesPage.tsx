import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Palette,
  Search,
  Eye,
  Sparkles,
  Calendar,
  MapPin,
  Check,
  ChevronRight,
  Filter,
  X,
  Lock,
  Crown,
  Zap,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';
import { TemplateDetailModal } from '../../components/TemplateDetailModal';
import { TemplateItem } from '../../types';

export const TemplatesPage: React.FC = () => {
  const { templates, selectTemplate, canUseTemplate, activeSubscriptionTier } = useEvent();
  const { navigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStyle, setSelectedStyle] = useState<string>('Semua');
  const [selectedTier, setSelectedTier] = useState<string>('Semua');
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<TemplateItem | null>(null);

  const categories = [
    'Semua',
    'Wedding',
    'Adat Jawa',
    'Adat Sunda',
    'Adat Bali',
    'Traditional',
    'Modern',
    'Minimalist',
    'Luxury',
    'Islamic',
    'Engagement',
    'Birthday',
    'Corporate',
  ];

  const styleTags = [
    'Semua',
    'Heritage Royal',
    'Gold Luxury',
    'Floral Romantic',
    'Modern Minimalist',
    'Emerald Grace',
    'Sunset Tropical',
    'Midnight Elegance',
  ];

  const filteredTemplates = templates.filter((t) => {
    // Search query match
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.styleTag.toLowerCase().includes(query) ||
      (t.sampleHosts && t.sampleHosts.toLowerCase().includes(query));

    // Category match
    const matchesCategory =
      selectedCategory === 'Semua' ||
      t.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Traditional' && (t.category.includes('Adat') || t.category.includes('Heritage'))) ||
      (selectedCategory === 'Luxury' && (t.styleTag.toLowerCase().includes('gold') || t.styleTag.toLowerCase().includes('luxury')));

    // Style match
    const matchesStyle =
      selectedStyle === 'Semua' ||
      t.styleTag.toLowerCase().includes(selectedStyle.toLowerCase());

    // Tier match
    const matchesTier =
      selectedTier === 'Semua' ||
      (selectedTier === 'starter' && (!t.requiredTier || t.requiredTier === 'starter')) ||
      (selectedTier === 'professional' && t.requiredTier === 'professional') ||
      (selectedTier === 'agency' && t.requiredTier === 'agency');

    return matchesSearch && matchesCategory && matchesStyle && matchesTier;
  });

  const handleUseTemplate = (tmpl: TemplateItem) => {
    const success = selectTemplate(tmpl.title);
    if (success) {
      navigate('/create');
    }
  };

  return (
    <div id="templates-page" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="Koleksi Template Undangan Digital – AA Event Maker"
        description="Jelajahi puluhan tema undangan digital pernikahan adat Jawa, Sunda, Bali, tema modern, minimalis, dan mewah dengan musik dan RSVP interaktif."
        canonicalPath="/templates"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      <PublicHeader />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-3">
              <Palette className="w-3.5 h-3.5" />
              <span>Katalog Undangan Terlengkap</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Koleksi Template Undangan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Pilihan tema visual beresolusi tinggi dengan ornamen budaya otentik, tipografi elegan, dan integrasi musik sinematik yang siap Anda gunakan.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama tema (misal: Keraton, Sunda, Bali, Gold Luxury, Minimalist)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Reset filter button if active */}
              {(selectedCategory !== 'Semua' || selectedStyle !== 'Semua' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSelectedStyle('Semua');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 text-xs font-bold hover:bg-rose-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {/* Category Pills (horizontal scroll on mobile) */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Kategori Acara:
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Subscription Tier Filter */}
            <div className="pt-2 border-t border-slate-200/60">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Kategori Paket Langganan:
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'Semua', label: 'Semua Paket' },
                  { id: 'starter', label: 'Starter Free' },
                  { id: 'professional', label: 'Wedding Professional' },
                  { id: 'agency', label: 'EO & Agency' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedTier === tier.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
            <div>
              Menampilkan <strong>{filteredTemplates.length}</strong> tema undangan
              {selectedCategory !== 'Semua' && ` pada kategori "${selectedCategory}"`}
              {selectedTier !== 'Semua' && ` (Paket ${selectedTier})`}
            </div>
          </div>

          {/* Template Cards Grid */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((tmpl) => {
                const access = canUseTemplate(tmpl);
                return (
                  <motion.div
                    key={tmpl.id}
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Cover Photo */}
                      <div className="relative h-48 overflow-hidden bg-slate-900">
                        <img
                          src={tmpl.defaultCoverPhoto}
                          alt={tmpl.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-white/10 shadow-xs">
                              {tmpl.styleTag}
                            </span>
                            {tmpl.requiredTier === 'agency' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                                <Crown className="w-2.5 h-2.5 text-slate-950" />
                                <span>Agency</span>
                              </span>
                            ) : tmpl.requiredTier === 'professional' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white flex items-center gap-1 shadow-xs">
                                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                                <span>Pro</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                                Free
                              </span>
                            )}
                          </div>
                          <span
                            className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: tmpl.accentColor || '#f59e0b' }}
                            title="Warna Aksen"
                          />
                        </div>

                        {/* Host details */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                            {tmpl.category}
                          </div>
                          <h3 className="text-base font-serif font-bold text-white truncate">
                            {tmpl.sampleHosts || tmpl.title}
                          </h3>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 space-y-3">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {tmpl.title}
                            </h4>
                            {!access.allowed && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Paket {tmpl.requiredTier === 'agency' ? 'Agency' : 'Pro'}</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {tmpl.description}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[11px] text-slate-600">
                          <div className="flex items-center space-x-1.5 truncate">
                            <Calendar className="w-3 h-3 text-blue-500 shrink-0" />
                            <span>{tmpl.sampleDate || 'Sabtu, 24 Oktober 2026'}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 truncate">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                            <span className="truncate">{tmpl.sampleVenue || 'Ballroom Hotel Indonesia'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-5 pt-0 flex items-center space-x-2 border-t border-slate-100 mt-2">
                      <button
                        type="button"
                        onClick={() => setActivePreviewTemplate(tmpl)}
                        className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Realistis</span>
                      </button>

                      {access.allowed ? (
                        <button
                          type="button"
                          onClick={() => handleUseTemplate(tmpl)}
                          className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Gunakan</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUseTemplate(tmpl)}
                          className="flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                          title="Klik untuk membuka paket langganan"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-200" />
                          <span>Buka Paket {tmpl.requiredTier === 'agency' ? 'Agency' : 'Pro'}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Palette className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <div className="text-base font-bold text-slate-800">Tidak ada template ditemukan</div>
              <p className="text-xs text-slate-500 mt-1">
                Cobalah mengubah kata kunci pencarian atau pilih kategori template yang lain.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSelectedStyle('Semua');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Lihat Semua Template
              </button>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />

      {activePreviewTemplate && (
        <TemplateDetailModal
          template={activePreviewTemplate}
          onClose={() => setActivePreviewTemplate(null)}
          onUseTemplate={(tmpl) => {
            handleUseTemplate(tmpl);
            setActivePreviewTemplate(null);
          }}
        />
      )}
    </div>
  );
};
