import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Video,
  Palette,
  Wand2,
  Sliders,
  Copy,
  Check,
  Music,
  Clock,
  Layers,
  FileImage,
  Film,
  Image as ImageIcon,
  MessageSquare,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { PHOTO_PRESETS, VIDEO_TEMPLATES } from '../data/initialData';
import { AiImageStudio } from '../components/studio/AiImageStudio';
import { VeoVideoStudio } from '../components/studio/VeoVideoStudio';
import { LyriaMusicStudio } from '../components/studio/LyriaMusicStudio';
import { GeminiChatbot } from '../components/studio/GeminiChatbot';

export const StudioScreen: React.FC = () => {
  const { aiConcept, generateAiConcept, showToast } = useEvent();

  const [activeTab, setActiveTab] = useState<
    'ai-image' | 'veo-video' | 'lyria-music' | 'gemini-chat' | 'photo' | 'video' | 'ai' | 'design'
  >('ai-image');
  const [selectedPresetId, setSelectedPresetId] = useState(PHOTO_PRESETS[0].id);
  const [selectedVideoId, setSelectedVideoId] = useState(VIDEO_TEMPLATES[0].id);
  const [aiPrompt, setAiPrompt] = useState('');
  const [copiedRecipe, setCopiedRecipe] = useState(false);

  const selectedPreset =
    PHOTO_PRESETS.find((p) => p.id === selectedPresetId) || PHOTO_PRESETS[0];
  const selectedVideo =
    VIDEO_TEMPLATES.find((v) => v.id === selectedVideoId) || VIDEO_TEMPLATES[0];

  const handleCopyRecipe = () => {
    const text = `PRESET FOTO: ${selectedPreset.name} (${selectedPreset.toneTag})\n• Temp: ${selectedPreset.temp}\n• Tint: ${selectedPreset.tint}\n• Exposure: ${selectedPreset.exposure}\n• Contrast: ${selectedPreset.contrast}\n• Highlights: ${selectedPreset.highlights}\n• Shadows: ${selectedPreset.shadows}\n• Tone Hex: ${selectedPreset.tintColorHex}`;
    navigator.clipboard.writeText(text);
    setCopiedRecipe(true);
    showToast('Resep filter warna disalin ke clipboard!');
    setTimeout(() => setCopiedRecipe(false), 2000);
  };

  const handleRunAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    generateAiConcept(aiPrompt);
  };

  return (
    <div id="studio-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#6d28d9]" />
            <h1 className="text-lg font-bold text-slate-900">Creative Studio & AI Concept Maker</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Panduan grading warna foto, storyboard video sinematik, serta perumusan konsep tema AI.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'veo-video', label: 'Generate Video', icon: Film, badge: 'Veo 3' },
            { id: 'ai-image', label: 'AI Foto & Edit', icon: ImageIcon, badge: 'Gemini' },
            { id: 'lyria-music', label: 'Lyria Musik', icon: Music, badge: 'Lyria' },
            { id: 'gemini-chat', label: 'Gemini Chatbot', icon: MessageSquare, badge: 'Chat' },
            { id: 'photo', label: 'Preset Foto', icon: Camera },
            { id: 'video', label: 'Storyboard', icon: Video },
            { id: 'ai', label: 'AI Concept', icon: Wand2 },
            { id: 'design', label: 'Stationery', icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-[#6d28d9] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* NEW GENERATIVE AI STUDIOS */}
      {activeTab === 'ai-image' && <AiImageStudio />}
      {activeTab === 'veo-video' && <VeoVideoStudio />}
      {activeTab === 'lyria-music' && <LyriaMusicStudio />}
      {activeTab === 'gemini-chat' && <GeminiChatbot />}

      {/* TAB 1: PRESET FOTO */}
      {activeTab === 'photo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Presets List (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Koleksi Tone & Filter Warna
            </h3>

            <div className="space-y-2.5">
              {PHOTO_PRESETS.map((p) => {
                const isSelected = p.id === selectedPreset.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPresetId(p.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#6d28d9] bg-purple-50/50 shadow-xs ring-1 ring-[#6d28d9]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: p.tintColorHex }}
                        />
                        <span className="font-bold text-xs text-slate-900">{p.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {p.description}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 shrink-0">
                      {p.toneTag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Preset Parameters & Photo Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedPreset.name}</h3>
                <p className="text-xs text-slate-500">{selectedPreset.description}</p>
              </div>

              <button
                onClick={handleCopyRecipe}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 flex items-center space-x-1"
              >
                {copiedRecipe ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRecipe ? 'Tersalin' : 'Salin Resep'}</span>
              </button>
            </div>

            {/* Photo Canvas Simulation */}
            <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-900 shadow-inner flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                alt="Wedding Sample"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Grading Overlay */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-color"
                style={{
                  backgroundColor: selectedPreset.tintColorHex,
                  opacity: selectedPreset.tintAlpha,
                }}
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] text-white font-mono flex items-center space-x-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: selectedPreset.tintColorHex }}
                />
                <span>Simulasi Filter: {selectedPreset.toneTag}</span>
              </div>
            </div>

            {/* Parameter Recipe Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Color Temp', val: selectedPreset.temp },
                { label: 'Tint', val: selectedPreset.tint },
                { label: 'Exposure', val: selectedPreset.exposure },
                { label: 'Contrast', val: selectedPreset.contrast },
                { label: 'Highlights', val: selectedPreset.highlights },
                { label: 'Shadows', val: selectedPreset.shadows },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">
                    {item.label}
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 block">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STORYBOARD VIDEO */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          {/* Video Template Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VIDEO_TEMPLATES.map((vt) => (
              <div
                key={vt.id}
                onClick={() => setSelectedVideoId(vt.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  vt.id === selectedVideo.id
                    ? 'border-[#6d28d9] bg-purple-50/40 shadow-xs ring-1 ring-[#6d28d9]'
                    : 'border-slate-200 hover:bg-slate-50 bg-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {vt.format}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#6d28d9]">{vt.duration}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-1">{vt.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{vt.description}</p>
              </div>
            ))}
          </div>

          {/* Detailed Storyboard Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Gaya Musik</span>
                <div className="text-xs font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <Music className="w-3.5 h-3.5 text-pink-500" />
                  <span>
                    {selectedVideo.musicStyle} ({selectedVideo.bpm})
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Rekomendasi Gear Kamera
                </span>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
                  {selectedVideo.cameraGear}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Grading LUT</span>
                <div className="text-xs font-bold text-[#6d28d9] mt-0.5">
                  {selectedVideo.colorLut}
                </div>
              </div>
            </div>

            {/* Beat-by-Beat Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Urutan Scene Beat-by-Beat
              </h4>
              <div className="space-y-3">
                {selectedVideo.sceneBeats.map((beat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-[#6d28d9]/10 text-[#6d28d9] flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{beat.action}</div>
                        <div className="text-[11px] text-slate-500">
                          Tipe Shot: <strong>{beat.shotType}</strong> • Transisi:{' '}
                          <strong>{beat.transition}</strong>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#6d28d9] bg-white px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
                      {beat.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI CONCEPT CREATOR */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#4c1d95] to-[#db2777] p-6 rounded-2xl text-white shadow-lg space-y-3">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <Wand2 className="w-5 h-5 text-amber-300" />
              <span>AI Wedding Concept & Theme Formulator</span>
            </h3>
            <p className="text-xs text-purple-100 max-w-2xl">
              Ketikkan konsep impian pernikahan Anda (misalnya: "Pernikahan adat Minang modern dengan
              aksen emas marun & garden night"), sistem AI akan merumuskan palet warna, tipografi,
              narasi undangan, dan arahan visual dokumentasi.
            </p>

            <form onSubmit={handleRunAi} className="flex gap-2 pt-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ketik deskripsi konsep impian Anda..."
                className="flex-1 text-xs px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-200 focus:outline-hidden focus:ring-2 focus:ring-amber-300 backdrop-blur-md"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-colors shrink-0"
              >
                Rumuskan Konsep
              </button>
            </form>
          </div>

          {/* AI Result Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Hasil Formulasi Tema:
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-900 mt-0.5">
                {aiConcept.themeTitle}
              </h2>
            </div>

            {/* Color Palette */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Luxury Color Palette:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {aiConcept.palette.map((color, idx) => {
                  const hexMatch = color.match(/#[0-9A-Fa-f]{6}/);
                  const hex = hexMatch ? hexMatch[0] : '#6d28d9';
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 flex items-center space-x-3 bg-slate-50/50"
                    >
                      <div
                        className="w-8 h-8 rounded-lg shadow-inner shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {color.split('#')[0]}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">{hex}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Typography & Copywriting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold text-slate-700">Rekomendasi Tipografi:</span>
                <p className="text-xs text-slate-600 font-medium">{aiConcept.typography}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold text-slate-700">
                  Arahan Dokumentasi & Lighting:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{aiConcept.photoDirection}</p>
              </div>
            </div>

            <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100 space-y-1.5">
              <span className="text-xs font-bold text-[#6d28d9]">
                Narasi Pembuka Undangan Digital:
              </span>
              <p className="text-xs text-slate-700 italic font-serif leading-relaxed">
                "{aiConcept.copywriting}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DESIGN STATIONERY */}
      {activeTab === 'design' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Acrylic Welcome Signage',
              dim: '60 x 90 cm',
              desc: 'Desain papan selamat datang transparan dengan lettering kaligrafi emas.',
            },
            {
              title: 'Table Number Card',
              dim: '10 x 15 cm',
              desc: 'Kartu nomor meja tamu resepsi selaras dengan tema Golden Night.',
            },
            {
              title: 'Instagram Story Announcement',
              dim: '1080 x 1920 px',
              desc: 'Format vertikal estetis untuk pengumuman save the date di media sosial.',
            },
            {
              title: 'Souvenir Thank You Card',
              dim: '7 x 10 cm',
              desc: 'Kartu ucapan terima kasih mini untuk disematkan pada paket souvenir tamu.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-[#6d28d9] px-2 py-0.5 rounded-md bg-purple-50">
                  {item.dim}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => showToast(`Templat ${item.title} siap digunakan!`)}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Gunakan Format Ini
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
