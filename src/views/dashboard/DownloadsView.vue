<template>
  <div>
    <p class="muted text-sm mb-3">
      Every download is logged here so you can quickly re-fetch a file you bought.
    </p>
    <el-table :data="rows" class="surface">
      <el-table-column label="Project" min-width="280">
        <template #default="{ row }">
          <div class="font-medium">{{ row.title }}</div>
          <div class="text-xs muted">v{{ row.version }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Source" width="160">
        <template #default="{ row }">
          <el-tag :type="row.source === 'Stripe' ? 'success' : 'info'" effect="light">
            {{ row.source }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Size" width="120">
        <template #default="{ row }">{{ row.size }}</template>
      </el-table-column>
      <el-table-column label="Downloaded" width="200">
        <template #default="{ row }">{{ row.when }}</template>
      </el-table-column>
      <el-table-column label="" width="140" align="right">
        <template>
          <el-button size="small">
            <el-icon class="mr-1"><Download /></el-icon> Re-download
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'

const rows = [
  {
    title: 'Atlas Admin Dashboard',
    version: '1.4.0',
    source: 'Stripe',
    size: '4.8 MB',
    when: '2 days ago',
  },
  {
    title: 'Quill Markdown Editor',
    version: '0.9.2',
    source: 'Free',
    size: '320 KB',
    when: '6 days ago',
  },
  {
    title: 'Helix Design Tokens',
    version: '2.1.0',
    source: 'Free',
    size: '1.1 MB',
    when: '2 weeks ago',
  },
]
</script>
