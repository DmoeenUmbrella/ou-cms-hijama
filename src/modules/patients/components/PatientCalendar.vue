<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePatientStore } from '@/modules/patients/stores/usePatientStore'
import { Calendar } from '@/components/ui/calendar'
import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
    parseDate,
    today
} from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

const { locale } = useI18n()
const appointmentsStore = usePatientStore()

// Sync the Calendar's v-model (CalendarDate) with the Store's state (String 'YYYY-MM-DD')
const selectedDate = computed({
    get: () => {
        // Convert Store String ("2025-11-14") -> CalendarDate
        if (appointmentsStore.selectedDate) {
            try {
                return parseDate(appointmentsStore.selectedDate)
            } catch (e) {
                console.error("Invalid date format in store:", appointmentsStore.selectedDate)
                return today(getLocalTimeZone())
            }
        }
        return today(getLocalTimeZone())
    },
    set: (newDate: DateValue | undefined) => {
        if (!newDate) return

        // CalendarDate.toString() returns "YYYY-MM-DD" automatically
        // This handles the conversion back to your store's format
        appointmentsStore.setSelectedDate(newDate.toString())
    }
})
</script>

<template>
    <div :dir="locale === 'ar' ? 'rtl' : 'ltr'" class="w-full flex justify-center px-6">
        <Calendar v-model="selectedDate" class="rounded-md border shadow-sm" layout="month-and-year" />
    </div>
</template>