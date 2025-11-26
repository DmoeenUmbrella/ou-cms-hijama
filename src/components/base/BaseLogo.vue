<script setup lang="ts">
import { computed } from 'vue'
import logo from '@/assets/images/common/logo.jpg'

// define props
const props = defineProps({
    width: { type: [String, Number], default: 64 },  // px or string like '64'
    height: { type: [String, Number], default: 64 },
    alt: { type: String, default: 'Logo' },
    src: { type: String, default: logo },
})

// optional: ensure width/height are strings with 'px' if number
const imgWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width))
const imgHeight = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height))
</script>

<template>
    <img :src="src" :alt="props.alt" :width="imgWidth" :height="imgHeight" class="object-contain" />
</template>
