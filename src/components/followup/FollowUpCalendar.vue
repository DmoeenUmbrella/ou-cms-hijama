<script setup lang="ts">
import { onMounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useFollowUpCalendar } from '@/modules/patients/composables/calendar.composable'

const {
  calendarGrid,
  isLoading,
  isRTL,
  displayMonthYear,
  displayMonthName,
  displayWeekDays,
  getDayNumber,
  isToday,
  toArabicNumerals,
  goToPreviousMonth,
  goToNextMonth,
  initializeCalendar,
  totalScheduledFollowUps,
} = useFollowUpCalendar()

onMounted(() => {
  initializeCalendar()
})
</script>

<template>
  <Card class="w-full">
    <CardContent class="p-6">
      <!-- Calendar Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">{{ displayMonthYear }}</h2>
        <div class="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            @click="goToPreviousMonth"
            :disabled="isLoading"
          >
            <ChevronLeft v-if="!isRTL" class="h-4 w-4" />
            <ChevronRight v-else class="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            @click="goToNextMonth"
            :disabled="isLoading"
          >
            <ChevronRight v-if="!isRTL" class="h-4 w-4" />
            <ChevronLeft v-else class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <!-- Week Days Header -->
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div
          v-for="day in displayWeekDays"
          :key="day"
          class="text-center text-sm font-medium text-muted-foreground py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div v-if="isLoading" class="grid grid-cols-7 gap-2">
        <div
          v-for="i in 35"
          :key="i"
          class="h-14 rounded-lg bg-muted/50 animate-pulse"
        />
      </div>

      <div v-else class="grid grid-cols-7 gap-2">
        <div
          v-for="(day, index) in calendarGrid"
          :key="index"
          class="relative h-14 flex items-center justify-center rounded-lg transition-colors"
          :class="{
            'bg-transparent': day.isEmpty,
            'bg-primary text-primary-foreground': !day.isEmpty && isToday(day.date),
            'bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800': !day.isEmpty && !isToday(day.date) && day.isCreated,
            'hover:bg-muted cursor-pointer': !day.isEmpty && !isToday(day.date) && !day.isCreated,
          }"
        >
          <template v-if="!day.isEmpty">
            <span 
              class="text-sm font-medium"
              :class="{
                'text-primary-foreground': isToday(day.date),
                'text-amber-800 dark:text-amber-200': !isToday(day.date) && day.isCreated,
              }"
            >
              {{ toArabicNumerals(getDayNumber(day.date)) }}
            </span>
            <!-- Event indicator dot -->
            <span
              v-if="day.isCreated && day.followUps.length > 0"
              class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500"
            />
          </template>
        </div>
      </div>

      <!-- Monthly Follow-Ups Summary Section -->
      <div class="mt-6 pt-6 border-t">
        <h3 class="text-lg font-bold mb-4">{{ displayMonthName }}'s Follow-Ups</h3>
        <div class="flex items-center justify-between py-3 border-b">
          <span class="text-muted-foreground">Scheduled</span>
          <span class="text-xl font-bold">{{ toArabicNumerals(totalScheduledFollowUps) }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
