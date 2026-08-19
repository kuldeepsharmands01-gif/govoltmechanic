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
    badgeColor: 'text-red-700 bg-red-50 border-red-200',
    accentBorder: 'hover:border-red-500',
    bgGradient: 'bg-white',
    logoBg: 'bg-red-50 text-red-700 border-red-200',
    logoColor: 'text-red-600',
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
    badgeColor: 'text-red-700 bg-red-50 border-red-200',
    accentBorder: 'hover:border-red-500',
    bgGradient: 'bg-white',
    logoBg: 'bg-red-50 text-red-700 border-red-200',
    logoColor: 'text-red-600',
    logoIconText: 'HERO',
    specialty: 'Splendor & Vida EV certified',
  },
  {
    id: 'bajaj',
    name: 'Bajaj',
    serviceTitle: 'Bajaj bike service',
    category: 'Pulsar & Chetak Series',
    popularModels: ['Pulsar 150 / NS200', 'Chetak EV', 'Platina 110', 'Dominar 400', 'Avenger'],
    tagline: 'DTS-i engine tuning & Chetak EV BMS check',
    badgeColor: 'text-red-700 bg-red-50 border-red-200',
    accentBorder: 'hover:border-red-500',
    bgGradient: 'bg-white',
    logoBg: 'bg-red-50 text-red-700 border-red-200',
    logoColor: 'text-red-600',
    logoIconText: 'BAJAJ',
    specialty: 'Pulsar & Chetak EV Hub',
  },
  {
    id: 'tvs',
    name: 'TVS',
    serviceTitle: 'TVS bike service',
    category: 'Apache, Jupiter & iQube',
    popularModels: ['Apache RTR 160/200', 'Jupiter 110/125', 'iQube Electric', 'NTorq 125', 'Raider'],
    tagline: 'SmartXonnect diagnostic & RT-Fi synchronization',
    badgeColor: 'text-red-700 bg-red-50 border-red-200',
    accentBorder: 'hover:border-red-500',
    bgGradient: 'bg-white',
    logoBg: 'bg-red-50 text-red-700 border-red-200',
    logoColor: 'text-red-600',
    logoIconText: 'TVS',
    specialty: 'Apache & iQube EV Expert',
  },
  {
    id: 'yamaha',
    name: 'Yamaha',
    serviceTitle: 'Yamaha bike service',
    category: 'R15, MT & RayZR',
    popularModels: ['R15 V4', 'MT-15 V2', 'FZ-S Fi Hybrid', 'RayZR 125 Fi', 'Aerox 155'],
    tagline: 'VVA engine precision tuning & hybrid assist check',
    badgeColor: 'text-red-700 bg-red-50 border-red-200',
    accentBorder: 'hover:border-red-500',
    bgGradient: 'bg-white',
    logoBg: 'bg-red-50 text-red-700 border-red-200',
    logoColor: 'text-red-600',
    logoIconText: 'YAMAHA',
    specialty: 'R15 & MT Performance Care',
  },
  {
    id: 'suzuki',
    name: 'Suzuki',
    serviceTitle: 'Suzuki bike service',
    category: 'Access, Burgman & Gixxer',
    popularModels: ['Access 125', 'Burgman Street 125', 'Gixxer SF 250', 'Avenis 125', 'V-Strom SX'],
    tagline: 'SEP engine calibration & fuel injector ultrasonic clean',
    badgeColor: 'text-red-700 bg-red-50 border-red-200',
    accentBorder: 'hover:border-red-500',
    bgGradient: 'bg-white',
    logoBg: 'bg-red-50 text-red-700 border-red-200',
    logoColor: 'text-red-600',
    logoIconText: 'SUZUKI',
    specialty: 'Access 125 & Gixxer Hub',
  },
  {
    id: 'vespa',
    name: 'Vespa',
    serviceTitle: 'Vespa scooter service',
    category: 'Italian Classic & Aprilia',
    popularModels: ['Vespa VXL 125/150', 'Vespa SXL 150', 'Aprilia SR 160', 'Aprilia Storm', 'Vespa Elegante'],
    tagline: 'Monocoque chassis service & premium 3-valve engine care',
    badgeColor: 'text-red-700 bg-red-50 border-red-200',
    accentBorder: 'hover:border-red-500',
    bgGradient: 'bg-white',
    logoBg: 'bg-red-50 text-red-700 border-red-200',
    logoColor: 'text-red-600',
    logoIconText: 'VESPA',
    specialty: 'Premium Vespa & Aprilia',
  },
  {
    id: 'ather',
    name: 'Ather',
    serviceTitle: 'Ather EV service',
    category: 'Smart Electric Two-Wheelers',
    popularModels: ['Ather 450X Gen 3/4', 'Ather 450S', 'Ather Rizta', '450 Apex'],
    tagline: 'AtherStack OS diagnostics & BMS pack balance',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    accentBorder: 'hover:border-emerald-500',
    bgGradient: 'bg-white',
    logoBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    logoColor: 'text-emerald-600',
    logoIconText: 'ATHER',
    specialty: 'Ather EV Certified Care',
  },
  {
    id: 'ola',
    name: 'Ola Electric',
    serviceTitle: 'Ola electric service',
    category: 'S1 Series Smart Scooters',
    popularModels: ['Ola S1 Pro Gen 2', 'Ola S1 Air', 'Ola S1 X+', 'Ola Roadster'],
    tagline: 'MoveOS diagnostics & belt drive tensioning',
    badgeColor: 'text-red-700 bg-red-50 border-red-200',
    accentBorder: 'hover:border-red-500',
    bgGradient: 'bg-white',
    logoBg: 'bg-red-50 text-red-700 border-red-200',
    logoColor: 'text-red-600',
    logoIconText: 'OLA',
    specialty: 'Ola S1 & MoveOS Expert',
  },
  {
    id: 'revolt',
    name: 'Revolt',
    serviceTitle: 'Revolt EV motorcycle service',
    category: 'Electric Motorcycles',
    popularModels: ['Revolt RV400', 'Revolt RV400 BRZ', 'Revolt RV1', 'RV1+'],
    tagline: 'Controller mapping, battery swap & belt alignment',
    badgeColor: 'text-red-700 bg-red-50 border-red-200',
    accentBorder: 'hover:border-red-500',
    bgGradient: 'bg-white',
    logoBg: 'bg-red-50 text-red-700 border-red-200',
    logoColor: 'text-red-600',
    logoIconText: 'REVOLT',
    specialty: 'Revolt RV400 Specialist',
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
    <section id="trusted-brands-section" className="space-y-6 animate-fadeIn py-4">
      {/* Top Banner with Trust Metrics & User Requested Statement */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>PAN-INDIA DOORSTEP TWO-WHEELER NETWORK</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight leading-tight">
            Trusted by Top Brands &amp;{' '}
            <span className="text-red-600">
              1,00,000+ People
            </span>{' '}
            Across India
          </h2>

          {/* Description copy */}
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl mx-auto font-normal">
            <strong className="text-black font-bold">GoVoltMechanic</strong> provides bike repair services at home for motorcycles of all models and brands including Honda, Suzuki, Hero, Vespa, Yamaha, TVS, Bajaj, and more with certified doorstep mechanics, genuine OEM spare parts, and 10-day warranty assurance.
          </p>

          {/* Key Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              <Users className="w-4 h-4 text-red-600" />
              <span><strong className="text-black font-mono">1,00,000+</strong> Happy Riders</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span><strong className="text-black font-mono">4.9 / 5</strong> Service Rating</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span><strong className="text-black">10-Day / 1000 KM</strong> Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              <Award className="w-4 h-4 text-red-600" />
              <span><strong className="text-black">100% Genuine</strong> OEM Spares</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 10 Brand Cards with Logos & Service Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base sm:text-lg font-black text-black flex items-center gap-2">
              <Wrench className="w-4 h-4 text-red-600" />
              <span>Authorized Doorstep Repair &amp; Service by Brand</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select any brand to book certified home mechanics equipped with mobile workshop tools.
            </p>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-mono text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 font-bold">
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
                className={`group relative rounded-2xl p-4 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden bg-white shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-red-600 ring-2 ring-red-100'
                    : 'border-slate-200 hover:border-red-300 hover:-translate-y-0.5'
                }`}
              >
                {/* Brand Header & Custom Logo */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {/* Brand Logo Emblem */}
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-black text-center shadow-sm transition-transform group-hover:scale-105 ${brand.logoBg}`}
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
                  <h4 className="text-sm font-black text-black group-hover:text-red-600 transition-colors">
                    {brand.serviceTitle}
                  </h4>

                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {brand.tagline}
                  </p>

                  {/* Popular Models Tag List */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                    <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                      Popular Models Covered:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {brand.popularModels.slice(0, 2).map((model, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700 font-mono"
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
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-red-600 group-hover:text-red-700 flex items-center gap-1">
                    Book Service <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-black">
              100% Transparent Doorstep Service with Fixed Upfront Pricing
            </h4>
            <p className="text-[11px] text-slate-600">
              No hidden charges. Genuine spare parts with digital GST invoice and warranty certificate.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBooking}
          className="w-full md:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 shrink-0"
        >
          Book Doorstep Mechanic
        </button>
      </div>
    </section>
  );
};
