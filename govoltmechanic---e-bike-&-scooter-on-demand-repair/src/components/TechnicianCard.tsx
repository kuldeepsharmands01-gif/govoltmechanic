import React from 'react';
import { Star, MessageSquare, Phone, Truck, ShieldCheck, Wrench, CheckCircle2, Edit3 } from 'lucide-react';
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Assigned Specialist
          </h2>
          <p className="text-xs text-red-600 font-mono font-bold mt-0.5">{technician.vanId}</p>
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          ACTIVE ON DUTY
        </span>
      </div>

      {/* Specialist Details */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={technician.avatar}
            alt={technician.name}
            className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-red-200 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-base text-black truncate flex items-center gap-1.5">
            {technician.name}
            <ShieldCheck className="w-4 h-4 text-red-600 inline shrink-0" />
          </h3>
          <p className="text-xs text-slate-600 truncate font-medium">{technician.specialty}</p>

          <div className="flex items-center gap-3 mt-1.5 text-xs">
            <span className="flex items-center gap-1 text-amber-600 font-black">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {technician.rating}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-mono font-bold">{technician.completedRepairs} Jobs</span>
          </div>
        </div>
      </div>

      {/* Live Status Progress Stepper */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span>Service Progress</span>
          <span className="text-red-600 font-mono font-black">{steps[currentIndex]?.label}</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {steps.map((step, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={step.key} className="flex flex-col gap-1">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isDone
                      ? 'bg-red-600'
                      : isCurrent
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-slate-200'
                  }`}
                ></div>
                <span
                  className={`text-[9px] text-center font-mono truncate ${
                    isCurrent ? 'text-red-600 font-black' : isDone ? 'text-slate-800 font-bold' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onOpenChat}
          className="py-3 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <MessageSquare className="w-4 h-4 text-red-600" />
          Live Chat
        </button>

        <div className="relative group/call">
          <a
            href={`tel:${targetPhone}`}
            className="w-full py-3 px-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold uppercase tracking-wider text-red-700 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Phone className="w-4 h-4 text-red-600 shrink-0" />
            <span className="truncate">Call Specialist</span>
          </a>
          {onEditPhone && (
            <button
              onClick={onEditPhone}
              title="Edit Specialist Phone Number"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      <p className="text-[10px] text-center font-mono text-slate-500">
        Hotline: <span className="text-red-600 font-bold">{targetPhone}</span>
      </p>

      <button
        onClick={onOpenBooking}
        className="w-full py-3.5 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
      >
        <Wrench className="w-4 h-4" />
        BOOK NEW APPOINTMENT
      </button>
    </div>
  );
};
