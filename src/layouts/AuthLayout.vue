<template>
  <div class="auth-layout">
    <div class="bg-mesh" aria-hidden="true" />
    <div class="auth-shell">
      <RouterLink to="/" class="brand">
        <span class="logo-mark">D</span>
        <span>DevHub</span>
      </RouterLink>
      <div class="auth-card surface">
        <RouterView />
      </div>
      <p class="footer-note muted">
        © {{ year }} DevHub —
        <RouterLink to="/" class="underline">back to home</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, RouterLink } from 'vue-router'

const year = computed(() => new Date().getFullYear())
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  overflow: hidden;
}
.bg-mesh {
  position: absolute;
  inset: 0;
  background: radial-gradient(at 20% 20%, rgba(99, 102, 241, 0.22) 0px, transparent 50%),
    radial-gradient(at 80% 30%, rgba(217, 70, 239, 0.22) 0px, transparent 50%),
    radial-gradient(at 50% 80%, rgba(34, 211, 238, 0.16) 0px, transparent 55%);
  pointer-events: none;
  filter: blur(0.5px);
}
.auth-shell {
  position: relative;
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.01em;
}
.logo-mark {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  font-weight: 800;
}
.auth-card {
  width: 100%;
  padding: 36px;
}
.footer-note {
  font-size: 0.85rem;
}
</style>
