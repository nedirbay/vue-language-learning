<template>
  <div class="admin-overview">
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(card, idx) in cards" :key="idx" class="metric surface">
        <div class="metric-icon" :class="card.iconClass">
          <component :is="card.icon" />
        </div>
        <div class="flex-1">
          <div class="muted text-xs">{{ card.label }}</div>
          <div class="metric-value">{{ card.value }}</div>
          <div class="text-xs" :class="card.trend >= 0 ? 'text-emerald-500' : 'text-red-500'">
            <span v-if="card.trend >= 0">▲</span><span v-else>▼</span>
            {{ Math.abs(card.trend) }}% vs last week
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <section class="surface card">
        <header class="card-head">
          <div>
            <h3>Revenue (last 30 days)</h3>
            <p class="muted text-sm">Net Stripe revenue, in {{ defaultCurrency }}.</p>
          </div>
        </header>
        <div ref="revenueEl" class="chart" />
      </section>

      <section class="surface card">
        <header class="card-head">
          <div>
            <h3>Downloads</h3>
            <p class="muted text-sm">Free + paid downloads combined.</p>
          </div>
        </header>
        <div ref="downloadsEl" class="chart" />
      </section>
    </div>

    <section class="surface card">
      <header class="card-head">
        <div>
          <h3>User growth</h3>
          <p class="muted text-sm">New developers signing up per day.</p>
        </div>
      </header>
      <div ref="userGrowthEl" class="chart growth" />
    </section>

    <section class="surface card">
      <header class="card-head">
        <h3>Top projects</h3>
      </header>
      <el-table :data="analytics?.topProjects ?? []">
        <el-table-column prop="title" label="Project" />
        <el-table-column label="Views" width="140">
          <template #default="{ row }">{{ formatNumber(row.viewCount) }}</template>
        </el-table-column>
        <el-table-column label="Downloads" width="140">
          <template #default="{ row }">{{ formatNumber(row.downloadCount) }}</template>
        </el-table-column>
        <el-table-column label="Rating" width="120">
          <template #default="{ row }">⭐ {{ row.rating.toFixed(1) }}</template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import {
  Box,
  Money,
  TrendCharts,
  User as UserIcon,
} from '@element-plus/icons-vue'
import { api } from '@/api'
import type { AdminAnalytics } from '@/types/models'
import { formatNumber, formatPrice } from '@/utils/format'

const analytics = ref<AdminAnalytics | null>(null)

const defaultCurrency = 'USD'

const revenueEl = ref<HTMLDivElement | null>(null)
const downloadsEl = ref<HTMLDivElement | null>(null)
const userGrowthEl = ref<HTMLDivElement | null>(null)

const charts: echarts.ECharts[] = []

const cards = computed(() => {
  if (!analytics.value) {
    return [
      { label: 'Projects', value: '—', icon: Box, iconClass: 'tone-brand', trend: 0 },
      { label: 'Users', value: '—', icon: UserIcon, iconClass: 'tone-accent', trend: 0 },
      { label: 'Downloads', value: '—', icon: TrendCharts, iconClass: 'tone-warn', trend: 0 },
      { label: 'Revenue', value: '—', icon: Money, iconClass: 'tone-success', trend: 0 },
    ]
  }
  const s = analytics.value.summary
  return [
    { label: 'Projects', value: formatNumber(s.totalProjects), icon: Box, iconClass: 'tone-brand', trend: 4 },
    { label: 'Users', value: formatNumber(s.totalUsers), icon: UserIcon, iconClass: 'tone-accent', trend: 9 },
    { label: 'Downloads', value: formatNumber(s.totalDownloads), icon: TrendCharts, iconClass: 'tone-warn', trend: 12 },
    { label: 'Revenue', value: formatPrice(s.totalRevenueCents), icon: Money, iconClass: 'tone-success', trend: 18 },
  ]
})

function createLineChart(
  el: HTMLDivElement | null,
  data: Array<{ date: string; value: number }>,
  color: [string, string],
  formatter?: (v: number) => string,
): echarts.ECharts | null {
  if (!el) return null
  const chart = echarts.init(el)
  chart.setOption({
    grid: { left: 36, right: 16, top: 24, bottom: 30 },
    tooltip: {
      trigger: 'axis',
      valueFormatter: formatter,
      axisPointer: { type: 'line' },
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.date.slice(5)),
      axisLine: { lineStyle: { color: '#888' } },
      axisLabel: { color: '#888', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#888', fontSize: 10, formatter },
      splitLine: { lineStyle: { color: '#eee', type: 'dashed' } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: color[0] },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color[0] + '66' },
            { offset: 1, color: color[1] + '00' },
          ]),
        },
        data: data.map((d) => d.value),
      },
    ],
  })
  return chart
}

function renderCharts(): void {
  if (!analytics.value) return
  const r = createLineChart(
    revenueEl.value,
    analytics.value.revenueTrend,
    ['#6366f1', '#6366f1'],
    (v: number) => `$${v}`,
  )
  if (r) charts.push(r)
  const d = createLineChart(
    downloadsEl.value,
    analytics.value.downloadsTrend,
    ['#d946ef', '#d946ef'],
  )
  if (d) charts.push(d)
  const u = createLineChart(userGrowthEl.value, analytics.value.userGrowth, ['#10b981', '#10b981'])
  if (u) charts.push(u)
}

function handleResize(): void {
  charts.forEach((c) => c.resize())
}

onMounted(async () => {
  analytics.value = await api.analytics()
  // Wait for the DOM next tick to render charts
  await new Promise((r) => requestAnimationFrame(() => r(null)))
  renderCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  charts.forEach((c) => c.dispose())
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.admin-overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
}
.metric-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.tone-brand {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}
.tone-accent {
  background: linear-gradient(135deg, #d946ef, #ec4899);
}
.tone-warn {
  background: linear-gradient(135deg, #f59e0b, #f97316);
}
.tone-success {
  background: linear-gradient(135deg, #10b981, #14b8a6);
}
.metric-value {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
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
  margin: 0;
}
.chart {
  height: 220px;
}
.chart.growth {
  height: 260px;
}
</style>
