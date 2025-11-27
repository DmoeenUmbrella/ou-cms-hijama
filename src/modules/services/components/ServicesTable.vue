<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Pencil, Trash2, Search } from 'lucide-vue-next'
import { useService } from '../composables/useService'
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

const { 
  services, 
  paginationInfo, 
  isLoading, 
  goToPage, 
  searchServices 
} = useService()

// Search state
const searchKeyword = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// Selected rows
const selectedRows = ref<number[]>([])

// Get services from composable
const allServices = computed(() => services.value)
const currentPage = computed(() => paginationInfo.value.currentPage)
const totalPages = computed(() => paginationInfo.value.totalPages)
const totalCount = computed(() => paginationInfo.value.totalCount)
const itemsPerPage = computed(() => paginationInfo.value.itemsPerPage)

// Toggle all rows selection
const toggleAll = (checked: boolean) => {
  if (checked) {
    selectedRows.value = allServices.value.map(service => service.id)
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
  return allServices.value.length > 0 && 
    allServices.value.every(service => selectedRows.value.includes(service.id))
})

// Handle search with debounce
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    searchServices(searchKeyword.value)
  }, 500)
}

// Watch search keyword
watch(searchKeyword, () => {
  handleSearch()
})

// Emit events for parent component
const emit = defineEmits(['edit', 'delete'])

const handleEdit = (service: any) => {
  emit('edit', service)
}

const handleDelete = (service: any) => {
  emit('delete', service)
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
          placeholder="Search services..."
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
            <TableHead>Name</TableHead>
            <TableHead>Duration (min)</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="allServices.length === 0">
            <TableCell colspan="6" class="text-center py-8 text-muted-foreground">
              No services found
            </TableCell>
          </TableRow>
          <TableRow v-for="service in allServices" :key="service.id" v-else>
            <TableCell>
              <Checkbox 
                :checked="selectedRows.includes(service.id)" 
                @update:checked="(checked: boolean) => toggleRow(service.id, checked)"
              />
            </TableCell>
            <TableCell class="font-medium">{{ service.name }}</TableCell>
            <TableCell>{{ service.duration }}</TableCell>
            <TableCell>{{ service.description || '-' }}</TableCell>
            <TableCell>${{ service.amount }}</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  class="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400"
                  @click="handleEdit(service)"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  class="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400"
                  @click="handleDelete(service)"
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
    <div class="flex items-center justify-between px-2 py-4">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to 
        {{ Math.min(currentPage * itemsPerPage, totalCount) }} of 
        {{ totalCount }} entries
      </div>
      <div class="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
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
            {{ page }}
          </Button>
        </div>

        <Button 
          size="sm" 
          variant="outline" 
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
