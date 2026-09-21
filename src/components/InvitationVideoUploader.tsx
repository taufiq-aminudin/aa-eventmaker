import React, { useState, useRef } from 'react';
import {
  Video,
  Play,
  Trash2,
  Upload,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Film,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { useRouter } from '../context/RouterContext';

export const InvitationVideoUploader: React.FC = () => {
  const { invitation, updateInvitation, activeSubscriptionTier, showToast } = useEvent();
  const { navigate } = useRouter();

  const [inputUrl, setInputUrl] = useState(invitation.videoUrl || '');
  const [videoTitle, setVideoTitle] = useState(invitation.videoTitle || 'Kisah Perjalanan & Harapan Masa Depan');
  const [isProcessing, setIsProcessing] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const isProOrAgency = activeSubscriptionTier === 'professional' || activeSubscriptionTier === 'agency';

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      showToast('Masukkan URL video yang valid.');
      return;
    }

    updateInvitation({
      videoUrl: inputUrl.trim(),
      videoTitle: videoTitle.trim() || 'Video Sinematik Prewedding',
    });
    showToast('Tautan video sinematik berhasil disimpan!');
  };

  const handleUseDemoVideo = () => {
    const demoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    const demoTitle = 'Kisah Perjalanan & Harapan Masa Depan';
    setInputUrl(demoUrl);
    setVideoTitle(demoTitle);
    updateInvitation({
      videoUrl: demoUrl,
      videoTitle: demoTitle,
    });
    showToast('Video sinematik demo berhasil dimuat!');
  };

  const handleRemoveVideo = () => {
    updateInvitation({
      videoUrl: undefined,
      videoTitle: undefined,
    });
    setInputUrl('');
    showToast('Video sinematik dihapus dari undangan.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size - limit to 30MB for browser dataURL/blob safety
    if (file.size > 30 * 1024 * 1024) {
      showToast('Ukuran video melebihi 30MB. Untuk video berdurasi panjang, disarankan menggunakan tautan YouTube / Vimeo.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateInvitation({
        videoUrl: dataUrl,
        videoTitle: videoTitle || file.name.replace(/\.[^/.]+$/, ''),
      });
      setInputUrl(file.name);
      setIsProcessing(false);
      showToast(`Video "${file.name}" berhasil diunggah!`);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    };
    reader.onerror = () => {
      setIsProcessing(false);
      showToast('Gagal membaca file video.');
    };
    reader.readAsDataURL(file);
  };

  // Helper to detect video format
  const isYouTube = invitation.videoUrl?.includes('youtube.com') || invitation.videoUrl?.includes('youtu.be');
  const isVimeo = invitation.videoUrl?.includes('vimeo.com');

  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&playsinline=1`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i);
    if (vimeoMatch && vimeoMatch[3]) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    }
    return url;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Video Sinematik &amp; Teaser Prewedding</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isProOrAgency
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {isProOrAgency ? 'Fitur Aktif' : 'Paket Pro / Agency'}
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Sematkan video teaser prewedding via tautan YouTube, Vimeo, atau unggah video MP4.
            </p>
          </div>
        </div>

        {!isProOrAgency && (
          <button
            type="button"
            onClick={() => navigate('/pricing')}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity flex items-center space-x-1.5 self-start sm:self-center cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade ke Professional</span>
          </button>
        )}
      </div>

      {/* Package Notice if Starter */}
      {!isProOrAgency && (
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-800 flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Paket Starter Free:</span> Video teaser prewedding adalah fitur eksklusif paket Wedding Professional &amp; EO Agency. Anda dapat mencoba pratinjau di bawah ini untuk melihat tampilannya.
          </div>
        </div>
      )}

      {/* Inputs and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSaveUrl} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Video Teaser
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Contoh: Kisah Perjalanan & Harapan Masa Depan"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Video (YouTube / Vimeo / MP4 Link)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... atau link .mp4"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-600 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </div>
          </form>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => videoFileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>{isProcessing ? 'Mengunggah...' : 'Upload File Video MP4'}</span>
            </button>
            <input
              ref={videoFileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleUseDemoVideo}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Gunakan Video Demo</span>
            </button>

            {invitation.videoUrl && (
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Video</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Preview Box */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-400 flex items-center space-x-1.5">
              <Play className="w-3.5 h-3.5 fill-amber-400" />
              <span>Pratinjau Pemutar Video</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {invitation.videoUrl ? 'Tersedia di Undangan' : 'Belum ada video'}
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800">
            {invitation.videoUrl ? (
              isYouTube || isVimeo ? (
                <iframe
                  src={getEmbedUrl(invitation.videoUrl)}
                  title={invitation.videoTitle || 'Prewedding Video'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={invitation.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                >
                  Browser Anda tidak mendukung pemutar video HTML5.
                </video>
              )
            ) : (
              <div className="text-center p-6 space-y-2">
                <Video className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">
                  Belum ada video disematkan. Masukkan tautan YouTube/MP4 atau klik "Gunakan Video Demo".
                </p>
              </div>
            )}
          </div>

          {invitation.videoUrl && (
            <div className="text-xs text-slate-300">
              <div className="font-bold text-white truncate">
                {invitation.videoTitle || 'Prewedding Teaser'}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {invitation.videoUrl.startsWith('data:') ? 'Video Berkas Lokal (Data URL)' : invitation.videoUrl}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
