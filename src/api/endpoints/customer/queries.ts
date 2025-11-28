import apiClient from "@/api/axios/config";

// Types
export interface Appointment {
  id: string | null;
  clientId: string | null;
  technicianId: string | null;
  userId: string | null;
  userEmail: string;
  clinicId: string | null;
  isDeleted: boolean;
  date: string;
  notes: string;
  time: string;
  createdOn: string;
  modifiedOn: string | null;
  numberOfCups: string | null;
  price: number;
  deletedTime: string | null;
}

export interface FollowUp {
  id: number;
  clientId: number;
  date: string;
  notes: string;
  isCompleted: boolean;
  createdOn: string;
}

export interface CustomerDetails {
  id: number;
  name: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string | null;
  notes: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdOn: string;
  deletedTime: string | null;
  modifiedOn: string | null;
  appointments: Appointment[];
  followUps: FollowUp[];
  totalSessions: number;
  totalSpent: number;
  lastAppointmentDate: string | null;
}

export interface CustomerDetailsResponse {
  isSuccess: boolean;
  data: CustomerDetails;
  message: string;
}

export interface AppointmentsData {
  totalAppointments: number;
  appointments: Appointment[];
  totalSpent: number;
  lastAppointmentDate: string | null;
}

export interface AppointmentsResponse {
  isSuccess: boolean;
  data: AppointmentsData;
  message: string;
}

export interface GetAppointmentsParams {
  clientId: string | number;
  page?: number;
  count?: number;
}

// Follow-Up Types
export interface FollowUpItem {
  id: number;
  appointmentId: number;
  clientId: number;
  date: string;
  deletedTime: string | null;
  isDeleted: boolean;
}

export interface FollowUpData {
  data: FollowUpItem[];
  totalCount: number;
}

export interface FollowUpsResponse {
  isSuccess: boolean;
  data: {
    upcoming: FollowUpData;
    past: FollowUpData;
  };
  message: string;
}

export interface GetFollowUpsParams {
  clientId: string | number;
}

// Get Customer by ID with full details including sessions
export const getCustomerById = async (id: string | number): Promise<CustomerDetailsResponse> => {
  const response = await apiClient.get<CustomerDetailsResponse>(`/clients/${id}`);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to fetch customer details');
  }
  
  return response.data;
};

// Get Customer Appointments with pagination
export const getCustomerAppointments = async (
  params: GetAppointmentsParams
): Promise<AppointmentsResponse> => {
  const { clientId, page = 1, count = 10 } = params;
  
  const response = await apiClient.get<AppointmentsResponse>(
    `/appointment/clientId`,
    {
      params: { clientId, page, count }
    }
  );
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to fetch appointments');
  }
  
  return response.data;
};

// Get Customer Follow-Ups
export const getCustomerFollowUps = async (
  params: GetFollowUpsParams
): Promise<FollowUpsResponse> => {
  const { clientId } = params;
  
  const response = await apiClient.get<FollowUpsResponse>(
    `/follow-up/clientId`,
    {
      params: { clientId }
    }
  );
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to fetch follow-ups');
  }
  
  return response.data;
};
