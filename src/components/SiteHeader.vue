<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="header-inner">
      <RouterLink to="/" class="logo flex items-center gap-2 font-extrabold text-lg">
        <span class="logo-mark">D</span>
        <span class="hidden sm:inline">DevHub</span>
      </RouterLink>

      <nav class="hidden md:flex items-center gap-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          active-class="active"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <ThemeToggle />

        <template v-if="auth.isAuthenticated">
          <el-dropdown trigger="click" placement="bottom-end">
            <button class="user-chip">
              <el-avatar :size="28" :src="auth.user?.avatarUrl" />
              <span class="hidden sm:inline text-sm font-medium">
                {{ auth.user?.fullName }}
              </span>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/dashboard')">
                  Dashboard
                </el-dropdown-item>
                <el-dropdown-item @click="$router.push('/dashboard/purchases')">
                  My purchases
                </el-dropdown-item>
                <el-dropdown-item @click="$router.push('/dashboard/favorites')">
                  Favorites
                </el-dropdown-item>
                <el-dropdown-item @click="$router.push('/dashboard/settings')">
                  Settings
                </el-dropdown-item>
                <el-dropdown-item v-if="auth.isAdmin" divided @click="$router.push('/admin')">
                  Admin panel
                </el-dropdown-item>
                <el-dropdown-item divided @click="onLogout">Sign out</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <RouterLink to="/login" class="hidden sm:inline-flex">
            <el-button text>Sign in</el-button>
          </RouterLink>
          <RouterLink to="/register">
            <el-button type="primary" round>Get started</el-button>
          </RouterLink>
        </template>

        <button
          class="md:hidden mobile-toggle"
          aria-label="Open menu"
          @click="mobileOpen = !mobileOpen"
        >
          <el-icon :size="18">
            <Close v-if="mobileOpen" />
            <Menu v-else />
          </el-icon>
        </button>
      </div>
    </div>

    <Transition name="slide">
      <div v-if="mobileOpen" class="mobile-menu md:hidden">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="mobile-link"
          active-class="active"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink
          v-if="!auth.isAuthenticated"
          to="/login"
          class="mobile-link"
          @click="mobileOpen = false"
        >
          Sign in
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Close, Menu } from '@element-plus/icons-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const navLinks = [
  { to: '/projects', label: 'Projects' },
  { to: '/open-source', label: 'Open source' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
]

const scrolled = ref(false)
const mobileOpen = ref(false)

function handleScroll(): void {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

function onLogout(): void {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(248, 249, 252, 0.72);
  border-bottom: 1px solid transparent;
  transition:
    background-color 200ms ease,
    border-color 200ms ease,
    backdrop-filter 200ms ease;
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
}
html.dark .site-header {
  background: rgba(7, 9, 26, 0.65);
}
.site-header.scrolled {
  border-color: var(--app-border);
  box-shadow: 0 4px 18px -12px rgba(15, 23, 42, 0.35);
}
.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.logo-mark {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.nav-link {
  position: relative;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--app-text-muted);
  transition:
    color 160ms ease,
    background-color 160ms ease;
}
.nav-link:hover {
  color: var(--app-text);
  background: var(--app-surface-2);
}
.nav-link.active {
  color: var(--app-text);
}
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 14px;
  right: 14px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, #6366f1, #d946ef);
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  cursor: pointer;
  color: var(--app-text);
}
.user-chip:hover {
  background: var(--app-surface-2);
}

.mobile-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  cursor: pointer;
  color: var(--app-text);
}

.mobile-menu {
  border-top: 1px solid var(--app-border);
  background: var(--app-surface);
  padding: 8px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mobile-link {
  padding: 12px 14px;
  border-radius: 10px;
  color: var(--app-text);
  font-weight: 500;
}
.mobile-link.active,
.mobile-link:hover {
  background: var(--app-surface-2);
}

.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 200ms ease,
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
