<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from './components/ui/sonner';
import BaseConfirmDialog from './components/base/BaseConfirmDialog.vue';
</script>

<template>
  <RouterView />
  <Toaster 
    position="top-right" 
    :rich-colors="true"
    :close-button="true"
    :expand="false"
    :duration="4000"
  />
  <BaseConfirmDialog />
</template>
