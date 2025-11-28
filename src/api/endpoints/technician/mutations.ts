import apiClient from "@/api/axios/config";
import type { Technician } from "./queries";

// Create Technician Payload
export interface CreateTechnicianPayload {
  name: string;
}

// Update Technician Payload
export interface UpdateTechnicianPayload {
  id: number;
  name: string;
}

// Response Types
export interface TechnicianMutationResponse {
  isSuccess: boolean;
  data: Technician;
  message: string;
}

// Create Technician
export const createTechnician = async (payload: CreateTechnicianPayload): Promise<TechnicianMutationResponse> => {
  const response = await apiClient.post<TechnicianMutationResponse>('/technician', payload);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to create technician');
  }
  
  return response.data;
};

// Update Technician
export const updateTechnician = async (payload: UpdateTechnicianPayload): Promise<TechnicianMutationResponse> => {
  const response = await apiClient.put<TechnicianMutationResponse>('/technician', payload);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to update technician');
  }
  
  return response.data;
};

// Delete Technician
export const deleteTechnician = async (id: number): Promise<{ isSuccess: boolean; message: string }> => {
  const response = await apiClient.delete(`/technician/${id}`);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to delete technician');
  }
  
  return response.data;
};
