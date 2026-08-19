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
    <div className="space-y-6 max-w-6xl mx-auto text-slate-800">
      {/* Top Technician Status & Duty Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-red-200 shadow-sm"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  onDuty ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'
                }`}
              ></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-red-50 text-red-700 font-mono text-[10px] font-black uppercase rounded-md border border-red-200">
                  MOBILE WORKSHOP TECH
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {currentUser.vanId || 'VAN-104 (Mobile Workshop)'}
                </span>
              </div>
              <h2 className="text-xl font-black text-black mt-1">{currentUser.name}</h2>
              <p className="text-xs text-slate-600">
                {currentUser.specialty || 'Master EV Systems & High-Voltage BMS'}
              </p>
            </div>
          </div>

          {/* Duty Status Switch & Quick Actions */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Duty Dispatch Status</p>
              <p className={`text-xs font-black uppercase font-mono ${onDuty ? 'text-emerald-700' : 'text-slate-500'}`}>
                {onDuty ? '● ON DUTY (READY FOR DISPATCH)' : '○ OFF DUTY (BREAK)'}
              </p>
            </div>

            <button
              onClick={() => setOnDuty(!onDuty)}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${
                onDuty
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-black'
              }`}
            >
              {onDuty ? 'Go Off Duty' : 'Go On Duty'}
            </button>
          </div>
        </div>

        {/* Technician KPI Metric Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Today's Payout</p>
            <p className="text-2xl font-black text-red-600 font-mono">₹{totalEarnings.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Completed Today</p>
            <p className="text-2xl font-black text-black font-mono">{completedJobs.length + 3} Jobs</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rating Score</p>
            <p className="text-2xl font-black text-amber-700 font-mono flex items-center gap-1">
              ★ 4.98 <span className="text-[10px] text-slate-500 font-normal">(1,420 jobs)</span>
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Van Battery Stock</p>
            <p className="text-2xl font-black text-emerald-700 font-mono">6 Packs</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeSubTab === 'active'
              ? 'bg-red-600 text-white font-black shadow-sm'
              : 'text-slate-600 hover:text-black bg-slate-100'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          Active Work Order {activeJob && <span className="px-1.5 py-0.2 bg-white text-red-600 text-[10px] rounded-full font-bold">1</span>}
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeSubTab === 'history'
              ? 'bg-red-600 text-white font-black shadow-sm'
              : 'text-slate-600 hover:text-black bg-slate-100'
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-black rounded-full uppercase tracking-widest border border-red-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    ACTIVE DISPATCH #{activeJob.id}
                  </span>
                  {activeJob.isEmergencySOS && (
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-black rounded-full uppercase border border-red-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> EMERGENCY SOS
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase font-bold">Total Service Fee</span>
                  <p className="text-xl font-black text-red-600 font-mono">₹{activeJob.totalPrice.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Customer & Vehicle Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vehicle Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                  <img
                    src={activeJob.vehicle.image}
                    alt={activeJob.vehicle.model}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-500">{activeJob.vehicle.make}</p>
                    <h4 className="text-base font-black text-black truncate">{activeJob.vehicle.model}</h4>
                    <p className="text-xs font-mono text-emerald-700 font-bold">
                      {activeJob.vehicle.licensePlate || 'UP78 EV 450X'}
                    </p>
                  </div>
                </div>

                {/* Customer Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Customer</p>
                    <h4 className="text-base font-black text-black">{activeJob.customerName}</h4>
                    <p className="text-xs font-mono text-slate-600">{activeJob.customerPhone}</p>
                  </div>
                  <a
                    href={`tel:${activeJob.customerPhone}`}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Customer
                  </a>
                </div>
              </div>

              {/* Destination Address & Reported Issue */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-black">Service Location: </span>
                    <span>{activeJob.address}</span>
                  </div>
                </div>

                {activeJob.notes && (
                  <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
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
                  <span className="font-bold uppercase tracking-wider text-slate-600">Dispatch Stage Progress</span>
                  <span className="font-mono font-black text-red-600 uppercase">
                    Stage: {activeJob.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress Visual Bar */}
                <div className="grid grid-cols-4 gap-2">
                  <div
                    className={`h-2 rounded-full ${
                      ['dispatched', 'en_route', 'arrived', 'in_progress', 'completed'].includes(activeJob.status)
                        ? 'bg-red-600'
                        : 'bg-slate-200'
                    }`}
                  ></div>
                  <div
                    className={`h-2 rounded-full ${
                      ['en_route', 'arrived', 'in_progress', 'completed'].includes(activeJob.status)
                        ? 'bg-red-600'
                        : 'bg-slate-200'
                    }`}
                  ></div>
                  <div
                    className={`h-2 rounded-full ${
                      ['arrived', 'in_progress', 'completed'].includes(activeJob.status)
                        ? 'bg-red-600'
                        : 'bg-slate-200'
                    }`}
                  ></div>
                  <div
                    className={`h-2 rounded-full ${
                      ['in_progress', 'completed'].includes(activeJob.status)
                        ? 'bg-red-600'
                        : 'bg-slate-200'
                    }`}
                  ></div>
                </div>

                {/* Step Action Trigger Buttons */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  {activeJob.status === 'dispatched' && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-black">Van Dispatched to Customer</h4>
                        <p className="text-xs text-slate-600">Ready to navigate to {activeJob.customerName}'s doorstep.</p>
                      </div>
                      <button
                        onClick={() => handleAdvanceStatus('en_route')}
                        className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Navigation className="w-4 h-4 text-white" />
                        <span>Start Driving (Set En Route)</span>
                      </button>
                    </div>
                  )}

                  {activeJob.status === 'en_route' && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-black">Technician is En Route</h4>
                        <p className="text-xs text-slate-600">Live GPS tracking and ETA shared with rider.</p>
                      </div>
                      <button
                        onClick={() => handleAdvanceStatus('arrived')}
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-95"
                      >
                        <MapPin className="w-4 h-4 text-white" />
                        <span>Confirm Arrival at Doorstep</span>
                      </button>
                    </div>
                  )}

                  {activeJob.status === 'arrived' && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-black">Arrived at Location</h4>
                        <p className="text-xs text-slate-600">Van parked. Ready to inspect EV with mobile workshop tools.</p>
                      </div>
                      <button
                        onClick={() => handleAdvanceStatus('in_progress')}
                        className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Wrench className="w-4 h-4 text-white" />
                        <span>Begin 21-Point Inspection & Repair</span>
                      </button>
                    </div>
                  )}

                  {activeJob.status === 'in_progress' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-black flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-red-600" />
                            Work in Progress: 21-Point Service Checklist
                          </h4>
                          <p className="text-xs text-slate-600">Verify and check all safety points before completion.</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-700">
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
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {val ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="text-xs font-bold">{key}</span>
                          </button>
                        ))}
                      </div>

                      {/* Parts & Consumables Logger */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <label className="text-[10px] uppercase font-bold text-slate-600 block">
                          Parts & Consumables Replaced
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {partsUsed.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 flex items-center gap-2 shadow-xs"
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
                            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-black flex-1 focus:outline-none focus:border-red-600"
                          />
                          <button
                            type="button"
                            onClick={handleAddPart}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-black rounded-xl text-xs font-bold"
                          >
                            + Add Part
                          </button>
                        </div>
                      </div>

                      {/* Battery Health Tester Reading */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                            Recorded BMS Battery Health (%)
                          </label>
                          <input
                            type="number"
                            min="50"
                            max="100"
                            value={recordedBatteryHealth}
                            onChange={(e) => setRecordedBatteryHealth(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-emerald-700 font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                            Warranty Certificate
                          </label>
                          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 10-Day / 1000 KM Assurance Issued
                          </div>
                        </div>
                      </div>

                      {/* Diagnostic Notes */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                          Technician Findings & Service Notes
                        </label>
                        <textarea
                          rows={2}
                          value={technicianNotes}
                          onChange={(e) => setTechnicianNotes(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-black focus:outline-none focus:border-red-600"
                        />
                      </div>

                      {/* Final Action: Mark as Completed */}
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus('completed')}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <span>MARK AS COMPLETED & ISSUE CERTIFICATE</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">All Clear! No Active Dispatch</h3>
                <p className="text-xs text-slate-600 mt-1">
                  You are currently {onDuty ? 'ON DUTY and ready' : 'OFF DUTY'} to receive new auto-assigned doorstep service requests.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* COMPLETED SERVICES TAB */}
      {activeSubTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-red-600" />
              My Certified Service Work Orders
            </h3>
            <span className="text-xs font-mono text-red-600 font-bold">
              {completedJobs.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {completedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-black">Job #{job.id}</p>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        COMPLETED & CERTIFIED
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {job.customerName} • {job.vehicle.make} {job.vehicle.model} ({job.vehicle.licensePlate || 'EV'})
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-mono font-bold text-sm text-red-600">
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
