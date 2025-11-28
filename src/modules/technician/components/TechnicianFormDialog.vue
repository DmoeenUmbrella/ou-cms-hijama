<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TechnicianForm from './TechnicianForm.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const { t } = useI18n()

interface TechnicianFormData {
  id?: number
  name: string
}

const props = defineProps<{
  open: boolean
  technician?: TechnicianFormData | null
  mode: 'create' | 'edit'
}>()

const emit = defineEmits(['update:open', 'submit'])

// Computed for dialog title and description
const dialogTitle = computed(() => {
  return props.mode === 'create' ? t('technicians.dialog.add_title') : t('technicians.dialog.edit_title')
})

const dialogDescription = computed(() => {
  return props.mode === 'create' 
    ? t('technicians.dialog.add_description') 
    : t('technicians.dialog.edit_description')
})

// Handle form submission
const handleSubmit = (data: TechnicianFormData) => {
  emit('submit', data)
}

// Handle cancel
const handleCancel = () => {
  emit('update:open', false)
}

// Handle dialog open state change
const handleOpenChange = (open: boolean) => {
  emit('update:open', open)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>
          {{ dialogDescription }}
        </DialogDescription>
      </DialogHeader>
      <TechnicianForm
        :technician="technician"
        :mode="mode"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </DialogContent>
  </Dialog>
</template>
