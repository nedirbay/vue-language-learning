<template>
  <div class="about-page">
    <section class="hero">
      <div class="hero-inner">
        <span class="eyebrow">About DevHub</span>
        <h1>A developer-first marketplace.</h1>
        <p class="lead muted">
          DevHub is where I share the projects I build, the tools I rely on, and the
          open-source resources that taught me. It's a personal showcase — and a
          marketplace for the templates and starters I sell to fund more open-source work.
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
          <h3>Want to work together?</h3>
          <p class="muted">I'm open to consulting and partnerships. Drop me a line.</p>
        </div>
        <a href="mailto:hello@devhub.dev">
          <el-button type="primary" round size="large">Email me</el-button>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Aim, Lock, MagicStick, Sunny } from '@element-plus/icons-vue'

const values = [
  {
    icon: Aim,
    title: 'Built with intent',
    body: 'No filler. Every template I publish is one I actually use in production.',
  },
  {
    icon: Lock,
    title: 'Open by default',
    body: 'Free tier for hobbyists, fair pricing for pros, source available wherever I can.',
  },
  {
    icon: MagicStick,
    title: 'Designed end-to-end',
    body: 'From data model to button radius — opinionated, cohesive, and consistent.',
  },
  {
    icon: Sunny,
    title: 'Maintained, not abandoned',
    body: 'Lifetime updates on paid templates. Regular releases on the rest.',
  },
]
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
