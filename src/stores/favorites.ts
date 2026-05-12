import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const FAV_KEY = 'devhub.favorites'

function read(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function write(list: string[]): void {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>(read())

  const set = computed(() => new Set(ids.value))

  function has(id: string): boolean {
    return set.value.has(id)
  }

  function toggle(id: string): void {
    if (set.value.has(id)) {
      ids.value = ids.value.filter((x) => x !== id)
    } else {
      ids.value = [...ids.value, id]
    }
    write(ids.value)
  }

  return { ids, has, toggle }
})
