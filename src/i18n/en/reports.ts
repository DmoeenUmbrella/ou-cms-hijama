export default {
  reports: {
    title: "Analytics & Reports",
    subtitle: "Track clinic performance and trends",
    trends_title: "Monthly Appointment Trends",
    dashboard_title: "Dashboard",

    kpi: {
      active_clients: "Active Clients",
      client_retention: "Client Retention Rate", // New
      monthly_appointments: "Monthly Appointments", // New
      monthly_revenue: "Monthly Revenue", // New

      // Existing keys (kept to prevent errors if used elsewhere)
      total_appointments: "Total Appointments",
      total_sessions: "Total Sessions",

      vs_last_month: "from last month",
    },

    filters: {
      this_month: "This Month",
      last_month: "Last Month",
      last_3_months: "Last 3 Months",
      custom: "Custom Range",
      select_range: "Select Date Range",
    },
  },
};
