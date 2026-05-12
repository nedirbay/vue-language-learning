<template>
  <div class="not-found-page">
    <div class="content">
      <div class="text-gradient code">404</div>
      <h1>{{ $t('common.pageNotFound') }}</h1>
      <p class="muted">
        {{ $t('common.pageNotFoundSub') }}
      </p>
      <div class="actions">
        <RouterLink to="/">
          <el-button type="primary" round size="large">{{ $t('common.takeMeHome') }}</el-button>
        </RouterLink>
        <RouterLink to="/projects">
          <el-button round size="large">{{ $t('common.browseProjects') }}</el-button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}
.code {
  font-size: clamp(5rem, 14vw, 9rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 12px;
}
h1 {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  margin: 0 0 8px;
}
.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
}
</style>
