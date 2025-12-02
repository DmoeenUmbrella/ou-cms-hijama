<script setup lang="ts">
import { onMounted } from 'vue'
import { toast } from 'vue-sonner'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import FollowUpSection from '@/components/followup/followUpSection.vue'
import { useFollowupStore } from '@/modules/patients/stores/useFollowUpStore'

const followupStore = useFollowupStore()

// Fetch initial data
const fetchInitialData = async () => {
  try {
    await Promise.all([
      followupStore.fetchFollowUpsByStatus('upcoming', 1),
      followupStore.fetchFollowUpsByStatus('past', 1),
      followupStore.fetchFollowUpsByStatus(undefined, 1), // Fetch all
    ])
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch follow-ups')
  }
}

// Handle page change
const handlePageChange = async (type: 'upcoming' | 'past' | 'all', page: number) => {
  try {
    if (type === 'all') {
      await followupStore.fetchFollowUpsByStatus(undefined, page)
    } else {
      await followupStore.fetchFollowUpsByStatus(type, page)
    }
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch follow-ups')
  }
}

// Handle refresh
const handleRefreshFollowUps = async () => {
  await fetchInitialData()
}

onMounted(async () => {
  await fetchInitialData()
})
</script>

<template>
  <LayoutAuthenticated>
    <div class="container mx-auto p-6">
      <!-- Follow-up List Section -->
      <!-- isClientView defaults to false, so composable uses store data directly -->
      <FollowUpSection 
        :upcoming-follow-ups="[]"
        :past-follow-ups="[]"
        :upcoming-total="0"
        :past-total="0"
        :is-loading="followupStore.isLoading"
        :current-customer="null"
        @page-change="handlePageChange"
        @refresh-followups="handleRefreshFollowUps"
      />
    </div>
  </LayoutAuthenticated>
</template>
