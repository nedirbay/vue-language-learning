<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <RouterLink to="/" class="brand">
        <span class="logo-mark">D</span>
        <span>DevHub</span>
      </RouterLink>
      <nav class="nav">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          active-class="active"
        >
          <el-icon :size="18">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <ThemeToggle />
        <el-button text @click="onLogout">Sign out</el-button>
      </div>
    </aside>

    <div class="content-area">
      <header class="topbar">
        <div class="page-meta">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="muted text-sm">{{ pageSubtitle }}</p>
        </div>
        <div class="user-chip">
          <el-avatar :size="32" :src="auth.user?.avatarUrl" />
          <div class="leading-tight">
            <div class="text-sm font-semibold">{{ auth.user?.fullName }}</div>
            <div class="text-xs muted">{{ auth.user?.email }}</div>
          </div>
        </div>
      </header>
      <main class="page">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  Box,
  Download,
  Setting,
  Star,
  User,
} from '@element-plus/icons-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const items = [
  { to: '/dashboard', label: 'Overview', icon: User },
  { to: '/dashboard/purchases', label: 'My purchases', icon: Box },
  { to: '/dashboard/downloads', label: 'Downloads', icon: Download },
  { to: '/dashboard/favorites', label: 'Favorites', icon: Star },
  { to: '/dashboard/settings', label: 'Settings', icon: Setting },
]

const pageTitle = computed(() => (route.meta.title as string) ?? 'Dashboard')
const pageSubtitle = computed(() => (route.meta.subtitle as string) ?? '')

function onLogout(): void {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
}
@media (max-width: 900px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
}
.sidebar {
  border-right: 1px solid var(--app-border);
  background: var(--app-surface);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  height: 100vh;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  padding: 6px;
}
.logo-mark {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  font-weight: 800;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--app-text-muted);
  font-weight: 500;
  font-size: 0.92rem;
  transition: background-color 160ms ease, color 160ms ease;
}
.nav-item:hover {
  background: var(--app-surface-2);
  color: var(--app-text);
}
.nav-item.active {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.16),
    rgba(217, 70, 239, 0.12)
  );
  color: var(--app-text);
  border: 1px solid rgba(99, 102, 241, 0.25);
}
.sidebar-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-area {
  min-width: 0;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--app-bg);
  border-bottom: 1px solid var(--app-border);
  padding: 18px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.page-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}
.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 12px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
}
.page {
  padding: 28px 32px 60px;
  max-width: 1280px;
  margin: 0 auto;
}
</style>
