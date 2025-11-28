// --- Domain Models (New Flow) ---

export interface Patient {
  id: string;
  name: string;
  phone: string;
  gender: "Male" | "Female";
  totalSessions: string; // Calculated/Returned by backend
  lastSessionDate: string | null; // YYYY-MM-DD
}

// A Session is a completed or active visit (Walk-in or converted Follow-up)
export interface Session {
  id: string;
  clientId: string;
  clinicId: string | null;

  phoneNumber: string;
  gender: "Male" | "Female";

  // Session Info (Shared for Registration & New Session)
  technicianId: string;
  serviceId: string | null | string;
  numberOfCups: "";
  amount: number;
  paymentMethod: "Cash" | "Card" | "Transfer";

  // Scheduling
  date: string | null; // YYYY-MM-DD
  time: string | null; // HH:MM
  notes: string;
  reminder: string | null;
}

// A Follow-Up is a future scheduled appointment
export interface FollowUp {
  id: string;
  clientId: string;
  serviceId: string;
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
  serviceId: string;
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
  id: "";
  clientId: string;
  clinicId: string | null;
  technicianId: string;
  numberOfCups: number;
  amount: number;
  paymentMethod: string;
  notes: string;
  date: string | null;
  time: string | null;
  status: string;
}

// 3. New Follow-Up Payload
export interface CreateFollowUpPayload {
  clientId: string;
  date: string;
}

// --- Form States (New Flow) ---

export interface PatientFormState {
  // Patient Info
  id: string;
  name: string;
  phoneNumber: string;
  gender: "Male" | "Female";

  // Session Info (Shared for Registration & New Session)
  technicianId: string;
  serviceId: string | null | string;
  numberOfCups: "";
  amount: number;
  paymentMethod: "Cash" | "Card" | "Transfer";

  // Scheduling
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes: string;
  reminder: string;
}

export interface FollowUpFormState {
  id: string | null;
  clientId: string | null;
  serviceId: string | null;
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
  client_id: string | null;
  service_id: string | null;
  notes: string;
}

export interface AppointmentPayload {
  clientId: string;
  clinicId: string | null;
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
}

export interface AppointmentFormState {
  id: string | null;
  client_id: string | null;
  service_id: string | null;
  cupper: string | null;
  date: string;
  time: string;
  duration: number;
  notes: string;
}

export interface DropdownOption {
  id: string | string;
  label: string;
}
