import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

// --- Types ---
export interface DashboardStats {
  totalAppointment: number;
  appointmentStatus: number;
  activeClients: number;
  clientStatus: number;
  totalSessions: number;
  sessionStatus: number;
}

// FIX: Update Type to match Unovis/Shadcn (Array of objects)
export type ChartData = Array<{
  name: string;
  total: number;
}>;

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type FilterType =
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "custom";

export const useReportsStore = defineStore("reports", () => {
  // --- State ---
  const stats = ref<DashboardStats>({
    totalAppointment: 0,
    appointmentStatus: 0,
    activeClients: 0,
    clientStatus: 0,
    totalSessions: 0,
    sessionStatus: 0,
  });

  // FIX: Initialize as empty array
  const chartData = ref<ChartData>([]);

  const isLoading = ref(false);
  const currentFilter = ref<FilterType>("this_month");
  const customDateRange = ref<DateRange>({ start: null, end: null });

  // --- Helpers ---
  const getMockToday = () => new Date("2025-12-31");

  function getDateRange(filterType: FilterType): DateRange {
    const today = getMockToday();
    let start = new Date(today);
    let end = new Date(today);

    if (filterType === "this_month") {
      start.setDate(1);
    } else if (filterType === "last_month") {
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    } else if (filterType === "last_3_months") {
      start.setMonth(start.getMonth() - 2);
      start.setDate(1);
    }

    return { start, end };
  }

  function filterDataByRange(
    data: Record<string, any>,
    start: Date,
    end: Date
  ) {
    const filtered: Record<string, any> = {};
    const startTime = new Date(start).setHours(0, 0, 0, 0);
    const endTime = new Date(end).setHours(23, 59, 59, 999);

    for (const [dateStr, metrics] of Object.entries(data)) {
      const current = new Date(dateStr).getTime();
      if (current >= startTime && current <= endTime) {
        filtered[dateStr] = metrics;
      }
    }
    return filtered;
  }

  // --- Actions ---
  async function fetchDashboardStats(
    filterType: FilterType = "this_month",
    range: DateRange | null = null
  ) {
    isLoading.value = true;

    let dateRange: DateRange;
    if (filterType === "custom" && range?.start && range?.end) {
      dateRange = { start: new Date(range.start), end: new Date(range.end) };
      customDateRange.value = range;
    } else {
      dateRange = getDateRange(filterType);
    }
    currentFilter.value = filterType;

    try {
      // FIX: Ensure path is absolute
      const response = await axios.get("/data-sources/dashboard.json");
      const rawData = response.data.data.appointments;

      if (dateRange.start && dateRange.end) {
        const filteredData = filterDataByRange(
          rawData,
          dateRange.start,
          dateRange.end
        );

        let totalAppt = 0;
        let totalClients = 0;
        let totalSess = 0;

        const chartPoints: ChartData = [];
        const sortedDates = Object.keys(filteredData).sort();

        sortedDates.forEach((date) => {
          const day = filteredData[date];
          totalAppt += day.totalAppointment;
          totalClients += day.activeClients;
          totalSess += day.totalSessions;

          const d = new Date(date);
          const label = d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          chartPoints.push({
            name: label,
            total: day.totalAppointment,
          });
        });

        stats.value = {
          totalAppointment: totalAppt,
          activeClients: totalClients,
          totalSessions: totalSess,
          appointmentStatus: 12,
          clientStatus: 8,
          sessionStatus: 15,
        };

        chartData.value = chartPoints;
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    stats,
    chartData,
    isLoading,
    currentFilter,
    customDateRange,
    fetchDashboardStats,
  };
});
