import apiClient from "@/api/axios/config";
import type { Service } from "./queries";

// Create Service Payload
export interface CreateServicePayload {
  name: string;
  duration: number;
  amount: number;
  description?: string;
}

// Update Service Payload
export interface UpdateServicePayload {
  id: number;
  name: string;
  duration: number;
  amount: number;
  description?: string;
}

// Response Types
export interface ServiceMutationResponse {
  isSuccess: boolean;
  data: Service;
  message: string;
}

// Create Service
export const createService = async (payload: CreateServicePayload): Promise<ServiceMutationResponse> => {
  const response = await apiClient.post<ServiceMutationResponse>('/services', payload);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to create service');
  }
  
  return response.data;
};

// Update Service
export const updateService = async (payload: UpdateServicePayload): Promise<ServiceMutationResponse> => {
  const response = await apiClient.put<ServiceMutationResponse>('/services', payload);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to update service');
  }
  
  return response.data;
};

// Delete Service
export const deleteService = async (id: number): Promise<{ isSuccess: boolean; message: string }> => {
  const response = await apiClient.delete(`/services/${id}`);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to delete service');
  }
  
  return response.data;
};
