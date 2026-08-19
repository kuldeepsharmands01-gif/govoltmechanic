import React from 'react';
import { Wrench, Download, Calendar, ShieldCheck, MapPin, Sparkles, Star, ChevronRight, Zap, Flame } from 'lucide-react';

interface HomeHeroBannerProps {
  onOpenBooking: () => void;
  onOpenDownloadApp: () => void;
  onOpenSOS?: () => void;
}

export const HomeHeroBanner: React.FC<HomeHeroBannerProps> = ({
  onOpenBooking,
  onOpenDownloadApp,
  onOpenSOS,
}) => {
  return (
    <section
      id="home-hero-banner"
      className="relative overflow-hidden rounded-3xl border border-red-600/40 bg-gradient-to-br from-[#120406] via-[#090304] to-[#040102] p-6 sm:p-8 lg:p-10 shadow-[0_0_40px_rgba(220,38,38,0.25)]"
    >
      {/* Background Reddish Ambient Glow and Radial Light */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 bg-rose-700/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.15),transparent_60%)] pointer-events-none"></div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#ef4444_1px,transparent_1px),linear-gradient(to_bottom,#ef4444_1px,transparent_1px)] bg-[size:32px_32px]"
      ></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left / Main Content Column */}
        <div className="max-w-3xl space-y-4">
          {/* Eyebrow Badge (India's #1 Doorstep Bike Service App) in Black & Redish theme */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/70 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-red-200 font-mono">
              India's #1 Doorstep Bike Service App
            </span>
          </div>

          {/* Main Title & Price Callout */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Bike Mechanic Near You, at Home
            </h1>

            {/* Price Pill Highlight */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-red-600/30 via-red-500/20 to-black border border-red-500/50">
              <span className="text-xs font-bold text-red-300 uppercase tracking-widest">Doorstep</span>
              <span className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 font-mono">
                Service from ₹450
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">| Zero Visiting Fee</span>
            </div>
          </div>

          {/* Subtitle / Description strictly matching user prompt */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Searching for a bike mechanic near you? <strong className="text-white font-bold">GoVoltMechanic</strong> brings the workshop to your doorstep — book bike and car service or repair online and save time &amp; money, across <span className="text-red-300 font-semibold underline decoration-red-500/40">Uttar Pradesh</span>, <span className="text-red-300 font-semibold underline decoration-red-500/40">Gurgaon</span> &amp; <span className="text-red-300 font-semibold underline decoration-red-500/40">Delhi NCR</span>.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            {/* 1. Book Service Now Button */}
            <button
              id="hero-book-service-now-btn"
              onClick={onOpenBooking}
              className="px-6 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:shadow-[0_0_35px_rgba(220,38,38,0.9)] active:scale-95 flex items-center justify-center gap-2.5 group"
            >
              <Wrench className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span>Book Service Now</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* 2. Download App Button */}
            <button
              id="hero-download-app-btn"
              onClick={onOpenDownloadApp}
              className="px-6 py-3.5 bg-black/80 hover:bg-red-950/40 text-white hover:text-red-200 border border-red-500/50 hover:border-red-400 font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] active:scale-95 flex items-center justify-center gap-2.5"
            >
              <Download className="w-4 h-4 text-red-400" />
              <span>Download App</span>
            </button>

            {/* Optional Roadside Emergency link */}
            {onOpenSOS && (
              <button
                onClick={onOpenSOS}
                className="px-4 py-3.5 text-xs text-red-400 hover:text-red-300 font-mono font-bold flex items-center gap-1.5 transition-colors underline decoration-red-500/30"
              >
                <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>Roadside Breakdown SOS?</span>
              </button>
            )}
          </div>
        </div>

        {/* Right / Service Metric Badges Column in Black & Red styling */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
          {/* Card 1: 30-Min Rapid Doorstep Arrival */}
          <div className="flex-1 lg:w-72 bg-black/70 border border-red-900/50 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fastest Reach</p>
              <p className="text-xs font-bold text-white">UP • Gurgaon • Delhi NCR</p>
              <p className="text-[10px] text-red-400 font-mono font-bold">~30 Min Doorstep Van</p>
            </div>
          </div>

          {/* Card 2: 10-Day Warranty & Fixed Pricing */}
          <div className="flex-1 lg:w-72 bg-black/70 border border-red-900/50 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Service Guarantee</p>
              <p className="text-xs font-bold text-white">10-Day Free Rework</p>
              <p className="text-[10px] text-slate-400 font-mono">100% Genuine OEM Spares</p>
            </div>
          </div>

          {/* Card 3: Rating Badge */}
          <div className="flex-1 lg:w-72 bg-black/70 border border-red-900/50 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Top Rated Across India</p>
              <p className="text-xs font-bold text-white">4.9 / 5 Stars</p>
              <p className="text-[10px] text-slate-400 font-mono">1,00,000+ Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
