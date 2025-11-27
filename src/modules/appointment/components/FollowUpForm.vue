<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFollowUpForm } from '../composables/followup.composable'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, User, Phone, Zap, AlertTriangle, MessageSquare } from 'lucide-vue-next'
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
    followUpTypeOptions,
    priorityOptions,
    handleSubmit,
    handleSelectUpdate,
} = useFollowUpForm(props.patient.id)


const handleSave = async () => {
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

        <!-- HEADER/PATIENT INFO READOUT -->
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
        <!-- FOLLOW-UP DETAILS -->
        <h3 class="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Clock class="h-5 w-5 text-primary" /> {{ $t('session.follow_up_details') || 'Follow-up Details' }}
        </h3>
        <Separator />

        <div class="grid gap-4 py-2">

            <!-- Date, Time, Service -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Follow-up Date -->
                <div class="grid gap-2">
                    <Label for="date">{{ $t('session.follow_up_date') || 'Follow-up Date' }} <span
                            class="text-destructive">*</span></Label>
                    <Input id="date" type="date" v-model="form.date" :class="{ 'border-destructive': errors.date }" />
                    <span v-if="errors.date" class="text-xs text-destructive">{{ errors.date }}</span>
                    <p class="text-xs text-muted-foreground mt-1">Must be a future date.</p>
                </div>

                <!-- Follow-up Type -->
                <div class="grid gap-2">
                    <Label for="followUpType">{{ $t('session.follow_up_type') || 'Follow-up Type' }}</Label>
                    <Select v-model="form.followUpType">
                        <SelectTrigger class="w-full">
                            <SelectValue :placeholder="$t('session.follow_up_type')" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="option in followUpTypeOptions" :key="option.id" :value="option.id">
                                {{ option.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Service Type -->
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
            </div>

            <!-- Priority Level -->
            <div class="space-y-2">
                <Label for="priorityLevel">{{ $t('session.priority_level') || 'Priority Level' }} <span
                        class="text-destructive">*</span></Label>
                <div class="grid grid-cols-3 gap-3">
                    <Card v-for="priority in priorityOptions" :key="priority.id" :class="[
                        'cursor-pointer border-2 transition-colors',
                        form.priorityLevel === priority.id ? 'border-primary' : 'border-input hover:border-accent'
                    ]" @click="form.priorityLevel = priority.id">
                        <div class="flex justify-center">
                            <Calendar v-if="priority.id.toLowerCase() == 'medium'" class="h-10 w-10 text-primary" />
                            <MessageSquare v-if="priority.id.toLowerCase() == 'low'" class="h-10 w-10 text-primary" />
                            <Zap v-if="priority.id.toLowerCase() == 'high'" class="h-10 w-10 text-primary" />
                        </div>
                        <CardContent class="p-3 text-center">
                            <h4 class="font-semibold text-sm">{{ priority.label }}</h4>
                            <p class="text-xs text-muted-foreground mt-1">
                                {{ $t(`session.priority_desc_${priority.id.toLowerCase()}`) || 'Standard check-up' }}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <span v-if="errors.priorityLevel" class="text-xs text-destructive">{{ errors.priorityLevel }}</span>
            </div>

            <!-- Notes / Reason -->
            <div class="grid gap-2">
                <Label for="notes">{{ $t('session.follow_up_notes') || 'Notes / Reason' }}</Label>
                <Textarea id="notes" v-model="form.notes"
                    :placeholder="$t('session.follow_up_notes_placeholder') || 'Reason for follow-up, specific questions to ask...'"
                    class="resize-none min-h-[100px]" />
            </div>

            <!-- Automatic Reminder Alert -->
            <Alert class="bg-primary/10 border-primary text-primary">
                <AlertTriangle class="h-4 w-4" />
                <AlertTitle>{{ $t('session.reminder_auto_title') || 'Automatic Reminder Generation' }}</AlertTitle>
                <AlertDescription>
                    {{ $t('session.reminder_auto_desc') }}
                </AlertDescription>
            </Alert>
        </div>


        <!-- Footer Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" @click="emit('cancel')">
                {{ $t('button.cancel') }}
            </Button>
            <Button type="submit">
                {{ $t('session.schedule_follow_up') || 'Schedule Follow-up' }}
            </Button>
        </div>
    </form>
</template>