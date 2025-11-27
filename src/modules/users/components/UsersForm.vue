<script setup lang="ts">
import { ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  initialData?: UserFormData | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  isEdit: false
})

const emit = defineEmits<{
  submit: [data: UserFormData]
}>()

// Form data
const formData = ref<UserFormData>({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  clinicId: '1',
  profileUrl: '',
  password: ''
})

// Watch for initialData changes to populate form in edit mode
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = { 
      id: newData.id,
      firstName: newData.firstName,
      lastName: newData.lastName,
      email: newData.email || '',
      phoneNumber: newData.phoneNumber,
      clinicId: newData.clinicId,
      profileUrl: newData.profileUrl || ''
    }
  } else {
    // Reset form when no initial data
    formData.value = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      clinicId: '1',
      profileUrl: '',
      password: ''
    }
  }
}, { immediate: true })

// Form validation
const errors = ref<Partial<Record<keyof UserFormData, string>>>({})

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.firstName.trim()) {
    errors.value.firstName = 'First name is required'
    isValid = false
  }

  if (!formData.value.lastName.trim()) {
    errors.value.lastName = 'Last name is required'
    isValid = false
  }

  if (!props.isEdit) {
    if (!formData.value.email.trim()) {
      errors.value.email = 'Email is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
      errors.value.email = 'Invalid email format'
      isValid = false
    }

    if (!formData.value.password || formData.value.password.trim().length < 6) {
      errors.value.password = 'Password must be at least 6 characters'
      isValid = false
    }
  }

  if (!formData.value.phoneNumber.trim()) {
    errors.value.phoneNumber = 'Phone number is required'
    isValid = false
  }

  return isValid
}

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    const submitData = { ...formData.value }
    // Remove password field if editing
    if (props.isEdit) {
      delete submitData.password
    }
    emit('submit', submitData)
  }
}

// Expose submit method for parent component
defineExpose({
  handleSubmit
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <!-- First Name Field -->
      <div class="space-y-2">
        <Label for="firstName">
          First Name <span class="text-red-500">*</span>
        </Label>
        <Input
          id="firstName"
          v-model="formData.firstName"
          type="text"
          placeholder="Enter first name"
          :class="{ 'border-red-500': errors.firstName }"
        />
        <p v-if="errors.firstName" class="text-sm text-red-500">{{ errors.firstName }}</p>
      </div>

      <!-- Last Name Field -->
      <div class="space-y-2">
        <Label for="lastName">
          Last Name <span class="text-red-500">*</span>
        </Label>
        <Input
          id="lastName"
          v-model="formData.lastName"
          type="text"
          placeholder="Enter last name"
          :class="{ 'border-red-500': errors.lastName }"
        />
        <p v-if="errors.lastName" class="text-sm text-red-500">{{ errors.lastName }}</p>
      </div>
    </div>

    <!-- Email Field (only for create) -->
    <div v-if="!isEdit" class="space-y-2">
      <Label for="email">
        Email <span class="text-red-500">*</span>
      </Label>
      <Input
        id="email"
        v-model="formData.email"
        type="email"
        placeholder="Enter email address"
        :class="{ 'border-red-500': errors.email }"
      />
      <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
    </div>

    <!-- Password Field (only for create) -->
    <div v-if="!isEdit" class="space-y-2">
      <Label for="password">
        Password <span class="text-red-500">*</span>
      </Label>
      <Input
        id="password"
        v-model="formData.password"
        type="password"
        placeholder="Enter password (min. 6 characters)"
        :class="{ 'border-red-500': errors.password }"
      />
      <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
    </div>

    <!-- Phone Number Field -->
    <div class="space-y-2">
      <Label for="phoneNumber">
        Phone Number <span class="text-red-500">*</span>
      </Label>
      <Input
        id="phoneNumber"
        v-model="formData.phoneNumber"
        type="tel"
        placeholder="Enter phone number"
        :class="{ 'border-red-500': errors.phoneNumber }"
      />
      <p v-if="errors.phoneNumber" class="text-sm text-red-500">{{ errors.phoneNumber }}</p>
    </div>

    <!-- Clinic ID Field -->
    <div class="space-y-2">
      <Label for="clinicId">Clinic ID</Label>
      <Input
        id="clinicId"
        v-model="formData.clinicId"
        type="text"
        placeholder="Enter clinic ID"
      />
    </div>

    <!-- Profile URL Field -->
    <div class="space-y-2">
      <Label for="profileUrl">Profile URL</Label>
      <Input
        id="profileUrl"
        v-model="formData.profileUrl"
        type="url"
        placeholder="Enter profile URL"
      />
    </div>
  </form>
</template>
