<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import ServicesForm from './ServicesForm.vue'

interface ServiceFormData {
  name: string
  duration: number
  amount: number
  description: string
}

interface Props {
  open: boolean
  service?: ServiceFormData | null
  mode?: 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  service: null,
  mode: 'create'
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [data: ServiceFormData]
}>()

// Reference to the form component
const serviceFormRef = ref<InstanceType<typeof ServicesForm> | null>(null)

// Computed properties for dialog content
const dialogTitle = computed(() => {
  return props.mode === 'edit' ? 'Edit Service' : 'Add New Service'
})

const dialogDescription = computed(() => {
  return props.mode === 'edit' 
    ? 'Update service information below' 
    : 'Fill in the details to create a new service'
})

const submitButtonLabel = computed(() => {
  return props.mode === 'edit' ? 'Update Service' : 'Create Service'
})

// Handle dialog open/close
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

// Handle form submission
const handleSubmit = () => {
  // Trigger form validation and submission through the form's exposed method
  if (serviceFormRef.value) {
    serviceFormRef.value.handleSubmit()
  }
}

// Handle form data submission from child
const handleFormSubmit = (data: ServiceFormData) => {
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

      <!-- Service Form -->
      <div class="py-4">
        <ServicesForm 
          ref="serviceFormRef"
          :initial-data="service"
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
