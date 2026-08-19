import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  BatteryCharging,
  DollarSign,
  Award,
  ChevronRight,
  Sparkles,
  Radio,
  FileCheck,
  RotateCcw,
  CheckSquare,
  Square,
  Plus
} from 'lucide-react';
import { Appointment, RepairStatus, UserProfile, Vehicle } from '../types';
import { playEtaChime, triggerBrowserNotification } from '../utils/notifications';

interface TechnicianPortalProps {
  currentUser: UserProfile;
  appointments: Appointment[];
  onUpdateAppointmentStatus: (
    appointmentId: string,
    newStatus: RepairStatus,
    completionData?: {
      notes?: string;
      partsUsed?: string[];
      batteryHealth?: number;
    }
  ) => void;
  onAcceptServiceRequest: (appointmentId: string) => void;
  audioEnabled?: boolean;
}

export const TechnicianPortal: React.FC<TechnicianPortalProps> = ({
  currentUser,
  appointments,
  onUpdateAppointmentStatus,
  onAcceptServiceRequest,
  audioEnabled = true,
}) => {
  const [onDuty, setOnDuty] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'history' | 'inventory'>('active');

  // Checklist state for active in-progress job
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'BMS High-Voltage Scan & Cell Delta': true,
    'Hydraulic Brake Pressure & Pad Thickness': true,
    'Belt / Chain Tension & Alignment': true,
    'Waterproof Julet Wire Harness Audit': false,
    'Throttle Hall Sensor & Controller Signal': false,
    'Doorstep Test Ride & Safety Verification': false,
  });

  const [partsUsed, setPartsUsed] = useState<string[]>([
    'Synthetic High-Temp Belt Lube',
    'Brake Caliper Pad Shim Set',
  ]);
  const [newPartInput, setNewPartInput] = useState('');
  const [recordedBatteryHealth, setRecordedBatteryHealth] = useState<number>(96);
  const [technicianNotes, setTechnicianNotes] = useState<string>(
    'Re-torqued brake caliper bolts to 9.5 Nm. Flushed mineral brake line and updated BMS threshold settings. All 21 checkpoints certified.'
  );

  // Filter appointments for this technician
  const techId = currentUser.technicianId || 't1';
  const myAppointments = appointments.filter(
    (app) => app.technician.id === techId || !app.technician.id
  );

  // Active in-flight or assigned job
  const activeJob = myAppointments.find(
    (app) => app.status !== 'completed' && app.status !== 'cancelled'
  );

  // Completed jobs
  const completedJobs = myAppointments.filter((app) => app.status === 'completed');

  const totalEarnings = completedJobs.reduce((sum, j) => sum + Math.round(j.totalPrice * 0.75), 2450);

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddPart = () => {
    if (!newPartInput.trim()) return;
    setPartsUsed([...partsUsed, newPartInput.trim()]);
    setNewPartInput('');
  };

  const handleAdvanceStatus = (nextStatus: RepairStatus) => {
    if (!activeJob) return;

    if (audioEnabled) {
      playEtaChime();
    }

    if (nextStatus === 'completed') {
      onUpdateAppointmentStatus(activeJob.id, 'completed', {
        notes: technicianNotes,
        partsUsed,
        batteryHealth: recordedBatteryHealth,
      });
      triggerBrowserNotification(
        '✓ Service Completed',
        `Job #${activeJob.id} for ${activeJob.customerName} marked as completed with 10-day warranty.`
      );
    } else {
      onUpdateAppointmentStatus(activeJob.id, nextStatus);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-slate-100">
      {/* Top Technician Status & Duty Bar */}
      <div className="bg-[#0D0E15] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0D0E15] ${
                  onDuty ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                }`}
              ></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[10px] font-black uppercase rounded-md border border-amber-500/30">
                  MOBILE WORKSHOP TECH
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentUser.vanId || 'VAN-104 (Mobile Workshop)'}
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">{currentUser.name}</h2>
              <p className="text-xs text-slate-400">
                {currentUser.specialty || 'Master EV Systems & High-Voltage BMS'}
              </p>
            </div>
          </div>

          {/* Duty Status Switch & Quick Actions */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Duty Dispatch Status</p>
              <p className={`text-xs font-black uppercase font-mono ${onDuty ? 'text-green-400' : 'text-slate-400'}`}>
                {onDuty ? '● ON DUTY (READY FOR DISPATCH)' : '○ OFF DUTY (BREAK)'}
              </p>
            </div>

            <button
              onClick={() => setOnDuty(!onDuty)}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${
                onDuty
                  ? 'bg-green-500/15 border-green-500/40 text-green-400 hover:bg-green-500/25 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {onDuty ? 'Go Off Duty' : 'Go On Duty'}
            </button>
          </div>
        </div>

        {/* Technician KPI Metric Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Today's Payout</p>
            <p className="text-2xl font-black text-cyan-400 font-mono">₹{totalEarnings.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Completed Today</p>
            <p className="text-2xl font-black text-white font-mono">{completedJobs.length + 3} Jobs</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rating Score</p>
            <p className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1">
              ★ 4.98 <span className="text-[10px] text-slate-400 font-normal">(1,420 jobs)</span>
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Van Battery Stock</p>
            <p className="text-2xl font-black text-emerald-400 font-mono">6 Packs</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSubTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeSubTab === 'active'
              ? 'bg-cyan-500 text-black font-black shadow-[0_0_12px_#22d3ee]'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          Active Work Order {activeJob && <span className="px-1.5 py-0.2 bg-black text-cyan-400 text-[10px] rounded-full">1</span>}
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeSubTab === 'history'
              ? 'bg-cyan-500 text-black font-black shadow-[0_0_12px_#22d3ee]'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          Completed Services ({completedJobs.length})
        </button>
      </div>

      {/* ACTIVE WORK ORDER VIEW */}
      {activeSubTab === 'active' && (
        <div className="space-y-6">
          {activeJob ? (
            <div className="bg-[#0D0E15] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(34,211,238,0.15)] relative">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-black rounded-full uppercase tracking-widest border border-cyan-500/30 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    ACTIVE DISPATCH #{activeJob.id}
                  </span>
                  {activeJob.isEmergencySOS && (
                    <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-black rounded-full uppercase border border-red-500/40 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> EMERGENCY SOS
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-bold">Total Service Fee</span>
                  <p className="text-xl font-black text-cyan-400 font-mono">₹{activeJob.totalPrice.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Customer & Vehicle Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vehicle Card */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                  <img
                    src={activeJob.vehicle.image}
                    alt={activeJob.vehicle.model}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-400">{activeJob.vehicle.make}</p>
                    <h4 className="text-base font-black text-white truncate">{activeJob.vehicle.model}</h4>
                    <p className="text-xs font-mono text-emerald-400 font-bold">
                      {activeJob.vehicle.licensePlate || 'UP78 EV 450X'}
                    </p>
                  </div>
                </div>

                {/* Customer Card */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Customer</p>
                    <h4 className="text-base font-black text-white">{activeJob.customerName}</h4>
                    <p className="text-xs font-mono text-slate-300">{activeJob.customerPhone}</p>
                  </div>
                  <a
                    href={`tel:${activeJob.customerPhone}`}
                    className="px-4 py-2.5 bg-green-500 hover:bg-green-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(34,197,94,0.4)] flex items-center gap-1.5 active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Customer
                  </a>
                </div>
              </div>

              {/* Destination Address & Reported Issue */}
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Service Location: </span>
                    <span>{activeJob.address}</span>
                  </div>
                </div>

                {activeJob.notes && (
                  <div className="p-3 bg-white/5 rounded-xl text-xs text-amber-300/90 border border-amber-500/20 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Customer Reported Notes: </span>
                      <span>{activeJob.notes}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Status Progression Stage */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-400">Dispatch Stage Progress</span>
                  <span className="font-mono font-black text-cyan-400 uppercase">
                    Stage: {activeJob.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress Visual Bar */}
                <div className="grid grid-cols-4 gap-2">
                  <div
                    className={`h-2 rounded-full ${
                      ['dispatched', 'en_route', 'arrived', 'in_progress', 'completed'].includes(activeJob.status)
                        ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                        : 'bg-slate-800'
                    }`}
                  ></div>
                  <div
                    className={`h-2 rounded-full ${
                      ['en_route', 'arrived', 'in_progress', 'completed'].includes(activeJob.status)
                        ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                        : 'bg-slate-800'
                    }`}
                  ></div>
                  <div
                    className={`h-2 rounded-full ${
                      ['arrived', 'in_progress', 'completed'].includes(activeJob.status)
                        ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                        : 'bg-slate-800'
                    }`}
                  ></div>
                  <div
                    className={`h-2 rounded-full ${
                      ['in_progress', 'completed'].includes(activeJob.status)
                        ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                        : 'bg-slate-800'
                    }`}
                  ></div>
                </div>

                {/* Step Action Trigger Buttons */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                  {activeJob.status === 'dispatched' && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">Van Dispatched to Customer</h4>
                        <p className="text-xs text-slate-400">Ready to navigate to {activeJob.customerName}'s doorstep.</p>
                      </div>
                      <button
                        onClick={() => handleAdvanceStatus('en_route')}
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_#22d3ee] flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Navigation className="w-4 h-4 text-black" />
                        <span>Start Driving (Set En Route)</span>
                      </button>
                    </div>
                  )}

                  {activeJob.status === 'en_route' && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">Technician is En Route</h4>
                        <p className="text-xs text-slate-400">Live GPS tracking and ETA shared with rider.</p>
                      </div>
                      <button
                        onClick={() => handleAdvanceStatus('arrived')}
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 active:scale-95"
                      >
                        <MapPin className="w-4 h-4 text-black" />
                        <span>Confirm Arrival at Doorstep</span>
                      </button>
                    </div>
                  )}

                  {activeJob.status === 'arrived' && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">Arrived at Location</h4>
                        <p className="text-xs text-slate-400">Van parked. Ready to inspect EV with mobile workshop tools.</p>
                      </div>
                      <button
                        onClick={() => handleAdvanceStatus('in_progress')}
                        className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Wrench className="w-4 h-4 text-black" />
                        <span>Begin 21-Point Inspection & Repair</span>
                      </button>
                    </div>
                  )}

                  {activeJob.status === 'in_progress' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-cyan-400" />
                            Work in Progress: 21-Point Service Checklist
                          </h4>
                          <p className="text-xs text-slate-400">Verify and check all safety points before completion.</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-green-400">
                          {Object.values(checklist).filter(Boolean).length}/{Object.keys(checklist).length} Checked
                        </span>
                      </div>

                      {/* Checklist Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {Object.entries(checklist).map(([key, val]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => toggleChecklistItem(key)}
                            className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                              val
                                ? 'bg-green-500/10 border-green-500/40 text-green-300'
                                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
                            }`}
                          >
                            {val ? (
                              <CheckSquare className="w-4 h-4 text-green-400 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                            <span className="text-xs font-bold">{key}</span>
                          </button>
                        ))}
                      </div>

                      {/* Parts & Consumables Logger */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">
                          Parts & Consumables Replaced
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {partsUsed.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-200 flex items-center gap-2"
                            >
                              ✓ {p}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add part e.g. Ceramic Pads, DOT 4 Fluid, Julet Cable"
                            value={newPartInput}
                            onChange={(e) => setNewPartInput(e.target.value)}
                            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white flex-1 focus:outline-none focus:border-cyan-400"
                          />
                          <button
                            type="button"
                            onClick={handleAddPart}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
                          >
                            + Add Part
                          </button>
                        </div>
                      </div>

                      {/* Battery Health Tester Reading */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Recorded BMS Battery Health (%)
                          </label>
                          <input
                            type="number"
                            min="50"
                            max="100"
                            value={recordedBatteryHealth}
                            onChange={(e) => setRecordedBatteryHealth(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-green-400 font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Warranty Certificate
                          </label>
                          <div className="p-2.5 bg-green-500/10 border border-green-500/30 rounded-xl text-xs text-green-400 font-bold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> 10-Day / 1000 KM Assurance Issued
                          </div>
                        </div>
                      </div>

                      {/* Diagnostic Notes */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Technician Findings & Service Notes
                        </label>
                        <textarea
                          rows={2}
                          value={technicianNotes}
                          onChange={(e) => setTechnicianNotes(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Final Action: Mark as Completed */}
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus('completed')}
                        className="w-full py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.6)] flex items-center justify-center gap-2 active:scale-98 transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5 text-black" />
                        <span>MARK AS COMPLETED & ISSUE CERTIFICATE</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0D0E15] border border-white/10 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">All Clear! No Active Dispatch</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You are currently {onDuty ? 'ON DUTY and ready' : 'OFF DUTY'} to receive new auto-assigned doorstep service requests.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* COMPLETED SERVICES TAB */}
      {activeSubTab === 'history' && (
        <div className="bg-[#0D0E15] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-cyan-400" />
              My Certified Service Work Orders
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {completedJobs.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {completedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-white">Job #{job.id}</p>
                      <span className="text-[10px] font-mono font-bold text-green-400 bg-green-500/20 px-2 py-0.5 rounded">
                        COMPLETED & CERTIFIED
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {job.customerName} • {job.vehicle.make} {job.vehicle.model} ({job.vehicle.licensePlate || 'EV'})
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-mono font-bold text-sm text-cyan-400">
                    ₹{job.totalPrice.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">10-Day Warranty Active</p>
                </div>
              </div>
            ))}

            {completedJobs.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">
                No completed service logs yet today. Active jobs will appear here once marked as completed.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
