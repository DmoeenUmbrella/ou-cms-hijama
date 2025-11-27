<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Pencil, Trash2, Search } from 'lucide-vue-next'
import { useUser } from '../composables/useUser'
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
  users, 
  paginationInfo, 
  isLoading, 
  goToPage, 
  searchUsers 
} = useUser()

// Search state
const searchKeyword = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// Selected rows
const selectedRows = ref<number[]>([])

// Get users from composable
const allUsers = computed(() => users.value)
const currentPage = computed(() => paginationInfo.value.currentPage)
const totalPages = computed(() => paginationInfo.value.totalPages)
const totalCount = computed(() => paginationInfo.value.totalCount)
const itemsPerPage = computed(() => paginationInfo.value.itemsPerPage)

// Toggle all rows selection
const toggleAll = (checked: boolean) => {
  if (checked) {
    selectedRows.value = allUsers.value.map(user => user.id)
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
  return allUsers.value.length > 0 && 
    allUsers.value.every(user => selectedRows.value.includes(user.id))
})

// Handle search with debounce
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    searchUsers(searchKeyword.value)
  }, 500)
}

// Watch search keyword
watch(searchKeyword, () => {
  handleSearch()
})

// Emit events for parent component
const emit = defineEmits(['edit', 'delete'])

const handleEdit = (user: any) => {
  emit('edit', user)
}

const handleDelete = (user: any) => {
  emit('delete', user)
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
          placeholder="Search users..."
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
            <TableHead>First Name / Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="allUsers.length === 0">
            <TableCell colspan="7" class="text-center py-8 text-muted-foreground">
              No users found
            </TableCell>
          </TableRow>
          <TableRow v-for="user in allUsers" :key="user.id" v-else>
            <TableCell>
              <Checkbox 
                :checked="selectedRows.includes(user.id)" 
                @update:checked="(checked: boolean) => toggleRow(user.id, checked)"
              />
            </TableCell>
            <TableCell class="font-medium">
              {{ user.firstName }} {{ user.lastName }}
            </TableCell>
            <TableCell>
              <div class="flex flex-col">
                <span>{{ user.email }}</span>
                <span class="text-xs text-muted-foreground">{{ user.phoneNumber }}</span>
              </div>
            </TableCell>
            <TableCell>{{ user.phoneNumber }}</TableCell>
            <TableCell>
              <span 
                :class="[
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                  user.type === 'admin' 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                ]"
              >
                {{ user.type === 'admin' ? 'Admin' : 'User' }}
              </span>
            </TableCell>
            <TableCell>
              <span 
                :class="[
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                  user.isActive 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                ]"
              >
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </span>
            </TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  class="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400"
                  @click="handleEdit(user)"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  class="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400"
                  @click="handleDelete(user)"
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
