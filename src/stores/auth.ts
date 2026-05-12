import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'
import { tokenStorage } from '@/api/http'
import type { User } from '@/types/models'

const USER_KEY = 'devhub.user'

function readPersistedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function writePersistedUser(user: User | null): void {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch {
    /* ignore */
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(readPersistedUser())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email: string, password: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const res = await api.login(email, password)
      user.value = res.user
      writePersistedUser(res.user)
      tokenStorage.set(res.tokens.accessToken, res.tokens.refreshToken)
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Login failed. Check your email and password.'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(payload: {
    email: string
    password: string
    username: string
    fullName: string
  }): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const res = await api.register(payload)
      user.value = res.user
      writePersistedUser(res.user)
      tokenStorage.set(res.tokens.accessToken, res.tokens.refreshToken)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Registration failed.'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(email: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await api.forgotPassword(email)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Could not send reset email.'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    user.value = null
    writePersistedUser(null)
    tokenStorage.clear()
  }

  function loginAsDemoAdmin(): void {
    void login('admin@devhub.dev', 'demo1234')
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    forgotPassword,
    logout,
    loginAsDemoAdmin,
  }
})
