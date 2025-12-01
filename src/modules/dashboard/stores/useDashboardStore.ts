import { defineStore } from "pinia";
import { ref } from "vue";
import { getDashboardAnalytics } from "@/api/endpoints/dashboard/queries";
import type {
  DashboardDataType,
  DashboardStaffUtilization,
} from "@/api/endpoints/dashboard/types";

// --- Types ---
export interface DashboardStats {
  activeClients: number;
  clientStatus: number; // Defaulting to 0 as API doesn't return this
  retentionRate: number;
  retentionStatus: number; // Defaulting to 0
  totalAppointment: number;
  appointmentStatus: number; // Defaulting to 0
  monthlyRevenue: number;
  revenueStatus: number; // Defaulting to 0
}

export interface AppointmentVolumeData {
  name: string;
  value: number;
}

// Keeping this for the chart component prop, though strictly not needed if we remove the footer
export interface VolumeSummary {
  peakDays: string;
  lowDays: string;
}

export interface ClientJourneyData {
  newLeads: number;
  bookedAppointments: number;
  returningClients: number;
}

export interface ServicePerformance {
  service: string;
  sessions: number;
  revenue: number;
  utilization: number;
  trend: "low" | "medium" | "high";
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const useDashboardStore = defineStore("reports", () => {
  // --- State ---
  const stats = ref<DashboardStats>({
    activeClients: 0,
    clientStatus: 0,
    retentionRate: 0,
    retentionStatus: 0,
    totalAppointment: 0,
    appointmentStatus: 0,
    monthlyRevenue: 0,
    revenueStatus: 0,
  });

  // Volume Chart State (Mapped from API xAxis/yAxis)
  const appointmentVolume = ref<AppointmentVolumeData[]>([]);

  // Placeholder summary (Backend doesn't provide this yet)
  const volumeSummary = ref<VolumeSummary>({ peakDays: "-", lowDays: "-" });

  const clientJourney = ref<ClientJourneyData>({
    newLeads: 0,
    bookedAppointments: 0,
    returningClients: 0,
  });

  const staffUtilization = ref<DashboardStaffUtilization[]>([]);
  const servicePerformance = ref<ServicePerformance[]>([]);

  const isLoading = ref(false);
  const currentFilter = ref<DashboardDataType>("thisMonth");
  const customDateRange = ref<DateRange>({ start: null, end: null });

  // --- Actions ---

  async function fetchDashboardStats(
    filterType: DashboardDataType = "thisMonth",
    range: DateRange | null = null
  ) {
    isLoading.value = true;
    currentFilter.value = filterType;
    // Prepare Params
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (filterType === "customRange" && range?.start && range?.end) {
      // Format to ISO string or YYYY-MM-DD based on backend requirement
      startDate = range.start.toISOString();
      endDate = range.end.toISOString();
      customDateRange.value = range;
    }

    try {
      const response = await getDashboardAnalytics({
        dataType: filterType,
        startDate,
        endDate,
      });

      if (response.isSuccess && response.data) {
        const d = response.data;

        // 1. Map KPI Stats
        stats.value = {
          activeClients: d.activeClients,
          clientStatus: 0, // Not in API
          retentionRate: d.clientRetentionRate,
          retentionStatus: 0, // Not in API
          totalAppointment: d.totalAppointments,
          appointmentStatus: 0, // Not in API
          monthlyRevenue: d.totalRevenue,
          revenueStatus: 0, // Not in API
        };

        // 2. Map Chart Data (xAxis/yAxis -> name/value)
        if (d.chartData?.xAxis && d.chartData?.yAxis) {
          appointmentVolume.value = d.chartData.xAxis.map((dateStr, index) => {
            // Optional: Format dateStr (2025-12-01) to "Dec 1" or "Mon" if needed
            // For now, passing raw date string or simple formatting
            const dateObj = new Date(dateStr);
            const formattedName = isNaN(dateObj.getTime())
              ? dateStr
              : dateObj.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                });

            return {
              name: formattedName,
              value: d.chartData.yAxis[index] || 0,
            };
          });
        } else {
          appointmentVolume.value = [];
        }

        // 3. Map Client Journey
        if (d.clientJourney) {
          clientJourney.value = {
            newLeads: d.clientJourney.newClients,
            bookedAppointments: d.clientJourney.bookedAppointment,
            returningClients: d.clientJourney.returningClients,
          };
        }

        // 4. Map Staff Utilization
        staffUtilization.value = d.staffUtilaization || [];

        // 5. Map Service Performance
        // Using 'any' cast here if the API types file isn't updated yet to include servicePerformance
        servicePerformance.value = (d as any).servicePerformance || [];
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    stats,
    appointmentVolume,
    volumeSummary,
    clientJourney,
    staffUtilization,
    servicePerformance,
    isLoading,
    currentFilter,
    customDateRange,
    fetchDashboardStats,
  };
});
