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
    <div className="space-y-6 text-slate-100">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-[#0D0E15] to-blue-950/60 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.15)]">
        <div className="max-w-xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-[11px] font-bold uppercase tracking-widest">
            <BatteryCharging className="w-3.5 h-3.5" /> Rapid Swap & Mobile Hub Network
          </div>
          <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase">
            GOVOLT URBAN SERVICE PODS
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Need an instant battery pack swap or heavy shop overhaul? Visit a GOVOLT Service Pod or dispatch a dedicated mobile workshop van to your exact street location.
          </p>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block opacity-20 text-cyan-400">
          <BatteryCharging className="w-48 h-48" />
        </div>
      </div>

      {/* Hub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hubs.map((hub) => (
          <div
            key={hub.id}
            className="bg-[#0D0E15] border border-white/10 hover:border-cyan-500/40 rounded-2xl p-6 space-y-5 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest">
                    {hub.distance} AWAY
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5 group-hover:text-cyan-400 transition-colors">
                    {hub.name}
                  </h3>
                </div>
                <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  OPERATIONAL
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{hub.address}</span>
              </div>

              {/* Station Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">On-Duty Techs</p>
                  <p className="text-xl font-bold text-white font-mono">{hub.techsAvailable} Available</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Swap Batteries</p>
                  <p className="text-xl font-bold text-cyan-400 font-mono">{hub.batterySwapsAvailable} Ready</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onSelectHub(hub)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                View on Map
              </button>

              <button
                onClick={onOpenBooking}
                className="py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-[0_0_12px_#22d3ee] active:scale-95 flex items-center gap-1"
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
