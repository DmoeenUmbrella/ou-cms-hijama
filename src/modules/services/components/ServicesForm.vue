<script setup lang="ts">
import { ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


interface ServiceFormData {
  name: string
  duration: number
  amount: number
  description: string
}

interface Props {
  initialData?: ServiceFormData | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  isEdit: false
})

const emit = defineEmits<{
  submit: [data: ServiceFormData]
}>()

// Form data
const formData = ref<ServiceFormData>({
  name: '',
  duration: 0,
  amount: 0,
  description: ''
})

// Watch for initialData changes to populate form in edit mode
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = { ...newData }
  } else {
    // Reset form when no initial data
    formData.value = {
      name: '',
      duration: 0,
      amount: 0,
      description: ''
    }
  }
}, { immediate: true })

// Form validation
const errors = ref<Partial<Record<keyof ServiceFormData, string>>>({})

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required'
    isValid = false
  }
  if (!formData.value.duration || formData.value.duration <= 0) {
    errors.value.duration = 'Duration is required'
    isValid = false
  }
  if (!formData.value.amount || formData.value.amount <= 0) {
    errors.value.amount = 'Amount is required'
    isValid = false
  }
  return isValid
}

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', formData.value)
  }
}

// Expose submit method for parent component
defineExpose({
  handleSubmit
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Name Field -->
    <div class="space-y-2">
      <Label for="name">
        Name <span class="text-red-500">*</span>
      </Label>
      <Input
        id="name"
        v-model="formData.name"
        type="text"
        placeholder="Enter service name"
        :class="{ 'border-red-500': errors.name }"
      />
      <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
    </div>

    <!-- Duration Field -->
    <div class="space-y-2">
      <Label for="duration">
        Duration (minutes) <span class="text-red-500">*</span>
      </Label>
      <Input
        id="duration"
        v-model.number="formData.duration"
        type="number"
        min="1"
        placeholder="Enter duration in minutes"
        :class="{ 'border-red-500': errors.duration }"
      />
      <p v-if="errors.duration" class="text-sm text-red-500">{{ errors.duration }}</p>
    </div>

    <!-- Amount Field -->
    <div class="space-y-2">
      <Label for="amount">
        Amount <span class="text-red-500">*</span>
      </Label>
      <Input
        id="amount"
        v-model.number="formData.amount"
        type="number"
        min="1"
        placeholder="Enter amount"
        :class="{ 'border-red-500': errors.amount }"
      />
      <p v-if="errors.amount" class="text-sm text-red-500">{{ errors.amount }}</p>
    </div>

    <!-- Description Field -->
    <div class="space-y-2">
      <Label for="description">Description</Label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="3"
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder="Enter service description"
      />
    </div>
  </form>
</template>
