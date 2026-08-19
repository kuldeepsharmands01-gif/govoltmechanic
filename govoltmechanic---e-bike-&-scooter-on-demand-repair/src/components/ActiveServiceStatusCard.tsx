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

  const handleCopyWarrantyCert = () => {
    const certText = `GOVOLT DIGITAL WARRANTY CERTIFICATE\nOrder ID: ${appointment.id}\nVehicle: ${appointment.vehicle.make} ${appointment.vehicle.model}\nCompleted At: ${appointment.completedAt || 'Today'}\nTechnician: ${appointment.technician.name} (${appointment.technician.vanId})\n\nReplaced Parts:\n${replacedParts.map((p, i) => `${i + 1}. ${p.name} [${p.partNumber}] - ${p.warrantyText}`).join('\n')}\n\nSupport Hotline: +91 ${specialistPhone}`;
    navigator.clipboard.writeText(certText);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2500);
  };

  return (
    <div
      id="active-service-status-card"
      className={`bg-white border rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-md transition-all ${
        isCompleted
          ? 'border-emerald-300 ring-1 ring-emerald-200'
          : 'border-slate-200'
      }`}
    >
      {/* Top Status Header Badge & Price */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {isCompleted ? (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-200 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Service Completed & Certified
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono rounded border border-slate-200">
              <Award className="w-3 h-3 text-amber-500" />
              10-Day Warranty Active
            </span>
          </div>
        ) : (
          <span className="px-3 py-1 bg-red-50 text-red-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-red-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
            Active Repair #{appointment.id}
          </span>
        )}

        <span className="text-xs sm:text-sm text-red-600 font-mono font-black">
          ₹{appointment.totalPrice.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Vehicle Info & Service Overview */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transition-all ${
            isCompleted
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}
        >
          {isCompleted ? <ShieldCheck className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base sm:text-lg font-black text-black truncate">
            {appointment.vehicle.make} {appointment.vehicle.model}
          </p>
          <p className="text-xs text-slate-600 truncate">
            {appointment.services.map((s) => s.name).join(' • ')}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold">
              {appointment.vehicle.licensePlate || 'UP78 EV 450X'}
            </span>
            {appointment.batteryHealthRecorded && (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-bold">
                <BatteryCharging className="w-2.5 h-2.5 text-emerald-600" />
                {appointment.batteryHealthRecorded}% Health
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Doorstep Address */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 flex items-center gap-2 text-xs text-slate-700 font-medium">
        <MapPin className="w-4 h-4 text-red-600 shrink-0" />
        <span className="truncate">{appointment.address}</span>
      </div>

      {/* Stage Progress Bar & ETA */}
      {!isCompleted ? (
        <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-end">
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
              Stage:{' '}
              <span className="text-red-600 font-mono font-black">
                {appointment.status.replace('_', ' ').toUpperCase()}
              </span>
            </p>
            <p className="text-xl sm:text-2xl font-mono font-black text-black leading-none">
              ~{appointment.etaMinutes} Mins
            </p>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500 ${
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
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono">Simulate Stage:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onAdvanceStatus('arrived')}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-all ${
                    appointment.status === 'arrived'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-700 hover:text-black border-slate-300'
                  }`}
                >
                  Arrived
                </button>
                <button
                  onClick={() => onAdvanceStatus('in_progress')}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-all ${
                    appointment.status === 'in_progress'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-700 hover:text-black border-slate-300'
                  }`}
                >
                  Repairing
                </button>
                <button
                  onClick={() => onAdvanceStatus('completed')}
                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600 transition-all flex items-center gap-1"
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
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 font-black">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full 21-Point Service Check Complete</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-bold">
              {appointment.completedAt || 'Serviced Today'}
            </span>
          </div>

          <p className="text-[11px] text-slate-700 leading-relaxed italic border-l-2 border-emerald-500 pl-2.5">
            "{appointment.completionNotes ||
              'Replaced high-wear brake pads, calibrated BMS cell thresholds, tensioned carbon belt and certified all waterproof connections for road safety.'}"
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-emerald-100 text-[10px] text-slate-600">
            <span>
              Lead Technician:{' '}
              <strong className="text-black font-bold">{appointment.technician.name}</strong> (
              {appointment.technician.vanId})
            </span>
            <span className="text-emerald-700 font-mono font-bold">Digital Signature: VERIFIED</span>
          </div>
        </div>
      )}

      {/* Payment & Invoice Settlement Action Bar */}
      <div className="mb-4 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bill Total</span>
              {appointment.paymentStatus === 'paid' ? (
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold rounded border border-emerald-200">
                  PAID VIA {appointment.paymentMethod?.toUpperCase().replace('_', ' ') || 'UPI'}
                </span>
              ) : (
                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-mono font-bold rounded border border-amber-200">
                  PAYMENT PENDING
                </span>
              )}
            </div>
            <p className="text-sm font-black font-mono text-black">₹{appointment.totalPrice.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {onOpenPayment && (
          <button
            onClick={onOpenPayment}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              appointment.paymentStatus === 'paid'
                ? 'bg-slate-200 hover:bg-slate-300 text-black border border-slate-300'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{appointment.paymentStatus === 'paid' ? 'View GST Receipt' : 'Pay via UPI / Card'}</span>
          </button>
        )}
      </div>

      {/* EXPANDABLE PARTS REPLACED LIST */}
      {isCompleted && (
        <div
          id="parts-replaced-expandable-section"
          className="mt-3 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Expandable Header Accordion Trigger */}
          <button
            type="button"
            onClick={() => setIsPartsExpanded((prev) => !prev)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-100 transition-colors group cursor-pointer"
            aria-expanded={isPartsExpanded}
            aria-controls="replaced-parts-content"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 group-hover:scale-105 transition-transform">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-black tracking-wide group-hover:text-red-600 transition-colors">
                    Replaced Parts & Spares Installed
                  </h4>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-mono font-bold rounded-full border border-red-200">
                    {replacedParts.length} Parts
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Click to {isPartsExpanded ? 'collapse' : 'view'} OEM items, warranty & SKU details
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-red-600">
              <span className="text-[11px] font-mono font-bold hidden sm:inline text-slate-600">
                {isPartsExpanded ? 'Hide Details' : 'View Details'}
              </span>
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center group-hover:border-red-400 transition-colors">
                {isPartsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-red-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
          </button>

          {/* Expandable Body with Parts List */}
          {isPartsExpanded && (
            <div id="replaced-parts-content" className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-200">
              {/* Parts Listing */}
              <div className="space-y-2.5">
                {replacedParts.map((part, index) => (
                  <div
                    key={part.id || `part-${index}`}
                    className="p-3 bg-white border border-slate-200 rounded-xl transition-all space-y-2 group shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-[10px] font-mono font-bold flex items-center justify-center border border-red-200 shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-xs font-black text-black group-hover:text-red-600 transition-colors">
                            {part.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {part.category} {part.partNumber && `• SKU: ${part.partNumber}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center pl-7 sm:pl-0">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold rounded border border-emerald-200">
                          {part.condition || 'Brand New (OEM)'}
                        </span>
                        <span className="text-xs font-mono font-bold text-red-600">
                          {part.cost ? `₹${part.cost}` : 'Included'}
                        </span>
                      </div>
                    </div>

                    {/* Part Details: Warranty & Old Part Action */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 text-[10px] text-slate-600 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{part.warrantyText || `${part.warrantyMonths || 12} Months Warranty`}</span>
                      </div>
                      {part.oldPartAction && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <RefreshCw className="w-3 h-3 text-red-500 shrink-0" />
                          <span className="truncate">{part.oldPartAction}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Warranty & Proof of Authenticity Summary Bar */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-black">Genuine OEM Parts Protection</p>
                    <p className="text-[9px] text-slate-500">
                      All spares covered under GOVOLT 100% genuine replacement promise
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyWarrantyCert}
                    className="flex-1 sm:flex-none px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 border border-slate-300"
                    title="Copy Digital Warranty Certificate"
                  >
                    {copiedCert ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Cert Copied!</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3 text-red-600" />
                        <span>Copy Certificate</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`tel:${specialistPhone}`}
                    className="flex-1 sm:flex-none px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 border border-red-200"
                    title="Call Support for Parts Assistance"
                  >
                    <Phone className="w-3 h-3 text-red-600" />
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
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">Need another repair or tune-up?</p>
          <button
            onClick={onOpenBooking}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Book Next Service</span>
          </button>
        </div>
      )}
    </div>
  );
};
