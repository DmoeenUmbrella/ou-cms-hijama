<script setup lang="ts">
import { VisXYContainer, VisLine, VisAxis, VisArea, VisTooltip, VisScatter } from '@unovis/vue'
import { CurveType, Scatter } from '@unovis/ts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AppointmentVolumeData, VolumeSummary, VolumeFilterType } from '../stores/useDashboardStore'

const props = defineProps<{
    data: AppointmentVolumeData[]
    summary: VolumeSummary
    activeFilter?: VolumeFilterType // Accept current filter state
    title?: string
}>()

const emit = defineEmits<{
    (e: 'filter-change', filter: VolumeFilterType): void
}>()

// Accessors for Unovis
const x = (d: AppointmentVolumeData, i: number) => i
const y = (d: AppointmentVolumeData) => d.value

// Dynamic Label Formatting to prevent overlap
const xTickFormat = (i: number) => {
    const item = props.data[i];
    if (!item) return '';

    const total = props.data.length;

    // If we have few items (like Day/Week), show all
    if (total <= 12) return item.name;

    // If many items (Month), show every nth item (e.g., every 5th day)
    const step = Math.ceil(total / 8);
    return i % step === 0 ? item.name : '';
}

// Tooltip customization
const triggers = {
    [Scatter.selectors.point]: (d: AppointmentVolumeData) => `
    <div class="rounded-lg border bg-background p-2 shadow-sm text-sm">
      <span class="font-medium text-muted-foreground">${d.name}:</span>
      <span class="font-bold ml-1">${d.value}</span>
    </div>
  `
}

const filters: VolumeFilterType[] = ['day', 'week', 'month'];
</script>

<template>
    <Card class="col-span-1 md:col-span-2">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-base font-semibold">{{ title || 'Appointment Volume' }}</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="h-[300px] w-full">
                <!-- Added Key to force re-render animation when data changes significantly -->
                <VisXYContainer :key="activeFilter" :data="data" :height="300"
                    :margin="{ top: 10, right: 10, bottom: 30, left: 20 }">
                    <!-- Grid & Axis -->
                    <VisAxis type="x" :num-ticks="data.length" :tick-format="xTickFormat" :grid-line="false"
                        :tick-line="false" color="#888888" />
                    <VisAxis type="y" :num-ticks="5" :grid-line="true" :tick-line="false" :domain-line="false"
                        color="#e5e7eb" />

                    <!-- Area (Gradient Fill) -->
                    <VisArea :x="x" :y="y" color="rgb(59, 130, 246)" :opacity="0.1"
                        :curve-type="CurveType.CatmullRom" />

                    <!-- Line (Curved) -->
                    <VisLine :x="x" :y="y" color="rgb(59, 130, 246)" :curve-type="CurveType.CatmullRom"
                        :line-width="2" />

                    <!-- Scatter (Points) -->
                    <VisScatter :x="x" :y="y" :size="8" stroke-color="rgb(59, 130, 246)" :stroke-width="2"
                        color="#ffffff" />

                    <VisTooltip :triggers="triggers" />
                </VisXYContainer>
            </div>

            <!-- Footer Summary -->
            <div class="mt-4 rounded-lg bg-muted/30 p-4 text-sm">
                <div class="flex flex-col gap-1">
                    <div>
                        <span class="font-bold text-foreground">Peak days: </span>
                        <span class="text-muted-foreground">{{ summary.peakDays }}</span>
                    </div>
                    <div>
                        <span class="font-bold text-foreground">Low days: </span>
                        <span class="text-muted-foreground">{{ summary.lowDays }}</span>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>