<script setup lang="ts">
import { ref, provide } from 'vue'
import { FileSpreadsheet, MessageSquare } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BaseDateFilter from '@/components/base/BaseDateFilter.vue'
import { useReport } from '@/modules/reports/composables/report.composable'

// Section Components
import PatientReportsSection from '@/modules/reports/components/PatientReportsSection.vue'
import SessionReportsSection from '@/modules/reports/components/SessionReportsSection.vue'
import FollowupReportsSection from '@/modules/reports/components/FollowupReportsSection.vue'
import SmsCommunicationSection from '@/modules/reports/components/SmsCommunicationSection.vue'

const {
  t,
  isLoading,
  currentFilterType,
  customStartDate,
  customEndDate,
  dateRangeOptions,
  handleFilterTypeChange,
  handleStartDateChange,
  handleEndDateChange,
  handleApplyFilter,
} = useReport()

// Filter version to trigger refetch in child components
const filterVersion = ref(0)
provide('reportFilterVersion', filterVersion)

const handleExportAllReports = () => {
  toast.info(t('common.feature_coming_soon'))
}

const handleSendSMS = () => {
  toast.info(t('common.feature_coming_soon'))
}

const onApplyFilter = () => {
  handleApplyFilter()
  // Increment version to trigger refetch in all section components
  filterVersion.value++
  toast.success(t('reports.filters.filter_applied'))
}
</script>

<template>
  <LayoutAuthenticated>
    <div class="flex-1 space-y-6 p-8 pt-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-tight">{{ t('reports.title') }}</h2>
          <p class="text-muted-foreground">{{ t('reports.subtitle') }}</p>
        </div>
        <div class="flex items-center gap-3">
          <Button 
            variant="outline" 
            class="gap-2"
            @click="handleExportAllReports"
          >
            <FileSpreadsheet class="h-4 w-4" />
            {{ t('reports.export_all') }}
          </Button>
          <Button 
            class="gap-2"
            @click="handleSendSMS"
          >
            <MessageSquare class="h-4 w-4" />
            {{ t('reports.send_sms') }}
          </Button>
        </div>
      </div>

      <!-- Date Filter Section -->
      <BaseDateFilter
        :model-value="currentFilterType"
        :start-date="customStartDate"
        :end-date="customEndDate"
        :options="dateRangeOptions"
        :is-loading="isLoading"
        @update:model-value="handleFilterTypeChange"
        @update:start-date="handleStartDateChange"
        @update:end-date="handleEndDateChange"
        @apply="onApplyFilter"
      />

      <!-- Tabs Section -->
      <Tabs default-value="patient-reports" class="space-y-4">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="patient-reports">
            {{ t('reports.tabs.patient_reports') }}
          </TabsTrigger>
          <TabsTrigger value="session-reports">
            {{ t('reports.tabs.session_reports') }}
          </TabsTrigger>
          <TabsTrigger value="followup-reports">
            {{ t('reports.tabs.followup_reports') }}
          </TabsTrigger>
          <TabsTrigger value="sms-communication">
            {{ t('reports.tabs.sms_communication') }}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patient-reports" class="space-y-4">
          <PatientReportsSection />
        </TabsContent>

        <TabsContent value="session-reports" class="space-y-4">
          <SessionReportsSection />
        </TabsContent>

        <TabsContent value="followup-reports" class="space-y-4">
          <FollowupReportsSection />
        </TabsContent>

        <TabsContent value="sms-communication" class="space-y-4">
          <SmsCommunicationSection />
        </TabsContent>
      </Tabs>
      
    </div>
  </LayoutAuthenticated>
</template>
