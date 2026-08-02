export type VehicleType = 'ebike' | 'escooter' | 'cargo' | 'high_performance';

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  batteryHealth: number; // percentage
  lastServiced?: string;
  image: string;
  licensePlate?: string;
  rangeKm?: number;
  topSpeedKmh?: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'battery' | 'brakes' | 'motor' | 'tires' | 'drivetrain' | 'electrical' | 'inspection';
  description: string;
  price: number;
  estimatedMinutes: number;
  iconName: string;
  popular?: boolean;
}

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedRepairs: number;
  specialty: string;
  status: 'available' | 'en_route' | 'repairing' | 'busy';
  location: { lat: number; lng: number; address: string };
  vanId: string;
  phone: string;
}

export interface ServiceHub {
  id: string;
  name: string;
  address: string;
  techsAvailable: number;
  distance: string;
  status: 'active' | 'busy';
  coordinates: { x: number; y: number };
  batterySwapsAvailable: number;
}

export interface RecentServiceSpot {
  id: string;
  customerName: string;
  locationName: string;
  address: string;
  serviceType: string;
  completedAt: string;
  rating: number;
  techName: string;
  coordinates: { x: number; y: number };
}

export type RepairStatus = 'booking' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed';

export interface Appointment {
  id: string;
  vehicle: Vehicle;
  services: ServiceItem[];
  totalPrice: number;
  technician: Technician;
  status: RepairStatus;
  address: string;
  scheduledTime: string;
  createdAt: string;
  etaMinutes: number;
  customerName: string;
  customerPhone: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tech' | 'system';
  text: string;
  timestamp: string;
}
