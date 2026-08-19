import React from 'react';
import { MapPin, BatteryCharging, Wrench, ShieldCheck, Navigation, Clock, Search, ArrowRight } from 'lucide-react';
import { ServiceHub } from '../types';

interface StationHubsProps {
  hubs: ServiceHub[];
  onSelectHub: (hub: ServiceHub) => void;
  onOpenBooking: () => void;
}

export const StationHubs: React.FC<StationHubsProps> = ({
  hubs,
  onSelectHub,
  onOpenBooking,
}) => {
  return (
    <div className="space-y-6 text-slate-800">
      {/* Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="max-w-xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-red-700 text-[11px] font-bold uppercase tracking-widest">
            <BatteryCharging className="w-3.5 h-3.5 text-red-600" /> Rapid Swap & Mobile Hub Network
          </div>
          <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight text-black uppercase">
            GOVOLT URBAN SERVICE PODS
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
            Need an instant battery pack swap or heavy shop overhaul? Visit a GOVOLT Service Pod or dispatch a dedicated mobile workshop van to your exact street location.
          </p>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block opacity-10 text-red-600">
          <BatteryCharging className="w-48 h-48" />
        </div>
      </div>

      {/* Hub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hubs.map((hub) => (
          <div
            key={hub.id}
            className="bg-white border border-slate-200 hover:border-red-300 rounded-2xl p-6 space-y-5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-red-600 font-mono font-bold uppercase tracking-widest">
                    {hub.distance} AWAY
                  </span>
                  <h3 className="text-lg font-black text-black mt-0.5 group-hover:text-red-600 transition-colors">
                    {hub.name}
                  </h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  OPERATIONAL
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span className="truncate">{hub.address}</span>
              </div>

              {/* Station Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">On-Duty Techs</p>
                  <p className="text-xl font-black text-black font-mono">{hub.techsAvailable} Available</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Swap Batteries</p>
                  <p className="text-xl font-black text-red-600 font-mono">{hub.batterySwapsAvailable} Ready</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onSelectHub(hub)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-red-600" />
                View on Map
              </button>

              <button
                onClick={onOpenBooking}
                className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md active:scale-95 flex items-center gap-1"
              >
                Dispatch
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
