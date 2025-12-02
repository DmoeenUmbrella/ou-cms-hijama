<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search, CalendarIcon } from 'lucide-vue-next'
import { format } from 'date-fns'
import { CalendarDate } from '@internationalized/date'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

export type DateRangeType = 
  | 'last7Days' 
  | 'last30Days' 
  | 'last90Days' 
  | 'thisMonth' 
  | 'lastMonth' 
  | 'last3Months' 
  | 'customRange';

export interface DateRangeOption {
  value: DateRangeType;
  label: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: DateRangeType
    startDate?: string | null
    endDate?: string | null
    options?: DateRangeOption[]
    showApplyButton?: boolean
    isLoading?: boolean
  }>(),
  {
    startDate: null,
    endDate: null,
    options: () => [],
    showApplyButton: true,
    isLoading: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: DateRangeType]
  'update:startDate': [value: string]
  'update:endDate': [value: string]
  'apply': []
}>()

const { t } = useI18n()

// Internal date values for Calendar component
const internalStartDate = ref<any>(undefined)
const internalEndDate = ref<any>(undefined)

// Convert string date to CalendarDate for Calendar
const stringToCalendarDate = (dateStr: string | null): CalendarDate | undefined => {
  if (!dateStr) return undefined
  const date = new Date(dateStr)
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

// Convert CalendarDate to JS Date for formatting
const calendarDateToJSDate = (date: any): Date | null => {
  if (!date) return null
  if ('year' in date && 'month' in date && 'day' in date) {
    return new Date(date.year, date.month - 1, date.day)
  }
  return null
}

// Convert CalendarDate to ISO string for emit
const calendarDateToString = (date: any): string => {
  if (!date) return ''
  if ('year' in date && 'month' in date && 'day' in date) {
    const month = String(date.month).padStart(2, '0')
    const day = String(date.day).padStart(2, '0')
    return `${date.year}-${month}-${day}`
  }
  return ''
}

// Initialize internal dates from props
watch(
  () => props.startDate,
  (newVal) => {
    internalStartDate.value = stringToCalendarDate(newVal)
  },
  { immediate: true }
)

watch(
  () => props.endDate,
  (newVal) => {
    internalEndDate.value = stringToCalendarDate(newVal)
  },
  { immediate: true }
)

// Watch internal dates and emit updates
watch(internalStartDate, (newVal) => {
  const dateStr = calendarDateToString(newVal)
  if (dateStr) {
    emit('update:startDate', dateStr)
  }
})

watch(internalEndDate, (newVal) => {
  const dateStr = calendarDateToString(newVal)
  if (dateStr) {
    emit('update:endDate', dateStr)
  }
})

// Default options if none provided
const defaultOptions: DateRangeOption[] = [
  { value: 'last7Days', label: t('reports.filters.last_7_days') },
  { value: 'last30Days', label: t('reports.filters.last_30_days') },
  { value: 'last90Days', label: t('reports.filters.last_90_days') },
  { value: 'thisMonth', label: t('reports.filters.this_month') },
  { value: 'lastMonth', label: t('reports.filters.last_month') },
  { value: 'last3Months', label: t('reports.filters.last_3_months') },
  { value: 'customRange', label: t('reports.filters.custom') },
]

const computedOptions = computed(() => 
  props.options.length > 0 ? props.options : defaultOptions
)

const isCustomRange = computed(() => props.modelValue === 'customRange')

// Formatted dates for display
const formattedStartDate = computed(() => {
  const jsDate = calendarDateToJSDate(internalStartDate.value)
  return jsDate ? format(jsDate, 'PPP') : t('reports.filters.select_date')
})

const formattedEndDate = computed(() => {
  const jsDate = calendarDateToJSDate(internalEndDate.value)
  return jsDate ? format(jsDate, 'PPP') : t('reports.filters.select_date')
})

const handleTypeChange = (value: any) => {
  if (typeof value === 'string') {
    emit('update:modelValue', value as DateRangeType)
  }
}

const handleApply = () => {
  emit('apply')
}
</script>

<template>
  <div class="flex flex-wrap items-end gap-4 p-4 bg-card rounded-lg border">
    <!-- Date Range Type Selector -->
    <div class="flex items-center gap-2">
      <Label class="text-sm font-semibold whitespace-nowrap">
        {{ t('reports.filters.report_period') }}:
      </Label>
      <Select :model-value="modelValue" @update:model-value="handleTypeChange">
        <SelectTrigger class="w-[180px]">
          <SelectValue :placeholder="t('reports.filters.select_range')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem 
            v-for="option in computedOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Custom Date Range Pickers (shown when customRange is selected) -->
    <template v-if="isCustomRange">
      <!-- Start Date Picker -->
      <div class="flex items-center gap-2">
        <Label class="text-sm font-semibold whitespace-nowrap">
          {{ t('reports.filters.from') }}:
        </Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button 
              variant="outline" 
              class="w-[180px] justify-start text-start font-normal"
              :class="{ 'text-muted-foreground': !internalStartDate }"
            >
              <CalendarIcon class="me-2 h-4 w-4" />
              <span>{{ formattedStartDate }}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar v-model="internalStartDate" mode="single" initial-focus />
          </PopoverContent>
        </Popover>
      </div>

      <!-- End Date Picker -->
      <div class="flex items-center gap-2">
        <Label class="text-sm font-semibold whitespace-nowrap">
          {{ t('reports.filters.to') }}:
        </Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button 
              variant="outline" 
              class="w-[180px] justify-start text-start font-normal"
              :class="{ 'text-muted-foreground': !internalEndDate }"
            >
              <CalendarIcon class="me-2 h-4 w-4" />
              <span>{{ formattedEndDate }}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar v-model="internalEndDate" mode="single" initial-focus />
          </PopoverContent>
        </Popover>
      </div>
    </template>

    <!-- Apply Filter Button -->
    <Button 
      v-if="showApplyButton"
      variant="outline" 
      class="gap-2"
      :disabled="isLoading || (isCustomRange && (!startDate || !endDate))"
      @click="handleApply"
    >
      <Search class="h-4 w-4" />
      {{ t('reports.filters.apply_filter') }}
    </Button>
  </div>
</template>
