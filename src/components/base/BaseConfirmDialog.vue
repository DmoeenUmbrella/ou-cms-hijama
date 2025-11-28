<template>
  <Dialog v-model:open="store.isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ t('dialog.confirm_title') }}</DialogTitle>
        <DialogDescription>{{ store.message }}</DialogDescription>
      </DialogHeader>

      <div class="flex justify-end gap-3 mt-4">
        <Button variant="secondary" @click="store.cancel()">
          {{ t('dialog.cancel') }}
        </Button>
        <Button variant="destructive" @click="store.accept()">
          {{ t('dialog.confirm') }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfirmDialogStore } from "@/stores/confirmDialogStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const { t } = useI18n()
const store = useConfirmDialogStore()
</script>