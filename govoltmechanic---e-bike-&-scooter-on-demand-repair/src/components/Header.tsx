import React from 'react';
import {
  Wrench,
  Zap,
  MapPin,
  Radio,
  Clock,
  Phone,
  HelpCircle,
  Settings,
  ShieldCheck,
  Siren,
  LogIn,
  Home,
  Info,
  Layers,
  Sparkles,
  BookOpen
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
  | 'blog'
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
    <nav className="px-4 sm:px-8 py-3.5 sm:py-4 flex flex-wrap items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
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
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 font-mono text-[10px] font-black uppercase rounded-lg border border-amber-300">
            <Wrench className="w-3 h-3 text-amber-600" /> TECH PORTAL
          </span>
        )}

        {currentUser.role === 'admin' && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 font-mono text-[10px] font-black uppercase rounded-lg border border-red-200">
            <ShieldCheck className="w-3 h-3 text-red-600" /> FLEET ADMIN
          </span>
        )}
      </div>

      {/* Navigation Tabs (Arranged strictly: HOME, ABOUT, SERVICE, GARAGE, AIDOC, AIGEN, BLOG) */}
      <div className="hidden lg:flex items-center gap-5 text-xs font-bold tracking-wider text-slate-700">
        {currentUser.role === 'customer' && (
          <>
            {/* 1. HOME */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'dashboard'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              HOME
            </button>

            {/* 2. ABOUT */}
            <button
              onClick={() => setActiveTab('about')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'about'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              ABOUT
            </button>

            {/* 3. SERVICE */}
            <button
              onClick={() => setActiveTab('services')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'services'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-red-600" />
              <span>SERVICE</span>
              <span className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[9px] font-mono rounded font-black">
                8
              </span>
            </button>

            {/* 4. GARAGE */}
            <button
              onClick={() => setActiveTab('fleet')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'fleet'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              GARAGE
            </button>

            {/* 5. AIDOC */}
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'diagnostics'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              AIDOC
            </button>

            {/* 6. BLOG */}
            <button
              onClick={() => setActiveTab('blog')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'blog'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-red-600" />
              <span>BLOG</span>
            </button>

            {/* Stations Hubs & Help */}
            <button
              onClick={() => setActiveTab('stations')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'stations'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              STATIONS
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`transition-colors flex items-center gap-1.5 py-1 uppercase ${
                activeTab === 'help'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
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
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              ACTIVE WORK ORDERS
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'dashboard'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              LIVE GPS MAP
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'about'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              ABOUT
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'services'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              SERVICE CATALOG
            </button>
            <button
              onClick={() => setActiveTab('aigen')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'aigen'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              AIGEN STUDIO
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'blog'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              BLOG
            </button>
          </>
        )}

        {currentUser.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('admin_portal')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'admin_portal'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              OPERATIONS TOWER
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'dashboard'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              FLEET RADAR MAP
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'about'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              ABOUT
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'services'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              SERVICES
            </button>
            <button
              onClick={() => setActiveTab('aigen')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'aigen'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              AIGEN STUDIO
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`transition-colors flex items-center gap-2 py-1 uppercase ${
                activeTab === 'blog'
                  ? 'text-red-600 border-b-2 border-red-600 font-black'
                  : 'hover:text-red-600 text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              BLOG
            </button>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 mt-2 sm:mt-0">
        {/* Hotline Direct Call */}
        <a
          href={`tel:${specialistPhone}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-red-400 rounded-xl text-xs font-bold text-slate-900 transition-all group"
          title={`Call 24/7 EV Specialist Hotline (${specialistPhone})`}
        >
          <Phone className="w-3.5 h-3.5 text-red-600 animate-pulse group-hover:scale-110 transition-transform" />
          <span className="hidden xl:inline text-[11px] font-mono tracking-tight text-slate-800 group-hover:text-red-600 font-bold">
            {specialistPhone}
          </span>
          <span className="xl:hidden text-[11px] uppercase tracking-wider font-extrabold text-red-600">
            HOTLINE
          </span>
        </a>

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSOS}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 border border-red-700"
          title="Trigger Urgent Roadside Emergency Breakdown Rescue"
        >
          <Siren className="w-3.5 h-3.5 text-white animate-bounce" />
          <span className="hidden sm:inline">RSA</span> SOS
        </button>

        {/* Book Dispatch CTA */}
        <button
          onClick={onOpenBooking}
          className="px-3.5 py-1.5 bg-black hover:bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
        >
          <Wrench className="w-3.5 h-3.5 text-red-500" />
          <span>Book Service</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Dispatch Alert Settings"
          className="relative p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 hover:text-red-600 transition-all active:scale-95 flex items-center justify-center"
        >
          <Settings className="w-4 h-4" />
          {notificationsEnabled && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
          )}
        </button>

        {/* Login / Signup Button */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-300">
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-400 rounded-xl text-xs font-black text-red-700 hover:text-red-800 transition-all group"
            title="Click to Open Login / Signup Window"
          >
            <LogIn className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform" />
            <span className="font-black uppercase tracking-wider">Login / Signup</span>
            {currentUser && currentUser.role !== 'customer' && (
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded uppercase">
                {currentUser.role}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Row strictly arranged: HOME, ABOUT, SERVICE, GARAGE, AIDOC, BLOG */}
      <div className="flex lg:hidden w-full items-center justify-between mt-3 pt-2 border-t border-slate-200 text-[10px] font-bold tracking-wider text-slate-600 overflow-x-auto gap-2">
        {/* 1. HOME */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'dashboard' ? 'text-red-600 border-b-2 border-red-600 font-black' : ''
          }`}
        >
          HOME
        </button>

        {/* 2. ABOUT */}
        <button
          onClick={() => setActiveTab('about')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'about' ? 'text-red-600 border-b-2 border-red-600 font-black' : ''
          }`}
        >
          ABOUT
        </button>

        {/* 3. SERVICE */}
        <button
          onClick={() => setActiveTab('services')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'services' ? 'text-red-600 border-b-2 border-red-600 font-black' : ''
          }`}
        >
          SERVICE (8)
        </button>

        {/* 4. GARAGE */}
        <button
          onClick={() => setActiveTab('fleet')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'fleet' ? 'text-red-600 border-b-2 border-red-600 font-black' : ''
          }`}
        >
          GARAGE
        </button>

        {/* 5. AIDOC */}
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'diagnostics' ? 'text-red-600 border-b-2 border-red-600 font-black' : ''
          }`}
        >
          AIDOC
        </button>

        {/* 6. BLOG */}
        <button
          onClick={() => setActiveTab('blog')}
          className={`py-1 px-2 whitespace-nowrap ${
            activeTab === 'blog' ? 'text-red-600 border-b-2 border-red-600 font-black' : ''
          }`}
        >
          BLOG
        </button>

        {currentUser.role === 'technician' && (
          <button
            onClick={() => setActiveTab('technician_portal')}
            className={`py-1 px-2 whitespace-nowrap text-amber-600 ${
              activeTab === 'technician_portal' ? 'border-b-2 border-amber-600 font-black' : ''
            }`}
          >
            ORDERS
          </button>
        )}

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin_portal')}
            className={`py-1 px-2 whitespace-nowrap text-red-600 ${
              activeTab === 'admin_portal' ? 'border-b-2 border-red-600 font-black' : ''
            }`}
          >
            TOWER
          </button>
        )}
      </div>
    </nav>
  );
};
