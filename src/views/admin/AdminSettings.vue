<template>
  <div class="settings">
    <section class="surface card">
      <header class="card-head">
        <h3>Branding</h3>
        <p class="muted text-sm">Public-facing site identity.</p>
      </header>
      <el-form label-position="top" :model="form">
        <el-form-item label="Site name">
          <el-input v-model="form.siteName" />
        </el-form-item>
        <el-form-item label="Tagline">
          <el-input v-model="form.tagline" />
        </el-form-item>
        <el-form-item label="Support email">
          <el-input v-model="form.supportEmail" />
        </el-form-item>
      </el-form>
    </section>

    <section class="surface card">
      <header class="card-head">
        <h3>Payments</h3>
        <p class="muted text-sm">Stripe configuration. Secrets live server-side.</p>
      </header>
      <el-form label-position="top">
        <el-form-item label="Stripe publishable key">
          <el-input v-model="form.stripePublishable" placeholder="pk_live_…" />
        </el-form-item>
        <el-form-item label="Default currency">
          <el-select v-model="form.currency">
            <el-option label="USD" value="USD" />
            <el-option label="EUR" value="EUR" />
            <el-option label="GBP" value="GBP" />
          </el-select>
        </el-form-item>
      </el-form>
    </section>

    <section class="surface card">
      <header class="card-head">
        <h3>Featured homepage projects</h3>
        <p class="muted text-sm">Pick which projects appear in the hero rail.</p>
      </header>
      <el-checkbox-group v-model="form.featuredSlugs">
        <el-checkbox
          v-for="opt in featuredOptions"
          :key="opt.value"
          :label="opt.value"
          class="block"
        >
          {{ opt.label }}
        </el-checkbox>
      </el-checkbox-group>
    </section>

    <div class="flex justify-end gap-2">
      <el-button>Reset</el-button>
      <el-button type="primary" @click="save">Save settings</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { api } from '@/api'

const form = reactive({
  siteName: 'DevHub',
  tagline: 'Build. Ship. Share.',
  supportEmail: 'hello@devhub.dev',
  stripePublishable: '',
  currency: 'USD',
  featuredSlugs: [] as string[],
})

const featuredOptions = ref<Array<{ label: string; value: string }>>([])

function save(): void {
  ElMessage.success('Settings saved.')
}

onMounted(async () => {
  const res = await api.projects({ pageSize: 50 })
  featuredOptions.value = res.items.map((p) => ({ label: p.title, value: p.slug }))
  form.featuredSlugs = res.items.filter((p) => p.featured).map((p) => p.slug)
})
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card {
  padding: 22px;
}
.card-head {
  margin-bottom: 12px;
}
.card-head h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 2px;
}
</style>
