import React, { useState } from 'react';
import { ShieldCheck, Star, Users, Award, ChevronRight, Sparkles, CheckCircle2, Wrench } from 'lucide-react';

interface TrustedBrandsSectionProps {
  onSelectBrandForService?: (brandName: string) => void;
  onOpenBooking?: () => void;
}

interface BrandItem {
  id: string;
  name: string;
  serviceTitle: string;
  category: string;
  popularModels: string[];
  tagline: string;
  badgeColor: string;
  accentBorder: string;
  bgGradient: string;
  logoBg: string;
  logoColor: string;
  logoIconText: string;
  specialty: string;
}

export const BRAND_SERVICES: BrandItem[] = [
  {
    id: 'honda',
    name: 'Honda',
    serviceTitle: 'Honda bike service',
    category: 'Motorcycles & Scooters',
    popularModels: ['Activa 6G / 125', 'Shine 125', 'CB350 H\'ness', 'Hornet 2.0', 'Unicorn'],
    tagline: 'Precision PGM-Fi tuning & OEM maintenance',
    badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30',
    accentBorder: 'hover:border-red-500/50',
    bgGradient: 'from-red-950/20 via-[#0D0E15] to-[#0D0E15]',
    logoBg: 'bg-red-600/20 text-red-400 border-red-500/30',
    logoColor: 'text-red-500',
    logoIconText: 'HONDA',
    specialty: 'Activa & CB Specialist',
  },
  {
    id: 'hero',
    name: 'Hero',
    serviceTitle: 'Hero bike service',
    category: 'Commuter & Performance',
    popularModels: ['Splendor Plus', 'HF Deluxe', 'Vida V1 Pro EV', 'Xpulse 200 4V', 'Glamour'],
    tagline: 'i3S technology calibration & full doorstep service',
    badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30',
    accentBorder: 'hover:border-red-500/50',
    bgGradient: 'from-red-950/20 via-[#0D0E15] to-[#0D0E15]',
    logoBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    logoColor: 'text-red-400',
    logoIconText: 'HERO',
    specialty: 'Splendor & Vida EV certified',
  },
  {
    id: 'bajaj',
    name: 'Bajaj',
    serviceTitle: 'Bajaj bike service',
    category: 'Pulsar & Chetak Series',
    popularModels: ['Pulsar NS200 / 150', 'Chetak EV', 'Dominar 400', 'Platina 110', 'Avenger'],
    tagline: 'DTS-i dual spark diagnostics & Chetak EV BMS audit',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    accentBorder: 'hover:border-blue-500/50',
    bgGradient: 'from-blue-950/20 via-[#0D0E15] to-[#0D0E15]',
    logoBg: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    logoColor: 'text-blue-500',
    logoIconText: 'BAJAJ',
    specialty: 'DTS-i & Chetak EV Ready',
  },
  {
    id: 'tvs',
    name: 'TVS',
    serviceTitle: 'TVS bike service',
    category: 'Apache & iQube EV',
    popularModels: ['Apache RTR 160/200 4V', 'iQube Electric', 'Jupiter 125', 'Ntorq 125', 'Ronin'],
    tagline: 'Race-tuned RT-Fi diagnostic & iQube battery test',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    accentBorder: 'hover:border-blue-500/50',
    bgGradient: 'from-blue-950/20 via-[#0D0E15] to-[#0D0E15]',
    logoBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    logoColor: 'text-blue-400',
    logoIconText: 'TVS',
    specialty: 'Apache & iQube Specialized',
  },
  {
    id: 'yamaha',
    name: 'Yamaha',
    serviceTitle: 'Yamaha bike service',
    category: 'Supersport & Street',
    popularModels: ['YZF-R15 V4', 'MT-15 V2', 'Aerox 155', 'FZS-Fi V4', 'RayZR 125'],
    tagline: 'VVA valve clearance & fuel injection tuning',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    accentBorder: 'hover:border-indigo-500/50',
    bgGradient: 'from-indigo-950/20 via-[#0D0E15] to-[#0D0E15]',
    logoBg: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
    logoColor: 'text-indigo-500',
    logoIconText: 'YAMAHA',
    specialty: 'R15 & MT Performance Care',
  },
  {
    id: 'suzuki',
    name: 'Suzuki',
    serviceTitle: 'Suzuki bike service',
    category: 'Gixxer & Access Specialist',
    popularModels: ['Access 125', 'Burgman Street 125', 'Gixxer SF 250', 'Avenis 125', 'V-Strom SX'],
    tagline: 'SEP eco-performance engine de-carb & brake overhaul',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    accentBorder: 'hover:border-sky-500/50',
    bgGradient: 'from-sky-950/20 via-[#0D0E15] to-[#0D0E15]',
    logoBg: 'bg-sky-600/20 text-sky-400 border-sky-500/30',
    logoColor: 'text-sky-500',
    logoIconText: 'SUZUKI',
    specialty: 'Access & Burgman Expert',
  },
  {
    id: 'royal-enfield',
    name: 'Royal Enfield',
    serviceTitle: 'Royal Enfield bike service',
    category: 'Cruiser & Adventure',
    popularModels: ['Classic 350', 'Hunter 350', 'Himalayan 450', 'Meteor 350', 'Interceptor 650'],
    tagline: 'J-Series engine oil flushing, tappet adjustment & chain set',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    accentBorder: 'hover:border-amber-500/50',
    bgGradient: 'from-amber-950/20 via-[#0D0E15] to-[#0D0E15]',
    logoBg: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
    logoColor: 'text-amber-500',
    logoIconText: 'RE',
    specialty: 'Classic & Himalayan Care',
  },
  {
    id: 'ktm',
    name: 'KTM',
    serviceTitle: 'KTM bike service',
    category: 'Ready to Race Performance',
    popularModels: ['Duke 390 / 250 / 200', 'RC 390 / 200', '390 Adventure', 'Duke 125'],
    tagline: 'High-compression coolant flush & WP suspension overhaul',
    badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    accentBorder: 'hover:border-orange-500/50',
    bgGradient: 'from-orange-950/20 via-[#0D0E15] to-[#0D0E15]',
    logoBg: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
    logoColor: 'text-orange-500',
    logoIconText: 'KTM',
    specialty: 'Duke & RC Track Spec',
  },
  {
    id: 'vespa',
    name: 'Vespa',
    serviceTitle: 'Vespa bike service',
    category: 'Italian Heritage Scooters',
    popularModels: ['Vespa VXL 150/125', 'SXL 150', 'Elettrica', 'ZX 125', 'Aprilia SR 160'],
    tagline: 'Monocoque body care, CVT belt & Italian disc brakes',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    accentBorder: 'hover:border-emerald-500/50',
    bgGradient: 'from-emerald-950/20 via-[#0D0E15] to-[#0D0E15]',
    logoBg: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    logoColor: 'text-emerald-500',
    logoIconText: 'VESPA',
    specialty: 'Monocoque & CVT Precision',
  },
  {
    id: 'mahindra',
    name: 'Mahindra',
    serviceTitle: 'Mahindra bike service',
    category: 'Mojo, Jawa & Yezdi Fleet',
    popularModels: ['Mojo 300', 'Jawa 42', 'Yezdi Adventure', 'Yezdi Roadster', 'Gusto'],
    tagline: 'DOHC liquid-cooled engine servicing & wire harness diagnostics',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    accentBorder: 'hover:border-rose-500/50',
    bgGradient: 'from-rose-950/20 via-[#0D0E15] to-[#0D0E15]',
    logoBg: 'bg-rose-600/20 text-rose-400 border-rose-500/30',
    logoColor: 'text-rose-500',
    logoIconText: 'MAHINDRA',
    specialty: 'Mojo, Jawa & Yezdi Support',
  },
];

export const TrustedBrandsSection: React.FC<TrustedBrandsSectionProps> = ({
  onSelectBrandForService,
  onOpenBooking,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const handleCardClick = (brand: BrandItem) => {
    setSelectedBrand(brand.id);
    if (onSelectBrandForService) {
      onSelectBrandForService(brand.name);
    } else if (onOpenBooking) {
      onOpenBooking();
    }
  };

  return (
    <section id="trusted-brands-section" className="w-full space-y-6 pt-4">
      {/* Top Banner Header with Primary Statement */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0e1320] via-[#0D0E15] to-[#0a0c13] border border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Glow ambient decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-black uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>PAN-INDIA DOORSTEP TWO-WHEELER NETWORK</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Trusted by Top Brands &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
              1,00,000+ People
            </span>{' '}
            Across India
          </h2>

          {/* Description copy strictly matching user intent */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            <strong className="text-white font-bold">GoVoltMechanic</strong> provides bike repair services at home for motorcycles of all models and brands including Honda, Suzuki, Hero, Vespa, Yamaha, TVS, Bajaj, and more with certified doorstep mechanics, genuine OEM spare parts, and 10-day warranty assurance.
          </p>

          {/* Key Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-xl">
              <Users className="w-4 h-4 text-cyan-400" />
              <span><strong className="text-white font-mono">1,00,000+</strong> Happy Riders</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-xl">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span><strong className="text-white font-mono">4.9 / 5</strong> Service Rating</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span><strong className="text-white">10-Day / 1000 KM</strong> Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-xl">
              <Award className="w-4 h-4 text-cyan-400" />
              <span><strong className="text-white">100% Genuine</strong> OEM Spares</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 10 Brand Cards with Logos & Service Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Authorized Doorstep Repair &amp; Service by Brand</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select any brand to book certified home mechanics equipped with mobile workshop tools.
            </p>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            10 Brands Supported
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {BRAND_SERVICES.map((brand) => {
            const isSelected = selectedBrand === brand.id;
            return (
              <div
                key={brand.id}
                id={`brand-card-${brand.id}`}
                onClick={() => handleCardClick(brand)}
                className={`group relative rounded-2xl p-4 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : `bg-gradient-to-b ${brand.bgGradient} border-white/10 ${brand.accentBorder} hover:shadow-xl hover:-translate-y-1`
                }`}
              >
                {/* Brand Header & Custom Logo */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {/* Brand Logo Emblem */}
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-black text-center shadow-md transition-transform group-hover:scale-105 ${brand.logoBg}`}
                    >
                      <span className="text-[10px] tracking-tighter leading-none font-mono font-black">
                        {brand.logoIconText}
                      </span>
                      <span className="text-[8px] opacity-70 mt-0.5 uppercase tracking-widest">OEM</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md border ${brand.badgeColor}`}
                    >
                      {brand.specialty}
                    </span>
                  </div>

                  {/* Brand Service Title */}
                  <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                    {brand.serviceTitle}
                  </h4>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {brand.tagline}
                  </p>

                  {/* Popular Models Tag List */}
                  <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1.5">
                    <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                      Popular Models Covered:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {brand.popularModels.slice(0, 2).map((model, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-slate-300 font-mono"
                        >
                          {model}
                        </span>
                      ))}
                      {brand.popularModels.length > 2 && (
                        <span className="px-1 py-0.5 text-[9px] text-slate-500 font-mono">
                          +{brand.popularModels.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA Button */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
                    Book Service <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="bg-[#0D0E15] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              100% Transparent Doorstep Service with Fixed Upfront Pricing
            </h4>
            <p className="text-[11px] text-slate-400">
              No hidden charges. Genuine spare parts with digital GST invoice and warranty certificate.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBooking}
          className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_#22d3ee] active:scale-95 shrink-0"
        >
          Book Doorstep Mechanic
        </button>
      </div>
    </section>
  );
};
