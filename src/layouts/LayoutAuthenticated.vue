<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
// @ts-ignore - Assuming these files exist from your previous project structure
// @ts-ignore
import { useDarkModeStore } from '@/stores/darkMode.js'

import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Button from '@/components/ui/button/Button.vue'
import menuAside from '@/constants/menuAside'
import menuNavBar from '@/constants/menuNavBar'
import { useTheme } from '@/composables/global/theme.composable'
import { useAuth } from '@/composables/auth.composable'

const router = useRouter()
// const darkModeStore = useDarkModeStore()
const { locale } = useI18n()
const theme = useTheme();
const { logout } = useAuth();

// Simplified menu click handler
const menuClick = (event: Event, item: any) => {
  // if (item.isToggleLightDark) darkModeStore.set()
  if (item.isToggleLightDark) theme.toggle()
  if (item.isLogout) logout()

  if (item.locale) item.method(item.locale)
}
</script>

<template>
  <div class="min-h-screen font-sans antialiased" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Desktop Sidebar: Hidden on mobile, fixed on desktop -->
    <aside class="fixed inset-y-0 start-0 z-20 hidden w-64 flex-col border-e bg-card md:flex">
      <AppSidebar :menu="menuAside" @menu-click="menuClick" />
    </aside>

    <!-- Main Content Area -->
    <div class="flex flex-col md:ps-64 min-h-screen transition-all duration-300">

      <!-- Header -->
      <AppHeader :menu="menuNavBar" @menu-click="menuClick">
        <template #actions>
          <Button variant="ghost" size="sm">User</Button>
        </template>
      </AppHeader>

      <!-- Page Content -->
      <main class="flex-1 p-4 sm:px-6 sm:py-6 bg-muted/10">
        <slot />
      </main>

    </div>
  </div>
</template>