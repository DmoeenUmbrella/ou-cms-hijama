<script setup lang="ts">
import { computed, ref, h, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
// Updated path to reflect the modular structure, assuming it's correct
import { usePatientStore } from '@/modules/patients/stores/usePatientStore'
import type { Patient } from '@/types/appointment' // Correct type
import type { ColumnDef } from '@/types/table'
import { useDebounceFn } from '@vueuse/core'
import { format } from 'date-fns'

// Shadcn & TanStack
import {
    useVueTable,
    getCoreRowModel,
    createColumnHelper,
    getPaginationRowModel,
    FlexRender
} from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

// Icons
import {
    Search,
    Calendar as CalendarIcon,
    Eye,
    Pencil,
    Trash2,
    PlusCircle,
    CalendarClock,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-vue-next'

const emit = defineEmits([
    'create-session',
    'create-follow-up',
    'edit-patient',
    'delete-patient'
])

const { t } = useI18n()
const router = useRouter()
const store = usePatientStore() // This store now handles 'patients'

// --- State for Filters ---
const searchQuery = ref(store.filters.keyword)
const dateFilter = ref<Date | undefined>(store.filters.date ? new Date(store.filters.date) : undefined)

// --- Debounced Search ---
const debouncedSearch = useDebounceFn((query: string) => {
    store.filters.keyword = query
    store.filters.page = 1
    store.fetchPatients() // Trigger fetch action for patient list
}, 500)

// Watch for input changes
watch(searchQuery, (newVal) => {
    debouncedSearch(newVal)
})

// Watch for Date Filter
watch(dateFilter, (newDate) => {
    store.filters.date = newDate ? format(newDate, 'yyyy-MM-dd') : null
    store.filters.page = 1
    store.fetchPatients()
})

const clearDateFilter = () => {
    dateFilter.value = undefined
}

// --- Table Data (Robust Check) ---
const data = computed<Patient[]>(() => {
    // FIX: Use the robust array check suggested by the user
    return Array.isArray(store.filteredPatients) ? store.filteredPatients : []
})

// --- Column Definitions ---
const columnHelper = createColumnHelper<Patient>()

const columns = computed<ColumnDef<Patient>[]>(() => [
    // 1. Name
    columnHelper.accessor('name', {
        header: () => h('div', { class: 'text-left font-semibold' }, t('customers.table.columns.name')),
        cell: ({ row }) => h('div', { class: 'font-medium text-primary' }, row.original.name),
        minSize: 180,
    }),

    // 2. Phone
    columnHelper.accessor('phone', {
        header: () => h('div', { class: 'text-left' }, t('customers.table.columns.phone')),
        cell: (info) => info.getValue(),
    }),

    // 3. Gender
    columnHelper.accessor('gender', {
        header: () => h('div', { class: 'text-center' }, t('customers.table.columns.gender')),
        cell: (info) => h('div', { class: 'text-center' }, info.getValue()),
        size: 100,
    }),

    // 4. Total Sessions
    columnHelper.accessor('totalSessions', {
        header: () => h('div', { class: 'text-center' }, t('customers.table.columns.total_sessions')),
        cell: ({ row }) => h('div', { class: 'text-center font-bold' }, row.original.totalSessions),
        size: 100,
    }),

    // 5. Last Session Date
    columnHelper.accessor('lastSessionDate', {
        header: () => h('div', { class: 'text-right' }, t('customers.table.columns.last_visit')),
        cell: ({ row }) => h('div', { class: 'text-right' }, row.original.lastSessionDate || '-'),
        size: 120,
    }),

    // 6. Actions Column
    columnHelper.display({
        id: 'actions',
        header: () => h('div', { class: 'text-center' }, t('button.actions')),
        cell: ({ row }) => h('div', { class: 'flex justify-center items-center gap-1' }, [

            // Action: Create Session (Existing Walk-In)
            h(Button, {
                variant: 'ghost', size: 'icon',
                title: t('appointment.table.create_session'),
                onClick: () => emit('create-session', row.original)
            }, () => h(PlusCircle, { class: 'h-4 w-4 text-emerald-600' })),

            // Action: Create Follow-Up
            h(Button, {
                variant: 'ghost', size: 'icon',
                title: t('appointment.table.create_follow_up'),
                onClick: (d, j) => {
                    debugger
                    emit('create-follow-up', row.original)
                }
            }, () => h(CalendarClock, { class: 'h-4 w-4 text-blue-600' })),

            // Action: View Details (Redirect to Patient Detail View)
            h(Button, {
                variant: 'ghost', size: 'icon',
                title: t('appointment.table.view_details'),
                onClick: () => router.push({ name: 'customer-details', params: { id: row.original.id } })
            }, () => h(Eye, { class: 'h-4 w-4 text-gray-500' })),

            // Action: Edit Patient
            h(Button, {
                variant: 'ghost', size: 'icon',
                title: t('appointment.table.edit_patient'),
                onClick: () => emit('edit-patient', row.original)
            }, () => h(Pencil, { class: 'h-4 w-4 text-amber-500' })),

            // Action: Delete Patient
            h(Button, {
                variant: 'ghost', size: 'icon',
                title: t('button.delete'),
                onClick: () => emit('delete-patient', row.original)
            }, () => h(Trash2, { class: 'h-4 w-4 text-destructive' })),
        ]),
        size: 180,
    }),
]);

// --- Table Instance ---
const table = useVueTable({
    get data() { return data.value },
    columns: columns.value,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination: { pageSize: 10, pageIndex: 0 },
    }
})

// --- Pagination Controls ---
const currentPage = computed(() => table.getState().pagination.pageIndex + 1)
const totalPages = computed(() => table.getPageCount())
</script>

<template>
    <div class="space-y-4">

        <!-- FILTERS SECTION -->
        <div
            class="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center bg-card p-4 rounded-lg border shadow-sm">

            <!-- Search Input -->
            <div class="relative w-full sm:w-72">
                <Search class="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input v-model="searchQuery" type="search"
                    :placeholder="t('appointment.search_placeholder') || 'Search name or phone...'" class="ps-9" />
            </div>

            <!-- Date Filter -->
            <div class="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger as-child>
                        <Button variant="outline" :class="cn(
                            'w-[240px] justify-start text-left font-normal',
                            !dateFilter && 'text-muted-foreground'
                        )">
                            <CalendarIcon class="me-2 h-4 w-4" />
                            <span>{{ dateFilter ? format(dateFilter, 'PPP') : (t('appointment.filter_by_date') ||
                                'Filter by date') }}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0" align="end">
                        <Calendar v-model="dateFilter" mode="single" initial-focus />
                    </PopoverContent>
                </Popover>

                <!-- Clear Date Button -->
                <Button v-if="dateFilter" variant="ghost" size="icon" @click="clearDateFilter">
                    <X class="h-4 w-4" />
                </Button>
            </div>
        </div>

        <!-- TABLE SECTION -->
        <div class="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                :props="header.getContext()" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                            </TableCell>
                        </TableRow>
                    </template>
                    <TableRow v-else>
                        <TableCell :colspan="columns.length" class="h-24 text-center">
                            {{ t('appointment.no_appointments_found') || 'No patients found.' }}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <!-- PAGINATION -->
        <div class="flex items-center justify-end space-x-2 py-4 px-4 border-t">
            <div class="flex-1 text-sm text-muted-foreground">
                Page {{ currentPage }} of {{ totalPages }}
            </div>
            <div class="space-x-2">
                <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()"
                    @click="table.previousPage()">
                    <ChevronLeft class="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
                    <ChevronRight class="h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
</template>