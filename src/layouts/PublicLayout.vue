<template>
  <div class="public-layout">
    <SiteHeader />
    <main class="main">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<style scoped>
.public-layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.main {
  flex: 1;
}
.page-enter-active,
.page-leave-active {
  transition: opacity 220ms ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
