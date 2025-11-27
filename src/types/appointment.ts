// --- Domain Models (New Flow) ---

export interface Patient {
  id: number;
  name: string;
  phone: string;
  gender: "Male" | "Female";
  totalSessions: number; // Calculated/Returned by backend
  lastSessionDate: string | null; // YYYY-MM-DD
}

// A Session is a completed or active visit (Walk-in or converted Follow-up)
export interface Session {
  id: number;
  patientId: number;
  cupperName: string;
  serviceId: number;
  serviceName?: string; // Optional if joined
  cupsCount: number;
  amount: number;
  paymentMethod: "Cash" | "Card" | "Transfer";
  notes: string;
  date: string; // ISO
  time: string; // ISO
  status: "completed" | "in-progress";
}

// A Follow-Up is a future scheduled appointment
export interface FollowUp {
  id: number;
  patientId: number;
  serviceId: number;
  serviceName?: string;
  date: string; // ISO
  time: string; // ISO
  notes: string;
  status: "scheduled" | "cancelled" | "converted";
}

// --- API Payloads (New Flow) ---

// 1. New Patient Walk-In Payload
export interface RegisterPatientPayload {
  name: string;
  phone: string;
  gender: string;
  // Initial Session Details
  cupperName: string;
  serviceId: number;
  cupsCount: number;
  amount: number;
  paymentMethod: string;
  notes: string;
  date: string; // ISO
  time: string; // ISO
  status: string; // Usually 'completed'
}

// 2. New Session (Existing Patient) Payload
export interface CreateSessionPayload {
  patientId: number;
  cupperName: string;
  serviceId: number;
  cupsCount: number;
  amount: number;
  paymentMethod: string;
  notes: string;
  date: string;
  time: string;
  status: string;
}

// 3. New Follow-Up Payload
export interface CreateFollowUpPayload {
  patientId: number;
  serviceId: number;
  date: string;
  time: string;
  notes: string;
  status: string; // 'scheduled'
}

// --- Form States (New Flow) ---

export interface PatientFormState {
  // Patient Info
  name: string;
  phone: string;
  gender: "Male" | "Female";

  // Session Info (Shared for Registration & New Session)
  cupperName: string;
  serviceId: number | null;
  cupsCount: number;
  amount: number;
  paymentMethod: "Cash" | "Card" | "Transfer";

  // Scheduling
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes: string;
}

export interface FollowUpFormState {
  id: number | null;
  patientId: number | null;
  serviceId: number | null;
  date: string;
  time: string;
  notes: string;
}

// --- Legacy / Transition Types (Required for current components) ---

export interface Appointment {
  id: string | number;
  client: string;
  service: string;
  time: string;
  duration: string;
  price: string;
  status: "upcoming" | "completed" | "cancelled" | "no-show";
  date: string;
  client_id: number | null;
  service_id: number | null;
  notes: string;
}

export interface AppointmentPayload {
  clientId: number;
  clinicId: number;
  serviceId: number;
  date: string;
  time: string;
  duration: number;
  notes: string;
}

export interface AppointmentFormState {
  id: number | null;
  client_id: number | null;
  service_id: number | null;
  cupper: string | null;
  date: string;
  time: string;
  duration: number;
  notes: string;
}

export interface DropdownOption {
  id: number | string;
  label: string;
}
