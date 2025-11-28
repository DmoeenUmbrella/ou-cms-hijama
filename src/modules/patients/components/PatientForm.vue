<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// Chadcn UI Components
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import { usePatientForm } from '../composables/patient.form.composable'

const emit = defineEmits(['submit', 'cancel'])

// Props
const props = defineProps<{
    patient: any
    isEditing: boolean
    currentAction: 'create-patient' | 'edit-patient' | 'create-session' | 'create-followup' | null
    technicians?: Array<{ id: string; name: string }>
}>()

const { t } = useI18n()

const { form, errors, handleSave, getInitials } = usePatientForm(props)

const onSubmit = () => {
    const payload = handleSave()
    if (payload) emit('submit', payload)
}

</script>

<template>
    <form @submit.prevent="onSubmit" class="space-y-6 max-h-[90dvh] overflow-auto">
        <div v-if="patient?.name" class="space-y-4 border p-4 rounded-lg bg-muted/20">
            <h4 class="font-semibold text-lg">{{ $t('patient.information') || 'Patient Information' }}</h4>
            <div class="grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-2 text-sm justify-between">
                <!-- Patient Name -->
                <div class="flex align-center gap-4">
                    <Avatar class="h-12 w-12">
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
                        <p class="font-medium text-primary text-center">{{ patient.totalSessions ?? 0 }}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground text-center">{{ $t('customers.table.columns.last_visit') ||
                            'Total Visit' }}</p>
                        <p class="font-medium text-primary text-center">{{ patient.lastSessionDate ?? 0 }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- CREATE / EDIT PATIENT -->
        <div v-if="props.currentAction === 'create-patient' || props.currentAction === 'edit-patient'"
            class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="grid gap-2">
                <Label for="name">{{ t('patient.patient.name') || 'Name' }} <span
                        class="text-destructive">*</span></Label>
                <Input id="name" v-model="form.name" :class="{ 'border-destructive': errors.name }" />
                <span v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</span>
            </div>

            <div class="grid gap-2">
                <Label for="phone">{{ t('patient.patient.phone') || 'Phone' }} <span
                        class="text-destructive">*</span></Label>
                <Input id="phone" v-model="form.phoneNumber" :class="{ 'border-destructive': errors.phoneNumber }" />
                <span v-if="errors.phoneNumber" class="text-xs text-destructive">{{ errors.phoneNumber }}</span>
            </div>

            <div class="grid gap-2">
                <Label for="gender">{{ t('patient.patient.gender') || 'Gender' }} <span
                        class="text-destructive">*</span></Label>
                <Select v-model="form.gender">
                    <SelectTrigger class="w-full" :class="{ 'border-destructive': errors.gender }">
                        <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <span v-if="errors.gender" class="text-xs text-destructive">{{ errors.gender }}</span>
            </div>

            <div class="grid gap-2">
                <Label for="technicianId">{{ t('patient.patient.technician') || 'Technician' }} <span
                        class="text-destructive">*</span></Label>
                <Select v-model="form.technicianId">
                    <SelectTrigger class="w-full" :class="{ 'border-destructive': errors.technicianId }">
                        <SelectValue placeholder="Select Technician" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="tech in props.technicians" :key="tech.id" :value="tech.id">{{ tech.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <span v-if="errors.technicianId" class="text-xs text-destructive">{{ errors.technicianId }}</span>
            </div>

            <div class="grid gap-2">
                <Label for="paymentMethod">{{ t('patient.patient.paymentMethod') || 'Payment Method' }} <span
                        class="text-destructive">*</span></Label>
                <Select v-model="form.paymentMethod">
                    <SelectTrigger class="w-full" :class="{ 'border-destructive': errors.paymentMethod }">
                        <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                    </SelectContent>
                </Select>
                <span v-if="errors.paymentMethod" class="text-xs text-destructive">{{ errors.paymentMethod }}</span>
            </div>

            <!-- Other fields remain the same (numberOfCups, amount, notes, date, reminder) -->
            <div class="grid gap-2">
                <Label for="numberOfCups">{{ t('patient.patient.numberOfCups') || 'Number of Cups' }}</Label>
                <Input id="numberOfCups" v-model="form.numberOfCups" />
            </div>

            <div class="grid gap-2">
                <Label for="amount">{{ t('patient.patient.amount') || 'Amount' }}</Label>
                <Input id="amount" type="number" v-model="form.amount" />
            </div>

            <div class="grid gap-2 col-span-2">
                <Label for="notes">{{ t('patient.patient.notes') || 'Notes' }}</Label>
                <Textarea id="notes" v-model="form.notes" class="min-h-[100px]" />
            </div>

            <div class="grid gap-2">
                <Label for="date">{{ t('patient.patient.date') || 'Date' }}</Label>
                <Input id="date" type="date" v-model="form.date" />
            </div>

            <div class="grid gap-2">
                <Label for="reminder">{{ t('patient.patient.reminder') || 'Reminder' }}</Label>
                <Input id="reminder" v-model="form.reminder" />
            </div>
        </div>

        <!-- CREATE SESSION -->
        <div v-if="props.currentAction === 'create-session'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="grid gap-2">
                <Label for="date">{{ t('patient.session.date') || 'Date' }} <span
                        class="text-destructive">*</span></Label>
                <Input id="date" type="date" v-model="form.date" :class="{ 'border-destructive': errors.date }" />
                <span v-if="errors.date" class="text-xs text-destructive">{{ errors.date }}</span>
            </div>

            <div class="grid gap-2">
                <Label for="time">{{ t('patient.session.time') || 'Time' }} <span
                        class="text-destructive">*</span></Label>
                <Input id="time" type="time" v-model="form.time" :class="{ 'border-destructive': errors.time }" />
                <span v-if="errors.time" class="text-xs text-destructive">{{ errors.time }}</span>
            </div>

            <div class="grid gap-2">
                <Label for="numberOfCups">{{ t('patient.session.numberOfCups') || 'Number of Cups' }} <span
                        class="text-destructive">*</span></Label>
                <Input id="numberOfCups" v-model="form.numberOfCups"
                    :class="{ 'border-destructive': errors.numberOfCups }" />
                <span v-if="errors.numberOfCups" class="text-xs text-destructive">{{ errors.numberOfCups }}</span>
            </div>

            <div class="grid gap-2">
                <Label for="price">{{ t('patient.session.price') || 'Price' }} <span
                        class="text-destructive">*</span></Label>
                <Input id="price" type="number" v-model="form.price" :class="{ 'border-destructive': errors.price }" />
                <span v-if="errors.price" class="text-xs text-destructive">{{ errors.price }}</span>
            </div>

            <div class="grid gap-2">
                <Label for="technicianId">{{ t('patient.patient.technician') || 'Technician' }} <span
                        class="text-destructive">*</span></Label>
                <Select v-model="form.technicianId">
                    <SelectTrigger class="w-full" :class="{ 'border-destructive': errors.technicianId }">
                        <SelectValue placeholder="Select Technician" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="tech in props.technicians" :key="tech.id" :value="tech.id">{{ tech.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <span v-if="errors.technicianId" class="text-xs text-destructive">{{ errors.technicianId }}</span>
            </div>

            <div class="grid gap-2 col-span-2">
                <Label for="notes">{{ t('patient.session.notes') || 'Notes' }}</Label>
                <Textarea id="notes" v-model="form.notes" class="min-h-[100px]" />
            </div>

            <div class="grid gap-2 col-span-2">
                <Label for="reminder">{{ t('patient.session.reminder') || 'Reminder' }}</Label>
                <Input id="reminder" v-model="form.reminder" />
            </div>
        </div>

        <!-- CREATE FOLLOW-UP -->
        <div v-if="props.currentAction === 'create-followup'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="grid gap-2">
                <Label for="date">{{ t('patient.followup.date') || 'Date' }} <span
                        class="text-destructive">*</span></Label>
                <Input id="date" type="date" v-model="form.date" :class="{ 'border-destructive': errors.date }" />
                <span v-if="errors.date" class="text-xs text-destructive">{{ errors.date }}</span>
            </div>
        </div>

        <!-- FOOTER BUTTONS -->
        <div class="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" @click="emit('cancel')">
                {{ t('patient.button.cancel') }}
            </Button>
            <Button type="submit">{{ t('patient.button.submit') || 'Submit' }}</Button>
        </div>
    </form>
</template>
