<script setup lang="ts">
import type { FollowUpItem } from '@/api/endpoints/customer/queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useFollowUpTable } from '@/modules/patients/composables/followupTable.composable'

const props = defineProps<{
  followUps: FollowUpItem[]
  totalFollowUps: number
  currentPage: number
  itemsPerPage: number
  isLoading: boolean
  type: 'upcoming' | 'past' | 'all'
  isClientView?: boolean
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const {
  formattedFollowUps,
  textAlign,
  isRTL,
  totalPages,
  canGoPrevious,
  canGoNext,
  toArabicNumerals,
  handlePreviousPage,
  handleNextPage,
  t,
} = useFollowUpTable(
  () => props.followUps,
  () => [],
  () => props.totalFollowUps,
  () => 0,
  () => props.isLoading,
  emit,
  true // Always true - FollowUpTable receives already-filtered data from parent
)

const handleSendMessage = (_followUp: any) => {
  toast.info(t('common.feature_coming_soon'))
}
</script>

<template>
  <div class="rounded-md border bg-card">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-if="!isClientView">{{ t('customers.table.client') }}</TableHead>
          <!-- <TableHead>{{ t('customers.table.appointment_id') }}</TableHead> -->
          <!-- <TableHead v-if="isClientView">{{ t('customers.table.client_id') }}</TableHead> -->
          <TableHead>{{ t('customers.table.follow_up_date') }}</TableHead>
          <TableHead>{{ t('common.actions') }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="isLoading">
          <TableCell :colspan="isClientView ? 4 : 4" class="text-center py-8 text-muted-foreground">
            {{ t('customers.loading_follow_ups') }}
          </TableCell>
        </TableRow>
        <TableRow v-else-if="formattedFollowUps.length === 0">
          <TableCell :colspan="isClientView ? 4 : 4" class="text-center py-8 text-muted-foreground">
            {{ t('customers.no_follow_ups_found') }}
          </TableCell>
        </TableRow>
        <TableRow v-for="followUp in formattedFollowUps" :key="followUp.id" v-else>
          <!-- Client Column for General View -->
          <TableCell v-if="!isClientView" :class="textAlign">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-primary">{{ followUp.client?.initials || 'NA' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="font-medium">{{ followUp.client?.name || '-' }}</span>
                <span class="text-xs text-muted-foreground">ID: {{ followUp.clientId }}</span>
              </div>
            </div>
          </TableCell>
          <!-- <TableCell :class="textAlign">{{ followUp.appointmentId }}</TableCell> -->
          <!-- <TableCell v-if="isClientView" :class="textAlign">{{ followUp.clientId }}</TableCell> -->
          <TableCell :class="textAlign">
            <div class="flex flex-col">
              <span class="font-semibold text-foreground">{{ followUp.date }}</span>
              <span class="text-sm text-muted-foreground">{{ followUp.time }}</span>
            </div>
          </TableCell>
          <TableCell>
            <Button 
              variant="ghost" 
              size="icon"
              @click="handleSendMessage(followUp)"
              :title="t('common.send_message')"
            >
              <MessageSquare class="h-4 w-4" />
            </Button>
          </TableCell>
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
