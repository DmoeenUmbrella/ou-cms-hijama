<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Pencil, Trash2, Search } from 'lucide-vue-next'
import { useTechnician } from '../composables/useTechnician'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

const { t, locale } = useI18n()

// Helper function to convert numbers to Arabic numerals
const toArabicNumerals = (num: number): string => {
  if (locale.value !== 'ar') return num.toString()
  
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)] || digit).join('')
}

// Computed property for text alignment based on locale
const isRTL = computed(() => locale.value === 'ar')
const alignEnd = computed(() => isRTL.value ? 'text-left' : 'text-right')

const { 
  technicians, 
  paginationInfo, 
  isLoading, 
  goToPage, 
  searchTechnicians 
} = useTechnician()

// Search state
const searchKeyword = ref('')
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

// Selected rows
const selectedRows = ref<number[]>([])

// Get technicians from composable
const allTechnicians = computed(() => technicians.value)
const currentPage = computed(() => paginationInfo.value.currentPage)
const totalPages = computed(() => paginationInfo.value.totalPages)
const totalCount = computed(() => paginationInfo.value.totalCount)
const itemsPerPage = computed(() => paginationInfo.value.itemsPerPage)

// Toggle all rows selection
const toggleAll = (checked: boolean) => {
  if (checked) {
    selectedRows.value = allTechnicians.value.map(technician => technician.id)
  } else {
    selectedRows.value = []
  }
}

// Toggle single row selection
const toggleRow = (id: number, checked: boolean) => {
  if (checked) {
    selectedRows.value.push(id)
  } else {
    selectedRows.value = selectedRows.value.filter((rowId: number) => rowId !== id)
  }
}

// Check if all rows are selected
const isAllSelected = computed(() => {
  return allTechnicians.value.length > 0 && 
    allTechnicians.value.every(technician => selectedRows.value.includes(technician.id))
})

// Handle search with debounce
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    searchTechnicians(searchKeyword.value)
  }, 500)
}

// Watch search keyword
watch(searchKeyword, () => {
  handleSearch()
})

// Emit events for parent component
const emit = defineEmits(['edit', 'delete'])

const handleEdit = (technician: any) => {
  emit('edit', technician)
}

const handleDelete = (technician: any) => {
  emit('delete', technician)
}
</script>

<template>
  <div class="w-full">
    <!-- Search Bar -->
    <div class="mb-4 flex items-center gap-2">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="searchKeyword"
          :placeholder="t('technicians.search_placeholder')"
          class="pl-8"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>

    <!-- Table -->
    <div v-else class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">
              <Checkbox 
                :checked="isAllSelected" 
                @update:checked="toggleAll" 
              />
            </TableHead>
            <TableHead>{{ t('technicians.table.name') }}</TableHead>
            <!-- <TableHead>{{ t('technicians.table.created_on') }}</TableHead>
            <TableHead>Last Modified</TableHead> -->
            <TableHead :class="alignEnd">{{ t('technicians.table.actions') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="allTechnicians.length === 0">
            <TableCell colspan="5" class="text-center py-8 text-muted-foreground">
              {{ t('technicians.no_technicians_found') }}
            </TableCell>
          </TableRow>
          <TableRow v-for="technician in allTechnicians" :key="technician.id" v-else>
            <TableCell>
              <Checkbox 
                :checked="selectedRows.includes(technician.id)" 
                @update:checked="(checked: boolean) => toggleRow(technician.id, checked)"
              />
            </TableCell>
            <TableCell class="font-medium">{{ technician.name }}</TableCell>
            <!-- <TableCell>{{ new Date(technician.createdOn).toLocaleDateString() }}</TableCell>
            <TableCell>{{ technician.modifiedOn ? new Date(technician.modifiedOn).toLocaleDateString() : '-' }}</TableCell> -->
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  class="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400"
                  @click="handleEdit(technician)"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  class="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400"
                  @click="handleDelete(technician)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && totalCount > 0"  class="flex items-center justify-between px-2 py-4">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        {{ t('technicians.table.showing', {
          from: toArabicNumerals((currentPage - 1) * itemsPerPage + 1),
          to: toArabicNumerals(Math.min(currentPage * itemsPerPage, totalCount)),
          total: toArabicNumerals(totalCount)
        }) }}
      </div>
      <div class="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          {{ t('technicians.table.previous') }}
        </Button>
        
        <div class="flex gap-1">
          <Button
            v-for="page in totalPages"
            :key="page"
            size="sm"
            :variant="currentPage === page ? 'default' : 'outline'"
            @click="goToPage(page)"
            v-show="page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1"
          >
            {{ toArabicNumerals(page) }}
          </Button>
        </div>        <Button 
          size="sm" 
          variant="outline" 
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          {{ t('technicians.table.next') }}
        </Button>
      </div>
    </div>
  </div>
</template>
