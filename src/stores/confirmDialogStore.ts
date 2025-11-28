import { defineStore } from "pinia"
import { ref } from "vue"

export const useConfirmDialogStore = defineStore("confirmDialog", () => {
  const isOpen = ref(false)
  const message = ref("")
  let resolveFn: ((value: boolean) => void) | null = null

  function confirm(msg: string): Promise<boolean> {
    message.value = msg
    isOpen.value = true

    return new Promise((resolve) => {
      resolveFn = resolve
    })
  }

  function accept() {
    isOpen.value = false
    resolveFn?.(true)
  }

  function cancel() {
    isOpen.value = false
    resolveFn?.(false)
  }

  return { isOpen, message, confirm, accept, cancel }
})