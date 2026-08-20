import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, Shield, Layers, Plus, Minus, RefreshCw, Radio, Truck, CheckCircle, Clock, Bell, Settings, X, Building2, Star, Phone, CheckCircle2, Maximize2, Minimize2, MoveVertical } from 'lucide-react';
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
  
  // Resizable Map States
  const [mapHeight, setMapHeight] = useState<number>(620);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartYRef = useRef<number>(0);
  const dragStartHeightRef = useRef<number>(620);

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

  // Handle Resize Dragging (Mouse + Touch)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = e.clientY - dragStartYRef.current;
      const newHeight = Math.min(960, Math.max(420, dragStartHeightRef.current + deltaY));
      setMapHeight(newHeight);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaY = e.touches[0].clientY - dragStartYRef.current;
      const newHeight = Math.min(960, Math.max(420, dragStartHeightRef.current + deltaY));
      setMapHeight(newHeight);
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleStartDrag = (clientY: number) => {
    setIsDragging(true);
    dragStartYRef.current = clientY;
    dragStartHeightRef.current = mapHeight;
  };

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
            '⚡ GOVOLT ETA Alert',
            `${appointment.technician.name} is ${remainingMinutes} mins away (${remainingDistanceMiles} km)! Please make your vehicle accessible.`
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
    <div
      className={`transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-3 sm:p-6 bg-slate-900/90 backdrop-blur-2xl flex flex-col'
          : 'flex-1 flex flex-col relative'
      }`}
    >
      <div
        style={{ height: isFullscreen ? '100%' : `${mapHeight}px` }}
        className="w-full bg-slate-900 border border-slate-300 rounded-3xl relative overflow-hidden flex flex-col shadow-lg transition-all duration-150"
      >
        {/* Background Cyber Grid */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

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
              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-target" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Grid Blocks (City Blocks) */}
            <g stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none">
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
              ))}
            </g>

            {/* City Road Network */}
            <g stroke="rgba(255,255,255,0.18)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* Main Arterial Avenues */}
              <path d="M 50 180 L 750 180" />
              <path d="M 50 240 L 750 240" />
              <path d="M 50 430 L 750 430" />
              <path d="M 180 50 L 180 550" />
              <path d="M 350 50 L 350 550" />
              <path d="M 480 50 L 480 550" />
              <path d="M 620 50 L 620 550" />
              {/* Diagonal Highway */}
              <path d="M 80 500 L 700 100" stroke="rgba(239,68,68,0.25)" strokeWidth="12" />
            </g>

            {/* Road Inner Dash Markings */}
            <g stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="6 6" fill="none">
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
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeOpacity="0.3"
                  filter="url(#glow-red)"
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
                  <circle r="22" fill="#ef4444" opacity="0.15">
                    <animate attributeName="r" values="18;26;18" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0.05;0.25" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle r="16" fill="#0A0B10" stroke="#ef4444" strokeWidth="2" opacity="0.95" />
                  <circle r="6" fill="#ef4444" />
                  <text y="-22" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="bold" className="uppercase tracking-widest font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
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

            {/* Customer Destination Pin (Pradeep) */}
            <g transform={`translate(${targetX}, ${targetY})`}>
              {/* Pulsing Radial Aura */}
              <circle r="28" fill="#ef4444" opacity="0.15">
                <animate attributeName="r" values="20;36;20" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle r="12" fill="#ef4444" filter="url(#glow-target)" />
              <circle r="4" fill="#ffffff" />
              {/* Customer Pin Label - PRADEEP */}
              <g transform="translate(0, -22)">
                <rect x="-70" y="-12" width="140" height="20" rx="10" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
                <text y="2" textAnchor="middle" fill="#b91c1c" fontSize="9" fontWeight="900" className="font-sans tracking-wider uppercase">
                  PRADEEP (YOUR LOCATION)
                </text>
              </g>
            </g>

            {/* 3. Technician Locations Pins */}
            {showTechnicians && (
              <>
                {/* Active En Route Van */}
                {appointment && (
                  <g transform={`translate(${techCoords.x}, ${techCoords.y})`}>
                    <circle r="24" fill="#ef4444" opacity="0.25">
                      <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    {/* Van Icon Vector */}
                    <g transform="translate(-6, -6) scale(0.6)" fill="#ffffff">
                      <path d="M0 4C0 1.79 1.79 0 4 0H12L16 5V14C16 15.1 15.1 16 14 16H2C0.9 16 0 15.1 0 14V4Z" />
                      <circle cx="4" cy="16" r="2" fill="#000" />
                      <circle cx="12" cy="16" r="2" fill="#000" />
                    </g>
                    {/* Moving Tech Label */}
                    <g transform="translate(0, -20)">
                      <rect x="-48" y="-10" width="96" height="15" rx="7.5" fill="#ffffff" stroke="#ef4444" strokeWidth="1" />
                      <text y="1" textAnchor="middle" fill="#b91c1c" fontSize="8" fontWeight="800" className="font-sans uppercase">
                        {appointment.technician.name.split(' ')[0]} (EN ROUTE)
                      </text>
                    </g>
                  </g>
                )}

                {/* Other Standby Techs on Map */}
                {TECHNICIANS.filter((t) => t.id !== 'tech-1').map((tech, idx) => {
                  const offsets = [
                    { x: 380, y: 160 },
                    { x: 530, y: 440 },
                    { x: 260, y: 310 },
                    { x: 670, y: 360 },
                  ];
                  const pos = offsets[idx % offsets.length];
                  return (
                    <g
                      key={tech.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedTech(tech);
                        setSelectedHub(null);
                        setSelectedSpot(null);
                      }}
                    >
                      <circle r="14" fill="#1e293b" stroke="#f87171" strokeWidth="1.5" />
                      <circle r="5" fill="#f87171" />
                      <g transform="translate(0, -18)">
                        <rect x="-35" y="-9" width="70" height="14" rx="7" fill="#ffffff" stroke="#f87171" strokeWidth="1" opacity="0.95" />
                        <text y="1" textAnchor="middle" fill="#991b1b" fontSize="7.5" fontWeight="700" className="font-sans uppercase">
                          {tech.name.split(' ')[0]} • STANDBY
                        </text>
                      </g>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>

        {/* Map Header Toolbar with Resize & Filter Controls */}
        <div className="relative z-10 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
          {/* Top Left Title Badge */}
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl border border-slate-300 px-3 py-1.5 rounded-2xl pointer-events-auto shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-black">
              LIVE WORKSHOP VAN GPS
            </span>
          </div>

          {/* Top Right Quick Controls */}
          <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
            {/* Map Size Selector Pill */}
            <div className="hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-2xl border border-slate-300 p-1 rounded-2xl shadow-sm">
              <button
                onClick={() => {
                  setIsFullscreen(false);
                  setMapHeight(480);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                  !isFullscreen && mapHeight <= 500
                    ? 'bg-red-600 text-white font-black shadow-sm'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
                title="Compact Map Height (480px)"
              >
                Compact
              </button>
              <button
                onClick={() => {
                  setIsFullscreen(false);
                  setMapHeight(620);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                  !isFullscreen && mapHeight > 500 && mapHeight < 750
                    ? 'bg-red-600 text-white font-black shadow-sm'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
                title="Standard Map Height (620px)"
              >
                Standard
              </button>
              <button
                onClick={() => {
                  setIsFullscreen(false);
                  setMapHeight(820);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                  !isFullscreen && mapHeight >= 750
                    ? 'bg-red-600 text-white font-black shadow-sm'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
                title="Expanded Map Height (820px)"
              >
                Expanded
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                  isFullscreen
                    ? 'bg-red-600 text-white font-black shadow-sm'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
                title={isFullscreen ? 'Exit Fullscreen Mode (ESC)' : 'Open Fullscreen Map View'}
              >
                {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                <span>{isFullscreen ? 'Exit' : 'Full'}</span>
              </button>
            </div>

            {/* Filter Toggle Pill Bar */}
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-2xl border border-slate-300 p-1 rounded-2xl shadow-sm">
              {/* Preset ALL */}
              <button
                onClick={() => {
                  setFilterLayer('all');
                  setShowHubs(true);
                  setShowTechnicians(true);
                  setShowRecentSpots(true);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                  filterLayer === 'all' && showHubs && showTechnicians && showRecentSpots
                    ? 'bg-red-600 text-white shadow-sm scale-105'
                    : 'bg-slate-100 text-slate-700 hover:text-black hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span className="hidden sm:inline">All</span>
              </button>

              {/* Active Hubs Toggle */}
              <button
                onClick={() => {
                  const nextState = !showHubs;
                  setShowHubs(nextState);
                  if (nextState && !showTechnicians && !showRecentSpots) setFilterLayer('hubs');
                  else if (nextState && showTechnicians && showRecentSpots) setFilterLayer('all');
                }}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 border ${
                  showHubs
                    ? 'bg-red-50 text-red-700 border-red-300 shadow-sm'
                    : 'bg-slate-100 text-slate-500 border-transparent hover:text-slate-700'
                }`}
              >
                <Building2 className="w-3 h-3 text-red-600" />
                <span>Hubs</span>
              </button>

              {/* Technician Locations Toggle */}
              <button
                onClick={() => {
                  const nextState = !showTechnicians;
                  setShowTechnicians(nextState);
                  if (nextState && !showHubs && !showRecentSpots) setFilterLayer('technicians');
                  else if (nextState && showHubs && showRecentSpots) setFilterLayer('all');
                }}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 border ${
                  showTechnicians
                    ? 'bg-red-50 text-red-700 border-red-300 shadow-sm'
                    : 'bg-slate-100 text-slate-500 border-transparent hover:text-slate-700'
                }`}
              >
                <Truck className="w-3 h-3 text-red-600" />
                <span>Vans</span>
              </button>

              {/* Recent Service Spots Toggle */}
              <button
                onClick={() => {
                  const nextState = !showRecentSpots;
                  setShowRecentSpots(nextState);
                  if (nextState && !showHubs && !showTechnicians) setFilterLayer('recent_spots');
                  else if (nextState && showHubs && showTechnicians) setFilterLayer('all');
                }}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 border ${
                  showRecentSpots
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                    : 'bg-slate-100 text-slate-500 border-transparent hover:text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Spots</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5-Min Arrival Alert Floating Banner Toast */}
        {showInAppAlert && appointment && (
          <div className="absolute top-16 left-4 right-16 sm:right-auto sm:max-w-md z-20 pointer-events-auto bg-white border border-red-500 p-4 rounded-2xl shadow-xl backdrop-blur-xl animate-bounce-short">
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-wider border border-red-200">
                    5-MIN ARRIVAL ALERT
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {remainingDistanceMiles} km away
                  </span>
                </div>
                <p className="text-xs font-black text-black">
                  {appointment.technician.name} is arriving shortly!
                </p>
                <p className="text-[11px] text-slate-600">
                  Hi Pradeep, your mobile workshop van is near. Doorstep service with 10-day warranty.
                </p>
              </div>
              <button
                onClick={() => setShowInAppAlert(false)}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Map Control Buttons (Zoom / Center / Simulation / Fullscreen) */}
        <div className="absolute top-20 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 2))}
            className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-slate-300 hover:border-red-600 rounded-xl flex items-center justify-center text-slate-800 transition-colors shadow-sm active:scale-95"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
            className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-slate-300 hover:border-red-600 rounded-xl flex items-center justify-center text-slate-800 transition-colors shadow-sm active:scale-95"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-slate-300 hover:border-red-600 rounded-xl flex items-center justify-center text-red-600 transition-colors shadow-sm active:scale-95"
            title="Reset Zoom"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`w-10 h-10 bg-white/90 backdrop-blur-xl border rounded-xl flex items-center justify-center transition-colors shadow-sm active:scale-95 ${
              isSimulating ? 'border-red-500 text-red-600' : 'border-slate-300 text-slate-400'
            }`}
            title={isSimulating ? 'Pause GPS Simulation' : 'Resume GPS Simulation'}
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-slate-300 hover:border-red-600 rounded-xl flex items-center justify-center text-slate-700 hover:text-red-600 transition-colors shadow-sm active:scale-95"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>

        {/* Selected Map Pin Interactive Popover Card */}
        {(selectedSpot || selectedTech || selectedHub) && (
          <div className="absolute bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-20 pointer-events-auto bg-white border border-slate-300 p-4 rounded-2xl shadow-xl backdrop-blur-2xl animate-fade-in">
            <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {selectedSpot && (
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {selectedTech && (
                  <div className="p-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                    <Truck className="w-4 h-4" />
                  </div>
                )}
                {selectedHub && (
                  <div className="p-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                    <Building2 className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-slate-500 block">
                    {selectedSpot ? 'RECENT DOORSTEP SERVICE' : selectedTech ? 'MOBILE WORKSHOP UNIT' : 'GOVOLT SERVICE HUB'}
                  </span>
                  <h4 className="text-sm font-black text-black leading-snug">
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
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details Content */}
            {selectedSpot && (
              <div className="space-y-2 text-xs">
                <p className="text-slate-700 font-medium">{selectedSpot.address}</p>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500">Customer & Service</p>
                    <p className="font-bold text-emerald-700">{selectedSpot.customerName} • {selectedSpot.serviceType}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-amber-800 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{selectedSpot.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Tech: <strong className="text-black">{selectedSpot.techName}</strong></span>
                  <span className="font-mono">{selectedSpot.completedAt}</span>
                </div>
              </div>
            )}

            {selectedTech && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <img src={selectedTech.avatar} alt={selectedTech.name} className="w-10 h-10 rounded-xl object-cover border border-slate-300" />
                  <div>
                    <p className="text-xs font-bold text-red-600">{selectedTech.specialty}</p>
                    <p className="text-[10px] text-slate-500">{selectedTech.vanId}</p>
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Rating & Repairs</span>
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500" /> {selectedTech.rating} ({selectedTech.completedRepairs} done)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="text-slate-500">Location: {selectedTech.location.address.split(',')[0]}</span>
                  <a href={`tel:${selectedTech.phone}`} className="text-red-600 font-bold hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                </div>
              </div>
            )}

            {selectedHub && (
              <div className="space-y-2 text-xs">
                <p className="text-slate-700">{selectedHub.address}</p>
                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Tech Vans</p>
                    <p className="text-base font-black text-black">{selectedHub.techsAvailable} Available</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-[10px] text-red-700 uppercase font-bold">Battery Swaps</p>
                    <p className="text-base font-black text-red-700">{selectedHub.batterySwapsAvailable} Ready</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Floating Telemetry Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row justify-between items-end gap-3 pointer-events-none">
          {/* Telemetry Log */}
          <div className="bg-white/95 backdrop-blur-xl border border-slate-300 p-4 rounded-2xl max-w-xs w-full pointer-events-auto shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" /> Dispatch Updates
              </span>
              <span className="text-[9px] font-mono text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1.5 font-bold">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
                </span>
                LIVE GPS
              </span>
            </div>

            <div className="space-y-2.5">
              {techProgress >= 1 ? (
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-7 bg-emerald-600 rounded-full shrink-0 animate-pulse"></div>
                  <div>
                    <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Arrived at Destination
                    </p>
                    <p className="text-[10px] text-slate-500">Technician is meeting Pradeep with mobile workshop equipment.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <div className="relative w-1.5 h-7 bg-slate-200 rounded-full shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-red-600 animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-xs font-black text-black flex items-center gap-1.5">
                      <span>Route Optimized for Pradeep</span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    </p>
                    <p className="text-[10px] text-slate-600">
                      -{Math.max(1, Math.round(remainingMinutes * 0.2))} min ETA • Clear traffic
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  VAN SPEED: <strong className="text-red-600">{speedMph} KM/H</strong>
                </span>
                <span>DIST: <strong className="text-black font-bold">{remainingDistanceMiles} KM</strong></span>
              </div>
            </div>
          </div>

          {/* ETA Highlight Badge & Real-Time Animated Route Progress Bar */}
          {appointment && (
            <div className="bg-white/95 backdrop-blur-xl border border-red-300 p-4 rounded-2xl pointer-events-auto shadow-md flex flex-col gap-2.5 min-w-[250px]">
              <div className="flex items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    Doorstep Arrival
                  </p>
                  <p className="text-3xl font-mono font-black text-red-600 leading-tight">
                    {techProgress >= 1 ? 'ARRIVED' : `${remainingMinutes} MINS`}
                  </p>
                </div>
                <div className="relative w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    GPS ROUTE PROGRESS
                  </span>
                  <span className="text-red-600 font-black tracking-wider">{Math.round(techProgress * 100)}%</span>
                </div>
                <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-[1px]">
                  <div
                    className="h-full bg-red-600 rounded-full transition-all duration-500 relative"
                    style={{ width: `${Math.min(100, Math.max(6, techProgress * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Bottom Resize Handle Bar (only when not fullscreen) */}
      {!isFullscreen && (
        <div
          onMouseDown={(e) => handleStartDrag(e.clientY)}
          onTouchStart={(e) => {
            if (e.touches.length > 0) handleStartDrag(e.touches[0].clientY);
          }}
          className={`w-full py-2 flex items-center justify-center cursor-row-resize select-none group transition-all ${
            isDragging ? 'opacity-100' : 'opacity-70 hover:opacity-100'
          }`}
          title="Drag vertically to resize map height"
        >
          <div className="px-4 py-1 rounded-full bg-white border border-slate-300 group-hover:border-red-500 flex items-center gap-2 shadow-sm transition-all">
            <MoveVertical className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-600 group-hover:text-red-600">
              RESIZE MAP ({mapHeight}PX)
            </span>
            <div className="flex items-center gap-0.5 opacity-60">
              <span className="w-1 h-1 rounded-full bg-slate-400"></span>
              <span className="w-1 h-1 rounded-full bg-slate-400"></span>
              <span className="w-1 h-1 rounded-full bg-slate-400"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapTracking;
