import { computed } from 'vue'
import { useCustomerStore } from '../store/useCustomerStore'
import { getCustomerById, getCustomerAppointments } from '@/api/endpoints/customer/queries'

export function useCustomer() {
  const store = useCustomerStore()

  // Computed properties from store
  const currentCustomer = computed(() => store.currentCustomer)
  const appointments = computed(() => store.appointments)
  const isLoading = computed(() => store.isLoading)
  const isLoadingAppointments = computed(() => store.isLoadingAppointments)
  const error = computed(() => store.error)
  const currentPage = computed(() => store.currentPage)
  const itemsPerPage = computed(() => store.itemsPerPage)

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

  // Fetch customer appointments with pagination
  const fetchCustomerAppointments = async (clientId: string | number, page?: number, count?: number) => {
    try {
      store.setLoadingAppointments(true)
      store.setError(null)

      const currentPageValue = page || store.currentPage
      const currentCountValue = count || store.itemsPerPage

      const response = await getCustomerAppointments({
        clientId,
        page: currentPageValue,
        count: currentCountValue
      })
      
      store.setAppointments(response.data)
      if (page) store.setPage(page)
      if (count) store.setItemsPerPage(count)
      
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch appointments'
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoadingAppointments(false)
    }
  }

  // Go to specific page
  const goToPage = async (clientId: string | number, page: number) => {
    await fetchCustomerAppointments(clientId, page, store.itemsPerPage)
  }

  // Clear customer data
  const clearCustomerData = () => {
    store.clearCustomer()
    store.clearAppointments()
  }

  return {
    // State
    currentCustomer,
    appointments,
    isLoading,
    isLoadingAppointments,
    error,
    currentPage,
    itemsPerPage,

    // Actions
    fetchCustomerDetails,
    fetchCustomerAppointments,
    goToPage,
    clearCustomerData,
  }
}
