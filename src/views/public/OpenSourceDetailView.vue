<template>
  <div class="oss-detail-page">
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else-if="!resource" class="not-found">
      <h2>Resource not found</h2>
      <p class="muted">The open-source project you're looking for could not be found.</p>
      <RouterLink to="/open-source">
        <el-button>Back to open source</el-button>
      </RouterLink>
    </div>

    <article v-else class="detail">
      <section class="hero">
        <div class="hero-inner">
          <RouterLink to="/open-source" class="back-link">
            <el-icon><ArrowLeft /></el-icon>
            All open-source resources
          </RouterLink>

          <div class="hero-grid">
            <div class="hero-text">
              <div class="badges">
                <span class="badge badge-oss">Open Source</span>
                <span class="badge badge-cat">{{ resource.category }}</span>
                <span class="badge badge-cat">{{ resource.language }}</span>
              </div>

              <div class="title-row">
                <div class="oss-mark-lg">
                  <span>{{ resource.name.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="leading-tight min-w-0">
                  <h1 class="title">{{ resource.name }}</h1>
                  <div class="full-name">{{ resource.fullName }}</div>
                </div>
              </div>

              <p class="subtitle">{{ resource.description }}</p>

              <div class="meta-row">
                <div class="stat-pill">
                  <el-icon><StarFilled /></el-icon>
                  <span>{{ formatNumber(resource.stars) }}</span>
                  <span class="muted">stars</span>
                </div>
                <div class="stat-pill">
                  <el-icon><Share /></el-icon>
                  <span>{{ formatNumber(resource.forks) }}</span>
                  <span class="muted">forks</span>
                </div>
                <div class="stat-pill">
                  <span class="muted">Language</span>
                  <span>{{ resource.language }}</span>
                </div>
              </div>
            </div>

            <div class="link-card surface">
              <h3>Quick links</h3>
              <div class="actions">
                <a
                  :href="resource.url"
                  target="_blank"
                  rel="noopener"
                  class="link-btn primary"
                >
                  <el-icon><Promotion /></el-icon>
                  Open on GitHub
                </a>
                <a
                  :href="`${resource.url}/issues`"
                  target="_blank"
                  rel="noopener"
                  class="link-btn"
                >
                  <el-icon><WarningFilled /></el-icon>
                  Report an issue
                </a>
                <a
                  :href="`${resource.url}#readme`"
                  target="_blank"
                  rel="noopener"
                  class="link-btn"
                >
                  <el-icon><Document /></el-icon>
                  README
                </a>
                <a
                  :href="`${resource.url}/stargazers`"
                  target="_blank"
                  rel="noopener"
                  class="link-btn"
                >
                  <el-icon><StarFilled /></el-icon>
                  Stargazers
                </a>
              </div>
              <div class="fav-row">
                <el-button
                  size="large"
                  class="w-full"
                  :type="favorites.has(resource.id) ? 'warning' : 'default'"
                  plain
                  @click="favorites.toggle(resource.id)"
                >
                  <el-icon class="mr-1"><Star /></el-icon>
                  {{ favorites.has(resource.id) ? 'Saved' : 'Save to favorites' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="content">
        <div class="content-inner">
          <div class="content-grid">
            <main class="main-col">
              <div class="info-card surface">
                <h3>About this project</h3>
                <p>{{ resource.description }}</p>
                <p class="muted small">
                  Stats are sourced from GitHub at curation time. Visit the
                  <a :href="resource.url" target="_blank" rel="noopener">repository</a>
                  for the latest information.
                </p>
              </div>

              <div class="info-card surface">
                <h3>Topics</h3>
                <div v-if="resource.topics.length === 0" class="muted small">
                  No topics listed.
                </div>
                <div v-else class="chips">
                  <span v-for="t in resource.topics" :key="t" class="chip soft">#{{ t }}</span>
                </div>
              </div>

              <div class="info-card surface">
                <h3>How to use</h3>
                <ol class="how-list">
                  <li>Open the repository on GitHub using the link above.</li>
                  <li>Skim the README and the latest release notes.</li>
                  <li>Install via the package manager noted in the README.</li>
                  <li>Star the project if it helps you — it supports maintainers.</li>
                </ol>
              </div>
            </main>

            <aside class="side-col">
              <div class="info-card surface">
                <h3>Repository</h3>
                <dl class="kv">
                  <div>
                    <dt>Owner</dt>
                    <dd>{{ ownerName }}</dd>
                  </div>
                  <div>
                    <dt>Name</dt>
                    <dd>{{ resource.name }}</dd>
                  </div>
                  <div>
                    <dt>Language</dt>
                    <dd>{{ resource.language }}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{{ resource.category }}</dd>
                  </div>
                </dl>
              </div>

              <div class="info-card surface">
                <h3>Similar resources</h3>
                <ul class="related-list">
                  <li v-for="r in related" :key="r.id">
                    <RouterLink
                      :to="{ name: 'open-source-detail', params: { slug: r.id } }"
                      class="related-link"
                    >
                      <span class="related-mark">{{ r.name.charAt(0).toUpperCase() }}</span>
                      <span class="leading-tight min-w-0">
                        <span class="block font-semibold text-sm truncate">{{ r.name }}</span>
                        <span class="block text-xs muted truncate">{{ r.category }}</span>
                      </span>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowLeft,
  Document,
  Promotion,
  Share,
  Star,
  StarFilled,
  WarningFilled,
} from '@element-plus/icons-vue'
import { api } from '@/api'
import type { OpenSourceResource } from '@/types/models'
import { formatNumber } from '@/utils/format'
import { useFavoritesStore } from '@/stores/favorites'

const route = useRoute()
const favorites = useFavoritesStore()

const resource = ref<OpenSourceResource | null>(null)
const allResources = ref<OpenSourceResource[]>([])
const loading = ref(true)

const ownerName = computed(() => {
  if (!resource.value) return ''
  const parts = resource.value.fullName.split('/')
  return parts.length > 1 ? parts[0] : resource.value.fullName
})

const related = computed(() => {
  if (!resource.value) return []
  return allResources.value
    .filter(
      (r) =>
        r.id !== resource.value!.id &&
        (r.category === resource.value!.category || r.language === resource.value!.language),
    )
    .slice(0, 5)
})

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
.hero {
  padding: 56px 24px 24px;
}
.hero-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--app-text-muted);
  font-size: 0.9rem;
  margin-bottom: 18px;
}
.back-link:hover {
  color: var(--app-text);
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;
}
@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
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

.title-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
}
.oss-mark-lg {
  display: inline-flex;
  width: 56px;
  height: 56px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  font-weight: 800;
  font-size: 1.3rem;
  flex-shrink: 0;
}
.title {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.1;
}
.full-name {
  font-family: 'JetBrains Mono', monospace;
  color: var(--app-text-muted);
  font-size: 0.95rem;
  margin-top: 4px;
}
.subtitle {
  color: var(--app-text-muted);
  max-width: 640px;
  font-size: 1.05rem;
  line-height: 1.55;
  margin-top: 12px;
}
.meta-row {
  margin-top: 22px;
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
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

.link-card {
  padding: 24px;
  position: sticky;
  top: 88px;
  align-self: start;
}
.link-card h3 {
  font-size: 0.92rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--app-text-muted);
  margin: 0 0 14px;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}
.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--app-surface-2);
  border: 1px solid var(--app-border);
  color: var(--app-text);
  font-size: 0.92rem;
  font-weight: 500;
  transition:
    background-color 160ms ease,
    border-color 160ms ease;
}
.link-btn:hover {
  background: var(--app-surface);
  border-color: var(--app-border-strong);
}
.link-btn.primary {
  background: linear-gradient(135deg, #6366f1, #d946ef);
  border-color: transparent;
  color: white;
  justify-content: center;
}
.fav-row {
  border-top: 1px solid var(--app-border);
  padding-top: 14px;
}

.content {
  padding: 32px 24px 64px;
}
.content-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.content-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: start;
}
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
.main-col,
.side-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
.info-card p {
  margin: 0 0 8px;
  line-height: 1.6;
}
.info-card p.small {
  font-size: 0.85rem;
}
.info-card a {
  color: var(--app-accent);
}
.how-list {
  margin: 0;
  padding-left: 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.92rem;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip.soft {
  font-size: 0.78rem;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: rgba(99, 102, 241, 0.1);
  color: var(--app-accent);
}
.kv {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin: 0;
}
.kv > div {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  border-bottom: 1px dashed var(--app-border);
  padding-bottom: 6px;
}
.kv > div:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.kv dt {
  color: var(--app-text-muted);
  margin: 0;
}
.kv dd {
  margin: 0;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
}
.related-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.related-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  color: var(--app-text);
}
.related-link:hover {
  background: var(--app-surface-2);
}
.related-mark {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--app-surface-2);
  border: 1px solid var(--app-border);
  font-weight: 700;
}

.loading-state,
.not-found {
  max-width: 800px;
  margin: 60px auto;
  padding: 32px 24px;
  text-align: center;
}
</style>
