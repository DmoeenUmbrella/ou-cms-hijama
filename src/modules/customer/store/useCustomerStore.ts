import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CustomerDetails } from '@/api/endpoints/customer/queries'

export const useCustomerStore = defineStore('customer', () => {
  // State
  const currentCustomer = ref<CustomerDetails | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  function setCustomer(customer: CustomerDetails) {
    currentCustomer.value = customer
  }

  function clearCustomer() {
    currentCustomer.value = null
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function resetState() {
    currentCustomer.value = null
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    currentCustomer,
    isLoading,
    error,
    
    // Actions
    setCustomer,
    clearCustomer,
    setLoading,
    setError,
    resetState,
  }
})
