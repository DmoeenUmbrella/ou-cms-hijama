<script setup lang="ts">
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import BaseLogo from "@/components/base/BaseLogo.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

const router = useRouter();
const { t } = useI18n();

const form = reactive({
  login: "",
  pass: "",
  remember: false,
});

const submit = () => {
  router.push("/dashboard");
};

const direction = computed(() => "ltr");
</script>

<template>
  <LayoutGuest :dir="direction">
    <div class="min-h-screen flex items-center justify-center 
             bg-gradient-to-br from-indigo-500 to-purple-600
             dark:bg-background p-4">
      <Card class="w-full max-w-md p-6 shadow-xl bg-white dark:bg-neutral-900">
        <CardHeader class="flex flex-col items-center">
          <BaseLogo :width="120" :height="80" class="mb-4" />
          <h1 class="text-xl font-semibold">
            {{ t("login.login") }}
          </h1>
        </CardHeader>

        <form @submit.prevent="submit">
          <CardContent class="space-y-4">

            <div class="flex flex-col space-y-2">
              <Label for="login">{{ t("login.login") }}</Label>
              <Input id="login" v-model="form.login" autocomplete="username" />
            </div>

            <div class="flex flex-col space-y-2">
              <Label for="password">{{ t("login.password") }}</Label>
              <Input id="password" type="password" v-model="form.pass" />
            </div>

            <div class="flex items-center gap-2">
              <Checkbox id="remember" v-model="form.remember" />
              <Label for="remember">{{ t("login.remember") }}</Label>
            </div>

          </CardContent>

          <CardFooter class="flex flex-col gap-3 mt-4">
            <Button type="submit" class="w-full">
              {{ t("login.login") }}
            </Button>

            <Button variant="outline" class="w-full" @click="router.push('/dashboard')">
              {{ t("login.back") }}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  </LayoutGuest>
</template>
