<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import type { Component } from 'vue'
import BaseLogo from '../base/BaseLogo.vue'

// Define the shape of your menu items matching src/menuAside.ts
interface MenuItem {
    to?: string
    label?: string
    icon?: Component
    isLogout?: boolean
}

defineProps<{
    menu: MenuItem[]
}>()

const route = useRoute()
const emit = defineEmits(['menu-click'])

function handleClick(item: MenuItem, e: Event) {
    emit('menu-click', e, item)
}

// Helper to determine if a route is active
const isActive = (item: MenuItem) => {
    if (!item.to) return false
    return route.path === item.to
}
</script>

<template>
    <div
        class="pb-12 min-h-screen w-full border-r bg-gray-50 dark:bg-gray-950">
        <div class="flex align-center mb-2 py-2 justify-center">
            <BaseLogo width="100" />
        </div>
        <div class="space-y-4 py-4">
            <div class="px-3 py-2">
                <nav class="space-y-1">
                    <template v-for="(item, index) in menu" :key="index">
                        <Button v-if="item.label" :variant="isActive(item) ? 'secondary' : 'ghost'"
                            class="w-full justify-start gap-2" as-child @click="(e: Event) => handleClick(item, e)">
                            <!-- Render as RouterLink if 'to' exists -->
                            <router-link v-if="item.to" :to="item.to">
                                <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                                {{ $t(item.label) }}
                            </router-link>

                            <!-- Render as Span if no link (e.g., Logout) -->
                            <span v-else class="flex w-full items-center gap-2 cursor-pointer">
                                <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                                {{ $t(item.label) }}
                            </span>
                        </Button>
                    </template>
                </nav>
            </div>
        </div>
    </div>
</template>