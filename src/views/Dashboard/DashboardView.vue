<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

// --- Internationalized Date (REQUIRED for shadcn-vue Calendar) ---
import {
  DateFormatter,
  type DateValue,
  type RangeValue,
  today,
  getLocalTimeZone
} from '@internationalized/date'

// Layouts + UI
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RangeCalendar } from '@/components/ui/range-calendar'

// Dashboard Components
import AppointmentVolumeChart from '@/modules/dashboard/components/AppointmentVolumeChart.vue'
import ClientJourney from '@/modules/dashboard/components/ClientJourney.vue'
import ServicePerformance from '@/modules/dashboard/components/ServicePerformance.vue'
import StaffUtilization from '@/modules/dashboard/components/StaffUtilization.vue'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

// Composable + Store
import useDashboard from '@/modules/dashboard/composables/dashboard.composable'
import { useDashboardStore } from '@/modules/dashboard/stores/useDashboardStore'

const { t } = useI18n()
const reportsStore = useDashboardStore()

const {
  timeFilter,
  filterOptions,
  isCustomRangeModalActive,
  dateRange,
  handleFilterChange,
  applyCustomRange
} = useDashboard()

const df = new DateFormatter('en-US', { dateStyle: 'medium' })

// -------------------------------
// ✅ Correct Internationalized Date Range
// -------------------------------
const tempDateRange = ref<RangeValue<DateValue>>({
  start: today(getLocalTimeZone()),
  end: today(getLocalTimeZone())
})

// -------------------------------
// Modal Sync
// -------------------------------
const onModalOpenChange = (open: boolean) => {
  isCustomRangeModalActive.value = open

  if (open && dateRange.value.start && dateRange.value.end) {
    tempDateRange.value = {
      start: dateRange.value.start,
      end: dateRange.value.end
    }
  }
}

const onApplyClick = () => {
  dateRange.value = tempDateRange.value
  applyCustomRange()
}

// -------------------------------
onMounted(() => {
  reportsStore.fetchDashboardStats()
})
</script>

<template>
  <LayoutAuthenticated>
    <div class="flex-1 space-y-4 p-8 pt-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-tight">{{ t('reports.title') }}</h2>
          <p class="text-muted-foreground">{{ t('reports.subtitle') }}</p>
        </div>

        <Select :model-value="timeFilter" @update:model-value="(v) => handleFilterChange(v as string)">
          <SelectTrigger class="w-[180px]">
            <SelectValue :placeholder="t('reports.filters.select_range')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in filterOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Cards -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard :title="t('reports.kpi.active_clients')" :value="reportsStore.stats.activeClients"
          :change="reportsStore.stats.clientStatus" :period="t('reports.kpi.vs_last_month')" accent-color="indigo" />

        <DashboardCard :title="t('reports.kpi.client_retention')" :value="reportsStore.stats.retentionRate + '%'"
          :change="reportsStore.stats.retentionStatus" :period="t('reports.kpi.vs_last_month')" accent-color="cyan" />

        <DashboardCard :title="t('reports.kpi.monthly_appointments')" :value="reportsStore.stats.totalAppointment"
          :change="reportsStore.stats.appointmentStatus" :period="t('reports.kpi.vs_last_month')" accent-color="pink" />

        <DashboardCard :title="t('reports.kpi.monthly_revenue')"
          :value="'$' + reportsStore.stats.monthlyRevenue.toLocaleString()" :change="reportsStore.stats.revenueStatus"
          :period="t('reports.kpi.vs_last_month')" accent-color="rose" />
      </div>

      <!-- Charts -->
      <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-3 mt-4">
        <AppointmentVolumeChart :data="reportsStore.appointmentVolume" :summary="reportsStore.volumeSummary" />
        <ClientJourney :data="reportsStore.clientJourney" />
      </div>

      <!-- Tables -->
      <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-4">
        <ServicePerformance :data="reportsStore.servicePerformance" />
        <StaffUtilization :data="reportsStore.staffUtilization" />
      </div>

    </div>

    <!-- Range Picker Modal -->
    <Dialog :open="isCustomRangeModalActive" @update:open="onModalOpenChange">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ t('reports.filters.select_range') }}</DialogTitle>
          <DialogDescription>
            Select a start and end date.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4 justify-center">
          <RangeCalendar v-model="tempDateRange" :number-of-months="1" class="rounded-md border" />

        </div>

        <DialogFooter>
          <Button variant="outline" @click="isCustomRangeModalActive = false">Cancel</Button>
          <Button @click="onApplyClick" :disabled="!tempDateRange.start || !tempDateRange.end">
            Update Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </LayoutAuthenticated>
</template>