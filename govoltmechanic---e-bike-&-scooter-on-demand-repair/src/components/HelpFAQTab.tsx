import React, { useState } from 'react';
import {
  Search,
  HelpCircle,
  Sparkles,
  Zap,
  Battery,
  Wrench,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Siren,
  Phone,
  RefreshCw,
  Info,
  BookOpen,
  Cpu,
  ArrowRight,
  Gauge
} from 'lucide-react';
import { Vehicle } from '../types';

interface FAQItem {
  id: string;
  category: 'battery' | 'brakes' | 'motor' | 'electrical' | 'tires' | 'charging';
  question: string;
  vehicleModels: string[];
  summary: string;
  difficulty: 'Easy DIY' | 'Intermediate' | 'Workshop Only';
  errorCode?: string;
  steps: string[];
  toolsNeeded: string[];
  preventativeTip: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'battery',
    question: 'Why does my E-Scooter battery percentage drop rapidly under acceleration or uphill climbs?',
    vehicleModels: ['Ather 450X', 'Ola S1 Pro', 'TVS iQube', 'Revolt RV400'],
    summary: 'This is usually caused by voltage sag under heavy current draw, cell imbalance in the pack, or thermal BMS throttling.',
    difficulty: 'Easy DIY',
    errorCode: 'BMS-VOLT-SAG',
    steps: [
      'Allow the battery to cool down for 20 minutes before inspecting or charging.',
      'Perform a 100% full trickle charge cycle uninterrupted to allow the BMS internal balancer to equalize cell voltages.',
      'Inspect battery terminal connector plugs for carbon deposits, loose contact pins, or moisture.',
      'Check tire pressure—underinflated tires increase motor load by up to 35%.'
    ],
    toolsNeeded: ['Tire Pressure Gauge', 'Contact Cleaner Spray', 'Hex Key Set'],
    preventativeTip: 'Avoid accelerating at maximum throttle immediately after starting from a cold state.'
  },
  {
    id: 'faq-2',
    category: 'brakes',
    question: 'How do I fix squeaking or spongy hydraulic disc brakes on my E-Bike or Scooter?',
    vehicleModels: ['Ather 450X', 'Revolt RV400', 'Ultraviolette F77', 'Super73'],
    summary: 'Spongy levers indicate air bubbles in the hydraulic fluid line, while squeal is caused by brake pad glazing or oil contamination.',
    difficulty: 'Intermediate',
    steps: [
      'Clean brake rotors thoroughly using isopropyl alcohol or dedicated brake cleaner.',
      'Remove brake pads and lightly sand the pad friction surface with 220-grit sandpaper to remove glazed layer.',
      'If lever pulls all the way to the handlebar, perform a mineral oil hydraulic line bleed using a bleed syringe kit.',
      'Check caliper alignment bolts and torque to 6-8 Nm.'
    ],
    toolsNeeded: ['Hydraulic Bleed Kit', 'Mineral Oil / DOT 4 Fluid', '220-grit Sandpaper', 'Torx Wrench'],
    preventativeTip: 'Never spray chain lubricant or silicone sprays anywhere near brake rotors or calipers.'
  },
  {
    id: 'faq-3',
    category: 'electrical',
    question: 'What should I do if the touchscreen display or smart dashboard freezes / turns black?',
    vehicleModels: ['Ather 450X Gen 3', 'Ola S1 Pro', 'Hero Vida V1'],
    summary: 'Smart Android/Linux based dashboards may freeze due to cellular OTA sync conflicts, thermal shutdown, or low 12V auxiliary battery voltage.',
    difficulty: 'Easy DIY',
    errorCode: 'DASH-BOOT-LOOP',
    steps: [
      'Perform a hard display reboot: Hold down both brake levers + Start/Reset button simultaneously for 10 seconds.',
      'Inspect the main under-seat 12V fuse switch or key master breaker.',
      'Ensure the vehicle is parked in a shaded area if ambient temperatures exceed 42°C.',
      'If error persists, clear Bluetooth companion app cache and re-pair the phone.'
    ],
    toolsNeeded: ['None (Hard Combination Reboot)'],
    preventativeTip: 'Install the latest vehicle firmware updates over stable Wi-Fi during off-peak hours.'
  },
  {
    id: 'faq-4',
    category: 'charging',
    question: 'Why is my portable charger LED flashing Red / Amber and refusing to charge?',
    vehicleModels: ['All Indian & Global EV Scooters', 'TVS iQube', 'Bajaj Chetak'],
    summary: 'A flashing red light indicates charger thermal protection mode, AC wall socket earthing fault, or BMS high-voltage lock.',
    difficulty: 'Easy DIY',
    errorCode: 'CHG-EARTH-FAULT',
    steps: [
      'Verify wall outlet earthing (grounding) using a 3-pin socket tester—most EV chargers auto-isolate if earthing resistance is high.',
      'Disconnect charger from wall for 3 minutes to reset internal thermal fuse.',
      'Ensure charger cooling fan intake vents are free of dust or obstructions.',
      'Check vehicle charging port pins for debris or bent contact prongs.'
    ],
    toolsNeeded: ['Socket Tester', 'Compressed Air Can'],
    preventativeTip: 'Avoid using cheap extension cords without surge protection for heavy 15A EV charging.'
  },
  {
    id: 'faq-5',
    category: 'motor',
    question: 'What causes stuttering or jerking sensations when opening the throttle from standstill?',
    vehicleModels: ['Revolt RV400', 'Ather 450X', 'Ola S1 Air', 'Ather Rizta'],
    summary: 'Motor stuttering is typically caused by Hall sensor alignment drift, loose phase wire connectors, or throttle potentiometer wear.',
    difficulty: 'Workshop Only',
    errorCode: 'HALL-SENS-FAIL',
    steps: [
      'Turn off key ignition and switch off main battery breaker.',
      'Inspect the 3-phase heavy motor cable connector for thermal scorching or loose locking tabs.',
      'Check throttle twist assembly for smooth mechanical spring return without sticky spots.',
      'If phase wires are intact, an AI diagnostic tool or technician motor scanner is needed to test Hall sensor voltage signals (5V DC).'
    ],
    toolsNeeded: ['Multimeter', 'Insulated Screwdrivers', 'GOVOLT OBD Scanner'],
    preventativeTip: 'Do not wash the handlebar switchgear or motor hub directly with high-pressure water jets.'
  },
  {
    id: 'faq-6',
    category: 'tires',
    question: 'How do I prevent frequent punctures and rim damage on tubeless E-Scooter wheels?',
    vehicleModels: ['Ola S1 Pro', 'Ather 450X', 'Bajaj Chetak', 'TVS iQube'],
    summary: 'Electric scooters have heavy wheel hub loads and instant torque, making them susceptible to pinch flats and rim bends if under-inflated.',
    difficulty: 'Easy DIY',
    steps: [
      'Maintain precise front (30 PSI) and rear (33-36 PSI) tire pressure measured cold once every week.',
      'Inject high-grade Kevlar fiber tire sealant armor (approx. 120ml per tire) into tubeless valves.',
      'Inspect rims for lip dents or micro-cracks after hitting deep potholes.',
      'Replace tires when tread depth falls below 1.5mm to avoid road debris penetrations.'
    ],
    toolsNeeded: ['Digital Pressure Gauge', 'Sealant Injector Tool', 'Portable Air Pump'],
    preventativeTip: 'Always check cold tire pressure before starting long commutes.'
  }
];

interface HelpFAQTabProps {
  vehicles: Vehicle[];
  onOpenBooking: () => void;
  onOpenSOS: () => void;
  specialistPhone: string;
}

export const HelpFAQTab: React.FC<HelpFAQTabProps> = ({
  vehicles,
  onOpenBooking,
  onOpenSOS,
  specialistPhone
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // AI Grounded Search State
  const [aiCustomQuery, setAiCustomQuery] = useState('');
  const [selectedVehicleForAi, setSelectedVehicleForAi] = useState<string>(
    vehicles[0] ? `${vehicles[0].make} ${vehicles[0].model}` : 'Ather 450X Gen 3'
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Completed checklist tracking for AI result
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Filter FAQs based on search and category
  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const qLower = searchQuery.toLowerCase();
    const matchesSearch =
      faq.question.toLowerCase().includes(qLower) ||
      faq.summary.toLowerCase().includes(qLower) ||
      faq.vehicleModels.some((m) => m.toLowerCase().includes(qLower)) ||
      (faq.errorCode && faq.errorCode.toLowerCase().includes(qLower));

    return matchesCategory && matchesSearch;
  });

  // Handle AI Grounded Troubleshooting
  const handleRunAiGroundedSearch = async (queryToRun?: string) => {
    const query = queryToRun || aiCustomQuery;
    if (!query.trim()) return;

    setIsAiLoading(true);
    setAiError(null);
    setAiResult(null);
    setCompletedSteps({});

    try {
      const response = await fetch('/api/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          vehicleModel: selectedVehicleForAi
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch grounded troubleshooting data.');
      }

      setAiResult(data);
    } catch (err: any) {
      console.error('AI Grounding Error:', err);
      setAiError(err.message || 'Troubleshooting request failed. Please check connection.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleStepCompleted = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-[#0E131F] via-[#0F172A] to-[#0A0D18] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.15)] space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Grounded Web Search & Repair Knowledgebase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              E-Bike & Scooter Help & Troubleshooting Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Search our expert DIY repair guides or enter any issue or error code to query real-time Google Search Grounded diagnostic intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenSOS}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all flex items-center gap-2"
            >
              <Siren className="w-4 h-4 text-white animate-bounce" />
              <span>Emergency SOS</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-black" />
              <span>Book On-Demand Mechanic</span>
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative z-10 pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-cyan-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search repair guides by keyword, error code (e.g. BMS-VOLT-SAG), or vehicle model (Ather, Ola, Revolt)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-black/70 border border-cyan-500/40 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs text-slate-400 hover:text-white font-mono"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none relative z-10">
          {[
            { id: 'all', label: 'All Repair Guides', icon: BookOpen },
            { id: 'battery', label: 'Battery & BMS', icon: Battery },
            { id: 'brakes', label: 'Hydraulic Brakes', icon: ShieldCheck },
            { id: 'electrical', label: 'Electrical & Display', icon: Zap },
            { id: 'motor', label: 'Motor & Controller', icon: Cpu },
            { id: 'charging', label: 'Charger & Grid', icon: RefreshCw },
            { id: 'tires', label: 'Tires & Rims', icon: Gauge },
          ].map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-cyan-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Grounded Live Diagnostic Assistant Box */}
      <div className="bg-[#0D0E15] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 font-mono text-[9px] font-bold uppercase rounded border border-cyan-500/30">
                  REAL-TIME GROUNDING
                </span>
                <span className="text-[10px] text-slate-400 font-mono">GEMINI 3.6 SEARCH POWERED</span>
              </div>
              <h3 className="text-base font-black text-white">Ask AI for Instant Grounded Repair Fix</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">VEHICLE:</span>
            <select
              value={selectedVehicleForAi}
              onChange={(e) => setSelectedVehicleForAi(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-cyan-400"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={`${v.make} ${v.model}`}>
                  {v.make} {v.model}
                </option>
              ))}
              <option value="Ather 450X Gen 3">Ather 450X Gen 3</option>
              <option value="Ola S1 Pro Gen 2">Ola S1 Pro Gen 2</option>
              <option value="Revolt RV400">Revolt RV400</option>
              <option value="TVS iQube ST">TVS iQube ST</option>
            </select>
          </div>
        </div>

        {/* Input & Quick Chips */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Describe problem (e.g., 'Motor loses power after 10 mins', 'Ather brake sensor error', 'Ola S1 bluetooth keyless unlock failing')..."
              value={aiCustomQuery}
              onChange={(e) => setAiCustomQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAiGroundedSearch()}
              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleRunAiGroundedSearch()}
              disabled={isAiLoading || !aiCustomQuery.trim()}
              className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Grounding Web Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Get Grounded AI Fix</span>
                </>
              )}
            </button>
          </div>

          {/* Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
            <span className="font-bold text-slate-500 shrink-0">Try Asking:</span>
            {[
              'Ather 450X BMS error code after heavy rain',
              'Ola S1 Pro reverse mode locked',
              'Revolt RV400 throttle power loss on incline',
              'TVS iQube fast charger red light warning',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setAiCustomQuery(chip);
                  handleRunAiGroundedSearch(chip);
                }}
                className="px-2.5 py-1 bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-all shrink-0 font-medium"
              >
                "{chip}"
              </button>
            ))}
          </div>
        </div>

        {/* AI Result Card */}
        {aiError && (
          <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl text-xs text-red-300 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {aiResult && (
          <div className="mt-4 p-5 bg-[#090B12] border border-cyan-500/40 rounded-2xl space-y-4 animate-fade-in shadow-[0_0_25px_rgba(34,211,238,0.15)]">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  GROUNDED DIAGNOSIS SUMMARY
                </span>
                <h4 className="text-sm font-bold text-white mt-1">{aiResult.summary}</h4>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    aiResult.severity === 'critical'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : aiResult.severity === 'medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  SEVERITY: {aiResult.severity || 'MEDIUM'}
                </span>
              </div>
            </div>

            {/* Safety Warning if present */}
            {aiResult.safetyWarning && (
              <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block font-bold">HIGH-VOLTAGE SAFETY WARNING</strong>
                  <span>{aiResult.safetyWarning}</span>
                </div>
              </div>
            )}

            {/* Step-by-Step Interactive Checklist */}
            {aiResult.steps && aiResult.steps.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Recommended Interactive Repair Steps
                </p>
                <div className="space-y-2">
                  {aiResult.steps.map((step: any, idx: number) => {
                    const isDone = completedSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStepCompleted(idx)}
                        className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-3 ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-400 line-through'
                            : 'bg-white/5 border-white/10 text-slate-200 hover:border-cyan-500/40'
                        }`}
                      >
                        <button type="button" className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        <div>
                          <strong className="text-white block font-bold">{step.title || `Step ${idx + 1}`}</strong>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{step.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Required Tools */}
            {aiResult.toolsNeeded && aiResult.toolsNeeded.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-slate-400 text-[10px] uppercase font-mono">Tools Needed:</span>
                {aiResult.toolsNeeded.map((tool: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-white/5 border border-white/10 text-cyan-300 rounded text-[11px] font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}

            {/* Citations & Web References */}
            {aiResult.citations && aiResult.citations.length > 0 && (
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <p className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-cyan-400" /> Grounded Web Sources & Manual Citations
                </p>
                <div className="flex flex-wrap gap-2">
                  {aiResult.citations.map((c: any, i: number) => (
                    <a
                      key={i}
                      href={c.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 rounded-lg text-[10px] text-cyan-300 hover:underline flex items-center gap-1 truncate max-w-xs"
                    >
                      <span className="truncate">{c.title || c.uri}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              <span className="text-xs text-slate-400">
                Need professional mobile workshop assistance on-site?
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onOpenBooking}
                  className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl transition-all w-full sm:w-auto text-center"
                >
                  Book Mobile Repair
                </button>
                <button
                  onClick={onOpenSOS}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl transition-all w-full sm:w-auto text-center"
                >
                  Trigger Emergency SOS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Searchable FAQ List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Curated E-Bike & Scooter Repair Knowledgebase</span>
            </h3>
            <p className="text-xs text-slate-400">
              Showing {filteredFaqs.length} guide{filteredFaqs.length === 1 ? '' : 's'}
              {selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}
            </p>
          </div>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-8 bg-[#0D0E15] border border-white/10 rounded-3xl text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">No repair guides matched your search</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try searching with a broader keyword, or ask our Grounded AI diagnostic tool above for instant web assistance!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold text-white rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-[#0D0E15] border rounded-2xl transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Header row */}
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[9px] font-mono font-bold uppercase rounded border border-cyan-500/30">
                          {faq.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                            faq.difficulty === 'Easy DIY'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : faq.difficulty === 'Intermediate'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {faq.difficulty}
                        </span>
                        {faq.errorCode && (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[9px] font-mono rounded">
                            CODE: {faq.errorCode}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-white leading-snug">{faq.question}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{faq.summary}</p>
                    </div>

                    <div className="p-1.5 rounded-lg bg-white/5 text-cyan-400 shrink-0 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded detail body */}
                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-white/10 space-y-4 bg-black/30 animate-fade-in">
                      {/* Vehicle Compatibility */}
                      <div className="flex items-center gap-2 flex-wrap text-xs pt-3">
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Tested Models:</span>
                        {faq.vehicleModels.map((m, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-slate-300">
                            {m}
                          </span>
                        ))}
                      </div>

                      {/* Step by step */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Troubleshooting Procedure
                        </p>
                        <ol className="space-y-2 list-decimal list-inside text-xs text-slate-300">
                          {faq.steps.map((step, idx) => (
                            <li key={idx} className="bg-white/5 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Tools & Tip */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Recommended Tools</p>
                          <div className="flex flex-wrap gap-1">
                            {faq.toolsNeeded.map((tool, i) => (
                              <span key={i} className="text-xs text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded font-mono">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-1">
                          <p className="text-[10px] font-mono font-bold text-amber-400 uppercase">Preventative Care Tip</p>
                          <p className="text-xs text-amber-200/90 leading-relaxed">{faq.preventativeTip}</p>
                        </div>
                      </div>

                      {/* Bottom row: Run AI Grounded Search for this FAQ */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <button
                          onClick={() => {
                            setAiCustomQuery(faq.question);
                            handleRunAiGroundedSearch(faq.question);
                          }}
                          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Run Live Grounded Web Scan for this Issue →</span>
                        </button>

                        <button
                          onClick={onOpenBooking}
                          className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                        >
                          Request On-Site Service
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Emergency Specialist Contact Footer Bar */}
      <div className="p-5 bg-gradient-to-r from-red-950/40 via-red-900/20 to-[#0D0E15] border border-red-500/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Phone className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Stuck on the Road or Facing High Voltage Hazard?</h4>
            <p className="text-xs text-slate-400">Our mobile repair workshop is equipped with BMS diagnostic tools and hydraulic rescue kits.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
          <a
            href={`tel:${specialistPhone}`}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono font-extrabold text-xs rounded-xl transition-all border border-white/10"
          >
            Call {specialistPhone}
          </a>
          <button
            onClick={onOpenSOS}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          >
            Emergency SOS
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpFAQTab;
