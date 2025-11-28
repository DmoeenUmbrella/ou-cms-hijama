import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Technician } from '@/api/endpoints/technician/queries'

export const useTechnicianStore = defineStore('technician', () => {
  // State
  const technicians = ref<Technician[]>([])
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
  function setTechnicians(data: Technician[], total: number) {
    technicians.value = data
    totalCount.value = total
  }

  function addTechnician(technician: Technician) {
    technicians.value.unshift(technician)
    totalCount.value++
  }

  function updateTechnician(updatedTechnician: Technician) {
    const index = technicians.value.findIndex((t: Technician) => t.id === updatedTechnician.id)
    if (index !== -1) {
      technicians.value[index] = updatedTechnician
    }
  }

  function removeTechnician(id: number) {
    technicians.value = technicians.value.filter((t: Technician) => t.id !== id)
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
    technicians.value = []
    totalCount.value = 0
    currentPage.value = 1
    itemsPerPage.value = 10
    searchKeyword.value = ''
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    technicians,
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
    setTechnicians,
    addTechnician,
    updateTechnician,
    removeTechnician,
    setCurrentPage,
    setItemsPerPage,
    setSearchKeyword,
    setLoading,
    setError,
    resetState,
  }
})
