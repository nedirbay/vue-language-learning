<template>
  <div class="projects-page">
    <header class="page-header">
      <div class="page-header-inner">
        <h1>{{ $t('nav.projects') }}</h1>
        <p class="muted">
          {{ $t('hero.sub') }}
        </p>
      </div>
    </header>

    <section class="filters">
      <div class="filters-inner">
        <div class="search-container">
          <el-input
            v-model="searchInput"
            :placeholder="$t('common.search') + '...'"
            clearable
            size="large"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch">{{ $t('common.search') }}</el-button>
            </template>
          </el-input>
        </div>

        <div class="filter-row">
          <el-segmented
            v-model="pricing"
            :options="pricingOptions"
            size="default"
          />
          <el-select
            v-model="category"
            :placeholder="$t('common.allCategories')"
            clearable
            class="w-44"
          >
            <el-option :label="$t('common.allCategories')" value="all" />
            <el-option
              v-for="c in categories"
              :key="c.id"
              :label="c.name"
              :value="c.slug"
            />
          </el-select>
          <el-select v-model="tech" :placeholder="$t('common.anyTech')" clearable class="w-44">
            <el-option
              v-for="t in techOptions"
              :key="t"
              :label="t"
              :value="t"
            />
          </el-select>
          <el-select v-model="sort" :placeholder="$t('common.sortBy')" class="w-40">
            <el-option :label="$t('common.latest')" value="latest" />
            <el-option :label="$t('common.popular')" value="popular" />
            <el-option :label="$t('common.topRated')" value="top_rated" />
            <el-option :label="$t('common.mostDownloaded')" value="most_downloaded" />
          </el-select>
        </div>
      </div>
    </section>

    <section class="results">
      <div class="results-inner">
        <div class="results-meta muted">
          {{ total === 1 ? $t('common.projectFound') : $t('common.projectsFound', { count: total }) }}
        </div>

        <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <el-skeleton v-for="i in 6" :key="i" animated />
        </div>
        <div
          v-else-if="projects.length === 0"
          class="empty surface"
        >
          <el-icon :size="36" class="muted"><Box /></el-icon>
          <h3>{{ $t('common.noResults') }}</h3>
          <p class="muted">{{ $t('common.tryClearing') }}</p>
          <el-button type="primary" plain @click="resetFilters">{{ $t('common.resetFilters') }}</el-button>
        </div>
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard v-for="p in projects" :key="p.id" :project="p" />
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <el-pagination
            v-model:current-page="page"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            background
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Box, Search } from '@element-plus/icons-vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { api } from '@/api'
import type { Category, Project, ProjectPricingType } from '@/types/models'

const route = useRoute()
const router = useRouter()

const search = ref('')
const searchInput = ref('')
const pricing = ref<ProjectPricingType | 'all'>('all')
const category = ref<string>('all')
const tech = ref<string>('')
const sort = ref<'latest' | 'popular' | 'top_rated' | 'most_downloaded'>('latest')
const page = ref(1)
const pageSize = 9

const projects = ref<Project[]>([])
const categories = ref<Category[]>([])
const total = ref(0)
const loading = ref(true)

const { t } = useI18n()

const pricingOptions = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('common.free'), value: 'free' },
  { label: t('common.paid'), value: 'paid' },
  { label: t('common.openSource'), value: 'open_source' },
])

const techOptions = [
  'Vue 3',
  'NestJS',
  'TypeScript',
  'PostgreSQL',
  'Stripe',
  'Tailwind',
  'Node.js',
  'OpenAI',
  'Redis',
]

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

function readQuery(): void {
  const q = route.query
  if (typeof q.search === 'string') {
    search.value = q.search
    searchInput.value = q.search
  }
  if (typeof q.pricing === 'string') pricing.value = q.pricing as ProjectPricingType | 'all'
  if (typeof q.category === 'string') category.value = q.category
  if (typeof q.tech === 'string') tech.value = q.tech
  if (typeof q.sort === 'string') sort.value = q.sort as typeof sort.value
  if (typeof q.page === 'string') page.value = Number.parseInt(q.page, 10) || 1
}

function writeQuery(): void {
  const q: Record<string, string> = {}
  if (search.value) q.search = search.value
  if (pricing.value && pricing.value !== 'all') q.pricing = pricing.value
  if (category.value && category.value !== 'all') q.category = category.value
  if (tech.value) q.tech = tech.value
  if (sort.value && sort.value !== 'latest') q.sort = sort.value
  if (page.value !== 1) q.page = String(page.value)
  router.replace({ query: q }).catch(() => {})
}

async function load(): Promise<void> {
  loading.value = true
  try {
    const res = await api.projects({
      search: search.value || undefined,
      pricing: pricing.value === 'all' ? undefined : pricing.value,
      category: category.value === 'all' ? undefined : category.value,
      tech: tech.value || undefined,
      sort: sort.value,
      page: page.value,
      pageSize,
    })
    projects.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function handleSearch(): void {
  search.value = searchInput.value
}

function resetFilters(): void {
  search.value = ''
  searchInput.value = ''
  pricing.value = 'all'
  category.value = 'all'
  tech.value = ''
  sort.value = 'latest'
  page.value = 1
}

watch(
  [search, pricing, category, tech, sort],
  () => {
    page.value = 1
    writeQuery()
    load()
  },
)

watch(page, () => {
  writeQuery()
  load()
})

onMounted(async () => {
  readQuery()
  categories.value = await api.categories()
  await load()
})
</script>

<style scoped>
.page-header {
  padding: 64px 24px 32px;
}
.page-header-inner {
  max-width: 1280px;
  margin: 0 auto;
}
h1 {
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
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
}
.search-container {
  width: 100%;
  margin-bottom: 4px;
}
.search-container :deep(.el-input-group__append) {
  background-color: var(--app-accent);
  color: white;
  border-color: var(--app-accent);
  font-weight: 600;
  padding: 0 24px;
}
.search-container :deep(.el-input-group__append .el-button) {
  border: none;
  margin: 0;
  color: inherit;
}
.search-container :deep(.el-input__wrapper) {
  border-radius: 14px 0 0 14px;
  padding-left: 16px;
}
.search-container :deep(.el-input-group__append) {
  border-radius: 0 14px 14px 0;
}
.filter-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.results {
  padding: 32px 24px 64px;
}
.results-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.results-meta {
  margin-bottom: 16px;
  font-size: 0.92rem;
}

.empty {
  padding: 60px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.empty h3 {
  font-size: 1.1rem;
  font-weight: 700;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
