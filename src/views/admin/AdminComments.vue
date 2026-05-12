<template>
  <div>
    <p class="muted text-sm mb-4">
      Review reported reviews and comments. Mock data shown below for demonstration.
    </p>
    <el-table :data="rows" class="surface">
      <el-table-column label="Author" width="200">
        <template #default="{ row }">
          <div class="cell">
            <el-avatar :size="28" :src="row.avatar" />
            <span class="text-sm font-medium">{{ row.author }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Project" width="220">
        <template #default="{ row }">{{ row.project }}</template>
      </el-table-column>
      <el-table-column label="Comment">
        <template #default="{ row }">{{ row.body }}</template>
      </el-table-column>
      <el-table-column label="Status" width="140">
        <template #default="{ row }">
          <el-tag :type="row.status === 'flagged' ? 'danger' : 'success'" effect="light">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="" width="200" align="right">
        <template>
          <el-button size="small" type="success" plain>Approve</el-button>
          <el-button size="small" type="danger" plain>Remove</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
const rows = [
  {
    author: 'Maya Tanaka',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=maya',
    project: 'Atlas Admin Dashboard',
    body: 'Loved the architecture choices and tokens setup.',
    status: 'approved',
  },
  {
    author: 'Noah Becker',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=noah',
    project: 'Nimbus SaaS Starter',
    body: 'Found a small bug in the Stripe webhook handler.',
    status: 'flagged',
  },
  {
    author: 'Jin Park',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=jin',
    project: 'Orbit Component Library',
    body: 'Spammy promotional link.',
    status: 'flagged',
  },
]
</script>

<style scoped>
.cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
