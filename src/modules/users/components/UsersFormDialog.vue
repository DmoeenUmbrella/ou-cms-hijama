<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import UsersForm from './UsersForm.vue'
import type { UserFormData } from '@/api/endpoints/user/types'

const { t } = useI18n()

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
  return props.mode === 'edit' ? t('users.edit_title') : t('users.add_new_title')
})

const dialogDescription = computed(() => {
  return props.mode === 'edit' 
    ? t('users.dialog.edit_description') 
    : t('users.dialog.add_description')
})

const submitButtonLabel = computed(() => {
  return props.mode === 'edit' ? t('users.form.update') : t('users.form.create')
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
          {{ t('users.form.cancel') }}
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
