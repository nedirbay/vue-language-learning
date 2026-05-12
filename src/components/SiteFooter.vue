<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="grid gap-10 md:grid-cols-4">
        <div>
          <RouterLink to="/" class="flex items-center gap-2 font-extrabold text-lg">
            <span class="logo-mark">D</span>
            <span>DevHub</span>
          </RouterLink>
          <p class="muted text-sm mt-3 max-w-xs">
            A marketplace and showcase for software projects, tools, templates, and
            open-source resources — built for developers.
          </p>
        </div>
        <div>
          <h4 class="footer-title">Product</h4>
          <ul class="footer-list">
            <li><RouterLink to="/projects">Projects</RouterLink></li>
            <li><RouterLink to="/open-source">Open source</RouterLink></li>
            <li><RouterLink to="/blog">Blog</RouterLink></li>
            <li><RouterLink to="/about">About</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-title">Account</h4>
          <ul class="footer-list">
            <li><RouterLink to="/login">Sign in</RouterLink></li>
            <li><RouterLink to="/register">Create account</RouterLink></li>
            <li><RouterLink to="/dashboard">Dashboard</RouterLink></li>
            <li><RouterLink to="/dashboard/settings">Settings</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-title">Stay in the loop</h4>
          <p class="muted text-sm mb-3">
            New releases and dev essays — at most once a month.
          </p>
          <form class="flex gap-2" @submit.prevent="subscribe">
            <el-input v-model="email" type="email" placeholder="you@dev.team" size="default" />
            <el-button type="primary" native-type="submit">Join</el-button>
          </form>
          <p v-if="message" class="text-xs mt-2" :class="error ? 'text-red-500' : 'text-emerald-500'">
            {{ message }}
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <span class="muted text-xs">© {{ year }} DevHub. All rights reserved.</span>
        <div class="flex gap-4 text-xs muted">
          <a href="#" rel="noopener">Privacy</a>
          <a href="#" rel="noopener">Terms</a>
          <a href="#" rel="noopener">Status</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'

const email = ref('')
const message = ref('')
const error = ref(false)

const year = computed(() => new Date().getFullYear())

function subscribe(): void {
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = true
    message.value = 'Please enter a valid email.'
    return
  }
  error.value = false
  message.value = `Thanks! ${email.value} is on the list.`
  ElMessage.success('Subscribed.')
  email.value = ''
}
</script>

<style scoped>
.site-footer {
  margin-top: 80px;
  background: var(--app-surface);
  border-top: 1px solid var(--app-border);
}
.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 56px 24px 24px;
}
.logo-mark {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  color: white;
  font-weight: 800;
}
.footer-title {
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--app-text);
  margin-bottom: 12px;
}
.footer-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.footer-list a {
  color: var(--app-text-muted);
  font-size: 0.92rem;
  transition: color 160ms ease;
}
.footer-list a:hover {
  color: var(--app-accent);
}
.footer-bottom {
  margin-top: 40px;
  padding-top: 18px;
  border-top: 1px solid var(--app-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
