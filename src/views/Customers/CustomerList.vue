<script setup lang="ts">
import { ref } from 'vue'
import { Users, Plus, Upload } from 'lucide-vue-next'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import ServicesTable from '@/modules/services/components/ServicesTable.vue'
import ServicesFormDialog from '@/modules/services/components/ServicesFormDialog.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CustomerFormData {
  email: string
  name: string
  phoneNumber: string
  profileUrl: string
  address: string
}

// Dialog states
const isFormDialogOpen = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const selectedCustomer = ref<CustomerFormData | null>(null)

// Handle edit customer - Open dialog in edit mode
const handleEditCustomer = (customer: any) => {
  dialogMode.value = 'edit'
  selectedCustomer.value = {
    email: customer.email,
    name: customer.name,
    phoneNumber: customer.phoneNumber,
    profileUrl: customer.profileUrl || '',
    address: customer.address || ''
  }
  isFormDialogOpen.value = true
}

// Handle delete customer
const handleDeleteCustomer = (customer: any) => {
  console.log('Delete customer:', customer)
  // TODO: Show delete confirmation dialog
}

// Handle add customer - Open dialog in create mode
const handleAddCustomer = () => {
  dialogMode.value = 'create'
  selectedCustomer.value = null
  isFormDialogOpen.value = true
}

// Handle form submission
const handleFormSubmit = (data: CustomerFormData) => {
  if (dialogMode.value === 'create') {
    console.log('Creating customer:', data)
    // TODO: API call to create customer
  } else {
    console.log('Updating customer:', data)
    // TODO: API call to update customer
  }
  
  // Close dialog after successful submission
  isFormDialogOpen.value = false
}

// Handle import
const handleImport = () => {
  console.log('Import customers')
  // TODO: Implement import logic
}
</script>

<template>
  <LayoutAuthenticated>
    <!-- Customer Form Dialog (Add/Edit) -->
    <CustomerFormDialog 
      v-model:open="isFormDialogOpen"
      :customer="selectedCustomer"
      :mode="dialogMode"
      @submit="handleFormSubmit"
    />

    <div class="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Users class="h-8 w-8" />
          <h2 class="text-3xl font-bold tracking-tight">Customers</h2>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="destructive" @click="handleImport">
            <Upload class="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button @click="handleAddCustomer">
            <Plus class="mr-2 h-4 w-4" />
            Add New Customer
          </Button>
        </div>
      </div>

      <!-- Table Card -->
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Manage your customers and view their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerTable 
            @edit="handleEditCustomer" 
            @delete="handleDeleteCustomer"
          />
        </CardContent>
      </Card>
    </div>
  </LayoutAuthenticated>
</template>
