import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CustomerDetails, AppointmentsData, FollowUpsResponse } from '@/api/endpoints/customer/queries'

export const useCustomerStore = defineStore('customer', () => {
  // State
  const currentCustomer = ref<CustomerDetails | null>(null)
  const appointments = ref<AppointmentsData | null>(null)
  const followUps = ref<FollowUpsResponse['data'] | null>(null)
  const isLoading = ref(false)
  const isLoadingAppointments = ref(false)
  const isLoadingFollowUps = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Actions
  function setCustomer(customer: CustomerDetails) {
    currentCustomer.value = customer
  }

  function clearCustomer() {
    currentCustomer.value = null
  }

  function setAppointments(data: AppointmentsData) {
    appointments.value = data
  }

  function clearAppointments() {
    appointments.value = null
    currentPage.value = 1
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setLoadingAppointments(loading: boolean) {
    isLoadingAppointments.value = loading
  }

  function setFollowUps(data: FollowUpsResponse['data']) {
    followUps.value = data
  }

  function clearFollowUps() {
    followUps.value = null
  }

  function setLoadingFollowUps(loading: boolean) {
    isLoadingFollowUps.value = loading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function setItemsPerPage(count: number) {
    itemsPerPage.value = count
  }

  function resetState() {
    currentCustomer.value = null
    appointments.value = null
    followUps.value = null
    isLoading.value = false
    isLoadingAppointments.value = false
    isLoadingFollowUps.value = false
    error.value = null
    currentPage.value = 1
    itemsPerPage.value = 10
  }

  return {
    // State
    currentCustomer,
    appointments,
    followUps,
    isLoading,
    isLoadingAppointments,
    isLoadingFollowUps,
    error,
    currentPage,
    itemsPerPage,
    
    // Actions
    setCustomer,
    clearCustomer,
    setAppointments,
    clearAppointments,
    setFollowUps,
    clearFollowUps,
    setLoading,
    setLoadingAppointments,
    setLoadingFollowUps,
    setError,
    setPage,
    setItemsPerPage,
    resetState,
  }
})
