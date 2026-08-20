import React from 'react';
import govoltLogoImage from '../assets/images/govolt_logo_1785683916297.jpg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
  variant?: 'vector' | 'image';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtext = true,
  variant = 'vector',
}) => {
  if (variant === 'image') {
    const heights = {
      sm: 'h-8',
      md: 'h-11',
      lg: 'h-16',
    };
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <img
          src={govoltLogoImage}
          alt="GoVolt EV Service & Repair Doorstep Solutions"
          className={`${heights[size]} w-auto object-contain rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)]`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-4xl',
  };

  const subtextSizes = {
    sm: 'text-[7px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
  };

  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* GoVolt Emblem: Lightning Bolt + Crescent Wrench Arc */}
      <div className={`relative flex items-center justify-center ${emblemSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {/* Glowing Aura Backlight */}
        <div className="absolute inset-0 bg-red-500/10 blur-md rounded-full group-hover:bg-red-500/20 transition-all" />
        
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(220,38,38,0.3)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crescent Wrench Arc (Red Swoosh) */}
          <path
            d="M20 62 C 15 42, 35 18, 62 20 C 50 25, 32 38, 38 60 C 40 68, 50 78, 48 88 C 30 85, 22 75, 20 62 Z"
            fill="url(#swooshGradient)"
          />
          {/* Wrench Head Tip */}
          <path
            d="M38 72 C 34 76, 32 82, 35 88 C 42 86, 45 78, 40 72 Z"
            fill="#DC2626"
          />
          
          {/* Electric Lightning Bolt */}
          <path
            d="M62 8 L 28 50 L 48 50 L 22 92 L 78 42 L 56 42 Z"
            fill="url(#boltGradient)"
            stroke="#B91C1C"
            strokeWidth="1.5"
          />

          <defs>
            <linearGradient id="swooshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="50%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`${titleSizes[size]} font-black tracking-tight italic flex items-center`}>
          <span className="text-black">Go</span>
          <span className="text-red-600 ml-0.5">Volt</span>
        </div>

        {showSubtext && (
          <div className="flex flex-col mt-0.5 space-y-[1px]">
            <span className={`${subtextSizes[size]} font-extrabold uppercase tracking-[0.2em] text-slate-900`}>
              EV SERVICE & REPAIR
            </span>
            <span className={`${subtextSizes[size]} font-bold uppercase tracking-[0.18em] text-red-600`}>
              DOORSTEP SOLUTIONS
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
