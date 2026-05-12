<template>
  <div class="oss-page">
    <header class="page-header">
      <div class="page-header-inner">
        <span class="eyebrow">{{ $t('nav.openSource') }}</span>
        <h1>{{ $t('hero.title').split('.')[0] }}.</h1>
        <p class="muted">
          {{ $t('hero.sub') }}
        </p>
      </div>
    </header>

    <section class="filters">
      <div class="filters-inner">
        <el-input
          v-model="search"
          :placeholder="$t('common.search') + '...'"
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
            {{ cat === 'All' ? $t('common.all') : cat }}
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
          <h3>{{ $t('common.noResults') }}</h3>
          <p class="muted">{{ $t('common.tryClearing') }}</p>
        </div>
        <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="r in filtered"
            :key="r.id"
            :to="{ name: 'open-source-detail', params: { slug: r.id } }"
            class="oss-card surface overflow-hidden"
          >
            <!-- THUMBNAIL -->
            <div class="card-thumb" v-if="r.thumbnailUrl">
              <img :src="r.thumbnailUrl" :alt="r.name" />
            </div>
            <div class="card-thumb-placeholder" v-else>
              <div class="oss-mark-sm">
                <span>{{ r.name.charAt(0).toUpperCase() }}</span>
              </div>
            </div>

            <div class="card-body">
              <div class="oss-head">
                <div class="leading-tight flex-1 min-w-0">
                  <div class="font-semibold text-sm truncate">{{ r.fullName }}</div>
                  <div class="text-xs muted">{{ r.category }} · {{ r.language }}</div>
                </div>
                <button
                  class="fav-btn"
                  :class="{ active: favorites.has(r.id) }"
                  :aria-label="favorites.has(r.id) ? 'Remove from favorites' : 'Add to favorites'"
                  @click.prevent.stop="favorites.toggle(r.id)"
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
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
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
  padding: 0;
  transition: transform 200ms ease, border-color 200ms ease;
  border-radius: 16px;
  overflow: hidden;
}
.oss-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.15);
}

.card-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--app-surface-2);
}
.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-thumb-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}
html.dark .card-thumb-placeholder {
  background: linear-gradient(135deg, #1f2937, #111827);
}

.oss-mark-sm {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  font-weight: 800;
  font-size: 1.2rem;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.oss-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.oss-desc {
  font-size: 0.88rem;
  color: var(--app-text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.7em;
}
.oss-meta {
  display: flex;
  gap: 14px;
  font-size: 0.82rem;
  color: var(--app-text-muted);
}
.oss-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tag {
  font-size: 0.7rem;
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
