<template>
  <div class="blog-post-page">
    <div v-if="loading" class="loading"><el-skeleton :rows="6" animated /></div>
    <div v-else-if="!post" class="not-found">
      <h2>{{ $t('common.noResults') }}</h2>
      <RouterLink to="/blog"><el-button>{{ $t('blog.back') }}</el-button></RouterLink>
    </div>
    <article v-else>
      <section class="hero">
        <div class="hero-inner">
          <RouterLink to="/blog" class="back-link">
            <el-icon><ArrowLeft /></el-icon>
            {{ $t('blog.back') }}
          </RouterLink>
          <div class="tags">
            <span v-for="t in post.tags" :key="t" class="tag">{{ t }}</span>
          </div>
          <h1>{{ post.title }}</h1>
          <p class="excerpt muted">{{ post.excerpt }}</p>
          <div class="meta">
            <el-avatar :size="32" :src="post.author.avatarUrl" />
            <span class="font-medium">{{ post.author.fullName }}</span>
            <span class="muted">· {{ formatDate(post.publishedAt) }}</span>
            <span class="muted">· {{ $t('blog.readTime', { minutes: post.readingMinutes }) }}</span>
          </div>
        </div>
      </section>

      <section class="content">
        <div class="content-inner">
          <img
            v-if="post.coverImageUrl"
            :src="post.coverImageUrl"
            :alt="post.title"
            class="cover"
          />
          <div class="prose-md" v-html="markdown" />
        </div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { api } from '@/api'
import type { BlogPost } from '@/types/models'
import { formatDate, renderMarkdown } from '@/utils/format'

const route = useRoute()
const post = ref<BlogPost | null>(null)
const loading = ref(true)

const markdown = computed(() => (post.value ? renderMarkdown(post.value.body) : ''))

async function load(slug: string): Promise<void> {
  loading.value = true
  try {
    post.value = await api.blogPost(slug)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const slug = route.params.slug
  if (typeof slug === 'string') load(slug)
})

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug === 'string') load(slug)
  },
)
</script>

<style scoped>
.hero {
  padding: 56px 24px 32px;
}
.hero-inner {
  max-width: 800px;
  margin: 0 auto;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--app-text-muted);
  font-size: 0.9rem;
  margin-bottom: 18px;
}
.tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--app-accent);
}
h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
  line-height: 1.1;
}
.excerpt {
  font-size: 1.1rem;
  margin: 0 0 20px;
  line-height: 1.6;
}
.meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content {
  padding: 16px 24px 80px;
}
.content-inner {
  max-width: 800px;
  margin: 0 auto;
}
.cover {
  width: 100%;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid var(--app-border);
}

.loading,
.not-found {
  max-width: 800px;
  margin: 60px auto;
  padding: 32px 24px;
  text-align: center;
}
</style>
