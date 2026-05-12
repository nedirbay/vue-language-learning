<template>
  <button
    type="button"
    :title="mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    class="theme-toggle"
    @click="theme.toggle()"
  >
    <el-icon :size="18">
      <Sunny v-if="mode === 'dark'" />
      <Moon v-else />
    </el-icon>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
const mode = computed(() => theme.mode)
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  color: var(--app-text);
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}
.theme-toggle:hover {
  background: var(--app-surface-2);
  transform: translateY(-1px);
}
</style>
