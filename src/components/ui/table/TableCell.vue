<script setup lang="ts">
import { computed } from "vue"
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { useI18n } from "vue-i18n"

const { locale } = useI18n()

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const isRTL = computed(() => locale.value === 'ar')
const checkboxPadding = computed(() => isRTL.value ? '[&:has([role=checkbox])]:pl-0' : '[&:has([role=checkbox])]:pr-0')
</script>

<template>
  <td
    data-slot="table-cell"
    :class="
      cn(
        'p-2 align-middle whitespace-nowrap [&>[role=checkbox]]:translate-y-[2px]',
        checkboxPadding,
        props.class,
      )
    "
  >
    <slot />
  </td>
</template>
