export type VehicleType = 'ebike' | 'escooter' | 'cargo' | 'high_performance' | 'electric_car';

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  batteryHealth: number; // percentage
  lastServiced?: string;
  image: string;
  brandLogo?: string;
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
  email?: string;
  onDuty?: boolean;
  todaysEarnings?: number;
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

export type RepairStatus = 'pending_assign' | 'booking' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export interface ReplacedPartItem {
  id: string;
  name: string;
  partNumber?: string;
  category?: string;
  quantity?: number;
  condition?: string;
  warrantyMonths?: number;
  warrantyText?: string;
  cost?: number;
  oldPartAction?: string;
}

export type PaymentMethod = 'upi' | 'credit_card' | 'debit_card' | 'cod';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';

export interface PaymentTransaction {
  id: string;
  appointmentId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  timestamp: string;
  upiId?: string;
  upiApp?: 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred';
  cardLast4?: string;
  cardNetwork?: 'visa' | 'mastercard' | 'rupay' | 'amex';
  cardHolderName?: string;
  bankName?: string;
  invoiceNumber: string;
  gstNumber?: string;
  receiptUrl?: string;
}

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
  isEmergencySOS?: boolean;
  acceptedAt?: string;
  completedAt?: string;
  completionNotes?: string;
  partsUsed?: string[];
  replacedPartsDetails?: ReplacedPartItem[];
  batteryHealthRecorded?: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentDetails?: PaymentTransaction;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tech' | 'system';
  text: string;
  timestamp: string;
}

export type UserRole = 'customer' | 'technician' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  technicianId?: string;
  vanId?: string;
  specialty?: string;
  adminTitle?: string;
  registeredAt?: string;
}

export interface VideoGenerationItem {
  id: string;
  operationName: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
  sourceImage?: string;
  sourceImageName?: string;
  status: 'starting' | 'processing' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  createdAt: string;
  error?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishDate: string;
  image: string;
  tags: string[];
  views: number;
  likes: number;
  featured?: boolean;
}
