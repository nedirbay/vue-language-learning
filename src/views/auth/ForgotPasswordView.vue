<template>
  <div class="forgot">
    <h1>Forgot your password?</h1>
    <p class="muted">
      Enter your email and we'll send you a reset link. (In demo mode no email is actually sent.)
    </p>

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
      <el-button
        type="primary"
        size="large"
        class="w-full"
        :loading="auth.loading"
        @click="onSubmit"
      >
        Send reset link
      </el-button>
    </el-form>

    <p v-if="sent" class="muted text-sm mt-4 text-center">
      If <strong>{{ form.email }}</strong> exists, a reset link is on its way.
    </p>

    <p class="muted text-sm text-center mt-6">
      Remember it now?
      <RouterLink to="/login" class="text-brand">Back to sign in</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const formRef = ref<FormInstance>()
const sent = ref(false)
const form = reactive({ email: '' })

const rules: FormRules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Enter a valid email', trigger: 'blur' },
  ],
}

async function onSubmit(): Promise<void> {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    await auth.forgotPassword(form.email)
    sent.value = true
    ElMessage.success('Reset link sent.')
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Could not send reset link.'
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
