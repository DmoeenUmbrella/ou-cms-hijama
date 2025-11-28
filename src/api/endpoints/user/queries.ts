import apiClient from "@/api/axios/config";

// Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  phoneNumber: string;
  keycloakUserId: string;
  profileUrl: string;
  clinicIds: string[] | null;
  isActive: boolean;
  isDeleted: boolean;
  createdOn: string;
  modifiedOn: string;
  deletedOn: string | null;
  deletedTime: string | null;
}

export interface UsersResponse {
  isSuccess: boolean;
  data: User[];
  message: string;
  totalCount: number;
}

export interface GetUsersParams {
  page?: number;
  count?: number;
  keyword?: string;
}

// Get Users
export const getUsers = async (params: GetUsersParams = {}): Promise<UsersResponse> => {
  const { page = 1, count = 10, keyword = '' } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('count', count.toString());
  if (keyword) {
    queryParams.append('keyword', keyword);
  }

  const response = await apiClient.get<UsersResponse>(`/users?${queryParams.toString()}`);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to fetch users');
  }
  
  return response.data;
};

// Get User by ID
export const getUserById = async (id: number): Promise<{ isSuccess: boolean; data: User; message: string }> => {
  const response = await apiClient.get(`/users/${id}`);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to fetch user');
  }
  
  return response.data;
};
