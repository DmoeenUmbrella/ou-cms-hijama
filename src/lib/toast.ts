import { toast } from "vue-sonner"

export const Toast = {
  success(message: string, description?: string) {
    toast.success(message, { description })
  },

  error(message: string, description?: string) {
    toast.error(message, { description })
  },

  warning(message: string, description?: string) {
    toast.warning(message, { description })
  },

  info(message: string, description?: string) {
    toast(message, { description })
  },

  promise<T>(promise: Promise<T>, {
    loading = "Loading...",
    success = "Success!",
    error = "Something went wrong"
  }: {
    loading?: string
    success?: string | ((data: T) => string)
    error?: string | ((error: any) => string)
  }) {
    return toast.promise(promise, {
      loading,
      success,
      error,
    })
  }
}
