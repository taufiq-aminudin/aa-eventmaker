import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Eye,
  Music,
  Palette,
  Volume2,
  VolumeX,
  Share2,
  PartyPopper,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEvent } from '../context/EventContext';
import { THEME_PRESETS, ThemeMood } from '../utils/themePresets';
import { soundManager } from '../utils/ambientSound';

interface DynamicEventHeaderProps {
  currentThemeMood: ThemeMood;
  onSelectThemeMood: (mood: ThemeMood) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export const DynamicEventHeader: React.FC<DynamicEventHeaderProps> = ({
  currentThemeMood,
  onSelectThemeMood,
  isPlayingMusic,
  onToggleMusic,
}) => {
  const {
    currentProject,
    setShowQrCheckinModal,
    setShowPublicPreview,
    showToast,
  } = useEvent();

  const [showMoodSelector, setShowMoodSelector] = useState(false);

  // Dynamic Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 45, hours: 14, minutes: 28, seconds: 40 });

  useEffect(() => {
    // Parse or calculate from event date
    const targetDate = new Date();
    // Default to 45 days in the future if date is not parsed
    targetDate.setDate(targetDate.getDate() + 45);
    targetDate.setHours(targetDate.getHours() + 14);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentProject.date]);

  const currentTheme = THEME_PRESETS[currentThemeMood] || THEME_PRESETS.indigo;

  const triggerCelebration = () => {
    soundManager.playCheckInSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
    });
    showToast('🎉 Selamat mempersiapkan acara impian Anda!');
  };

  const copyEventLink = () => {
    soundManager.playTapSound();
    const url = window.location.origin + '#invitation';
    navigator.clipboard.writeText(url);
    showToast('🔗 Tautan undangan publik disalin ke clipboard!');
  };

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-r ${currentTheme.heroGradient} p-5 sm:p-7 text-white shadow-xl overflow-hidden transition-all duration-700`}
    >
      {/* Dynamic Animated Ambient Orbs */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute right-36 -top-16 w-56 h-56 rounded-full bg-white/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Title & Info */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{currentProject.type} Management</span>
            </div>

            {/* Atmosphere Mood Pill */}
            <button
              onClick={() => setShowMoodSelector(!showMoodSelector)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md text-[11px] font-semibold border border-white/10 transition-colors"
            >
              <Palette className="w-3 h-3 text-amber-200" />
              <span>Suasana: {currentTheme.name}</span>
            </button>

            {/* Ambient Music Toggle */}
            <button
              onClick={onToggleMusic}
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                isPlayingMusic
                  ? 'bg-amber-400 text-slate-900 font-bold shadow-xs'
                  : 'bg-black/20 hover:bg-black/30 text-white/90 border border-white/10'
              }`}
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-3 h-3 text-slate-900 animate-bounce" />
                  <span>Musik: On</span>
                  {/* Mini animated equalizer bars */}
                  <span className="flex items-center space-x-0.5 h-3 ml-1">
                    <span className="w-0.5 h-full bg-slate-900 animate-pulse" />
                    <span className="w-0.5 h-2 bg-slate-900 animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-3 bg-slate-900 animate-pulse" style={{ animationDelay: '300ms' }} />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 opacity-70" />
                  <span>Musik Latar</span>
                </>
              )}
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-xs">
            {currentProject.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/90 pt-0.5">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-white/80" />
              <span>{currentProject.date}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-white/80" />
              <span>{currentProject.time}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-white/80" />
              <span className="truncate max-w-[180px] sm:max-w-xs">{currentProject.location}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Countdown & Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3.5">
          {/* Real-time Dynamic Countdown Clock */}
          <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/15 w-full sm:w-auto">
            <div className="text-[10px] uppercase font-bold tracking-wider text-white/70 mb-1.5 text-center sm:text-left">
              Hitung Mundur Hari-H:
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white/10 rounded-xl px-2 py-1.5 min-w-12">
                <div className="text-base sm:text-lg font-black tracking-tight">{timeLeft.days}</div>
                <div className="text-[9px] uppercase text-white/75 font-medium">Hari</div>
              </div>
              <div className="bg-white/10 rounded-xl px-2 py-1.5 min-w-12">
                <div className="text-base sm:text-lg font-black tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[9px] uppercase text-white/75 font-medium">Jam</div>
              </div>
              <div className="bg-white/10 rounded-xl px-2 py-1.5 min-w-12">
                <div className="text-base sm:text-lg font-black tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[9px] uppercase text-white/75 font-medium">Mnt</div>
              </div>
              <div className="bg-white/10 rounded-xl px-2 py-1.5 min-w-12">
                <div className="text-base sm:text-lg font-black tracking-tight text-amber-300">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[9px] uppercase text-white/75 font-medium">Dtk</div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                soundManager.playTapSound();
                setShowQrCheckinModal(true);
              }}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-md hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <QrCode className="w-4 h-4 text-purple-700" />
              <span>Scan Tamu</span>
            </button>

            <button
              onClick={() => {
                soundManager.playTapSound();
                setShowPublicPreview(true);
              }}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-md active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>

            <button
              onClick={triggerCelebration}
              title="Rayakan Acara Ini"
              className="p-2 bg-amber-400/30 hover:bg-amber-400/50 border border-amber-300/40 text-amber-200 hover:text-white rounded-xl active:scale-90 transition-all flex items-center justify-center"
              aria-label="Rayakan dengan Confetti"
            >
              <PartyPopper className="w-4 h-4" />
            </button>

            <button
              onClick={copyEventLink}
              title="Salin Tautan Undangan"
              className="p-2 bg-white/20 hover:bg-white/30 border border-white/20 text-white rounded-xl active:scale-90 transition-all flex items-center justify-center"
              aria-label="Salin Tautan"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown for Visual Atmosphere (Mood) Palette */}
      {showMoodSelector && (
        <div className="mt-4 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="text-xs font-bold text-white/90">Ganti Suasana Visual Aplikasi & Tema Acara:</div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(THEME_PRESETS) as ThemeMood[]).map((key) => {
              const preset = THEME_PRESETS[key];
              const isSelected = currentThemeMood === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    soundManager.playTapSound();
                    onSelectThemeMood(key);
                    showToast(`✨ Suasana visual diubah ke ${preset.name}`);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-md ring-2 ring-white/80 scale-105'
                      : 'bg-black/25 hover:bg-black/40 text-white/90 border border-white/10'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accentColor }} />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
