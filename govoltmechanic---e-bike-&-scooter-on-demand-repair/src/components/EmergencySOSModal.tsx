import React, { useState } from 'react';
import { AlertTriangle, Siren, ShieldAlert, MapPin, Truck, Phone, Zap, X, CheckCircle, Radio, Clock, Sparkles } from 'lucide-react';
import { Appointment, Vehicle } from '../types';
import { TECHNICIANS } from '../data/mockData';
import { triggerBrowserNotification, playEtaChime } from '../utils/notifications';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  specialistPhone: string;
  audioEnabled?: boolean;
  onConfirmSOS: (emergencyAppointment: Appointment) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  specialistPhone,
  audioEnabled = true,
  onConfirmSOS,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(vehicles[0] || {
    id: 'ev-default',
    make: 'Ather',
    model: '450X Gen 3',
    year: 2024,
    batteryHealth: 88,
    lastServiced: '2026-05-10',
    type: 'scooter',
    licensePlate: 'UP78 EV 2024',
  });

  const [emergencyReason, setEmergencyReason] = useState<string>('Critical Battery BMS Shutdown');
  const [customNote, setCustomNote] = useState<string>('');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [locationAddress, setLocationAddress] = useState<string>('Mall Road Crossing, Civil Lines, Kanpur, UP');

  if (!isOpen) return null;

  const nearestTech = TECHNICIANS[0]; // Amit Verma (1.2 km away)

  const handleTriggerSOS = () => {
    setIsDispatching(true);

    setTimeout(() => {
      const emergencyAppointment: Appointment = {
        id: `SOS-${Math.floor(10000 + Math.random() * 90000)}`,
        vehicle: selectedVehicle,
        services: [
          {
            id: 'sos-1',
            name: `PRIORITY EMERGENCY RESCUE (${emergencyReason})`,
            price: 49,
            estimatedMinutes: 15,
            iconName: 'AlertTriangle',
            category: 'electrical',
            description: customNote || 'Urgent roadside breakdown rescue unit requested.',
          },
        ],
        technician: {
          ...nearestTech,
          vanId: `${nearestTech.vanId} [EMERGENCY RESCUE]`,
        },
        address: locationAddress,
        status: 'en_route',
        etaMinutes: 4,
        scheduledTime: 'IMMEDIATE SOS DISPATCH',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customerName: 'Alex Rivers',
        customerPhone: '+91 98391 88200',
        totalPrice: 49,
      };

      // Play audio notification
      if (audioEnabled) {
        playEtaChime();
      }

      // Trigger browser alert notification
      triggerBrowserNotification(
        '🚨 EMERGENCY SOS DISPATCHED',
        `Priority Technician ${nearestTech.name} dispatched to ${locationAddress}! ETA 4 Mins.`
      );

      onConfirmSOS(emergencyAppointment);
      setIsDispatching(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0E0A12] border-2 border-red-500/60 rounded-3xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.35)] space-y-6 overflow-hidden">
        {/* Animated Background Siren Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-bounce shrink-0">
              <Siren className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-red-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full animate-pulse">
                  PRIORITY TIER 1
                </span>
                <span className="text-[10px] font-mono text-red-400">EMERGENCY SOS MODE</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Roadside Emergency Rescue</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Priority Technician Distance Banner */}
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <img src={nearestTech.avatar} alt={nearestTech.name} className="w-11 h-11 rounded-xl object-cover border border-red-500/40" />
            <div>
              <p className="text-xs font-black text-white flex items-center gap-1.5">
                <span>{nearestTech.name}</span>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[9px] rounded font-mono">1.2 KM AWAY</span>
              </p>
              <p className="text-[10px] text-red-300 font-medium">{nearestTech.vanId} • High-Torque Rescue Kit</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated SOS Arrival</p>
            <p className="text-lg font-mono font-black text-red-400 flex items-center justify-end gap-1">
              <Clock className="w-4 h-4 text-red-400 animate-spin" /> ~4 MINS
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 relative z-10">
          {/* Select Breakdown Vehicle */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Stranded EV Vehicle
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedVehicle.id === v.id
                      ? 'bg-red-500/20 border-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{v.make} {v.model}</p>
                    <p className="text-[10px] font-mono text-slate-500">{v.licensePlate}</p>
                  </div>
                  {selectedVehicle.id === v.id && (
                    <CheckCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Reason Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Urgent Breakdown Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Critical Battery BMS Shutdown',
                'Hydraulic Brake Failure',
                'Tire Blowout / Stalled',
                'Motor / Controller Cutoff',
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setEmergencyReason(reason)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                    emergencyReason === reason
                      ? 'bg-red-500/25 border-red-400 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${emergencyReason === reason ? 'text-red-400' : 'text-slate-500'}`} />
                  <span className="truncate">{reason}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown Location Confirmation */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>GPS Breakdown Location</span>
              <span className="text-[10px] text-emerald-400 font-mono">LIVE SATELLITE FIX</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-red-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-red-500/40 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <input
              type="text"
              placeholder="Additional hazard details (e.g., 'Parked near signal, hazard lights on')"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-red-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2 relative z-10">
          <button
            onClick={handleTriggerSOS}
            disabled={isDispatching}
            className="w-full py-4 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(239,68,68,0.7)] hover:shadow-[0_0_40px_rgba(239,68,68,0.9)] active:scale-95 flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {isDispatching ? (
              <>
                <Zap className="w-5 h-5 animate-spin text-black" />
                <span>DISPATCHING PRIORITY RESCUE VAN...</span>
              </>
            ) : (
              <>
                <Siren className="w-5 h-5 text-black animate-pulse" />
                <span>DISPATCH PRIORITY SOS RESCUE (4 MINS)</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] pt-1 px-1">
            <span className="text-slate-400">Direct Hotline Emergency:</span>
            <a
              href={`tel:${specialistPhone}`}
              className="text-red-400 font-extrabold hover:underline flex items-center gap-1 font-mono"
            >
              <Phone className="w-3.5 h-3.5" />
              {specialistPhone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySOSModal;
