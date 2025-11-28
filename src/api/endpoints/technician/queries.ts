import apiClient from "@/api/axios/config";

// Types
export interface Technician {
  id: number;
  name: string;
  isDeleted: boolean;
  createdOn: string;
  modifiedOn: string | null;
  deletedTime: string | null;
}

export interface TechniciansResponse {
  isSuccess: boolean;
  data: Technician[];
  message: string;
  totalCount: number;
}

export interface GetTechniciansParams {
  page?: number;
  count?: number;
  keyword?: string;
}

// Get Technicians
export const getTechnicians = async (params: GetTechniciansParams = {}): Promise<TechniciansResponse> => {
  const { page = 1, count = 10, keyword = '' } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('count', count.toString());
  if (keyword) {
    queryParams.append('keyword', keyword);
  }

  const response = await apiClient.get<TechniciansResponse>(`/technician?${queryParams.toString()}`);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to fetch technicians');
  }
  
  return response.data;
};

// Get Technician by ID
export const getTechnicianById = async (id: number): Promise<{ isSuccess: boolean; data: Technician; message: string }> => {
  const response = await apiClient.get(`/technician/${id}`);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to fetch technician');
  }
  
  return response.data;
};
