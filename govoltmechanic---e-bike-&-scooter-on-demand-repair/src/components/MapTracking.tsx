import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, Shield, Layers, Plus, Minus, RefreshCw, Radio, Truck, CheckCircle, Clock, Bell, Settings, X, Sparkles, Building2, Star, Filter, Phone, CheckCircle2 } from 'lucide-react';
import { Appointment, ServiceHub, RecentServiceSpot, Technician } from '../types';
import { RECENT_SERVICE_SPOTS, TECHNICIANS } from '../data/mockData';
import { triggerBrowserNotification, playEtaChime } from '../utils/notifications';

interface MapTrackingProps {
  appointment: Appointment | null;
  hubs: ServiceHub[];
  onSelectHub: (hub: ServiceHub) => void;
  notificationsEnabled?: boolean;
  audioEnabled?: boolean;
  onOpenSettings?: () => void;
}

export const MapTracking: React.FC<MapTrackingProps> = ({
  appointment,
  hubs,
  onSelectHub,
  notificationsEnabled = true,
  audioEnabled = true,
  onOpenSettings,
}) => {
  const [zoom, setZoom] = useState(1);
  const [techProgress, setTechProgress] = useState(0.65); // 0 (far) to 1 (arrived)
  const [isSimulating, setIsSimulating] = useState(true);
  
  // Layer Filter States: Active Hubs, Technician Locations, Recent Service Spots
  const [filterLayer, setFilterLayer] = useState<'all' | 'hubs' | 'technicians' | 'recent_spots'>('all');
  const [showHubs, setShowHubs] = useState(true);
  const [showTechnicians, setShowTechnicians] = useState(true);
  const [showRecentSpots, setShowRecentSpots] = useState(true);

  // Selected Pin Popup Card State
  const [selectedSpot, setSelectedSpot] = useState<RecentServiceSpot | null>(null);
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [selectedHub, setSelectedHub] = useState<ServiceHub | null>(null);

  const [showInAppAlert, setShowInAppAlert] = useState(false);

  const hasNotified5MinRef = useRef<string | null>(null);

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

  // Trigger 5-minute ETA notification
  useEffect(() => {
    if (!appointment) return;
    if (remainingMinutes <= 5 && remainingMinutes > 0) {
      if (hasNotified5MinRef.current !== appointment.id) {
        hasNotified5MinRef.current = appointment.id;
        setShowInAppAlert(true);

        if (notificationsEnabled) {
          triggerBrowserNotification(
            '⚡ GOVOLTMECHANIC ETA Alert',
            `${appointment.technician.name} is ${remainingMinutes} mins away (${remainingDistanceMiles} mi)! Please make your vehicle accessible.`
          );
        }

        if (audioEnabled) {
          playEtaChime();
        }
      }
    } else if (remainingMinutes > 5) {
      hasNotified5MinRef.current = null;
    }
  }, [remainingMinutes, appointment, notificationsEnabled, audioEnabled, remainingDistanceMiles]);

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

          {/* 1. Active Hubs Pins */}
          {showHubs &&
            hubs.map((hub) => (
              <g
                key={hub.id}
                transform={`translate(${hub.coordinates.x}, ${hub.coordinates.y})`}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedHub(hub);
                  setSelectedTech(null);
                  setSelectedSpot(null);
                  onSelectHub(hub);
                }}
              >
                {/* Hub Pulsing Outer Aura */}
                <circle r="22" fill="#38bdf8" opacity="0.15">
                  <animate attributeName="r" values="18;26;18" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.25;0.05;0.25" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle r="16" fill="#0A0B10" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
                <circle r="6" fill="#38bdf8" />
                <text y="-22" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold" className="uppercase tracking-widest font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {hub.name.split(' ')[0]}
                </text>
              </g>
            ))}

          {/* 2. Recent Service Spots Pins */}
          {showRecentSpots &&
            RECENT_SERVICE_SPOTS.map((spot) => (
              <g
                key={spot.id}
                transform={`translate(${spot.coordinates.x}, ${spot.coordinates.y})`}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedSpot(spot);
                  setSelectedTech(null);
                  setSelectedHub(null);
                }}
              >
                {/* Spot Pulse Ring */}
                <circle r="18" fill="#10b981" opacity="0.18">
                  <animate attributeName="r" values="14;22;14" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle r="12" fill="#0A0B10" stroke="#10b981" strokeWidth="2" />
                {/* Checkmark inside */}
                <path
                  d="M-3 0 L-1 3 L4 -3"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Label above */}
                <g transform="translate(0, -18)">
                  <rect x="-45" y="-11" width="90" height="16" rx="8" fill="#0A0B10" stroke="#10b981" strokeWidth="1" opacity="0.9" />
                  <text y="1" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="800" className="font-sans uppercase tracking-wider">
                    {spot.locationName.split(' ')[0]} ★{spot.rating}
                  </text>
                </g>
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

          {/* 3. Technician Locations Pins */}
          {showTechnicians && (
            <>
              {/* Active En Route Van (Amit Verma) */}
              {appointment && (
                <g
                  transform={`translate(${techCoords.x}, ${techCoords.y})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedTech(appointment.technician);
                    setSelectedSpot(null);
                    setSelectedHub(null);
                  }}
                >
                  {/* Outer Radar Waves */}
                  <circle r="32" fill="#22d3ee" opacity="0.15">
                    <animate attributeName="r" values="16;38;16" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Core Badge */}
                  <circle r="16" fill="#22d3ee" filter="url(#glow-cyan)" />
                  <circle r="12" fill="#0A0B10" />

                  {/* Van Icon */}
                  <g transform="translate(-7, -7)">
                    <path
                      d="M1 3h10v7H1z M11 6h3l2 2v2h-5z M3 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M12 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                      fill="#22d3ee"
                    />
                  </g>

                  {/* Label above van */}
                  <g transform="translate(0, -26)">
                    <rect x="-68" y="-14" width="136" height="22" rx="11" fill="#0A0B10" stroke="#22d3ee" strokeWidth="1.5" />
                    <text y="1" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="900" className="font-sans uppercase tracking-widest">
                      {appointment.technician.name.split(' ')[0]} ({speedMph} KM/H)
                    </text>
                  </g>
                </g>
              )}

              {/* Other Available Technician Units (Priya Singh & Rohan Gupta) */}
              {TECHNICIANS.filter((t) => t.id !== appointment?.technician.id).map((tech, idx) => {
                const staticCoords = idx === 0 ? { x: 260, y: 380 } : { x: 580, y: 170 };
                return (
                  <g
                    key={tech.id}
                    transform={`translate(${staticCoords.x}, ${staticCoords.y})`}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedTech(tech);
                      setSelectedSpot(null);
                      setSelectedHub(null);
                    }}
                  >
                    <circle r="18" fill="#38bdf8" opacity="0.12">
                      <animate attributeName="r" values="14;22;14" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle r="13" fill="#0A0B10" stroke="#22d3ee" strokeWidth="1.5" />
                    <g transform="translate(-6, -6)">
                      <path
                        d="M1 3h10v7H1z M11 6h3l2 2v2h-5z M3 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M12 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                        fill="#38bdf8"
                      />
                    </g>
                    <g transform="translate(0, -20)">
                      <rect x="-50" y="-10" width="100" height="18" rx="9" fill="#0A0B10" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                      <text y="2" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="800" className="font-sans uppercase tracking-wider">
                        {tech.name.split(' ')[0]} (READY)
                      </text>
                    </g>
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* Map HUD Top Bar with Enhanced Filter Toggles */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2.5 z-10 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
          <div className="px-3.5 py-1.5 bg-black/85 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
            <span className="text-[11px] font-black tracking-widest uppercase text-white">
              LIVE DISPATCH GPS
            </span>
          </div>

          {/* 5-Min Alert Toggle Badge Shortcut */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className={`px-3.5 py-1.5 bg-black/85 backdrop-blur-xl border rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                notificationsEnabled
                  ? 'border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                  : 'border-white/10 text-slate-500 hover:text-slate-300'
              }`}
              title="Click to manage 5-Min Arrival Alert Settings"
            >
              <Bell className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase">
                {notificationsEnabled ? '5-MIN ALERT ON' : '5-MIN ALERT OFF'}
              </span>
              <Settings className="w-3 h-3 opacity-60" />
            </button>
          )}

          <div className="hidden md:flex px-3.5 py-1.5 bg-black/85 backdrop-blur-xl border border-white/10 rounded-full items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase">
              Kanpur Central Zone, UP
            </span>
          </div>
        </div>

        {/* Enhanced Filter Toggle Pill Bar */}
        <div className="flex items-center gap-1.5 bg-black/90 backdrop-blur-2xl border border-white/15 p-1.5 rounded-2xl pointer-events-auto shadow-2xl flex-wrap">
          {/* Preset ALL */}
          <button
            onClick={() => {
              setFilterLayer('all');
              setShowHubs(true);
              setShowTechnicians(true);
              setShowRecentSpots(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filterLayer === 'all' && showHubs && showTechnicians && showRecentSpots
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.6)] scale-105'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Layers</span>
          </button>

          {/* Active Hubs Toggle */}
          <button
            onClick={() => {
              const nextState = !showHubs;
              setShowHubs(nextState);
              if (nextState && !showTechnicians && !showRecentSpots) setFilterLayer('hubs');
              else if (nextState && showTechnicians && showRecentSpots) setFilterLayer('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
              showHubs
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                : 'bg-white/5 text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Active Hubs</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${showHubs ? 'bg-sky-400 text-black' : 'bg-slate-800 text-slate-400'}`}>
              {hubs.length}
            </span>
          </button>

          {/* Technician Locations Toggle */}
          <button
            onClick={() => {
              const nextState = !showTechnicians;
              setShowTechnicians(nextState);
              if (nextState && !showHubs && !showRecentSpots) setFilterLayer('technicians');
              else if (nextState && showHubs && showRecentSpots) setFilterLayer('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
              showTechnicians
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                : 'bg-white/5 text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technicians</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${showTechnicians ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-slate-400'}`}>
              {TECHNICIANS.length}
            </span>
          </button>

          {/* Recent Service Spots Toggle */}
          <button
            onClick={() => {
              const nextState = !showRecentSpots;
              setShowRecentSpots(nextState);
              if (nextState && !showHubs && !showTechnicians) setFilterLayer('recent_spots');
              else if (nextState && showHubs && showTechnicians) setFilterLayer('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
              showRecentSpots
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-white/5 text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recent Spots</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${showRecentSpots ? 'bg-emerald-400 text-black' : 'bg-slate-800 text-slate-400'}`}>
              {RECENT_SERVICE_SPOTS.length}
            </span>
          </button>
        </div>
      </div>

      {/* 5-Min Arrival Alert Floating Banner Toast */}
      {showInAppAlert && appointment && (
        <div className="absolute top-16 left-4 right-16 sm:right-auto sm:max-w-md z-20 pointer-events-auto bg-[#0D0E15]/95 border border-cyan-400 p-4 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.35)] backdrop-blur-xl animate-bounce-short">
          <div className="flex items-start justify-between gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shrink-0">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-wider border border-cyan-500/30">
                  5-MIN ARRIVAL ALERT
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {remainingDistanceMiles} mi away
                </span>
              </div>
              <p className="text-xs font-black text-white">
                {appointment.technician.name} is arriving shortly!
              </p>
              <p className="text-[11px] text-slate-300">
                Please make your vehicle accessible. Desktop browser notification dispatched.
              </p>
            </div>
            <button
              onClick={() => setShowInAppAlert(false)}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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

      {/* Selected Map Pin Interactive Popover Card */}
      {(selectedSpot || selectedTech || selectedHub) && (
        <div className="absolute bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-20 pointer-events-auto bg-[#0A0B10]/95 border border-cyan-500/40 p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              {selectedSpot && (
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {selectedTech && (
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Truck className="w-4 h-4" />
                </div>
              )}
              {selectedHub && (
                <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Building2 className="w-4 h-4" />
                </div>
              )}
              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-slate-400 block">
                  {selectedSpot ? 'RECENT DOORSTEP SERVICE' : selectedTech ? 'MOBILE WORKSHOP UNIT' : 'GOVOLT SERVICE HUB'}
                </span>
                <h4 className="text-sm font-black text-white leading-snug">
                  {selectedSpot ? selectedSpot.locationName : selectedTech ? selectedTech.name : selectedHub?.name}
                </h4>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedSpot(null);
                setSelectedTech(null);
                setSelectedHub(null);
              }}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details Content */}
          {selectedSpot && (
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-medium">{selectedSpot.address}</p>
              <div className="p-2 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Customer & Service</p>
                  <p className="font-bold text-emerald-400">{selectedSpot.customerName} • {selectedSpot.serviceType}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 text-amber-300 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{selectedSpot.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Tech: <strong className="text-cyan-300">{selectedSpot.techName}</strong></span>
                <span className="font-mono">{selectedSpot.completedAt}</span>
              </div>
            </div>
          )}

          {selectedTech && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <img src={selectedTech.avatar} alt={selectedTech.name} className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40" />
                <div>
                  <p className="text-xs font-bold text-cyan-300">{selectedTech.specialty}</p>
                  <p className="text-[10px] text-slate-400">{selectedTech.vanId}</p>
                </div>
              </div>
              <div className="p-2 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Rating & Repairs</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> {selectedTech.rating} ({selectedTech.completedRepairs} done)
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1">
                <span className="text-slate-400">Location: {selectedTech.location.address.split(',')[0]}</span>
                <a href={`tel:${selectedTech.phone}`} className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Call
                </a>
              </div>
            </div>
          )}

          {selectedHub && (
            <div className="space-y-2 text-xs">
              <p className="text-slate-300">{selectedHub.address}</p>
              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Tech Vans</p>
                  <p className="text-base font-black text-sky-400">{selectedHub.techsAvailable} Available</p>
                </div>
                <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Battery Swaps</p>
                  <p className="text-base font-black text-cyan-400">{selectedHub.batterySwapsAvailable} Ready</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Floating Telemetry Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row justify-between items-end gap-3 pointer-events-none">
        {/* Telemetry Log */}
        <div className="bg-black/85 backdrop-blur-xl border border-white/10 p-4 rounded-2xl max-w-xs w-full pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Dispatch Updates
            </span>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1.5 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
              </span>
              5G ENCRYPTED
            </span>
          </div>

          <div className="space-y-2.5">
            {techProgress >= 1 ? (
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-7 bg-emerald-500 rounded-full shrink-0 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <div>
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Arrived at Destination
                  </p>
                  <p className="text-[10px] text-slate-400">Technician is unloading mobile workshop equipment.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5">
                <div className="relative w-1.5 h-7 bg-slate-800 rounded-full shrink-0 overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Route Optimized</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </p>
                  <p className="text-[10px] text-slate-300">
                    -{Math.max(1, Math.round(remainingMinutes * 0.2))} min ETA • Mall Road clear traffic
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                VAN SPEED: <strong className="text-cyan-400">{speedMph} KM/H</strong>
                {isSimulating && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                  </span>
                )}
              </span>
              <span>DIST: <strong className="text-white">{remainingDistanceMiles} KM</strong></span>
            </div>
          </div>
        </div>

        {/* ETA Highlight Badge & Real-Time Animated Route Progress Bar */}
        {appointment && (
          <div className="bg-black/85 backdrop-blur-xl border border-cyan-500/40 p-4 rounded-2xl pointer-events-auto shadow-[0_0_25px_rgba(34,211,238,0.25)] flex flex-col gap-2.5 min-w-[250px]">
            <div className="flex items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                  </span>
                  Technician Arrival
                </p>
                <p className="text-3xl font-mono font-black text-cyan-400 leading-tight drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                  {techProgress >= 1 ? 'ARRIVED' : `${remainingMinutes} MINS`}
                </p>
              </div>
              <div className="relative w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Clock className="w-6 h-6 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
                </span>
              </div>
            </div>

            {/* Subtle Progress Bar with Animated Pulse & Glowing Sweep */}
            <div className="space-y-1.5 pt-1 border-t border-white/10">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  GPS ROUTE PROGRESS
                </span>
                <span className="text-cyan-400 font-black tracking-wider">{Math.round(techProgress * 100)}%</span>
              </div>
              <div className="relative w-full h-2 bg-slate-900/90 rounded-full overflow-hidden border border-cyan-500/30 p-[1px]">
                {/* Background Pulse Fill */}
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-sky-300 rounded-full transition-all duration-500 relative shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  style={{ width: `${Math.min(100, Math.max(6, techProgress * 100))}%` }}
                >
                  {/* Subtle Shimmer Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
