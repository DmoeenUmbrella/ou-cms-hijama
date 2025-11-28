<script setup lang="ts">
import {
    FlexRender
} from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Icons
import {
    Search,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-vue-next'

import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePatientsTable } from '@/modules/patients/composables/table.composable'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Separator from '@/components/ui/separator/Separator.vue'

const emit = defineEmits([
    'create-session',
    'create-follow-up',
    'edit-patient',
    'delete-patient'
])

const { t } = useI18n()
const router = useRouter()

const {
    table,
    data,
    columns,
    searchQuery,
    dateFilter,
    clearDateFilter,
    currentPage,
    totalPages,
} = usePatientsTable(emit, t, router)

</script>

<template>
    <div class="space-y-4">

        <!-- FILTERS SECTION -->
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
            <!-- <div class="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center bg-card p-4 rounded-lg border shadow-sm"> -->
            <CardHeader class="px-0">
                <CardTitle class="text-lg">{{ t('appointment.list_title') }}</CardTitle>
            </CardHeader>
            <!-- Search Input -->
            <div class="relative w-full sm:w-72">
                <Search class="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input v-model="searchQuery" type="search"
                    :placeholder="t('appointment.search_placeholder') || 'Search name or phone...'" class="ps-9" />
            </div>

            <!-- Date Filter -->
            <!-- <div class="flex items-center gap-2">
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

                <Button v-if="dateFilter" variant="ghost" size="icon" @click="clearDateFilter">
                    <X class="h-4 w-4" />
                </Button>
            </div> -->
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