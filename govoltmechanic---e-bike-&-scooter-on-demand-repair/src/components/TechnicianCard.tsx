import React from 'react';
import { Star, MessageSquare, Phone, Truck, ShieldCheck, Wrench, CheckCircle2 } from 'lucide-react';
import { Technician, RepairStatus } from '../types';

interface TechnicianCardProps {
  technician: Technician;
  status: RepairStatus;
  onOpenChat: () => void;
  onOpenBooking: () => void;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  status,
  onOpenChat,
  onOpenBooking,
}) => {
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
    <div className="bg-[#0D0E15] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Assigned Specialist
          </h2>
          <p className="text-xs text-cyan-400 font-mono mt-0.5">{technician.vanId}</p>
        </div>
        <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          ACTIVE ON DUTY
        </span>
      </div>

      {/* Specialist Details */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={technician.avatar}
            alt={technician.name}
            className="w-14 h-14 rounded-2xl object-cover bg-slate-800 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0A0B10] rounded-full"></div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-white truncate flex items-center gap-1.5">
            {technician.name}
            <ShieldCheck className="w-4 h-4 text-cyan-400 inline shrink-0" />
          </h3>
          <p className="text-xs text-slate-400 truncate">{technician.specialty}</p>

          <div className="flex items-center gap-3 mt-1.5 text-xs">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {technician.rating}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-mono">{technician.completedRepairs} Jobs</span>
          </div>
        </div>
      </div>

      {/* Live Status Progress Stepper */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Service Progress</span>
          <span className="text-cyan-400 font-mono">{steps[currentIndex]?.label}</span>
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
                      ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                      : isCurrent
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse'
                      : 'bg-slate-800'
                  }`}
                ></div>
                <span
                  className={`text-[9px] text-center font-mono truncate ${
                    isCurrent ? 'text-cyan-400 font-bold' : isDone ? 'text-slate-300' : 'text-slate-600'
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
          className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          Live Chat
        </button>

        <a
          href={`tel:${technician.phone}`}
          className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <Phone className="w-4 h-4 text-green-400" />
          Call Specialist
        </a>
      </div>

      <button
        onClick={onOpenBooking}
        className="w-full py-4 bg-cyan-500 text-[#0A0B10] font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_10px_20px_-10px_rgba(34,211,238,0.5)] active:scale-95 flex items-center justify-center gap-2"
      >
        <Wrench className="w-4 h-4" />
        BOOK NEW APPOINTMENT
      </button>
    </div>
  );
};
