<template>
  <div class="overview">
    <div class="stats">
      <div class="surface stat-card">
        <div class="muted text-xs uppercase tracking-wide">{{ $t('studio.stats.total') }}</div>
        <div class="big">{{ projects.length }}</div>
      </div>
      <div class="surface stat-card">
        <div class="muted text-xs uppercase tracking-wide">{{ $t('studio.stats.published') }}</div>
        <div class="big">{{ publishedCount }}</div>
      </div>
      <div class="surface stat-card">
        <div class="muted text-xs uppercase tracking-wide">{{ $t('studio.stats.drafts') }}</div>
        <div class="big">{{ draftCount }}</div>
      </div>
      <div class="surface stat-card">
        <div class="muted text-xs uppercase tracking-wide">{{ $t('studio.stats.downloads') }}</div>
        <div class="big">{{ formatNumber(totalDownloads) }}</div>
      </div>
    </div>

    <div v-if="!projects.length" class="surface empty">
      <p>{{ $t('studio.empty') }}</p>
      <el-button type="primary" @click="$router.push('/studio/projects/new')">
        <el-icon class="mr-1"><Plus /></el-icon>
        {{ $t('studio.startUploading') }}
      </el-button>
    </div>

    <div v-else class="surface recent">
      <header class="card-head">
        <h3>{{ $t('studio.myProjects') }}</h3>
        <RouterLink to="/studio/projects" class="text-sm muted underline">
          {{ $t('studio.myProjects') }} →
        </RouterLink>
      </header>
      <ul class="list">
        <li v-for="p in recent" :key="p.id">
          <RouterLink :to="`/studio/projects/${p.id}/edit`" class="row">
            <img :src="p.coverImageUrl" :alt="p.title" />
            <div class="leading-tight grow">
              <div class="font-semibold">{{ p.title }}</div>
              <div class="text-xs muted">/{{ p.slug }}</div>
            </div>
            <el-tag :type="p.status === 'published' ? 'success' : 'info'" effect="light">
              {{ p.status }}
            </el-tag>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { api } from '@/api'
import { useAuthStore } from '@/stores/auth'
import type { Project } from '@/types/models'
import { formatNumber } from '@/utils/format'

const auth = useAuthStore()
const projects = ref<Project[]>([])

const publishedCount = computed(() => projects.value.filter((p) => p.status === 'published').length)
const draftCount = computed(() => projects.value.filter((p) => p.status === 'draft').length)
const totalDownloads = computed(() =>
  projects.value.reduce((sum, p) => sum + (p.downloadCount ?? 0), 0),
)
const recent = computed(() => projects.value.slice(0, 5))

onMounted(async () => {
  if (!auth.user) return
  projects.value = await api.myProjects(auth.user.id)
})
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.stats {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
.stat-card {
  padding: 16px 18px;
  border-radius: 14px;
}
.big {
  font-size: 1.8rem;
  font-weight: 800;
  margin-top: 4px;
}
.empty {
  padding: 32px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;
}
.recent {
  padding: 18px;
  border-radius: 14px;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-head h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}
.list {
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--app-border);
}
.list li:first-child .row {
  border-top: none;
}
.row img {
  width: 64px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}
.grow {
  flex: 1;
}
</style>
