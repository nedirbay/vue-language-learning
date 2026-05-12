<template>
  <div class="home">
    <!-- HERO -->
    <section class="hero">
      <div class="bg-mesh" aria-hidden="true" />
      <div class="hero-inner">
        <span class="eyebrow">{{ $t('hero.eyebrow') }}</span>
        <h1 class="hero-title">
          {{ $t('hero.title').split('.')[0] }}. <span class="text-gradient">{{ $t('hero.title').split('.')[1] }}.</span> {{ $t('hero.title').split('.')[2] }}.
        </h1>
        <p class="hero-sub">
          {{ $t('hero.sub') }}
        </p>
        <div class="hero-cta">
          <RouterLink to="/projects">
            <el-button type="primary" size="large" round>
              {{ $t('common.browse') }} {{ $t('nav.projects').toLowerCase() }}
              <el-icon class="ml-1"><ArrowRight /></el-icon>
            </el-button>
          </RouterLink>
          <RouterLink to="/open-source">
            <el-button size="large" round>{{ $t('common.browse') }} {{ $t('nav.openSource').toLowerCase() }}</el-button>
          </RouterLink>
        </div>

        <div class="hero-stats">
          <div v-for="stat in heroStats" :key="stat.label" class="hero-stat">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED -->
    <section class="section">
      <div class="section-inner">
        <header class="section-head">
          <div>
            <span class="eyebrow eyebrow-pill">Featured</span>
            <h2 class="section-title">Hand-picked projects</h2>
            <p class="muted">Carefully selected, production-ready templates and tools.</p>
          </div>
          <RouterLink to="/projects" class="see-all">View all →</RouterLink>
        </header>

        <div v-if="loadingFeatured" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <el-skeleton v-for="i in 3" :key="i" animated style="border-radius: 16px">
            <template #template>
              <el-skeleton-item variant="image" style="height: 220px; border-radius: 16px" />
              <div class="p-4 space-y-2">
                <el-skeleton-item variant="h3" />
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" style="width: 60%" />
              </div>
            </template>
          </el-skeleton>
        </div>
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            v-for="p in featured"
            :key="p.id"
            :project="p"
            class="animate-slide-up"
          />
        </div>
      </div>
    </section>

    <!-- TRENDING -->
    <section class="section">
      <div class="section-inner">
        <header class="section-head">
          <div>
            <span class="eyebrow eyebrow-pill">Trending</span>
            <h2 class="section-title">What developers are loving</h2>
            <p class="muted">The most-saved, most-downloaded projects this month.</p>
          </div>
          <RouterLink to="/projects?sort=popular" class="see-all">View all →</RouterLink>
        </header>

        <div v-if="loadingTrending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <el-skeleton v-for="i in 3" :key="i" animated />
        </div>
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCard v-for="p in trending" :key="p.id" :project="p" />
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="section">
      <div class="section-inner">
        <header class="section-head">
          <div>
            <span class="eyebrow eyebrow-pill">Browse</span>
            <h2 class="section-title">Find what you need</h2>
            <p class="muted">Categories curated for developers.</p>
          </div>
        </header>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="cat in categories"
            :key="cat.id"
            :to="`/projects?category=${cat.slug}`"
            class="category-card surface"
          >
            <div class="cat-icon">
              <span>{{ cat.name.charAt(0) }}</span>
            </div>
            <div class="cat-body">
              <div class="font-semibold">{{ cat.name }}</div>
              <div class="text-sm muted">
                {{ cat.projectCount ?? 0 }} projects
              </div>
            </div>
            <el-icon class="cat-arrow"><ArrowRight /></el-icon>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="section">
      <div class="section-inner">
        <div class="stats-card glass">
          <div class="stat">
            <div class="stat-num">{{ format(stats.totalProjects) }}</div>
            <div class="stat-text">Projects shipped</div>
          </div>
          <div class="divider" aria-hidden="true" />
          <div class="stat">
            <div class="stat-num">{{ format(stats.totalUsers) }}</div>
            <div class="stat-text">Developers</div>
          </div>
          <div class="divider" aria-hidden="true" />
          <div class="stat">
            <div class="stat-num">{{ format(stats.totalDownloads) }}</div>
            <div class="stat-text">Downloads</div>
          </div>
          <div class="divider" aria-hidden="true" />
          <div class="stat">
            <div class="stat-num">{{ countries }}+</div>
            <div class="stat-text">Countries</div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section">
      <div class="section-inner">
        <header class="section-head">
          <div>
            <span class="eyebrow eyebrow-pill">Loved by builders</span>
            <h2 class="section-title">Don't just take our word for it</h2>
          </div>
        </header>
        <div class="grid gap-6 md:grid-cols-3">
          <article
            v-for="t in testimonials"
            :key="t.id"
            class="testimonial surface"
          >
            <div class="flex items-center gap-1 text-yellow-400 mb-3">
              <el-icon v-for="i in t.rating" :key="i"><StarFilled /></el-icon>
            </div>
            <blockquote>{{ t.body }}</blockquote>
            <div class="author">
              <el-avatar :size="36" :src="t.avatarUrl" />
              <div>
                <div class="font-semibold text-sm">{{ t.name }}</div>
                <div class="text-xs muted">{{ t.role }}</div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="section-inner">
        <div class="cta">
          <div class="cta-bg" aria-hidden="true" />
          <div class="cta-content">
            <h3 class="cta-title">Ready to ship faster?</h3>
            <p class="cta-sub">
              Join thousands of developers using DevHub to launch products in days, not months.
            </p>
            <div class="flex gap-3 flex-wrap justify-center">
              <RouterLink to="/register">
                <el-button type="primary" size="large" round>Create free account</el-button>
              </RouterLink>
              <RouterLink to="/projects">
                <el-button size="large" round>Browse projects</el-button>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowRight, StarFilled } from '@element-plus/icons-vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { api } from '@/api'
import { formatNumber } from '@/utils/format'
import type { Category, Project, Testimonial } from '@/types/models'

const featured = ref<Project[]>([])
const trending = ref<Project[]>([])
const categories = ref<Category[]>([])
const testimonials = ref<Testimonial[]>([])
const stats = ref({ totalProjects: 0, totalUsers: 0, totalDownloads: 0, totalRevenueCents: 0 })
const loadingFeatured = ref(true)
const loadingTrending = ref(true)

const { t } = useI18n()
const countries = computed(() => 64)

const heroStats = computed(() => [
  { label: t('nav.projects'), value: formatNumber(stats.value.totalProjects) },
  { label: t('nav.about'), value: formatNumber(stats.value.totalUsers) },
  { label: t('common.search'), value: formatNumber(stats.value.totalDownloads) },
])

const format = (n: number): string => formatNumber(n)

onMounted(async () => {
  try {
    const [f, t, c, s, tt] = await Promise.all([
      api.featuredProjects(),
      api.trendingProjects(),
      api.categories(),
      api.stats(),
      api.testimonials(),
    ])
    featured.value = f
    trending.value = t
    categories.value = c
    stats.value = s
    testimonials.value = tt
  } finally {
    loadingFeatured.value = false
    loadingTrending.value = false
  }
})
</script>

<style scoped>
.home {
  position: relative;
}

/* HERO */
.hero {
  position: relative;
  padding: 96px 24px 64px;
  text-align: center;
  overflow: hidden;
}
.bg-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(at 20% 20%, rgba(99, 102, 241, 0.22) 0px, transparent 50%),
    radial-gradient(at 80% 30%, rgba(217, 70, 239, 0.22) 0px, transparent 50%),
    radial-gradient(at 50% 80%, rgba(34, 211, 238, 0.16) 0px, transparent 55%);
}
.hero-inner {
  position: relative;
  max-width: 980px;
  margin: 0 auto;
}
.eyebrow {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--app-text-muted);
  font-weight: 600;
  margin-bottom: 18px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
}
.eyebrow-pill {
  font-size: 0.75rem;
}
.hero-title {
  font-size: clamp(2.6rem, 6vw, 4.6rem);
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: -0.03em;
  margin: 0 auto 18px;
  max-width: 18ch;
}
.hero-sub {
  max-width: 640px;
  margin: 0 auto 32px;
  color: var(--app-text-muted);
  font-size: 1.08rem;
  line-height: 1.65;
}
.hero-cta {
  display: inline-flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
}
.hero-stats {
  display: inline-flex;
  gap: 36px;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 16px;
}
.hero-stat {
  text-align: center;
}
.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.stat-label {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--app-text-muted);
}

/* SECTIONS */
.section {
  padding: 56px 24px;
}
.section-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.section-title {
  font-size: clamp(1.6rem, 2.4vw, 2.1rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 8px 0 6px;
}
.see-all {
  color: var(--app-accent);
  font-weight: 600;
  font-size: 0.92rem;
  transition: opacity 160ms ease;
}
.see-all:hover {
  opacity: 0.85;
}

/* CATEGORIES */
.category-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  transition: transform 200ms ease, border-color 200ms ease;
}
.category-card:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.4);
}
.cat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}
.cat-body {
  flex: 1;
}
.cat-arrow {
  color: var(--app-text-muted);
}
.category-card:hover .cat-arrow {
  color: var(--app-accent);
}

/* STATS */
.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 32px 24px;
  gap: 16px;
  flex-wrap: wrap;
  border-radius: 24px;
}
.stat {
  text-align: center;
  min-width: 120px;
}
.stat-num {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
}
.stat-text {
  font-size: 0.85rem;
  color: var(--app-text-muted);
  margin-top: 4px;
}
.divider {
  width: 1px;
  height: 36px;
  background: var(--app-border);
}

/* TESTIMONIALS */
.testimonial {
  padding: 24px;
}
.testimonial blockquote {
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--app-text);
  margin: 0 0 18px;
}
.author {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* CTA */
.cta {
  position: relative;
  border-radius: 28px;
  padding: 56px 40px;
  overflow: hidden;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  text-align: center;
}
.cta-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(at 20% 30%, rgba(99, 102, 241, 0.28), transparent 60%),
    radial-gradient(at 80% 70%, rgba(217, 70, 239, 0.24), transparent 65%);
  pointer-events: none;
}
.cta-content {
  position: relative;
}
.cta-title {
  font-size: clamp(1.6rem, 2.4vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
}
.cta-sub {
  color: var(--app-text-muted);
  margin: 0 0 22px;
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
}
</style>
