<template>
  <div>
    <div class="bar">
      <el-input
        v-model="search"
        placeholder="Filter by title…"
        clearable
        class="w-80"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="$router.push('/admin/projects/new')">
        <el-icon class="mr-1"><Plus /></el-icon> New project
      </el-button>
    </div>
    <el-table :data="filtered" class="surface">
      <el-table-column label="Project" min-width="280">
        <template #default="{ row }">
          <div class="cell-project">
            <img :src="row.coverImageUrl" :alt="row.title" />
            <div class="leading-tight">
              <div class="font-semibold">{{ row.title }}</div>
              <div class="text-xs muted">/{{ row.slug }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="180">
        <template #default="{ row }">
          <div class="cell-author">
            <el-avatar :size="24" :src="row.author.avatarUrl" />
            <span class="text-sm">{{ row.author.fullName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Pricing" width="140">
        <template #default="{ row }">
          <el-tag :type="pricingTag(row.pricingType)" effect="light">
            {{ pricingLabel(row.pricingType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Price" width="120">
        <template #default="{ row }">{{ formatPrice(row.priceCents, row.currency) }}</template>
      </el-table-column>
      <el-table-column label="Status" width="140">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'" effect="light">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Downloads" width="120">
        <template #default="{ row }">{{ formatNumber(row.downloadCount) }}</template>
      </el-table-column>
      <el-table-column label="Rating" width="100">
        <template #default="{ row }">⭐ {{ row.rating.toFixed(1) }}</template>
      </el-table-column>
      <el-table-column label="" width="180" align="right">
        <template #default="{ row }">
          <el-button size="small" @click="$router.push(`/admin/projects/${row.id}/edit`)">
            Edit
          </el-button>
          <el-button size="small" type="danger" plain @click="confirmDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { api } from '@/api'
import { useAuthStore } from '@/stores/auth'
import type { Project, ProjectPricingType } from '@/types/models'
import { formatNumber, formatPrice } from '@/utils/format'

const auth = useAuthStore()

const projects = ref<Project[]>([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return projects.value
  return projects.value.filter(
    (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
  )
})

function pricingLabel(p: ProjectPricingType): string {
  return p === 'open_source' ? 'OSS' : p.charAt(0).toUpperCase() + p.slice(1)
}

function pricingTag(p: ProjectPricingType): 'success' | 'primary' | 'warning' {
  return p === 'free' ? 'success' : p === 'paid' ? 'primary' : 'warning'
}

async function confirmDelete(row: Project): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `Delete "${row.title}"? This action cannot be undone.`,
      'Delete project',
      { confirmButtonText: 'Delete', cancelButtonText: 'Cancel', type: 'warning' },
    )
    if (!auth.user) return
    await api.deleteProject(row.id, auth.user)
    projects.value = projects.value.filter((p) => p.id !== row.id)
    ElMessage.success('Project deleted.')
  } catch (e: unknown) {
    if (e instanceof Error) ElMessage.error(e.message)
  }
}

onMounted(async () => {
  const res = await api.projects({ pageSize: 50 })
  projects.value = res.items
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
.cell-project {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cell-project img {
  width: 56px;
  height: 36px;
  object-fit: cover;
  border-radius: 6px;
}
.cell-author {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
