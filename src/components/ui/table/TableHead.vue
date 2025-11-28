<script setup lang="ts">
import { computed } from "vue"
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { useI18n } from "vue-i18n"
const { locale } = useI18n()
const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

// Detect RTL from document direction
const isRTL = computed(() => locale.value === 'ar')
const textAlign = computed(() => isRTL.value ? 'text-right' : 'text-left')
const checkboxPadding = computed(() => isRTL.value ? '[&:has([role=checkbox])]:pl-0' : '[&:has([role=checkbox])]:pr-0')
</script>

<template>
  <th
    data-slot="table-head"
    :class="cn(textAlign, checkboxPadding, 'text-foreground h-10 px-2 align-middle font-medium whitespace-nowrap [&>[role=checkbox]]:translate-y-[2px]', props.class)"
  >
    <slot />
  </th>
</template>
