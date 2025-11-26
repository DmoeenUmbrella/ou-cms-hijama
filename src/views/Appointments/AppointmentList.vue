<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppointmentsStore } from '@/stores/useAppointmentsStore.js'

import BaseButton from '@/components/base/BaseButton.vue'
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton.vue'
import SectionMain from '@/components/ui/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { mdiCalendarClock } from '@mdi/js'
import CardBox from '@/components/ui/CardBox.vue'
import AppointmentsTable from '@/components/appointments/AppointmentsTable.vue'
import AppointmentCalendar from '@/components/appointments/AppointmentCalendar.vue'
import CardBoxModal from '@/components/ui/CardBoxModal.vue'
import AppointmentForm from '@/components/appointments/AppointmentForm.vue'
import { useCustomersStore } from '@/stores/useCustomersStore'
import { useServicesStore } from '@/stores/useServicesStore'
import BaseButtons from '@/components/ui/BaseButtons.vue'
import FormFilePicker from '@/components/ui/FormFilePicker.vue'

const { t } = useI18n()
const appointmentsStore = useAppointmentsStore()
const customersStore = useCustomersStore()
const servicesStore = useServicesStore()

const isModalActive = ref(false)
const modalTitle = computed(() =>
    appointmentsStore.isAppointmentFormEditing ? t('appointment.edit_title') : t('appointment.create')
)

onMounted(() => {
    appointmentsStore.fetchAppointments()
})

// Handler for the "+ New Appointment" button
const openNewAppointmentModal = () => {
    appointmentsStore.resetAppointmentForm()
    isModalActive.value = true
}

// Handler for the "Edit" button in the table
const handleEditAppointment = (appointment) => {
    appointmentsStore.loadAppointmentForEdit(appointment)
    isModalActive.value = true
}

// Data source for dropdowns (UNCHANGED)
const clientOptions = computed(() =>
    customersStore.clients.map(c => ({ id: c.id, label: c.name }))
)
const serviceOptions = computed(() =>
    servicesStore.services.map(s => ({ id: s.id, label: s.name }))
)
const isEditing = computed(() => appointmentsStore.isAppointmentFormEditing);

const handleAppointmentModalSave = async () => {
    const form = appointmentsStore.formAppointment;

    // 1. Get descriptive labels based on the currently selected IDs in the form
    const clientName = clientOptions.value.find(c => c.id === form.client_id)?.label
    const serviceName = serviceOptions.value.find(s => s.id === form.service_id)?.label
    const durationLabel = appointmentsStore.durationOptions.find(d => d.id === form.duration)?.label

    const appointmentDetails = { clientName, serviceName, durationLabel }
    let validate = {}
    // 2. Call the appropriate store action (Update or Add)
    if (isEditing.value) {
        validate = await appointmentsStore.updateAppointment(appointmentDetails)
    } else {
        validate = await appointmentsStore.addAppointment(appointmentDetails)
    }

    if (validate || typeof validate == 'undefined') {
        closeModal();
    }
}
const closeModal = () => {
    appointmentsStore.resetAppointmentForm()
    isModalActive.value = false
}
</script>

<template>
    <LayoutAuthenticated>

        <CardBoxModal v-model="isModalActive" :title="t('appointment.new_title')" :buttonLabel="modalTitle"
            :large="true" @confirm="handleAppointmentModalSave" has-cancel @cancel="closeModal" persist>
            <AppointmentForm :isEditing="isEditing" />
        </CardBoxModal>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiCalendarClock" :title="t('appointment.title')" main>
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <FormFilePicker :label="t('button.import')" color="danger" />
                    <BaseButton :label="t('appointment.new_btn')" color="info" @click="openNewAppointmentModal" />
                </BaseButtons>
            </SectionTitleLineWithButton>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div class="lg:col-span-1">
                    <CardBox :title="t('appointment.select_date')"
                        bgClass="hover:bg-gray-100 transition-all duration-300 ease-in-out border shadow-md">
                        <AppointmentCalendar />
                    </CardBox>
                </div>

                <div class="lg:col-span-2">
                    <CardBox :title="t('appointment.list_title')" has-table>
                        <!-- CATCH THE EMITTED EVENT -->
                        <AppointmentsTable checkable @edit-appointment="handleEditAppointment" />
                    </CardBox>
                </div>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>