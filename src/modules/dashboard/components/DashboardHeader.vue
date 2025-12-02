<!-- src/modules/dashboard/components/DashboardHeader.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Download } from 'lucide-vue-next';

interface Props {
    loading: boolean;
    selectedPeriod: 'day' | 'week' | 'month';
}

interface Emits {
    (e: 'periodChange', period: 'day' | 'week' | 'month'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const exportReport = () => {
    // Implement export functionality
    console.log('Exporting report...');
};

const periodOptions = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' }
];
</script>

<template>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 class="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
            <p class="text-muted-foreground mt-1">Track your clinic's performance and metrics</p>
        </div>

        <div class="flex items-center gap-3">
            <!-- Period Selector -->
            <div class="flex items-center rounded-md border">
                <Button v-for="option in periodOptions" :key="option.value" variant="ghost" size="sm" :class="[
                    'rounded-none first:rounded-l-md last:rounded-r-md',
                    selectedPeriod === option.value
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : ''
                ]" @click="emit('periodChange', option.value)">
                    {{ option.label }}
                </Button>
            </div>

            <!-- Export Button -->
            <Button variant="outline" size="sm" @click="exportReport">
                <Download class="h-4 w-4 mr-2" />
                Export
            </Button>
        </div>
    </div>
</template>