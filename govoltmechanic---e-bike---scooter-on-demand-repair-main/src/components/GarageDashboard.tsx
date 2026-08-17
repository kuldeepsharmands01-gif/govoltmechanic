import React, { useState } from 'react';
import { Plus, Battery, ShieldCheck, Wrench, Calendar, Zap, CheckCircle2, FileText, ChevronRight, Leaf, Award } from 'lucide-react';
import { Vehicle } from '../types';

interface GarageDashboardProps {
  vehicles: Vehicle[];
  onAddVehicle: (v: Vehicle) => void;
  onOpenBooking: () => void;
}

export const GarageDashboard: React.FC<GarageDashboardProps> = ({
  vehicles,
  onAddVehicle,
  onOpenBooking,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<'ebike' | 'escooter' | 'cargo'>('ebike');

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model) return;

    const newV: Vehicle = {
      id: `v-${Date.now()}`,
      type,
      make,
      model,
      year: 2025,
      batteryHealth: 98,
      lastServiced: '2026-08-01',
      image:
        type === 'escooter'
          ? 'https://images.unsplash.com/photo-1597089542047-b9873d82d8ec?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&q=80',
    };

    onAddVehicle(newV);
    setMake('');
    setModel('');
    setShowAddForm(false);
  };

  const serviceHistory = [
    {
      id: 'h1',
      date: 'July 20, 2026',
      vehicle: 'Ather 450X Gen 3',
      service: 'Hydraulic Brake Bleed & BMS Firmware Update',
      tech: 'Amit Verma',
      cost: '₹1,490',
      pdf: 'GV-CERT-450X.pdf',
    },
    {
      id: 'h2',
      date: 'May 14, 2026',
      vehicle: 'Ola S1 Pro Gen 2',
      service: 'Belt Drive Tensioning & Cell Balancing',
      tech: 'Priya Singh',
      cost: '₹990',
      pdf: 'GV-CERT-8899.pdf',
    },
    {
      id: 'h3',
      date: 'March 02, 2026',
      vehicle: 'Revolt RV400',
      service: '30-Point High-Voltage Safety Audit & Controller Calibration',
      tech: 'Rohan Gupta',
      cost: '₹2,190',
      pdf: 'GV-CERT-4000.pdf',
    },
    {
      id: 'h4',
      date: 'January 18, 2026',
      vehicle: 'TVS iQube Electric',
      service: 'Fast-Charging Controller Calibration & BMS Sync',
      tech: 'Pradeep Sharma',
      cost: '₹1,250',
      pdf: 'GV-CERT-2104.pdf',
    },
    {
      id: 'h5',
      date: 'December 05, 2025',
      vehicle: 'Hero Electric Optima',
      service: 'Hub Motor Diagnostics & Cell Balancing',
      tech: 'Rahul Kumar',
      cost: '₹890',
      pdf: 'GV-CERT-5050.pdf',
    },
  ];

  return (
    <div className="space-y-8 text-slate-100">
      {/* Overview Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D0E15] border border-white/10 rounded-2xl p-5 space-y-1">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Registered EVs</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-white font-mono">{vehicles.length}</p>
            <span className="text-xs text-cyan-400 font-mono font-bold">100% Active</span>
          </div>
        </div>

        <div className="bg-[#0D0E15] border border-white/10 rounded-2xl p-5 space-y-1">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Repairs</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-white font-mono">12</p>
            <span className="text-xs text-green-400 font-mono font-bold">Passed Inspection</span>
          </div>
        </div>

        <div className="bg-[#0D0E15] border border-white/10 rounded-2xl p-5 space-y-1">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-green-400" /> CO2 Offset
          </p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-green-400 font-mono">142 kg</p>
            <span className="text-[10px] text-slate-400 uppercase font-mono">Zero Emission</span>
          </div>
        </div>

        <div className="bg-[#0D0E15] border border-white/10 rounded-2xl p-5 space-y-1">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Avg Battery Health</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-cyan-400 font-mono">94%</p>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">Optimal BMS</span>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            My Garage Vehicles ({vehicles.length})
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase text-white transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            Add New Vehicle
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleCreateVehicle} className="bg-[#0D0E15] border border-cyan-500/30 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Add Vehicle to GOVOLT Garage</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">EV Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="ebike">E-Bike</option>
                  <option value="escooter">E-Scooter</option>
                  <option value="cargo">Cargo E-Bike</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Make / Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Ather, Ola Electric, Revolt, TVS, Hero Vida"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Model Name</label>
                <input
                  type="text"
                  placeholder="e.g. 450X, S1 Pro, RV400, iQube ST"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-500 text-black font-black text-xs uppercase rounded-xl shadow-[0_0_12px_#22d3ee]"
              >
                Register EV
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-[#0D0E15] border border-white/10 rounded-2xl overflow-hidden p-5 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all group"
            >
              <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-white/5 relative">
                <img src={v.image} alt={v.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 right-2 px-2.5 py-1 bg-black/85 backdrop-blur-md text-cyan-400 text-[10px] font-extrabold rounded-full uppercase border border-cyan-500/30">
                  {v.type === 'escooter' ? 'E-Scooter' : v.type === 'ebike' ? 'E-Bike' : v.type === 'high_performance' ? 'Hyper-EV Bike' : 'EV'}
                </span>
                {v.licensePlate && (
                  <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/90 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-black rounded-lg border border-emerald-500/40 shadow-lg">
                    {v.licensePlate}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{v.make}</p>
                <h4 className="text-base font-black text-white">{v.model}</h4>
              </div>

              {/* Range & Speed Specs */}
              {(v.rangeKm || v.topSpeedKmh) && (
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Certified Range</p>
                    <p className="text-xs font-black text-cyan-400 font-mono">{v.rangeKm || 150} KM</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Top Speed</p>
                    <p className="text-xs font-black text-emerald-400 font-mono">{v.topSpeedKmh || 90} KM/H</p>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Battery BMS Health</span>
                  <span className="font-mono font-bold text-green-400">{v.batteryHealth}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 via-cyan-400 to-sky-300"
                    style={{ width: `${v.batteryHealth}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400">
                <span>Last Serviced: {v.lastServiced || 'N/A'}</span>
                <button
                  onClick={onOpenBooking}
                  className="text-cyan-400 font-bold hover:underline uppercase tracking-wider flex items-center gap-1"
                >
                  Book Service →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Service History & Certificates */}
      <div className="bg-[#0D0E15] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" /> Digital Repair History & Certificates
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Blockchain verified maintenance logs for resale value.</p>
          </div>
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono font-bold">
            3 CERTIFIED LOGS
          </span>
        </div>

        <div className="space-y-3">
          {serviceHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{item.service}</p>
                  <p className="text-xs text-slate-400">
                    {item.vehicle} • Specialist: {item.tech}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <div className="text-left sm:text-right">
                  <p className="font-mono font-bold text-sm text-cyan-400">{item.cost}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{item.date}</p>
                </div>

                <button
                  onClick={() => alert(`Downloading verified PDF report: ${item.pdf}`)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono rounded-lg border border-white/10 transition-colors"
                >
                  PDF Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
