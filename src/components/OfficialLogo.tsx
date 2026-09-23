import React from 'react';

interface OfficialLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
  showSubtitle?: boolean;
}

export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  size = 'md',
  variant = 'light',
  showSubtitle = true,
}) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const titleSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm';
  const subtitleSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  const isLight = variant === 'light';

  return (
    <div className="flex items-center space-x-3 select-none">
      {/* Official Eco-Stewardship & Waste Transformation Emblem */}
      <div className={`relative ${iconSize} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Medallion Background Gradient */}
            <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#041B0E" />
              <stop offset="50%" stopColor="#09351C" />
              <stop offset="100%" stopColor="#0F4C2A" />
            </linearGradient>

            {/* Prestige Golden Rim Gradient */}
            <linearGradient id="logoGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="45%" stopColor="#FACC15" />
              <stop offset="85%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>

            {/* Left Leaf Fresh Emerald Gradient */}
            <linearGradient id="leafGradLeft" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>

            {/* Right Leaf Jade Gradient */}
            <linearGradient id="leafGradRight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>

            {/* Caring Protective Hands Gradient */}
            <linearGradient id="handGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Circular Eco Cycle Gradient */}
            <linearGradient id="cycleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* 1. Outer Medallion: Forest Green with Gold Filigree Rim */}
          <circle
            cx="32"
            cy="32"
            r="28.5"
            fill="url(#logoBgGrad)"
            stroke="url(#logoGoldRim)"
            strokeWidth="2"
          />

          {/* Inner subtle concentric guideline */}
          <circle
            cx="32"
            cy="32"
            r="25.5"
            fill="none"
            stroke="#34D399"
            strokeWidth="0.6"
            strokeOpacity="0.45"
            strokeDasharray="2.5 1.5"
          />

          {/* 2. Circular Waste Reduction & Recycling Arrows (Simbol Sirkularitas Bebas Sampah) */}
          {/* Top-Right Arc with Arrowhead (turning waste into green resources) */}
          <path
            d="M20 18C23.5 14.5 28 12.5 33 12.5C40 12.5 46.2 16.8 48.5 23"
            stroke="url(#cycleGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M49.5 20.5L48.5 24.5L44.5 24"
            stroke="url(#cycleGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom-Right to Left Arc with Arrowhead */}
          <path
            d="M48 29C49 33.5 47.8 38 44.5 42C41.5 45.5 37 47.5 32 47.8"
            stroke="url(#cycleGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M34 46L30.5 48L33.5 50.5"
            stroke="url(#cycleGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Upward Arc with Arrowhead */}
          <path
            d="M27 48C21.5 46 17 41.5 15.5 35.5C14.5 31.5 15.2 27 17.5 23.5"
            stroke="url(#cycleGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15.5 25.5L18 22L20.5 25"
            stroke="url(#cycleGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3. Caring Protective Hands (Sepasang Tangan Peduli Merengkuh & Melestarikan Lingkungan) */}
          {/* Left Protective Caring Hand */}
          <path
            d="M17 38.5C17 44.5 22.5 48.5 29 48.5C30.5 48.5 31.8 48 32.2 47.2C29.5 46.5 25 44 22.2 40.5C20.2 37.5 19.5 33.8 20 29.5C17.8 32.2 17 35.2 17 38.5Z"
            fill="url(#handGlow)"
            opacity="0.95"
          />
          {/* Right Protective Caring Hand */}
          <path
            d="M47 38.5C47 44.5 41.5 48.5 35 48.5C33.5 48.5 32.2 48 31.8 47.2C34.5 46.5 39 44 41.8 40.5C43.8 37.5 44.5 33.8 44 29.5C46.2 32.2 47 35.2 47 38.5Z"
            fill="url(#handGlow)"
            opacity="0.95"
          />

          {/* 4. Flourishing Living Sprout & Healthy Earth (Bumi Hijau Tumbuh Lestari Tanpa Sampah) */}
          {/* Central Stem of Life */}
          <path
            d="M32 45.5C32 39 32 30 32 21"
            stroke="#A7F3D0"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Left Primary Leaf (Daun Kehidupan Pertama) */}
          <path
            d="M32 33.5C23.5 33.5 18 26.5 21 19.5C27 18.5 32 24.5 32 33.5Z"
            fill="url(#leafGradLeft)"
          />
          {/* Left Leaf Midrib Vein */}
          <path
            d="M32 33.5C28 29.5 24 25.5 23 21"
            stroke="#ECFDF5"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Right Primary Leaf (Daun Kehidupan Kedua) */}
          <path
            d="M32 29C39.5 29 45 22.5 43 15C36 14 31.5 20.5 32 29Z"
            fill="url(#leafGradRight)"
          />
          {/* Right Leaf Midrib Vein */}
          <path
            d="M32 29C35.5 25 39 20.5 40 16.5"
            stroke="#ECFDF5"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Center Golden Shoot Bud (Tunas Emas Harapan & Komitmen Bersama) */}
          <path
            d="M32 22.5C30.8 18 31.2 14.5 32 11C32.8 14.5 33.2 18 32 22.5Z"
            fill="#FACC15"
          />

          {/* Sparkle of Fresh Clean Air & Sunlight */}
          <polygon
            points="42,12 43,9.5 45.5,8.5 43,7.5 42,5 41,7.5 38.5,8.5 41,9.5"
            fill="#FDE047"
            opacity="0.9"
          />

          {/* 5. Indonesian National Pride Foundation: Merah Putih Ribbon Accent */}
          <g transform="translate(0, 0)">
            {/* Red Bar (Left) */}
            <path
              d="M23 52.5C25.8 53.8 28.8 54.4 32 54.4V52.2C29.2 52.2 26.5 51.7 24 50.8L23 52.5Z"
              fill="#EF4444"
            />
            {/* White Bar (Right) */}
            <path
              d="M32 54.4C35.2 54.4 38.2 53.8 41 52.5L40 50.8C37.5 51.7 34.8 52.2 32 52.2V54.4Z"
              fill="#F8FAFC"
            />
          </g>
        </svg>
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center space-x-1.5">
          <span className={`font-black tracking-tight ${titleSize} ${isLight ? 'text-white' : 'text-[#0E3B24]'}`}>
            SISTEM GVMS
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
            isLight 
              ? 'bg-emerald-950/80 text-[#6EE7B7] border-emerald-500/50' 
              : 'bg-[#EBF5EE] text-[#0E3B24] border-[#0E3B24]/20'
          }`}>
            LKPP &bull; KLHK
          </span>
        </div>
        {showSubtitle && (
          <span className={`${subtitleSize} font-medium tracking-wide ${isLight ? 'text-emerald-200/85' : 'text-slate-600'}`}>
            Kalkulator Green Value-for-Money Pengadaan Sampah
          </span>
        )}
      </div>
    </div>
  );
};
