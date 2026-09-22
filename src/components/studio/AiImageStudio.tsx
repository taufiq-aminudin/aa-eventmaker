import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Upload,
  Download,
  Wand2,
  RefreshCw,
  Sliders,
  Check,
  AlertCircle,
  Maximize2,
} from 'lucide-react';
import { generateOrEditImage, ImageGenerationResult } from '../../utils/geminiClient';
import { useEvent } from '../../context/EventContext';

export const AiImageStudio: React.FC = () => {
  const { showToast } = useEvent();

  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [imageSize, setImageSize] = useState<'512px' | '1K' | '2K'>('1K');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImageGenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sample prompt suggestions
  const samplePrompts = {
    create: [
      'Backdrop pelaminan mewah bertema Botanical Garden dengan bunga mawar putih dan pencahayaan hangat',
      'Desain kartu undangan pernikahan elegan dengan ornamen ukiran emas klasik di atas latar kertas linen biru gelap',
      'Dekorasi meja tamu resepsi pernikahan outdoor di tepi pantai saat matahari terbenam dengan lilin estetik',
      'Desain welcome sign kayu ukir modern rustic dengan rangkaian daun eucalyptus dan font kaligrafi indah',
    ],
    edit: [
      'Tambahkan efek pencahayaan hangat keemasan (golden hour glow) dan bokeh lembut di latar belakang',
      'Ganti warna buket bunga menjadi kombinasi mawar peach dan baby breath putih elegan',
      'Tingkatkan ketajaman detail pakaian pengantin dan berikan nuansa warna sinematik romantis',
      'Tambahkan kelopak bunga sakura yang berterbangan lembut di udara di sekitar foto',
    ],
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih berkas foto (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      setMode('edit');
      showToast('Foto berhasil dimuat untuk diedit dengan Gemini!');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && mode === 'create') {
      showToast('Masukkan deskripsi gambar yang ingin dibuat.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await generateOrEditImage({
        prompt: prompt.trim(),
        imageBase64: mode === 'edit' && uploadedImage ? uploadedImage : undefined,
        aspectRatio,
        imageSize,
      });

      setResult(res);
      showToast(mode === 'create' ? 'Gambar baru berhasil dibuat!' : 'Foto berhasil diedit!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal memproses gambar. Pastikan GEMINI_API_KEY valid.');
      showToast('Terjadi kendala saat menghasilkan gambar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result?.imageUrl) return;
    const a = document.createElement('a');
    a.href = result.imageUrl;
    a.download = `eventmaker-${mode}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Gambar berhasil diunduh!');
  };

  return (
    <div id="ai-image-studio" className="space-y-6">
      {/* Top Banner / Mode Toggle */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide uppercase">
              Model: gemini-3.1-flash-image-preview
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1">AI Image Generator & Photo Editor</h2>
          <p className="text-xs text-white/80 max-w-xl mt-0.5">
            Ciptakan dekorasi visual, desain cover undangan, atau edit foto momen spesial secara instan dengan kecerdasan Gemini Imagen.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-black/20 p-1 rounded-xl backdrop-blur-xs self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              mode === 'create'
                ? 'bg-white text-purple-900 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat Gambar Baru</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              mode === 'edit'
                ? 'bg-white text-purple-900 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Edit Foto Eksisting</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* If Edit Mode: Upload Section */}
            {mode === 'edit' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Foto yang Ingin Diedit
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-xl p-4 text-center transition-all bg-slate-50/50">
                  {uploadedImage ? (
                    <div className="relative group max-w-xs mx-auto">
                      <img
                        src={uploadedImage}
                        alt="Preview Foto Input"
                        className="h-44 w-auto mx-auto object-cover rounded-lg shadow-sm border border-slate-200"
                      />
                      <label className="absolute inset-0 bg-black/50 text-white font-bold text-xs flex flex-col items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        <Upload className="w-5 h-5 mb-1" />
                        Ganti Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-4">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <span className="text-xs font-bold text-purple-700 hover:underline">
                        Klik untuk unggah foto
                      </span>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        PNG, JPG, WebP hingga 15MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Prompt Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  {mode === 'create' ? 'Deskripsi Gambar (Prompt)' : 'Instruksi Pengeditan'}
                </label>
                <span className="text-[11px] text-slate-400">Bahasa Indonesia / English</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === 'create'
                    ? 'Contoh: Background pelaminan elegan gaya adat Sunda modern warna putih salju dengan ornamen melati segar dan lampu gantung kristal mewah...'
                    : 'Contoh: Berikan efek pencahayaan golden hour alami, pertegas detail kebaya, dan tambahkan bokeh lembut...'
                }
                rows={4}
                className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all resize-none"
              />
            </div>

            {/* Prompt Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Inspirasi Cepat:</span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts[mode].map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(s)}
                    className="text-[11px] text-left bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 px-2.5 py-1 rounded-lg transition-colors border border-slate-200/60"
                  >
                    {s.slice(0, 42)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Quality Configuration */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rasio Aspek
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`text-[11px] py-1.5 rounded-lg font-bold border transition-all text-center ${
                        aspectRatio === ratio
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Resolusi Output
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['512px', '1K', '2K'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setImageSize(sz)}
                      className={`text-[11px] py-1.5 rounded-lg font-bold border transition-all text-center ${
                        imageSize === sz
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading || (mode === 'edit' && !uploadedImage && !prompt)}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sedang memproses dengan Gemini 3.1 Flash Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {mode === 'create' ? 'Ciptakan Gambar AI Sekarang' : 'Terapkan Pengeditan AI'}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>Hasil Pratinjau Visual</span>
              </h3>
              {result && (
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                  {result.aspectRatio} • {result.model}
                </span>
              )}
            </div>

            {result?.imageUrl ? (
              <div className="space-y-3">
                <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5">
                  <img
                    src={result.imageUrl}
                    alt="Hasil Gemini"
                    className="w-full h-auto max-h-[380px] object-contain mx-auto rounded-lg"
                  />
                </div>

                {result.text && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 italic">
                    "{result.text}"
                  </p>
                )}
              </div>
            ) : (
              <div className="h-64 sm:h-80 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6 text-slate-400 bg-slate-50/40">
                <ImageIcon className="w-10 h-10 stroke-[1.5] mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-600">Belum Ada Gambar yang Dibuat</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                  Ketikkan deskripsi desain impian Anda atau unggah foto untuk melihat sentuhan AI
                  Gemini secara langsung.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {result?.imageUrl && (
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Gambar (.PNG)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
