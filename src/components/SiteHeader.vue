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
        <el-dropdown trigger="click" @command="handleLangChange">
          <button class="lang-btn">
            <img :src="currentLang.flag" :alt="currentLang.label" class="w-5 h-5 rounded-sm object-cover" />
            <span class="hidden lg:inline text-xs font-bold uppercase">{{ currentLang.code }}</span>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="lang in languages"
                :key="lang.code"
                :command="lang"
                :class="{ 'is-active': currentLang.code === lang.code }"
              >
                <div class="flex items-center gap-2">
                  <img :src="lang.flag" :alt="lang.label" class="w-5 h-4 rounded-sm object-cover" />
                  <span>{{ lang.label }}</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

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
          class="inline-flex md:hidden mobile-toggle"
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

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="mobileOpen"
          class="mobile-backdrop md:hidden"
          @click="mobileOpen = false"
        />
      </Transition>
      <Transition name="drawer">
        <aside v-if="mobileOpen" class="mobile-drawer md:hidden" role="dialog" aria-label="Menu">
          <div class="drawer-head">
            <RouterLink to="/" class="flex items-center gap-2 font-extrabold" @click="mobileOpen = false">
              <span class="logo-mark">D</span>
              <span>DevHub</span>
            </RouterLink>
            <button
              class="inline-flex mobile-toggle"
              aria-label="Close menu"
              @click="mobileOpen = false"
            >
              <el-icon :size="18"><Close /></el-icon>
            </button>
          </div>
          <nav class="drawer-nav">
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
          </nav>
          <div class="drawer-footer">
            <template v-if="auth.isAuthenticated">
              <RouterLink to="/dashboard" class="mobile-link" @click="mobileOpen = false">
                Dashboard
              </RouterLink>
              <RouterLink
                v-if="auth.isAdmin"
                to="/admin"
                class="mobile-link"
                @click="mobileOpen = false"
              >
                Admin panel
              </RouterLink>
              <button class="mobile-link text-left" @click="onLogout(); mobileOpen = false">
                Sign out
              </button>
            </template>
            <template v-else>
              <RouterLink to="/login" class="mobile-link" @click="mobileOpen = false">
                {{ $t('nav.signIn') }}
              </RouterLink>
              <RouterLink to="/register" class="mobile-link primary" @click="mobileOpen = false">
                {{ $t('nav.getStarted') }}
              </RouterLink>
            </template>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

import flagEn from '@/assets/flags/en.png'
import flagRu from '@/assets/flags/ru.png'
import flagTr from '@/assets/flags/tr.png'
import flagTm from '@/assets/flags/tm.png'

const { t, locale } = useI18n()
const auth = useAuthStore()
const router = useRouter()

const navLinks = computed(() => [
  { to: '/projects', label: t('nav.projects') },
  { to: '/open-source', label: t('nav.openSource') },
  { to: '/blog', label: t('nav.blog') },
  { to: '/about', label: t('nav.about') },
])

const scrolled = ref(false)
const mobileOpen = ref(false)

const languages = [
  { code: 'en', label: 'English', flag: flagEn },
  { code: 'ru', label: 'Русский', flag: flagRu },
  { code: 'tr', label: 'Türkçe', flag: flagTr },
  { code: 'tm', label: 'Türkmen', flag: flagTm },
]

const currentLang = ref(languages.find((l) => l.code === locale.value) || languages[0])

function handleLangChange(lang: (typeof languages)[0]): void {
  currentLang.value = lang
  locale.value = lang.code
  localStorage.setItem('lang', lang.code)
}

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

.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  cursor: pointer;
  color: var(--app-text);
  transition: all 160ms ease;
}
.lang-btn:hover {
  background: var(--app-surface-2);
  border-color: var(--app-border-strong);
}
</style>

<style>
/* Mobile drawer is teleported to <body>, so styles cannot be scoped. */
.mobile-backdrop {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgba(7, 9, 26, 0.45);
  backdrop-filter: blur(2px);
}
.mobile-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 71;
  width: min(86vw, 320px);
  background: var(--app-surface);
  border-right: 1px solid var(--app-border);
  box-shadow: 18px 0 40px -22px rgba(15, 23, 42, 0.5);
  display: flex;
  flex-direction: column;
  color: var(--app-text);
}
.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--app-border);
  font-size: 1.05rem;
}
.drawer-head .logo-mark {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  font-weight: 800;
}
.drawer-nav {
  display: flex;
  flex-direction: column;
  padding: 12px 12px;
  gap: 2px;
  flex: 1;
}
.drawer-footer {
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 2px;
  border-top: 1px solid var(--app-border);
}
.mobile-link {
  display: block;
  padding: 12px 14px;
  border-radius: 10px;
  color: var(--app-text);
  font-weight: 500;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;
  width: 100%;
}
.mobile-link.active,
.mobile-link:hover {
  background: var(--app-surface-2);
}
.mobile-link.primary {
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  text-align: center;
  margin-top: 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}
</style>
