<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReportsStore } from '@/stores/useReportsStore'

// Layout & Components
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import BarChart from '@/components/base/charts/BarChart.vue'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import useDashboard from '@/composables/dashboard.composable'

const { t } = useI18n()
const reportsStore = useReportsStore()
const {
  filterOptions,
  timeFilter,
  handleFilterChange
} = useDashboard();

onMounted(() => {
  reportsStore.fetchDashboardStats()
})
</script>

<template>
  <LayoutAuthenticated>
    <div class="flex-1 space-y-4 p-8 pt-6">

      <!-- Header & Filter -->
      <div class="flex items-center justify-between space-y-2">
        <div>
          <h2 class="text-3xl font-bold tracking-tight">{{ t('reports.title') }}</h2>
          <p class="text-muted-foreground">{{ t('reports.subtitle') }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <Select v-model="timeFilter" @update:modelValue="handleFilterChange">
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
      </div>

      <!-- KPI Stats Grid -->
      <div class="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <DashboardCard class="bg-linear-to-tl from-indigo-400 to-cyan-400 dark:from-indigo-400/25 dark:to-cyan-400/25 "
          :title="t('reports.kpi.total_appointments')" :value="reportsStore.stats.totalAppointment"
          :change="reportsStore.stats.appointmentStatus" :period="t('reports.kpi.vs_last_month')" />
        <DashboardCard class="bg-linear-to-tl from-cyan-500 to-blue-500 dark:from-cyan-500/25 dark:to-blue-500/25 "
          :title="t('reports.kpi.active_clients')" :value="reportsStore.stats.activeClients"
          :change="reportsStore.stats.clientStatus" :period="t('reports.kpi.vs_last_month')" />
        <DashboardCard class="bg-linear-to-tl from-indigo-700 to-blue-500 dark:from-indigo-700/25 dark:to-blue-500/25 "
          :title="t('reports.kpi.total_sessions')" :value="reportsStore.stats.totalSessions"
          :change="reportsStore.stats.sessionStatus" :period="t('reports.kpi.vs_last_month')" />
      </div>

      <!-- Trends Chart -->
      <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <Card class="
          bg-gray-50
          dark:bg-gray-950
          col-span-7
        ">
          <CardHeader>
            <CardTitle>{{ t('reports.trends_title') }}</CardTitle>
            <CardDescription>
              {{ t('reports.subtitle') }}
            </CardDescription>
          </CardHeader>
          <CardContent class="pl-2" v-if="reportsStore.chartData?.length > 0">
            <div class="h-[350px] w-full">
              <BarChart :data="reportsStore.chartData" :config="{}" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </LayoutAuthenticated>
</template>