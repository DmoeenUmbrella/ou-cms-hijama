<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserCog, Plus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useConfirmDialogStore } from '@/stores/confirmDialogStore'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import UsersTable from '@/modules/users/components/UsersTable.vue'
import UsersFormDialog from '@/modules/users/components/UsersFormDialog.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@/modules/users/composables/useUser'
import type { CreateUserPayload, CreateAdminPayload, UpdateUserPayload } from '@/api/endpoints/user/mutations'
import type { UserFormData } from '@/api/endpoints/user/types'

const { t } = useI18n()
const dialog = useConfirmDialogStore()

const {
  fetchUsers,
  addUser,
  addAdmin,
  editUser,
  removeUser
} = useUser()

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
    profileUrl: user.profileUrl || '',
    isAdmin: user.type === 'admin'
  }
  isFormDialogOpen.value = true
}

// Handle delete user
const handleDeleteUser = async (user: any) => {
  const confirmed = await dialog.confirm(`${t('users.delete_user_note')} ${user.firstName} ${user.lastName}?`)
  
  if (confirmed) {
    try {
      await removeUser(user.id)
      toast.success(t('users.deleted_successfully'))
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user')
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
      if (data.isAdmin) {
        // Create admin user
        const payload: CreateAdminPayload = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          clinicName: data.clinicName || '',
          profileUrl: data.profileUrl || '',
          password: data.password || '',
        }
        
        await addAdmin(payload)
      } else {
        // Create regular user
        const payload: CreateUserPayload = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          profileUrl: data.profileUrl || '',
          password: data.password || '',
        }
        
        await addUser(payload)
      }
      toast.success(t('users.created_successfully'))
    } else {
      const payload: UpdateUserPayload = {
        id: data.id!,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        profileUrl: data.profileUrl || '',
      }
      
      await editUser(payload)
      toast.success(t('users.updated_successfully'))
    }
    
    // Close dialog after successful submission
    isFormDialogOpen.value = false
  } catch (error: any) {
    toast.error(error.message || `Failed to ${dialogMode.value} user`)
  }
}

// Fetch users on mount
onMounted(async () => {
  try {
    await fetchUsers()
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch users')
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
          <h2 class="text-3xl font-bold tracking-tight">{{ t('users.title') }}</h2>
        </div>
        <div class="flex items-center gap-2">
          <Button @click="handleAddUser">
            <Plus class="mr-2 h-4 w-4" />
            {{ t('users.add_btn') }}
          </Button>
        </div>
      </div>

      <!-- Table Card -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('users.user_list_title') }}</CardTitle>
          <CardDescription>
            {{ t('users.user_list_description') }}
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
