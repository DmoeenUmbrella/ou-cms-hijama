import { computed } from 'vue'
import { useTechnicianStore } from '../stores/technicianStore'
import { getTechnicians } from '@/api/endpoints/technician/queries'
import { createTechnician, updateTechnician, deleteTechnician } from '@/api/endpoints/technician/mutations'
import type { CreateTechnicianPayload, UpdateTechnicianPayload } from '@/api/endpoints/technician/mutations'

export function useTechnician() {
  const store = useTechnicianStore()

  // Computed properties from store
  const technicians = computed(() => store.technicians)
  const paginationInfo = computed(() => store.paginationInfo)
  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)

  // Fetch technicians
  const fetchTechnicians = async (params?: { page?: number; count?: number; keyword?: string }) => {
    try {
      store.setLoading(true)
      store.setError(null)

      const page = params?.page ?? store.currentPage
      const count = params?.count ?? store.itemsPerPage
      const keyword = params?.keyword ?? store.searchKeyword

      const response = await getTechnicians({ page, count, keyword })
      
      store.setTechnicians(response.data, response.totalCount)
      
      if (params?.page) {
        store.setCurrentPage(params.page)
      }
      
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch technicians'
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  // Create technician
  const addTechnician = async (payload: CreateTechnicianPayload) => {
    try {
      store.setLoading(true)
      store.setError(null)

      const response = await createTechnician(payload)
      store.addTechnician(response.data)
      
      // Optionally refetch to ensure consistency
      await fetchTechnicians()
      
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create technician'
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  // Update technician
  const editTechnician = async (payload: UpdateTechnicianPayload) => {
    try {
      store.setLoading(true)
      store.setError(null)

      const response = await updateTechnician(payload)
      store.updateTechnician(response.data)
      
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update technician'
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  // Delete technician
  const removeTechnician = async (id: number) => {
    try {
      store.setLoading(true)
      store.setError(null)

      await deleteTechnician(id)
      store.removeTechnician(id)
      
      // If current page is empty after delete, go to previous page
      if (store.technicians.length === 0 && store.currentPage > 1) {
        await goToPage(store.currentPage - 1)
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete technician'
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  // Pagination helper
  const goToPage = async (page: number) => {
    if (page >= 1 && page <= store.totalPages) {
      await fetchTechnicians({ page, count: store.itemsPerPage, keyword: store.searchKeyword })
    }
  }

  // Change items per page
  const changeItemsPerPage = async (count: number) => {
    store.setItemsPerPage(count)
    await fetchTechnicians({ page: 1, count, keyword: store.searchKeyword })
  }

  // Search technicians
  const searchTechnicians = async (keyword: string) => {
    store.setSearchKeyword(keyword)
    await fetchTechnicians({ page: 1, count: store.itemsPerPage, keyword })
  }

  return {
    // State
    technicians,
    paginationInfo,
    isLoading,
    error,

    // Actions
    fetchTechnicians,
    addTechnician,
    editTechnician,
    removeTechnician,
    goToPage,
    changeItemsPerPage,
    searchTechnicians,
  }
}
