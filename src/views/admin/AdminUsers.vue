<template>
  <div>
    <div class="bar">
      <el-input v-model="search" placeholder="Search by name, email, username…" clearable class="w-80">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-segmented v-model="roleFilter" :options="roleOptions" />
    </div>
    <el-table :data="filtered" class="surface">
      <el-table-column label="User" min-width="280">
        <template #default="{ row }">
          <div class="user-cell">
            <el-avatar :size="36" :src="row.avatarUrl" />
            <div class="leading-tight">
              <div class="font-semibold">{{ row.fullName }}</div>
              <div class="text-xs muted">{{ row.email }} · @{{ row.username }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Role" width="140">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'primary' : 'info'" effect="light">
            {{ row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Email verified" width="160">
        <template #default="{ row }">
          <el-icon v-if="row.emailVerified" class="text-emerald-500"><CircleCheck /></el-icon>
          <el-icon v-else class="text-orange-400"><Warning /></el-icon>
          {{ row.emailVerified ? 'Verified' : 'Pending' }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="140">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'" effect="light">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Joined" width="160">
        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="" width="180" align="right">
        <template #default="{ row }">
          <el-button v-if="row.status === 'active'" size="small" type="warning" plain @click="toggleStatus(row)">
            Suspend
          </el-button>
          <el-button v-else size="small" type="success" plain @click="toggleStatus(row)">
            Reactivate
          </el-button>
          <el-button size="small" plain @click="toggleRole(row)">
            {{ row.role === 'admin' ? 'Demote' : 'Promote' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { api } from '@/api'
import type { User } from '@/types/models'
import { formatDate } from '@/utils/format'

const users = ref<User[]>([])
const search = ref('')
const roleFilter = ref<'all' | 'admin' | 'user'>('all')

const roleOptions = [
  { label: 'All', value: 'all' },
  { label: 'Admins', value: 'admin' },
  { label: 'Users', value: 'user' },
]

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return users.value.filter((u) => {
    if (roleFilter.value !== 'all' && u.role !== roleFilter.value) return false
    if (!q) return true
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    )
  })
})

function toggleStatus(u: User): void {
  u.status = u.status === 'active' ? 'suspended' : 'active'
  ElMessage.success(`${u.username} ${u.status === 'active' ? 'reactivated' : 'suspended'}.`)
}

function toggleRole(u: User): void {
  u.role = u.role === 'admin' ? 'user' : 'admin'
  ElMessage.success(`${u.username} role updated.`)
}

onMounted(async () => {
  users.value = await api.users()
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
  gap: 12px;
}
</style>
