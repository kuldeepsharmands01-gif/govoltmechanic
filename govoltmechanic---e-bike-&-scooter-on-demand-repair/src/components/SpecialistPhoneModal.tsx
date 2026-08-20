import React, { useState } from 'react';
import { X, Phone, Check, Copy, PhoneCall, ShieldCheck, Sparkles, Headset } from 'lucide-react';

interface SpecialistPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone: string;
}

export const SpecialistPhoneModal: React.FC<SpecialistPhoneModalProps> = ({
  isOpen,
  onClose,
  currentPhone,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPhone);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0D0E15] border border-cyan-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-[0_0_50px_rgba(34,211,238,0.2)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
            <Headset className="w-3.5 h-3.5" /> 24/7 Verified Technical Hotline
          </div>
          <h2 className="text-xl sm:text-2xl font-black italic tracking-tight text-white uppercase">
            EV Specialist Direct Line
          </h2>
          <p className="text-xs text-slate-400">
            Official 24/7 dispatch hotline for instant E-Bike, E-Scooter, and High-Voltage powertrain roadside emergency support.
          </p>
        </div>

        {/* Static Hotline Display Card */}
        <div className="p-5 bg-[#090A10] border border-cyan-500/30 rounded-2xl space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Dispatch Hotline</span>
            <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Static Line
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-black/60 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <PhoneCall className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <span className="text-base sm:text-lg font-mono font-black text-white tracking-wider">{currentPhone}</span>
            </div>

            <button
              onClick={handleCopy}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors border border-white/10 text-xs font-mono flex items-center gap-1"
              title="Copy Phone Number"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            Direct priority channel connecting to certified senior EV mechanics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors"
          >
            Close
          </button>

          <a
            href={`tel:${currentPhone}`}
            className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-[#0A0B10] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95 flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#0A0B10]" />
            Call Hotline Now
          </a>
        </div>
      </div>
    </div>
  );
};
