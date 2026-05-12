<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <RouterLink to="/" class="brand">
        <span class="logo-mark">D</span>
        <span>Admin</span>
      </RouterLink>
      <nav class="nav">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          active-class="active"
        >
          <el-icon :size="18"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <ThemeToggle />
        <RouterLink to="/" class="text-xs muted underline">View site</RouterLink>
      </div>
    </aside>

    <div class="content-area">
      <header class="topbar">
        <div class="page-meta">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="muted text-sm">{{ pageSubtitle }}</p>
        </div>
        <div class="flex items-center gap-3">
          <el-input
            v-model="search"
            placeholder="Search projects, users, orders…"
            class="w-72 hidden md:block"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="$router.push('/admin/projects/new')">
            <el-icon class="mr-1"><Plus /></el-icon>
            New project
          </el-button>
          <el-dropdown trigger="click" placement="bottom-end">
            <el-avatar :size="34" :src="auth.user?.avatarUrl" class="cursor-pointer" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/dashboard')">
                  My dashboard
                </el-dropdown-item>
                <el-dropdown-item @click="onLogout">Sign out</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <main class="page">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  ChatLineRound,
  Collection,
  DataAnalysis,
  Document,
  Plus,
  Search,
  Setting,
  ShoppingCart,
  User as UserIcon,
} from '@element-plus/icons-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const search = ref('')

const items = [
  { to: '/admin', label: 'Overview', icon: DataAnalysis },
  { to: '/admin/projects', label: 'Projects', icon: Collection },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/users', label: 'Users', icon: UserIcon },
  { to: '/admin/blog', label: 'Blog', icon: Document },
  { to: '/admin/comments', label: 'Comments', icon: ChatLineRound },
  { to: '/admin/settings', label: 'Settings', icon: Setting },
]

const pageTitle = computed(() => (route.meta.title as string) ?? 'Admin')
const pageSubtitle = computed(() => (route.meta.subtitle as string) ?? '')

function onLogout(): void {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
}
@media (max-width: 900px) {
  .admin-layout {
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
    rgba(99, 102, 241, 0.18),
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
.page {
  padding: 28px 32px 60px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
