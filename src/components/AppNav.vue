<script setup lang="ts">
import { home, sidebar } from '@/scripts/router';
</script>

<template>
  <nav class="text-sm" aria-label="Sidebar">
    <ul class="space-y-1">
      <li>
        <RouterLink
          to="/"
          class="nav-link"
          exact-active-class="bg-primary-50 text-primary-800 font-bold"
        >
          {{ home.title }}
        </RouterLink>
      </li>
    </ul>
    <div v-for="group in sidebar" :key="group.group" class="mt-5">
      <h3 class="eyebrow mb-2 px-3">
        {{ group.group }}
      </h3>
      <ul class="space-y-1">
        <li v-for="item in group.items" :key="item.slug">
          <RouterLink
            :to="`/${item.slug}`"
            class="nav-link"
            active-class="bg-primary-50 text-primary-800 font-bold"
          >
            {{ item.title }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
