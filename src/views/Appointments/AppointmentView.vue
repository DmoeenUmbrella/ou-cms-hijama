<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppointmentsStore } from '@/modules/appointment/stores/useAppointmentsStore'
import { useCustomersStore } from '@/stores/useCustomersStore'
import { useServicesStore } from '@/stores/useServicesStore'
import { useAppointmentView } from '@/modules/appointment/composables/appointments.composable' // Import the View Composable

// Icons
import { Calendar as CalendarIcon, FileUp, Trash2 } from 'lucide-vue-next'

// Layout & Components
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import AppointmentsTable from '@/modules/appointment/components/AppointmentsTable.vue'
// import AppointmentCalendar from '@/components/appointments/AppointmentCalendar.vue'
import AppointmentForm from '@/modules/appointment/components/AppointmentForm.vue'

// Shadcn UI
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator' // Assuming Separator is installed
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import AppointmentCalendar from '@/modules/appointment/components/AppointmentCalendar.vue'
import SessionForm from '@/modules/appointment/components/SessionForm.vue'
import FollowUpForm from '@/modules/appointment/components/FollowUpForm.vue'

// Use the Composable for View Logic
const {
    isModalActive, // Patient Registration Modal (Multi-step)
    isSessionModalActive, // Existing Patient Session Modal
    isFollowUpModalActive,
    isDeleteModalActive,
    patientContext, // Patient data passed to Session Form
    appointmentToDelete,
    isEditing,
    modalTitle,
    openNewAppointmentModal,
    handleEditAppointment,
    handleDeleteConfirmation,
    handleDeleteAppointment,
    handleFormSubmitSuccess,
    closeModal,
    handleCreateSession,
    handleCreateFollowUp,
} = useAppointmentView()

const appointmentsStore = useAppointmentsStore()
const customersStore = useCustomersStore()
const servicesStore = useServicesStore()
const { t } = useI18n()


onMounted(() => {
    // Pre-load necessary data for the view
    appointmentsStore.fetchPatients()
    customersStore.fetchClients()
    servicesStore.fetchServices()
})
</script>

<template>
    <LayoutAuthenticated>

        <!-- 1. Create/Edit Appointment Dialog -->
        <Dialog v-model:open="isModalActive">
            <DialogContent class="sm:max-w-[800px] max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{{ modalTitle }}</DialogTitle>
                    <DialogDescription>
                        {{ isEditing ? t('appointment.edit_label') : t('appointment.create_label') }}
                    </DialogDescription>
                </DialogHeader>

                <!-- The form handles its own submission and validation via the composable -->
                <AppointmentForm class="max-h-[90dvh] overflow-auto" @submit=" handleFormSubmitSuccess"
                    @cancel="closeModal" :isEditing="isEditing" />

            </DialogContent>
        </Dialog>

        <Dialog v-model:open="isSessionModalActive">
            <DialogContent class="sm:max-w-[800px] max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{{ t('session.new_title') || 'Add New Session' }}</DialogTitle>
                    <DialogDescription>
                        {{ t('session.existing_patient_desc') || 'Create a new therapy session for an existing patient.'
                        }}
                    </DialogDescription>
                </DialogHeader>

                <!-- SessionForm.vue requires the patient context -->
                <SessionForm class="max-h-[80dvh] overflow-y-auto" v-if="patientContext" :patient="patientContext"
                    @submit="handleFormSubmitSuccess" @cancel="closeModal" />
            </DialogContent>
        </Dialog>
        <Dialog v-model:open="isFollowUpModalActive">
            <DialogContent class="sm:max-w-[800px] max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{{ t('session.new_title') || 'Add New Session' }}</DialogTitle>
                    <DialogDescription>
                        {{ t('session.existing_patient_desc') || 'Create a new therapy session for an existing patient.'
                        }}
                    </DialogDescription>
                </DialogHeader>

                <!-- FollowUpForm.vue requires the patient context -->
                <FollowUpForm class="max-h-[80dvh] overflow-y-auto" v-if="patientContext" :patient="patientContext"
                    @submit="handleFormSubmitSuccess" @cancel="closeModal" />
            </DialogContent>
        </Dialog>

        <!-- 2. Delete Confirmation Dialog -->
        <Dialog v-model:open="isDeleteModalActive">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{{ t('appointment.delete_session') }}</DialogTitle>
                </DialogHeader>

                <p class="text-sm text-muted-foreground">
                    {{ t('appointment.delete_session_note') }}
                    <span class="font-bold text-foreground">
                        {{ appointmentToDelete?.client }}
                    </span>
                    on {{ appointmentToDelete?.date }}?
                </p>

                <DialogFooter>
                    <Button variant="outline" @click="isDeleteModalActive = false">
                        {{ t('button.cancel') }}
                    </Button>
                    <Button variant="destructive" @click="handleDeleteAppointment">
                        <Trash2 class="h-4 w-4 mr-2" />
                        {{ t('button.delete') }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


        <div class="flex-1 space-y-4 p-8 pt-6">

            <!-- Header & Actions -->
            <div class="flex items-center justify-between space-y-2 pb-4 border-b">
                <div>
                    <h2 class="text-3xl font-bold tracking-tight">{{ t('appointment.title') }}</h2>
                    <p class="text-muted-foreground">{{ t('appointment.subtitle') }}</p>
                </div>

                <div class="flex items-center space-x-3">
                    <Button variant="outline" size="sm" disabled>
                        <FileUp class="mr-2 h-4 w-4" />
                        {{ t('button.import') }}
                    </Button>
                    <Button variant="default" size="sm" @click="openNewAppointmentModal">
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ t('appointment.new_btn') }}
                    </Button>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="w-full">

                <!-- Left Column: Calendar -->
                <!-- <Card class="lg:col-span-1">
                    <CardHeader>
                        <CardTitle class="text-lg">{{ t('appointment.select_date') }}</CardTitle>
                        <Separator />
                    </CardHeader>
                    <CardContent class="p-0">
                        <AppointmentCalendar />
                    </CardContent>
                </Card> -->

                <!-- Right Column: Appointments List -->
                <Card class="px-8">
                    <CardHeader class="px-0">
                        <CardTitle class="text-lg">{{ t('appointment.list_title') }}</CardTitle>
                        <CardDescription>
                            {{ t('appointment.viewing_appointment_for')}} {{ appointmentsStore.selectedDate }}
                        </CardDescription>
                        <Separator />
                    </CardHeader>
                    <CardContent class="p-0">
                        <!-- CATCH THE EMITTED EVENTS -->
                        <AppointmentsTable 
                            @edit-appointment="handleEditAppointment"
                            @delete-appointment="handleDeleteConfirmation" 
                            @create-session="handleCreateSession"
                            @create-follow-up="handleCreateFollowUp" 
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    </LayoutAuthenticated>
</template>