import React, { useState } from 'react';
import {
  Zap,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Wrench,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  FileText,
  Clock,
  BatteryCharging,
  Phone,
  AlertCircle,
  ExternalLink,
  Check,
  RefreshCw,
  Award,
  ArrowRight,
  CreditCard,
  Receipt
} from 'lucide-react';
import { Appointment, ReplacedPartItem, RepairStatus } from '../types';

interface ActiveServiceStatusCardProps {
  appointment: Appointment;
  onAdvanceStatus?: (status: RepairStatus) => void;
  onOpenBooking?: () => void;
  onOpenPayment?: () => void;
  specialistPhone?: string;
}

const DEFAULT_REPLACED_PARTS: ReplacedPartItem[] = [
  {
    id: 'part-1',
    name: 'OEM Ceramic High-Friction Brake Pad Set',
    partNumber: 'SKU-EV-BRK-8821',
    category: 'Hydraulic Braking System',
    quantity: 1,
    condition: 'Brand New (OEM)',
    warrantyMonths: 12,
    warrantyText: '12 Months Doorstep Replacement Warranty',
    cost: 650,
    oldPartAction: 'Recycled via authorized EV recycling partner',
  },
  {
    id: 'part-2',
    name: 'Gates Carbon Drive™ High-Tension Belt',
    partNumber: 'SKU-GAT-EV-112M',
    category: 'Powertrain & Drivetrain',
    quantity: 1,
    condition: 'Brand New (OEM)',
    warrantyMonths: 24,
    warrantyText: '24 Months High-Tensile Durability Warranty',
    cost: 1450,
    oldPartAction: 'Safely disposed & scrap metal returned',
  },
  {
    id: 'part-3',
    name: 'BMS 48V Shunt Resistor & Waterproof Fuse Assembly',
    partNumber: 'SKU-BMS-FUS-48V',
    category: 'High-Voltage Battery & BMS',
    quantity: 1,
    condition: 'Certified Spec (IP67)',
    warrantyMonths: 18,
    warrantyText: '18 Months Thermal & Surge Protection Warranty',
    cost: 480,
    oldPartAction: 'Tested, marked defective & archived in depot',
  },
];

export const ActiveServiceStatusCard: React.FC<ActiveServiceStatusCardProps> = ({
  appointment,
  onAdvanceStatus,
  onOpenBooking,
  onOpenPayment,
  specialistPhone = '6397852208',
}) => {
  const [isPartsExpanded, setIsPartsExpanded] = useState(true);
  const [copiedCert, setCopiedCert] = useState(false);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);

  const isCompleted = appointment.status === 'completed';

  // Determine replaced parts to display
  const replacedParts: ReplacedPartItem[] =
    appointment.replacedPartsDetails && appointment.replacedPartsDetails.length > 0
      ? appointment.replacedPartsDetails
      : appointment.partsUsed && appointment.partsUsed.length > 0
      ? appointment.partsUsed.map((partName, idx) => ({
          id: `custom-part-${idx}`,
          name: partName,
          partNumber: `SKU-OEM-${1000 + idx * 24}`,
          category: 'EV Certified Component',
          quantity: 1,
          condition: 'Brand New (OEM)',
          warrantyMonths: 12,
          warrantyText: '12 Months Doorstep Warranty',
          cost: 500 + idx * 250,
          oldPartAction: 'Recycled via authorized green recycler',
        }))
      : DEFAULT_REPLACED_PARTS;

  const totalPartsCost = replacedParts.reduce((sum, p) => sum + (p.cost || 0), 0);

  const handleCopyWarrantyCert = () => {
    const certText = `GOVOLT DIGITAL WARRANTY CERTIFICATE\nOrder ID: ${appointment.id}\nVehicle: ${appointment.vehicle.make} ${appointment.vehicle.model}\nCompleted At: ${appointment.completedAt || 'Today'}\nTechnician: ${appointment.technician.name} (${appointment.technician.vanId})\n\nReplaced Parts:\n${replacedParts.map((p, i) => `${i + 1}. ${p.name} [${p.partNumber}] - ${p.warrantyText}`).join('\n')}\n\nSupport Hotline: +91 ${specialistPhone}`;
    navigator.clipboard.writeText(certText);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2500);
  };

  return (
    <div
      id="active-service-status-card"
      className={`bg-[#0D0E15] border rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-2xl transition-all ${
        isCompleted
          ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
          : 'border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
      }`}
    >
      {/* Top Status Header Badge & Price */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {isCompleted ? (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Service Completed & Certified
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 text-slate-300 text-[10px] font-mono rounded border border-white/10">
              <Award className="w-3 h-3 text-amber-400" />
              10-Day Warranty Active
            </span>
          </div>
        ) : (
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-cyan-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            Active Repair #{appointment.id}
          </span>
        )}

        <span className="text-xs sm:text-sm text-cyan-300 font-mono font-black">
          ₹{appointment.totalPrice.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Vehicle Info & Service Overview */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border transition-all ${
            isCompleted
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'bg-slate-900 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
          }`}
        >
          {isCompleted ? <ShieldCheck className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base sm:text-lg font-black text-white truncate">
            {appointment.vehicle.make} {appointment.vehicle.model}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {appointment.services.map((s) => s.name).join(' • ')}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {appointment.vehicle.licensePlate || 'UP78 EV 450X'}
            </span>
            {appointment.batteryHealthRecorded && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <BatteryCharging className="w-2.5 h-2.5" />
                {appointment.batteryHealthRecorded}% Health
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Doorstep Address */}
      <div className="p-3 bg-white/5 border border-white/5 rounded-xl mb-4 flex items-center gap-2 text-xs text-slate-300">
        <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="truncate">{appointment.address}</span>
      </div>

      {/* Stage Progress Bar & ETA */}
      {!isCompleted ? (
        <div className="space-y-2 mb-4 bg-slate-900/60 p-3 rounded-2xl border border-white/5">
          <div className="flex justify-between items-end">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Stage:{' '}
              <span className="text-cyan-300 font-mono">
                {appointment.status.replace('_', ' ').toUpperCase()}
              </span>
            </p>
            <p className="text-xl sm:text-2xl font-mono font-black text-cyan-400 leading-none">
              ~{appointment.etaMinutes} Mins
            </p>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee] transition-all duration-500 ${
                appointment.status === 'dispatched'
                  ? 'w-1/4'
                  : appointment.status === 'en_route'
                  ? 'w-1/2'
                  : appointment.status === 'arrived'
                  ? 'w-3/4'
                  : 'w-full'
              }`}
            ></div>
          </div>

          {/* Quick Simulation Stepper for testing */}
          {onAdvanceStatus && (
            <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono">Simulate Stage:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onAdvanceStatus('arrived')}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-all ${
                    appointment.status === 'arrived'
                      ? 'bg-cyan-500 text-black border-cyan-400'
                      : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
                  }`}
                >
                  Arrived
                </button>
                <button
                  onClick={() => onAdvanceStatus('in_progress')}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-all ${
                    appointment.status === 'in_progress'
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
                  }`}
                >
                  Repairing
                </button>
                <button
                  onClick={() => onAdvanceStatus('completed')}
                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black border border-emerald-500/40 transition-all flex items-center gap-1"
                >
                  <Check className="w-2.5 h-2.5" />
                  Complete Job
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completed Overview Banner */
        <div className="mb-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full 21-Point Service Check Complete</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {appointment.completedAt || 'Serviced Today'}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed italic border-l-2 border-emerald-500/50 pl-2.5">
            "{appointment.completionNotes ||
              'Replaced high-wear brake pads, calibrated BMS cell thresholds, tensioned carbon belt and certified all waterproof connections for road safety.'}"
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-slate-400">
            <span>
              Lead Technician:{' '}
              <strong className="text-white font-semibold">{appointment.technician.name}</strong> (
              {appointment.technician.vanId})
            </span>
            <span className="text-emerald-400 font-mono font-bold">Digital Signature: VERIFIED</span>
          </div>
        </div>
      )}

      {/* Payment & Invoice Settlement Action Bar */}
      <div className="mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bill Total</span>
              {appointment.paymentStatus === 'paid' ? (
                <span className="px-1.5 py-0.2 bg-green-500/20 text-green-400 text-[9px] font-mono font-bold rounded border border-green-500/30">
                  PAID VIA {appointment.paymentMethod?.toUpperCase().replace('_', ' ') || 'UPI'}
                </span>
              ) : (
                <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold rounded border border-amber-500/30">
                  PAYMENT PENDING
                </span>
              )}
            </div>
            <p className="text-sm font-black font-mono text-white">₹{appointment.totalPrice.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {onOpenPayment && (
          <button
            onClick={onOpenPayment}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              appointment.paymentStatus === 'paid'
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_15px_#22d3ee]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{appointment.paymentStatus === 'paid' ? 'View GST Receipt' : 'Pay via UPI / Card'}</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* EXPANDABLE PARTS REPLACED LIST (SHOWN ONCE STATUS HITS 'COMPLETED') */}
      {/* ========================================================================= */}
      {isCompleted && (
        <div
          id="parts-replaced-expandable-section"
          className="mt-3 bg-gradient-to-b from-[#121420] to-[#0A0B10] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-lg"
        >
          {/* Expandable Header Accordion Trigger */}
          <button
            type="button"
            onClick={() => setIsPartsExpanded((prev) => !prev)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors group cursor-pointer"
            aria-expanded={isPartsExpanded}
            aria-controls="replaced-parts-content"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(34,211,238,0.25)]">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                    Replaced Parts & Spares Installed
                  </h4>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold rounded-full border border-cyan-500/40">
                    {replacedParts.length} Parts
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Click to {isPartsExpanded ? 'collapse' : 'view'} OEM items, warranty & SKU details
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-cyan-400">
              <span className="text-[11px] font-mono font-bold hidden sm:inline text-slate-300">
                {isPartsExpanded ? 'Hide Details' : 'View Details'}
              </span>
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors">
                {isPartsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                )}
              </div>
            </div>
          </button>

          {/* Expandable Body with Parts List */}
          {isPartsExpanded && (
            <div id="replaced-parts-content" className="px-4 pb-4 pt-1 space-y-3 border-t border-white/5 animate-fadeIn">
              {/* Parts Listing */}
              <div className="space-y-2.5">
                {replacedParts.map((part, index) => (
                  <div
                    key={part.id || `part-${index}`}
                    className="p-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl transition-all space-y-2 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold flex items-center justify-center border border-cyan-500/30 shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-xs font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
                            {part.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {part.category} {part.partNumber && `• SKU: ${part.partNumber}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center pl-7 sm:pl-0">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold rounded border border-emerald-500/30">
                          {part.condition || 'Brand New (OEM)'}
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {part.cost ? `₹${part.cost}` : 'Included'}
                        </span>
                      </div>
                    </div>

                    {/* Part Details: Warranty & Old Part Action */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 text-[10px] text-slate-400 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{part.warrantyText || `${part.warrantyMonths || 12} Months Warranty`}</span>
                      </div>
                      {part.oldPartAction && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <RefreshCw className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate">{part.oldPartAction}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Warranty & Proof of Authenticity Summary Bar */}
              <div className="p-3 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">Genuine OEM Parts Protection</p>
                    <p className="text-[9px] text-slate-400">
                      All spares covered under GOVOLT 100% genuine replacement promise
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyWarrantyCert}
                    className="flex-1 sm:flex-none px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 border border-white/10"
                    title="Copy Digital Warranty Certificate"
                  >
                    {copiedCert ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Cert Copied!</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3 text-cyan-400" />
                        <span>Copy Certificate</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`tel:${specialistPhone}`}
                    className="flex-1 sm:flex-none px-2.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 border border-cyan-500/40"
                    title="Call Support for Parts Assistance"
                  >
                    <Phone className="w-3 h-3 text-green-400" />
                    <span>Parts Support</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Book New Doorstep Van CTA when completed */}
      {isCompleted && onOpenBooking && (
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">Need another repair or tune-up?</p>
          <button
            onClick={onOpenBooking}
            className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Book Next Service</span>
          </button>
        </div>
      )}
    </div>
  );
};
