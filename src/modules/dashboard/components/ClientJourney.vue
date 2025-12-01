<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ClientJourneyData } from '../stores/useDashboardStore'

defineProps<{
    data: ClientJourneyData
    title?: string
}>()
</script>

<template>
    <Card class="h-full">
        <CardHeader>
            <CardTitle class="text-base font-semibold">{{ title || 'Client Journey' }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col justify-center space-y-4 pt-4">

            <!-- Step 1: New Leads -->
            <div
                class="relative flex h-24 w-full flex-col items-center justify-center rounded-lg bg-blue-100 text-center transition-all hover:bg-blue-200/80">
                <span class="text-2xl font-bold text-blue-950">{{ data.newLeads }}</span>
                <span class="text-sm font-medium text-blue-800/80">New Leads</span>
            </div>

            <!-- Step 2: Booked Appointments (Slightly narrower visually if desired, but image shows equal width blocks) -->
            <div
                class="relative flex h-24 w-full flex-col items-center justify-center rounded-lg bg-indigo-50 text-center transition-all hover:bg-indigo-100/80">
                <span class="text-2xl font-bold text-slate-900">{{ data.bookedAppointments }}</span>
                <span class="text-sm font-medium text-slate-600">Booked Appointments</span>
            </div>

            <!-- Step 3: Returning Clients -->
            <div
                class="relative flex h-24 w-full flex-col items-center justify-center rounded-lg bg-blue-200 text-center transition-all hover:bg-blue-300/80">
                <span class="text-2xl font-bold text-indigo-950">{{ data.returningClients }}</span>
                <span class="text-sm font-medium text-indigo-900/70">Returning Clients</span>
            </div>

        </CardContent>
    </Card>
</template>