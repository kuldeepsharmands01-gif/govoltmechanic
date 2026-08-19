import { UserProfile } from '../types';

export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  {
    id: 'u-customer-1',
    name: 'Pradeep',
    email: 'pradeep@govolt.in',
    phone: '6397852208',
    password: '123',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    registeredAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'u-tech-1',
    name: 'Amit Verma',
    email: 'amit.tech@govolt.in',
    phone: '6397852208',
    password: '123',
    role: 'technician',
    technicianId: 't1',
    vanId: 'VAN-104 (Mobile Workshop)',
    specialty: 'Master EV Systems & High-Voltage BMS',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    registeredAt: '2026-02-01T08:30:00Z',
  },
  {
    id: 'u-tech-2',
    name: 'Priya Singh',
    email: 'priya.tech@govolt.in',
    phone: '6397852208',
    password: '123',
    role: 'technician',
    technicianId: 't2',
    vanId: 'VAN-208 (Rapid Responder)',
    specialty: 'Hydraulic Disc Brakes & Frame Alignments',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    registeredAt: '2026-02-10T09:15:00Z',
  },
  {
    id: 'u-admin-1',
    name: 'Fleet Dispatch Admin',
    email: 'admin@govolt.in',
    phone: '6397852208',
    password: 'admin',
    role: 'admin',
    adminTitle: 'Central Fleet Operations Lead',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    registeredAt: '2025-12-01T00:00:00Z',
  },
];

export const MOCK_USERS = INITIAL_REGISTERED_USERS;

const STORAGE_KEY = 'govolt_registered_users_list';

export function getRegisteredUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading registered users from localStorage:', e);
  }
  // Initialize with defaults if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_USERS));
  return INITIAL_REGISTERED_USERS;
}

export function saveRegisteredUser(newUser: UserProfile): UserProfile[] {
  const users = getRegisteredUsers();
  // Check if exists
  const existingIdx = users.findIndex(
    (u) =>
      u.phone === newUser.phone ||
      u.email.toLowerCase() === newUser.email.toLowerCase()
  );

  let updatedList: UserProfile[];
  if (existingIdx >= 0) {
    updatedList = [...users];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...newUser };
  } else {
    updatedList = [newUser, ...users];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return updatedList;
}
