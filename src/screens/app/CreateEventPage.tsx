import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Heart,
  Palette,
  ArrowRight,
  Check,
  Eye,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { TemplateDetailModal } from '../../components/TemplateDetailModal';
import { TemplateItem } from '../../types';
import { validateInvitationCreationForm } from '../../utils/validation';

export const CreateEventPage: React.FC = () => {
  const {
    invitation,
    updateInvitation,
    selectTemplate,
    templates,
    showToast,
  } = useEvent();
  const { navigate } = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    title: invitation.title || 'Pernikahan Andi & Ayu',
    hosts: invitation.hosts || 'Andi Pratama & Ayu Maharani',
    date: invitation.date || '2026-10-24',
    time: invitation.time || '10:00 - 14:00 WIB',
    venue: invitation.venue || 'Plataran Dharmawangsa',
    address: invitation.address || 'Jl. Dharmawangsa VIII No.26, Jakarta Selatan',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const [selectedTemplateName, setSelectedTemplateName] = useState<string>(invitation.templateName || 'Javanese Heritage');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    const result = validateInvitationCreationForm(formData);
    setFormErrors(result.errors);
  };

  const handleFieldChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touchedFields[field]) {
      const result = validateInvitationCreationForm(updated);
      setFormErrors(result.errors);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedFields({
      title: true,
      hosts: true,
      date: true,
      venue: true,
    });

    const result = validateInvitationCreationForm(formData);
    if (!result.isValid) {
      setFormErrors(result.errors);
      const firstError = Object.values(result.errors)[0];
      showToast(firstError || 'Mohon lengkapi semua kolom yang wajib diisi.');
      return;
    }

    setFormErrors({});
    updateInvitation(formData);
    setStep(2);
  };

  const handleFinishAndEdit = () => {
    selectTemplate(selectedTemplateName);
    updateInvitation({
      ...formData,
      templateName: selectedTemplateName,
    });
    showToast('Proyek berhasil disiapkan! Silakan sesuaikan detail di Editor.');
    navigate('/editor');
  };

  return (
    <div id="create-event-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-xs mx-auto">
          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'
              }`}
            >
              {step === 1 ? '1' : '✓'}
            </span>
            <span className="text-xs font-bold text-slate-800">Detail Acara</span>
          </div>

          <div className="w-12 h-0.5 bg-slate-200" />

          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className="text-xs font-bold text-slate-800">Pilih Desain</span>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6 animate-in fade-in">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-900">Langkah 1: Lengkapi Informasi Acara</h1>
            <p className="text-xs text-slate-500">
              Masukkan nama mempelai/tuan rumah serta jadwal dan lokasi acara Anda.
            </p>
          </div>

          <form onSubmit={handleNextStep} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Judul Undangan / Acara <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                placeholder="Contoh: The Wedding of Andi & Ayu"
                className={`w-full px-3.5 py-2.5 rounded-xl border transition-colors ${
                  formErrors.title && touchedFields.title
                    ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-600'
                } focus:outline-hidden`}
              />
              {formErrors.title && touchedFields.title && (
                <p className="text-[11px] font-medium text-rose-600 mt-1">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Mempelai / Tuan Rumah <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Heart className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.hosts}
                  onChange={(e) => handleFieldChange('hosts', e.target.value)}
                  onBlur={() => handleBlur('hosts')}
                  placeholder="Contoh: Andi Pratama & Ayu Maharani"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border transition-colors ${
                    formErrors.hosts && touchedFields.hosts
                      ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-500'
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-600'
                  } focus:outline-hidden`}
                />
              </div>
              {formErrors.hosts && touchedFields.hosts && (
                <p className="text-[11px] font-medium text-rose-600 mt-1">{formErrors.hosts}</p>
              )}
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
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    onBlur={() => handleBlur('date')}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border transition-colors ${
                      formErrors.date && touchedFields.date
                        ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-500'
                        : 'border-slate-300 focus:ring-2 focus:ring-blue-600'
                    } focus:outline-hidden bg-white`}
                  />
                </div>
                {formErrors.date && touchedFields.date && (
                  <p className="text-[11px] font-medium text-rose-600 mt-1">{formErrors.date}</p>
                )}
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Waktu Pelaksanaan</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => handleFieldChange('time', e.target.value)}
                  placeholder="Contoh: 10:00 - 14:00 WIB"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
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
                  onChange={(e) => handleFieldChange('venue', e.target.value)}
                  onBlur={() => handleBlur('venue')}
                  placeholder="Contoh: Plataran Dharmawangsa Jakarta"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border transition-colors ${
                    formErrors.venue && touchedFields.venue
                      ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-500'
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-600'
                  } focus:outline-hidden`}
                />
              </div>
              {formErrors.venue && touchedFields.venue && (
                <p className="text-[11px] font-medium text-rose-600 mt-1">{formErrors.venue}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap Venue</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="Jl. Dharmawangsa VIII No. 26, Jakarta Selatan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Lanjut: Pilih Tema Desain</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-900">Langkah 2: Pilih Desain Awal Undangan</h1>
            <p className="text-xs text-slate-500">
              Pilih tema yang paling sesuai dengan konsep pernikahan atau acara Anda. Anda selalu dapat mengubahnya nanti.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tmpl) => {
              const isSelected = selectedTemplateName === tmpl.title;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateName(tmpl.title)}
                  className={`rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 ring-4 ring-blue-100 bg-white shadow-xl'
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
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-amber-300">
                          {tmpl.styleTag}
                        </span>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <h4 className="text-sm font-serif font-bold text-white truncate">{tmpl.title}</h4>
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
                      onClick={() => setSelectedTemplateName(tmpl.title)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
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
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              ← Kembali ke Detail Acara
            </button>

            <button
              onClick={handleFinishAndEdit}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Buka di Editor & Kustomisasi ➔</span>
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
