<template>
  <RouterLink :to="`/projects/${project.slug}`" class="block group">
    <article class="card surface overflow-hidden">
      <div class="relative aspect-[16/10] overflow-hidden">
        <img
          :src="project.coverImageUrl"
          :alt="project.title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div class="absolute top-3 left-3 flex gap-2">
          <span class="badge" :class="pricingBadgeClass">{{ pricingLabel }}</span>
          <span v-if="project.featured" class="badge badge-accent">Featured</span>
        </div>
        <button
          type="button"
          class="fav-btn"
          :class="{ active: isFav }"
          :aria-label="isFav ? 'Remove from favorites' : 'Add to favorites'"
          @click.prevent="onToggleFav"
        >
          <el-icon :size="16"><Star /></el-icon>
        </button>
      </div>
      <div class="p-5 space-y-3">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-semibold text-base leading-tight line-clamp-1">
            {{ project.title }}
          </h3>
          <span class="font-bold text-brand-600 dark:text-brand-400 whitespace-nowrap">
            {{ price }}
          </span>
        </div>
        <p class="text-sm muted line-clamp-2">{{ project.shortDescription }}</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tech in project.techStack.slice(0, 3)"
            :key="tech"
            class="tech-chip"
          >
            {{ tech }}
          </span>
        </div>
        <div class="flex items-center justify-between pt-1 text-xs muted">
          <span class="inline-flex items-center gap-1">
            <el-icon :size="14"><Star /></el-icon>
            {{ project.rating.toFixed(1) }}
            <span class="opacity-70">({{ formatNumber(project.reviewCount) }})</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <el-icon :size="14"><Download /></el-icon>
            {{ formatNumber(project.downloadCount) }}
          </span>
          <span class="inline-flex items-center gap-1">
            <el-icon :size="14"><View /></el-icon>
            {{ formatNumber(project.viewCount) }}
          </span>
        </div>
      </div>
    </article>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Download, Star, View } from '@element-plus/icons-vue'
import type { Project } from '@/types/models'
import { formatNumber, formatPrice } from '@/utils/format'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps<{ project: Project }>()

const favorites = useFavoritesStore()
const isFav = computed(() => favorites.has(props.project.id))

const price = computed(() => formatPrice(props.project.priceCents, props.project.currency))

const pricingLabel = computed(() => {
  switch (props.project.pricingType) {
    case 'paid':
      return 'Paid'
    case 'open_source':
      return 'Open Source'
    case 'free':
    default:
      return 'Free'
  }
})

const pricingBadgeClass = computed(() => {
  switch (props.project.pricingType) {
    case 'paid':
      return 'badge-paid'
    case 'open_source':
      return 'badge-oss'
    default:
      return 'badge-free'
  }
})

function onToggleFav(): void {
  favorites.toggle(props.project.id)
}
</script>

<style scoped>
.card {
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;
}
.card:hover {
  transform: translateY(-3px);
  border-color: var(--app-border-strong);
  box-shadow:
    0 10px 30px -10px rgba(99, 102, 241, 0.35),
    0 4px 8px -4px rgba(15, 23, 42, 0.18);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.02em;
  backdrop-filter: blur(6px);
}
.badge-free {
  background: rgba(16, 185, 129, 0.18);
  color: #047857;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
html.dark .badge-free {
  color: #6ee7b7;
}
.badge-paid {
  background: rgba(99, 102, 241, 0.2);
  color: #4338ca;
  border: 1px solid rgba(99, 102, 241, 0.35);
}
html.dark .badge-paid {
  color: #c7d2fe;
}
.badge-oss {
  background: rgba(245, 158, 11, 0.18);
  color: #b45309;
  border: 1px solid rgba(245, 158, 11, 0.35);
}
html.dark .badge-oss {
  color: #fcd34d;
}
.badge-accent {
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  border: 1px solid transparent;
}

.tech-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--app-surface-2);
  border: 1px solid var(--app-border);
  color: var(--app-text-muted);
}

.fav-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: rgba(15, 19, 48, 0.55);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: transform 160ms ease, color 160ms ease;
}
.fav-btn:hover {
  transform: scale(1.08);
}
.fav-btn.active {
  color: #fcd34d;
}
</style>
