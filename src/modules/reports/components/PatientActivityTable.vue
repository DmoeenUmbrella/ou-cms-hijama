<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { PatientActivityItem } from '@/api/endpoints/reports/types'

const props = defineProps<{
  data: PatientActivityItem[]
  isLoading: boolean
  error: string | null
  currentPage: number
  hasMore: boolean
}>()

const emit = defineEmits<{
  (e: 'next-page'): void
  (e: 'prev-page'): void
}>()

const { t, locale } = useI18n()
const isRTL = computed(() => locale.value === 'ar')
// Format date to "Nov 25, 2025" style
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// RTL alignment helper
const alignEnd = computed(() => 
  locale.value === 'ar' ? 'text-left' : 'text-right'
)

const canGoPrev = computed(() => props.currentPage > 1)
const canGoNext = computed(() => props.hasMore)
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <CardTitle class="text-base font-semibold">
        {{ t('reports.patient.activity_title') }}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <!-- Error State -->
      <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="space-y-3">
        <Skeleton v-for="i in 5" :key="i" class="h-12 w-full" />
      </div>

      <!-- Table -->
      <div v-else>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[100px]">{{ t('reports.patient.client_id') }}</TableHead>
              <TableHead>{{ t('reports.patient.client_name') }}</TableHead>
              <TableHead>{{ t('reports.patient.last_session') }}</TableHead>
              <TableHead>{{ t('reports.patient.total_sessions') }}</TableHead>
              <TableHead>{{ t('reports.patient.total_followups') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- Empty State -->
            <TableRow v-if="data.length === 0">
              <TableCell colspan="5" class="text-center text-muted-foreground py-8">
                {{ t('common.no_data') }}
              </TableCell>
            </TableRow>

            <!-- Data Rows -->
            <TableRow v-for="item in data" :key="item.clientId">
              <TableCell class="font-medium text-muted-foreground" :class="{ 'text-right': isRTL }">
                #{{ item.clientId }}
              </TableCell>
              <TableCell :class="{ 'text-right': isRTL }">
                {{ item.clientName }}
              </TableCell>
              <TableCell :class="{ 'text-right': isRTL }">
                {{ formatDate(item.lastSession) }}
              </TableCell>
              <TableCell :class="{ 'text-right': isRTL }">
                {{ item.totalSessions }}
              </TableCell>
              <TableCell :class="{ 'text-right': isRTL }">
                {{ item.totalFollowUps }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t">
          <span class="text-sm text-muted-foreground">
            {{ t('common.page') }} {{ currentPage }}
          </span>
          <div class="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              :disabled="!canGoPrev"
              @click="emit('prev-page')"
            >
              <ChevronLeft class="h-4 w-4" />
              {{ t('common.previous') }}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              :disabled="!canGoNext"
              @click="emit('next-page')"
            >
              {{ t('common.next') }}
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
