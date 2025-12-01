<script setup lang="ts">
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-vue-next'
import type { ServicePerformance } from '../stores/useDashboardStore'

defineProps<{
    data: ServicePerformance[]
}>()

// Helper to determine status color and text
const getTrendConfig = (trend: string) => {
    switch (trend?.toLowerCase()) {
        case 'high':
            return { color: 'text-emerald-500', label: 'High demand', icon: ArrowUpRight }
        case 'medium':
            return { color: 'text-emerald-500', label: 'Steady', icon: ArrowUpRight }
        case 'low':
            return { color: 'text-rose-500', label: 'Needs attention', icon: ArrowDownRight }
        default:
            return { color: 'text-muted-foreground', label: 'No data', icon: Minus }
    }
}

// Helper for progress bar color
const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-emerald-500'
    if (value >= 80) return 'bg-amber-500'
    return 'bg-rose-500'
}
</script>

<template>
    <Card class="h-full">
        <CardHeader>
            <CardTitle class="text-base font-semibold">Service Performance</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-[30%]">Service</TableHead>
                        <TableHead>Sessions</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead class="w-[25%]">Utilization</TableHead>
                        <TableHead class="text-right">Trend</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="data.length === 0">
                        <TableCell colspan="5" class="text-center text-muted-foreground py-8">
                            No service data available
                        </TableCell>
                    </TableRow>

                    <TableRow v-for="(item, index) in data" :key="index">
                        <TableCell class="font-medium">
                            {{ item.service }}
                        </TableCell>
                        <TableCell>{{ item.sessions }}</TableCell>
                        <TableCell>${{ item.revenue.toLocaleString() }}</TableCell>
                        <TableCell>
                            <div class="flex flex-col gap-1.5">
                                <span class="text-xs font-medium">{{ item.utilization }}%</span>
                                <div class="h-2 w-full rounded-full bg-secondary/50">
                                    <div class="h-full rounded-full transition-all"
                                        :class="getProgressColor(item.utilization)"
                                        :style="{ width: `${item.utilization}%` }" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell class="text-right">
                            <div class="flex items-center justify-end gap-1 text-xs font-medium"
                                :class="getTrendConfig(item.trend).color">
                                <component :is="getTrendConfig(item.trend).icon" class="h-3.5 w-3.5" />
                                <span>{{ getTrendConfig(item.trend).label }}</span>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</template>