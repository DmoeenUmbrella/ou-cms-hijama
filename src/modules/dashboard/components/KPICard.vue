<!-- src/modules/dashboard/components/KPICard.vue -->
<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import type { KPICard as KPICardType } from '../types/dashboard';

interface Props {
    title: string;
    value: string | number;
    trend: number;
    trendDirection: 'up' | 'down';
    description: string;
    icon?: string;
    color: string;
}

const props = defineProps<Props>();

const getBorderColor = (color: string) => {
    const colors: Record<string, string> = {
        primary: 'border-l-primary',
        success: 'border-l-green-500',
        warning: 'border-l-yellow-500',
        danger: 'border-l-red-500'
    };
    return colors[color] || 'border-l-primary';
};

const getTrendIcon = (direction: 'up' | 'down') => {
    return direction === 'up' ? '↗' : '↘';
};

const getTrendClass = (direction: 'up' | 'down') => {
    return direction === 'up' ? 'text-green-600' : 'text-red-600';
};
</script>

<template>
    <Card class="relative overflow-hidden">
        <CardContent class="p-6">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
                    <p class="text-3xl font-bold mt-2">{{ value }}</p>
                    <div class="flex items-center gap-1 mt-2">
                        <span :class="['text-sm font-medium', getTrendClass(trendDirection)]">
                            {{ getTrendIcon(trendDirection) }} {{ trend }}%
                        </span>
                        <span class="text-sm text-muted-foreground">{{ description }}</span>
                    </div>
                </div>
                <div v-if="icon" class="text-2xl">
                    {{ icon }}
                </div>
            </div>
        </CardContent>
        <div :class="['absolute left-0 top-0 h-full w-1', getBorderColor(color)]"></div>
    </Card>
</template>