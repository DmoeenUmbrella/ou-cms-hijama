<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, User } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import CustomerInfoCard from '@/modules/customer/components/CustomerInfoCard.vue'
import SessionHistoryTable from '@/modules/customer/components/SessionHistoryTable.vue'
import FollowUpTable from '@/modules/customer/components/FollowUpTable.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCustomer } from '@/modules/customer/composables/customer.composable'

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
      <div v-else-if="currentCustomer" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Column - Customer Info Card -->
        <div class="lg:col-span-1">
          <CustomerInfoCard :customer="currentCustomer" />
        </div>

        <!-- Right Column - Tabs with Session History and Follow-Ups -->
        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {{ activeTab === 'sessions' ? t('customers.session_history') : t('customers.follow_ups') }}
              </CardTitle>
              <CardDescription>
                {{ activeTab === 'sessions' ? t('customers.session_history_description') : t('customers.follow_ups_description') }}
              </CardDescription>
            </CardHeader>
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
                  <div class="space-y-4">
                    <!-- Upcoming Follow-Ups -->
                    <div>
                      <h3 class="text-lg font-semibold mb-2">{{ t('customers.upcoming_follow_ups') }}</h3>
                      <FollowUpTable 
                        :follow-ups="followUps?.upcoming.data || []"
                        :total-follow-ups="followUps?.upcoming.totalCount || 0"
                        :current-page="1"
                        :items-per-page="10"
                        :is-loading="isLoadingFollowUps"
                        type="upcoming"
                        @page-change="() => {}"
                      />
                    </div>
                    
                    <!-- Past Follow-Ups -->
                    <div>
                      <h3 class="text-lg font-semibold mb-2">{{ t('customers.past_follow_ups') }}</h3>
                      <FollowUpTable 
                        :follow-ups="followUps?.past.data || []"
                        :total-follow-ups="followUps?.past.totalCount || 0"
                        :current-page="1"
                        :items-per-page="10"
                        :is-loading="isLoadingFollowUps"
                        type="past"
                        @page-change="() => {}"
                      />
                    </div>
                  </div>
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