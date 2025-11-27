<script setup lang="ts">
import { ref, computed } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { dummyClientsResponse } from '../composables/dummyClients'
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

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Get all clients from dummy data
const allClients = computed(() => dummyClientsResponse.data)

// Calculate total pages
const totalPages = computed(() => Math.ceil(allClients.value.length / itemsPerPage.value))

// Get paginated data
const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return allClients.value.slice(start, end)
})

// Selected rows
const selectedRows = ref<number[]>([])

// Toggle all rows selection
const toggleAll = (checked: boolean) => {
  if (checked) {
    selectedRows.value = paginatedClients.value.map(client => client.id)
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
  return paginatedClients.value.length > 0 && 
    paginatedClients.value.every(client => selectedRows.value.includes(client.id))
})

// Pagination controls
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Emit events for parent component
const emit = defineEmits(['edit', 'delete'])

const handleEdit = (client: any) => {
  emit('edit', client)
}

const handleDelete = (client: any) => {
  emit('delete', client)
}
</script>

<template>
  <div class="w-full">
    <div class="rounded-md border">
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
            <TableHead>Phone Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="client in paginatedClients" :key="client.id">
            <TableCell>
              <Checkbox 
                :checked="selectedRows.includes(client.id)" 
                @update:checked="(checked: boolean) => toggleRow(client.id, checked)"
              />
            </TableCell>
            <TableCell class="font-medium">{{ client.name }}</TableCell>
            <TableCell>{{ client.phoneNumber }}</TableCell>
            <TableCell>{{ client.email }}</TableCell>
            <TableCell>{{ client.address || 'N/A' }}</TableCell>
            <TableCell>
              <span 
                :class="[
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                  client.isActive 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                ]"
              >
                {{ client.isActive ? 'Active' : 'Inactive' }}
              </span>
            </TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  class="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400"
                  @click="handleEdit(client)"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  class="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400"
                  @click="handleDelete(client)"
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
        {{ Math.min(currentPage * itemsPerPage, allClients.length) }} of 
        {{ allClients.length }} entries
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
