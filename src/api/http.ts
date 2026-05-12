import axios, { type AxiosInstance } from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export const USE_MOCK = !API_BASE_URL || API_BASE_URL === 'mock'

const ACCESS_TOKEN_KEY = 'devhub.accessToken'
const REFRESH_TOKEN_KEY = 'devhub.refreshToken'

export const tokenStorage = {
  getAccess(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    } catch {
      return null
    }
  },
  getRefresh(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(access: string, refresh: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, access)
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
    } catch {
      /* ignore */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    } catch {
      /* ignore */
    }
  },
}

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || '/api',
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      tokenStorage.clear()
    }
    return Promise.reject(error)
  },
)
