// components/TemplateCard.tsx
import React from 'react';

interface TemplateProps {
  id: string;
  title: string;
  category: 'Wedding' | 'Engagement' | 'Birthday' | 'Corporate';
  styleTag: string;
  thumbnailUrl?: string;
  gradientTheme: string;
  demoData?: {
    coupleNames: string;
    date: string;
  };
  onPreview: (id: string) => void;
  onUse: (id: string) => void;
}

export const TemplateCard: React.FC<TemplateProps> = ({
  id,
  title,
  category,
  styleTag,
  thumbnailUrl,
  gradientTheme,
  demoData = { coupleNames: "Romeo & Juliet", date: "12 . 12 . 2026" },
  onPreview,
  onUse,
}) => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Area Preview Mockup Undangan */}
      <div className={`relative h-64 w-full p-6 flex flex-col justify-between ${gradientTheme} overflow-hidden`}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Mini Mockup Visual jika belum ada screenshot template */
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white/90 border border-white/20 rounded-xl p-4 backdrop-blur-sm bg-black/20">
            <span className="text-xs tracking-widest uppercase text-amber-200 mb-1 font-medium">
              Save The Date
            </span>
            <h4 className="font-serif text-xl font-bold tracking-wide">
              {demoData.coupleNames}
            </h4>
            <div className="w-12 h-px bg-white/40 my-2" />
            <p className="text-xs font-light tracking-wider">{demoData.date}</p>
          </div>
        )}

        {/* Badge Kategori & Style */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
            {category}
          </span>
          <span className="text-[11px] font-bold tracking-wider uppercase text-white/80">
            {styleTag}
          </span>
        </div>
      </div>

      {/* Bagian Kontrol & Informasi */}
      <div className="p-4 bg-neutral-900 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-xs text-neutral-400">Siap kustomisasi & export</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPreview(id)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 transition"
          >
            Preview
          </button>
          <button
            onClick={() => onUse(id)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
          >
            Gunakan
          </button>
        </div>
      </div>
    </div>
  );
};
