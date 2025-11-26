<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSessionsStore } from '@/stores/useSessionsStore.js'

import BaseButton from '@/components/base/BaseButton.vue'
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton.vue'
import SectionMain from '@/components/ui/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { mdiCalendarClock } from '@mdi/js'
import CardBox from '@/components/ui/CardBox.vue'
import SessionsTable from '@/components/sessions/SessionsTable.vue'
import SessionsCalendar from '@/components/sessions/SessionsCalendar.vue'
import CardBoxModal from '@/components/ui/CardBoxModal.vue'
import SessionForm from '@/components/sessions/SessionForm.vue'
import { useCustomersStore } from '@/stores/useCustomersStore'
import { useServicesStore } from '@/stores/useServicesStore'
import BaseButtons from '@/components/ui/BaseButtons.vue'
import FormFilePicker from '@/components/ui/FormFilePicker.vue'

const { t } = useI18n()
const sessionsStore = useSessionsStore()
const customersStore = useCustomersStore()
const servicesStore = useServicesStore()

const isModalActive = ref(false)
const modalTitle = computed(() =>
    sessionsStore.isSessionFormEditing ? t('session.edit_title') : t('session.create')
)

onMounted(() => {
    sessionsStore.fetchSessions()
})

// Handler for the "+ New Appointment" button
const openNewAppointmentModal = () => {
    sessionsStore.resetSessionForm()
    isModalActive.value = true
}

// Handler for the "Edit" button in the table
const handleEditAppointment = (session) => {
    sessionsStore.loadAppointmentForEdit(session)
    isModalActive.value = true
}

// Data source for dropdowns (UNCHANGED)
const clientOptions = computed(() =>
    customersStore.clients.map(c => ({ id: c.id, label: c.name }))
)
const serviceOptions = computed(() =>
    servicesStore.services.map(s => ({ id: s.id, label: s.name }))
)
const isEditing = computed(() => sessionsStore.isSessionFormEditing);

const handleAppointmentModalSave = async () => {
    const form = sessionsStore.formAppointment;

    // 1. Get descriptive labels based on the currently selected IDs in the form
    const clientName = clientOptions.value.find(c => c.id === form.client_id)?.label
    const serviceName = serviceOptions.value.find(s => s.id === form.service_id)?.label
    const durationLabel = sessionsStore.durationOptions.find(d => d.id === form.duration)?.label

    const sessionDetails = { clientName, serviceName, durationLabel }
    let validate = {}
    // 2. Call the appropriate store action (Update or Add)
    if (isEditing.value) {
        validate = await sessionsStore.updateAppointment(sessionDetails)
    } else {
        validate = await sessionsStore.addAppointment(sessionDetails)
    }

    if (validate || typeof validate == 'undefined') {
        closeModal();
    }
}
const closeModal = () => {
    sessionsStore.resetSessionForm()
    isModalActive.value = false
}
</script>

<template>
    <LayoutAuthenticated>

        <CardBoxModal v-model="isModalActive" :title="t('session.new_title')" :buttonLabel="modalTitle" :large="true"
            @confirm="handleAppointmentModalSave" has-cancel @cancel="closeModal" persist>
            <SessionForm :isEditing="isEditing" />
        </CardBoxModal>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiCalendarClock" :title="t('session.title')" main>
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <FormFilePicker :label="t('button.import')" color="danger" />
                    <BaseButton :label="t('session.new_btn')" color="info" @click="openNewAppointmentModal" />
                </BaseButtons>
            </SectionTitleLineWithButton>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div class="lg:col-span-1">
                    <CardBox :title="t('session.select_date')"
                        bgClass="hover:bg-gray-100 transition-all duration-300 ease-in-out border shadow-md">
                        <SessionsCalendar />
                    </CardBox>
                </div>

                <div class="lg:col-span-2">
                    <CardBox :title="t('session.list_title')" has-table>
                        <!-- CATCH THE EMITTED EVENT -->
                        <SessionsTable checkable @edit-session="handleEditAppointment" />
                    </CardBox>
                </div>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>