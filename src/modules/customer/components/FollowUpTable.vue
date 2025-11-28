<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FollowUpItem } from '@/api/endpoints/customer/queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

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
  followUps: FollowUpItem[]
  totalFollowUps: number
  currentPage: number
  itemsPerPage: number
  isLoading: boolean
  type: 'upcoming' | 'past'
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const formattedFollowUps = computed(() => {
  return props.followUps.map(followUp => ({
    id: followUp.id,
    followUpId: `#${toArabicNumerals(followUp.id)}`,
    appointmentId: toArabicNumerals(followUp.appointmentId),
    clientId: toArabicNumerals(followUp.clientId),
    date: new Date(followUp.date).toISOString().split('T')[0],
  }))
})

// Computed property for text alignment
const textAlign = computed(() => isRTL.value ? 'text-right' : 'text-left')

const totalPages = computed(() => Math.ceil(props.totalFollowUps / props.itemsPerPage))

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
          <TableHead>{{ t('customers.table.follow_up_id') }}</TableHead>
          <TableHead>{{ t('customers.table.appointment_id') }}</TableHead>
          <TableHead>{{ t('customers.table.client_id') }}</TableHead>
          <TableHead>{{ t('customers.table.follow_up_date') }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="isLoading">
          <TableCell colspan="4" class="text-center py-8 text-muted-foreground">
            {{ t('customers.loading_follow_ups') }}
          </TableCell>
        </TableRow>
        <TableRow v-else-if="formattedFollowUps.length === 0">
          <TableCell colspan="4" class="text-center py-8 text-muted-foreground">
            {{ t('customers.no_follow_ups_found') }}
          </TableCell>
        </TableRow>
        <TableRow v-for="followUp in formattedFollowUps" :key="followUp.id" v-else>
          <TableCell :class="['font-medium', textAlign]">{{ followUp.followUpId }}</TableCell>
          <TableCell :class="textAlign">{{ followUp.appointmentId }}</TableCell>
          <TableCell :class="textAlign">{{ followUp.clientId }}</TableCell>
          <TableCell :class="textAlign">{{ followUp.date }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <div v-if="!isLoading && totalFollowUps > 0" class="flex items-center justify-between px-4 py-4 border-t">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        {{ t('customers.table.showing_follow_ups', { 
          from: toArabicNumerals(((currentPage - 1) * itemsPerPage) + 1), 
          to: toArabicNumerals(Math.min(currentPage * itemsPerPage, totalFollowUps)),
          total: toArabicNumerals(totalFollowUps)
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
