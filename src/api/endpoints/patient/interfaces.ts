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
  date?: string;
  reminder?: string;
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
  clinicId: string;
  technicianId?: string;
  date: string;
  time?: string;
  notes?: string;
  numberOfCups?: string;
  reminder?: string;
  price?: number;
}

export interface Session {
  id: string;
  clientId: string;
  clinicId: string;
  technicianId?: string;
  date: string;
  time?: string;
  notes?: string;
  numberOfCups?: string;
  price?: number;
}

export interface FollowUpPayload {
  clientId: number | string;
  date: string;
}

export interface FollowUp {
  id: string;
  clientId: string;
  date: string;
}
