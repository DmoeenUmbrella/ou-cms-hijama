import type { DateRangeType } from "@/modules/reports/stores/useReportStore";

// Common Report Params
export interface ReportParams {
  dateType: DateRangeType;
  startDate?: string;
  endDate?: string;
}

// Patient Report Types
export interface ClientDemographicsRatio {
  male?: number;
  female?: number;
}

export interface ClientGrowthTrendItem {
  xAxis: string;
  yAxis: number;
}

export interface PatientReportData {
  totalClients: number;
  activeClients: number;
  newClients: number;
  retentionRate: number;
  clientDemographicsRatio: ClientDemographicsRatio;
  clientGrowthTrend: ClientGrowthTrendItem[];
}

export interface PatientReportResponse {
  isSuccess: boolean;
  data: PatientReportData;
  message: string;
}

// Patient Activity Report Types
export interface PatientActivityParams {
  page: number;
  count: number;
}

export interface PatientActivityItem {
  clientId: number;
  clientName: string;
  lastSession: string;
  totalSessions: number;
  totalFollowUps: number;
}

export interface PatientActivityResponse {
  isSuccess: boolean;
  data: PatientActivityItem[];
  message: string;
}

// Session Report Types
export interface SessionGrowthTrendItem {
  xAxis: string;
  yAxisCount: number;
  yAxisRevenue: number;
}

export interface SessionReportData {
  totalAppointments: number;
  totalRevenue: number;
  growthTrend?: SessionGrowthTrendItem[];
}

export interface SessionReportResponse {
  isSuccess: boolean;
  data: SessionReportData;
  message: string;
}

// Followup Report Types
export interface FollowupChartDataItem {
  xAxis: string;
  yAxis: number;
}

export interface FollowupReportData {
  totalFollowUps: number;
  responseRate: number;
  chartData?: FollowupChartDataItem[];
}

export interface FollowupReportResponse {
  isSuccess: boolean;
  data: FollowupReportData;
  message: string;
}

// SMS Report Types (for future use)
export interface SmsReportData {
  totalSent: number;
  delivered: number;
  pending: number;
  failed: number;
}

export interface SmsReportResponse {
  isSuccess: boolean;
  data: SmsReportData;
  message: string;
}
