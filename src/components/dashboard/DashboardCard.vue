<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, ArrowDownRight } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const props = withDefaults(defineProps<{
    title: string
    value: number | string
    change: number
    period?: string
    accentColor?: string // e.g., 'indigo', 'pink', 'rose', 'cyan'
}>(), {
    accentColor: 'indigo',
    period: 'from last month'
})

const isPositive = computed(() => props.change >= 0)
const formattedChange = computed(() => `${Math.abs(props.change)}%`)

// Map the color prop to Tailwind classes for the border
const borderColorClass = computed(() => {
    const colors: Record<string, string> = {
        indigo: 'border-l-indigo-500',
        cyan: 'border-l-cyan-500',
        pink: 'border-l-pink-500',
        rose: 'border-l-rose-500',
        blue: 'border-l-blue-500',
    }
    return colors[props.accentColor] || 'border-l-indigo-500'
})
</script>

<template>
    <Card class="border-l-4 shadow-sm bg-card" :class="borderColorClass">
        <CardHeader class="px-6 py-0">
            <CardTitle class="text-sm font-medium text-muted-foreground">
                {{ title }}
            </CardTitle>
        </CardHeader>

        <CardContent class="px-6 py-0">
            <div class="text-3xl font-bold tracking-tight">
                {{ value }}
            </div>

            <div class="mt-2 flex items-center text-xs">
                <component :is="isPositive ? ArrowUpRight : ArrowDownRight" class="mr-1 h-4 w-4"
                    :class="isPositive ? 'text-emerald-500' : 'text-rose-500'" />
                <span class="font-medium" :class="isPositive ? 'text-emerald-500' : 'text-rose-500'">
                    {{ formattedChange }}
                </span>
                <span class="ml-1 text-muted-foreground">
                    {{ period }}
                </span>
            </div>
        </CardContent>
    </Card>
</template>