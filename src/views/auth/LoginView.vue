<template>
  <div class="login">
    <h1>{{ $t('auth.welcomeBack') }}</h1>
    <p class="muted">{{ $t('auth.signInSub') }}</p>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="form"
      @submit.prevent="onSubmit"
    >
      <el-form-item :label="$t('auth.email')" prop="email">
        <el-input v-model="form.email" type="email" :placeholder="$t('auth.emailPlaceholder')" size="large" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="label-row">
            <span>{{ $t('auth.password') }}</span>
            <RouterLink to="/forgot-password" class="forgot">{{ $t('auth.forgot') }}</RouterLink>
          </div>
        </template>
        <el-input
          v-model="form.password"
          type="password"
          show-password
          :placeholder="$t('auth.passwordPlaceholder')"
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
        {{ $t('auth.signIn') }}
      </el-button>
    </el-form>

    <div class="divider"><span>{{ $t('auth.or') }}</span></div>

    <div class="oauth">
      <button type="button" class="oauth-btn" @click="onOauth('github')">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"
          />
        </svg>
        <span>{{ $t('auth.orContinueWith') }} {{ $t('auth.github') }}</span>
      </button>
      <button type="button" class="oauth-btn" @click="onOauth('google')">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.4-1.1 2.58-2.36 3.37v2.8h3.81c2.23-2.05 3.57-5.07 3.57-8.41Z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.81-2.8c-1.06.71-2.41 1.13-4.12 1.13-3.17 0-5.85-2.14-6.81-5.02H1.27v3.16C3.24 21.31 7.31 24 12 24Z"/>
          <path fill="#FBBC05" d="M5.19 14.4a7.2 7.2 0 0 1 0-4.79V6.45H1.27a12 12 0 0 0 0 11.1l3.92-3.15Z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.36.61 4.61 1.81l3.39-3.39C17.94 1.19 15.24 0 12 0 7.31 0 3.24 2.69 1.27 6.45l3.92 3.16C6.15 6.89 8.83 4.75 12 4.75Z"/>
        </svg>
        <span>{{ $t('auth.orContinueWith') }} {{ $t('auth.google') }}</span>
      </button>
    </div>

    <p class="muted text-sm text-center mt-6">
      {{ $t('auth.dontHaveAccount') }}
      <RouterLink to="/register" class="text-brand">{{ $t('auth.createAccount') }}</RouterLink>
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
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
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
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: 'blur' },
    { min: 4, message: t('auth.passwordMin'), trigger: 'blur' },
  ],
}

async function onSubmit(): Promise<void> {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    await auth.login(form.email, form.password)
    ElMessage.success(t('auth.welcomeBack'))
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.push(redirect)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : t('auth.loginFailed')
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
  gap: 10px;
}
.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  color: var(--app-text);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease;
}
.oauth-btn:hover {
  background: var(--app-surface-2);
  border-color: var(--app-border-strong);
}
.oauth-btn svg {
  flex-shrink: 0;
}
.text-brand {
  color: var(--app-accent);
  font-weight: 500;
}
.demo {
  margin-top: 18px;
}
</style>
