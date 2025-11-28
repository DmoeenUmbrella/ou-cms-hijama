import apiClient from "@/api/axios/config";

// Types
export interface Appointment {
  id: number;
  clientId: number;
  technicianId: number | null;
  userId: number;
  userEmail: string;
  clinicId: number;
  isDeleted: boolean;
  date: string;
  notes: string;
  time: string;
  createdOn: string;
  modifiedOn: string | null;
  numberOfCups: string;
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
  medicalNotes: string | null;
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
