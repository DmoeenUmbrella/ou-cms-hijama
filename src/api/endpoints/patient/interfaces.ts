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
