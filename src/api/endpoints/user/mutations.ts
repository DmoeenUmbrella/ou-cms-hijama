import apiClient from "@/api/axios/config";
import type { User } from "./queries";

// Create Admin Payload
export interface CreateAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  clinicName: string;
  profileUrl?: string;
  password: string;
}

// Create User Payload
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileUrl?: string;
  password: string;
}

// Update User Payload
export interface UpdateUserPayload {
  id: string;
  firstName: string;
  lastName: string;
  allowedScreens?: string[];
  phoneNumber: string;
  profileUrl?: string;
}

// Response Types
export interface UserMutationResponse {
  isSuccess: boolean;
  data: User;
  message: string;
}

// Create Admin
export const createAdmin = async (payload: CreateAdminPayload): Promise<UserMutationResponse> => {
  const response = await apiClient.post<UserMutationResponse>('/users/admin', payload);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to create admin');
  }
  
  return response.data;
};

// Create User
export const createUser = async (payload: CreateUserPayload): Promise<UserMutationResponse> => {
  const response = await apiClient.post<UserMutationResponse>('/users/user', payload);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to create user');
  }
  
  return response.data;
};

// Update User
export const updateUser = async (payload: UpdateUserPayload): Promise<UserMutationResponse> => {
  const response = await apiClient.put<UserMutationResponse>('/users', payload);
  
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
