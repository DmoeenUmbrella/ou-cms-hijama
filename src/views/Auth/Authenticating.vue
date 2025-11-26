<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/auth.composable'
import { AlertCircle, ArrowLeft } from 'lucide-vue-next'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'
import LayoutGuest from '@/layouts/LayoutGuest.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n() // Assuming you have translation keys or will use fallbacks
const { exchangeCode, isAuthenticating, authError } = useAuth()

const handleBackToLogin = () => {
    router.replace('/dashboard')
}

onMounted(() => {
    const code = route.query.code as string

    if (code) {
        // We have a code, exchange it
        exchangeCode(code)
    } else {
        // No code found? Invalid state
        console.warn('No auth code present in URL')
        // Optional: Auto-redirect or show error
        // router.replace('/login')
    }
})
const direction = computed(() => "ltr");

</script>

<template>
    <LayoutGuest :dir="direction">
        <div class="min-h-screen flex items-center justify-center 
             bg-linear-to-br from-indigo-500 to-purple-600
             dark:bg-background p-4">

            <Card class="w-full max-w-md shadow-lg">

                <!-- Branding / Header -->
                <CardHeader class="text-center space-y-2">
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                        <!-- Placeholder Logo: You can replace this with your actual SVG logo -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="h-6 w-6 text-primary">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <CardTitle class="text-2xl font-bold text-foreground">{{ t('auth.app_name') }}</CardTitle>
                    <CardDescription>{{ t('auth.secure_portal') }}</CardDescription>
                </CardHeader>

                <CardContent class="flex flex-col items-center justify-center py-8 space-y-6">

                    <!-- LOADING STATE -->
                    <div v-if="isAuthenticating || (!authError && $route.query.code)"
                        class="flex flex-col items-center text-center space-y-4">
                        <div class="relative">
                            <div class="h-12 w-12 rounded-full border-4 border-primary/20"></div>
                            <div
                                class="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-t-primary animate-spin">
                            </div>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-lg font-medium">{{ t('auth.authenticating') }}</h3>
                            <p class="text-sm text-muted-foreground max-w-xs">
                                {{ t('auth.authenticating_desc') }}
                            </p>
                        </div>
                    </div>

                    <!-- ERROR STATE -->
                    <div v-else-if="authError || !$route.query.code"
                        class="flex flex-col items-center text-center space-y-4">
                        <div class="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle class="h-6 w-6 text-destructive" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-lg font-medium text-destructive">{{ t('auth.failed') }}</h3>
                            <p class="text-sm text-muted-foreground max-w-xs">
                                {{ authError?.message || t('auth.failed_desc') }}
                            </p>
                        </div>
                    </div>

                </CardContent>

                <!-- Footer Actions (Only visible on error) -->
                <CardFooter v-if="authError || !$route.query.code" class="flex justify-center pb-6">
                    <Button variant="outline" @click="handleBackToLogin" class="w-full sm:w-auto">
                        <ArrowLeft class="mr-2 h-4 w-4" />
                        {{ t('auth.return_to_login') }}
                    </Button>
                </CardFooter>

            </Card>

        </div>
    </LayoutGuest>
</template>