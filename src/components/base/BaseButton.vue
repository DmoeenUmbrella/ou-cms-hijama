<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import BaseIcon from '@/components/base/BaseIcon.vue'

const props = defineProps({
    label: {
        type: [String, Number],
        default: null,
    },
    icon: {
        type: String,
        default: null,
    },
    iconSize: {
        type: [String, Number],
        default: null,
    },
    href: {
        type: String,
        default: null,
    },
    target: {
        type: String,
        default: null,
    },
    to: {
        type: [String, Object],
        default: null,
    },
    type: {
        type: String as () => 'button' | 'submit' | 'reset',
        default: 'button',
    },
    color: {
        type: String,
        default: 'default', // changed default from 'white' to 'default'
    },
    as: {
        type: String,
        default: null,
    },
    small: Boolean,
    outline: Boolean,
    active: Boolean,
    disabled: Boolean,
    roundedFull: Boolean,
})

// Map your legacy 'color' and 'outline' props to Shadcn variants
const variant = computed(() => {
    if (props.outline) return 'outline'
    if (props.color === 'danger') return 'destructive'
    if (props.color === 'white' || props.color === 'light') return 'secondary'
    if (props.color === 'info') return 'default' // or 'secondary' based on preference
    if (props.color === 'success') return 'default' // Shadcn usually just has primary/secondary
    if (props.color === 'warning') return 'secondary' // Mapping to secondary often works well
    if (!props.label && !props.outline) return 'ghost' // Icon-only buttons often look good as ghost
    return 'default'
})

const size = computed(() => {
    if (props.small) return 'sm'
    if (!props.label && props.icon) return 'icon'
    return 'default'
})

const is = computed(() => {
    if (props.as) return props.as
    if (props.to) return RouterLink
    if (props.href) return 'a'
    return 'button'
})
</script>

<template>
    <Button :as="is" :variant="variant" :size="size" :class="[
        roundedFull ? 'rounded-full' : '',
        active ? 'bg-accent text-accent-foreground' : ''
    ]" :to="to" :href="href" :target="target" :type="type" :disabled="disabled">
        <BaseIcon v-if="icon" :path="icon" :size="iconSize" :class="label ? 'mr-2 h-4 w-4' : 'h-4 w-4'" />
        <span v-if="label">{{ label }}</span>
    </Button>
</template>