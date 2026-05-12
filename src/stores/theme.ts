import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'devhub.theme'

function readPersistedTheme(): ThemeMode | null {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

function detectSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.dataset.theme = mode
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(readPersistedTheme() ?? detectSystemTheme())

  function init(): void {
    applyTheme(mode.value)
  }

  function setMode(next: ThemeMode): void {
    mode.value = next
  }

  function toggle(): void {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  watch(
    mode,
    (m) => {
      applyTheme(m)
      try {
        localStorage.setItem(THEME_KEY, m)
      } catch {
        /* ignore */
      }
    },
    { immediate: false },
  )

  return { mode, init, setMode, toggle }
})
