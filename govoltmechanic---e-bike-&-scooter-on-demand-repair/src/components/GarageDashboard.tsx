import React, { useState } from 'react';
import { Plus, Battery, ShieldCheck, Wrench, Calendar, Zap, CheckCircle2, FileText, ChevronRight, Leaf, Award, Download, FileDown, Loader2, Filter } from 'lucide-react';
import { Vehicle } from '../types';
import { generateVehicleServiceHistoryPDF, getServiceRecordsForVehicle } from '../utils/pdfGenerator';

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
  const [downloadingVehicleId, setDownloadingVehicleId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || 'all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDownloadPDF = (vehicle: Vehicle) => {
    setDownloadingVehicleId(vehicle.id);
    setToastMessage(`Generating official PDF service history for ${vehicle.make} ${vehicle.model}...`);

    setTimeout(() => {
      try {
        generateVehicleServiceHistoryPDF(vehicle);
        setToastMessage(`✓ Service History PDF generated for ${vehicle.make} ${vehicle.model}`);
      } catch (err) {
        console.error('PDF generation error:', err);
        setToastMessage(`Failed to generate PDF. Please try again.`);
      } finally {
        setDownloadingVehicleId(null);
        setTimeout(() => setToastMessage(null), 4000);
      }
    }, 450);
  };

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
      vehicleId: 'v1',
      date: 'July 20, 2026',
      vehicle: 'Ather 450X Gen 3',
      service: 'Hydraulic Brake Bleed & BMS Firmware Update',
      tech: 'Amit Verma',
      cost: '₹1,490',
      pdf: 'GV-CERT-450X.pdf',
    },
    {
      id: 'h2',
      vehicleId: 'v2',
      date: 'May 14, 2026',
      vehicle: 'Ola S1 Pro Gen 2',
      service: 'Belt Drive Tensioning & Cell Balancing',
      tech: 'Priya Singh',
      cost: '₹990',
      pdf: 'GV-CERT-8899.pdf',
    },
    {
      id: 'h3',
      vehicleId: 'v3',
      date: 'March 02, 2026',
      vehicle: 'Revolt RV400',
      service: '30-Point High-Voltage Safety Audit & Controller Calibration',
      tech: 'Rohan Gupta',
      cost: '₹2,190',
      pdf: 'GV-CERT-4000.pdf',
    },
    {
      id: 'h4',
      vehicleId: 'v4',
      date: 'January 18, 2026',
      vehicle: 'TVS iQube Electric',
      service: 'Fast-Charging Controller Calibration & BMS Sync',
      tech: 'Pradeep Sharma',
      cost: '₹1,250',
      pdf: 'GV-CERT-2104.pdf',
    },
    {
      id: 'h5',
      vehicleId: 'v5',
      date: 'December 05, 2025',
      vehicle: 'Ultraviolette F77',
      service: 'Hub Motor Diagnostics & Track Dyno Calibration',
      tech: 'Rahul Kumar',
      cost: '₹2,890',
      pdf: 'GV-CERT-7771.pdf',
    },
    {
      id: 'h6',
      vehicleId: 'v6',
      date: 'April 18, 2026',
      vehicle: 'Bajaj Chetak',
      service: 'All-Metal Body Dampening & Throttle Calibration',
      tech: 'Rohan Gupta',
      cost: '₹990',
      pdf: 'GV-CERT-2901.pdf',
    },
  ];

  const selectedVehicleObj = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  return (
    <div className="space-y-8 text-slate-100 relative">
      {/* Floating Download Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D0E15]/95 border border-cyan-400/80 p-4 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.4)] backdrop-blur-2xl animate-bounce-short flex items-center gap-3 max-w-md">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shrink-0">
            <FileDown className="w-5 h-5 animate-pulse" />
          </div>
          <p className="text-xs font-bold text-slate-200">{toastMessage}</p>
        </div>
      )}

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
            <p className="text-3xl font-black text-white font-mono">14</p>
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
            <p className="text-3xl font-black text-cyan-400 font-mono">95%</p>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">Optimal BMS</span>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              My Garage Vehicles ({vehicles.length})
            </h3>
            <p className="text-[11px] text-slate-400">Manage registered electric vehicles and download certified service history PDFs.</p>
          </div>
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
          {vehicles.map((v) => {
            const isDownloading = downloadingVehicleId === v.id;
            const recordsCount = getServiceRecordsForVehicle(v).length;

            return (
              <div
                key={v.id}
                className="bg-[#0D0E15] border border-white/10 rounded-2xl overflow-hidden p-5 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{v.make}</p>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        {recordsCount} {recordsCount === 1 ? 'Service Log' : 'Service Logs'}
                      </span>
                    </div>
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

                  <div className="pt-1 flex justify-between items-center text-[11px] text-slate-400">
                    <span>Last Serviced: {v.lastServiced || 'N/A'}</span>
                    <button
                      onClick={onOpenBooking}
                      className="text-cyan-400 font-bold hover:underline uppercase tracking-wider flex items-center gap-1"
                    >
                      Book Service →
                    </button>
                  </div>
                </div>

                {/* Primary Action Button: Download Service History PDF */}
                <div className="pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleDownloadPDF(v)}
                    disabled={isDownloading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500/15 hover:from-cyan-500/25 to-blue-500/15 hover:to-blue-500/25 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 text-cyan-400" />
                        <span>Download Service History (PDF)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Service History & Certificates */}
      <div className="bg-[#0D0E15] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" /> Digital Repair History & Certificates
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Blockchain verified maintenance logs for resale value & 10-day warranty assurance.</p>
          </div>

          {/* Vehicle Specific Download Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {v.make} {v.model} ({v.licensePlate || 'EV'})
                  </option>
                ))}
              </select>
            </div>

            {selectedVehicleObj && (
              <button
                onClick={() => handleDownloadPDF(selectedVehicleObj)}
                disabled={downloadingVehicleId === selectedVehicleObj.id}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_#22d3ee] flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {downloadingVehicleId === selectedVehicleObj.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Download className="w-4 h-4 text-black" />
                )}
                <span>Download Service History (PDF)</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {serviceHistory.map((item) => {
            const matchedVehicle = vehicles.find((v) => v.id === item.vehicleId) || vehicles[0];

            return (
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
                    onClick={() => handleDownloadPDF(matchedVehicle)}
                    className="px-3.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 text-xs font-mono font-bold rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center gap-1.5"
                    title={`Download certified PDF history for ${item.vehicle}`}
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

