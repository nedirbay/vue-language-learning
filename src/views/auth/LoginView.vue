<template>
  <div class="login">
    <h1>Welcome back</h1>
    <p class="muted">Sign in to continue to DevHub.</p>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="form"
      @submit.prevent="onSubmit"
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" type="email" placeholder="you@dev.team" size="large" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="label-row">
            <span>Password</span>
            <RouterLink to="/forgot-password" class="forgot">Forgot?</RouterLink>
          </div>
        </template>
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="Your password"
          size="large"
          @keyup.enter="onSubmit"
        />
      </el-form-item>
      <el-button
        type="primary"
        size="large"
        class="w-full"
        :loading="auth.loading"
        @click="onSubmit"
      >
        Sign in
      </el-button>
    </el-form>

    <div class="divider"><span>or</span></div>

    <div class="oauth">
      <el-button size="large" class="w-full" @click="onOauth('github')">
        <span class="oauth-label">Continue with GitHub</span>
      </el-button>
      <el-button size="large" class="w-full" @click="onOauth('google')">
        <span class="oauth-label">Continue with Google</span>
      </el-button>
    </div>

    <p class="muted text-sm text-center mt-6">
      No account?
      <RouterLink to="/register" class="text-brand">Create one</RouterLink>
    </p>

    <div class="demo">
      <el-alert
        type="info"
        :closable="false"
        title="Demo tip"
        description="Try email containing 'admin' to enter as an admin. Any password 4+ chars works."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const formRef = ref<FormInstance>()
const form = reactive({
  email: '',
  password: '',
})

const rules: FormRules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Enter a valid email', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 4, message: 'At least 4 characters', trigger: 'blur' },
  ],
}

async function onSubmit(): Promise<void> {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    await auth.login(form.email, form.password)
    ElMessage.success('Welcome back!')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.push(redirect)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Sign in failed.'
    ElMessage.error(message)
  }
}

function onOauth(provider: 'github' | 'google'): void {
  ElMessage.info(
    `${provider === 'github' ? 'GitHub' : 'Google'} login requires configured OAuth credentials in production.`,
  )
}
</script>

<style scoped>
h1 {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
}
.form {
  margin-top: 22px;
}
.label-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.forgot {
  color: var(--app-accent);
  font-size: 0.85rem;
}
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0;
  color: var(--app-text-muted);
  font-size: 0.85rem;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--app-border);
}
.oauth {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.oauth-label {
  font-weight: 500;
}
.text-brand {
  color: var(--app-accent);
  font-weight: 500;
}
.demo {
  margin-top: 18px;
}
</style>
