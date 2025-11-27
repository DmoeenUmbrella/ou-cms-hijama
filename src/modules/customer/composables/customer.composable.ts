import { computed } from 'vue'
import { useCustomerStore } from '../store/useCustomerStore'
import { getCustomerById } from '@/api/endpoints/customer/queries'

export function useCustomer() {
  const store = useCustomerStore()

  // Computed properties from store
  const currentCustomer = computed(() => store.currentCustomer)
  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)

  // Fetch customer details by ID
  const fetchCustomerDetails = async (id: string | number) => {
    try {
      store.setLoading(true)
      store.setError(null)

      const response = await getCustomerById(id)
      store.setCustomer(response.data)
      
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch customer details'
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  // Clear customer data
  const clearCustomerData = () => {
    store.clearCustomer()
  }

  return {
    // State
    currentCustomer,
    isLoading,
    error,

    // Actions
    fetchCustomerDetails,
    clearCustomerData,
  }
}
