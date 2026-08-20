import React from 'react';

interface BrandLogoBadgeProps {
  brand: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogoBadge: React.FC<BrandLogoBadgeProps> = ({
  brand,
  className = '',
  size = 'md',
}) => {
  const normalized = brand.toLowerCase().trim();

  const sizeClasses = {
    sm: 'h-6 px-2 text-[10px]',
    md: 'h-7 px-2.5 text-[11px]',
    lg: 'h-9 px-3 text-xs',
  };

  // Dedicated SVG & styled representations for Indian Brands
  if (normalized.includes('tata')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-sky-950 text-white rounded-lg border border-sky-700 font-bold ${sizeClasses[size]} ${className}`}>
        <svg className="w-4 h-4 shrink-0 fill-sky-400" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
        <span className="font-mono tracking-wider text-sky-200">TATA<span className="text-teal-400 font-black">.ev</span></span>
      </div>
    );
  }

  if (normalized.includes('mahindra')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-red-950 text-white rounded-lg border border-red-700 font-bold ${sizeClasses[size]} ${className}`}>
        <svg className="w-4 h-4 shrink-0 fill-red-500" viewBox="0 0 24 24">
          <path d="M4 19h16v-2H4v2zm2-4h12v-2H6v2zm3-4h6V9H9v2zm3-7L6 7h12l-6-3z" />
        </svg>
        <span className="tracking-widest font-black text-red-100">MAHINDRA <span className="text-amber-400 text-[10px]">⚡</span></span>
      </div>
    );
  }

  if (normalized.includes('ola')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-black text-white rounded-lg border border-emerald-500/50 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-600 shrink-0 animate-pulse"></span>
        <span className="tracking-widest font-black text-white font-mono">OLA <span className="text-emerald-400 font-normal">ELECTRIC</span></span>
      </div>
    );
  }

  if (normalized.includes('ather')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-lg border border-amber-500/40 font-bold ${sizeClasses[size]} ${className}`}>
        <svg className="w-3.5 h-3.5 shrink-0 fill-amber-400" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="tracking-widest font-black text-slate-100 font-mono">ATHER</span>
      </div>
    );
  }

  if (normalized.includes('tvs')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-blue-950 text-white rounded-lg border border-blue-600 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="px-1 py-0.2 bg-red-600 text-white text-[9px] font-black rounded">TVS</span>
        <span className="tracking-wider font-bold text-blue-200">ELECTRIC</span>
      </div>
    );
  }

  if (normalized.includes('bajaj') || normalized.includes('chetak')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-blue-900 text-white rounded-lg border border-blue-400/50 font-bold ${sizeClasses[size]} ${className}`}>
        <svg className="w-3.5 h-3.5 shrink-0 fill-amber-300" viewBox="0 0 24 24">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
        <span className="tracking-wider font-black text-amber-200 font-serif">CHETAK</span>
      </div>
    );
  }

  if (normalized.includes('ultraviolette')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-purple-950 text-white rounded-lg border border-purple-600 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="w-2.5 h-2.5 bg-violet-400 rotate-45 shrink-0"></span>
        <span className="tracking-widest font-black text-purple-200 font-mono">UV F77</span>
      </div>
    );
  }

  if (normalized.includes('revolt')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-zinc-900 text-white rounded-lg border border-red-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
        <span className="tracking-wider font-black text-white font-mono">REVOLT <span className="text-red-400 text-[10px]">AI</span></span>
      </div>
    );
  }

  if (normalized.includes('hero') || normalized.includes('vida')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-orange-950 text-white rounded-lg border border-orange-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="px-1 bg-red-600 text-white text-[9px] font-black rounded">HERO</span>
        <span className="tracking-widest font-black text-orange-300 font-mono">VIDA</span>
      </div>
    );
  }

  if (normalized.includes('simple')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-lg border border-cyan-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="w-2 h-2 bg-cyan-400 rounded-full shrink-0"></span>
        <span className="tracking-widest font-black text-cyan-300 font-mono">SIMPLE ONE</span>
      </div>
    );
  }

  if (normalized.includes('river')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-amber-950 text-white rounded-lg border border-amber-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="px-1.5 py-0.2 bg-amber-500 text-black text-[9px] font-black rounded">RIVER</span>
        <span className="tracking-wider font-bold text-amber-200">INDIE</span>
      </div>
    );
  }

  if (normalized.includes('matter')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-zinc-950 text-white rounded-lg border border-emerald-600 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs shrink-0"></span>
        <span className="tracking-widest font-black text-emerald-400 font-mono">MATTER AERA</span>
      </div>
    );
  }

  if (normalized.includes('tork')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-red-950 text-white rounded-lg border border-red-600 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="tracking-widest font-black text-red-300 font-mono">TORK KRATOS</span>
      </div>
    );
  }

  if (normalized.includes('oben')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-lg border border-yellow-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="tracking-widest font-black text-yellow-300 font-mono">OBEN RORR</span>
      </div>
    );
  }

  if (normalized.includes('euler')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-emerald-950 text-white rounded-lg border border-emerald-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="px-1.5 py-0.2 bg-emerald-500 text-black text-[9px] font-black rounded">EULER</span>
        <span className="tracking-wider font-mono text-emerald-300 text-[10px]">HILOAD CARGO</span>
      </div>
    );
  }

  if (normalized.includes('switch') || normalized.includes('ashok')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-blue-950 text-white rounded-lg border border-cyan-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="px-1.5 py-0.2 bg-cyan-400 text-black text-[9px] font-black rounded">SWITCH</span>
        <span className="tracking-wider font-mono text-cyan-200 text-[10px]">ASHOK LEYLAND</span>
      </div>
    );
  }

  if (normalized.includes('bounce')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-yellow-950 text-white rounded-lg border border-yellow-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 text-black font-black text-[8px] flex items-center justify-center">∞</span>
        <span className="tracking-wider font-black text-yellow-300 font-mono">BOUNCE INFINITY</span>
      </div>
    );
  }

  if (normalized.includes('kinetic')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-emerald-900 text-white rounded-lg border border-emerald-400 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="tracking-wider font-black text-emerald-200">KINETIC E-LUNA</span>
      </div>
    );
  }

  if (normalized.includes('pure')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-indigo-950 text-white rounded-lg border border-indigo-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="tracking-widest font-black text-indigo-300 font-mono">PURE EV</span>
      </div>
    );
  }

  if (normalized.includes('komaki')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-lg border border-rose-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="tracking-wider font-black text-rose-300 font-mono">KOMAKI</span>
      </div>
    );
  }

  if (normalized.includes('mg') || normalized.includes('morris')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-red-950 text-white rounded-lg border border-red-500 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[9px] font-black">MG</span>
        <span className="tracking-wider font-black text-red-200 font-mono">MG .EV</span>
      </div>
    );
  }

  if (normalized.includes('hyundai')) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-blue-950 text-white rounded-lg border border-blue-400 font-bold ${sizeClasses[size]} ${className}`}>
        <span className="font-serif italic font-black text-blue-400 text-xs">H</span>
        <span className="tracking-widest font-bold text-blue-100 font-mono">HYUNDAI IONIQ</span>
      </div>
    );
  }

  // Fallback Clean Brand Badge
  return (
    <div className={`inline-flex items-center gap-1 bg-slate-900 text-white rounded-lg border border-slate-700 font-bold ${sizeClasses[size]} ${className}`}>
      <span className="tracking-wider font-black uppercase text-slate-200">{brand}</span>
    </div>
  );
};
