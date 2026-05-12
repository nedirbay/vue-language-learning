<template>
  <div>
    <div class="bar">
      <el-segmented v-model="filter" :options="filterOptions" />
      <el-input v-model="search" placeholder="Search by order id, user, project…" clearable class="w-80">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
    </div>
    <el-table :data="filtered" class="surface">
      <el-table-column prop="id" label="Order" width="180" />
      <el-table-column label="Customer" min-width="200">
        <template #default="{ row }">
          <div class="user-cell">
            <el-avatar :size="28" :src="row.user.avatarUrl" />
            <div class="leading-tight">
              <div class="font-medium">{{ row.user.fullName }}</div>
              <div class="text-xs muted">{{ row.user.email }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Project" min-width="200">
        <template #default="{ row }">{{ row.project.title }}</template>
      </el-table-column>
      <el-table-column label="Amount" width="120">
        <template #default="{ row }">{{ formatPrice(row.amountCents, row.currency) }}</template>
      </el-table-column>
      <el-table-column label="Status" width="120">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" effect="light">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Created" width="180">
        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="" width="120" align="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'paid'"
            size="small"
            type="warning"
            plain
            @click="refund(row)"
          >
            Refund
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { api } from '@/api'
import type { Order } from '@/types/models'
import { formatDate, formatPrice } from '@/utils/format'

const orders = ref<Order[]>([])
const filter = ref<'all' | Order['status']>('all')
const search = ref('')

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Refunded', value: 'refunded' },
]

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return orders.value.filter((o) => {
    if (filter.value !== 'all' && o.status !== filter.value) return false
    if (!q) return true
    return (
      o.id.toLowerCase().includes(q) ||
      o.user.fullName.toLowerCase().includes(q) ||
      o.user.email.toLowerCase().includes(q) ||
      o.project.title.toLowerCase().includes(q)
    )
  })
})

function statusType(s: Order['status']): 'success' | 'warning' | 'info' | 'danger' {
  switch (s) {
    case 'paid':
      return 'success'
    case 'pending':
      return 'warning'
    case 'refunded':
      return 'info'
    default:
      return 'danger'
  }
}

function refund(o: Order): void {
  o.status = 'refunded'
  ElMessage.success(`Order ${o.id} refunded.`)
}

onMounted(async () => {
  orders.value = await api.orders()
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
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
