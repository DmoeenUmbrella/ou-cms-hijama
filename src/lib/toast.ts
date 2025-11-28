import { toast } from "vue-sonner"

export const notifySuccess = (message: string) => {
  toast.success(message)
}

export const notifyError = (message: string) => {
  toast.error(message)
}

export const notifyWarning = (message: string) => {
  toast(message)
}

export const notifyPromise = <T>(promise: Promise<T>, messages: { loading: string; success: string; error: string }) => {
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  })

  return promise
}

// Export Toast object for backward compatibility
export const Toast = {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  promise: notifyPromise,
}