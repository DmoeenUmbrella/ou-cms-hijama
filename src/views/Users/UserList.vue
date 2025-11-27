<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserCog, Plus } from 'lucide-vue-next'
import { Toast } from '@/lib/toast'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import UsersTable from '@/modules/users/components/UsersTable.vue'
import UsersFormDialog from '@/modules/users/components/UsersFormDialog.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@/modules/users/composables/useUser'
import type { CreateUserPayload, UpdateUserPayload } from '@/api/endpoints/user/mutations'

const { 
  fetchUsers, 
  addUser, 
  editUser, 
  removeUser, 
  isLoading 
} = useUser()

interface UserFormData {
  id?: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  clinicId: string
  profileUrl: string
  password?: string
}

// Dialog states
const isFormDialogOpen = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const selectedUser = ref<UserFormData | null>(null)

// Handle edit user - Open dialog in edit mode
const handleEditUser = (user: any) => {
  dialogMode.value = 'edit'
  selectedUser.value = {
    id: user.id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    clinicId: user.clinicIds?.[0] || '1',
    profileUrl: user.profileUrl || ''
  }
  isFormDialogOpen.value = true
}

// Handle delete user
const handleDeleteUser = async (user: any) => {
  if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
    try {
      await removeUser(user.id)
      Toast.success('User deleted successfully')
    } catch (error: any) {
      Toast.error(error.message || 'Failed to delete user')
    }
  }
}

// Handle add user - Open dialog in create mode
const handleAddUser = () => {
  dialogMode.value = 'create'
  selectedUser.value = null
  isFormDialogOpen.value = true
}

// Handle form submission
const handleFormSubmit = async (data: UserFormData) => {
  try {
    if (dialogMode.value === 'create') {
      const payload: CreateUserPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        clinicId: data.clinicId,
        profileUrl: data.profileUrl || '',
        password: data.password || '',
      }
      
      await addUser(payload)
      Toast.success('User created successfully')
    } else {
      const payload: UpdateUserPayload = {
        id: data.id!,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        clinicId: data.clinicId,
        profileUrl: data.profileUrl || '',
      }
      
      await editUser(payload)
      Toast.success('User updated successfully')
    }
    
    // Close dialog after successful submission
    isFormDialogOpen.value = false
  } catch (error: any) {
    Toast.error(error.message || `Failed to ${dialogMode.value} user`)
  }
}

// Fetch users on mount
onMounted(async () => {
  try {
    await fetchUsers()
  } catch (error: any) {
    Toast.error(error.message || 'Failed to fetch users')
  }
})
</script>

<template>
  <LayoutAuthenticated>
    <!-- User Form Dialog (Add/Edit) -->
    <UsersFormDialog 
      v-model:open="isFormDialogOpen"
      :user="selectedUser"
      :mode="dialogMode"
      @submit="handleFormSubmit"
    />

    <div class="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UserCog class="h-8 w-8" />
          <h2 class="text-3xl font-bold tracking-tight">Users Management</h2>
        </div>
        <div class="flex items-center gap-2">
          <Button @click="handleAddUser">
            <Plus class="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <!-- Table Card -->
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            Manage your users and view their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable 
            @edit="handleEditUser" 
            @delete="handleDeleteUser"
          />
        </CardContent>
      </Card>
    </div>
  </LayoutAuthenticated>
</template>
