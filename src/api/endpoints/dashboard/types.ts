export type DashboardDataType =
  | "thisMonth"
  | "lastMonth"
  | "last3Months"
  | "customRange";

export interface DashboardParams {
  dataType: DashboardDataType;
  startDate?: string;
  endDate?: string;
}

export interface DashboardChartData {
  xAxis: string[];
  yAxis: number[];
}

export interface DashboardClientJourney {
  newClients: number;
  bookedAppointment: number;
  returningClients: number;
}

export interface DashboardStaffUtilization {
  technicianId: number;
  technicianName: string;
  totalSessions: number;
  totalRevenue: number;
  utilization: number;
  trend: string;
}

export interface DashboardData {
  activeClients: number;
  clientRetentionRate: number;
  totalAppointments: number;
  totalRevenue: number;
  chartData: DashboardChartData;
  clientJourney: DashboardClientJourney;
  servicePerformance: any[];
  // Note: Keeping typo 'staffUtilaization' from API response for mapping
  staffUtilaization: DashboardStaffUtilization[];
}

export interface DashboardResponse {
  isSuccess: boolean;
  data: DashboardData;
  message: string;
}
