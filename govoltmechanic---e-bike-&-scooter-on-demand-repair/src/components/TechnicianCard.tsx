import React from 'react';
import { Star, MessageSquare, Phone, Truck, ShieldCheck, Wrench, CheckCircle2, Edit3, Clock, Sparkles } from 'lucide-react';
import { Technician, RepairStatus } from '../types';

interface TechnicianCardProps {
  technician: Technician;
  status: RepairStatus;
  onOpenChat: () => void;
  onOpenBooking: () => void;
  specialistPhone?: string;
  onEditPhone?: () => void;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  status,
  onOpenChat,
  onOpenBooking,
  specialistPhone,
  onEditPhone,
}) => {
  const targetPhone = specialistPhone || technician.phone;
  const steps: { label: string; key: RepairStatus }[] = [
    { label: 'Dispatched', key: 'dispatched' },
    { label: 'En Route', key: 'en_route' },
    { label: 'Arrived', key: 'arrived' },
    { label: 'Repairing', key: 'in_progress' },
    { label: 'Completed', key: 'completed' },
  ];

  const getStepIndex = (st: RepairStatus) => {
    switch (st) {
      case 'dispatched': return 0;
      case 'en_route': return 1;
      case 'arrived': return 2;
      case 'in_progress': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-sm space-y-6">
      {/* Top Bar / Landscape Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-black">
                Assigned Specialist Window
              </span>
              <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-mono font-bold rounded border border-red-200">
                {technician.vanId}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live On-Duty Mobile Workshop Unit & Certified Master Technician
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full border border-emerald-200 uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            ACTIVE ON ROAD
          </span>
        </div>
      </div>

      {/* Main Landscape 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Specialist Profile Details (4 cols) */}
        <div className="md:col-span-4 flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <div className="relative shrink-0">
            <img
              src={technician.avatar}
              alt={technician.name}
              className="w-16 h-16 rounded-2xl object-cover bg-white border-2 border-red-200 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-black text-base text-black truncate flex items-center gap-1.5">
              {technician.name}
              <ShieldCheck className="w-4 h-4 text-red-600 inline shrink-0" />
            </h3>
            <p className="text-xs text-slate-600 truncate font-medium mt-0.5">{technician.specialty}</p>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 text-amber-600 font-black">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {technician.rating}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-800 font-mono font-bold">{technician.completedRepairs} Jobs Done</span>
            </div>
          </div>
        </div>

        {/* Middle Column: Live Status Stepper in Landscape (4 cols) */}
        <div className="md:col-span-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-red-600" /> Current Stage
            </span>
            <span className="text-red-600 font-mono font-black text-xs uppercase">
              {steps[currentIndex]?.label}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {steps.map((step, idx) => {
              const isDone = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div key={step.key} className="flex flex-col gap-1.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isDone
                        ? 'bg-red-600'
                        : isCurrent
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-slate-200'
                    }`}
                  ></div>
                  <span
                    className={`text-[9px] text-center font-mono truncate ${
                      isCurrent
                        ? 'text-red-600 font-black'
                        : isDone
                        ? 'text-slate-900 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Direct Contact & Action Controls (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenChat}
              className="py-3 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider text-black transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-red-600" />
              <span>Live Chat</span>
            </button>

            <div className="relative group/call">
              <a
                href={`tel:${targetPhone}`}
                className="w-full py-3 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">Call Tech</span>
              </a>
              {onEditPhone && (
                <button
                  onClick={onEditPhone}
                  title="Edit Specialist Phone Number"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono">
            <span className="text-slate-500 font-bold uppercase">Direct Phone:</span>
            <span className="text-red-600 font-black">{targetPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
