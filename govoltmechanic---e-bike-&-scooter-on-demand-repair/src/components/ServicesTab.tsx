import React, { useState } from 'react';
import {
  Wrench,
  Siren,
  ShieldCheck,
  Settings,
  BatteryCharging,
  CircleDot,
  Cpu,
  ShieldAlert,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
  Zap,
  Sparkles,
  PhoneCall,
  Search,
  Tag,
  Star,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  SERVICE_CATEGORIES,
  ServiceCategory,
  ServiceCategoryKey,
  ServicePackage
} from '../data/servicesCatalog';

interface ServicesTabProps {
  onBookService: (pkg: ServicePackage) => void;
  onOpenSOS: () => void;
  specialistPhone: string;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  onBookService,
  onOpenSOS,
  specialistPhone,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryKey>('periodic');
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping
  const getCategoryIcon = (key: ServiceCategoryKey, className = 'w-5 h-5') => {
    switch (key) {
      case 'periodic':
        return <Wrench className={className} />;
      case 'rsa':
        return <Siren className={className} />;
      case 'insurance':
        return <ShieldCheck className={className} />;
      case 'spare_parts':
        return <Settings className={className} />;
      case 'batteries':
        return <BatteryCharging className={className} />;
      case 'tyres':
        return <CircleDot className={className} />;
      case 'engine':
        return <Cpu className={className} />;
      case 'accidental':
        return <ShieldAlert className={className} />;
      default:
        return <Wrench className={className} />;
    }
  };

  const currentCategoryData =
    SERVICE_CATEGORIES.find((c) => c.id === selectedCategory) || SERVICE_CATEGORIES[0];

  // Filter packages based on search query if present
  const displayedPackages = searchQuery.trim()
    ? SERVICE_CATEGORIES.flatMap((c) => c.packages).filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : currentCategoryData.packages;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-red-700 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            Doorstep Workshop & Specialized 2-Wheeler Care
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight">
            Comprehensive Two-Wheeler & EV Services Delivered to Your Doorstep
          </h1>
          <p className="text-sm sm:text-base text-slate-700">
            From routine periodic checkups and emergency roadside rescue to brand new batteries, tyres, and engine rebuilds — our fully equipped mobile workshop vans arrive at your home or office.
          </p>

          {/* Quick Search */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across all services (e.g. Periodic, Battery, Brake pad, Tyre, Clutch)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-red-600 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-black placeholder:text-slate-400 focus:outline-none transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-black px-2 py-1 bg-slate-100 rounded-lg border border-slate-300"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={onOpenSOS}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <Siren className="w-4 h-4 animate-pulse" />
              <span>24x7 Emergency RSA</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Categories Filter Pills (Horizontally Scrollable / Grid) */}
      {!searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-600" />
              Select Service Category ({SERVICE_CATEGORIES.length})
            </h3>
            <span className="text-[11px] text-slate-500">Click any category to explore packages</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {SERVICE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col items-center justify-center text-center gap-2 ${
                    isSelected
                      ? 'bg-red-50 border-red-600 text-red-700 shadow-sm scale-[1.02]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-black'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {getCategoryIcon(cat.id, 'w-4 h-4')}
                  </div>
                  <span className="text-xs font-bold leading-tight line-clamp-2">{cat.name}</span>
                  {cat.badge && (
                    <span
                      className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Category Spotlight Header (When not searching) */}
      {!searchQuery && (
        <div className="p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 shadow-sm">
              {getCategoryIcon(currentCategoryData.id, 'w-7 h-7')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black">{currentCategoryData.name}</h2>
                {currentCategoryData.badge && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full border border-red-200">
                    {currentCategoryData.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-red-600 font-bold">{currentCategoryData.tagline}</p>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">{currentCategoryData.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <a
              href={`tel:${specialistPhone}`}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2 transition-colors flex-1 md:flex-initial"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>Talk to Expert</span>
            </a>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
            {searchQuery
              ? `Search Results (${displayedPackages.length} packages found)`
              : `Available Packages for ${currentCategoryData.name}`}
          </h3>
          <span className="text-xs text-slate-500">Includes Doorstep Van Visit & Digital Job Card</span>
        </div>

        {displayedPackages.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-base font-bold text-black">No services found matching "{searchQuery}"</p>
            <p className="text-xs text-slate-500">Try searching for "battery", "service", "brake", or "tyre".</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700"
            >
              View All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white border rounded-3xl p-6 flex flex-col justify-between relative transition-all duration-300 hover:border-red-400 hover:shadow-md ${
                  pkg.popular
                    ? 'border-red-500 shadow-sm ring-1 ring-red-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Popular Tag */}
                {pkg.popular && (
                  <div className="absolute -top-3 right-6 bg-red-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    RECOMMENDED
                  </div>
                )}

                <div className="space-y-4">
                  {/* Category tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-red-700 px-2 py-0.5 bg-red-50 rounded-md border border-red-200">
                      {pkg.categoryId.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pkg.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Title & short desc */}
                  <div>
                    <h4 className="text-base font-black text-black leading-snug">{pkg.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{pkg.shortDesc}</p>
                  </div>

                  {/* Pricing */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black font-mono text-black">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </span>
                        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                          <span className="text-xs line-through text-slate-400 font-mono">
                            ₹{pkg.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">All inclusive doorstep price</p>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200 inline-flex items-center gap-1">
                        <Shield className="w-3 h-3 text-emerald-600" />
                        {pkg.warranty}
                      </span>
                    </div>
                  </div>

                  {/* Features checklist */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                      What's Included in this Package:
                    </p>
                    <ul className="space-y-2">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {pkg.recommendedFor && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <strong className="text-black font-bold">Best For: </strong> {pkg.recommendedFor}
                    </div>
                  )}
                </div>

                {/* Booking Button */}
                <div className="pt-6">
                  <button
                    onClick={() => onBookService(pkg)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group active:scale-98"
                  >
                    <span>Book Doorstep Service</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assurance Grid Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-black">Doorstep Mobile Workshop</h5>
            <p className="text-[11px] text-slate-600">Pneumatic lifts & diagnostic tools in van</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-black">100% Genuine Spare Parts</h5>
            <p className="text-[11px] text-slate-600">Direct OEM & OES certified warranty</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-red-600 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-black">10-Day Service Guarantee</h5>
            <p className="text-[11px] text-slate-600">Free doorstep re-check & warranty</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-black">Live GPS Van Tracking</h5>
            <p className="text-[11px] text-slate-600">Real-time arrival ETA on map</p>
          </div>
        </div>
      </div>
    </div>
  );
};
