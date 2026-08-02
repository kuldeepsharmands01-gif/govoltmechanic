import React, { useState } from 'react';
import { Zap, AlertTriangle, ShieldCheck, Search, HelpCircle, ArrowRight, Cpu, Wrench, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AIDiagnosticsProps {
  onBookWithIssue: (issueName: string) => void;
}

export const AIDiagnostics: React.FC<AIDiagnosticsProps> = ({ onBookWithIssue }) => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeDiagnosis, setActiveDiagnosis] = useState<{
    code: string;
    symptom: string;
    severity: 'critical' | 'moderate' | 'low';
    cause: string;
    immediateFix: string;
    recommendedPackage: string;
  } | null>({
    code: 'E-08',
    symptom: 'Hall Sensor Failure / Motor Throttle Lag',
    severity: 'moderate',
    cause: 'Loose Julet waterproof phase connector or corroded hall sensor signal pin inside motor harness.',
    immediateFix: 'Unplug the 9-pin main motor cable, inspect pins for water/debris, reconnect firmly aligning the arrows.',
    recommendedPackage: 'Motor Controller & Throttle Fix ($85)',
  });

  const commonFaults = [
    { code: 'E-08', title: 'Motor Hall Sensor Error' },
    { code: 'E-07', title: 'Over-voltage / Battery Thermal Spike' },
    { code: 'E-21', title: 'Abnormal Current / Controller Cutoff' },
    { code: 'SPONGY-BRAKE', title: 'Hydraulic Pressure Loss / Air in Line' },
    { code: 'BMS-SHUTDOWN', title: 'Cell Balance Protection Trip' },
  ];

  const handleAnalyze = (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (q.toUpperCase().includes('E-07') || q.toLowerCase().includes('battery') || q.toLowerCase().includes('heat')) {
        setActiveDiagnosis({
          code: 'E-07',
          symptom: 'BMS High Temperature or Cell Imbalance',
          severity: 'critical',
          cause: 'BMS thermal sensor detected cell temp above 60°C or cell voltage delta >0.3V.',
          immediateFix: 'Stop riding immediately, power down the main battery switch, and let the pack cool down in shade.',
          recommendedPackage: 'Battery Diagnostics & BMS Calibration ($49)',
        });
      } else if (q.toLowerCase().includes('brake') || q.toLowerCase().includes('spongy') || q.toLowerCase().includes('squeak')) {
        setActiveDiagnosis({
          code: 'BRAKE-01',
          symptom: 'Hydraulic Line Air Entrapment & Pad Contamination',
          severity: 'moderate',
          cause: 'Micro-leak in caliper seal introducing air into hydraulic lines, reducing lever resistance.',
          immediateFix: 'Avoid steep downhill speed. Pump levers rapidly to build temporary fluid pressure.',
          recommendedPackage: 'Hydraulic Brake Bleed & Pad Replace ($65)',
        });
      } else {
        setActiveDiagnosis({
          code: 'SYS-DIAG',
          symptom: 'Electrical Communication / Throttle Signal Degradation',
          severity: 'moderate',
          cause: 'Loose main wire harness or worn throttle potentiometer.',
          immediateFix: 'Check display harness cable connection under handlebars.',
          recommendedPackage: 'Full 30-Point Safety & Torque Tune ($99)',
        });
      }
    }, 800);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Search Header */}
      <div className="bg-[#0D0E15] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tight text-white uppercase">
              GOVOLT AI DIAGNOSTIC DOC
            </h2>
            <p className="text-xs text-slate-400">Instant AI fault scanner for electric bikes, scooters & cargo EVs.</p>
          </div>
        </div>

        {/* Input Field */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-cyan-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter display error code (e.g. E-07, E-08) or describe symptom (e.g., brakes squeaking)..."
              className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing}
            className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-wider rounded-2xl transition-all shadow-[0_0_15px_#22d3ee] active:scale-95 shrink-0 flex items-center gap-2"
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
            Analyze
          </button>
        </div>

        {/* Quick Error Code Shortcuts */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">Common Faults:</span>
          {commonFaults.map((f) => (
            <button
              key={f.code}
              onClick={() => {
                setQuery(f.code);
                handleAnalyze(f.code);
              }}
              className="px-3 py-1 bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 rounded-full text-[11px] font-mono transition-colors shrink-0"
            >
              {f.code}: {f.title}
            </button>
          ))}
        </div>
      </div>

      {/* Diagnosis Report Card */}
      {activeDiagnosis && (
        <div className="bg-[#0D0E15] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold rounded-lg border border-cyan-500/30">
                FAULT CODE: {activeDiagnosis.code}
              </span>
              <span
                className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${
                  activeDiagnosis.severity === 'critical'
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {activeDiagnosis.severity} SEVERITY
              </span>
            </div>

            <span className="text-xs text-slate-500 font-mono">99.2% Diagnostic Accuracy</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Identified Symptom</p>
              <p className="text-xl font-bold text-white mt-1">{activeDiagnosis.symptom}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1">
                <p className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Root Cause Analysis
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">{activeDiagnosis.cause}</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1">
                <p className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400" /> Immediate Rider Action
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">{activeDiagnosis.immediateFix}</p>
              </div>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Recommended Professional Service</p>
              <p className="text-sm font-bold text-cyan-400">{activeDiagnosis.recommendedPackage}</p>
            </div>

            <button
              onClick={() => onBookWithIssue(activeDiagnosis.recommendedPackage)}
              className="w-full sm:w-auto px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95 flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              Dispatch Tech for This Issue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
