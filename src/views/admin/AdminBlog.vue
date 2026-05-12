<template>
  <div>
    <div class="bar">
      <el-input v-model="search" placeholder="Filter posts…" clearable class="w-80">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary">
        <el-icon class="mr-1"><Plus /></el-icon> New post
      </el-button>
    </div>
    <el-table :data="filtered" class="surface">
      <el-table-column label="Title" min-width="320">
        <template #default="{ row }">
          <div class="font-semibold">{{ row.title }}</div>
          <div class="text-xs muted">/{{ row.slug }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="200">
        <template #default="{ row }">
          <div class="author">
            <el-avatar :size="24" :src="row.author.avatarUrl" />
            <span class="text-sm">{{ row.author.fullName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Tags" min-width="200">
        <template #default="{ row }">
          <el-tag v-for="t in row.tags" :key="t" size="small" effect="light" class="mr-1">{{ t }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Published" width="180">
        <template #default="{ row }">{{ formatDate(row.publishedAt) }}</template>
      </el-table-column>
      <el-table-column label="" width="180" align="right">
        <template>
          <el-button size="small">Edit</el-button>
          <el-button size="small" type="danger" plain>Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { api } from '@/api'
import type { BlogPost } from '@/types/models'
import { formatDate } from '@/utils/format'

const posts = ref<BlogPost[]>([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return posts.value
  return posts.value.filter(
    (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
  )
})

onMounted(async () => {
  posts.value = await api.blogPosts()
})
</script>

<style scoped>
.bar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.author {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
