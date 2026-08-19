import React from 'react';
import { Activity, Phone, Edit3 } from 'lucide-react';

interface FooterProps {
  specialistPhone?: string;
  onOpenPhoneModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ specialistPhone, onOpenPhoneModal }) => {
  return (
    <footer className="px-4 sm:px-8 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-700">
      <div className="flex flex-wrap items-center gap-4 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-red-600" />
          SYSTEM STATUS: <span className="text-red-600 font-mono font-black">OPTIMAL</span>
        </span>
        <span className="text-slate-300 hidden sm:inline">•</span>
        <span>
          DISPATCH NODES: <span className="text-black font-mono font-black">842 ACTIVE</span>
        </span>
        <span className="text-slate-300 hidden sm:inline">•</span>
        <span>
          REGION: <span className="text-red-600 font-mono font-bold">KANPUR, UTTAR PRADESH</span>
        </span>
        {specialistPhone && (
          <>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              HOTLINE: 
              <a href={`tel:${specialistPhone}`} className="text-red-600 font-mono font-black hover:underline flex items-center gap-1 ml-0.5">
                <Phone className="w-3 h-3 text-red-600" />
                {specialistPhone}
              </a>
              {onOpenPhoneModal && (
                <button
                  onClick={onOpenPhoneModal}
                  title="Change Specialist Phone Number"
                  className="ml-1 p-1 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </span>
          </>
        )}
      </div>

      <p className="text-[10px] font-bold tracking-[0.1em] text-slate-500 uppercase">
        © 2026 GOVOLTMECHANIC INC. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
};
