<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useReadingMode } from '@/scripts/reading';
import { home, sidebar } from '@/scripts/router';

const coreGroups = sidebar.filter((g) => !g.extra);
const extraGroups = sidebar.filter((g) => g.extra);

const { showAdditional, setShowAdditional } = useReadingMode();
</script>

<template>
  <nav class="text-sm" aria-label="Sidebar">
    <template v-if="!showAdditional">
      <ul class="space-y-1">
        <li>
          <RouterLink to="/" class="nav-link" exact-active-class="active">
            {{ home.title }}
          </RouterLink>
        </li>
      </ul>
      <div v-for="group in coreGroups" :key="group.group" class="mt-5">
        <h3 class="eyebrow mb-2 px-3">
          {{ group.group }}
        </h3>
        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.slug">
            <RouterLink :to="`/${item.slug}`" class="nav-link" active-class="active">
              {{ item.title }}
            </RouterLink>
          </li>
        </ul>
      </div>
      <button
        type="button"
        class="nav-link mt-6 w-full text-left text-gray-700 italic"
        @click="setShowAdditional(true)"
      >
        Additional Reading →
      </button>
    </template>
    <template v-else>
      <div class="flex items-center justify-between gap-2 px-3">
        <h3 class="eyebrow">Additional Reading</h3>
        <button
          type="button"
          aria-label="Hide additional reading"
          title="Hide additional reading"
          class="-mr-1 inline-flex size-6 items-center justify-center rounded text-gray-500 hover:bg-primary-50 hover:text-gray-900"
          @click="setShowAdditional(false)"
        >
          <XMarkIcon class="size-4" aria-hidden="true" />
        </button>
      </div>
      <div v-for="group in extraGroups" :key="group.group" class="mt-4">
        <h3 class="mb-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">
          {{ group.group }}
        </h3>
        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.slug">
            <RouterLink :to="`/${item.slug}`" class="nav-link" active-class="active">
              {{ item.title }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </template>
  </nav>
</template>
