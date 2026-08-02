import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Shield, Layers, Plus, Minus, RefreshCw, Radio, Truck, CheckCircle, Clock } from 'lucide-react';
import { Appointment, ServiceHub } from '../types';

interface MapTrackingProps {
  appointment: Appointment | null;
  hubs: ServiceHub[];
  onSelectHub: (hub: ServiceHub) => void;
}

export const MapTracking: React.FC<MapTrackingProps> = ({ appointment, hubs, onSelectHub }) => {
  const [zoom, setZoom] = useState(1);
  const [techProgress, setTechProgress] = useState(0.65); // 0 (far) to 1 (arrived)
  const [isSimulating, setIsSimulating] = useState(true);
  const [activeLayer, setActiveLayer] = useState<'all' | 'van' | 'hubs'>('all');

  // Technician movement path coordinates on a 800x600 coordinate canvas
  // Waypoints from Dispatch Hub (620, 180) -> Street Node 1 (480, 240) -> Node 2 (350, 240) -> User Location (180, 430)
  const startX = 620, startY = 180;
  const p1X = 480, p1Y = 240;
  const p2X = 350, p2Y = 240;
  const targetX = 180, targetY = 430;

  // Calculate current tech coordinates based on progress (0.0 to 1.0)
  const getTechCoords = (p: number) => {
    if (p <= 0.33) {
      const sub = p / 0.33;
      return { x: startX + (p1X - startX) * sub, y: startY + (p1Y - startY) * sub };
    } else if (p <= 0.66) {
      const sub = (p - 0.33) / 0.33;
      return { x: p1X + (p2X - p1X) * sub, y: p1Y + (p2Y - p1Y) * sub };
    } else {
      const sub = (p - 0.66) / 0.34;
      return { x: p2X + (targetX - p2X) * sub, y: p2Y + (targetY - p2Y) * sub };
    }
  };

  const techCoords = getTechCoords(techProgress);

  // Auto increment tech progress if simulating
  useEffect(() => {
    if (!isSimulating || !appointment) return;
    const interval = setInterval(() => {
      setTechProgress((prev) => {
        if (prev >= 1) return 1;
        return prev + 0.005;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimulating, appointment]);

  // Derived metrics based on progress
  const remainingMinutes = Math.max(0, Math.round((1 - techProgress) * 12));
  const remainingDistanceMiles = Math.max(0, (1 - techProgress) * 2.4).toFixed(1);
  const speedMph = techProgress >= 1 ? 0 : Math.floor(18 + Math.sin(techProgress * 20) * 6);

  return (
    <div className="flex-1 bg-[#0D0E15] border border-white/10 rounded-3xl relative overflow-hidden flex flex-col min-h-[500px] shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* SVG Canvas Map Simulation */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <svg
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Glow Filter */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-[#ef4444]" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Grid Blocks (City Blocks) */}
          <g stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
            ))}
          </g>

          {/* City Road Network */}
          <g stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Main Arterial Avenues */}
            <path d="M 50 180 L 750 180" />
            <path d="M 50 240 L 750 240" />
            <path d="M 50 430 L 750 430" />
            <path d="M 180 50 L 180 550" />
            <path d="M 350 50 L 350 550" />
            <path d="M 480 50 L 480 550" />
            <path d="M 620 50 L 620 550" />
            {/* Diagonal Highway */}
            <path d="M 80 500 L 700 100" stroke="rgba(34,211,238,0.15)" strokeWidth="12" />
          </g>

          {/* Road Inner Dash Markings */}
          <g stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="6 6" fill="none">
            <path d="M 50 180 L 750 180" />
            <path d="M 50 240 L 750 240" />
            <path d="M 50 430 L 750 430" />
            <path d="M 180 50 L 180 550" />
            <path d="M 350 50 L 350 550" />
            <path d="M 480 50 L 480 550" />
          </g>

          {/* Active Dispatch Planned Route Line */}
          {appointment && (
            <g>
              {/* Pulsing Backlight */}
              <path
                d={`M ${startX} ${startY} L ${p1X} ${p1Y} L ${p2X} ${p2Y} L ${targetX} ${targetY}`}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="6"
                strokeOpacity="0.3"
                filter="url(#glow-cyan)"
              />
              {/* Dashed Animated Vector */}
              <path
                d={`M ${startX} ${startY} L ${p1X} ${p1Y} L ${p2X} ${p2Y} L ${targetX} ${targetY}`}
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="4"
                strokeDasharray="8 8"
              >
                <animate attributeName="stroke-dashoffset" values="32;0" dur="1.5s" repeatCount="indefinite" />
              </path>
            </g>
          )}

          {/* Service Hubs Pins */}
          {(activeLayer === 'all' || activeLayer === 'hubs') &&
            hubs.map((hub) => (
              <g
                key={hub.id}
                transform={`translate(${hub.coordinates.x}, ${hub.coordinates.y})`}
                className="cursor-pointer group"
                onClick={() => onSelectHub(hub)}
              >
                <circle r="16" fill="#0A0B10" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
                <circle r="6" fill="#38bdf8" />
                <text y="-22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" className="uppercase tracking-widest font-sans">
                  {hub.name.split(' ')[0]}
                </text>
              </g>
            ))}

          {/* Customer Destination Pin */}
          <g transform={`translate(${targetX}, ${targetY})`}>
            {/* Pulsing Radial Aura */}
            <circle r="28" fill="#ef4444" opacity="0.15">
              <animate attributeName="r" values="20;36;20" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle r="12" fill="#ef4444" filter="url(#glow-[#ef4444])" />
            <circle r="4" fill="#ffffff" />
            {/* Customer Pin Label */}
            <g transform="translate(0, -22)">
              <rect x="-60" y="-12" width="120" height="20" rx="10" fill="#0A0B10" stroke="#ef4444" strokeWidth="1" />
              <text y="2" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold" className="font-sans tracking-wider">
                YOUR LOCATION
              </text>
            </g>
          </g>

          {/* Moving Mobile Repair Specialist Unit */}
          {appointment && (activeLayer === 'all' || activeLayer === 'van') && (
            <g transform={`translate(${techCoords.x}, ${techCoords.y})`}>
              {/* Outer Radar Waves */}
              <circle r="32" fill="#22d3ee" opacity="0.12">
                <animate attributeName="r" values="16;38;16" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Core Badge */}
              <circle r="16" fill="#22d3ee" filter="url(#glow-cyan)" />
              <circle r="12" fill="#0A0B10" />

              {/* Van Icon / Directional Arrow */}
              <g transform="translate(-7, -7)">
                <path
                  d="M1 3h10v7H1z M11 6h3l2 2v2h-5z M3 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M12 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                  fill="#22d3ee"
                />
              </g>

              {/* Label above van */}
              <g transform="translate(0, -26)">
                <rect x="-65" y="-14" width="130" height="22" rx="11" fill="#0A0B10" stroke="#22d3ee" strokeWidth="1.5" />
                <text y="1" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="900" className="font-sans uppercase tracking-widest">
                  {appointment.technician.name.split(' ')[0]} ({speedMph} MPH)
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Map HUD Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
            <span className="text-[11px] font-black tracking-widest uppercase text-white">
              LIVE DISPATCH GPS
            </span>
          </div>

          <div className="hidden sm:flex px-3.5 py-1.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase">
              San Francisco District 4
            </span>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-white/10 p-1 rounded-xl pointer-events-auto">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
              activeLayer === 'all' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Units
          </button>
          <button
            onClick={() => setActiveLayer('van')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
              activeLayer === 'van' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Van Only
          </button>
          <button
            onClick={() => setActiveLayer('hubs')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
              activeLayer === 'hubs' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hubs ({hubs.length})
          </button>
        </div>
      </div>

      {/* Map Control Buttons (Zoom / Center / Simulation) */}
      <div className="absolute top-16 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.25, 2))}
          className="w-10 h-10 bg-black/80 backdrop-blur-xl border border-white/10 hover:border-cyan-400 rounded-xl flex items-center justify-center text-white transition-colors shadow-lg active:scale-95"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
          className="w-10 h-10 bg-black/80 backdrop-blur-xl border border-white/10 hover:border-cyan-400 rounded-xl flex items-center justify-center text-white transition-colors shadow-lg active:scale-95"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="w-10 h-10 bg-black/80 backdrop-blur-xl border border-white/10 hover:border-cyan-400 rounded-xl flex items-center justify-center text-cyan-400 transition-colors shadow-lg active:scale-95"
          title="Reset Zoom"
        >
          <Navigation className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`w-10 h-10 bg-black/80 backdrop-blur-xl border rounded-xl flex items-center justify-center transition-colors shadow-lg active:scale-95 ${
            isSimulating ? 'border-cyan-400 text-cyan-400' : 'border-white/10 text-slate-500'
          }`}
          title={isSimulating ? 'Pause GPS Simulation' : 'Resume GPS Simulation'}
        >
          <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Bottom Floating Telemetry Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row justify-between items-end gap-3 pointer-events-none">
        {/* Telemetry Log */}
        <div className="bg-black/85 backdrop-blur-xl border border-white/10 p-4 rounded-2xl max-w-xs w-full pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400" /> Dispatch Updates
            </span>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              5G ENCRYPTED
            </span>
          </div>

          <div className="space-y-2.5">
            {techProgress >= 1 ? (
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-7 bg-green-500 rounded-full shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Arrived at Destination
                  </p>
                  <p className="text-[10px] text-slate-400">Technician is unloading mobile workshop equipment.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-7 bg-cyan-400 rounded-full shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-white">Route Optimized</p>
                  <p className="text-[10px] text-slate-300">
                    -{Math.max(1, Math.round(remainingMinutes * 0.2))} min ETA • Market St clear traffic
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>VAN SPEED: <strong className="text-cyan-400">{speedMph} MPH</strong></span>
              <span>DIST: <strong className="text-white">{remainingDistanceMiles} MI</strong></span>
            </div>
          </div>
        </div>

        {/* ETA Highlight Badge */}
        {appointment && (
          <div className="bg-black/85 backdrop-blur-xl border border-cyan-500/40 p-4 rounded-2xl pointer-events-auto shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Technician Arrival</p>
              <p className="text-3xl font-mono font-black text-cyan-400 leading-tight">
                {techProgress >= 1 ? 'ARRIVED' : `${remainingMinutes} MINS`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
