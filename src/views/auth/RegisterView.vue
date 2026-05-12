<template>
  <div class="register">
    <h1>{{ $t('auth.createAccount') }}</h1>
    <p class="muted">{{ $t('auth.freeForever') }}</p>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="form"
      @submit.prevent="onSubmit"
    >
      <el-form-item :label="$t('auth.fullName')" prop="fullName">
        <el-input v-model="form.fullName" placeholder="Ada Lovelace" size="large" />
      </el-form-item>
      <el-form-item :label="$t('auth.username')" prop="username">
        <el-input v-model="form.username" placeholder="ada" size="large" />
      </el-form-item>
      <el-form-item :label="$t('auth.email')" prop="email">
        <el-input v-model="form.email" type="email" :placeholder="$t('auth.emailPlaceholder')" size="large" />
      </el-form-item>
      <el-form-item :label="$t('auth.password')" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          :placeholder="$t('auth.passwordMin8')"
          size="large"
        />
      </el-form-item>

      <el-button
        type="primary"
        size="large"
        class="w-full"
        :loading="auth.loading"
        @click="onSubmit"
      >
        {{ $t('auth.createAccount') }}
      </el-button>
    </el-form>

    <p class="muted text-sm text-center mt-6">
      {{ $t('auth.alreadyHaveAccount') }}
      <RouterLink to="/login" class="text-brand">{{ $t('auth.signIn') }}</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const formRef = ref<FormInstance>()
const form = reactive({
  fullName: '',
  username: '',
  email: '',
  password: '',
})

const rules: FormRules = {
  fullName: [{ required: true, message: t('auth.nameRequired'), trigger: 'blur' }],
  username: [
    { required: true, message: t('auth.usernameRequired'), trigger: 'blur' },
    { min: 3, message: t('auth.usernameMin'), trigger: 'blur' },
    { pattern: /^[a-z0-9_]+$/, message: t('auth.usernamePattern'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: 'blur' },
    { min: 8, message: t('auth.passwordMin8'), trigger: 'blur' },
  ],
}

async function onSubmit(): Promise<void> {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    await auth.register({ ...form })
    ElMessage.success(t('auth.welcome'))
    router.push('/dashboard')
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : t('auth.registerFailed')
    ElMessage.error(message)
  }
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
.text-brand {
  color: var(--app-accent);
  font-weight: 500;
}
</style>
