<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge' // Ensure you have this component installed or create a placeholder

const props = defineProps<{
    title: string
    value: number | string
    change: number
    period: string
    icon?: any // Optional icon for the header
}>()


const isPositive = computed(() => props.change >= 0)
const formattedChange = computed(() => `${isPositive.value ? '+' : ''}${props.change}%`)
</script>

<template>
    <Card class="text-white">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription class="text-white900 dark:text-lg">{{ title }}</CardDescription>
            <!-- Optional: Badge in header like your example -->
            <Badge :variant="isPositive ? 'default' : 'destructive'"
                class="ml-auto bg-linear-to-r from-fuchsia-600 to-pink-600 shadow-xl dark:text-white">
                <component :is="isPositive ? TrendingUp : TrendingDown" class="mr-1 h-3 w-3" />
                {{ formattedChange }}
            </Badge>
        </CardHeader>

        <CardContent>
            <div class="text-3xl font-bold">{{ value }}</div>
            <p class="text-sm bg-white rounded-2xl w-50 px-2 py-1 text-center text-muted-foreground mt-1 flex items-center dark:text-gray-900">
                <!-- Dynamic trend message -->
                <span v-if="isPositive" class="text-emerald-500 font-medium mr-1">
                    {{ $t('appointment.trending_up') }}
                </span>
                <span v-else class="text-red-500 font-medium mr-1">
                    {{ $t('appointment.trending_down') }}
                </span>
                {{ period }}
            </p>
        </CardContent>
    </Card>
</template>