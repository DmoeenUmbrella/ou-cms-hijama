import apiClient from "@/api/axios/config";

// Types
export interface Service {
  id: number;
  name: string;
  description: string | null;
  amount: number;
  duration: number;
  isDeleted: boolean;
  createdOn: string;
  modifiedOn: string | null;
  deletedTime: string | null;
}

export interface ServicesResponse {
  isSuccess: boolean;
  data: Service[];
  message: string;
  totalCount: number;
}

export interface GetServicesParams {
  page?: number;
  count?: number;
  keyword?: string;
}

// Get Services
export const getServices = async (params: GetServicesParams = {}): Promise<ServicesResponse> => {
  const { page = 1, count = 10, keyword = '' } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('count', count.toString());
  if (keyword) {
    queryParams.append('keyword', keyword);
  }

  const response = await apiClient.get<ServicesResponse>(`/services?${queryParams.toString()}`);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to fetch services');
  }
  
  return response.data;
};

// Get Service by ID
export const getServiceById = async (id: number): Promise<{ isSuccess: boolean; data: Service; message: string }> => {
  const response = await apiClient.get(`/services/${id}`);
  
  if (!response.data.isSuccess) {
    throw new Error(response.data.message || 'Failed to fetch service');
  }
  
  return response.data;
};
