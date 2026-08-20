import React from 'react';
import { ShieldCheck, Wrench, Zap, Clock, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import precisionCareBanner from '../assets/images/precision_care_banner_1787235682649.jpg';

interface PrecisionCareWideBannerProps {
  onOpenBooking: () => void;
  onOpenSOS?: () => void;
}

export const PrecisionCareWideBanner: React.FC<PrecisionCareWideBannerProps> = ({
  onOpenBooking,
}) => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Background Image Container with Overlay */}
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[440px] overflow-hidden bg-black">
        <img
          src={precisionCareBanner}
          alt="Precision Care. Performance Everywhere."
          className="w-full h-full object-cover object-center opacity-85 hover:scale-102 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent sm:w-3/4"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-10">
          {/* Top Tag */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-600/90 text-white text-[11px] font-black uppercase tracking-widest rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              MASTER GARAGE CRAFT
            </span>
            <span className="px-3 py-1 bg-white/20 text-white text-[11px] font-mono font-bold uppercase rounded-full backdrop-blur-sm">
              ON-DEMAND MOBILE UNITS
            </span>
          </div>

          {/* Center / Lower Main Typography */}
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none">
              PRECISION CARE. <br />
              <span className="text-red-500">PERFORMANCE EVERYWHERE.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-200 font-medium max-w-xl leading-relaxed">
              Driven by expertise. Built for performance. Advanced mobile workshop vans equipped with laser-calibrated tools, hydraulic lifts, and certified master technicians right at your doorstep.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Book Precision Workshop</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Highlights Bar */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/20 text-white/90">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-xs font-bold">100% Genuine OEM / OES Spares</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-xs font-bold">Live Transparent Front-of-Eye Repair</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-xs font-bold">30-Day Peace of Mind Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
