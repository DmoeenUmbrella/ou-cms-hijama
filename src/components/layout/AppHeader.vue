<script setup lang="ts">
import { ref } from 'vue'
import {
    DialogRoot,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogClose
} from 'radix-vue'
import { Menu, X, ChevronDown } from 'lucide-vue-next'
import AppSidebar from './AppSidebar.vue'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

defineProps<{
    menu: any[]
}>()

const emit = defineEmits(['menu-click'])
const isMobileOpen = ref(false)

function handleMenuClick(item: any, event?: Event) {
    emit('menu-click', event, item)
}

function handleMobileClick(event: Event, item: any) {
    handleMenuClick(item, event)
    isMobileOpen.value = false
}

// Helper to get initials from name
function getInitials(name: string) {
    return name ? name.substring(0, 2).toUpperCase() : 'US'
}
</script>

<template>
    <header
        class="
            sticky py-2 top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:px-6
        ">

        <!-- Mobile Menu Trigger (Sheet using Radix Primitives) -->
        <DialogRoot v-model:open="isMobileOpen">
            <DialogTrigger as-child>
                <Button variant="outline" size="icon" class="md:hidden">
                    <Menu class="h-5 w-5" />
                    <span class="sr-only">Toggle Menu</span>
                </Button>
            </DialogTrigger>

            <DialogPortal>
                <DialogOverlay
                    class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <DialogContent
                    class="fixed inset-y-0 start-0 z-50 h-full w-3/4 gap-4 border-e bg-background p-0 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm">

                    <div class="flex flex-col h-full">
                        <div class="p-4 flex justify-end">
                            <DialogClose as-child>
                                <Button variant="ghost" size="icon">
                                    <X class="w-4 h-4" />
                                </Button>
                            </DialogClose>
                        </div>
                        <!-- Sidebar content for mobile -->
                        <AppSidebar :menu="menu" @menu-click="handleMobileClick" />
                    </div>

                </DialogContent>
            </DialogPortal>
        </DialogRoot>

        <!-- Breadcrumbs / Title placeholder -->
        <div class="flex-1"></div>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-2">
            <template v-for="(item, index) in menu" :key="index">

                <!-- TYPE A: Dropdown Menu (e.g., User Profile, Language) -->
                <DropdownMenu v-if="item.menu">
                    <DropdownMenuTrigger as-child>

                        <!-- Trigger: User Avatar -->
                        <Button v-if="item.isCurrentUser" variant="ghost" class="relative h-8 w-8 rounded-full">
                            <Avatar class="h-8 w-8">
                                <AvatarImage src="/avatars/01.png" alt="User" />
                                <AvatarFallback>{{ getInitials('Admin User') }}</AvatarFallback>
                            </Avatar>
                        </Button>

                        <!-- Trigger: Standard Icon + Label (e.g., Translate) -->
                        <Button v-else variant="ghost" size="sm" class="gap-2">
                            <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                            <span class="hidden lg:inline-block" v-if="item.label && !item.isDesktopNoLabel">
                                {{ $t(item.label) }}
                            </span>
                            <ChevronDown class="h-4 w-4 opacity-50" />
                        </Button>

                    </DropdownMenuTrigger>

                    <!-- Dropdown Content -->
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel v-if="item.label && !item.isCurrentUser">
                            {{ $t(item.label) }}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator v-if="item.label && !item.isCurrentUser" />

                        <DropdownMenuItem v-for="(subItem, subIndex) in item.menu" :key="subIndex"
                            @click="handleMenuClick(subItem)" class="cursor-pointer">
                            <component :is="subItem.icon" v-if="subItem.icon" class="mr-2 h-4 w-4" />
                            <span>{{ $t(subItem.label) }}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <!-- TYPE B: Direct Action Button (e.g., Theme Toggle, Logout) -->
                <Button v-else variant="ghost" size="icon" @click="handleMenuClick(item)"
                    :title="item.label ? $t(item.label) : ''">
                    <component :is="item.icon" v-if="item.icon" class="h-5 w-5" />
                    <span class="sr-only">{{ item.label ? $t(item.label) : '' }}</span>
                </Button>

            </template>
        </div>
    </header>
</template>