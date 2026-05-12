<template>
  <div class="register">
    <h1>Create your account</h1>
    <p class="muted">Free forever. No credit card required.</p>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="form"
      @submit.prevent="onSubmit"
    >
      <el-form-item label="Full name" prop="fullName">
        <el-input v-model="form.fullName" placeholder="Ada Lovelace" size="large" />
      </el-form-item>
      <el-form-item label="Username" prop="username">
        <el-input v-model="form.username" placeholder="ada" size="large" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" type="email" placeholder="you@dev.team" size="large" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="At least 8 characters"
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
        Create account
      </el-button>
    </el-form>

    <p class="muted text-sm text-center mt-6">
      Already a member?
      <RouterLink to="/login" class="text-brand">Sign in</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

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
  fullName: [{ required: true, message: 'Your name', trigger: 'blur' }],
  username: [
    { required: true, message: 'Username is required', trigger: 'blur' },
    { min: 3, message: 'At least 3 characters', trigger: 'blur' },
    { pattern: /^[a-z0-9_]+$/, message: 'Lowercase, numbers, underscore only', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Enter a valid email', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 8, message: 'At least 8 characters', trigger: 'blur' },
  ],
}

async function onSubmit(): Promise<void> {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    await auth.register({ ...form })
    ElMessage.success('Welcome to DevHub!')
    router.push('/dashboard')
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Registration failed.'
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
