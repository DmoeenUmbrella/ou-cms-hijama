<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from './components/ui/sonner';
</script>

<template>
  <div>
    <main>
      <RouterView />
    </main>
    <Toaster />
  </div>
</template>
