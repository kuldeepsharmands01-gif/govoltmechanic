import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showBadge = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Cyberpunk Electric Mark */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-xl p-0.5 shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:shadow-[0_0_22px_rgba(34,211,238,0.8)] transition-all`}>
        <div className="w-full h-full bg-[#0A0B10] rounded-[10px] flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
          {/* Lightning Bolt & Wrench Icon */}
          <svg className="w-3/5 h-3/5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`${textSizes[size]} font-black tracking-tighter italic text-white flex items-center gap-1.5`}>
            GOVOLT<span className="text-cyan-400">MECHANIC</span>
          </span>
          {showBadge && (
            <span className="text-[10px] font-extrabold uppercase not-italic tracking-widest px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              ON-DEMAND EV
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default Logo;
