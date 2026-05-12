<template>
  <div class="overview">
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="card in cards" :key="card.label" class="metric surface">
        <div class="metric-icon" :class="card.iconClass">
          <component :is="card.icon" />
        </div>
        <div class="metric-body">
          <div class="muted text-xs">{{ card.label }}</div>
          <div class="metric-value">{{ card.value }}</div>
        </div>
      </div>
    </div>

    <section class="surface section">
      <header class="section-head">
        <h3>Welcome back, {{ auth.user?.fullName }}</h3>
        <p class="muted text-sm">
          Pick up where you left off, or browse new projects.
        </p>
      </header>
      <div class="quick-links">
        <RouterLink to="/projects" class="quick-link surface-2">
          <el-icon><Search /></el-icon>
          <div>
            <div class="font-medium">Browse projects</div>
            <div class="muted text-xs">Find your next starter</div>
          </div>
        </RouterLink>
        <RouterLink to="/dashboard/purchases" class="quick-link surface-2">
          <el-icon><Box /></el-icon>
          <div>
            <div class="font-medium">My purchases</div>
            <div class="muted text-xs">{{ orders.length }} {{ orders.length === 1 ? 'project' : 'projects' }}</div>
          </div>
        </RouterLink>
        <RouterLink to="/dashboard/favorites" class="quick-link surface-2">
          <el-icon><Star /></el-icon>
          <div>
            <div class="font-medium">Favorites</div>
            <div class="muted text-xs">{{ favorites.ids.length }} saved</div>
          </div>
        </RouterLink>
        <RouterLink to="/dashboard/settings" class="quick-link surface-2">
          <el-icon><Setting /></el-icon>
          <div>
            <div class="font-medium">Account settings</div>
            <div class="muted text-xs">Profile, security, theme</div>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="surface section">
      <header class="section-head">
        <h3>Recent activity</h3>
      </header>
      <ul class="timeline">
        <li v-for="(item, idx) in activity" :key="idx" class="timeline-item">
          <span class="dot" :class="item.tone" />
          <div class="leading-tight flex-1">
            <div class="font-medium text-sm">{{ item.text }}</div>
            <div class="muted text-xs">{{ item.time }}</div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Box, Download, Search, Setting, Star } from '@element-plus/icons-vue'
import { api } from '@/api'
import type { Order } from '@/types/models'
import { useAuthStore } from '@/stores/auth'
import { useFavoritesStore } from '@/stores/favorites'

const auth = useAuthStore()
const favorites = useFavoritesStore()
const orders = ref<Order[]>([])

const cards = computed(() => [
  { label: 'Purchases', value: String(orders.value.length), icon: Box, iconClass: 'tone-brand' },
  { label: 'Downloads', value: String(orders.value.length * 3), icon: Download, iconClass: 'tone-accent' },
  { label: 'Favorites', value: String(favorites.ids.length), icon: Star, iconClass: 'tone-warn' },
  { label: 'Reviews', value: '12', icon: Search, iconClass: 'tone-success' },
])

const activity = [
  { text: 'You purchased Atlas Admin Dashboard.', time: '2 days ago', tone: 'brand' },
  { text: 'You favorited Orbit Component Library.', time: '4 days ago', tone: 'warn' },
  { text: 'You downloaded Quill Markdown Editor.', time: '1 week ago', tone: 'success' },
  { text: 'You created your account.', time: '1 month ago', tone: 'accent' },
]

onMounted(async () => {
  // Use admin orders endpoint as mock data source for current user's purchase list.
  orders.value = (await api.orders()).filter((o) => o.status === 'paid')
})
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
}
.metric-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.tone-brand {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}
.tone-accent {
  background: linear-gradient(135deg, #d946ef, #ec4899);
}
.tone-warn {
  background: linear-gradient(135deg, #f59e0b, #f97316);
}
.tone-success {
  background: linear-gradient(135deg, #10b981, #14b8a6);
}
.metric-value {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.section {
  padding: 22px;
}
.section-head {
  margin-bottom: 14px;
}
.section-head h3 {
  font-size: 1rem;
  font-weight: 700;
}

.quick-links {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.quick-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  transition: transform 160ms ease, border-color 160ms ease;
}
.quick-link:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.4);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.timeline-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--app-accent);
}
.dot.warn {
  background: #f59e0b;
}
.dot.success {
  background: #10b981;
}
.dot.accent {
  background: #d946ef;
}
</style>
