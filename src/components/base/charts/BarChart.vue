<script setup lang="ts">
import { VisXYContainer, VisStackedBar, VisAxis, VisTooltip } from '@unovis/vue'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { StackedBar } from '@unovis/ts'

const props = defineProps<{
    data: any[]
    config: any
}>()

// --- FIX START ---
// 2. Use INDEX for X-axis position to guarantee bars render
const x = (d: any, i: number) => i
const y = (d: any) => d.total

// 3. Map the index back to the label for the X-axis
const xTickFormat = (i: number) => props.data[i]?.name
// --- FIX END ---

// Tooltip Trigger
const triggers = {
    [StackedBar.selectors.bar]: (d: any) => {
        return `
      <div class="rounded-lg border bg-background p-2 shadow-sm">
        <div class="grid grid-cols-2 gap-2">
          <span class="font-medium">Date:</span>
          <span class="font-medium text-muted-foreground">${d.data.name}</span>
          <span class="font-medium">Total:</span>
          <span class="font-bold">${d.data.total}</span>
        </div>
      </div>
    `
    }
}
</script>

<template>
    <ChartContainer :config="config" class="w-full min-h-[300px]">
        <VisXYContainer :data="data" :height="350" :margin="{ top: 10, right: 10, bottom: 40, left: 0 }">
            <!-- X Axis: Uses the custom formatter to show labels -->
            <VisAxis type="x" :num-ticks="data.length" :tick-format="xTickFormat" :grid-line="false" :tick-line="false"
                color="#888888" />

            <!-- Y Axis -->
            <VisAxis type="y" :num-ticks="5" :grid-line="false" :tick-line="false" :domain-line="false"
                color="#888888" />

            <!-- Bars -->
            <VisStackedBar :x="x" :y="y" color="hsl(var(--primary))" :rounded-corners="4" :bar-padding="0.15" />

            <!-- Tooltip -->
            <VisTooltip :triggers="triggers" />

        </VisXYContainer>
    </ChartContainer>
</template>