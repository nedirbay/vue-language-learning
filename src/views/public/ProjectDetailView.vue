<template>
  <div class="detail-page">
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="6" animated />
    </div>
    <div v-else-if="!project" class="not-found">
      <h2>{{ $t('common.noResults') }}</h2>
      <p class="muted">{{ $t('common.tryClearing') }}</p>
      <RouterLink to="/projects"><el-button>{{ $t('common.resetFilters') }}</el-button></RouterLink>
    </div>
    <article v-else class="detail">
      <div class="container">
        <div class="main-grid">
          <!-- LEFT COLUMN -->
          <div class="left-col">
            <header class="header">
              <RouterLink to="/projects" class="back-link">
                <el-icon><ArrowLeft /></el-icon>
                {{ $t('nav.projects') }}
              </RouterLink>

              <div class="badges">
                <span class="badge" :class="pricingBadgeClass">{{ pricingLabel }}</span>
                <span class="badge badge-cat">{{ project.category.name }}</span>
                <span v-if="project.featured" class="badge badge-accent">{{ $t('common.popular') }}</span>
              </div>
              <h1 class="title">{{ project.title }}</h1>
              <p class="subtitle">{{ project.shortDescription }}</p>

              <div class="meta-row">
                <div class="meta">
                  <el-avatar :size="32" :src="project.author.avatarUrl" />
                  <div class="leading-tight">
                    <div class="text-sm font-semibold">{{ project.author.fullName }}</div>
                    <div class="text-xs muted">{{ $t('common.author') }}</div>
                  </div>
                </div>
                <div class="stat-pill">
                  <el-icon><StarFilled /></el-icon>
                  <span>{{ project.rating.toFixed(1) }}</span>
                  <span class="muted">({{ formatNumber(project.reviewCount) }})</span>
                </div>
                <div class="stat-pill">
                  <el-icon><Download /></el-icon>
                  <span>{{ formatNumber(project.downloadCount) }}</span>
                </div>
                <div class="stat-pill">
                  <el-icon><View /></el-icon>
                  <span>{{ formatNumber(project.viewCount) }}</span>
                </div>
              </div>
            </header>

            <main class="main-content">
              <!-- Cover image -->
              <div class="cover surface overflow-hidden">
                <img :src="project.coverImageUrl" :alt="project.title" />
              </div>

              <!-- Tabs -->
              <el-tabs v-model="activeTab" class="tabs">
                <el-tab-pane :label="$t('project.overview')" name="overview">
                  <div class="prose-md" v-html="markdown" />
                </el-tab-pane>
                <el-tab-pane :label="`${$t('project.reviews')} (${reviews.length})`" name="reviews">
                  <div v-if="reviews.length === 0" class="muted">{{ $t('project.noReviews') }}</div>
                  <div v-else class="reviews">
                    <article v-for="r in reviews" :key="r.id" class="review surface">
                      <header class="flex items-start gap-3">
                        <el-avatar :size="36" :src="r.user.avatarUrl" />
                        <div class="flex-1">
                          <div class="flex items-center gap-2 flex-wrap">
                            <div class="font-semibold text-sm">{{ r.user.fullName }}</div>
                            <span class="text-xs muted">· {{ formatRelative(r.createdAt) }}</span>
                          </div>
                          <div class="flex items-center gap-1 text-yellow-400">
                            <el-icon v-for="i in r.rating" :key="i" :size="14"><StarFilled /></el-icon>
                          </div>
                        </div>
                      </header>
                      <p class="mt-3 text-sm">{{ r.body }}</p>
                    </article>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('project.changelog')" name="changelog">
                  <div class="changelog">
                    <div v-for="entry in project.changelog" :key="entry.version" class="change-entry">
                      <div class="change-head">
                        <span class="version">v{{ entry.version }}</span>
                        <span class="muted text-xs">{{ formatDate(entry.date) }}</span>
                      </div>
                      <p>{{ entry.notes }}</p>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="`${$t('project.media')} (${mediaCount})`" name="media">
                  <div v-if="project.videoUrl" class="media-video">
                    <video
                      :src="project.videoUrl"
                      :poster="project.coverImageUrl"
                      controls
                      preload="metadata"
                    />
                  </div>
                  <div class="media-grid">
                    <button
                      v-for="(s, i) in project.screenshots"
                      :key="s.id"
                      type="button"
                      class="media-tile"
                      @click="openPreview(i)"
                    >
                      <img :src="s.url" :alt="s.caption ?? project.title" />
                      <span v-if="s.caption" class="media-caption">{{ s.caption }}</span>
                      <span class="media-zoom" aria-hidden="true">
                        <el-icon><ZoomIn /></el-icon>
                      </span>
                    </button>
                  </div>
                  <el-image-viewer
                    v-if="previewIndex !== null"
                    :url-list="project.screenshots.map((s) => s.url)"
                    :initial-index="previewIndex"
                    :hide-on-click-modal="true"
                    @close="previewIndex = null"
                  />
                </el-tab-pane>
              </el-tabs>
            </main>
          </div>

          <!-- RIGHT COLUMN -->
          <aside class="side-col">
            <div class="purchase-card surface">
              <div class="price">
                {{ formatPrice(project.priceCents, project.currency) }}
                <span v-if="project.pricingType === 'paid'" class="text-sm muted">{{ $t('project.oneTime') }}</span>
              </div>
              <div class="actions">
                <template v-if="project.pricingType === 'paid'">
                  <el-button
                    type="primary"
                    size="large"
                    :loading="checkoutLoading"
                    class="w-full"
                    @click="buy"
                  >
                    <el-icon class="mr-1"><Money /></el-icon>
                    {{ $t('project.buyNow') }}
                  </el-button>
                </template>
                <template v-else>
                  <el-button
                    type="primary"
                    size="large"
                    class="w-full"
                    @click="download"
                  >
                    <el-icon class="mr-1"><Download /></el-icon>
                    {{ $t('project.freeDownload') }}
                  </el-button>
                </template>
                <el-button
                  size="large"
                  class="w-full"
                  @click="toggleFav"
                  :type="isFav ? 'warning' : 'default'"
                  plain
                >
                  <el-icon class="mr-1"><Star /></el-icon>
                  {{ isFav ? $t('project.saved') : $t('project.saveToFav') }}
                </el-button>
              </div>
              <div class="links">
                <a v-if="project.liveDemoUrl" :href="project.liveDemoUrl" target="_blank" rel="noopener">
                  <el-icon><Link /></el-icon> {{ $t('project.liveDemo') }}
                </a>
                <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noopener">
                  <el-icon><Promotion /></el-icon> {{ $t('auth.github') }}
                </a>
                <a v-if="project.documentationUrl" :href="project.documentationUrl" target="_blank" rel="noopener">
                  <el-icon><Document /></el-icon> {{ $t('project.docs') }}
                </a>
              </div>
            </div>

            <div class="info-card surface">
              <h3>{{ $t('project.techStack') }}</h3>
              <div class="chips">
                <span v-for="t in project.techStack" :key="t" class="chip">{{ t }}</span>
              </div>
            </div>
            <div class="info-card surface">
              <h3>{{ $t('project.tags') }}</h3>
              <div class="chips">
                <span v-for="t in project.tags" :key="t.id" class="chip soft">#{{ t.name }}</span>
              </div>
            </div>
            <div class="info-card surface">
              <h3>{{ $t('project.highlights') }}</h3>
              <ul class="feature-list">
                <li v-for="f in project.features" :key="f">
                  <el-icon><CircleCheck /></el-icon>
                  {{ f }}
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  ArrowLeft,
  CircleCheck,
  Document,
  Download,
  Link,
  Money,
  Promotion,
  Star,
  StarFilled,
  View,
  ZoomIn,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { api } from '@/api'
import type { Project, Review } from '@/types/models'
import {
  formatDate,
  formatNumber,
  formatPrice,
  formatRelative,
  renderMarkdown,
} from '@/utils/format'
import { useAuthStore } from '@/stores/auth'
import { useFavoritesStore } from '@/stores/favorites'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const favorites = useFavoritesStore()

const project = ref<Project | null>(null)
const reviews = ref<Review[]>([])
const loading = ref(true)
const activeTab = ref<'overview' | 'reviews' | 'changelog' | 'media'>('overview')
const checkoutLoading = ref(false)
const previewIndex = ref<number | null>(null)

const mediaCount = computed(() => {
  if (!project.value) return 0
  return project.value.screenshots.length + (project.value.videoUrl ? 1 : 0)
})

function openPreview(index: number): void {
  previewIndex.value = index
}

const isFav = computed(() => (project.value ? favorites.has(project.value.id) : false))

const pricingLabel = computed(() => {
  if (!project.value) return ''
  switch (project.value.pricingType) {
    case 'paid':
      return t('common.paid')
    case 'open_source':
      return t('common.openSource')
    case 'free':
    default:
      return t('common.free')
  }
})

const pricingBadgeClass = computed(() => {
  if (!project.value) return ''
  switch (project.value.pricingType) {
    case 'paid':
      return 'badge-paid'
    case 'open_source':
      return 'badge-oss'
    default:
      return 'badge-free'
  }
})

const markdown = computed(() => (project.value ? renderMarkdown(project.value.description) : ''))

async function load(slug: string): Promise<void> {
  loading.value = true
  try {
    const p = await api.project(slug)
    project.value = p
    if (p) {
      reviews.value = await api.reviews(p.id)
    }
  } finally {
    loading.value = false
  }
}

function toggleFav(): void {
  if (!project.value) return
  favorites.toggle(project.value.id)
}

async function buy(): Promise<void> {
  if (!project.value) return
  if (!auth.isAuthenticated) {
    ElMessage.warning(t('auth.pleaseSignInToPurchase'))
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  checkoutLoading.value = true
  try {
    const session = await api.checkoutSession(project.value.id)
    window.location.href = session.url
  } catch {
    ElMessage.error(t('project.checkoutError'))
  } finally {
    checkoutLoading.value = false
  }
}

function download(): void {
  if (!project.value) return
  const url = project.value.downloadUrl || project.value.githubUrl
  if (url) {
    window.open(url, '_blank', 'noopener')
  } else {
    ElMessage.info(t('project.downloadEmailed'))
  }
}

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug === 'string') load(slug)
  },
)

onMounted(() => {
  const slug = route.params.slug
  if (typeof slug === 'string') load(slug)
})
</script>

<style scoped>
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px;
}
.main-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  align-items: start;
}
@media (max-width: 1000px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

.header {
  margin-bottom: 32px;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--app-text-muted);
  font-size: 0.9rem;
  margin-bottom: 24px;
}
.back-link:hover {
  color: var(--app-text);
}

.side-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 24px;
  margin-top: 60px;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.badge {
  font-size: 0.74rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}
.badge-free {
  background: rgba(16, 185, 129, 0.16);
  color: #047857;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
html.dark .badge-free {
  color: #6ee7b7;
}
.badge-paid {
  background: rgba(99, 102, 241, 0.18);
  color: #4338ca;
  border: 1px solid rgba(99, 102, 241, 0.35);
}
html.dark .badge-paid {
  color: #c7d2fe;
}
.badge-oss {
  background: rgba(245, 158, 11, 0.18);
  color: #b45309;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
html.dark .badge-oss {
  color: #fcd34d;
}
.badge-cat {
  background: var(--app-surface-2);
  border: 1px solid var(--app-border);
  color: var(--app-text);
}
.badge-accent {
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
}

.title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
  line-height: 1.1;
}
.subtitle {
  color: var(--app-text-muted);
  max-width: 640px;
  font-size: 1.05rem;
  line-height: 1.55;
}
.meta-row {
  margin-top: 22px;
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}
.meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--app-surface-2);
  border: 1px solid var(--app-border);
  font-size: 0.88rem;
}

.purchase-card {
  padding: 24px;
}
.price {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}
.actions :deep(.el-button + .el-button) {
  margin-left: 0;
}
.w-full {
  width: 100%;
}
.links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--app-border);
  padding-top: 14px;
}
.links a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--app-text-muted);
  font-size: 0.9rem;
  transition: color 160ms ease;
}
.links a:hover {
  color: var(--app-accent);
}
.cover {
  margin-bottom: 24px;
  overflow: hidden;
}
.cover img {
  width: 100%;
  display: block;
  max-height: 480px;
  object-fit: cover;
}

.tabs :deep(.el-tabs__nav-wrap)::after {
  background: var(--app-border);
}

.reviews {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.review {
  padding: 18px;
}

.changelog {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.change-entry {
  padding: 14px 18px;
  border: 1px solid var(--app-border);
  border-radius: 12px;
  background: var(--app-surface);
}
.change-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.version {
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

.info-card {
  padding: 18px;
}
.info-card h3 {
  font-size: 0.92rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--app-text-muted);
  margin: 0 0 12px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  font-size: 0.78rem;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--app-surface-2);
  border: 1px solid var(--app-border);
  font-family: 'JetBrains Mono', monospace;
}
.chip.soft {
  font-family: inherit;
  border-color: transparent;
  background: rgba(99, 102, 241, 0.1);
  color: var(--app-accent);
}
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
}
.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.feature-list .el-icon {
  color: var(--app-success);
  margin-top: 2px;
}
.media-video {
  margin-bottom: 18px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--app-border);
  background: black;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.media-video video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
.media-tile {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  padding: 0;
  cursor: zoom-in;
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
}
.media-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px -16px rgba(15, 23, 42, 0.4);
}
.media-tile img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}
.media-caption {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(7, 9, 26, 0.7);
  color: white;
  font-size: 0.72rem;
  font-weight: 600;
}
.media-zoom {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(7, 9, 26, 0.7);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.loading-state,
.not-found {
  max-width: 800px;
  margin: 60px auto;
  padding: 32px 24px;
  text-align: center;
}
</style>
