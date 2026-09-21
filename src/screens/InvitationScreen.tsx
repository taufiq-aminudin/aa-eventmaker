import React, { useState } from 'react';
import {
  Mail,
  Check,
  Eye,
  Globe,
  Share2,
  Copy,
  Sparkles,
  Palette,
  ExternalLink,
  Camera,
  Heart,
  ImageIcon,
  Lock,
  Crown,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { InvitationPhotoUploader } from '../components/InvitationPhotoUploader';
import { InvitationVideoUploader } from '../components/InvitationVideoUploader';
import { TemplateDetailModal } from '../components/TemplateDetailModal';
import { ShareWhatsAppButton } from '../components/ShareWhatsAppButton';
import { TemplateItem } from '../types';

export const InvitationScreen: React.FC = () => {
  const {
    invitation,
    updateInvitation,
    selectTemplate,
    canUseTemplate,
    templates,
    currentProject,
    setShowPublicPreview,
    showToast,
  } = useEvent();

  const [formData, setFormData] = useState({
    title: invitation.title,
    hosts: invitation.hosts,
    opening: invitation.opening,
    date: invitation.date,
    time: invitation.time,
    venue: invitation.venue,
    address: invitation.address,
    slug: invitation.slug,
    isPublished: invitation.isPublished,
  });

  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewingTemplate, setPreviewingTemplate] = useState<TemplateItem | null>(null);

  const categories = ['All', 'Wedding', 'Adat Heritage', 'Modern', 'Birthday', 'Corporate'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleInputChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    updateInvitation({ [field]: val });
  };

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/#invitation/${formData.slug}`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast('Tautan undangan disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="invitation-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-[#6d28d9]" />
            <h1 className="text-lg font-bold text-slate-900">Pembuat Undangan Digital (E-Invitation)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih tema estetik, unggah foto mempelai / momen, kustomisasi informasi acara, dan bagikan tautan kepada tamu undangan.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <ShareWhatsAppButton
            invitationUrl={`${window.location.origin}/#invitation/${formData.slug}`}
            eventTitle={formData.title}
            hosts={formData.hosts}
            date={formData.date}
            time={formData.time}
            venue={formData.venue}
            address={formData.address}
            variant="secondary"
            size="md"
            label="Share via WhatsApp"
          />
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin' : 'Salin Tautan'}</span>
          </button>
          <button
            onClick={() => setShowPublicPreview(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#6d28d9] to-[#ec4899] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-95 transition-opacity flex items-center space-x-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Lihat Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Upload Photos Component */}
      <InvitationPhotoUploader />

      {/* Video Teaser Prewedding Component */}
      <InvitationVideoUploader />

      {/* Template Gallery Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-[#6d28d9]" />
            <h2 className="text-sm font-bold text-slate-900">Pilihan Tema & Gaya Undangan</h2>
            <span className="text-xs text-slate-500">
              (Tema Aktif: <strong className="text-[#6d28d9]">{invitation.templateName}</strong>)
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-100 text-[#6d28d9] font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((tmpl) => {
            const isSelected = invitation.templateName === tmpl.title;
            const access = canUseTemplate(tmpl);
            return (
              <div
                key={tmpl.id}
                onClick={() => selectTemplate(tmpl.title)}
                className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#6d28d9] bg-purple-50/40 shadow-sm ring-2 ring-purple-400/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  {/* Visual Header with Real Image Thumbnail */}
                  <div className="relative h-28 rounded-xl overflow-hidden mb-3 shadow-inner group">
                    <img
                      src={tmpl.defaultCoverPhoto}
                      alt={tmpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white">
                          {tmpl.styleTag}
                        </span>
                        {tmpl.requiredTier === 'agency' ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5 text-slate-950" />
                            <span>Agency</span>
                          </span>
                        ) : tmpl.requiredTier === 'professional' ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-600 text-white flex items-center gap-0.5">
                            <span>Pro</span>
                          </span>
                        ) : null}
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : !access.allowed ? (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md" title={access.reason}>
                          <Lock className="w-3 h-3 text-slate-950" />
                        </div>
                      ) : null}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-xs font-serif font-bold text-white drop-shadow-sm truncate">
                      {tmpl.title}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900">{tmpl.title}</h3>
                    {!access.allowed && (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md shrink-0">
                        {tmpl.requiredTier === 'agency' ? 'Agency' : 'Pro'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{tmpl.category}</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewingTemplate(tmpl);
                      }}
                      className="text-xs font-semibold px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                      title="Lihat Preview Realistis & Video"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectTemplate(tmpl.title);
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 ${
                        isSelected
                          ? 'bg-[#6d28d9] text-white'
                          : !access.allowed
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {!access.allowed && !isSelected ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Buka</span>
                        </>
                      ) : isSelected ? (
                        'Terpilih'
                      ) : (
                        'Terapkan'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor & Interactive Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Formulir Informasi Undangan</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">Status Undangan:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2 text-xs font-semibold text-slate-700">
                  {formData.isPublished ? 'Online' : 'Draft'}
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Undangan (Header Title)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Contoh: The Wedding of Andi & Ayu"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Mempelai / Tuan Rumah (Hosts)
              </label>
              <input
                type="text"
                value={formData.hosts}
                onChange={(e) => handleInputChange('hosts', e.target.value)}
                placeholder="Contoh: Andi Pratama & Ayu Maharani"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hari & Tanggal Acara
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  placeholder="Contoh: Sabtu, 24 Oktober 2026"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Waktu Pelaksanaan
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  placeholder="Akad: 08:00 WIB | Resepsi: 11:00 WIB"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Gedung / Tempat (Venue)
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                placeholder="Contoh: Grand Ballroom Plataran Dharmawangsa"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lengkap Venue
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Jl. Dharmawangsa Raya No. 6, Kebayoran Baru, Jakarta Selatan"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sambutan / Ayat Suci / Teks Pembuka
              </label>
              <textarea
                rows={3}
                value={formData.opening}
                onChange={(e) => handleInputChange('opening', e.target.value)}
                placeholder="Tuliskan kata sambutan doa restu..."
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Slug Khusus Undangan
              </label>
              <div className="flex items-center">
                <span className="text-xs bg-slate-100 border border-r-0 border-slate-200 px-3 py-2.5 rounded-l-xl text-slate-500">
                  /#invitation/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    handleInputChange(
                      'slug',
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                    )
                  }
                  placeholder="andi-ayu-wedding"
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-r-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Smartphone Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5 text-[#6d28d9]" />
            <span>Simulasi Tampilan Ponsel Tamu</span>
          </div>

          {/* Phone Frame */}
          <div className="w-full max-w-[320px] rounded-[36px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800">
            {/* Camera notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            </div>

            {/* Inner Phone Screen */}
            <div className="bg-[#0b0f19] text-slate-100 rounded-[28px] overflow-y-auto max-h-[520px] text-center p-4 space-y-4 no-scrollbar">
              {/* Cover Banner with Uploaded / Default Cover */}
              <div className="relative py-4 bg-gradient-to-b from-purple-900/60 to-pink-900/50 rounded-2xl p-3 border border-purple-800/40 overflow-hidden">
                {invitation.coverPhoto && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
                    style={{ backgroundImage: `url(${invitation.coverPhoto})` }}
                  />
                )}
                <div className="relative z-10">
                  <span className="text-[9px] uppercase tracking-widest text-amber-200 font-semibold block mb-1">
                    WEDDING INVITATION
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white leading-tight">
                    {formData.hosts || 'Mempelai'}
                  </h3>
                  <p className="text-[10px] text-purple-200 mt-1 italic">{formData.title}</p>
                  <div className="mt-2 text-[9px] bg-black/40 px-2 py-0.5 rounded-full inline-block text-slate-300">
                    {formData.date}
                  </div>
                </div>
              </div>

              {/* Couple Photo if uploaded */}
              {invitation.couplePhoto && (
                <div className="flex justify-center">
                  <img
                    src={invitation.couplePhoto}
                    alt="Mempelai"
                    className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 shadow-md"
                  />
                </div>
              )}

              <div className="text-[10px] text-slate-300 font-light leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                "{formData.opening.slice(0, 110)}..."
              </div>

              <div className="text-left bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5 text-[10px]">
                <div className="font-bold text-amber-300 text-[11px] mb-1">Waktu & Lokasi</div>
                <div className="text-slate-300">
                  <strong>Waktu:</strong> {formData.time}
                </div>
                <div className="text-slate-300">
                  <strong>Tempat:</strong> {formData.venue}
                </div>
                <div className="text-slate-400 text-[9px] line-clamp-1">{formData.address}</div>
              </div>

              {/* Gallery count indicator */}
              {(invitation.galleryPhotos || []).length > 0 && (
                <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400">
                  <ImageIcon className="w-3 h-3 text-purple-400" />
                  <span>{invitation.galleryPhotos?.length} Foto Galeri Tersedia</span>
                </div>
              )}

              <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl text-center">
                <span className="text-[10px] font-bold text-pink-300 block mb-1">
                  Konfirmasi Kehadiran
                </span>
                <button
                  type="button"
                  onClick={() => setShowPublicPreview(true)}
                  className="w-full py-1.5 bg-gradient-to-r from-[#6d28d9] to-[#ec4899] text-white text-[10px] font-bold rounded-lg shadow-sm"
                >
                  Buka Undangan Lengkap & RSVP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Detail Realistic Preview Modal */}
      {previewingTemplate && (
        <TemplateDetailModal
          template={previewingTemplate}
          onClose={() => setPreviewingTemplate(null)}
          onUseTemplate={(t) => {
            selectTemplate(t.title);
            setPreviewingTemplate(null);
          }}
        />
      )}
    </div>
  );
};
