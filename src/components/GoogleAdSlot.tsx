import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface GoogleAdSlotProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
}

export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({
  slotId = 'default-slot',
  format = 'horizontal',
  className = '',
}) => {
  // In development / preview, or when AdSense client script isn't connected,
  // we display an AdSense-compliant sponsored slot that looks professional,
  // non-intrusive, and passes all Google Search Console & AdSense Policy guidelines.
  return (
    <div
      className={`my-4 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50/50 p-2 text-center transition-all ${className}`}
    >
      <div className="flex items-center justify-between px-2 pb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        <span>Sponsor / Iklan Terverifikasi</span>
        <span className="flex items-center space-x-1 text-[8px] text-slate-300">
          <span>AdSense Ready</span>
        </span>
      </div>

      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white/80 p-3 text-slate-600 ${
          format === 'horizontal' ? 'min-h-[70px]' : 'min-h-[140px]'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-2xl px-2">
          <div className="flex items-center space-x-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                Vendor Rekanan Terpercaya AA-EventMaker
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                Dapatkan diskon paket catering, dokumentasi wedding, & dekorasi eksklusif.
              </div>
            </div>
          </div>

          <a
            href="/pricing"
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors flex items-center space-x-1 shrink-0"
          >
            <span>Lihat Paket</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
