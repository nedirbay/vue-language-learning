<template>
  <div>
    <div class="bar">
      <el-input
        v-model="search"
        :placeholder="$t('studio.search')"
        clearable
        class="w-80"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="$router.push('/studio/projects/new')">
        <el-icon class="mr-1"><Plus /></el-icon> {{ $t('studio.newProject') }}
      </el-button>
    </div>

    <div v-if="!loading && !projects.length" class="surface empty">
      <p>{{ $t('studio.empty') }}</p>
      <el-button type="primary" @click="$router.push('/studio/projects/new')">
        <el-icon class="mr-1"><Plus /></el-icon>
        {{ $t('studio.startUploading') }}
      </el-button>
    </div>

    <el-table v-else :data="filtered" class="surface">
      <el-table-column :label="$t('studio.table.project')" min-width="280">
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
      <el-table-column :label="$t('studio.table.pricing')" width="140">
        <template #default="{ row }">
          <el-tag :type="pricingTag(row.pricingType)" effect="light">
            {{ pricingLabel(row.pricingType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('studio.table.price')" width="120">
        <template #default="{ row }">{{ formatPrice(row.priceCents, row.currency) }}</template>
      </el-table-column>
      <el-table-column :label="$t('studio.table.status')" width="140">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'" effect="light">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('studio.table.downloads')" width="120">
        <template #default="{ row }">{{ formatNumber(row.downloadCount) }}</template>
      </el-table-column>
      <el-table-column label="" width="200" align="right">
        <template #default="{ row }">
          <el-button size="small" @click="$router.push(`/studio/projects/${row.id}/edit`)">
            {{ $t('studio.edit') }}
          </el-button>
          <el-button size="small" type="danger" plain @click="confirmDelete(row)">
            {{ $t('studio.delete') }}
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
import { useI18n } from 'vue-i18n'
import { api } from '@/api'
import { useAuthStore } from '@/stores/auth'
import type { Project, ProjectPricingType } from '@/types/models'
import { formatNumber, formatPrice } from '@/utils/format'

const { t } = useI18n()
const auth = useAuthStore()
const projects = ref<Project[]>([])
const search = ref('')
const loading = ref(true)

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
      t('studio.deleteConfirm', { title: row.title }),
      t('studio.deleteTitle'),
      {
        confirmButtonText: t('studio.delete'),
        cancelButtonText: t('studio.cancel'),
        type: 'warning',
      },
    )
    if (!auth.user) return
    await api.deleteProject(row.id, auth.user)
    projects.value = projects.value.filter((p) => p.id !== row.id)
    ElMessage.success(t('studio.deleted'))
  } catch {
    /* cancelled */
  }
}

async function load(): Promise<void> {
  loading.value = true
  try {
    if (!auth.user) {
      projects.value = []
      return
    }
    projects.value = await api.myProjects(auth.user.id)
  } finally {
    loading.value = false
  }
}

onMounted(load)
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
.empty {
  padding: 32px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;
}
</style>
