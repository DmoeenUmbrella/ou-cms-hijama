<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePatientStore } from '@/modules/patients/stores/usePatientStore'
import { useCustomersStore } from '@/stores/useCustomersStore'
import { useServicesStore } from '@/stores/useServicesStore'
import { useAppointmentView } from '@/modules/patients/composables/patient.composable' // Import the View Composable

// Icons
import { Calendar as CalendarIcon, FileUp, Trash2 } from 'lucide-vue-next'

// Layout & Components
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import AppointmentsTable from '@/modules/patients/components/PatientsTable.vue'

// Shadcn UI
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator' // Assuming Separator is installed
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import PatientForm from '@/modules/patients/components/PatientForm.vue'
// import AppointmentCalendar from '@/modules/patients/components/PatientCalendar.vue'

// Use the Composable for View Logic
const {
    isModalActive, // Patient Registration Modal (Multi-step)
    isDeleteModalActive,
    appointmentToDelete,
    isEditing,
    modalTitle,
    currentAction,
    selectedPatient,
    handleCreateAppointment,
    handleEditAppointment,
    handleDeleteConfirmation,
    handleDeleteAppointment,
    handleFormSubmit,
    closeModal,
    handleCreateSession,
    handleCreateFollowUp,
} = useAppointmentView()

const appointmentsStore = usePatientStore()
const customersStore = useCustomersStore()
const servicesStore = useServicesStore()
const { t } = useI18n()


onMounted(() => {
    // Pre-load necessary data for the view
    appointmentsStore.fetchPatients()
    // customersStore.fetchClients()
    // servicesStore.fetchServices()
})

</script>

<template>
    <LayoutAuthenticated>

        <!-- 1. Create/Edit Modal -->
        <Dialog v-model:open="isModalActive" onOpenChange="closeModal">
            <DialogContent class="sm:max-w-[800px] max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{{ modalTitle }}</DialogTitle>
                    <DialogDescription>
                        {{
                        isEditing
                        ? t('appointment.edit_desc_label')
                        : currentAction === 'create-session'
                        ? t('session.existing_patient_desc')
                        : currentAction === 'create-followup'
                        ? ''
                        : t('appointment.create_desc_label')
                        }}
                    </DialogDescription>
                </DialogHeader>

                <!-- Conditionally Render Forms -->
                <div class="max-h-[90dvh] overflow-auto">
                    <PatientForm :patient="isEditing || currentAction !== 'edit-patient' ? selectedPatient : undefined"
                        :isEditing="isEditing" :currentAction="currentAction" @submit="handleFormSubmit"
                        @cancel="closeModal" />
                </div>
            </DialogContent>
        </Dialog>

        <!-- <Dialog v-model:open="isModalActive">
            <DialogContent class="sm:max-w-[800px] max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{{ modalTitle }}</DialogTitle>
                    <DialogDescription>
                        {{ isEditing ? t('appointment.edit_label') : t('appointment.create_label') }}
                    </DialogDescription>
                </DialogHeader>

        <AppointmentForm class="max-h-[90dvh] overflow-auto" @submit=" handleFormSubmit" @cancel="closeModal"
            :isEditing="isEditing" />

        </DialogContent>
        </Dialog> -->

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
                    <Button variant="default" size="sm" @click="handleCreateAppointment">
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
                    
                    <CardContent class="p-0">
                        <!-- CATCH THE EMITTED EVENTS -->
                        <AppointmentsTable @edit-patient="handleEditAppointment"
                            @delete-appointment="handleDeleteConfirmation" @create-session="handleCreateSession"
                            @create-follow-up="handleCreateFollowUp" />
                    </CardContent>
                </Card>
            </div>
        </div>
    </LayoutAuthenticated>
</template>