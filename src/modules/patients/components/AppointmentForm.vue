<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useAppointmentForm } from '../composables/appointment.form.composable'

const emit = defineEmits(['submit', 'cancel'])

// We are defining the props explicitly, though this form is primarily registration
const props = defineProps<{ isEditing: boolean }>()

// Consuming the composable which provides form state (formPatient) and stepper logic
const {
    form,
    errors,
    serviceOptions,
    cuppers,
    genderOptions,
    paymentOptions,
    reminderOptions,
    activeStep,
    handleSubmit,
    handleSelectUpdate,
    nextStep,
    previousStep,
} = useAppointmentForm()


const handleSubmission = async () => {
    if (activeStep.value === 1) {
        // Step 1: Validate patient details and move to Step 2
        nextStep()
    } else if (activeStep.value === 2) {
        // Step 2: Validate session details and attempt submission
        // handleSubmit handles validation for step 2 and calls store.registerPatient()
        const success = await handleSubmit()

        if (success) {
            // If store registration was successful, the composable moves activeStep to 3 (Confirmation).
            // We now wait for the final "Finish & View Patient" button in the template.
        }
    }
}

// Handler for the "Finish & View Patient" button in Step 3
const handleFinalConfirmation = () => {
    // This button replaces the functionality of the parent modal's @confirm hook
    // It closes the modal via the parent view component
    emit('submit')
}
</script>

<template>
    <div class="space-y-6">

        <!-- STEPPER UI (Matches visual reference) -->
        <div class="flex justify-center space-x-4">
            <div class="flex items-center space-x-2">
                <span
                    :class="[activeStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground']"
                    class="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">1</span>
                <span :class="[activeStep >= 1 ? 'text-primary' : 'text-muted-foreground']" class="hidden sm:inline">
                    {{ $t('patient.details') || 'Patient Details' }}
                </span>
            </div>
            <Separator orientation="vertical" class="w-1 bg-muted my-2 h-6 hidden sm:block" />

            <div class="flex items-center space-x-2">
                <span
                    :class="[activeStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground']"
                    class="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">2</span>
                <span :class="[activeStep >= 2 ? 'text-primary' : 'text-muted-foreground']" class="hidden sm:inline">
                    {{ $t('session.details') || 'Session Details' }}
                </span>
            </div>
            <Separator orientation="vertical" class="w-1 bg-muted my-2 h-6 hidden sm:block" />

            <div class="flex items-center space-x-2">
                <span
                    :class="[activeStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground']"
                    class="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">3</span>
                <span :class="[activeStep >= 3 ? 'text-primary' : 'text-muted-foreground']" class="hidden sm:inline">
                    Confirmation
                </span>
            </div>
        </div>

        <Separator />

        <form @submit.prevent="handleSubmission" class="space-y-6">

            <!-- STEP 1: PATIENT DETAILS -->
            <div v-if="activeStep === 1" class="grid gap-4 py-4">
                <h3 class="text-lg font-semibold tracking-tight">{{ $t('patient.information') || 'Patient Information'
                    }}</h3>

                <!-- Name & Phone -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="grid gap-2">
                        <Label for="name">{{ $t('customers.table.columns.name') }} <span
                                class="text-destructive">*</span></Label>
                        <Input id="name" type="text" v-model="form.name"
                            :class="{ 'border-destructive': errors.name }" />
                        <span v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</span>
                    </div>
                    <div class="grid gap-2">
                        <Label for="phone">{{ $t('customers.table.columns.phone') }} <span
                                class="text-destructive">*</span></Label>
                        <Input id="phone" type="tel" v-model="form.phone"
                            :class="{ 'border-destructive': errors.phone }" />
                        <span v-if="errors.phone" class="text-xs text-destructive">{{ errors.phone }}</span>
                    </div>
                </div>

                <!-- Gender & Date of Birth -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="grid gap-2">
                        <Label for="gender">{{ $t('customers.table.columns.gender') }} <span
                                class="text-destructive">*</span></Label>
                        <Select :model-value="form.gender"
                            @update:model-value="(val) => handleSelectUpdate('gender', val)">
                            <SelectTrigger :class="{ 'border-destructive': errors.gender }">
                                <SelectValue :placeholder="$t('customers.table.columns.gender')" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="option in genderOptions" :key="option.id" :value="option.id">
                                    {{ option.label }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <span v-if="errors.gender" class="text-xs text-destructive">{{ errors.gender }}</span>
                    </div>
                    <div class="grid gap-2">
                        <Label for="dob">{{ $t('patient.dob') || 'Date of Birth' }}</Label>
                        <!-- Assuming DOB field is handled in PatientFormState for now -->
                        <Input id="dob" type="date" v-model="form.dob" />
                    </div>
                </div>

                <!-- Medical Notes -->
                <div class="grid gap-2">
                    <Label for="notes">{{ $t('patient.medical_notes') || 'Medical Notes' }}</Label>
                    <Textarea id="notes" v-model="form.notes"
                        :placeholder="$t('patient.medical_notes_placeholder') || 'Any relevant medical history...'"
                        class="resize-none" />
                </div>
            </div>

            <!-- STEP 2: SESSION DETAILS -->
            <div v-else-if="activeStep === 2">
                <h3 class="text-lg font-semibold tracking-tight">{{ $t('session.information') || 'Session Information'
                    }}</h3>
                <div class="py-4">
                    <!-- Service & Cupper -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col">
                            <Label class="mb-2" for="serviceId">{{ $t('appointment.service_type') }} <span
                                    class="text-destructive">*</span></Label>
                            <Select :model-value="form.serviceId?.toString()"
                                @update:model-value="(val) => handleSelectUpdate('serviceId', val)">
                                <SelectTrigger class="w-full" :class="{ 'border-destructive': errors.serviceId }">
                                    <SelectValue :placeholder="$t('appointment.service_type')" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="service in serviceOptions" :key="service.id"
                                        :value="service.id.toString()">
                                        {{ service.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <span v-if="errors.serviceId" class="text-xs text-destructive">{{ errors.serviceId }}</span>
                        </div>

                        <div class="flex flex-col">
                            <Label class="mb-2" for="cupper">{{ $t('customers.table.columns.cupperName') }}</Label>
                            <Select v-model="form.cupperName">
                                <SelectTrigger class="w-full">
                                    <SelectValue :placeholder="$t('customers.table.columns.cupperName')" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="cupper in cuppers" :key="cupper.id" :value="cupper.id">
                                        {{ cupper.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>


                    <!-- Cups & Amount -->
                    <div class="grid grid-cols-1 gap-4 mt-4">
                        <div class="grid gap-2">
                            <Label for="cupsCount">{{ $t('session.cups_count') || 'Number of Cups' }}</Label>
                            <Input id="cupsCount" type="number" v-model.number="form.cupsCount" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="amount">{{ $t('session.amount') || 'Amount (AED)' }} <span
                                    class="text-destructive">*</span></Label>
                            <Input id="amount" type="number" v-model.number="form.amount"
                                :class="{ 'border-destructive': errors.amount }" />
                            <span v-if="errors.amount" class="text-xs text-destructive">{{ errors.amount }}</span>
                        </div>
                    </div>

                    <!-- Payment & Date/Time -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div class="grid gap-2">
                            <Label for="paymentMethod">{{ $t('session.payment_method') || 'Payment Method' }} <span
                                    class="text-destructive">*</span></Label>
                            <Select v-model="form.paymentMethod">
                                <SelectTrigger :class="{ 'border-destructive': errors.paymentMethod }">
                                    <SelectValue :placeholder="$t('session.payment_method')" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="option in paymentOptions" :key="option.id" :value="option.id">
                                        {{ option.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <span v-if="errors.paymentMethod" class="text-xs text-destructive">{{ errors.paymentMethod
                                }}</span>
                        </div>
                        <div class="grid gap-2">
                            <Label for="date">{{ $t('appointment.date') }} <span
                                    class="text-destructive">*</span></Label>
                            <Input type="date" v-model="form.date" id="date"
                                :class="{ 'border-destructive': errors.date }" />
                            <span v-if="errors.date" class="text-xs text-destructive">{{ errors.date }}</span>
                        </div>
                        <div class="grid gap-2">
                            <Label for="time">{{ $t('appointment.time') }} <span
                                    class="text-destructive">*</span></Label>
                            <Input type="time" v-model="form.time" id="time"
                                :class="{ 'border-destructive': errors.time }" />
                            <span v-if="errors.time" class="text-xs text-destructive">{{ errors.time }}</span>
                        </div>
                    </div>

                    <!-- Follow-up Reminder (Mock fields for follow-up) -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div class="grid gap-2">
                            <Label for="followUpDate">{{ $t('session.follow_up_date') || 'Follow-up Date' }}</Label>
                            <Input id="followUpDate" type="date" v-model="form.followUpDate" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="reminderType">{{ $t('session.reminder_type') || 'Reminder Type' }}</Label>
                            <Select v-model="form.reminderType">
                                <SelectTrigger class="w-full">
                                    <SelectValue :placeholder="$t('session.reminder_type')" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="option in reminderOptions" :key="option.id" :value="option.id">
                                        {{ option.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <!-- Session Notes -->
                    <div class="grid gap-2 col-span-3 mt-4">
                        <Label for="notes">{{ $t('session.session_notes') || 'Session Notes' }}</Label>
                        <Textarea v-model="form.notes" id="notes"
                            :placeholder="$t('session.session_notes_placeholder') || 'Details about the session, treatment areas...'"
                            class="resize-none min-h-[100px]" />
                    </div>
                </div>
            </div>

            <!-- STEP 3: CONFIRMATION -->
            <div v-else-if="activeStep === 3" class="flex flex-col items-center justify-center p-8 text-center">
                <div class="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-6">
                    <!-- Checkmark SVG -->
                    <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 class="text-2xl font-bold">{{ $t('session.success_title') || 'Session Successfully Created!' }}</h3>
                <p class="text-muted-foreground mt-2">
                    {{ $t('session.success_desc1') || 'The patient has been registered ' }}
                </p>
                <p class="text-muted-foreground mt-1">
                    {{ $t('session.success_desc2') || 'A follow-up reminder has been scheduled automatically.' }}
                </p>
                <Button variant="default" @click="handleFinalConfirmation()" class="mt-6">
                    {{ $t('common.button.finish_view_patient') || 'Finish & View Patient' }}
                </Button>
            </div>

            <!-- Footer Buttons -->
            <div v-if="activeStep < 3" class="flex justify-between gap-3 pt-4 border-t">
                <Button v-if="activeStep > 1" type="button" variant="outline" @click="previousStep()">
                    {{ $t('common.button.back') || 'Back' }}
                </Button>
                <div v-else>
                    <Button type="button" variant="outline" @click="emit('cancel')">
                        {{ $t('common.button.cancel') }}
                    </Button>
                </div>

                <Button v-if="activeStep === 1" type="submit">
                    {{ $t('common.button.next_session_details') || 'Next: Session Details' }}
                </Button>
                <Button v-else-if="activeStep === 2" type="submit">
                    {{ $t('common.button.review_complete') || 'Next: Review & Complete' }}
                </Button>
            </div>
        </form>
    </div>
</template>