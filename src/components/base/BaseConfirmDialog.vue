<template>
  <Dialog v-model:open="store.isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogDescription>{{ store.message }}</DialogDescription>
      </DialogHeader>

      <div class="flex justify-end gap-3 mt-4">
        <Button variant="secondary" @click="store.cancel()">Cancel</Button>
        <Button variant="destructive" @click="store.accept()">Confirm</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useConfirmDialogStore } from "@/stores/confirmDialogStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const store = useConfirmDialogStore()
</script>