<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Wrench, Plus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import TechniciansTable from '@/modules/technician/components/TechniciansTable.vue'
import TechnicianFormDialog from '@/modules/technician/components/TechnicianFormDialog.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTechnician } from '@/modules/technician/composables/useTechnician'
import type { CreateTechnicianPayload, UpdateTechnicianPayload } from '@/api/endpoints/technician/mutations'

const { t } = useI18n()

const { 
  fetchTechnicians, 
  addTechnician, 
  editTechnician, 
  removeTechnician, 
  isLoading 
} = useTechnician()

interface TechnicianFormData {
  id?: number
  name: string
}

// Dialog states
const isFormDialogOpen = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const selectedTechnician = ref<TechnicianFormData | null>(null)

// Handle edit technician - Open dialog in edit mode
const handleEditTechnician = (technician: any) => {
  dialogMode.value = 'edit'
  selectedTechnician.value = {
    id: technician.id,
    name: technician.name
  }
  isFormDialogOpen.value = true
}

// Handle delete technician
const handleDeleteTechnician = async (technician: any) => {
  if (confirm(t('technicians.messages.delete_confirm'))) {
    try {
      await removeTechnician(technician.id)
      toast.success(t('technicians.messages.delete_success'))
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete technician')
    }
  }
}

// Handle add technician - Open dialog in create mode
const handleAddTechnician = () => {
  dialogMode.value = 'create'
  selectedTechnician.value = null
  isFormDialogOpen.value = true
}

// Handle form submission
const handleFormSubmit = async (data: TechnicianFormData) => {
  try {
    if (dialogMode.value === 'create') {
      const payload: CreateTechnicianPayload = {
        name: data.name
      }
      
      await addTechnician(payload)
      toast.success(t('technicians.messages.add_success'))
    } else {
      const payload: UpdateTechnicianPayload = {
        id: data.id!,
        name: data.name
      }
      
      await editTechnician(payload)
      toast.success(t('technicians.messages.update_success'))
    }
    
    // Close dialog after successful submission
    isFormDialogOpen.value = false
  } catch (error: any) {
    toast.error(error.message || `Failed to ${dialogMode.value} technician`)
  }
}

// Fetch technicians on mount
onMounted(async () => {
  try {
    await fetchTechnicians()
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch technicians')
  }
})
</script>

<template>
  <LayoutAuthenticated>
    <!-- Technician Form Dialog (Add/Edit) -->
    <TechnicianFormDialog 
      v-model:open="isFormDialogOpen"
      :technician="selectedTechnician"
      :mode="dialogMode"
      @submit="handleFormSubmit"
    />

    <div class="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Wrench class="h-8 w-8" />
          <h2 class="text-3xl font-bold tracking-tight">{{ t('technicians.title') }}</h2>
        </div>
        <div class="flex items-center gap-2">
          <Button @click="handleAddTechnician">
            <Plus class="mr-2 h-4 w-4" />
            {{ t('technicians.add_technician_btn') }}
          </Button>
        </div>
      </div>

      <!-- Table Card -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('technicians.title') }}</CardTitle>
          <CardDescription>
            Manage your technicians and view their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TechniciansTable 
            @edit="handleEditTechnician" 
            @delete="handleDeleteTechnician"
          />
        </CardContent>
      </Card>
    </div>
  </LayoutAuthenticated>
</template>
