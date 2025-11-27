import { computed } from 'vue'
import { useServiceStore } from '../stores/serviceStore'
import { getServices } from '@/api/endpoints/service/queries'
import { createService, updateService, deleteService } from '@/api/endpoints/service/mutations'
import type { CreateServicePayload, UpdateServicePayload } from '@/api/endpoints/service/mutations'

export function useService() {
  const store = useServiceStore()

  // Computed properties from store
  const services = computed(() => store.services)
  const paginationInfo = computed(() => store.paginationInfo)
  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)

  // Fetch services
  const fetchServices = async (params?: { page?: number; count?: number; keyword?: string }) => {
    try {
      store.setLoading(true)
      store.setError(null)

      const page = params?.page ?? store.currentPage
      const count = params?.count ?? store.itemsPerPage
      const keyword = params?.keyword ?? store.searchKeyword

      const response = await getServices({ page, count, keyword })
      
      store.setServices(response.data, response.totalCount)
      
      if (params?.page) {
        store.setCurrentPage(params.page)
      }
      
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch services'
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  // Create service
  const addService = async (payload: CreateServicePayload) => {
    try {
      store.setLoading(true)
      store.setError(null)

      const response = await createService(payload)
      store.addService(response.data)
      
      // Optionally refetch to ensure consistency
      await fetchServices()
      
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create service'
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  // Update service
  const editService = async (payload: UpdateServicePayload) => {
    try {
      store.setLoading(true)
      store.setError(null)

      const response = await updateService(payload)
      store.updateService(response.data)
      
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update service'
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  // Delete service
  const removeService = async (id: number) => {
    try {
      store.setLoading(true)
      store.setError(null)

      await deleteService(id)
      store.removeService(id)
      
      // If current page is empty after delete, go to previous page
      if (store.services.length === 0 && store.currentPage > 1) {
        await goToPage(store.currentPage - 1)
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete service'
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  // Pagination helper
  const goToPage = async (page: number) => {
    if (page >= 1 && page <= store.totalPages) {
      await fetchServices({ page, count: store.itemsPerPage, keyword: store.searchKeyword })
    }
  }

  // Change items per page
  const changeItemsPerPage = async (count: number) => {
    store.setItemsPerPage(count)
    await fetchServices({ page: 1, count, keyword: store.searchKeyword })
  }

  // Search services
  const searchServices = async (keyword: string) => {
    store.setSearchKeyword(keyword)
    await fetchServices({ page: 1, count: store.itemsPerPage, keyword })
  }

  return {
    // State
    services,
    paginationInfo,
    isLoading,
    error,

    // Actions
    fetchServices,
    addService,
    editService,
    removeService,
    goToPage,
    changeItemsPerPage,
    searchServices,
  }
}
