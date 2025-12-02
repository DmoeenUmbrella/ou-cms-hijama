import apiClient from "@/api/axios/config";
import type { 
  ReportParams, 
  PatientReportResponse,
  PatientActivityParams,
  PatientActivityResponse,
  SessionReportResponse,
  FollowupReportResponse,
  SmsReportResponse
} from "./types";

/**
 * Get Patient/Client Reports
 * @param params - dateType and optional startDate/endDate for customRange
 */
export const getPatientReports = async (params: ReportParams): Promise<PatientReportResponse> => {
  const queryParams: Record<string, string> = {
    dateType: params.dateType,
  };
  
  // Add date range params for customRange
  if (params.dateType === 'customRange' && params.startDate && params.endDate) {
    queryParams.startDate = params.startDate;
    queryParams.endDate = params.endDate;
  }

  const response = await apiClient.get<PatientReportResponse>("/reports/clients", {
    params: queryParams,
  });
  return response.data;
};

/**
 * Get Patient Activity Reports
 * @param params - page and count for pagination
 */
export const getPatientActivityReports = async (params: PatientActivityParams): Promise<PatientActivityResponse> => {
  const response = await apiClient.get<PatientActivityResponse>("/reports/clients/activity", {
    params: {
      page: params.page,
      count: params.count,
    },
  });
  return response.data;
};

/**
 * Get Session/Appointment Reports
 * @param params - dateType and optional startDate/endDate for customRange
 */
export const getSessionReports = async (params: ReportParams): Promise<SessionReportResponse> => {
  const queryParams: Record<string, string> = {
    dateType: params.dateType,
  };
  
  if (params.dateType === 'customRange' && params.startDate && params.endDate) {
    queryParams.startDate = params.startDate;
    queryParams.endDate = params.endDate;
  }

  const response = await apiClient.get<SessionReportResponse>("/reports/appointments", {
    params: queryParams,
  });
  return response.data;
};

/**
 * Get Followup Reports
 * @param params - dateType and optional startDate/endDate for customRange
 */
export const getFollowupReports = async (params: ReportParams): Promise<FollowupReportResponse> => {
  const queryParams: Record<string, string> = {
    dateType: params.dateType,
  };
  
  if (params.dateType === 'customRange' && params.startDate && params.endDate) {
    queryParams.startDate = params.startDate;
    queryParams.endDate = params.endDate;
  }

  const response = await apiClient.get<FollowupReportResponse>("/reports/followUps", {
    params: queryParams,
  });
  return response.data;
};

/**
 * Get SMS Reports (placeholder for future implementation)
 */
export const getSmsReports = async (params: ReportParams): Promise<SmsReportResponse> => {
  const queryParams: Record<string, string> = {
    dateType: params.dateType,
  };
  
  if (params.dateType === 'customRange' && params.startDate && params.endDate) {
    queryParams.startDate = params.startDate;
    queryParams.endDate = params.endDate;
  }

  const response = await apiClient.get<SmsReportResponse>("/reports/sms", {
    params: queryParams,
  });
  return response.data;
};
