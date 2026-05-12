<template>
  <div class="purchases">
    <div v-if="loading" class="loading">
      <el-skeleton :rows="6" animated />
    </div>
    <div v-else-if="orders.length === 0" class="empty surface">
      <h3>No purchases yet</h3>
      <p class="muted">When you buy a project, you'll find it here.</p>
      <RouterLink to="/projects"><el-button type="primary">Browse projects</el-button></RouterLink>
    </div>
    <el-table v-else :data="orders" :stripe="false" class="surface">
      <el-table-column label="Project" min-width="300">
        <template #default="{ row }">
          <RouterLink :to="`/projects/${row.project.slug}`" class="row-project">
            <img :src="row.project.coverImageUrl" :alt="row.project.title" />
            <div class="leading-tight">
              <div class="font-semibold">{{ row.project.title }}</div>
              <div class="text-xs muted">{{ row.id }}</div>
            </div>
          </RouterLink>
        </template>
      </el-table-column>
      <el-table-column label="Amount" width="140">
        <template #default="{ row }">
          {{ formatPrice(row.amountCents, row.currency) }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="140">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" effect="light">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="180">
        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="" width="120" align="right">
        <template #default="{ row }">
          <el-button :disabled="row.status !== 'paid'" size="small">
            <el-icon class="mr-1"><Download /></el-icon> Download
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Download } from '@element-plus/icons-vue'
import { api } from '@/api'
import type { Order } from '@/types/models'
import { formatDate, formatPrice } from '@/utils/format'

const orders = ref<Order[]>([])
const loading = ref(true)

function statusType(s: Order['status']): 'success' | 'warning' | 'danger' | 'info' {
  switch (s) {
    case 'paid':
      return 'success'
    case 'pending':
      return 'warning'
    case 'refunded':
      return 'info'
    case 'failed':
    default:
      return 'danger'
  }
}

onMounted(async () => {
  try {
    orders.value = await api.orders()
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
.row-project {
  display: flex;
  align-items: center;
  gap: 12px;
}
.row-project img {
  width: 48px;
  height: 32px;
  object-fit: cover;
  border-radius: 6px;
}
.loading {
  padding: 20px;
}
</style>
