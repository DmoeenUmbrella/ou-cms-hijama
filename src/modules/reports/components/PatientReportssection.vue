<script setup lang="ts">
import { usePatientReport } from '../composables/patientReport.composable'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import { Skeleton } from '@/components/ui/skeleton'
import PatientActivityTable from './PatientActivityTable.vue'

const {
  t,
  isLoading,
  error,
  totalClients,
  activeClients,
  newClients,
  retentionRate,
  // Activity table
  activityData,
  activityLoading,
  activityError,
  activityPage,
  hasMoreActivity,
  goToNextPage,
  goToPrevPage,
} = usePatientReport()
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div>
      <h3 class="text-lg font-semibold">{{ t('reports.patient.title') }}</h3>
      <p class="text-sm text-muted-foreground">{{ t('reports.patient.description') }}</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton v-for="i in 4" :key="i" class="h-[120px] rounded-lg" />
    </div>

    <!-- Stats Cards Grid -->
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard 
        :title="t('reports.patient.total_patients')" 
        :value="totalClients" 
        accentColor="indigo" 
      />
      <DashboardCard 
        :title="t('reports.patient.active_patients')" 
        :value="activeClients" 
        accentColor="cyan" 
      />
      <DashboardCard 
        :title="t('reports.patient.new_patients')" 
        :value="newClients" 
        accentColor="pink" 
      />
      <DashboardCard 
        :title="t('reports.patient.returning_patients')" 
        :value="`${retentionRate}%`" 
        accentColor="rose" 
      />
    </div>

    <!-- Activity Table -->
    <PatientActivityTable
      :data="activityData"
      :is-loading="activityLoading"
      :error="activityError"
      :current-page="activityPage"
      :has-more="hasMoreActivity"
      @next-page="goToNextPage"
      @prev-page="goToPrevPage"
    />
  </div>
</template>
