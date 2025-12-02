<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSessionForm } from '../composables/session.composable'
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
import type { Patient } from '@/types/appointment'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'

const emit = defineEmits(['submit', 'cancel'])
const { t } = useI18n()

// Props: Patient data passed from the parent view
const props = defineProps<{
    patient: Patient
}>()

// Use the composable, passing the required patient ID
const {
    form,
    errors,
    serviceOptions,
    cuppers,
    paymentOptions,
    reminderOptions,
    handleSubmit,
    handleSelectUpdate,
} = useSessionForm(props.patient.id)


const handleSave = async () => {
    // Submission handles validation for session details
    if (await handleSubmit()) {
        emit('submit')
    }
}

function getInitials(name: string) {
    return name ? name.substring(0, 2).toUpperCase() : 'US'
}
</script>

<template>
    <form @submit.prevent="handleSave" class="space-y-6">

        <!-- HEADER/PATIENT INFO READOUT (Matches image a6463e.png) -->
        <div class="space-y-4 border p-4 rounded-lg bg-muted/20">
            <h4 class="font-semibold text-lg">{{ $t('patient.information') || 'Patient Information' }}</h4>
            <div class="grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-2 text-sm justify-between">
                <!-- Patient Name -->
                <div class="flex align-center gap-4">
                    <Avatar class="h-12 w-12">
                        <AvatarImage src="/avatars/01.png" alt="User" />
                        <AvatarFallback class="bg-blue-500 text-white">{{ getInitials('Admin User') }}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p class="text-lg font-bold">{{ patient.name }}</p>
                        <p class="text-muted-foreground ">{{ patient.phone }} • {{ patient.gender }}</p>
                    </div>
                </div>
                <!-- Session Count (Mock Total Spent) -->
                <div class="grid grid-cols-2 gap-1 w-[200px] justify-self-end">
                    <div>
                        <p class="text-muted-foreground text-center">{{ $t('customers.table.columns.total_sessions') ||
                            'Total Sessions' }}</p>
                        <p class="font-medium text-primary text-center">{{ patient.totalSessions ?? 0}}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground text-center">{{ $t('customers.table.columns.last_visit') ||
                            'Total Visit' }}</p>
                        <p class="font-medium text-primary text-center">{{ patient.lastSessionDate ?? 0}}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- SESSION DETAILS -->
        <h3 class="text-xl font-semibold tracking-tight">{{ $t('session.details') }}</h3>

        <div class="grid gap-4 py-2">

            <!-- Service Type & Cups -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label for="serviceId">{{ $t('appointment.service_type') }} <span
                            class="text-destructive">*</span></Label>
                    <Select :model-value="form.serviceId?.toString()"
                        @update:model-value="(val) => handleSelectUpdate('serviceId', val)">
                        <SelectTrigger :class="{ 'border-destructive': errors.serviceId }">
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
                <div class="grid gap-2">
                    <Label for="cupsCount">{{ $t('session.cups_count') || 'Number of Cups' }}</Label>
                    <Input id="cupsCount" type="number" v-model.number="form.cupsCount" />
                </div>
            </div>

            <!-- Amount & Payment -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label for="amount">{{ $t('session.amount') || 'Amount (AED)' }} <span
                            class="text-destructive">*</span></Label>
                    <Input id="amount" type="number" v-model.number="form.amount"
                        :class="{ 'border-destructive': errors.amount }" />
                    <span v-if="errors.amount" class="text-xs text-destructive">{{ errors.amount }}</span>
                </div>
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
                    <span v-if="errors.paymentMethod" class="text-xs text-destructive">{{ errors.paymentMethod }}</span>
                </div>
            </div>

            <!-- Practitioner/Cupper Name -->
            <div class="grid gap-2">
                <Label for="cupper">{{ $t('customers.table.columns.cupperName') }}</Label>
                <Select v-model="form.cupperName">
                    <SelectTrigger>
                        <SelectValue :placeholder="$t('customers.table.columns.cupperName')" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="cupper in cuppers" :key="cupper.id" :value="cupper.id">
                            {{ cupper.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Date & Time -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label for="date">{{ $t('appointment.date') }} <span class="text-destructive">*</span></Label>
                    <Input type="date" v-model="form.date" id="date" :class="{ 'border-destructive': errors.date }" />
                    <span v-if="errors.date" class="text-xs text-destructive">{{ errors.date }}</span>
                </div>
                <div class="grid gap-2">
                    <Label for="time">{{ $t('appointment.time') }} <span class="text-destructive">*</span></Label>
                    <Input type="time" v-model="form.time" id="time" :class="{ 'border-destructive': errors.time }" />
                    <span v-if="errors.time" class="text-xs text-destructive">{{ errors.time }}</span>
                </div>
            </div>

            <!-- Session Notes -->
            <div class="grid gap-2 col-span-full">
                <Label for="notes">{{ $t('session.session_notes') || 'Session Notes' }}</Label>
                <Textarea v-model="form.notes" id="notes"
                    :placeholder="$t('session.session_notes_placeholder') || 'Details about the session, treatment areas...'"
                    class="resize-none min-h-[100px]" />
            </div>

        </div>

        <Separator class="my-4" />
        <h3 class="text-xl font-semibold tracking-tight">{{ $t('session.follow_up_settings') || 'Follow-up Settings' }}
        </h3>

        <!-- FOLLOW-UP REMINDER ROW -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div class="grid gap-2 col-span-full md:col-span-1">
                <Label for="followUpNotes">{{ $t('session.notes') || 'Follow-up Notes' }}</Label>
                <Textarea v-model="form.followUpNotes" id="followUpNotes"
                    placeholder="Specific points to follow up on..." class="resize-none min-h-[60px]" />
            </div>
        </div>

        <!-- Footer Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" @click="emit('cancel')">
                {{ $t('button.cancel') }}
            </Button>
            <Button type="submit">
                {{ $t('button.create_session_follow_up') || 'Create Session & Follow-up' }}
            </Button>
        </div>
    </form>
</template>