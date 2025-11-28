<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Appointment } from '@/api/endpoints/customer/queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { t, locale } = useI18n()

// Helper function to convert numbers to Arabic numerals
const toArabicNumerals = (num: number | string): string => {
  if (locale.value !== 'ar') return num.toString()
  
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return num.toString().split('').map(digit => {
    const parsed = parseInt(digit)
    return isNaN(parsed) ? digit : arabicNumerals[parsed]
  }).join('')
}

// Computed property for RTL
const isRTL = computed(() => locale.value === 'ar')

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
    sessionNumber: `#${toArabicNumerals(session.id)}`,
    date: format(new Date(session.date), 'yyyy-MM-dd'),
    service: session.notes || 'Hijama Session',
    duration: '-', // API doesn't provide duration
    price: toArabicNumerals(session.price),
    numberOfCups: toArabicNumerals(session.numberOfCups),
    notes: session.notes
  }))
})

// Computed property for text alignment
const textAlign = computed(() => isRTL.value ? 'text-right' : 'text-left')

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
          <TableCell :class="['font-medium', textAlign]">{{ session.sessionNumber }}</TableCell>
          <TableCell :class="textAlign">{{ session.date }}</TableCell>
          <TableCell :class="textAlign">{{ session.service }}</TableCell>
          <TableCell :class="textAlign">{{ session.numberOfCups }}</TableCell>
          <TableCell :class="[textAlign, 'font-semibold', 'text-emerald-600']">
            {{ session.price }} AED
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <div v-if="!isLoading && totalAppointments > 0" class="flex items-center justify-between px-4 py-4 border-t">
     <div class="text-sm text-gray-700 dark:text-gray-300">
        {{ t('customers.table.showing', { 
          from: toArabicNumerals(((currentPage - 1) * itemsPerPage) + 1), 
          to: toArabicNumerals(Math.min(currentPage * itemsPerPage, totalAppointments)),
          total: toArabicNumerals(totalAppointments)
        }) }}
      </div>
      <div :class="['flex items-center gap-2', isRTL ? 'flex-row-reverse' : 'flex-row']">
        <Button
          variant="outline"
          size="sm"
          :disabled="!canGoPrevious"
          @click="handlePreviousPage"
        >
          {{ t('customers.table.previous') }}
        </Button>
        <div class="flex gap-1">
          <Button
            v-for="page in totalPages"
            :key="page"
            size="sm"
            :variant="currentPage === page ? 'default' : 'outline'"
            @click="emit('page-change', page)"
            v-show="page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1"
          >
            {{ toArabicNumerals(page) }}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          :disabled="!canGoNext"
          @click="handleNextPage"
        >
          {{ t('customers.table.next') }}
        </Button>
      </div>
    </div>
  </div>
</template>
