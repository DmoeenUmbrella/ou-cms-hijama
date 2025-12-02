<script setup lang="ts">
import { useFollowupReport } from '../composables/FollowupReport.composable'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import { Skeleton } from '@/components/ui/skeleton'

const {
  t,
  isLoading,
  error,
  totalFollowUps,
  responseRate,
} = useFollowupReport()
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div>
      <h3 class="text-lg font-semibold">{{ t('reports.followup.title') }}</h3>
      <p class="text-sm text-muted-foreground">{{ t('reports.followup.description') }}</p>
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
        :title="t('reports.followup.total_followups')" 
        :value="totalFollowUps" 
        accentColor="indigo" 
      />
      <DashboardCard 
        :title="t('reports.followup.response_rate')" 
        :value="`${responseRate}%`" 
        accentColor="cyan" 
      />
    </div>
  </div>
</template>
