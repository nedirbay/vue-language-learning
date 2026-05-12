<template>
  <div class="favs">
    <div v-if="loading" class="loading">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else-if="items.length === 0" class="empty surface">
      <el-icon :size="36" class="muted"><Star /></el-icon>
      <h3>Nothing saved yet</h3>
      <p class="muted">Tap the star icon on any project to bookmark it for later.</p>
      <RouterLink to="/projects"><el-button type="primary">Find projects</el-button></RouterLink>
    </div>
    <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <ProjectCard v-for="p in items" :key="p.id" :project="p" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Star } from '@element-plus/icons-vue'
import { api } from '@/api'
import ProjectCard from '@/components/ProjectCard.vue'
import type { Project } from '@/types/models'
import { useFavoritesStore } from '@/stores/favorites'

const favorites = useFavoritesStore()
const all = ref<Project[]>([])
const loading = ref(true)

const items = computed(() => all.value.filter((p) => favorites.has(p.id)))

onMounted(async () => {
  try {
    const res = await api.projects({ pageSize: 50 })
    all.value = res.items
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.empty {
  padding: 60px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.loading {
  padding: 20px;
}
</style>
