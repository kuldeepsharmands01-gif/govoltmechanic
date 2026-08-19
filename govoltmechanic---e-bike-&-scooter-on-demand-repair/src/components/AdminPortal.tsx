import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Users,
  Wrench,
  Activity,
  AlertTriangle,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Plus,
  Radio,
  Sparkles,
  Phone
} from 'lucide-react';
import { Appointment, RepairStatus, Technician, UserProfile, Vehicle } from '../types';
import { TECHNICIANS } from '../data/mockData';

interface AdminPortalProps {
  currentUser: UserProfile;
  appointments: Appointment[];
  vehicles: Vehicle[];
  onUpdateAppointmentStatus: (id: string, status: RepairStatus) => void;
  onReassignTechnician: (appointmentId: string, technicianId: string) => void;
  onSimulateNewBooking: () => void;
  onSimulateSOS: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  appointments,
  vehicles,
  onUpdateAppointmentStatus,
  onReassignTechnician,
  onSimulateNewBooking,
  onSimulateSOS,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalGMV = appointments.reduce((sum, a) => sum + a.totalPrice, 18450);
  const activeDispatches = appointments.filter((a) => a.status !== 'completed' && a.status !== 'cancelled').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length + 8;

  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.technician.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-slate-800">
      {/* Admin Operations Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center text-red-600 shadow-sm">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-red-50 text-red-700 font-mono text-[10px] font-black uppercase rounded-md border border-red-200">
                  CENTRAL FLEET COMMAND TOWER
                </span>
                <span className="text-xs text-emerald-700 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span> Live Auto-Assign Active
                </span>
              </div>
              <h2 className="text-2xl font-black text-black mt-1">Fleet Control Hub</h2>
              <p className="text-xs text-slate-600">
                Logged in as <span className="text-black font-bold">{currentUser.name}</span> ({currentUser.adminTitle || 'Lead Dispatch Officer'})
              </p>
            </div>
          </div>

          {/* Quick Simulation Trigger Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onSimulateNewBooking}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 text-red-600" />
              <span>Simulate Auto-Dispatch</span>
            </button>

            <button
              onClick={onSimulateSOS}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span>Trigger Test SOS</span>
            </button>
          </div>
        </div>

        {/* Global KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Revenue GMV</p>
            <p className="text-2xl font-black text-red-600 font-mono">₹{totalGMV.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Dispatches</p>
            <p className="text-2xl font-black text-black font-mono">{activeDispatches} Active</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Vans on Ground</p>
            <p className="text-2xl font-black text-emerald-700 font-mono">5 Mobile Vans</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Avg Doorstep SLA</p>
            <p className="text-2xl font-black text-amber-700 font-mono">~7.2 Mins</p>
          </div>
        </div>
      </div>

      {/* ALL SERVICE ORDERS MANAGEMENT TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-black uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              Live Service Orders & Auto-Dispatch Monitor
            </h3>
            <p className="text-xs text-slate-600">
              Manage incoming doorstep requests, assign field mechanics, and track completion states.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ID, customer, vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
              {['all', 'dispatched', 'en_route', 'arrived', 'in_progress', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] transition-colors ${
                    statusFilter === st
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  {st === 'all' ? 'All' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold bg-slate-50">
                <th className="py-3 px-3">Order ID & Status</th>
                <th className="py-3 px-3">Customer & Location</th>
                <th className="py-3 px-3">EV Model & Plate</th>
                <th className="py-3 px-3">Assigned Technician Van</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((app) => {
                const statusBadge =
                  app.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : app.status === 'in_progress'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : app.status === 'en_route'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200';

                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-black">#{app.id}</span>
                        {app.isEmergencySOS && (
                          <span className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[8px] font-black uppercase rounded border border-red-200">
                            SOS
                          </span>
                        )}
                      </div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase border ${statusBadge}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-bold text-black">{app.customerName}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-xs">{app.address}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-800">{app.vehicle.make} {app.vehicle.model}</p>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">
                        {app.vehicle.licensePlate || 'UP78 EV 450X'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <select
                        value={app.technician.id}
                        onChange={(e) => onReassignTechnician(app.id, e.target.value)}
                        className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-black font-bold focus:outline-none focus:border-red-600"
                      >
                        {TECHNICIANS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.vanId.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500 mt-0.5">Auto-assigned to nearest van</p>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-red-600">
                      ₹{app.totalPrice.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      {app.status !== 'completed' ? (
                        <button
                          onClick={() => onUpdateAppointmentStatus(app.id, 'completed')}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 text-[10px] font-bold uppercase rounded-lg transition-colors"
                        >
                          Force Complete
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">Certified ✓</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE WORKSHOP FLEET VANS MONITOR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-base font-black text-black uppercase tracking-wider flex items-center gap-2">
          <Wrench className="w-5 h-5 text-red-600" />
          Field Mobile Workshop Vans ({TECHNICIANS.length} Active Units)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECHNICIANS.map((tech) => (
            <div
              key={tech.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <img
                  src={tech.avatar}
                  alt={tech.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-black truncate">{tech.name}</h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      ON DUTY
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-red-600 font-bold">{tech.vanId}</p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p className="text-[11px] truncate flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{tech.location.address}</span>
                </p>
                <p className="text-[11px] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono text-slate-800">+91 {tech.phone}</span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                <span className="text-slate-600">Rating: <strong className="text-amber-700 font-mono">★ {tech.rating}</strong></span>
                <span className="text-slate-600">{tech.completedRepairs} Repairs Done</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
