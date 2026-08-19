import React from 'react';
import {
  ShieldCheck,
  MapPin,
  Zap,
  User,
  Wrench,
  BatteryCharging,
  Radio,
  Phone,
  Edit3,
  Settings,
  Bell,
  Siren,
  HelpCircle,
  LogIn,
  LogOut,
  ArrowLeftRight,
  Home,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile } from '../types';

export type AppTabType =
  | 'dashboard'
  | 'services'
  | 'about'
  | 'fleet'
  | 'stations'
  | 'diagnostics'
  | 'help'
  | 'technician_portal'
  | 'admin_portal';

interface HeaderProps {
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  onOpenBooking: () => void;
  onOpenSOS: () => void;
  activeAppointmentCount: number;
  specialistPhone: string;
  onOpenPhoneModal: () => void;
  onOpenSettings: () => void;
  notificationsEnabled?: boolean;
  currentUser: UserProfile;
  onOpenLogin: () => void;
  onLogout: () => void;
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
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  return (
    <nav className="px-4 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between border-b border-white/10 bg-[#0A0B10]/95 backdrop-blur-xl sticky top-0 z-40">
      {/* Brand Logo & Current Portal Badge */}
      <div className="flex items-center gap-3">
        <div
          className="cursor-pointer group"
          onClick={() =>
            setActiveTab(
              currentUser.role === 'technician'
                ? 'technician_portal'
                : currentUser.role === 'admin'
                ? 'admin_portal'
                : 'dashboard'
            )
          }
        >
          <Logo size="md" />
        </div>

        {currentUser.role === 'technician' && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 text-amber-400 font-mono text-[10px] font-black uppercase rounded-lg border border-amber-500/40">
            <Wrench className="w-3 h-3" /> TECH PORTAL
          </span>
        )}

        {currentUser.role === 'admin' && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/20 text-purple-300 font-mono text-[10px] font-black uppercase rounded-lg border border-purple-500/40">
            <ShieldCheck className="w-3 h-3" /> FLEET ADMIN
          </span>
        )}
      </div>

      {/* Navigation Tabs (Customer Role Features Home, Services, About) */}
      <div className="hidden lg:flex items-center gap-5 text-xs font-bold tracking-wider text-slate-400">
        {currentUser.role === 'customer' && (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'dashboard'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              HOME
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'services'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 font-black'
                  : 'hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>SERVICES</span>
              <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 text-[9px] font-mono rounded">
                8
              </span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'about'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              ABOUT
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'fleet'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              MY GARAGE
            </button>

            <button
              onClick={() => setActiveTab('stations')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'stations'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              STATIONS
            </button>

            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'diagnostics'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              AI DOC
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'help'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              HELP
            </button>
          </>
        )}

        {currentUser.role === 'technician' && (
          <>
            <button
              onClick={() => setActiveTab('technician_portal')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'technician_portal'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              ACTIVE WORK ORDERS
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'dashboard'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              LIVE GPS MAP
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'services'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              SERVICE CATALOG
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'about'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              ABOUT
            </button>
          </>
        )}

        {currentUser.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('admin_portal')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'admin_portal'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              OPERATIONS TOWER
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'dashboard'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              FLEET RADAR MAP
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'services'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              SERVICES
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'about'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'hover:text-slate-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              ABOUT
            </button>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 mt-2 sm:mt-0">
        {/* Hotline Direct Call */}
        <a
          href={`tel:${specialistPhone}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 rounded-xl text-xs font-bold text-white transition-all shadow-[0_0_12px_rgba(34,211,238,0.15)] group"
          title={`Call 24/7 EV Specialist Hotline (${specialistPhone})`}
        >
          <Phone className="w-3.5 h-3.5 text-green-400 animate-pulse group-hover:scale-110 transition-transform" />
          <span className="hidden xl:inline text-[11px] font-mono tracking-tight text-slate-200 group-hover:text-cyan-300">
            {specialistPhone}
          </span>
          <span className="xl:hidden text-[11px] uppercase tracking-wider font-extrabold text-cyan-400">
            HOTLINE
          </span>
        </a>

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSOS}
          className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] active:scale-95 flex items-center gap-1.5 border border-red-400/40"
          title="Trigger Urgent Roadside Emergency Breakdown Rescue"
        >
          <Siren className="w-3.5 h-3.5 text-white animate-bounce" />
          <span className="hidden sm:inline">RSA</span> SOS
        </button>

        {/* Book Dispatch CTA */}
        <button
          onClick={onOpenBooking}
          className="px-3.5 py-1.5 bg-cyan-500 text-[#0A0B10] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.7)] active:scale-95 flex items-center gap-1.5"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Book Van</span>
        </button>

        {/* Settings Button */}
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

        {/* Multi-Role Switcher / Profile Box */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2.5 p-1.5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 text-left group"
            title="Click to Switch Portal / Login as Technician, Admin, or Rider"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold flex items-center justify-end gap-1">
                {currentUser.role === 'admin' ? (
                  <span className="text-purple-400">ADMIN</span>
                ) : currentUser.role === 'technician' ? (
                  <span className="text-amber-400">TECHNICIAN</span>
                ) : (
                  <span className="text-cyan-400">RIDER</span>
                )}
                <ArrowLeftRight className="w-2.5 h-2.5 text-slate-500 group-hover:text-white transition-colors" />
              </p>
              <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate max-w-[100px]">
                {currentUser.name}
              </p>
            </div>

            <div className="relative">
              <img
                src={
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                }
                alt={currentUser.name}
                className={`w-8 h-8 rounded-full object-cover border-2 shadow-lg ${
                  currentUser.role === 'admin'
                    ? 'border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : currentUser.role === 'technician'
                    ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                }`}
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-500'
                    : currentUser.role === 'technician'
                    ? 'bg-amber-500'
                    : 'bg-cyan-500'
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Tab Row with Home, Services, About */}
      <div className="flex lg:hidden w-full items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] font-bold tracking-wider text-slate-400 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'dashboard' ? 'text-cyan-400 border-b border-cyan-400' : ''
          }`}
        >
          HOME
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'services' ? 'text-cyan-400 border-b border-cyan-400' : ''
          }`}
        >
          SERVICES (8)
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'about' ? 'text-cyan-400 border-b border-cyan-400' : ''
          }`}
        >
          ABOUT
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'fleet' ? 'text-cyan-400 border-b border-cyan-400' : ''
          }`}
        >
          GARAGE
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'diagnostics' ? 'text-cyan-400 border-b border-cyan-400' : ''
          }`}
        >
          AI DOC
        </button>

        {currentUser.role === 'technician' && (
          <button
            onClick={() => setActiveTab('technician_portal')}
            className={`py-1 px-2 whitespace-nowrap text-amber-400 ${
              activeTab === 'technician_portal' ? 'border-b border-amber-400' : ''
            }`}
          >
            ORDERS
          </button>
        )}

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin_portal')}
            className={`py-1 px-2 whitespace-nowrap text-purple-400 ${
              activeTab === 'admin_portal' ? 'border-b border-purple-400' : ''
            }`}
          >
            TOWER
          </button>
        )}
      </div>
    </nav>
  );
};
