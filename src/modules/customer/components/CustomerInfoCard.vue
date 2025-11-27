<script setup lang="ts">
import { computed } from 'vue'
import { User, Phone, Calendar, DollarSign, Activity } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { CustomerDetails } from '@/api/endpoints/customer/queries'
import { format } from 'date-fns'

const props = defineProps<{
  customer: CustomerDetails
}>()

// Computed properties for customer data
const customerInitials = computed(() => {
  if (!props.customer?.name) return 'NA'
  const names = props.customer.name.split(' ')
  return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const formattedLastVisit = computed(() => {
  if (!props.customer?.lastAppointmentDate) return '-'
  return format(new Date(props.customer.lastAppointmentDate), 'yyyy-MM-dd')
})
</script>

<template>
  <Card>
    <CardHeader class="text-center pb-4">
      <div class="flex justify-center mb-4">
        <div class="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
          <span class="text-3xl font-bold text-emerald-600">{{ customerInitials }}</span>
        </div>
      </div>
      <CardTitle class="text-2xl">{{ customer.name }}</CardTitle>
      <CardDescription>
        <div class="flex items-center justify-center gap-1 mt-2">
          <Phone class="h-3 w-3" />
          <span>{{ customer.phoneNumber }}</span>
        </div>
        <div v-if="customer.gender" class="flex items-center justify-center gap-1 mt-1">
          <User class="h-3 w-3" />
          <span class="capitalize">{{ customer.gender }}</span>
        </div>
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Total Sessions -->
      <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div class="flex items-center gap-2">
          <Activity class="h-5 w-5 text-blue-600" />
          <span class="text-sm font-medium text-muted-foreground">Total Sessions</span>
        </div>
        <span class="text-2xl font-bold text-blue-600">{{ customer.totalSessions }}</span>
      </div>

      <!-- Total Spent -->
      <div class="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
        <div class="flex items-center gap-2">
          <DollarSign class="h-5 w-5 text-emerald-600" />
          <span class="text-sm font-medium text-muted-foreground">Total Spent</span>
        </div>
        <span class="text-2xl font-bold text-emerald-600">{{ customer.totalSpent }} AED</span>
      </div>

      <!-- Last Visit -->
      <div class="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div class="flex items-center gap-2">
          <Calendar class="h-5 w-5 text-purple-600" />
          <span class="text-sm font-medium text-muted-foreground">Last Visit</span>
        </div>
        <span class="text-lg font-bold text-purple-600">{{ formattedLastVisit }}</span>
      </div>
    </CardContent>
  </Card>
</template>
