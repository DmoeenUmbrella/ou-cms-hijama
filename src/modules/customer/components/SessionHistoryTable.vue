<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Appointment } from '@/api/endpoints/customer/queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps<{
  sessions: Appointment[]
  totalAppointments: number
  currentPage: number
  itemsPerPage: number
  isLoading: boolean
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const formattedSessions = computed(() => {
  return props.sessions.map(session => ({
    id: session.id,
    sessionNumber: `#${session.id}`,
    date: format(new Date(session.date), 'yyyy-MM-dd'),
    service: session.notes || 'Hijama Session',
    duration: '-', // API doesn't provide duration
    price: session.price,
    numberOfCups: session.numberOfCups,
    notes: session.notes
  }))
})

const totalPages = computed(() => Math.ceil(props.totalAppointments / props.itemsPerPage))

const canGoPrevious = computed(() => props.currentPage > 1)
const canGoNext = computed(() => props.currentPage < totalPages.value)

const handlePreviousPage = () => {
  if (canGoPrevious.value) {
    emit('page-change', props.currentPage - 1)
  }
}

const handleNextPage = () => {
  if (canGoNext.value) {
    emit('page-change', props.currentPage + 1)
  }
}
</script>

<template>
  <div class="rounded-md border bg-card">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{{ t('customers.table.session') }}</TableHead>
          <TableHead>{{ t('customers.table.date') }}</TableHead>
          <TableHead>{{ t('customers.table.service') }}</TableHead>
          <TableHead>{{ t('customers.table.cups') }}</TableHead>
          <TableHead class="text-right">{{ t('customers.table.price') }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="isLoading">
          <TableCell colspan="5" class="text-center py-8 text-muted-foreground">
            {{ t('customers.loading_appointments') }}
          </TableCell>
        </TableRow>
        <TableRow v-else-if="formattedSessions.length === 0">
          <TableCell colspan="5" class="text-center py-8 text-muted-foreground">
            {{ t('customers.no_sessions_found') }}
          </TableCell>
        </TableRow>
        <TableRow v-for="session in formattedSessions" :key="session.id" v-else>
          <TableCell class="font-medium">{{ session.sessionNumber }}</TableCell>
          <TableCell>{{ session.date }}</TableCell>
          <TableCell>{{ session.service }}</TableCell>
          <TableCell>{{ session.numberOfCups }}</TableCell>
          <TableCell class="text-right font-semibold text-emerald-600">
            {{ session.price }} AED
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <div v-if="!isLoading && totalAppointments > 0" class="flex items-center justify-between px-4 py-4 border-t">
      <div class="text-sm text-muted-foreground">
        {{ t('customers.table.showing', { 
          from: ((currentPage - 1) * itemsPerPage) + 1, 
          to: Math.min(currentPage * itemsPerPage, totalAppointments),
          total: totalAppointments 
        }) }}
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!canGoPrevious"
          @click="handlePreviousPage"
        >
          <ChevronLeft class="h-4 w-4 mr-1" />
          {{ t('customers.table.previous') }}
        </Button>
        <div class="text-sm font-medium">
          {{ t('customers.table.page_of', { current: currentPage, total: totalPages }) }}
        </div>
        <Button
          variant="outline"
          size="sm"
          :disabled="!canGoNext"
          @click="handleNextPage"
        >
          {{ t('customers.table.next') }}
          <ChevronRight class="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  </div>
</template>
