<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, User } from 'lucide-vue-next'
// import { Toast } from '@/lib/toast'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import CustomerInfoCard from '@/modules/customer/components/CustomerInfoCard.vue'
import SessionHistoryTable from '@/modules/customer/components/SessionHistoryTable.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomer } from '@/modules/customer/composables/customer.composable'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const { currentCustomer, isLoading, fetchCustomerDetails } = useCustomer()

onMounted(async () => {
  try {
    await fetchCustomerDetails(props.id)
  } catch (error: any) {
    // Toast.error(error.message || 'Failed to fetch customer details')
  }
})

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
            <h2 class="text-3xl font-bold tracking-tight">Customer Details</h2>
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

        <!-- Right Column - Session History -->
        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>
                Complete history of all sessions for this customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SessionHistoryTable :sessions="currentCustomer.appointments" />
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Error State -->
      <Card v-else>
        <CardContent class="flex justify-center items-center py-12">
          <p class="text-muted-foreground">Customer not found</p>
        </CardContent>
      </Card>
    </div>
  </LayoutAuthenticated>
</template>