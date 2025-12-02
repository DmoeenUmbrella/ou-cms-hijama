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
import { Star } from 'lucide-vue-next'
import type { DashboardStaffUtilization } from '@/api/endpoints/dashboard/types'

defineProps<{
    data: DashboardStaffUtilization[]
}>()

// Helper for progress bar color matching the image style
const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-emerald-500'
    if (value >= 80) return 'bg-amber-500'
    return 'bg-rose-500'
}

// Helper to generate a mock rating if API doesn't provide it yet
// (Since your API type has 'trend' but design shows 'rating')
const getRating = (trend: string) => {
    if (trend === 'High') return 4.9
    if (trend === 'Medium') return 4.6
    return 4.2
}
</script>

<template>
    <Card class="h-full">
        <CardHeader>
            <CardTitle class="text-base font-semibold">Staff Utilization</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-[30%]">Staff</TableHead>
                        <TableHead class="w-[30%]">Utilization</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead class="text-right">Revenue</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="data.length === 0">
                        <TableCell colspan="4" class="text-center text-muted-foreground py-8">
                            No staff data available
                        </TableCell>
                    </TableRow>

                    <TableRow v-for="staff in data" :key="staff.technicianId">
                        <TableCell class="font-medium">
                            {{ staff.technicianName }}
                        </TableCell>
                        <TableCell>
                            <div class="flex flex-col gap-1.5">
                                <span class="text-xs font-medium">{{ staff.utilization }}%</span>
                                <div class="h-2 w-full rounded-full bg-secondary/50">
                                    <div class="h-full rounded-full transition-all"
                                        :class="getProgressColor(staff.utilization)"
                                        :style="{ width: `${staff.utilization}%` }" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div class="flex items-center gap-1">
                                <span class="font-medium">{{ getRating(staff.trend) }}</span>
                                <Star class="h-3.5 w-3.5 fill-black text-black" />
                            </div>
                        </TableCell>
                        <TableCell class="text-right">
                            ${{ staff.totalRevenue.toLocaleString() }}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</template>