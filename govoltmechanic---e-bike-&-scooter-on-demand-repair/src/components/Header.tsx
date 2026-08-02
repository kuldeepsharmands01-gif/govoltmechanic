import React from 'react';
import { ShieldCheck, MapPin, Zap, User, Wrench, BatteryCharging, Radio } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: 'dashboard' | 'fleet' | 'stations' | 'diagnostics';
  setActiveTab: (tab: 'dashboard' | 'fleet' | 'stations' | 'diagnostics') => void;
  onOpenBooking: () => void;
  activeAppointmentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  activeAppointmentCount,
}) => {
  return (
    <nav className="px-4 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between border-b border-white/10 bg-[#0A0B10]/90 backdrop-blur-xl sticky top-0 z-40">
      {/* Brand Logo */}
      <div className="cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
        <Logo size="md" />
      </div>

      {/* Navigation Tabs */}
      <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-widest text-slate-400">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`transition-colors flex items-center gap-2 py-1 uppercase ${
            activeTab === 'dashboard' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          DASHBOARD
        </button>
        <button
          onClick={() => setActiveTab('fleet')}
          className={`transition-colors flex items-center gap-2 py-1 uppercase ${
            activeTab === 'fleet' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'hover:text-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          MY GARAGE
        </button>
        <button
          onClick={() => setActiveTab('stations')}
          className={`transition-colors flex items-center gap-2 py-1 uppercase ${
            activeTab === 'stations' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'hover:text-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          STATIONS & HUBS
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`transition-colors flex items-center gap-2 py-1 uppercase ${
            activeTab === 'diagnostics' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          AI DIAGNOSTIC DOC
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
        {activeAppointmentCount > 0 && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase">
              1 Active Repair
            </span>
          </div>
        )}

        <button
          onClick={onOpenBooking}
          className="px-4 py-2 bg-cyan-500 text-[#0A0B10] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.7)] active:scale-95 flex items-center gap-1.5"
        >
          <Wrench className="w-3.5 h-3.5" />
          Book Dispatch
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Rider</p>
            <p className="text-xs font-bold text-slate-200">Alex Rivers</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border border-white/20 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_rgba(34,211,238,0.3)]">
            AR
          </div>
        </div>
      </div>

      {/* Mobile Tab Row */}
      <div className="flex md:hidden w-full items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px] font-bold tracking-wider text-slate-400">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-1 ${activeTab === 'dashboard' ? 'text-cyan-400 border-b border-cyan-400' : ''}`}
        >
          TRACKING
        </button>
        <button
          onClick={() => setActiveTab('fleet')}
          className={`py-1 ${activeTab === 'fleet' ? 'text-cyan-400 border-b border-cyan-400' : ''}`}
        >
          GARAGE
        </button>
        <button
          onClick={() => setActiveTab('stations')}
          className={`py-1 ${activeTab === 'stations' ? 'text-cyan-400 border-b border-cyan-400' : ''}`}
        >
          STATIONS
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`py-1 ${activeTab === 'diagnostics' ? 'text-cyan-400 border-b border-cyan-400' : ''}`}
        >
          AI DOC
        </button>
      </div>
    </nav>
  );
};
