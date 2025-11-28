<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

interface TechnicianFormData {
  id?: number
  name: string
}

const props = defineProps<{
  technician?: TechnicianFormData | null
  mode: 'create' | 'edit'
}>()

const emit = defineEmits(['submit', 'cancel'])

// Form state
const formData = ref<TechnicianFormData>({
  name: ''
})

// Watch for changes in technician prop (for edit mode)
watch(() => props.technician, (newTechnician) => {
  if (newTechnician) {
    formData.value = {
      id: newTechnician.id,
      name: newTechnician.name
    }
  } else {
    formData.value = {
      name: ''
    }
  }
}, { immediate: true })

// Form validation
const isFormValid = () => {
  return formData.value.name.trim().length > 0
}

// Submit handler
const handleSubmit = () => {
  if (isFormValid()) {
    emit('submit', formData.value)
  }
}

// Cancel handler
const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Name Field -->
    <div class="space-y-2">
      <Label for="name">{{ t('technicians.form.name_label') }} *</Label>
      <Input
        id="name"
        v-model="formData.name"
        type="text"
        :placeholder="t('technicians.form.name_placeholder')"
        required
      />
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" @click="handleCancel">
        {{ t('technicians.form.cancel') }}
      </Button>
      <Button type="submit" :disabled="!isFormValid()">
        {{ mode === 'create' ? t('technicians.form.add') : t('technicians.form.update') }}
      </Button>
    </div>
  </form>
</template>
