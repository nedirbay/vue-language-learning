<template>
  <div class="editor">
    <div class="editor-grid">
      <section class="surface card form-card">
        <header class="card-head">
          <h3>{{ isEdit ? $t('studio.editProject') : $t('studio.newProject') }}</h3>
          <p class="muted text-sm">
            All fields update the live preview on the right.
          </p>
        </header>
        <el-form label-position="top" :model="form">
          <el-form-item label="Title">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="Slug">
            <el-input v-model="form.slug" />
          </el-form-item>
          <el-form-item label="Short description">
            <el-input v-model="form.shortDescription" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="Cover image URL">
            <el-input v-model="form.coverImageUrl" placeholder="https://…" />
          </el-form-item>
          <el-form-item label="Category">
            <el-select v-model="form.categorySlug" class="w-full">
              <el-option
                v-for="c in categories"
                :key="c.id"
                :label="c.name"
                :value="c.slug"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Pricing">
            <el-radio-group v-model="form.pricingType">
              <el-radio-button label="free">Free</el-radio-button>
              <el-radio-button label="paid">Paid</el-radio-button>
              <el-radio-button label="open_source">Open source</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.pricingType === 'paid'" label="Price (cents)">
            <el-input-number
              v-model="form.priceCents"
              :min="0"
              :step="100"
              controls-position="right"
              class="w-full"
            />
          </el-form-item>
          <el-form-item label="Tech stack (comma separated)">
            <el-input v-model="form.techStackRaw" placeholder="Vue 3, TypeScript, Tailwind" />
          </el-form-item>
          <el-form-item label="GitHub URL">
            <el-input v-model="form.githubUrl" placeholder="https://github.com/…" />
          </el-form-item>
          <el-form-item label="Live demo URL">
            <el-input v-model="form.liveDemoUrl" placeholder="https://…" />
          </el-form-item>
          <el-form-item label="Markdown description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="10"
              placeholder="## Overview…"
            />
          </el-form-item>
          <div class="flex justify-end mt-2">
            <el-radio-group v-model="form.status">
              <el-radio-button label="draft">Draft</el-radio-button>
              <el-radio-button label="published">Published</el-radio-button>
              <el-radio-button label="archived">Archived</el-radio-button>
            </el-radio-group>
          </div>
        </el-form>
        <div class="card-actions">
          <el-button @click="$router.back()">{{ $t('studio.cancel') }}</el-button>
          <el-button type="primary" :loading="saving" @click="save">
            {{ isEdit ? $t('studio.saved') : $t('studio.created') }}
          </el-button>
        </div>
      </section>

      <section class="surface card preview-card">
        <header class="card-head">
          <h3>Live preview</h3>
          <p class="muted text-sm">A quick look at how the project will appear.</p>
        </header>
        <div class="preview">
          <div class="cover" :style="{ backgroundImage: `url(${form.coverImageUrl})` }" />
          <div class="body">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge">{{ pricingLabel }}</span>
              <span class="badge soft">{{ form.categorySlug || 'category' }}</span>
            </div>
            <h2>{{ form.title || 'Untitled project' }}</h2>
            <p class="muted text-sm">
              {{ form.shortDescription || 'A short description shows up here.' }}
            </p>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span v-for="s in techList" :key="s" class="chip">{{ s }}</span>
            </div>
            <div class="markdown prose-md mt-4" v-html="renderedMarkdown" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { api, type ProjectInput } from '@/api'
import { useAuthStore } from '@/stores/auth'
import type { Category, Project, ProjectPricingType, ProjectStatus } from '@/types/models'
import { renderMarkdown } from '@/utils/format'

interface ProjectForm {
  title: string
  slug: string
  shortDescription: string
  description: string
  coverImageUrl: string
  categorySlug: string
  pricingType: ProjectPricingType
  priceCents: number
  techStackRaw: string
  githubUrl: string
  liveDemoUrl: string
  status: ProjectStatus
}

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const isEdit = computed(() => Boolean(route.params.id))
const categories = ref<Category[]>([])
const saving = ref(false)

const form = reactive<ProjectForm>({
  title: '',
  slug: '',
  shortDescription: '',
  description: '## Overview\n\nDescribe your project here.',
  coverImageUrl:
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=70',
  categorySlug: 'tools',
  pricingType: 'free',
  priceCents: 0,
  techStackRaw: 'Vue 3, TypeScript, Tailwind',
  githubUrl: '',
  liveDemoUrl: '',
  status: 'draft',
})

const techList = computed(() =>
  form.techStackRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
)

const pricingLabel = computed(() => {
  switch (form.pricingType) {
    case 'paid':
      return 'Paid'
    case 'open_source':
      return 'OSS'
    default:
      return 'Free'
  }
})

const renderedMarkdown = computed(() => renderMarkdown(form.description || ''))

function fillFromProject(p: Project): void {
  form.title = p.title
  form.slug = p.slug
  form.shortDescription = p.shortDescription
  form.description = p.description
  form.coverImageUrl = p.coverImageUrl
  form.categorySlug = p.category.slug
  form.pricingType = p.pricingType
  form.priceCents = p.priceCents
  form.techStackRaw = p.techStack.join(', ')
  form.githubUrl = p.githubUrl ?? ''
  form.liveDemoUrl = p.liveDemoUrl ?? ''
  form.status = p.status
}

function toInput(): ProjectInput {
  return {
    title: form.title.trim(),
    slug: form.slug.trim() || form.title.trim().toLowerCase().replace(/\s+/g, '-'),
    shortDescription: form.shortDescription,
    description: form.description,
    coverImageUrl: form.coverImageUrl,
    categorySlug: form.categorySlug,
    pricingType: form.pricingType,
    priceCents: form.priceCents,
    techStack: techList.value,
    githubUrl: form.githubUrl || undefined,
    liveDemoUrl: form.liveDemoUrl || undefined,
    status: form.status,
  }
}

async function save(): Promise<void> {
  if (!form.title.trim()) {
    ElMessage.warning(t('studio.titleRequired'))
    return
  }
  if (!auth.user) {
    ElMessage.warning(t('auth.pleaseSignInToPurchase'))
    return
  }
  saving.value = true
  try {
    if (isEdit.value) {
      await api.updateProject(String(route.params.id), toInput(), auth.user)
      ElMessage.success(t('studio.saved'))
    } else {
      await api.createProject(toInput(), auth.user)
      ElMessage.success(t('studio.created'))
    }
    router.push('/studio/projects')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : t('studio.noPermission')
    ElMessage.error(msg)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  categories.value = await api.categories()
  if (isEdit.value) {
    const id = String(route.params.id)
    const target = await api.projectById(id)
    if (!target) {
      ElMessage.error(t('studio.notFound'))
      router.push('/studio/projects')
      return
    }
    if (auth.user && auth.user.role !== 'admin' && target.author.id !== auth.user.id) {
      ElMessage.error(t('studio.noPermission'))
      router.push('/studio/projects')
      return
    }
    fillFromProject(target)
  }
})
</script>

<style scoped>
.editor-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
}
@media (max-width: 1100px) {
  .editor-grid {
    grid-template-columns: 1fr;
  }
}
.card {
  padding: 22px;
}
.form-card {
  min-height: 800px;
}
.card-head {
  margin-bottom: 12px;
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
  gap: 10px;
}
.preview {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--app-border);
}
.cover {
  height: 180px;
  background-size: cover;
  background-position: center;
}
.body {
  padding: 18px;
}
.body h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 4px;
}
.badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.16);
  color: var(--app-accent);
}
.badge.soft {
  background: var(--app-surface-2);
  color: var(--app-text-muted);
}
.chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--app-surface-2);
  border: 1px solid var(--app-border);
  color: var(--app-text-muted);
}
</style>
