import React, { useState, useEffect } from 'react';
import { Header, AppTabType } from './components/Header';
import { MapTracking } from './components/MapTracking';
import { TechnicianCard } from './components/TechnicianCard';
import { BookingModal } from './components/BookingModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { LiveChatModal } from './components/LiveChatModal';
import { SpecialistPhoneModal } from './components/SpecialistPhoneModal';
import { SettingsModal } from './components/SettingsModal';
import { StationHubs } from './components/StationHubs';
import { GarageDashboard } from './components/GarageDashboard';
import { AIDiagnostics } from './components/AIDiagnostics';
import { HelpFAQTab } from './components/HelpFAQTab';
import { ServicesTab } from './components/ServicesTab';
import { AboutTab } from './components/AboutTab';
import { ActiveServiceStatusCard } from './components/ActiveServiceStatusCard';
import { TrustedBrandsSection } from './components/TrustedBrandsSection';
import { HomeHeroBanner } from './components/HomeHeroBanner';
import { PrecisionCareWideBanner } from './components/PrecisionCareWideBanner';
import { DownloadAppModal } from './components/DownloadAppModal';
import { PaymentSystemModal } from './components/PaymentSystemModal';
import { TechnicianPortal } from './components/TechnicianPortal';
import { AdminPortal } from './components/AdminPortal';
import { LoginModal } from './components/LoginModal';
import { BlogTab } from './components/BlogTab';
import { Footer } from './components/Footer';
import { Appointment, Vehicle, ServiceHub, UserProfile, RepairStatus, ServiceItem, PaymentTransaction } from './types';
import { INITIAL_ACTIVE_APPOINTMENT, INITIAL_VEHICLES, SERVICE_HUBS, TECHNICIANS, SERVICE_ITEMS } from './data/mockData';
import { ServicePackage } from './data/servicesCatalog';
import { MOCK_USERS } from './data/mockUsers';
import { triggerBrowserNotification, playEtaChime } from './utils/notifications';
import { Clock, Zap, Wrench, ShieldCheck, Leaf, MapPin, Truck, ChevronRight, Siren, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('govolt_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_USERS[0]; // Default to Rider Pradeep
  });

  const [activeTab, setActiveTab] = useState<AppTabType>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([INITIAL_ACTIVE_APPOINTMENT]);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [hubs] = useState<ServiceHub[]>(SERVICE_HUBS);

  // Active or most recent appointment for the rider view (including completed so user can view replaced parts)
  const activeAppointment =
    appointments.find((a) => a.status !== 'completed' && a.status !== 'cancelled') ||
    appointments.find((a) => a.status === 'completed') ||
    appointments[0] ||
    null;

  // Static Specialist Phone Number Constant
  const SPECIALIST_PHONE = '6397852208';

  // Settings & Notification State
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('govolt_notifications_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('govolt_audio_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDownloadAppOpen, setIsDownloadAppOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handlePaymentSuccess = (transaction: PaymentTransaction) => {
    if (activeAppointment) {
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === activeAppointment.id
            ? { ...app, paymentStatus: 'paid', paymentMethod: transaction.method, paymentDetails: transaction }
            : app
        )
      );
    }
    triggerBrowserNotification(
      'Payment Confirmed ✓',
      `₹${transaction.amount.toLocaleString('en-IN')} received via ${transaction.method.toUpperCase().replace('_', ' ')}. GST Tax Invoice #${transaction.invoiceNumber} generated.`
    );
    if (audioEnabled) {
      playEtaChime();
    }
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('govolt_current_user', JSON.stringify(user));

    if (user.role === 'technician') {
      setActiveTab('technician_portal');
      triggerBrowserNotification('Technician Portal Ready', `Welcome back, ${user.name} (${user.vanId}). Duty dispatch active.`);
    } else if (user.role === 'admin') {
      setActiveTab('admin_portal');
      triggerBrowserNotification('Admin Command Center', `Welcome to Fleet Operations Control.`);
    } else {
      // Stay on the current page if already on any customer tab (e.g. Services, About, Garage, Diagnostics, Help)
      // Only switch away if previously on a restricted tech/admin portal
      setActiveTab((prev) => (prev === 'technician_portal' || prev === 'admin_portal' ? 'dashboard' : prev));
      triggerBrowserNotification('Access Verified', `Welcome, ${user.name}! You are logged into GOVOLT.`);
    }

    if (audioEnabled) {
      playEtaChime();
    }
  };

  const handleLogout = () => {
    handleLogin(MOCK_USERS[0]); // Reset to rider
  };

  const handleToggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem('govolt_notifications_enabled', String(enabled));
  };

  const handleToggleAudio = (enabled: boolean) => {
    setAudioEnabled(enabled);
    localStorage.setItem('govolt_audio_enabled', String(enabled));
  };

  const handleTestNotification = () => {
    triggerBrowserNotification(
      '⚡ GOVOLTMECHANIC ETA Alert',
      '5-Minute arrival alert active! Your technician Marcus Vance will notify you upon arrival.'
    );
    if (audioEnabled) {
      playEtaChime();
    }
  };

  const handleConfirmBooking = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
    if (currentUser.role === 'technician') {
      setActiveTab('technician_portal');
    } else {
      setActiveTab('dashboard');
    }
    triggerBrowserNotification('Service Request Auto-Assigned', `Dispatched to ${newAppointment.technician.name} (${newAppointment.technician.vanId}).`);
    if (audioEnabled) playEtaChime();
  };

  const handleUpdateAppointmentStatus = (
    appointmentId: string,
    newStatus: RepairStatus,
    completionData?: {
      notes?: string;
      partsUsed?: string[];
      batteryHealth?: number;
    }
  ) => {
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id === appointmentId) {
          return {
            ...app,
            status: newStatus,
            completedAt:
              newStatus === 'completed'
                ? app.completedAt ||
                  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                    ', Today'
                : app.completedAt,
            completionNotes: completionData?.notes || app.completionNotes,
            partsUsed: completionData?.partsUsed || app.partsUsed,
            batteryHealthRecorded: completionData?.batteryHealth || app.batteryHealthRecorded,
          };
        }
        return app;
      })
    );

    if (newStatus === 'completed') {
      triggerBrowserNotification(
        '✓ Service Completed & Certified',
        `Doorstep service #${appointmentId} completed with 10-day warranty.`
      );
      if (audioEnabled) playEtaChime();
    }
  };

  const handleReassignTechnician = (appointmentId: string, technicianId: string) => {
    const tech = TECHNICIANS.find((t) => t.id === technicianId) || TECHNICIANS[0];
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id === appointmentId) {
          return {
            ...app,
            technician: tech,
          };
        }
        return app;
      })
    );
    triggerBrowserNotification('Technician Reassigned', `Order #${appointmentId} reassigned to ${tech.name}.`);
  };

  const handleSimulateNewBooking = () => {
    const randomId = 'GV-' + Math.floor(10000 + Math.random() * 90000);
    const newSim: Appointment = {
      id: randomId,
      vehicle: vehicles[0] || INITIAL_VEHICLES[0],
      services: [SERVICE_ITEMS[0], SERVICE_ITEMS[3]],
      totalPrice: 1250,
      technician: TECHNICIANS[0], // Amit Verma
      status: 'dispatched',
      address: '117/H/45 Pandu Nagar, Kanpur, UP',
      scheduledTime: 'Immediate Auto-Dispatch',
      createdAt: 'Just now',
      etaMinutes: 12,
      customerName: 'Aarav Patel',
      customerPhone: '6397852208',
      notes: 'BMS Diagnostic & Tubeless Tire Sealant requested at doorstep.',
    };

    setAppointments((prev) => [newSim, ...prev]);
    triggerBrowserNotification('⚡ New Service Auto-Assigned', `Order #${randomId} assigned to Amit Verma (VAN-104).`);
    if (audioEnabled) playEtaChime();
  };

  const handleSimulateSOS = () => {
    const randomId = 'SOS-' + Math.floor(10000 + Math.random() * 90000);
    const newSOS: Appointment = {
      id: randomId,
      vehicle: vehicles[1] || INITIAL_VEHICLES[1],
      services: [SERVICE_ITEMS[7]],
      totalPrice: 450,
      technician: TECHNICIANS[0],
      status: 'dispatched',
      address: 'Near Swaroop Nagar Police Chowki, Kanpur, UP',
      scheduledTime: 'URGENT RESCUE (Emergency SOS)',
      createdAt: '1 min ago',
      etaMinutes: 4,
      customerName: 'Vikram Mehta',
      customerPhone: '6397852208',
      notes: 'Total throttle lockout and motor cut-off on main road.',
      isEmergencySOS: true,
    };

    setAppointments((prev) => [newSOS, ...prev]);
    triggerBrowserNotification('🚨 EMERGENCY SOS AUTO-DISPATCHED', `Van #104 alerted for urgent roadside rescue.`);
    if (audioEnabled) playEtaChime();
  };

  const handleBookCatalogPackage = (pkg: ServicePackage) => {
    // Construct service item representation
    const newServiceItem: ServiceItem = {
      id: pkg.id,
      name: pkg.title,
      category:
        pkg.categoryId === 'batteries'
          ? 'battery'
          : pkg.categoryId === 'tyres'
          ? 'tires'
          : pkg.categoryId === 'engine'
          ? 'motor'
          : 'inspection',
      description: pkg.shortDesc,
      price: pkg.price,
      estimatedMinutes: parseInt(pkg.estimatedTime, 10) || 45,
      iconName: 'Wrench',
      popular: pkg.popular,
    };

    const newAppointment: Appointment = {
      id: 'GV-' + Math.floor(10000 + Math.random() * 90000),
      vehicle: vehicles[0] || INITIAL_VEHICLES[0],
      services: [newServiceItem],
      totalPrice: pkg.price,
      technician: TECHNICIANS[0],
      status: 'dispatched',
      address: '117/H/45 Pandu Nagar, Kanpur, UP',
      scheduledTime: 'Immediate Van Dispatch',
      createdAt: 'Just now',
      etaMinutes: 15,
      customerName: currentUser.name || 'Pradeep',
      customerPhone: currentUser.phone || '6397852208',
      notes: `Catalog Booking: ${pkg.title} (${pkg.warranty}).`,
    };

    handleConfirmBooking(newAppointment);
    setActiveTab('dashboard'); // Switch to Home with live GPS tracker
    triggerBrowserNotification(
      '⚡ Doorstep Service Booked!',
      `Van #104 dispatched for ${pkg.title}. Tracking arrival live.`
    );
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles([newVehicle, ...vehicles]);
  };

  const handleSelectHubOnMap = (hub: ServiceHub) => {
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenSOS={() => setIsSOSOpen(true)}
        activeAppointmentCount={activeAppointment ? 1 : 0}
        specialistPhone={SPECIALIST_PHONE}
        onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        notificationsEnabled={notificationsEnabled}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6">
        {/* TECHNICIAN PORTAL VIEW */}
        {activeTab === 'technician_portal' && (
          <TechnicianPortal
            currentUser={currentUser}
            appointments={appointments}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onAcceptServiceRequest={(id) => handleUpdateAppointmentStatus(id, 'dispatched')}
            audioEnabled={audioEnabled}
          />
        )}

        {/* ADMIN OPERATIONS PORTAL VIEW */}
        {activeTab === 'admin_portal' && (
          <AdminPortal
            currentUser={currentUser}
            appointments={appointments}
            vehicles={vehicles}
            onUpdateAppointmentStatus={(id, st) => handleUpdateAppointmentStatus(id, st)}
            onReassignTechnician={handleReassignTechnician}
            onSimulateNewBooking={handleSimulateNewBooking}
            onSimulateSOS={handleSimulateSOS}
          />
        )}

        {/* DASHBOARD VIEW: Tracking & Map split + Trusted Brands Section */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Top Hero Banner in White & Red Theme */}
            <HomeHeroBanner
              onOpenBooking={() => setIsBookingOpen(true)}
              onOpenDownloadApp={() => setIsDownloadAppOpen(true)}
              onOpenSOS={() => setIsSOSOpen(true)}
            />

            {/* Precision Care Wide Showcase Banner */}
            <PrecisionCareWideBanner
              onOpenBooking={() => setIsBookingOpen(true)}
              onOpenSOS={() => setIsSOSOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Active Repair & Control Panel */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                {/* Quick Role Switcher Banner */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Portal Access</p>
                      <p className="text-xs font-bold text-slate-900">
                        Signed in as <strong className="text-red-600 font-mono uppercase">{currentUser.role}</strong> ({currentUser.name})
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all"
                  >
                    Login / Signup
                  </button>
                </div>

                {/* Active Service Status Card (Includes expandable replaced parts on completed) */}
                {activeAppointment ? (
                  <ActiveServiceStatusCard
                    appointment={activeAppointment}
                    onAdvanceStatus={(nextStatus) =>
                      handleUpdateAppointmentStatus(activeAppointment.id, nextStatus)
                    }
                    onOpenBooking={() => setIsBookingOpen(true)}
                    onOpenPayment={() => setIsPaymentModalOpen(true)}
                    specialistPhone={SPECIALIST_PHONE}
                  />
                ) : (
                  /* Empty Booking Prompt Card */
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-4 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-black">No Active Repair Session</h3>
                      <p className="text-xs text-slate-600 mt-1">Book an on-demand mobile workshop van to your location.</p>
                    </div>
                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                    >
                      Dispatch Mobile Specialist
                    </button>
                  </div>
                )}

                {/* Quick Environmental & Fleet Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Serviced</p>
                    <p className="text-2xl font-mono font-bold text-black">12 Jobs</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-600" /> CO2 Offset
                    </p>
                    <p className="text-2xl font-mono font-bold text-emerald-600">142 kg</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Live GPS Tracking Map */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                <MapTracking
                  appointment={activeAppointment}
                  hubs={hubs}
                  onSelectHub={handleSelectHubOnMap}
                  notificationsEnabled={notificationsEnabled}
                  audioEnabled={audioEnabled}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              </div>
            </div>

            {/* Assigned Specialist Window in Landscape Layout */}
            {activeAppointment && (
              <TechnicianCard
                technician={activeAppointment.technician}
                status={activeAppointment.status}
                onOpenChat={() => setIsChatOpen(true)}
                onOpenBooking={() => setIsBookingOpen(true)}
                specialistPhone={SPECIALIST_PHONE}
                onEditPhone={() => setIsPhoneModalOpen(true)}
              />
            )}

            {/* Trusted by Top Brands & 1,00,000+ People Across India */}
            <TrustedBrandsSection
              onSelectBrandForService={(_brandName) => {
                setIsBookingOpen(true);
              }}
              onOpenBooking={() => setIsBookingOpen(true)}
            />
          </div>
        )}

        {/* SERVICES CATALOG VIEW (8 Requested Categories) */}
        {activeTab === 'services' && (
          <ServicesTab
            onBookService={handleBookCatalogPackage}
            onOpenSOS={() => setIsSOSOpen(true)}
            specialistPhone={SPECIALIST_PHONE}
          />
        )}

        {/* ABOUT VIEW */}
        {activeTab === 'about' && (
          <AboutTab
            onOpenBooking={() => setIsBookingOpen(true)}
            onOpenSOS={() => setIsSOSOpen(true)}
            specialistPhone={SPECIALIST_PHONE}
          />
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

        {/* HELP & FAQS VIEW */}
        {activeTab === 'help' && (
          <HelpFAQTab
            vehicles={vehicles}
            onOpenBooking={() => setIsBookingOpen(true)}
            onOpenSOS={() => setIsSOSOpen(true)}
            specialistPhone={SPECIALIST_PHONE}
          />
        )}

        {/* BLOG & KNOWLEDGE BASE VIEW */}
        {activeTab === 'blog' && (
          <BlogTab
            onOpenBooking={() => setIsBookingOpen(true)}
            onOpenSOS={() => setIsSOSOpen(true)}
            specialistPhone={SPECIALIST_PHONE}
          />
        )}
      </main>

      {/* Footer System HUD */}
      <Footer
        specialistPhone={SPECIALIST_PHONE}
        onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
      />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
      />

      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        vehicles={vehicles}
        specialistPhone={SPECIALIST_PHONE}
        audioEnabled={audioEnabled}
        onConfirmSOS={(emergencyAppointment) => {
          handleConfirmBooking(emergencyAppointment);
        }}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        vehicles={vehicles}
        onConfirmBooking={handleConfirmBooking}
      />

      {activeAppointment && (
        <LiveChatModal
          technician={activeAppointment.technician}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          specialistPhone={SPECIALIST_PHONE}
        />
      )}

      <SpecialistPhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        currentPhone={SPECIALIST_PHONE}
      />

      <DownloadAppModal
        isOpen={isDownloadAppOpen}
        onClose={() => setIsDownloadAppOpen(false)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      <PaymentSystemModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={activeAppointment ? activeAppointment.totalPrice : 450}
        appointment={activeAppointment}
        serviceTitle={activeAppointment?.services.map((s) => s.name).join(', ') || 'Doorstep Bike Repair & Inspection'}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={handleToggleNotifications}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        specialistPhone={SPECIALIST_PHONE}
        onTestNotification={handleTestNotification}
      />
    </div>
  );
}
