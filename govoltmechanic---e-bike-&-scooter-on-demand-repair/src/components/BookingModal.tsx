import React, { useState } from 'react';
import { X, Check, Wrench, ShieldCheck, Zap, Disc, Cpu, CircleDot, Settings, Clock, MapPin, Navigation, Calendar, User, Phone, Sparkles } from 'lucide-react';
import { Vehicle, ServiceItem, Appointment, Technician } from '../types';
import { SERVICE_ITEMS, TECHNICIANS } from '../data/mockData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onConfirmBooking: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onConfirmBooking,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(vehicles[0] || {
    id: 'custom',
    type: 'ebike',
    make: 'Custom Build',
    model: 'Electric Bike',
    year: 2024,
    batteryHealth: 90,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&q=80',
  });

  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([SERVICE_ITEMS[0], SERVICE_ITEMS[1]]);
  const [address, setAddress] = useState('14/112 Mall Road, Civil Lines, Kanpur, UP 208001');
  const [dispatchType, setDispatchType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledSlot, setScheduledSlot] = useState('Today at 2:30 PM');
  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [customerPhone, setCustomerPhone] = useState('6397852208');
  const [notes, setNotes] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Service toggle
  const toggleService = (service: ServiceItem) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      if (selectedServices.length === 1) return; // Must select at least 1
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalMinutes = selectedServices.reduce((sum, s) => sum + s.estimatedMinutes, 0);

  const handleDetectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAddress(`GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}) - Civil Lines, Kanpur, UP`);
          setIsLocating(false);
        },
        () => {
          setAddress('117/N/80 Swaroop Nagar, Kanpur, Uttar Pradesh 208002');
          setIsLocating(false);
        }
      );
    } else {
      setAddress('117/N/80 Swaroop Nagar, Kanpur, Uttar Pradesh 208002');
      setIsLocating(false);
    }
  };

  const handleFinalSubmit = () => {
    const assignedTech: Technician = TECHNICIANS[Math.floor(Math.random() * TECHNICIANS.length)];
    const newAppointment: Appointment = {
      id: `GV-${Math.floor(10000 + Math.random() * 90000)}`,
      vehicle: selectedVehicle,
      services: selectedServices,
      totalPrice,
      technician: assignedTech,
      status: 'en_route',
      address,
      scheduledTime: dispatchType === 'immediate' ? 'Immediate Dispatch' : scheduledSlot,
      createdAt: 'Just now',
      etaMinutes: Math.floor(10 + Math.random() * 10),
      customerName,
      customerPhone,
      notes,
    };

    onConfirmBooking(newAppointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0D0E15] border border-cyan-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.25)] flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-400 rounded-lg rotate-45 flex items-center justify-center text-[#0A0B10]">
              <Wrench className="w-5 h-5 -rotate-45 font-black" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white uppercase italic">
                BOOK GOVOLT REPAIR DISPATCH
              </h2>
              <p className="text-xs text-slate-400">Step {step} of 4 • On-Demand Electric Bike & Scooter Mobile Service</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="px-6 py-3 bg-[#0A0B10] border-b border-white/5 flex justify-between gap-2 shrink-0">
          {[
            { num: 1, label: 'Vehicle' },
            { num: 2, label: 'Diagnostics' },
            { num: 3, label: 'Location & Time' },
            { num: 4, label: 'Confirm' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => s.num < step && setStep(s.num as any)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                step === s.num
                  ? 'bg-cyan-500 text-black shadow-[0_0_12px_#22d3ee]'
                  : step > s.num
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/5 text-slate-500'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* STEP 1: VEHICLE SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  Select Your Electric Bike or Scooter
                </h3>
                <span className="text-xs text-slate-400">3 Vehicles in Garage</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedVehicle.id === v.id
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="h-28 rounded-xl overflow-hidden mb-3 bg-slate-900 border border-white/5">
                        <img src={v.image} alt={v.model} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{v.make}</p>
                      <p className="text-base font-black text-white">{v.model}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Battery Health</span>
                      <span className="font-mono font-bold text-green-400">{v.batteryHealth}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Vehicle Option */}
              <div className="p-4 bg-white/5 border border-dashed border-white/15 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Have a different model or custom EV?</p>
                  <p className="text-[11px] text-slate-400">Our vans carry specialized diagnostic splitters for all brands.</p>
                </div>
                <button
                  onClick={() =>
                    setSelectedVehicle({
                      id: `custom-${Date.now()}`,
                      type: 'ebike',
                      make: 'Other EV',
                      model: 'Custom E-Bike / Scooter',
                      year: 2025,
                      batteryHealth: 95,
                      image: 'https://images.unsplash.com/photo-1597089542047-b9873d82d8ec?auto=format&fit=crop&w=600&q=80',
                    })
                  }
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold uppercase rounded-xl text-white transition-colors"
                >
                  Select Custom
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DIAGNOSTICS & REPAIR SERVICES */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  Select Required Services & Diagnostics
                </h3>
                <span className="text-xs text-cyan-400 font-mono font-bold">
                  Estimated Total: ${totalPrice} ({totalMinutes} mins)
                </span>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {SERVICE_ITEMS.map((service) => {
                  const isSelected = selectedServices.some((s) => s.id === service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg shrink-0 mt-0.5 flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-white/20 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-white">{service.name}</p>
                          {service.popular && (
                            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[9px] font-bold uppercase rounded-full border border-cyan-500/30">
                              MOST POPULAR
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{service.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-base text-cyan-400">${service.price}</p>
                        <p className="text-[10px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {service.estimatedMinutes}m
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION & DISPATCH TIME */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Address Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center justify-between">
                  <span>Service Address / Location Pin</span>
                  <button
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <Navigation className="w-3 h-3" /> {isLocating ? 'Locating...' : 'Detect GPS Location'}
                  </button>
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-cyan-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter street address or landmark..."
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Dispatch Timing */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  Select Dispatch Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setDispatchType('immediate')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      dispatchType === 'immediate'
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      <p className="font-bold text-sm text-white">Immediate Dispatch</p>
                    </div>
                    <p className="text-xs text-slate-400">
                      Mobile unit arrives in <strong className="text-cyan-400">15-25 mins</strong>
                    </p>
                  </div>

                  <div
                    onClick={() => setDispatchType('scheduled')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      dispatchType === 'scheduled'
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                      <p className="font-bold text-sm text-white">Schedule Slot</p>
                    </div>
                    <p className="text-xs text-slate-400">Choose custom date & time slot</p>
                  </div>
                </div>

                {dispatchType === 'scheduled' && (
                  <div className="pt-2">
                    <select
                      value={scheduledSlot}
                      onChange={(e) => setScheduledSlot(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Today at 2:30 PM">Today at 2:30 PM</option>
                      <option value="Today at 5:00 PM">Today at 5:00 PM</option>
                      <option value="Tomorrow at 10:00 AM">Tomorrow at 10:00 AM</option>
                      <option value="Tomorrow at 2:00 PM">Tomorrow at 2:00 PM</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Rider Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Phone Number</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Additional Symptom Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Squeaking when braking, throttle cuts out above 20mph..."
                  rows={2}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="p-5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <div>
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Vehicle</p>
                    <p className="text-base font-black text-white">{selectedVehicle.make} {selectedVehicle.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Dispatch Mode</p>
                    <p className="text-xs font-bold text-white font-mono">{dispatchType === 'immediate' ? 'Immediate On-Demand' : scheduledSlot}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-2">Selected Services ({selectedServices.length})</p>
                  <div className="space-y-1.5">
                    {selectedServices.map((s) => (
                      <div key={s.id} className="flex justify-between text-xs">
                        <span className="text-slate-200">• {s.name}</span>
                        <span className="font-mono text-cyan-400 font-bold">${s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-cyan-500/20 flex justify-between items-center">
                  <span className="text-xs text-slate-300">Service Location</span>
                  <span className="text-xs font-bold text-white font-mono truncate max-w-[280px]">{address}</span>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Services</span>
                  <span className="font-mono text-white">${totalPrice}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Mobile Workshop Van Travel Fee</span>
                  <span className="font-mono text-green-400 font-bold">FREE PROMO</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated On-Site Repair Time</span>
                  <span className="font-mono text-slate-200">{totalMinutes} Mins</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Total Charge</span>
                  <span className="text-xl font-mono text-cyan-400">${totalPrice}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-white/5 border-t border-white/10 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase text-slate-300 transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((step + 1) as any)}
              className="px-6 py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_#22d3ee] active:scale-95 flex items-center gap-2"
            >
              Continue Step {step + 1}
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:from-cyan-300 hover:to-cyan-400 transition-all shadow-[0_0_25px_rgba(34,211,238,0.6)] active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              DISPATCH GOVOLT SPECIALIST NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
