<script setup lang="ts">
import { onMounted, ref,computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, User } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import CustomerInfoCard from '@/modules/customer/components/CustomerInfoCard.vue'
import SessionHistoryTable from '@/modules/customer/components/SessionHistoryTable.vue'
import FollowUpSection from '@/components/followup/followUpSection.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCustomer } from '@/modules/customer/composables/customer.composable'
import type { Patient } from '@/types/appointment'

const { t } = useI18n()

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const { 
  currentCustomer, 
  appointments,
  followUps,
  isLoading, 
  isLoadingAppointments,
  isLoadingFollowUps,
  currentPage,
  itemsPerPage,
  fetchCustomerDetails,
  fetchCustomerAppointments,
  fetchCustomerFollowUps,
  goToPage
} = useCustomer()

// Active tab
const activeTab = ref('sessions')

onMounted(async () => {
  try {
    await fetchCustomerDetails(props.id)
    await fetchCustomerAppointments(props.id)
    await fetchCustomerFollowUps(props.id)
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch customer details')
  }
})

const handlePageChange = async (page: number) => {
  try {
    await goToPage(props.id, page)
  } catch (error: any) {
    toast.error(error.message || 'Failed to load appointments')
  }
}

const goBack = () => {
  router.back()
}

const handleFollowUpPageChange = (type: 'upcoming' | 'past' | 'all', page: number) => {
  // TODO: Implement pagination for follow-ups
  console.log('Page change:', type, page)
}

const handleRefreshFollowUps = async () => {
  try {
    await fetchCustomerFollowUps(props.id)
  } catch (error: any) {
    toast.error(error.message || 'Failed to refresh follow-ups')
  }
}

const customerAsPatient = computed(() => {
  if (!currentCustomer.value) return null
  
  return {
    id: currentCustomer.value.id.toString(),
    name: currentCustomer.value.name,
    phone: currentCustomer.value.phoneNumber,
    phoneNumber: currentCustomer.value.phoneNumber,
    gender: currentCustomer.value.gender,
    dateOfBirth: currentCustomer.value.dateOfBirth,
    notes: currentCustomer.value.notes,
    totalSessions: currentCustomer.value.totalSessions?.toString() || '0',
    lastSessionDate: currentCustomer.value.lastAppointmentDate || null,
  } as unknown as Patient
})
</script>

<template>
  <LayoutAuthenticated>
    <div class="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" @click="goBack">
            <ArrowLeft class="h-5 w-5" />
          </Button>
          <div class="flex items-center gap-2">
            <User class="h-8 w-8" />
            <h2 class="text-3xl font-bold tracking-tight">{{ t('customers.details_title') }}</h2>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>

      <!-- Customer Details -->
      <div v-else-if="currentCustomer" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Left Column - Customer Info Card -->
        <div class="lg:col-span-1">
          <CustomerInfoCard :customer="currentCustomer" />
        </div>

        <!-- Right Column - Tabs with Session History and Follow-Ups -->
        <div class="lg:col-span-3">
          <Card>
            <CardContent>
              <Tabs v-model="activeTab" default-value="sessions">
                <TabsList class="grid w-full grid-cols-2">
                  <TabsTrigger value="sessions">
                    {{ t('customers.tabs.sessions') }}
                  </TabsTrigger>
                  <TabsTrigger value="follow-ups">
                    {{ t('customers.tabs.follow_ups') }}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="sessions" class="mt-4">
                  <div class="space-y-6">
    <!-- Header with Title and Add Button -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">{{ t('customers.session_history') }}</h2>
        <p class="text-sm text-muted-foreground">{{ t('customers.session_history_description') }}</p>
      </div>
    </div>
                  </div>
                  <SessionHistoryTable 
                    :sessions="appointments?.appointments || []"
                    :total-appointments="appointments?.totalAppointments || 0"
                    :current-page="currentPage"
                    :items-per-page="itemsPerPage"
                    :is-loading="isLoadingAppointments"
                    @page-change="handlePageChange"
                  />
                </TabsContent>
                
                <TabsContent value="follow-ups" class="mt-4">
                  <FollowUpSection 
                    :upcoming-follow-ups="followUps?.upcoming.data || []"
                    :past-follow-ups="followUps?.past.data || []"
                    :upcoming-total="followUps?.upcoming.totalCount || 0"
                    :past-total="followUps?.past.totalCount || 0"
                    :is-loading="isLoadingFollowUps"
                    :current-customer="customerAsPatient"
                    :is-client-view="true"
                    @page-change="handleFollowUpPageChange"
                    @refresh-followups="handleRefreshFollowUps"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Error State -->
      <Card v-else>
        <CardContent class="flex justify-center items-center py-12">
          <p class="text-muted-foreground">{{ t('customers.customer_not_found') }}</p>
        </CardContent>
      </Card>
    </div>
  </LayoutAuthenticated>
</template>