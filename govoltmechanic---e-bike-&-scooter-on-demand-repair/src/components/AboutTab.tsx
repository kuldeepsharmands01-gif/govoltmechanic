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
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full text-red-700 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-red-600" />
          The Future of Two-Wheeler & EV Service in India
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight max-w-3xl mx-auto leading-tight">
          Bringing the Full Garage Workshop to Your Doorstep.
        </h1>

        <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
          GOVOLT (Apna Doorstep Mechanic) was founded to eliminate long service center waiting lines, unverified repair charges, and stranded roadside breakdowns. We engineer specialized mobile workshop vans equipped with hydraulic lifts, high-voltage EV diagnostic scanners, and 100% genuine spare parts.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenBooking}
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <span>Book Doorstep Van</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={`tel:${specialistPhone}`}
            className="px-6 py-3.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>Call Helpline: {specialistPhone}</span>
          </a>
        </div>
      </div>

      {/* Key Numbers & Impact Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl text-center space-y-2 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black font-mono text-black">50+ Vans</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Mobile Workshops on Road</p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl text-center space-y-2 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black font-mono text-emerald-700">25,000+</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completed Doorstep Repairs</p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl text-center space-y-2 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black font-mono text-amber-700">15 Mins</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average Emergency RSA ETA</p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl text-center space-y-2 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black font-mono text-red-600">4.9 / 5.0</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Customer Satisfaction Score</p>
        </div>
      </div>

      {/* The 4 Pillars of GOVOLT Standard */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-black uppercase tracking-wider">Why Riders Trust Us</h2>
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            We deliver the exact transparency, genuine quality, and certified skill your motorcycle, scooter, or EV deserves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-black">Full-Fledged Mobile Workshop Van</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Every GOVOLT van is a self-powered workshop on wheels equipped with pneumatic power tools, ultrasonic parts cleaners, oil extraction pumps, EV battery health diagnostic pods, and emergency jumpstarters.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                <span>Zero hassle — no need to leave your house or office</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                <span>Transparent live repair in front of your eyes</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-black">100% Genuine OEM / OES Parts</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              We source directly from manufacturer-approved tier-1 suppliers (Rolon, Bosch, MRF, CEAT, Amaron, Exide, Endurance). Every part carries official QR verification and warranty.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Box unsealed in front of customer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>10-Day / 1000 KM complete service warranty</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-black">Certified Master Technicians</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Our mechanics undergo 120+ hours of rigorous certification covering internal combustion engines, high-voltage battery management systems (BMS), motor controllers, and hydraulic disc braking circuits.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Background-verified & police cleared</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Equipped with digital torque meters & safety gear</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-red-600">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-black">Eco-Friendly & Clean Doorstep Care</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              We use 100% waterless eco-wash solutions, spill-proof oil catchment trays, and recycle all used batteries and metal scrap responsibly with certified pollution control board recyclers.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                <span>Zero oil stain on your premises</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                <span>Over 140+ kg CO2 offset per vehicle lifecycle</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency RSA Callout Banner */}
      <div className="p-8 bg-red-50 border border-red-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <Siren className="w-7 h-7 animate-pulse text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-black">Need Urgent Roadside Assistance?</h3>
            <p className="text-xs text-slate-700 mt-1">
              Flat tire, broken chain, dead battery, or throttle lockout? Our rapid responder van is on 24x7 standby.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
          <button
            onClick={onOpenSOS}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
          >
            Launch Emergency SOS
          </button>
          <a
            href={`tel:${specialistPhone}`}
            className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl border border-slate-300 shadow-sm"
          >
            Call {specialistPhone}
          </a>
        </div>
      </div>
    </div>
  );
};
