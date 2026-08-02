import React from 'react';
import { ShieldCheck, MapPin, Zap, User, Wrench, BatteryCharging, Radio, Phone, Edit3, Settings, Bell, Siren, HelpCircle } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: 'dashboard' | 'fleet' | 'stations' | 'diagnostics' | 'help';
  setActiveTab: (tab: 'dashboard' | 'fleet' | 'stations' | 'diagnostics' | 'help') => void;
  onOpenBooking: () => void;
  onOpenSOS: () => void;
  activeAppointmentCount: number;
  specialistPhone: string;
  onOpenPhoneModal: () => void;
  onOpenSettings: () => void;
  notificationsEnabled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenSOS,
  activeAppointmentCount,
  specialistPhone,
  onOpenPhoneModal,
  onOpenSettings,
  notificationsEnabled = true,
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
        <button
          onClick={() => setActiveTab('help')}
          className={`transition-colors flex items-center gap-2 py-1 uppercase ${
            activeTab === 'help' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          HELP & FAQS
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 mt-2 sm:mt-0">
        {/* Specialist Hotline Direct Call & Edit */}
        <div className="flex items-center bg-white/5 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-1 transition-all shadow-[0_0_12px_rgba(34,211,238,0.15)]">
          <a
            href={`tel:${specialistPhone}`}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-white hover:text-cyan-400 transition-colors"
            title={`Call Specialist Hotline (${specialistPhone})`}
          >
            <Phone className="w-3.5 h-3.5 text-green-400 animate-pulse" />
            <span className="hidden xl:inline text-[11px] font-mono tracking-tight text-slate-300">{specialistPhone}</span>
            <span className="xl:hidden text-[11px] uppercase tracking-wider font-extrabold text-cyan-400">Call</span>
          </a>
          <button
            onClick={onOpenPhoneModal}
            title="Change Specialist Phone Number"
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

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

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSOS}
          className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] active:scale-95 flex items-center gap-1.5 border border-red-400/40 animate-pulse"
          title="Trigger Urgent Roadside Emergency Breakdown Rescue"
        >
          <Siren className="w-4 h-4 text-white animate-bounce" />
          <span className="hidden sm:inline">Emergency</span> SOS
        </button>

        <button
          onClick={onOpenBooking}
          className="px-4 py-2 bg-cyan-500 text-[#0A0B10] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.7)] active:scale-95 flex items-center gap-1.5"
        >
          <Wrench className="w-3.5 h-3.5" />
          Book Dispatch
        </button>

        {/* Settings Toggle Button */}
        <button
          onClick={onOpenSettings}
          title="Dispatch Alert Settings"
          className="relative p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 rounded-xl text-slate-300 hover:text-cyan-400 transition-all active:scale-95 flex items-center justify-center"
        >
          <Settings className="w-4 h-4" />
          {notificationsEnabled && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></span>
          )}
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
        <button
          onClick={() => setActiveTab('help')}
          className={`py-1 ${activeTab === 'help' ? 'text-cyan-400 border-b border-cyan-400' : ''}`}
        >
          HELP
        </button>
      </div>
    </nav>
  );
};
