export type ThemeMood = 'indigo' | 'rose' | 'emerald' | 'amber' | 'luxe';

export interface ThemeConfig {
  id: ThemeMood;
  name: string;
  tagline: string;
  heroGradient: string;
  accentColor: string;
  accentBg: string;
  badgeBg: string;
  badgeText: string;
  activeTabGlow: string;
  borderColor: string;
  glowColor: string;
  buttonClass: string;
}

export const THEME_PRESETS: Record<ThemeMood, ThemeConfig> = {
  indigo: {
    id: 'indigo',
    name: 'Royal Indigo',
    tagline: 'Elegan & Modern',
    heroGradient: 'from-[#3b1578] via-[#6d28d9] to-[#4338ca]',
    accentColor: '#6d28d9',
    accentBg: 'bg-purple-50',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    activeTabGlow: 'bg-purple-600 shadow-purple-200',
    borderColor: 'border-purple-200',
    glowColor: 'rgba(109, 40, 217, 0.25)',
    buttonClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white',
  },
  rose: {
    id: 'rose',
    name: 'Romantic Rose',
    tagline: 'Romantis & Lembut',
    heroGradient: 'from-[#831843] via-[#db2777] to-[#f43f5e]',
    accentColor: '#db2777',
    accentBg: 'bg-pink-50',
    badgeBg: 'bg-pink-100',
    badgeText: 'text-pink-800',
    activeTabGlow: 'bg-pink-600 shadow-pink-200',
    borderColor: 'border-pink-200',
    glowColor: 'rgba(219, 39, 119, 0.25)',
    buttonClass: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Botanic',
    tagline: 'Segar & Alami',
    heroGradient: 'from-[#064e3b] via-[#059669] to-[#0d9488]',
    accentColor: '#059669',
    accentBg: 'bg-emerald-50',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    activeTabGlow: 'bg-emerald-600 shadow-emerald-200',
    borderColor: 'border-emerald-200',
    glowColor: 'rgba(5, 150, 105, 0.25)',
    buttonClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Terracotta',
    tagline: 'Hangat & Mewah',
    heroGradient: 'from-[#7c2d12] via-[#ea580c] to-[#d97706]',
    accentColor: '#ea580c',
    accentBg: 'bg-amber-50',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    activeTabGlow: 'bg-amber-600 shadow-amber-200',
    borderColor: 'border-amber-200',
    glowColor: 'rgba(234, 88, 12, 0.25)',
    buttonClass: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white',
  },
  luxe: {
    id: 'luxe',
    name: 'Midnight & Gold',
    tagline: 'Eksklusif & Glamor',
    heroGradient: 'from-[#0f172a] via-[#1e293b] to-[#b45309]',
    accentColor: '#d97706',
    accentBg: 'bg-slate-100',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    activeTabGlow: 'bg-amber-600 shadow-amber-200',
    borderColor: 'border-amber-300',
    glowColor: 'rgba(217, 119, 6, 0.25)',
    buttonClass: 'bg-gradient-to-r from-slate-900 to-amber-700 hover:from-slate-800 hover:to-amber-600 text-white',
  },
};
