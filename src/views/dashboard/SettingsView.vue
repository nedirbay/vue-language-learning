<template>
  <div class="settings">
    <section class="surface card">
      <header class="card-head">
        <h3>Profile</h3>
        <p class="muted text-sm">Update your public profile information.</p>
      </header>
      <div class="profile">
        <el-avatar :size="72" :src="form.avatarUrl" />
        <div class="flex-1 grid gap-3 sm:grid-cols-2">
          <el-input v-model="form.fullName" placeholder="Full name">
            <template #prepend>Name</template>
          </el-input>
          <el-input v-model="form.username" placeholder="username">
            <template #prepend>@</template>
          </el-input>
          <el-input v-model="form.email" placeholder="you@dev.team" class="sm:col-span-2">
            <template #prepend>Email</template>
          </el-input>
          <el-input
            v-model="form.bio"
            type="textarea"
            :rows="3"
            placeholder="A short bio…"
            class="sm:col-span-2"
          />
        </div>
      </div>
      <div class="card-actions">
        <el-button type="primary" @click="save">Save changes</el-button>
      </div>
    </section>

    <section class="surface card">
      <header class="card-head">
        <h3>Preferences</h3>
        <p class="muted text-sm">Theme and notification settings.</p>
      </header>
      <div class="prefs">
        <div class="pref-row">
          <div>
            <div class="font-medium">Appearance</div>
            <div class="muted text-sm">Light or dark mode</div>
          </div>
          <el-radio-group v-model="theme.mode" @change="onThemeChange">
            <el-radio-button label="light">Light</el-radio-button>
            <el-radio-button label="dark">Dark</el-radio-button>
          </el-radio-group>
        </div>
        <div class="pref-row">
          <div>
            <div class="font-medium">Email notifications</div>
            <div class="muted text-sm">Receive product updates and offers</div>
          </div>
          <el-switch v-model="notifications" />
        </div>
        <div class="pref-row">
          <div>
            <div class="font-medium">Two-factor authentication</div>
            <div class="muted text-sm">Add an extra layer of security</div>
          </div>
          <el-button plain>Set up</el-button>
        </div>
      </div>
    </section>

    <section class="surface card danger">
      <header class="card-head">
        <h3>Danger zone</h3>
        <p class="muted text-sm">Irreversible actions for your account.</p>
      </header>
      <div class="prefs">
        <div class="pref-row">
          <div>
            <div class="font-medium">Sign out everywhere</div>
            <div class="muted text-sm">Revoke all active sessions</div>
          </div>
          <el-button type="warning" plain @click="auth.logout">Sign out</el-button>
        </div>
        <div class="pref-row">
          <div>
            <div class="font-medium">Delete account</div>
            <div class="muted text-sm">This action cannot be undone</div>
          </div>
          <el-button type="danger" plain @click="confirmDelete">Delete…</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ThemeMode } from '@/stores/theme'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

const theme = useThemeStore()
const auth = useAuthStore()

const form = reactive({
  fullName: auth.user?.fullName ?? '',
  username: auth.user?.username ?? '',
  email: auth.user?.email ?? '',
  bio: '',
  avatarUrl: auth.user?.avatarUrl,
})

const notifications = ref(true)

function save(): void {
  ElMessage.success('Profile saved.')
}

function onThemeChange(value: string | number | boolean | undefined): void {
  if (value === 'light' || value === 'dark') {
    theme.setMode(value as ThemeMode)
  }
}

async function confirmDelete(): Promise<void> {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete your account and all data. Continue?',
      'Delete account',
      { confirmButtonText: 'Delete', cancelButtonText: 'Cancel', type: 'warning' },
    )
    ElMessage.success('Account deletion scheduled.')
  } catch {
    /* cancelled */
  }
}
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.card {
  padding: 22px;
}
.card-head {
  margin-bottom: 14px;
}
.card-head h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 2px;
}
.card-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
.profile {
  display: flex;
  gap: 18px;
  align-items: flex-start;
}
.prefs {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.pref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--app-surface-2);
}
.danger {
  border-color: rgba(239, 68, 68, 0.4);
}
</style>
