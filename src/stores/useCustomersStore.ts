import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { validateForm } from "@/utils/helpers/validate";

const validationSchema = {
    name: {
        type: 'string',
        validate: 'required'
    },
    phone: {
        type: 'string',
        validate: '> 8'
    },
}

export const useCustomersStore = defineStore('customers', () => {

    // --- State ---
    const clients = ref([])
    const selectedClient = ref(null)

    // Reactive state for the Customer Form
    const formCustomer = ref({
        id: null,
        name: '',
        phone: '',
        gender: 'Male', // Default
        cups: 0,
        amount: 0,
        paymentMethod: 'Cash',
        cupperName: '',
        notes: '',
        reminder: '',
    })

    // --- Getters ---
    const isCustomerFormEditing = computed(() => !!formCustomer.value.id)
    const validate = ref({})

    // --- Actions ---
    function fetchClients() {
        axios.get(`/data-sources/clients.json?v=3`)
            .then((result) => {
                clients.value = result?.data?.data
            })
            .catch((error) => {
                console.error('Error fetching clients:', error)
            })
    }

    function fetchClientDetails(clientId) {
        const findAndSetClient = () => {
            const client = clients.value.find(c => c.id === clientId)
            if (client) selectedClient.value = client
        }

        if (clients.value.length > 0) {
            findAndSetClient()
        } else {
            axios.get(`/data-sources/clients.json?v=3`)
                .then((result) => {
                    clients.value = result?.data?.data
                    findAndSetClient()
                })
                .catch(err => console.error(err))
        }
    }

    function resetCustomerForm() {
        formCustomer.value = {
            id: null,
            name: '',
            phone: '',
            gender: 'Male',
            cups: 0,
            amount: 0,
            paymentMethod: 'Cash',
            cupperName: '',
            notes: '',
            reminder: '',
        }
        resetValidation()
    }

    async function saveCustomer() {
        const data = formCustomer.value

        const validateTemp = validateForm(data, validationSchema);
        validate.value = validateTemp
        if (validate.value.isValid) {

            // Simulate saving
            if (data.id) {
                // Update logic (find and replace)
                const index = clients.value.findIndex(c => c.id === data.id)
                if (index !== -1) {
                    clients.value[index] = { ...data }
                }
            } else {
                // Create logic
                const id = clients.value.length > 0 ? Math.max(...clients.value.map(c => c.id)) + 1 : 1
                clients.value.unshift({
                    ...data,
                    id,
                    total_sessions: 0,
                    total_spent_aed: 0,
                    session_history: []
                })
            }
            console.log('Customer saved:', data)
            resetCustomerForm()
        }
        return validateTemp.isValid;

    }
    function resetValidation() {
        validate.value = {}
    }
    return {
        clients,
        selectedClient,
        formCustomer,
        isCustomerFormEditing,
        fetchClients,
        fetchClientDetails,
        resetCustomerForm,
        saveCustomer,
        validate,
        resetValidation
    }
})