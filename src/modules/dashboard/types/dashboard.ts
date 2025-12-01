// src/modules/dashboard/types/dashboard.ts
export interface KPICard {
  id: number;
  title: string;
  value: string | number;
  trend: number;
  trendDirection: "up" | "down";
  description: string;
  icon?: string;
  color: string;
}

export interface ServicePerformance {
  id: number;
  name: string;
  sessions: number;
  revenue: number;
  utilization: number;
  trend: "up" | "down";
  trendLabel: string;
}

export interface StaffUtilization {
  id: number;
  name: string;
  utilization: number;
  rating: number;
  revenue: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ClientJourneyStep {
  label: string;
  value: number;
  percentage: number;
  color: string;
}
