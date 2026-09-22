import React, { useState, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Download,
  Sparkles,
  Volume2,
  RefreshCw,
  AlertCircle,
  Check,
  Disc,
} from 'lucide-react';
import { generateMusicTrack, MusicGenerationResult } from '../../utils/geminiClient';
import { useEvent } from '../../context/EventContext';

export const LyriaMusicStudio: React.FC = () => {
  const { showToast } = useEvent();

  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MusicGenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const musicPresets = [
    {
      title: 'Romantic Acoustic Guitar',
      tag: 'Romantis Akustik',
      prompt: 'A warm acoustic fingerstyle guitar melody with gentle cello harmony, perfect for romantic wedding ceremony walk-in',
    },
    {
      title: 'Traditional Gamelan Royal Ambient',
      tag: 'Gamelan Jawa Elegan',
      prompt: 'Graceful Javanese gamelan ambient with soft gender, soothing suling flute and gentle gong accents for wedding entrance',
    },
    {
      title: 'Grand Orchestral Wedding March',
      tag: 'Orkestra Megah',
      prompt: 'Triumphant emotional orchestral strings and brass crescendo with soft harp glissandos celebrating wedding vow union',
    },
    {
      title: 'Upbeat Garden Party Reception',
      tag: 'Pesta Ceria Pop',
      prompt: 'Joyful modern indie pop with acoustic rhythm guitar, bright handclaps, and cheerful brass for casual wedding dinner',
    },
    {
      title: 'Peaceful Piano & Soft Strings Solo',
      tag: 'Piano Lembut',
      prompt: 'Melodic solo piano with subtle cinematic reverb and delicate strings, tender and heartfelt for emotional background',
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showToast('Masukkan deskripsi gaya musik yang ingin dihasilkan.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);

    try {
      const res = await generateMusicTrack({
        prompt: prompt.trim(),
        model,
      });

      setResult(res);
      showToast(
        model === 'lyria-3-clip-preview'
          ? 'Klip musik Lyria 30 detik berhasil dibuat!'
          : 'Track musik Lyria Pro berhasil dibuat!'
      );
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal menghasilkan musik. Periksa kuota atau kunci API.');
      showToast('Gagal memproses musik AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleDownload = () => {
    if (!result?.audioUrl) return;
    const a = document.createElement('a');
    a.href = result.audioUrl;
    a.download = `eventmaker-lyria-${model}-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Berkas audio WAV berhasil diunduh!');
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div id="lyria-music-studio" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide uppercase">
              Model: lyria-3-clip-preview & lyria-3-pro-preview
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1">Lyria AI Wedding & Event Music Composer</h2>
          <p className="text-xs text-white/80 max-w-xl mt-0.5">
            Komposisikan lagu latar pernikahan eksklusif, jingle pembuka undangan digital, atau aransemen instrumen romantis dengan Lyria.
          </p>
        </div>

        {/* Model Selector */}
        <div className="flex items-center bg-black/20 p-1 rounded-xl backdrop-blur-xs self-start md:self-auto">
          <button
            type="button"
            onClick={() => setModel('lyria-3-clip-preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              model === 'lyria-3-clip-preview'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Klip 30 Detik (Lyria Clip)</span>
          </button>
          <button
            type="button"
            onClick={() => setModel('lyria-3-pro-preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              model === 'lyria-3-pro-preview'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Full Track (Lyria Pro)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Deskripsi Musik & Mood (Prompt)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Sentuhan melodi piano akustik santai dipadukan gesekan biola romantis bertempo 75 BPM, cocok untuk lagu pengiring momen tukar cincin..."
                rows={3}
                className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all resize-none"
              />
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-500">Pilihan Gaya Populer:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {musicPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(preset.prompt)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                        {preset.title}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                        {preset.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-1">{preset.prompt}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Info Note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>
                Model Aktif:{' '}
                <strong className="text-emerald-700 font-mono">
                  {model === 'lyria-3-clip-preview'
                    ? 'lyria-3-clip-preview (Klip 30s)'
                    : 'lyria-3-pro-preview (Lagu Penuh)'}
                </strong>
              </span>
              <span className="text-[11px] text-slate-400">Audio Format: WAV 44.1kHz</span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sedang mengomposisi lagu dengan Lyria AI...</span>
                </>
              ) : (
                <>
                  <Music className="w-4 h-4" />
                  <span>Komposisikan Musik Sekarang</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Audio Player & Waveform Box (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Pemutar Musik Lyria</span>
              </h3>
              {result && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {result.model}
                </span>
              )}
            </div>

            {result?.audioUrl ? (
              <div className="space-y-4 my-2">
                {/* Audio element */}
                <audio
                  ref={audioRef}
                  src={result.audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleAudioEnded}
                  onLoadedMetadata={handleTimeUpdate}
                  className="hidden"
                />

                {/* Animated Waveform Visualization */}
                <div className="h-32 bg-gradient-to-b from-emerald-950 to-slate-900 rounded-xl p-4 flex flex-col justify-between text-white relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
                    <span>{formatSeconds(currentTime)}</span>
                    <span className="flex items-center space-x-1">
                      <Disc className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
                      <span>{formatSeconds(duration || 30)}</span>
                    </span>
                  </div>

                  {/* Pseudo Waveform bars */}
                  <div className="flex items-center justify-between gap-1 h-12 my-auto px-1">
                    {Array.from({ length: 28 }).map((_, i) => {
                      const heights = [
                        25, 45, 70, 30, 85, 95, 60, 40, 75, 90, 50, 65, 80, 40, 55, 90, 70, 35,
                        80, 60, 45, 75, 95, 60, 40, 70, 50, 30,
                      ];
                      const height = heights[i % heights.length];
                      return (
                        <div
                          key={i}
                          style={{ height: `${isPlaying ? height : Math.max(15, height * 0.4)}%` }}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            isPlaying
                              ? 'bg-gradient-to-t from-emerald-400 to-teal-200'
                              : 'bg-emerald-800/60'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Scrubber progress */}
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all"
                      style={{
                        width: duration ? `${(currentTime / duration) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 py-2">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                </div>

                {result.lyrics && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block">Lirik / Catatan Musik:</span>
                    <p className="italic whitespace-pre-line text-[11px] text-slate-600">
                      {result.lyrics}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 sm:h-80 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6 text-slate-400 bg-slate-50/40">
                <Music className="w-10 h-10 stroke-[1.5] mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-600">Belum Ada Trek Musik</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                  Pilih gaya musik romantis di sebelah kiri atau ketik ide instrumen impian Anda untuk
                  mendengarkan hasil Lyria.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {result?.audioUrl && (
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Lagu (.WAV)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
