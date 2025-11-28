<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { Switch } from '@/components/ui/switch'
import type { UserFormData } from '@/api/endpoints/user/types'

const { t } = useI18n()

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
  clinicName: '',
  profileUrl: '',
  password: '',
  isAdmin: false
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
      clinicName: newData.clinicName || '',
      profileUrl: newData.profileUrl || '',
      isAdmin: newData.isAdmin || false
    }
  } else {
    // Reset form when no initial data
    formData.value = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      clinicName: '',
      profileUrl: '',
      password: '',
      isAdmin: false
    }
  }
}, { immediate: true })

// Form validation
const errors = ref<Partial<Record<keyof UserFormData, string>>>({})

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.firstName.trim()) {
    errors.value.firstName = t('users.form.firstName_required')
    isValid = false
  }

  if (!formData.value.lastName.trim()) {
    errors.value.lastName = t('users.form.lastName_required')
    isValid = false
  }

  if (!props.isEdit) {
    if (!formData.value.email.trim()) {
      errors.value.email = t('users.form.email_required')
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
      errors.value.email = t('users.form.email_invalid')
      isValid = false
    }

    if (!formData.value.password || formData.value.password.trim().length < 6) {
      errors.value.password = t('users.form.password_required')
      isValid = false
    }
  }

  if (!formData.value.phoneNumber.trim()) {
    errors.value.phoneNumber = t('users.form.phone_required')
    isValid = false
  }

  // Validate clinic name for admin users (only on create)
  if (!props.isEdit && formData.value.isAdmin && !formData.value.clinicName?.trim()) {
    errors.value.clinicName = t('users.form.clinicName_required')
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
    <!-- User Type Toggle (only for create) -->
    <!-- <div v-if="!isEdit" class="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
      <div class="space-y-0.5">
        <Label class="text-base">{{ t('users.form.userType_label') }}</Label>
        <p class="text-sm text-muted-foreground">
          {{ formData.isAdmin ? t('users.form.userType_admin_description') : t('users.form.userType_user_description') }}
        </p>
      </div>
      <Switch 
        :checked="formData.isAdmin"
        @update:checked="(value: boolean) => formData.isAdmin = value"
      />
    </div> -->

    <div class="grid grid-cols-2 gap-4">
      <!-- First Name Field -->
      <div class="space-y-2">
        <Label for="firstName">
          {{ t('users.form.firstName_label') }} <span class="text-red-500">*</span>
        </Label>
        <Input
          id="firstName"
          v-model="formData.firstName"
          type="text"
          :placeholder="t('users.form.firstName_placeholder')"
          :class="{ 'border-red-500': errors.firstName }"
        />
        <p v-if="errors.firstName" class="text-sm text-red-500">{{ errors.firstName }}</p>
      </div>

      <!-- Last Name Field -->
      <div class="space-y-2">
        <Label for="lastName">
          {{ t('users.form.lastName_label') }} <span class="text-red-500">*</span>
        </Label>
        <Input
          id="lastName"
          v-model="formData.lastName"
          type="text"
          :placeholder="t('users.form.lastName_placeholder')"
          :class="{ 'border-red-500': errors.lastName }"
        />
        <p v-if="errors.lastName" class="text-sm text-red-500">{{ errors.lastName }}</p>
      </div>
    </div>

    <!-- Email Field (only for create) -->
    <div v-if="!isEdit" class="space-y-2">
      <Label for="email">
        {{ t('users.form.email_label') }} <span class="text-red-500">*</span>
      </Label>
      <Input
        id="email"
        v-model="formData.email"
        type="email"
        :placeholder="t('users.form.email_placeholder')"
        :class="{ 'border-red-500': errors.email }"
      />
      <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
    </div>

    <!-- Password Field (only for create) -->
    <div v-if="!isEdit" class="space-y-2">
      <Label for="password">
        {{ t('users.form.password_label') }} <span class="text-red-500">*</span>
      </Label>
      <Input
        id="password"
        v-model="formData.password"
        type="password"
        :placeholder="t('users.form.password_placeholder')"
        :class="{ 'border-red-500': errors.password }"
      />
      <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
    </div>

    <!-- Phone Number Field -->
    <div class="space-y-2">
      <Label for="phoneNumber">
        {{ t('users.form.phone_label') }} <span class="text-red-500">*</span>
      </Label>
      <Input
        id="phoneNumber"
        v-model="formData.phoneNumber"
        type="tel"
        :placeholder="t('users.form.phone_placeholder')"
        :class="{ 'border-red-500': errors.phoneNumber }"
      />
      <p v-if="errors.phoneNumber" class="text-sm text-red-500">{{ errors.phoneNumber }}</p>
    </div>

    <!-- Clinic Name Field (only for admin on create) -->
    <div v-if="!isEdit && formData.isAdmin" class="space-y-2">
      <Label for="clinicName">
        {{ t('users.form.clinicName_label') }} <span class="text-red-500">*</span>
      </Label>
      <Input
        id="clinicName"
        v-model="formData.clinicName"
        type="text"
        :placeholder="t('users.form.clinicName_placeholder')"
        :class="{ 'border-red-500': errors.clinicName }"
      />
      <p v-if="errors.clinicName" class="text-sm text-red-500">{{ errors.clinicName }}</p>
    </div>

    <!-- Profile URL Field -->
    <div class="space-y-2">
      <Label for="profileUrl">{{ t('users.form.profileUrl_label') }}</Label>
      <Input
        id="profileUrl"
        v-model="formData.profileUrl"
        type="url"
        :placeholder="t('users.form.profileUrl_placeholder')"
      />
    </div>
  </form>
</template>
