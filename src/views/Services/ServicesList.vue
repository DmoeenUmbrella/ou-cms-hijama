<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Briefcase, Plus } from 'lucide-vue-next'
import { Toast } from '@/lib/toast'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import ServicesTable from '@/modules/services/components/ServicesTable.vue'
import ServicesFormDialog from '@/modules/services/components/ServicesFormDialog.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useService } from '@/modules/services/composables/useService'
import type { CreateServicePayload, UpdateServicePayload } from '@/api/endpoints/service/mutations'

const { 
  fetchServices, 
  addService, 
  editService, 
  removeService, 
  isLoading 
} = useService()

interface ServiceFormData {
  id?: number
  name: string
  duration: number
  amount: number
  description: string
}

// Dialog states
const isFormDialogOpen = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const selectedService = ref<ServiceFormData | null>(null)

// Handle edit service - Open dialog in edit mode
const handleEditService = (service: any) => {
  dialogMode.value = 'edit'
  selectedService.value = {
    id: service.id,
    name: service.name,
    duration: service.duration,
    amount: service.amount,
    description: service.description || ''
  }
  isFormDialogOpen.value = true
}

// Handle delete service
const handleDeleteService = async (service: any) => {
  if (confirm(`Are you sure you want to delete ${service.name}?`)) {
    try {
      await removeService(service.id)
      Toast.success('Service deleted successfully')
    } catch (error: any) {
      Toast.error(error.message || 'Failed to delete service')
    }
  }
}

// Handle add service - Open dialog in create mode
const handleAddService = () => {
  dialogMode.value = 'create'
  selectedService.value = null
  isFormDialogOpen.value = true
}

// Handle form submission
const handleFormSubmit = async (data: ServiceFormData) => {
  try {
    if (dialogMode.value === 'create') {
      const payload: CreateServicePayload = {
        name: data.name,
        duration: data.duration,
        amount: data.amount,
        description: data.description || '',
      }
      
      await addService(payload)
      Toast.success('Service created successfully')
    } else {
      const payload: UpdateServicePayload = {
        id: data.id!,
        name: data.name,
        duration: data.duration,
        amount: data.amount,
        description: data.description || '',
      }
      
      await editService(payload)
      Toast.success('Service updated successfully')
    }
    
    // Close dialog after successful submission
    isFormDialogOpen.value = false
  } catch (error: any) {
    Toast.error(error.message || `Failed to ${dialogMode.value} service`)
  }
}

// Fetch services on mount
onMounted(async () => {
  try {
    await fetchServices()
  } catch (error: any) {
    Toast.error(error.message || 'Failed to fetch services')
  }
})
</script>

<template>
  <LayoutAuthenticated>
    <!-- Service Form Dialog (Add/Edit) -->
    <ServicesFormDialog 
      v-model:open="isFormDialogOpen"
      :service="selectedService"
      :mode="dialogMode"
      @submit="handleFormSubmit"
    />

    <div class="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Briefcase class="h-8 w-8" />
          <h2 class="text-3xl font-bold tracking-tight">Services</h2>
        </div>
        <div class="flex items-center gap-2">
          <Button @click="handleAddService">
            <Plus class="mr-2 h-4 w-4" />
            Add New Service
          </Button>
        </div>
      </div>

      <!-- Table Card -->
      <Card>
        <CardHeader>
          <CardTitle>Service List</CardTitle>
          <CardDescription>
            Manage your services and view their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServicesTable 
            @edit="handleEditService" 
            @delete="handleDeleteService"
          />
        </CardContent>
      </Card>
    </div>
  </LayoutAuthenticated>
</template>
