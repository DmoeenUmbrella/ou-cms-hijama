<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ClipboardList, Clock, CheckCircle2, AlertTriangle } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const { t } = useI18n()

// Sample data for demo
const stats = [
  {
    title: 'reports.followup.total_followups',
    value: '324',
    icon: ClipboardList,
    change: '+22%',
    changeType: 'positive' as const,
  },
  {
    title: 'reports.followup.pending_followups',
    value: '89',
    icon: Clock,
    change: '-8%',
    changeType: 'positive' as const,
  },
  {
    title: 'reports.followup.completed_followups',
    value: '198',
    icon: CheckCircle2,
    change: '+25%',
    changeType: 'positive' as const,
  },
  {
    title: 'reports.followup.overdue_followups',
    value: '12',
    icon: AlertTriangle,
    change: '-15%',
    changeType: 'positive' as const,
  },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div>
      <h3 class="text-lg font-semibold">{{ t('reports.followup.title') }}</h3>
      <p class="text-sm text-muted-foreground">{{ t('reports.followup.description') }}</p>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in stats" :key="stat.title">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ t(stat.title) }}
          </CardTitle>
          <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <p class="text-xs text-muted-foreground">
            <span :class="stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'">
              {{ stat.change }}
            </span>
            {{ t('reports.kpi.vs_last_month') }}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
