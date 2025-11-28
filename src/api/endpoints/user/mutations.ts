import apiClient from "@/api/axios/config";
import type { User } from "./queries";

// Create User Payload
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  clinicId: string;
  profileUrl?: string;
  password: string;
}

// Update User Payload
export interface UpdateUserPayload {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileUrl?: string;
  clinicId: string;
}

// Response Types
export interface UserMutationResponse {
  isSuccess: boolean;
  data: User;
  message: string;
}

// Create User
export const createUser = async (payload: CreateUserPayload): Promise<UserMutationResponse> => {
  const response = await apiClient.post<UserMutationResponse>('/users', payload);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to create user');
  }
  
  return response.data;
};

// Update User
export const updateUser = async (payload: UpdateUserPayload): Promise<UserMutationResponse> => {
  const { id, ...data } = payload;
  const response = await apiClient.put<UserMutationResponse>(`/users/${id}`, data);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to update user');
  }
  
  return response.data;
};

// Delete User
export const deleteUser = async (id: number): Promise<{ isSuccess: boolean; message: string }> => {
  const response = await apiClient.delete(`/users/${id}`);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to delete user');
  }
  
  return response.data;
};
