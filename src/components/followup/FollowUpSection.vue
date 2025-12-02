<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import FollowUpTable from './FollowUpTable.vue'
import FollowUpCalendar from '@/components/followup/FollowUpCalendar.vue'
import PatientForm from '@/modules/patients/components/PatientForm.vue'
import type { FollowUpItem } from '@/api/endpoints/customer/queries'
import type { Patient } from '@/types/appointment'
import { useFollowUpTable } from '@/modules/patients/composables/followupTable.composable'

const props = withDefaults(
  defineProps<{
    upcomingFollowUps: FollowUpItem[]
    pastFollowUps: FollowUpItem[]
    upcomingTotal: number
    pastTotal: number
    isLoading: boolean
    currentCustomer: Patient | null
    isClientView?: boolean
    allFollowUps?: FollowUpItem[]
    allTotal?: number
  }>(),
  {
    isClientView: false,
    allFollowUps: () => [],
    allTotal: 0,
  }
)

const emit = defineEmits<{
  'page-change': [type: 'upcoming' | 'past' | 'all', page: number]
  'refresh-followups': []
}>()

const {
  activeTab,
  searchQuery,
  currentFollowUps,
  currentTotal,
  allTotal,
  upcomingTotal,
  currentPage,
  itemsPerPage,
  isModalActive,
  isEditing,
  currentAction,
  selectedPatient,
  modalTitle,
  handlePageChange,
  openFollowUpModal,
  closeModal,
  handleFormSubmit,
  t,
} = useFollowUpTable(
  () => props.upcomingFollowUps,
  () => props.pastFollowUps,
  () => props.upcomingTotal,
  () => props.pastTotal,
  () => props.isLoading,
  emit,
  props.isClientView
)

const handleAddFollowUp = () => {
  if (props.currentCustomer) {
    openFollowUpModal(props.currentCustomer)
  }
}
</script>

<template>
  <!-- Follow-Up Modal Dialog -->
  <Dialog v-model:open="isModalActive" @update:open="closeModal">
    <DialogContent class="sm:max-w-[800px] max-w-[800px]">
      <DialogHeader>
        <DialogTitle>{{ modalTitle }}</DialogTitle>
        <DialogDescription>
          {{ t('customers.schedule_followup_description') }}
        </DialogDescription>
      </DialogHeader>

      <!-- Patient Form -->
      <div class="max-h-[90dvh] overflow-auto">
        <PatientForm 
          :patient="selectedPatient"
          :isEditing="isEditing" 
          :currentAction="currentAction as 'create-followup' | 'create-patient' | 'edit-patient' | 'create-session' | null" 
          @submit="handleFormSubmit"
          @cancel="closeModal" 
        />
      </div>
    </DialogContent>
  </Dialog>

  <div class="space-y-6">
    <!-- Header with Title and Add Button -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">{{ t('customers.follow_ups') }}</h2>
        <p class="text-sm text-muted-foreground">{{ t('customers.follow_ups_description') }}</p>
      </div>
      <Button v-if="currentCustomer" @click="handleAddFollowUp" class="gap-2">
        <Plus class="h-4 w-4" />
        {{ t('customers.schedule_follow_up') }}
      </Button>
    </div>

    <!-- Dashboard Cards -->
    <div class="grid gap-4 md:grid-cols-2">
      <DashboardCard 
        :title="t('customers.total_follow_ups_card')" 
        :value="allTotal" 
        accentColor="blue" 
      />
      <DashboardCard 
        :title="t('customers.upcoming_card')" 
        :value="upcomingTotal" 
        accentColor="cyan" 
      />
    </div>

    <!-- Tabs: Upcoming, Past, All Follow-Ups -->
    <div :class="isClientView ? '' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'">
      <!-- Tabs Section (2 columns when calendar is visible, full width otherwise) -->
      <div :class="isClientView ? '' : 'lg:col-span-2'">
        <Tabs v-model="activeTab" default-value="upcoming">
          <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              {{ t('customers.upcoming_follow_ups') }}
            </TabsTrigger>
            <TabsTrigger value="past">
              {{ t('customers.past_follow_ups') }}
            </TabsTrigger>
            <TabsTrigger value="all">
              {{ t('customers.all_follow_ups') }}
            </TabsTrigger>
          </TabsList>

          <!-- Search and Date Filter -->
          <div class="flex justify-end gap-4 mt-4 mb-4">
            <div v-if="!isClientView" class="">
              <Input 
                v-model="searchQuery" 
                :placeholder="t('customers.search_follow_ups')"
                class="w-full"
              />
            </div>
            <!-- <div class="w-48">
              <Input 
                v-model="selectedDate" 
                type="date"
                class="w-full"
              />
            </div> -->
          </div>

          <!-- Upcoming Tab -->
          <TabsContent value="upcoming">
            <FollowUpTable 
              :follow-ups="currentFollowUps"
              :total-follow-ups="currentTotal"
              :current-page="currentPage"
              :items-per-page="itemsPerPage"
              :is-loading="isLoading"
              :is-client-view="isClientView"
              type="upcoming"
              @page-change="handlePageChange"
            />
          </TabsContent>

          <!-- Past Tab -->
          <TabsContent value="past">
            <FollowUpTable 
              :follow-ups="currentFollowUps"
              :total-follow-ups="currentTotal"
              :current-page="currentPage"
              :items-per-page="itemsPerPage"
              :is-loading="isLoading"
              :is-client-view="isClientView"
              type="past"
              @page-change="handlePageChange"
            />
          </TabsContent>

          <!-- All Tab -->
          <TabsContent value="all">
            <FollowUpTable 
              :follow-ups="currentFollowUps"
              :total-follow-ups="currentTotal"
              :current-page="currentPage"
              :items-per-page="itemsPerPage"
              :is-loading="isLoading"
              :is-client-view="isClientView"
              type="all"
              @page-change="handlePageChange"
            />
          </TabsContent>
        </Tabs>
      </div>

      <!-- Calendar Section (1 column) -->
      <div v-if="!isClientView" class="lg:col-span-1">
        <FollowUpCalendar />
      </div>
    </div>
  </div>
</template>
