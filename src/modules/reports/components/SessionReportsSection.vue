<script setup lang="ts">
import { useSessionReport } from '../composables/sessionReport.composable'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import { Skeleton } from '@/components/ui/skeleton'

const {
  t,
  isLoading,
  error,
  totalAppointments,
  totalRevenue,
} = useSessionReport()
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div>
      <h3 class="text-lg font-semibold">{{ t('reports.session.title') }}</h3>
      <p class="text-sm text-muted-foreground">{{ t('reports.session.description') }}</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid gap-4 md:grid-cols-2">
      <Skeleton v-for="i in 2" :key="i" class="h-[120px] rounded-lg" />
    </div>

    <!-- Stats Cards Grid -->
    <div v-else class="grid gap-4 md:grid-cols-2">
      <DashboardCard 
        :title="t('reports.session.total_sessions')" 
        :value="totalAppointments" 
        accentColor="indigo" 
      />
      <DashboardCard 
        :title="t('reports.session.total_revenue')" 
        :value="`${totalRevenue} SAR`" 
        accentColor="cyan" 
      />
    </div>
  </div>
</template>
