import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Service } from '@/api/endpoints/service/queries'

export const useServiceStore = defineStore('service', () => {
  // State
  const services = ref<Service[]>([])
  const totalCount = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const searchKeyword = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage.value))
  
  const paginationInfo = computed(() => ({
    currentPage: currentPage.value,
    itemsPerPage: itemsPerPage.value,
    totalPages: totalPages.value,
    totalCount: totalCount.value,
  }))

  // Actions
  function setServices(data: Service[], total: number) {
    services.value = data
    totalCount.value = total
  }

  function addService(service: Service) {
    services.value.unshift(service)
    totalCount.value++
  }

  function updateService(updatedService: Service) {
    const index = services.value.findIndex((s: Service) => s.id === updatedService.id)
    if (index !== -1) {
      services.value[index] = updatedService
    }
  }

  function removeService(id: number) {
    services.value = services.value.filter((s: Service) => s.id !== id)
    totalCount.value--
  }

  function setCurrentPage(page: number) {
    currentPage.value = page
  }

  function setItemsPerPage(count: number) {
    itemsPerPage.value = count
    currentPage.value = 1 // Reset to first page when changing items per page
  }

  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
    currentPage.value = 1 // Reset to first page when searching
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function resetState() {
    services.value = []
    totalCount.value = 0
    currentPage.value = 1
    itemsPerPage.value = 10
    searchKeyword.value = ''
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    services,
    totalCount,
    currentPage,
    itemsPerPage,
    searchKeyword,
    isLoading,
    error,
    
    // Getters
    totalPages,
    paginationInfo,
    
    // Actions
    setServices,
    addService,
    updateService,
    removeService,
    setCurrentPage,
    setItemsPerPage,
    setSearchKeyword,
    setLoading,
    setError,
    resetState,
  }
})
