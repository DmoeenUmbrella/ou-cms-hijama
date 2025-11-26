<script setup>
import { onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCustomersStore } from '@/stores/useCustomersStore.js'
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton.vue'
import SectionMain from '@/components/ui/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import CardBox from '@/components/ui/CardBox.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import { mdiAccountDetails, mdiCalendarClock, mdiCash, mdiPhone, mdiEmail } from '@mdi/js'
import numeral from 'numeral'

const { t, locale } = useI18n()
const route = useRoute()
const customersStore = useCustomersStore()

// Function to trigger the fetch
const fetchClient = (id) => {
    if (id) {
        // The store handles checking if the client list is loaded before fetching the detail
        customersStore.fetchClientDetails(parseInt(id))
    }
}

// 1. Fetch on initial mount
onMounted(() => {
    fetchClient(route.params.id)
})

// 2. Watch for route changes (e.g. navigating from Client A to Client B)
watch(() => route.params.id, (newId) => {
    fetchClient(newId)
})

// Use computed property to reactively get data from the store
const client = computed(() => customersStore.selectedClient)
const history = computed(() => client.value?.session_history || [])

// Helper to get initials for the avatar
const clientInitials = computed(() => {
    if (!client.value?.name) return '??'
    return client.value.name.match(/\b(\w)/g).join('').substring(0, 2).toUpperCase()
})
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <!-- Main Content (Two Columns) -->
            <div v-if="client" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <!-- Left Column: Customer Info Summary -->
                <div class="lg:col-span-1">
                    <CardBox :title="t('info_title')"
                        bgClass="hover:bg-gray-100 transition-all duration-300 ease-in-out border shadow-md">
                        <SectionTitleLineWithButton :title="t('info_title')" no-icon />
                        <!-- Profile Card Header -->
                        <div class="flex flex-col items-center text-center mb-6">
                            <div
                                class="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-3xl text-emerald-600 mb-4 dark:bg-emerald-900 dark:text-emerald-200">
                                {{ clientInitials }}
                            </div>
                            <h3 class="font-bold text-xl">{{ client.name }}</h3>

                            <div class="flex items-center justify-center mt-2 text-gray-500 text-sm">
                                <BaseIcon :path="mdiPhone" w="w-4" h="h-4" class="mr-1" />
                                {{ client.phone }}
                            </div>
                            <div class="flex items-center justify-center mt-1 text-gray-500 text-sm"
                                v-if="client.email">
                                <BaseIcon :path="mdiEmail" w="w-4" h="h-4" class="mr-1" />
                                {{ client.email }}
                            </div>
                        </div>

                        <hr class="my-6 border-gray-100 dark:border-slate-700">

                        <!-- Summary Stats -->
                        <div class="space-y-4">
                            <!-- Total Sessions -->
                            <div class="flex items-center justify-between">
                                <span class="flex items-center text-gray-600 dark:text-gray-400">
                                    <BaseIcon :path="mdiCalendarClock" w="w-5" h="h-5" class="mr-3 text-blue-500" />
                                    {{ t('total_sessions') }}
                                </span>
                                <span class="font-bold text-lg">{{ client.total_sessions }}</span>
                            </div>

                            <!-- Total Spent -->
                            <div class="flex items-center justify-between">
                                <span class="flex items-center text-gray-600 dark:text-gray-400">
                                    <BaseIcon :path="mdiCash" w="w-5" h="h-5" class="mr-3 text-emerald-500" />
                                    {{ t('total_spent') }}
                                </span>
                                <span class="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                                    {{ numeral(client.total_spent_aed).format('0,0') }} AED
                                </span>
                            </div>

                            <!-- Last Visit -->
                            <div class="flex items-center justify-between">
                                <span class="flex items-center text-gray-600 dark:text-gray-400">
                                    <BaseIcon :path="mdiCalendarClock" w="w-5" h="h-5" class="mr-3 text-purple-500" />
                                    {{ t('last_visit') }}
                                </span>
                                <span class="font-bold text-lg">{{ client.last_visit_date }}</span>
                            </div>
                        </div>

                    </CardBox>
                </div>

                <!-- Right Column: Session History Table -->
                <div class="lg:col-span-2 border px-6 rounded-2xl">
                    <CardBox :title="t('session_history')" has-table>
                        <SectionTitleLineWithButton :title="t('session_history')" no-icon />

                        <div v-if="history.length === 0" class="p-8 text-center text-gray-500">
                            {{ $t('no_session_history') }}
                        </div>

                        <div v-else class="overflow-x-auto relative border rounded-md">
                            <table class="min-w-full border-collapse table-auto">
                                <thead class="bg-gray-100 dark:bg-slate-700 sticky top-0 z-10">
                                    <tr>
                                        <th class="p-4 rounded-tl-lg">{{ t('table.session') }}</th>
                                        <th class="p-4">{{ t('table.date') }}</th>
                                        <th class="p-4">{{ t('table.service') }}</th>
                                        <th class="p-4 text-right">{{ t('table.duration') }}</th>
                                        <th class="p-4 rounded-tr-lg text-right">{{ t('table.price') }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="session in history" :key="session.session_number"
                                        class="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                                        <td class="p-4 font-medium text-gray-900 dark:text-white">
                                            #{{ session.session_number }}
                                        </td>
                                        <td class="p-4">{{ session.date }}</td>
                                        <td class="p-4">{{ session.service }}</td>
                                        <td class="p-4 text-right">{{ session.duration }}</td>
                                        <td class="p-4 text-right font-bold text-emerald-600">
                                            {{ numeral(session.price).format('0,0') }} AED
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardBox>
                </div>
            </div>

            <!-- Loading State -->
            <div v-else class="flex justify-center p-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>

        </SectionMain>
    </LayoutAuthenticated>
</template>