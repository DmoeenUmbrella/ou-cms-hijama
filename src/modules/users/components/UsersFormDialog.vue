<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import UsersForm from './UsersForm.vue'

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

interface Props {
  open: boolean
  user?: UserFormData | null
  mode?: 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  mode: 'create'
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [data: UserFormData]
}>()

// Reference to the form component
const userFormRef = ref<InstanceType<typeof UsersForm> | null>(null)

// Computed properties for dialog content
const dialogTitle = computed(() => {
  return props.mode === 'edit' ? 'Edit User' : 'Add New User'
})

const dialogDescription = computed(() => {
  return props.mode === 'edit' 
    ? 'Update user information below' 
    : 'Fill in the details to create a new user'
})

const submitButtonLabel = computed(() => {
  return props.mode === 'edit' ? 'Update User' : 'Create User'
})

// Handle dialog open/close
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

// Handle form submission
const handleSubmit = () => {
  // Trigger form validation and submission through the form's exposed method
  if (userFormRef.value) {
    userFormRef.value.handleSubmit()
  }
}

// Handle form data submission from child
const handleFormSubmit = (data: UserFormData) => {
  emit('submit', data)
}

// Handle cancel/close
const handleCancel = () => {
  isOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>
          {{ dialogDescription }}
        </DialogDescription>
      </DialogHeader>

      <!-- User Form -->
      <div class="py-4">
        <UsersForm 
          ref="userFormRef"
          :initial-data="user"
          :is-edit="mode === 'edit'"
          @submit="handleFormSubmit"
        />
      </div>

      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          @click="handleSubmit"
        >
          {{ submitButtonLabel }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
