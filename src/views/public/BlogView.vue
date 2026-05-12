<template>
  <div class="blog-page">
    <header class="page-header">
      <div class="page-header-inner">
        <span class="eyebrow">{{ $t('blog.eyebrow') }}</span>
        <h1>{{ $t('blog.title') }}</h1>
        <p class="muted">{{ $t('blog.sub') }}</p>
      </div>
    </header>

    <section class="posts">
      <div class="posts-inner">
        <div v-if="loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <el-skeleton v-for="i in 3" :key="i" animated />
        </div>
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="post in posts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="post surface"
          >
            <div class="cover" :style="{ backgroundImage: `url(${post.coverImageUrl})` }" />
            <div class="post-body">
              <div class="tags">
                <span v-for="t in post.tags" :key="t" class="tag">{{ t }}</span>
              </div>
              <h2 class="title">{{ post.title }}</h2>
              <p class="muted text-sm line-clamp-2">{{ post.excerpt }}</p>
              <div class="post-meta">
                <el-avatar :size="24" :src="post.author.avatarUrl" />
                <span class="text-xs">{{ post.author.fullName }}</span>
                <span class="text-xs muted">· {{ formatDate(post.publishedAt) }}</span>
                <span class="text-xs muted">· {{ $t('blog.readTime', { minutes: post.readingMinutes }) }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/api'
import type { BlogPost } from '@/types/models'
import { formatDate } from '@/utils/format'

const posts = ref<BlogPost[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    posts.value = await api.blogPosts()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header {
  padding: 64px 24px 24px;
}
.page-header-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.eyebrow {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--app-text-muted);
  font-weight: 600;
  margin-bottom: 8px;
}
h1 {
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}

.posts {
  padding: 24px 24px 80px;
}
.posts-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.post {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 200ms ease, border-color 200ms ease;
}
.post:hover {
  transform: translateY(-3px);
  border-color: rgba(99, 102, 241, 0.4);
}
.cover {
  height: 180px;
  background-size: cover;
  background-position: center;
}
.post-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--app-accent);
}
.title {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}
</style>
