export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  isSuccess: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
