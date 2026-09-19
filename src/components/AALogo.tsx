import React from 'react';

interface AALogoProps {
  variant?: 'full' | 'header' | 'mark' | 'icon-light' | 'icon-dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const AALogo: React.FC<AALogoProps> = ({
  variant = 'header',
  size = 'md',
  className = '',
  onClick,
}) => {
  // SVG Graphic mark
  const MarkSVG = ({ isDarkBg = false }: { isDarkBg?: boolean }) => (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      className="w-full h-full drop-shadow-xs"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="aaMarkBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="aaMarkOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <linearGradient id="aaMarkSwooshB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDarkBg ? '#38bdf8' : '#1e3a8a'} />
          <stop offset="100%" stopColor={isDarkBg ? '#93c5fd' : '#38bdf8'} />
        </linearGradient>
        <linearGradient id="aaMarkSwooshO" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>
      </defs>

      {/* Left Blue Stylized 'A' */}
      <path
        d="M195 90 L115 315 H175 L192 265 H245 L260 215 H209 L220 180 L238 215 L275 125 Z"
        fill="url(#aaMarkBlue)"
      />

      {/* Right Orange Stylized 'A' overlapping */}
      <path
        d="M285 95 L225 315 H280 L295 265 H365 L382 315 H445 L365 95 H310 Z"
        fill="url(#aaMarkOrange)"
      />
      <polygon points="330,150 308,225 352,225" fill={isDarkBg ? '#091b3a' : '#ffffff'} />

      {/* Orbits / Swoosh rings */}
      <path
        d="M80 280 C 60 320, 110 365, 230 350 C 170 345, 120 325, 105 300 C 95 285, 110 265, 140 245 C 105 255, 85 265, 80 280 Z"
        fill="url(#aaMarkSwooshB)"
      />
      <path
        d="M90 280 C 120 330, 210 355, 310 330 C 230 345, 150 335, 110 295 C 100 285, 95 275, 90 280 Z"
        fill="url(#aaMarkSwooshB)"
      />
      <path
        d="M230 350 C 330 345, 410 300, 460 215 C 430 255, 360 295, 270 315 C 240 322, 230 335, 230 350 Z"
        fill="url(#aaMarkSwooshO)"
      />

      {/* Calendar Badge */}
      <g transform="translate(365, 75)">
        <rect x="0" y="8" width="68" height="64" rx="14" fill="#1d4ed8" />
        <rect x="0" y="8" width="68" height="18" rx="14" fill="#1e3a8a" />
        <rect x="0" y="20" width="68" height="6" fill="#1e3a8a" />
        <rect x="14" y="2" width="7" height="14" rx="3.5" fill="#ffffff" />
        <rect x="47" y="2" width="7" height="14" rx="3.5" fill="#ffffff" />
        <circle cx="19" cy="38" r="3.5" fill="#ffffff" />
        <circle cx="34" cy="38" r="3.5" fill="#ffffff" />
        <circle cx="49" cy="38" r="3.5" fill="#ffffff" />
        <circle cx="19" cy="54" r="3.5" fill="#ffffff" />
        <circle cx="34" cy="54" r="3.5" fill="#ffffff" />
        <circle cx="49" cy="54" r="3.5" fill="#ffffff" />
      </g>
    </svg>
  );

  // Height / size mapping
  const heightClasses = {
    xs: 'h-7',
    sm: 'h-9',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  };

  if (variant === 'mark') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center shrink-0 ${heightClasses[size]} aspect-square ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        <MarkSVG />
      </div>
    );
  }

  if (variant === 'icon-light') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center bg-white rounded-2xl p-2 shadow-md border border-slate-100 shrink-0 ${heightClasses[size]} aspect-square ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        <MarkSVG />
      </div>
    );
  }

  if (variant === 'icon-dark') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center bg-gradient-to-b from-[#0f2b5c] to-[#040d1e] rounded-2xl p-2 shadow-md shrink-0 ${heightClasses[size]} aspect-square ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        <MarkSVG isDarkBg />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className={`${heightClasses[size]} aspect-square`}>
            <MarkSVG />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-blue-700">
              AA-
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              EventMaker
            </span>
          </div>
        </div>
        <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center space-x-1.5">
          <span>Plan</span>
          <span className="text-orange-500 font-bold">•</span>
          <span>Manage</span>
          <span className="text-blue-600 font-bold">•</span>
          <span>Make It Happen</span>
        </div>
      </div>
    );
  }

  // Default 'header' variant
  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`${heightClasses[size]} aspect-square`}>
        <MarkSVG />
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline leading-none">
          <span className="font-black tracking-tight text-blue-700 text-base sm:text-lg">
            AA-
          </span>
          <span className="font-black tracking-tight text-slate-900 text-base sm:text-lg">
            EventMaker
          </span>
        </div>
        <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
          Event Management
        </span>
      </div>
    </div>
  );
};
