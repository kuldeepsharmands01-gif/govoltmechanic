import React, { useState } from 'react';
import { Header } from './components/Header';
import { MapTracking } from './components/MapTracking';
import { TechnicianCard } from './components/TechnicianCard';
import { BookingModal } from './components/BookingModal';
import { LiveChatModal } from './components/LiveChatModal';
import { StationHubs } from './components/StationHubs';
import { GarageDashboard } from './components/GarageDashboard';
import { AIDiagnostics } from './components/AIDiagnostics';
import { Footer } from './components/Footer';
import { Appointment, Vehicle, ServiceHub } from './types';
import { INITIAL_ACTIVE_APPOINTMENT, INITIAL_VEHICLES, SERVICE_HUBS } from './data/mockData';
import { Clock, Zap, Wrench, ShieldCheck, Leaf, MapPin, Truck, ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fleet' | 'stations' | 'diagnostics'>('dashboard');
  const [appointment, setAppointment] = useState<Appointment | null>(INITIAL_ACTIVE_APPOINTMENT);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [hubs] = useState<ServiceHub[]>(SERVICE_HUBS);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleConfirmBooking = (newAppointment: Appointment) => {
    setAppointment(newAppointment);
    setActiveTab('dashboard');
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles([newVehicle, ...vehicles]);
  };

  const handleSelectHubOnMap = (hub: ServiceHub) => {
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0B10] text-slate-100 font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => setIsBookingOpen(true)}
        activeAppointmentCount={appointment ? 1 : 0}
      />

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6">
        {/* DASHBOARD VIEW: Tracking & Map split */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Active Repair & Control Panel */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              {/* Active Service Status Card */}
              {appointment ? (
                <div className="bg-[#0D0E15] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-cyan-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      Active Repair #{appointment.id}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold">
                      ${appointment.totalPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-cyan-500/30 text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-black text-white truncate">
                        {appointment.vehicle.make} {appointment.vehicle.model}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {appointment.services.map((s) => s.name).join(' • ')}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl mb-4 flex items-center gap-2 text-xs text-slate-300">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">{appointment.address}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimated Tech Arrival</p>
                      <p className="text-2xl font-mono font-black text-cyan-400 leading-none">
                        ~{appointment.etaMinutes} Mins
                      </p>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div className="w-2/3 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]"></div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Booking Prompt Card */
                <div className="bg-[#0D0E15] border border-white/10 rounded-3xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">No Active Repair Session</h3>
                    <p className="text-xs text-slate-400 mt-1">Book an on-demand mobile workshop van to your location.</p>
                  </div>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full py-3 bg-cyan-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_#22d3ee]"
                  >
                    Dispatch Mobile Specialist
                  </button>
                </div>
              )}

              {/* Assigned Specialist Card */}
              {appointment && (
                <TechnicianCard
                  technician={appointment.technician}
                  status={appointment.status}
                  onOpenChat={() => setIsChatOpen(true)}
                  onOpenBooking={() => setIsBookingOpen(true)}
                />
              )}

              {/* Quick Environmental & Fleet Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0D0E15] border border-white/10 rounded-2xl p-4 space-y-1">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Serviced</p>
                  <p className="text-2xl font-mono font-bold text-white">12 Jobs</p>
                </div>
                <div className="bg-[#0D0E15] border border-white/10 rounded-2xl p-4 space-y-1">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-green-400" /> CO2 Offset
                  </p>
                  <p className="text-2xl font-mono font-bold text-green-400">142 kg</p>
                </div>
              </div>
            </div>

            {/* Right Column: Live GPS Tracking Map */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <MapTracking
                appointment={appointment}
                hubs={hubs}
                onSelectHub={handleSelectHubOnMap}
              />
            </div>
          </div>
        )}

        {/* GARAGE VIEW */}
        {activeTab === 'fleet' && (
          <GarageDashboard
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        )}

        {/* STATIONS & HUBS VIEW */}
        {activeTab === 'stations' && (
          <StationHubs
            hubs={hubs}
            onSelectHub={handleSelectHubOnMap}
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        )}

        {/* AI DIAGNOSTIC DOC VIEW */}
        {activeTab === 'diagnostics' && (
          <AIDiagnostics
            onBookWithIssue={(issue) => {
              setIsBookingOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer System HUD */}
      <Footer />

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        vehicles={vehicles}
        onConfirmBooking={handleConfirmBooking}
      />

      {appointment && (
        <LiveChatModal
          technician={appointment.technician}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
