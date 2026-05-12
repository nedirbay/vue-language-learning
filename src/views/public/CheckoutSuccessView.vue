<template>
  <div class="checkout-page">
    <div class="card surface">
      <div class="icon-wrap">
        <el-icon :size="42"><CircleCheck /></el-icon>
      </div>
      <h1>Thank you for your purchase!</h1>
      <p class="muted">
        We've emailed your receipt and download link. You can also access this project from
        your dashboard at any time.
      </p>
      <div class="actions">
        <RouterLink to="/dashboard/purchases">
          <el-button type="primary" size="large" round>Go to my purchases</el-button>
        </RouterLink>
        <RouterLink to="/projects">
          <el-button size="large" round>Browse more</el-button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { CircleCheck } from '@element-plus/icons-vue'
</script>

<style scoped>
.checkout-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
}
.card {
  max-width: 520px;
  text-align: center;
  padding: 40px;
}
.icon-wrap {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.16);
  color: #10b981;
}
h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 8px;
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 22px;
}
</style>
