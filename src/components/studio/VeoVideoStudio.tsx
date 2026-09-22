import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  Upload,
  Download,
  Film,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  Send,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  startVideoGeneration,
  checkVideoStatus,
  downloadVideoAsBlobUrl,
} from '../../utils/geminiClient';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';

interface VeoVideoStudioProps {
  initialMode?: 'text-to-video' | 'photo-to-video';
}

export const VeoVideoStudio: React.FC<VeoVideoStudioProps> = ({ initialMode = 'text-to-video' }) => {
  const { showToast, invitation, updateInvitation } = useEvent();
  const { navigate } = useRouter();

  const [mode, setMode] = useState<'text-to-video' | 'photo-to-video'>(initialMode);
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  // Generation & Polling State
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [operationName, setOperationName] = useState<string | null>(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [appliedToInvitation, setAppliedToInvitation] = useState(false);

  const pollIntervalRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const samplePrompts = {
    'text-to-video': [
      'Pemandangan udara drone sinematik di atas resor pernikahan tepi tebing Bali saat golden hour matahari terbenam, ombak lembut memecah di bawah',
      'Lorong karpet merah pernikahan di bawah kanopi bunga wisteria ungu putih dengan lilin menyala di setiap sisi',
      'Opening teaser video pernikahan: close up cincin kawin di atas mahar kayu ukir, perlahan fokus ke sepasang tangan mempelai',
      'Cinematic slow motion romantic walk through pine forest at sunrise with soft golden sun rays beaming through the morning mist',
      'Pesta resepsi malam hari berhias ribuan fairy lights hangat, kembang api lembut berpendar di langit malam dengan dekorasi bunga mawar',
    ],
    'photo-to-video': [
      'Sinematik zoom-in halus pada kedua mempelai, hembusan angin sepoi-sepoi menerbangkan gaun dan kelopak bunga',
      'Peralihan pencahayaan matahari terbenam lembut (sunset glow) dengan efek depth-of-field dramatis',
      'Kamera bergerak perlahan mengitari dekorasi pelaminan dengan taburan kilau cahaya bokeh hangat',
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
      showToast('Foto berhasil diunggah untuk dianimasikan dengan Veo!');
    };
    reader.readAsDataURL(file);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'text-to-video' && !prompt.trim()) {
      showToast('Masukkan deskripsi teks video yang ingin dibuat.');
      return;
    }

    if (mode === 'photo-to-video' && !uploadedImage) {
      showToast('Unggah foto yang ingin dianimasikan menjadi video.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setVideoBlobUrl(null);
    setAppliedToInvitation(false);
    setStatusText('Menginisialisasi Veo 3 (veo-3.1-fast-generate-preview)...');
    setElapsedSeconds(0);

    // Timer for elapsed seconds
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    try {
      const startRes = await startVideoGeneration({
        prompt: prompt.trim() || undefined,
        imageBase64: mode === 'photo-to-video' && uploadedImage ? uploadedImage : undefined,
        aspectRatio,
      });

      setOperationName(startRes.operationName);
      setStatusText('Operasi Veo 3 dimulai. Sedang mensintesis frame sinematik dari teks...');

      // Start polling loop every 5 seconds
      pollIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await checkVideoStatus(startRes.operationName);

          if (statusRes.done) {
            clearInterval(pollIntervalRef.current);
            clearInterval(timerRef.current);

            if (statusRes.error) {
              throw new Error(statusRes.error.message || 'Proses pembuatan video gagal.');
            }

            setStatusText('Video selesai dirender! Mengunduh berkas video...');

            // Download video
            const url = await downloadVideoAsBlobUrl(startRes.operationName);
            setVideoBlobUrl(url);
            setIsGenerating(false);
            setStatusText('Video Veo 3 berhasil dibuat!');
            showToast('Video sinematik Veo berhasil dihasilkan!');
          } else {
            // Reassuring progressive messages
            const messages = [
              'Membuat komposisi gerak kamera...',
              'Merender pencahayaan dan refleksi realistis...',
              'Mengoptimalkan frame rate 720p sinematik...',
              'Tahap finalisasi encode MP4...',
            ];
            const msgIdx = Math.floor(Math.random() * messages.length);
            setStatusText(`Veo 3 sedang bekerja: ${messages[msgIdx]}`);
          }
        } catch (pollErr: any) {
          clearInterval(pollIntervalRef.current);
          clearInterval(timerRef.current);
          setIsGenerating(false);
          setErrorMessage(pollErr.message || 'Gagal memeriksa status video.');
        }
      }, 5000);
    } catch (err: any) {
      clearInterval(timerRef.current);
      setIsGenerating(false);
      setErrorMessage(err.message || 'Gagal memulai render video Veo.');
      showToast('Terjadi kendala saat memulai pembuatan video.');
    }
  };

  const handleDownload = () => {
    if (!videoBlobUrl) return;
    const a = document.createElement('a');
    a.href = videoBlobUrl;
    a.download = `eventmaker-veo-${aspectRatio.replace(':', 'x')}-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Video MP4 berhasil diunduh!');
  };

  const handleApplyToInvitation = () => {
    if (!videoBlobUrl) return;
    updateInvitation({
      videoUrl: videoBlobUrl,
      videoTitle: prompt.slice(0, 50) || 'Video Sinematik Veo 3 AI',
    });
    setAppliedToInvitation(true);
    showToast('Video Veo 3 berhasil dipasang ke undangan digital Anda!');
  };

  return (
    <div id="veo-video-studio" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-rose-600 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide uppercase flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Model: veo-3.1-fast-generate-preview</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-[10px] font-extrabold uppercase tracking-wider text-rose-200">
              Veo 3 AI
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1.5 flex items-center space-x-2">
            <span>Generate video from text</span>
          </h2>
          <p className="text-xs text-white/85 max-w-2xl mt-1 leading-relaxed">
            Hasilkan video teaser sinematik pesta pernikahan atau acara spesial langsung dari deskripsi teks 
            menggunakan AI generasi video tercanggih Google Veo 3. Format rasio aspek <strong>16:9 (Landscape)</strong> untuk layar lebar dan <strong>9:16 (Portrait)</strong> untuk smartphone dan media sosial.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-black/25 p-1 rounded-xl backdrop-blur-xs self-start md:self-auto border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setMode('text-to-video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              mode === 'text-to-video'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Teks ke Video</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('photo-to-video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              mode === 'photo-to-video'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-rose-500" />
            <span>Foto ke Video</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <form onSubmit={handleStartGeneration} className="space-y-4">
            {/* Aspect Ratio Constraint (16:9 or 9:16) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Pilih Rasio Aspek Video (Veo 3 Model Standard)
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`py-2.5 px-3.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-start space-y-0.5 cursor-pointer ${
                    aspectRatio === '16:9'
                      ? 'bg-indigo-50/80 border-indigo-600 text-indigo-800 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-black text-slate-900">
                    <span className="w-4 h-2.5 border-2 border-indigo-600 rounded-xs inline-block" />
                    <span>16:9 Landscape</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Layar lebar, desktop, &amp; YouTube TV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`py-2.5 px-3.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-start space-y-0.5 cursor-pointer ${
                    aspectRatio === '9:16'
                      ? 'bg-indigo-50/80 border-indigo-600 text-indigo-800 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-black text-slate-900">
                    <span className="w-2.5 h-4 border-2 border-indigo-600 rounded-xs inline-block" />
                    <span>9:16 Portrait</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Smartphone, Instagram Reels, &amp; TikTok</span>
                </button>
              </div>
            </div>

            {/* Photo to Video Upload (Only if mode === 'photo-to-video') */}
            {mode === 'photo-to-video' && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Unggah Foto untuk Dianimasikan
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-4 text-center transition-all bg-slate-50/50">
                  {uploadedImage ? (
                    <div className="relative group max-w-xs mx-auto">
                      <img
                        src={uploadedImage}
                        alt="Foto Sumber Video"
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
                      <span className="text-xs font-bold text-indigo-600 hover:underline">
                        Pilih foto mempelai atau dekorasi
                      </span>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Format PNG, JPG, WebP untuk dianimasikan oleh Veo 3
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

            {/* Text Prompt */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>
                  {mode === 'text-to-video'
                    ? 'Deskripsi Teks Video Sinematik'
                    : 'Arah Gerak Kamera & Suasana (Opsional)'}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Model: veo-3.1-fast-generate-preview
                </span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === 'text-to-video'
                    ? 'Ketik deskripsi video: Pemandangan udara drone di atas pantai Bali saat sunset, pelaminan dihiasi bunga mawar putih dan lilin warm white, gerak kamera sinematik...'
                    : 'Contoh: Gerakan kamera maju perlahan, kelopak bunga berterbangan tertiup angin lembut, cahaya matahari sore berkilauan...'
                }
                rows={3}
                className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
              />
            </div>

            {/* Suggested Prompts */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Inspirasi Prompt Sinematik:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts[mode].map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(s)}
                    className="text-[11px] text-left bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2.5 py-1 rounded-lg transition-colors border border-slate-200/60 cursor-pointer"
                  >
                    {s.slice(0, 52)}...
                  </button>
                ))}
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
              disabled={isGenerating || (mode === 'text-to-video' && !prompt.trim()) || (mode === 'photo-to-video' && !uploadedImage)}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sedang merender video dengan Veo 3... ({elapsedSeconds}d)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {mode === 'text-to-video'
                      ? `Generate Video dari Teks (${aspectRatio})`
                      : `Animasi Foto ke Video (${aspectRatio})`}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Video Player & Progress (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Pratinjau Video Veo 3</span>
              </h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                {aspectRatio} • veo-3.1-fast
              </span>
            </div>

            {/* If Generating: Progress Card */}
            {isGenerating && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-3 my-4">
                <div className="relative w-12 h-12 mx-auto">
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                  <Clock className="w-5 h-5 text-indigo-600 absolute inset-0 m-auto" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Proses Render Video Berlangsung</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{statusText}</p>
                </div>
                <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 py-1 px-3 rounded-full inline-block">
                  Waktu berjalan: {elapsedSeconds} detik
                </div>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                  Model Veo 3 sedang mensintesis frame sinematik 720p dengan pencahayaan dan fisika kamera realistis.
                </p>
              </div>
            )}

            {/* Video Player */}
            {videoBlobUrl ? (
              <div className="space-y-3">
                <div
                  className={`overflow-hidden rounded-xl border border-slate-200 bg-black flex items-center justify-center ${
                    aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[420px] mx-auto' : 'aspect-video'
                  }`}
                >
                  <video
                    src={videoBlobUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-green-700 font-semibold bg-green-50 p-2.5 rounded-xl border border-green-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Video Veo 3 berhasil di-render dan siap digunakan!</span>
                </div>
              </div>
            ) : !isGenerating && (
              <div className="h-64 sm:h-80 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6 text-slate-400 bg-slate-50/40">
                <Film className="w-10 h-10 stroke-[1.5] mb-2 opacity-50 text-indigo-400" />
                <p className="text-xs font-bold text-slate-600">Belum Ada Video yang Dibuat</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                  Masukkan deskripsi teks di samping dan pilih rasio aspek (16:9 atau 9:16) untuk memulai generasi video Veo 3.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {videoBlobUrl && (
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={handleApplyToInvitation}
                disabled={appliedToInvitation}
                className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-60 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{appliedToInvitation ? '✓ Terpasang di Undangan' : 'Pasang di Undangan'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh MP4</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
