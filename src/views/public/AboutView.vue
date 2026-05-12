<template>
  <div class="about-page">
    <section class="hero">
      <div class="hero-inner">
        <span class="eyebrow">{{ $t('nav.about') }} DevHub</span>
        <h1>{{ $t('about.title') }}</h1>
        <p class="lead muted">
          {{ $t('about.lead') }}
        </p>
      </div>
    </section>

    <section class="values">
      <div class="values-inner">
        <div v-for="v in values" :key="v.title" class="value surface">
          <div class="value-icon">
            <component :is="v.icon" />
          </div>
          <h3>{{ v.title }}</h3>
          <p class="muted text-sm">{{ v.body }}</p>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-inner surface">
        <div>
          <h3>{{ $t('about.ctaTitle') }}</h3>
          <p class="muted">{{ $t('about.ctaSub') }}</p>
        </div>
        <a href="mailto:nedirbay0098@gmail.com">
          <el-button type="primary" round size="large">{{ $t('about.emailMe') }}</el-button>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Aim, Lock, MagicStick, Sunny } from '@element-plus/icons-vue'

const { t } = useI18n()

const values = computed(() => [
  {
    icon: Aim,
    title: t('about.values.intent.title'),
    body: t('about.values.intent.body'),
  },
  {
    icon: Lock,
    title: t('about.values.open.title'),
    body: t('about.values.open.body'),
  },
  {
    icon: MagicStick,
    title: t('about.values.designed.title'),
    body: t('about.values.designed.body'),
  },
  {
    icon: Sunny,
    title: t('about.values.maintained.title'),
    body: t('about.values.maintained.body'),
  },
])
</script>

<style scoped>
.hero {
  padding: 80px 24px 32px;
  text-align: center;
}
.hero-inner {
  max-width: 760px;
  margin: 0 auto;
}
.eyebrow {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--app-text-muted);
  font-weight: 600;
  margin-bottom: 14px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
}
h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  line-height: 1.1;
}
.lead {
  font-size: 1.1rem;
  line-height: 1.65;
  max-width: 580px;
  margin: 0 auto;
}

.values {
  padding: 32px 24px;
}
.values-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.value {
  padding: 20px;
}
.value-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #d946ef);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 10px;
}
.value h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 6px;
}

.cta-section {
  padding: 32px 24px 80px;
}
.cta-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 28px 32px;
  flex-wrap: wrap;
}
.cta-inner h3 {
  margin: 0 0 4px;
  font-size: 1.1rem;
  font-weight: 700;
}
</style>
