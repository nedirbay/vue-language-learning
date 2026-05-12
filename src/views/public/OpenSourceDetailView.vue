<template>
  <div class="oss-detail-page">
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else-if="!resource" class="not-found">
      <h2>{{ $t('common.noResults') }}</h2>
      <p class="muted">{{ $t('common.tryClearing') }}</p>
      <RouterLink to="/open-source">
        <el-button>{{ $t('nav.openSource') }}</el-button>
      </RouterLink>
    </div>

    <article v-else class="detail">
      <div class="container">
        <RouterLink to="/open-source" class="back-link">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t('nav.openSource') }}
        </RouterLink>

        <div class="oss-card surface">
          <!-- SURAT (Image) -->
          <div class="thumbnail-wrapper" v-if="resource.thumbnailUrl">
            <img :src="resource.thumbnailUrl" :alt="resource.name" class="thumbnail" />
          </div>
          <div class="thumbnail-placeholder" v-else>
            <div class="oss-mark-xl">
              <span>{{ resource.name.charAt(0).toUpperCase() }}</span>
            </div>
          </div>

          <div class="card-content">
            <!-- TITLE -->
            <h1 class="title">{{ resource.name }}</h1>
            <div class="full-name">{{ resource.fullName }}</div>

            <div class="meta-row">
              <div class="stat-pill">
                <el-icon><StarFilled /></el-icon>
                <span>{{ formatNumber(resource.stars) }}</span>
              </div>
              <div class="stat-pill">
                <el-icon><Share /></el-icon>
                <span>{{ formatNumber(resource.forks) }}</span>
              </div>
              <div class="stat-pill">{{ resource.language }}</div>
            </div>

            <!-- CONTENT -->
            <div class="description">
              <h3>{{ $t('project.description') }}</h3>
              <p>{{ resource.description }}</p>
            </div>

            <!-- SYLKA (Link) -->
            <div class="external-links">
              <a :href="resource.url" target="_blank" rel="noopener" class="link-btn primary">
                <el-icon><Promotion /></el-icon>
                {{ $t('project.visitSite') }}
              </a>
            </div>

            <!-- TAGS -->
            <div class="topics" v-if="resource.topics.length > 0">
              <h3>{{ $t('project.tags') }}</h3>
              <div class="chips">
                <span v-for="t in resource.topics" :key="t" class="chip soft">#{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  Promotion,
  Share,
  StarFilled,
} from '@element-plus/icons-vue'
import { api } from '@/api'
import type { OpenSourceResource } from '@/types/models'
import { formatNumber } from '@/utils/format'

const route = useRoute()

const resource = ref<OpenSourceResource | null>(null)
const allResources = ref<OpenSourceResource[]>([])
const loading = ref(true)

async function load(slug: string): Promise<void> {
  loading.value = true
  try {
    const [r, all] = await Promise.all([api.openSourceResource(slug), api.openSource()])
    resource.value = r
    allResources.value = all
  } finally {
    loading.value = false
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
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
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

.oss-card {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.1);
}

.thumbnail-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--app-surface-2);
}
.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}
html.dark .thumbnail-placeholder {
  background: linear-gradient(135deg, #1f2937, #111827);
}

.oss-mark-xl {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  font-size: 3rem;
  font-weight: 800;
  box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.5);
}

.card-content {
  padding: 40px;
}

.title {
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  line-height: 1.1;
}

.full-name {
  font-family: 'JetBrains Mono', monospace;
  color: var(--app-text-muted);
  font-size: 1rem;
  margin-bottom: 24px;
}

.meta-row {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--app-surface-2);
  border: 1px solid var(--app-border);
  font-size: 0.9rem;
  font-weight: 600;
}

.description {
  margin-bottom: 32px;
}
.description h3,
.topics h3 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--app-text-muted);
  margin-bottom: 12px;
}
.description p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--app-text);
}

.external-links {
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--app-border);
}

.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 600;
  transition: transform 150ms ease;
}
.link-btn:active {
  transform: scale(0.98);
}
.link-btn.primary {
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.5);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.chip.soft {
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--app-accent);
  font-weight: 600;
  font-size: 0.9rem;
}

.loading-state,
.not-found {
  max-width: 800px;
  margin: 60px auto;
  padding: 32px 24px;
  text-align: center;
}
</style>

