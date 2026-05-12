<template>
  <div class="oss-page">
    <header class="page-header">
      <div class="page-header-inner">
        <span class="eyebrow">Open source</span>
        <h1>Curated resources we love</h1>
        <p class="muted">
          A hand-picked list of libraries, frameworks, and tools that power great
          developer experiences. Star them, study them, build with them.
        </p>
      </div>
    </header>

    <section class="filters">
      <div class="filters-inner">
        <el-input
          v-model="search"
          placeholder="Search resources, languages, topics…"
          clearable
          size="large"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <div class="chip-row">
          <button
            v-for="cat in categories"
            :key="cat"
            class="chip"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <section class="grid-section">
      <div class="grid-inner">
        <div v-if="loading" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <el-skeleton v-for="i in 6" :key="i" animated />
        </div>
        <div v-else-if="filtered.length === 0" class="empty surface">
          <el-icon :size="36" class="muted"><Box /></el-icon>
          <h3>No matches</h3>
          <p class="muted">Try a different search or category.</p>
        </div>
        <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <a
            v-for="r in filtered"
            :key="r.id"
            :href="r.url"
            target="_blank"
            rel="noopener"
            class="oss-card surface"
          >
            <div class="oss-head">
              <div class="oss-mark">
                <span>{{ r.name.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="leading-tight flex-1 min-w-0">
                <div class="font-semibold text-sm truncate">{{ r.fullName }}</div>
                <div class="text-xs muted">{{ r.category }} · {{ r.language }}</div>
              </div>
              <button
                class="fav-btn"
                :class="{ active: favorites.has(r.id) }"
                :aria-label="favorites.has(r.id) ? 'Remove from favorites' : 'Add to favorites'"
                @click.prevent="favorites.toggle(r.id)"
              >
                <el-icon><Star /></el-icon>
              </button>
            </div>
            <p class="oss-desc">{{ r.description }}</p>
            <div class="oss-meta">
              <span class="inline-flex items-center gap-1">
                <el-icon><StarFilled /></el-icon>
                {{ formatNumber(r.stars) }}
              </span>
              <span class="inline-flex items-center gap-1">
                <el-icon><Share /></el-icon>
                {{ formatNumber(r.forks) }} forks
              </span>
            </div>
            <div class="oss-tags">
              <span v-for="t in r.topics.slice(0, 3)" :key="t" class="tag">#{{ t }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Box, Search, Share, Star, StarFilled } from '@element-plus/icons-vue'
import { api } from '@/api'
import type { OpenSourceResource } from '@/types/models'
import { formatNumber } from '@/utils/format'
import { useFavoritesStore } from '@/stores/favorites'

const favorites = useFavoritesStore()
const resources = ref<OpenSourceResource[]>([])
const loading = ref(true)
const search = ref('')
const activeCategory = ref<string>('All')

const categories = computed<string[]>(() => {
  const set = new Set<string>(['All'])
  resources.value.forEach((r) => set.add(r.category))
  return Array.from(set)
})

const filtered = computed<OpenSourceResource[]>(() => {
  const q = search.value.trim().toLowerCase()
  return resources.value.filter((r) => {
    if (activeCategory.value !== 'All' && r.category !== activeCategory.value) return false
    if (!q) return true
    return (
      r.name.toLowerCase().includes(q) ||
      r.fullName.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.language.toLowerCase().includes(q) ||
      r.topics.some((t) => t.toLowerCase().includes(q))
    )
  })
})

onMounted(async () => {
  try {
    resources.value = await api.openSource()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header {
  padding: 64px 24px 24px;
}
.page-header-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.eyebrow {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--app-text-muted);
  font-weight: 600;
  margin-bottom: 8px;
}
h1 {
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}

.filters {
  padding: 0 24px;
}
.filters-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}
.chip-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip-row .chip {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--app-text-muted);
  transition: color 160ms ease, background-color 160ms ease, border-color 160ms ease;
}
.chip-row .chip:hover {
  color: var(--app-text);
}
.chip-row .chip.active {
  color: white;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  border-color: transparent;
}

.grid-section {
  padding: 16px 24px 64px;
}
.grid-inner {
  max-width: 1280px;
  margin: 0 auto;
}

.oss-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  transition: transform 200ms ease, border-color 200ms ease;
}
.oss-card:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.4);
}
.oss-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.oss-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--app-surface-2);
  border: 1px solid var(--app-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
}
.oss-desc {
  font-size: 0.92rem;
  color: var(--app-text-muted);
  line-height: 1.5;
}
.oss-meta {
  display: flex;
  gap: 14px;
  font-size: 0.85rem;
  color: var(--app-text-muted);
}
.oss-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tag {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--app-accent);
}
.fav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  color: var(--app-text-muted);
  cursor: pointer;
}
.fav-btn.active {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(245, 158, 11, 0.1);
}

.empty {
  padding: 60px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}
</style>
