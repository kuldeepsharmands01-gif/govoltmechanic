import React, { useState, useMemo } from 'react';
import { Plus, Battery, ShieldCheck, Wrench, Calendar, Zap, CheckCircle2, FileText, ChevronRight, Leaf, Award, Download, FileDown, Loader2, Filter, Search, Car, Bike, Truck, Sparkles } from 'lucide-react';
import { Vehicle } from '../types';
import { generateVehicleServiceHistoryPDF, getServiceRecordsForVehicle } from '../utils/pdfGenerator';
import { BrandLogoBadge } from './BrandLogoBadge';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<'ebike' | 'escooter' | 'cargo' | 'high_performance' | 'electric_car'>('escooter');
  const [licensePlate, setLicensePlate] = useState('');
  const [rangeKm, setRangeKm] = useState('150');
  const [topSpeedKmh, setTopSpeedKmh] = useState('85');
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
      batteryHealth: 99,
      licensePlate: licensePlate || 'UP78 EV 2026',
      rangeKm: Number(rangeKm) || 150,
      topSpeedKmh: Number(topSpeedKmh) || 85,
      lastServiced: '2026-08-15',
      image:
        type === 'electric_car'
          ? 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'
          : type === 'cargo'
          ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
          : type === 'high_performance'
          ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'
          : type === 'escooter'
          ? 'https://images.unsplash.com/photo-1597089542047-b9873d82d8ec?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    };

    onAddVehicle(newV);
    setMake('');
    setModel('');
    setLicensePlate('');
    setShowAddForm(false);
  };

  // Filter list
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.licensePlate && v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedBrandFilter === 'all') return true;
      if (selectedBrandFilter === 'tata') return v.make.toLowerCase().includes('tata');
      if (selectedBrandFilter === 'mahindra') return v.make.toLowerCase().includes('mahindra');
      if (selectedBrandFilter === 'ather') return v.make.toLowerCase().includes('ather');
      if (selectedBrandFilter === 'ola') return v.make.toLowerCase().includes('ola');
      if (selectedBrandFilter === 'tvs') return v.make.toLowerCase().includes('tvs');
      if (selectedBrandFilter === 'bajaj') return v.make.toLowerCase().includes('bajaj') || v.make.toLowerCase().includes('chetak');
      if (selectedBrandFilter === 'cargo') return v.type === 'cargo';
      if (selectedBrandFilter === 'cars') return v.type === 'electric_car';
      return true;
    });
  }, [vehicles, searchQuery, selectedBrandFilter]);

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
      vehicleId: 'v7',
      date: 'August 10, 2026',
      vehicle: 'Tata Nexon.ev Empowered',
      service: 'High Voltage Ziptron Inverter Diagnostics & Coolant Check',
      tech: 'Amit Verma',
      cost: '₹2,490',
      pdf: 'GV-CERT-NEXON.pdf',
    },
    {
      id: 'h4',
      vehicleId: 'v8',
      date: 'July 22, 2026',
      vehicle: 'Mahindra XUV400 PRO',
      service: 'Fast-Charging DC Port Thermal Scan & Suspension Tighten',
      tech: 'Priya Singh',
      cost: '₹2,290',
      pdf: 'GV-CERT-XUV400.pdf',
    },
    {
      id: 'h5',
      vehicleId: 'v5',
      date: 'August 01, 2026',
      vehicle: 'Ultraviolette F77 Mach 2',
      service: 'Hub Motor Diagnostics & Track Dyno Calibration',
      tech: 'Rahul Kumar',
      cost: '₹2,890',
      pdf: 'GV-CERT-7771.pdf',
    },
    {
      id: 'h6',
      vehicleId: 'v18',
      date: 'August 04, 2026',
      vehicle: 'Euler HiLoad EV Cargo',
      service: 'Heavy-Duty Differential Fluid Change & Brake Re-line',
      tech: 'Rohan Gupta',
      cost: '₹1,850',
      pdf: 'GV-CERT-EULER.pdf',
    },
  ];

  const selectedVehicleObj = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const getTypeLabel = (t: string) => {
    switch (t) {
      case 'electric_car':
        return 'Electric Car';
      case 'cargo':
        return 'EV Cargo Van';
      case 'high_performance':
        return 'Hyper-EV';
      case 'ebike':
        return 'E-Bike';
      case 'escooter':
      default:
        return 'E-Scooter';
    }
  };

  return (
    <div className="space-y-8 text-slate-800 relative">
      {/* Floating Download Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-red-300 p-4 rounded-2xl shadow-xl animate-bounce-short flex items-center gap-3 max-w-md">
          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <FileDown className="w-5 h-5 animate-pulse" />
          </div>
          <p className="text-xs font-bold text-slate-800">{toastMessage}</p>
        </div>
      )}

      {/* Overview Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-sm">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Registered Indian EVs</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-black font-mono">{vehicles.length}</p>
            <span className="text-xs text-red-600 font-mono font-bold">20+ Brands Active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-sm">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Repairs</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-black font-mono">14</p>
            <span className="text-xs text-emerald-700 font-mono font-bold">Passed Inspection</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-sm">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" /> CO2 Offset
          </p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-emerald-700 font-mono">142 kg</p>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Zero Emission</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-sm">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Avg Battery Health</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-red-600 font-mono">96%</p>
            <span className="text-[10px] text-red-600 font-mono font-bold">Optimal BMS</span>
          </div>
        </div>
      </div>

      {/* Vehicles Grid Section */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-black">
                My Garage Vehicles ({filteredVehicles.length} of {vehicles.length})
              </h3>
              <span className="px-2.5 py-0.5 bg-red-50 text-red-700 text-[10px] font-mono font-bold rounded-full border border-red-200">
                INDIA EV FLEET
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive garage registry featuring Tata, Mahindra, Ather, Ola, TVS, Chetak, Ultraviolette & more.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search brand, model, plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-black placeholder-slate-400 focus:outline-none focus:border-red-500 shadow-xs"
              />
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Brand Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Brands (20+)' },
            { id: 'tata', label: 'Tata .ev' },
            { id: 'mahindra', label: 'Mahindra Electric' },
            { id: 'ather', label: 'Ather Energy' },
            { id: 'ola', label: 'Ola Electric' },
            { id: 'tvs', label: 'TVS Electric' },
            { id: 'bajaj', label: 'Bajaj Chetak' },
            { id: 'cars', label: 'Electric Cars' },
            { id: 'cargo', label: 'Commercial Cargo' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSelectedBrandFilter(pill.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all text-[11px] ${
                selectedBrandFilter === pill.id
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleCreateVehicle} className="bg-white border border-slate-300 rounded-3xl p-6 space-y-4 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-600" /> Add Vehicle to GOVOLT Garage
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Real-time Doorstep Support</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600">EV Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-black font-medium"
                >
                  <option value="escooter">E-Scooter (Ather, Ola, Chetak, Vida)</option>
                  <option value="ebike">E-Bike / Motorcycle (Revolt, Ultraviolette, Tork)</option>
                  <option value="electric_car">Electric Car / SUV (Tata, Mahindra, MG)</option>
                  <option value="cargo">Commercial EV Cargo (Euler, Switch, Ashok Leyland)</option>
                  <option value="high_performance">Hyper Performance (F77)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600">Make / Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Tata Motors, Mahindra, Ather, Ola, TVS"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-black"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600">Model Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nexon.ev, XUV400, 450X, S1 Pro, Indie"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-black"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600">License Plate</label>
                <input
                  type="text"
                  placeholder="e.g. UP78 EV 2026"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-black"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 text-white font-black text-xs uppercase rounded-xl hover:bg-red-700 shadow-sm"
              >
                Register EV to Garage
              </button>
            </div>
          </form>
        )}

        {/* Vehicles Grid with Brand Logos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => {
            const isDownloading = downloadingVehicleId === v.id;
            const recordsCount = getServiceRecordsForVehicle(v).length;

            return (
              <div
                key={v.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden p-5 space-y-4 shadow-sm hover:border-red-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Image and Header Badges */}
                  <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                    <img
                      src={v.image}
                      alt={v.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Brand Logo Floating Badge */}
                    <div className="absolute top-2.5 left-2.5 shadow-md">
                      <BrandLogoBadge brand={v.make} size="sm" />
                    </div>

                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-md text-red-700 text-[10px] font-black rounded-full uppercase border border-red-200 shadow-sm">
                      {getTypeLabel(v.type)}
                    </span>

                    {v.licensePlate && (
                      <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-black/85 backdrop-blur-md text-white font-mono text-[10px] font-black rounded-lg border border-white/20 shadow-sm">
                        {v.licensePlate}
                      </span>
                    )}
                  </div>

                  {/* Brand & Model Details */}
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{v.make}</p>
                      <span className="text-[10px] text-red-700 font-mono font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        {recordsCount} {recordsCount === 1 ? 'Service Log' : 'Service Logs'}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-black leading-tight mt-0.5">{v.model}</h4>
                  </div>

                  {/* Range & Speed Specs */}
                  {(v.rangeKm || v.topSpeedKmh) && (
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Certified Range</p>
                        <p className="text-xs font-black text-red-600 font-mono">{v.rangeKm || 150} KM</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Top Speed</p>
                        <p className="text-xs font-black text-emerald-700 font-mono">{v.topSpeedKmh || 90} KM/H</p>
                      </div>
                    </div>
                  )}

                  {/* Battery Health Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">Battery BMS Health</span>
                      <span className="font-mono font-bold text-emerald-700">{v.batteryHealth}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-emerald-500"
                        style={{ width: `${v.batteryHealth}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-1 flex justify-between items-center text-[11px] text-slate-500">
                    <span>Last Serviced: {v.lastServiced || 'N/A'}</span>
                    <button
                      onClick={onOpenBooking}
                      className="text-red-600 font-black hover:underline uppercase tracking-wider flex items-center gap-1"
                    >
                      Book Service →
                    </button>
                  </div>
                </div>

                {/* Primary Action Button: Download Service History PDF */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleDownloadPDF(v)}
                    disabled={isDownloading}
                    className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 text-red-600" />
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
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" /> Digital Repair History & Certificates
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">Certified maintenance logs for resale value & 30-day warranty assurance.</p>
          </div>

          {/* Vehicle Specific Download Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800">
              <Filter className="w-3.5 h-3.5 text-red-600" />
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="bg-transparent text-black text-xs font-bold focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-white text-black">
                    {v.make} {v.model} ({v.licensePlate || 'EV'})
                  </option>
                ))}
              </select>
            </div>

            {selectedVehicleObj && (
              <button
                onClick={() => handleDownloadPDF(selectedVehicleObj)}
                disabled={downloadingVehicleId === selectedVehicleObj.id}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {downloadingVehicleId === selectedVehicleObj.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-white" />
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
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-black">{item.service}</p>
                    <p className="text-xs text-slate-600 font-medium">
                      {item.vehicle} • Specialist: {item.tech}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div className="text-left sm:text-right">
                    <p className="font-mono font-black text-sm text-red-600">{item.cost}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{item.date}</p>
                  </div>

                  <button
                    onClick={() => handleDownloadPDF(matchedVehicle)}
                    className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-mono font-bold rounded-lg border border-red-200 transition-all flex items-center gap-1.5"
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
