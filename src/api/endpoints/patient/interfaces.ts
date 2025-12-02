export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string;
  totalCount?: number;
}

export interface FetchParams {
  page?: number;
  count?: number;
  keyword?: string;
  date?: string | null;
}

export interface PatientPayload {
  id: string;
  name: string;
  phoneNumber: string;
  gender: string;
  numberOfCups?: string;
  amount?: number;
  paymentMethod?: string;
  technicianId?: string;
  notes?: string;
  date?: string | null;
  reminder?: string | null;
}

export interface Patient {
  id: string;
  name: string;
  phoneNumber: string;
  gender?: string;
  lastSessionDate?: string;
  [key: string]: any;
}

export interface SessionPayload {
  clientId: string;
  clinicId: string | null;
  technicianId?: string;
  date: string | null;
  time?: string | null;
  notes?: string;
  numberOfCups?: string | null;
  reminder?: string | null;
  price?: number | null;
}

export interface Session {
  id: string;
  clientId: string | null;
  clinicId: string | null;
  technicianId?: string;
  date: string | null;
  time?: string | null;
  notes?: string | null;
  numberOfCups?: string;
  price?: number;
}

export interface FollowUpPayload {
  clientId: number | string;
  date: string | null;
}

export interface FollowUp {
  id: string;
  clientId: string;
  date: string;
}

export interface Client {
  id: number;
  name: string;
  clinicId: string | null;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string | null;
  medicalNotes: string | null;
  userId: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdOn: string;
  deletedTime: string | null;
  modifiedOn: string | null;
}

export interface FollowUpWithClient {
  id: number;
  appointmentId: number;
  clientId: number;
  clinicId: string | null;
  date: string;
  createdOn: string;
  deletedTime: string | null;
  isDeleted: boolean;
  client: Client;
}

export interface FollowUpStatusData {
  totalFollowUps: number;
  upComingFollowUps: number;
  followUps: FollowUpWithClient[];
}

export interface FollowUpStatusResponse {
  isSuccess: boolean;
  data: FollowUpStatusData;
  message: string;
  totalCount: number;
}

// Calendar Types
export interface CalendarDay {
  date: string;
  isCreated: boolean;
  followUps: FollowUpWithClient[];
}

export interface CalendarData {
  month: number;
  year: number;
  calendar: CalendarDay[];
}

export interface CalendarResponse {
  isSuccess: boolean;
  data: CalendarData;
  message: string;
}
