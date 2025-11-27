<script setup lang="ts">
import { computed } from 'vue'
import type { Appointment } from '@/api/endpoints/customer/queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'

const props = defineProps<{
  sessions: Appointment[]
}>()

const formattedSessions = computed(() => {
  return props.sessions.map(session => ({
    id: session.id,
    sessionNumber: `#${session.id}`,
    date: format(new Date(session.date), 'yyyy-MM-dd'),
    service: session.notes || 'Hijama Session',
    duration: '-', // API doesn't provide duration
    price: session.price,
    numberOfCups: session.numberOfCups,
    notes: session.notes
  }))
})
</script>

<template>
  <div class="rounded-md border bg-card">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Cups</TableHead>
          <TableHead class="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="formattedSessions.length === 0">
          <TableCell colspan="5" class="text-center py-8 text-muted-foreground">
            No sessions found
          </TableCell>
        </TableRow>
        <TableRow v-for="session in formattedSessions" :key="session.id" v-else>
          <TableCell class="font-medium">{{ session.sessionNumber }}</TableCell>
          <TableCell>{{ session.date }}</TableCell>
          <TableCell>{{ session.service }}</TableCell>
          <TableCell>{{ session.numberOfCups }}</TableCell>
          <TableCell class="text-right font-semibold text-emerald-600">
            {{ session.price }} AED
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
