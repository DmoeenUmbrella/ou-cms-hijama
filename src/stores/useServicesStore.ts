import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios' // Import axios
import { validateForm } from "@/utils/helpers/validate";
import { useI18n } from 'vue-i18n'

const validationSchema = {
    name: {
        type: 'string',
        validate: '> 2'
    },
    duration_minutes: {
        type: 'number',
        validate: '> 0'
    },
    price_aed: {
        type: 'number',
        validate: '> 0'
    },
}

export const useServicesStore = defineStore('services', () => {

    // State - services is now empty by default, waiting for API call
    const services = ref([])

    // Reactive state for the form
    const formService = ref({
        id: null,
        name: '',
        duration_minutes: 30,
        price_aed: 0,
        description: "",
    })

    const isServiceFormEditing = computed(() => !!formService.value.id)

    const validate = ref({})

    const totalServices = computed(() => services.value.length)

    // Actions
    async function addService(newService) {
        const id = crypto.randomUUID()
        validate.value = validateForm(newService, validationSchema);
        if (validate.value.isValid) {
            services.value.unshift({ id, ...newService })
        }
        return validate.value.isValid
    }

    function updateService(updatedService) {
        validate.value = validateForm(updatedService, validationSchema);
        const index = services.value.findIndex(s => s.id === updatedService.id)
        if (validate.value.isValid && index !== -1) {
            services.value[index] = updatedService
        }
        return validate.value.isValid
    }

    function deleteService(serviceId) {
        services.value = services.value.filter(s => s.id !== serviceId)
    }

    function fetchServices() {
        // Fetch services from the JSON file
        axios
            .get(`data-sources/services.json?v=1`)
            .then((result) => {
                services.value = result?.data?.data
            })
            .catch((error) => {
                console.error('Error fetching services:', error)
            })
    }

    function resetServiceForm() {
        // Resets the form state to default/initial values
        resetValidation();
        formService.value = {
            id: null,
            name: '',
            duration_minutes: 30,
            price_aed: 0,
            description: "",
        }
    }

    // **REQUIRED NEW ACTION for edit flow**
    function loadServiceForEdit(service) {
        // Populate the form with data from the selected table row
        formService.value = JSON.parse(JSON.stringify(service))
    }

    function resetValidation() {
        validate.value = {}
    }
    return {
        services,
        totalServices,
        addService,
        updateService,
        deleteService,
        fetchServices,
        formService,
        isServiceFormEditing,
        resetServiceForm,
        loadServiceForEdit,
        validate,
        resetValidation
    }
})