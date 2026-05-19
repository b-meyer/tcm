<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow dark:focus:bg-gray-125"
    >
      Skip to content
    </a>
    <AppHeader />
    <main id="main-content" class="w-full flex-auto">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
