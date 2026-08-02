import React, { useState } from 'react';
import { X, Phone, Check, Edit3, PhoneCall, Sparkles, ShieldCheck } from 'lucide-react';

interface SpecialistPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone: string;
  onSavePhone: (newPhone: string) => void;
}

export const SpecialistPhoneModal: React.FC<SpecialistPhoneModalProps> = ({
  isOpen,
  onClose,
  currentPhone,
  onSavePhone,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(currentPhone);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      onSavePhone(phoneNumber.trim());
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 900);
    }
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
            <Phone className="w-3.5 h-3.5" /> Specialist Hotline Configuration
          </div>
          <h2 className="text-xl sm:text-2xl font-black italic tracking-tight text-white uppercase">
            Set Specialist Phone Number
          </h2>
          <p className="text-xs text-slate-400">
            Enter your direct phone number below. All <span className="text-cyan-400 font-bold">"Call Specialist"</span> buttons across the platform will immediately connect to this number.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Specialist / Hotline Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                <PhoneCall className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98391 88200 or your mobile number"
                required
                className="w-full pl-11 pr-4 py-3 bg-[#0A0B10] border border-cyan-500/40 rounded-xl text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
              Direct connection enabled. Saves locally to your browser session.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href={`tel:${phoneNumber}`}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <Phone className="w-4 h-4 text-green-400" />
              Test Call
            </a>

            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-[#0A0B10] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] active:scale-95 flex items-center justify-center gap-2"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" /> Saved!
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Update Number
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
