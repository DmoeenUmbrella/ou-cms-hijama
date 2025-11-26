<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    path: { type: String, required: true },
    w: { type: String, default: 'w-6' },
    h: { type: String, default: 'h-6' },
    size: { type: [Number, String], default: null },
    class: String,
})

const spanClass = computed(() => {
    return `inline-flex justify-center items-center ${props.w} ${props.h} ${props.class || ''}`
})
</script>

<template>
    <span :class="spanClass">
        <svg viewBox="0 0 24 24" :width="size" :height="size" class="fill-current">
            <path :d="path" />
        </svg>
    </span>
</template>