import React from 'react';
import { Activity, Phone, Edit3 } from 'lucide-react';

interface FooterProps {
  specialistPhone?: string;
  onOpenPhoneModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ specialistPhone, onOpenPhoneModal }) => {
  return (
    <footer className="px-4 sm:px-8 py-4 bg-[#0A0B10] border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-400">
      <div className="flex flex-wrap items-center gap-4 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-green-400" />
          SYSTEM STATUS: <span className="text-green-400 font-mono">OPTIMAL</span>
        </span>
        <span className="text-slate-700 hidden sm:inline">•</span>
        <span>
          DISPATCH NODES: <span className="text-white font-mono">842 ACTIVE</span>
        </span>
        <span className="text-slate-700 hidden sm:inline">•</span>
        <span>
          REGION: <span className="text-cyan-400 font-mono">KANPUR, UTTAR PRADESH</span>
        </span>
        {specialistPhone && (
          <>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              HOTLINE: 
              <a href={`tel:${specialistPhone}`} className="text-cyan-400 font-mono hover:underline flex items-center gap-1 ml-0.5">
                <Phone className="w-3 h-3 text-green-400" />
                {specialistPhone}
              </a>
              {onOpenPhoneModal && (
                <button
                  onClick={onOpenPhoneModal}
                  title="Change Specialist Phone Number"
                  className="ml-1 p-1 hover:text-cyan-400 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </span>
          </>
        )}
      </div>

      <p className="text-[10px] font-bold tracking-[0.1em] text-slate-600 uppercase italic">
        © 2026 GOVOLTMECHANIC INC. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
};
