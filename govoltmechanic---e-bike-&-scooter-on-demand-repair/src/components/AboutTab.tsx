import React from 'react';
import {
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
  Users,
  Award,
  Clock,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Leaf,
  Target,
  Sparkles,
  ArrowRight,
  Shield,
  Siren,
  Building2,
  Activity
} from 'lucide-react';

interface AboutTabProps {
  onOpenBooking: () => void;
  onOpenSOS: () => void;
  specialistPhone: string;
}

export const AboutTab: React.FC<AboutTabProps> = ({
  onOpenBooking,
  onOpenSOS,
  specialistPhone,
}) => {
  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto">
      {/* Hero Intro Section */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-slate-900 via-[#0D0E15] to-slate-900 p-8 sm:p-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          The Future of Two-Wheeler & EV Service in India
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Bringing the Full Garage Workshop to Your Doorstep.
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          GOVOLT (Apna Doorstep Mechanic) was founded to eliminate long service center waiting lines, unverified repair charges, and stranded roadside breakdowns. We engineer specialized mobile workshop vans equipped with hydraulic lifts, high-voltage EV diagnostic scanners, and 100% genuine spare parts.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenBooking}
            className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center gap-2"
          >
            <span>Book Doorstep Van</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={`tel:${specialistPhone}`}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-cyan-400" />
            <span>Call Helpline: {specialistPhone}</span>
          </a>
        </div>
      </div>

      {/* Key Numbers & Impact Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 bg-[#0D0E15] border border-white/10 rounded-3xl text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black font-mono text-white">50+ Vans</p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Mobile Workshops on Road</p>
        </div>

        <div className="p-6 bg-[#0D0E15] border border-white/10 rounded-3xl text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black font-mono text-green-400">25,000+</p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed Doorstep Repairs</p>
        </div>

        <div className="p-6 bg-[#0D0E15] border border-white/10 rounded-3xl text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black font-mono text-amber-400">15 Mins</p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Emergency RSA ETA</p>
        </div>

        <div className="p-6 bg-[#0D0E15] border border-white/10 rounded-3xl text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black font-mono text-purple-400">4.9 / 5.0</p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Customer Satisfaction Score</p>
        </div>
      </div>

      {/* The 4 Pillars of GOVOLT Standard */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Why Riders Trust Us</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            We deliver the exact transparency, genuine quality, and certified skill your motorcycle, scooter, or EV deserves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#0D0E15] border border-white/10 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Full-Fledged Mobile Workshop Van</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every GOVOLT van is a self-powered workshop on wheels equipped with pneumatic power tools, ultrasonic parts cleaners, oil extraction pumps, EV battery health diagnostic pods, and emergency jumpstarters.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero hassle — no need to leave your house or office</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Transparent live repair in front of your eyes</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#0D0E15] border border-white/10 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">100% Genuine OEM / OES Parts</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We source directly from manufacturer-approved tier-1 suppliers (Rolon, Bosch, MRF, CEAT, Amaron, Exide, Endurance). Every part carries official QR verification and warranty.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span>Box unsealed in front of customer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span>10-Day / 1000 KM complete service warranty</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#0D0E15] border border-white/10 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Certified Master Technicians</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our mechanics undergo 120+ hours of rigorous certification covering internal combustion engines, high-voltage battery management systems (BMS), motor controllers, and hydraulic disc braking circuits.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Background-verified & police cleared</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Equipped with digital torque meters & safety gear</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#0D0E15] border border-white/10 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Eco-Friendly & Clean Doorstep Care</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We use 100% waterless eco-wash solutions, spill-proof oil catchment trays, and recycle all used batteries and metal scrap responsibly with certified pollution control board recyclers.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Zero oil stain on your premises</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Over 140+ kg CO2 offset per vehicle lifecycle</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency RSA Callout Banner */}
      <div className="p-8 bg-gradient-to-r from-red-950/70 via-[#0D0E15] to-red-950/70 border border-red-500/40 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Siren className="w-7 h-7 animate-pulse text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Need Urgent Roadside Assistance?</h3>
            <p className="text-xs text-slate-300 mt-1">
              Flat tire, broken chain, dead battery, or throttle lockout? Our rapid responder van is on 24x7 standby.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
          <button
            onClick={onOpenSOS}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.6)]"
          >
            Launch Emergency SOS
          </button>
          <a
            href={`tel:${specialistPhone}`}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/10"
          >
            Call {specialistPhone}
          </a>
        </div>
      </div>
    </div>
  );
};
