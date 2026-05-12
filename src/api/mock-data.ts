import type {
  AdminAnalytics,
  AuthResponse,
  BlogPost,
  Category,
  OpenSourceResource,
  Order,
  PaginatedResponse,
  Project,
  ProjectQuery,
  Review,
  Tag,
  Testimonial,
  User,
} from '@/types/models'

const NOW = new Date()
const daysAgo = (n: number): string => {
  const d = new Date(NOW)
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

const adminUser: User = {
  id: 'usr_admin',
  email: 'admin@devhub.dev',
  username: 'admin',
  fullName: 'DevHub Admin',
  avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=admin',
  role: 'admin',
  emailVerified: true,
  status: 'active',
  createdAt: daysAgo(420),
}

const regularUser: User = {
  id: 'usr_alex',
  email: 'alex@devhub.dev',
  username: 'alex',
  fullName: 'Alex Carter',
  avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=alex',
  role: 'user',
  emailVerified: true,
  status: 'active',
  createdAt: daysAgo(60),
}

const otherUsers: User[] = [
  {
    id: 'usr_maya',
    email: 'maya@devhub.dev',
    username: 'maya',
    fullName: 'Maya Tanaka',
    avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=maya',
    role: 'user',
    emailVerified: true,
    status: 'active',
    createdAt: daysAgo(220),
  },
  {
    id: 'usr_noah',
    email: 'noah@devhub.dev',
    username: 'noah',
    fullName: 'Noah Becker',
    avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=noah',
    role: 'user',
    emailVerified: true,
    status: 'active',
    createdAt: daysAgo(180),
  },
  {
    id: 'usr_sara',
    email: 'sara@devhub.dev',
    username: 'sara',
    fullName: 'Sara Ahmed',
    avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=sara',
    role: 'user',
    emailVerified: false,
    status: 'active',
    createdAt: daysAgo(14),
  },
  {
    id: 'usr_jin',
    email: 'jin@devhub.dev',
    username: 'jin',
    fullName: 'Jin Park',
    avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=jin',
    role: 'user',
    emailVerified: true,
    status: 'suspended',
    createdAt: daysAgo(95),
  },
]

export const mockUsers: User[] = [adminUser, regularUser, ...otherUsers]

const author = {
  id: adminUser.id,
  username: adminUser.username,
  fullName: adminUser.fullName,
  avatarUrl: adminUser.avatarUrl,
}

export const mockCategories: Category[] = [
  { id: 'cat_starter', name: 'Starter Kits', slug: 'starter-kits', icon: 'Box', projectCount: 18 },
  { id: 'cat_dashboard', name: 'Dashboards', slug: 'dashboards', icon: 'DataLine', projectCount: 12 },
  { id: 'cat_saas', name: 'SaaS Templates', slug: 'saas', icon: 'Connection', projectCount: 14 },
  { id: 'cat_tools', name: 'Developer Tools', slug: 'tools', icon: 'Tools', projectCount: 22 },
  { id: 'cat_ai', name: 'AI / ML', slug: 'ai-ml', icon: 'MagicStick', projectCount: 9 },
  { id: 'cat_landing', name: 'Landing Pages', slug: 'landing-pages', icon: 'Document', projectCount: 16 },
]

export const mockTags: Tag[] = [
  { id: 'tag_vue', name: 'Vue', slug: 'vue' },
  { id: 'tag_react', name: 'React', slug: 'react' },
  { id: 'tag_nest', name: 'NestJS', slug: 'nestjs' },
  { id: 'tag_node', name: 'Node.js', slug: 'nodejs' },
  { id: 'tag_postgres', name: 'PostgreSQL', slug: 'postgres' },
  { id: 'tag_stripe', name: 'Stripe', slug: 'stripe' },
  { id: 'tag_tailwind', name: 'Tailwind', slug: 'tailwind' },
  { id: 'tag_ts', name: 'TypeScript', slug: 'typescript' },
  { id: 'tag_docker', name: 'Docker', slug: 'docker' },
  { id: 'tag_ai', name: 'AI', slug: 'ai' },
]

const t = (slug: string): Tag => mockTags.find((x) => x.slug === slug) ?? mockTags[0]

const baseImg = (seed: string): string =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=70`

const projectFixtures: Array<Partial<Project> & Pick<Project, 'id' | 'slug' | 'title'>> = [
  {
    id: 'prj_atlas',
    slug: 'atlas-admin',
    title: 'Atlas Admin Dashboard',
    shortDescription: 'Production-ready Vue 3 admin dashboard with 60+ components and 10 themes.',
    description: `## Overview
**Atlas Admin** is a comprehensive admin dashboard template engineered for SaaS and internal tools.
It ships with role-based routing, granular permissions, and a thoughtful component library.

## Highlights
- 60+ accessible UI components built on Element Plus and Tailwind CSS
- 10 hand-tuned themes (light, dark, and 8 brand variants)
- Auth-ready: JWT, session refresh, and role guards
- Data-rich pages: orders, customers, analytics, settings
- Markdown-driven docs and changelog

## Installation
\`\`\`bash
npm create devhub atlas-admin
cd atlas-admin
npm install
npm run dev
\`\`\`

You'll need Node 20+ and pnpm. Configure your API base URL in \`.env.local\`.

## Support
Lifetime updates and email support are included with every purchase.`,
    pricingType: 'paid',
    priceCents: 4900,
    featured: true,
    trending: true,
    rating: 4.9,
    reviewCount: 128,
    likeCount: 612,
    downloadCount: 2340,
    viewCount: 18420,
    techStack: ['Vue 3', 'TypeScript', 'Element Plus', 'Tailwind', 'Pinia'],
    coverImageUrl: baseImg('1551288049-bebda4e38f71'),
    category: mockCategories[1],
    tags: [t('vue'), t('ts'), t('tailwind')],
  },
  {
    id: 'prj_nimbus',
    slug: 'nimbus-saas-starter',
    title: 'Nimbus SaaS Starter',
    shortDescription: 'Full-stack SaaS boilerplate with auth, billing, and team management.',
    description: `Nimbus is a batteries-included SaaS starter.

**Features**
- Email + magic link auth, with optional OAuth (Google, GitHub)
- Subscription billing via Stripe with plan upgrades and proration
- Multi-tenant workspaces and team invitations
- Postgres + Prisma + NestJS backend
- Vue 3 + TypeScript + Tailwind frontend
- Production-ready Docker setup and GitHub Actions CI

Stop building plumbing — build your product.`,
    pricingType: 'paid',
    priceCents: 9900,
    featured: true,
    trending: true,
    rating: 4.8,
    reviewCount: 86,
    likeCount: 480,
    downloadCount: 1180,
    viewCount: 12400,
    techStack: ['NestJS', 'Vue 3', 'Prisma', 'PostgreSQL', 'Stripe'],
    coverImageUrl: baseImg('1518770660439-4636190af475'),
    category: mockCategories[2],
    tags: [t('nestjs'), t('postgres'), t('stripe'), t('vue')],
  },
  {
    id: 'prj_pulse',
    slug: 'pulse-analytics',
    title: 'Pulse Analytics Suite',
    shortDescription: 'Beautiful, fast, privacy-friendly analytics for your product.',
    description: `Pulse gives you product analytics without surrendering user data.

- Self-hosted, GDPR-friendly
- Real-time event ingestion
- Funnel, retention, and cohort views
- Built on TimescaleDB

Drop-in JS snippet, and a Vue widget for dashboards.`,
    pricingType: 'paid',
    priceCents: 14900,
    featured: false,
    trending: true,
    rating: 4.7,
    reviewCount: 54,
    likeCount: 322,
    downloadCount: 740,
    viewCount: 9400,
    techStack: ['Node.js', 'Vue 3', 'TimescaleDB', 'ClickHouse'],
    coverImageUrl: baseImg('1559028012-481c04fa702d'),
    category: mockCategories[3],
    tags: [t('node'), t('postgres'), t('ts')],
  },
  {
    id: 'prj_lumen',
    slug: 'lumen-landing-kit',
    title: 'Lumen Landing Kit',
    shortDescription: '40+ conversion-optimized landing page sections, ready to drop in.',
    description: `Forty landing-page sections — hero, features, pricing, FAQ — that you can compose
into a launch page in an afternoon. All sections are responsive, accessible, and animated.`,
    pricingType: 'paid',
    priceCents: 3900,
    featured: true,
    trending: false,
    rating: 4.9,
    reviewCount: 211,
    likeCount: 901,
    downloadCount: 3120,
    viewCount: 21420,
    techStack: ['Vue 3', 'Tailwind', 'GSAP'],
    coverImageUrl: baseImg('1517694712202-14dd9538aa97'),
    category: mockCategories[5],
    tags: [t('vue'), t('tailwind')],
  },
  {
    id: 'prj_orbit',
    slug: 'orbit-component-library',
    title: 'Orbit Component Library',
    shortDescription: 'An open, themeable Vue 3 component library with 80+ components.',
    description: `**Orbit** is the open-source component library we wish existed.

- 80+ accessible components
- TypeScript-first, fully typed
- Theming via CSS variables
- Tree-shakeable
- Comprehensive docs and Storybook

MIT licensed.`,
    pricingType: 'open_source',
    priceCents: 0,
    featured: false,
    trending: true,
    rating: 4.8,
    reviewCount: 142,
    likeCount: 1820,
    downloadCount: 18420,
    viewCount: 42100,
    techStack: ['Vue 3', 'TypeScript', 'Vite', 'Storybook'],
    coverImageUrl: baseImg('1551033406-611cf9a28f67'),
    category: mockCategories[3],
    tags: [t('vue'), t('ts')],
    githubUrl: 'https://github.com/devhub/orbit',
  },
  {
    id: 'prj_quill',
    slug: 'quill-markdown-editor',
    title: 'Quill Markdown Editor',
    shortDescription: 'A delightful markdown editor component for Vue with live preview.',
    description: `Drop-in markdown editor with syntax highlighting, slash commands, and a built-in
preview pane. Used by 4000+ projects.`,
    pricingType: 'free',
    priceCents: 0,
    featured: false,
    trending: false,
    rating: 4.6,
    reviewCount: 87,
    likeCount: 612,
    downloadCount: 9220,
    viewCount: 20400,
    techStack: ['Vue 3', 'TypeScript', 'CodeMirror'],
    coverImageUrl: baseImg('1483058712412-4245e9b90334'),
    category: mockCategories[3],
    tags: [t('vue'), t('ts')],
    githubUrl: 'https://github.com/devhub/quill',
    downloadUrl: 'https://example.com/downloads/quill.zip',
  },
  {
    id: 'prj_helix',
    slug: 'helix-design-tokens',
    title: 'Helix Design Tokens',
    shortDescription: 'A complete design token system for cross-platform products.',
    description: `Tokens, themes, and a CLI that compiles to CSS variables, Tailwind config,
SwiftUI, and Compose. Free for personal and commercial use.`,
    pricingType: 'free',
    priceCents: 0,
    featured: false,
    trending: false,
    rating: 4.7,
    reviewCount: 32,
    likeCount: 188,
    downloadCount: 4220,
    viewCount: 9100,
    techStack: ['TypeScript', 'CLI'],
    coverImageUrl: baseImg('1556761175-5973dc0f32e7'),
    category: mockCategories[0],
    tags: [t('ts'), t('tailwind')],
  },
  {
    id: 'prj_synapse',
    slug: 'synapse-ai-toolkit',
    title: 'Synapse AI Toolkit',
    shortDescription: 'Prebuilt UI flows for LLM apps: chat, RAG, agents, evaluations.',
    description: `Synapse gives you battle-tested UI patterns for shipping AI features.

- Streaming chat with markdown + tool calls
- RAG document picker
- Agent run inspector
- Evaluation dashboards`,
    pricingType: 'paid',
    priceCents: 12900,
    featured: true,
    trending: true,
    rating: 4.9,
    reviewCount: 41,
    likeCount: 410,
    downloadCount: 620,
    viewCount: 8420,
    techStack: ['Vue 3', 'TypeScript', 'Tailwind', 'OpenAI'],
    coverImageUrl: baseImg('1677442136019-21780ecad995'),
    category: mockCategories[4],
    tags: [t('vue'), t('ai'), t('ts')],
  },
  {
    id: 'prj_forge',
    slug: 'forge-cli',
    title: 'Forge CLI',
    shortDescription: 'Scaffold full-stack projects in seconds with a powerful interactive CLI.',
    description: `Forge generates scaffolds for Vue, Nest, and Postgres apps with auth and CI
preconfigured.`,
    pricingType: 'open_source',
    priceCents: 0,
    featured: false,
    trending: false,
    rating: 4.5,
    reviewCount: 22,
    likeCount: 220,
    downloadCount: 7820,
    viewCount: 12400,
    techStack: ['Node.js', 'TypeScript'],
    coverImageUrl: baseImg('1542831371-d531d36971e6'),
    category: mockCategories[3],
    tags: [t('node'), t('ts')],
    githubUrl: 'https://github.com/devhub/forge',
  },
  {
    id: 'prj_zenith',
    slug: 'zenith-blog-starter',
    title: 'Zenith Blog Starter',
    shortDescription: 'A fast, SEO-friendly blog starter with MDX support.',
    description: `Static-site generation, MDX, search, RSS, and OG image generation out of the box.`,
    pricingType: 'free',
    priceCents: 0,
    featured: false,
    trending: false,
    rating: 4.6,
    reviewCount: 18,
    likeCount: 144,
    downloadCount: 3100,
    viewCount: 7400,
    techStack: ['Vue 3', 'Vite', 'TypeScript'],
    coverImageUrl: baseImg('1499951360447-b19be8fe80f5'),
    category: mockCategories[5],
    tags: [t('vue'), t('ts'), t('tailwind')],
  },
  {
    id: 'prj_meridian',
    slug: 'meridian-design-system',
    title: 'Meridian Design System',
    shortDescription: 'A full design system: tokens, components, patterns, and Figma kit.',
    description: `Includes 120+ components, a complete Figma library, and motion guidelines.`,
    pricingType: 'paid',
    priceCents: 19900,
    featured: false,
    trending: false,
    rating: 4.8,
    reviewCount: 65,
    likeCount: 380,
    downloadCount: 410,
    viewCount: 6200,
    techStack: ['Vue 3', 'Figma', 'Tailwind'],
    coverImageUrl: baseImg('1558655146-9f40138edfeb'),
    category: mockCategories[0],
    tags: [t('vue'), t('tailwind')],
  },
  {
    id: 'prj_relay',
    slug: 'relay-webhooks',
    title: 'Relay Webhooks',
    shortDescription: 'Bulletproof webhook delivery, retries, signing, and dashboard.',
    description: `Drop Relay in front of your webhooks for at-least-once delivery, retries with
backoff, and a delivery dashboard your support team will love.`,
    pricingType: 'paid',
    priceCents: 7900,
    featured: false,
    trending: false,
    rating: 4.7,
    reviewCount: 28,
    likeCount: 140,
    downloadCount: 220,
    viewCount: 4200,
    techStack: ['NestJS', 'PostgreSQL', 'Redis'],
    coverImageUrl: baseImg('1518770660439-4636190af475'),
    category: mockCategories[3],
    tags: [t('nestjs'), t('postgres'), t('docker')],
  },
]

export const mockProjects: Project[] = projectFixtures.map((p, idx) => {
  const fallbackCategory = mockCategories[0]
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription ?? '',
    description: p.description ?? '',
    coverImageUrl: p.coverImageUrl ?? '',
    screenshots: [
      { id: `${p.id}_s1`, url: p.coverImageUrl ?? '' },
      { id: `${p.id}_s2`, url: baseImg('1517694712202-14dd9538aa97') },
      { id: `${p.id}_s3`, url: baseImg('1551033406-611cf9a28f67') },
    ],
    category: p.category ?? fallbackCategory,
    tags: p.tags ?? [],
    techStack: p.techStack ?? [],
    pricingType: p.pricingType ?? 'free',
    priceCents: p.priceCents ?? 0,
    currency: 'USD',
    status: 'published',
    featured: p.featured ?? false,
    trending: p.trending ?? false,
    rating: p.rating ?? 4.5,
    reviewCount: p.reviewCount ?? 0,
    likeCount: p.likeCount ?? 0,
    viewCount: p.viewCount ?? 0,
    downloadCount: p.downloadCount ?? 0,
    githubUrl: p.githubUrl,
    liveDemoUrl: p.liveDemoUrl ?? 'https://example.com/demo',
    documentationUrl: p.documentationUrl ?? 'https://example.com/docs',
    downloadUrl: p.downloadUrl,
    installation: p.installation,
    features: p.features ?? [
      'Comprehensive documentation',
      'Production-ready architecture',
      'Type-safe end-to-end',
      'Responsive on every device',
    ],
    changelog: p.changelog ?? [
      { version: '1.4.0', date: daysAgo(7), notes: 'New onboarding flow, bug fixes.' },
      { version: '1.3.0', date: daysAgo(30), notes: 'Performance improvements, new theme.' },
      { version: '1.2.0', date: daysAgo(60), notes: 'Initial public release.' },
    ],
    author,
    createdAt: daysAgo(90 + idx * 5),
    updatedAt: daysAgo(idx * 2),
  }
})

const reviewBodies = [
  'Top notch quality. Cut my project time in half.',
  'Beautiful design and excellent documentation. Worth every penny.',
  'Solid foundation. A few rough edges but support was quick to help.',
  'I loved the architecture choices. Easy to extend.',
  'Best starter I have used this year.',
]

export const mockReviews: Review[] = mockProjects.flatMap((p) =>
  otherUsers.slice(0, 3).map((u, idx) => ({
    id: `rev_${p.id}_${u.id}`,
    projectId: p.id,
    user: { id: u.id, username: u.username, fullName: u.fullName, avatarUrl: u.avatarUrl },
    rating: 5 - (idx % 2),
    body: reviewBodies[(p.title.length + idx) % reviewBodies.length],
    createdAt: daysAgo(idx * 6 + 4),
  })),
)

export const mockOpenSourceResources: OpenSourceResource[] = [
  {
    id: 'oss_vue',
    name: 'vue',
    fullName: 'vuejs/core',
    description: 'The Progressive JavaScript Framework.',
    url: 'https://github.com/vuejs/core',
    category: 'Framework',
    language: 'TypeScript',
    stars: 48200,
    forks: 8400,
    topics: ['vue', 'frontend', 'framework'],
  },
  {
    id: 'oss_nest',
    name: 'nest',
    fullName: 'nestjs/nest',
    description: 'A progressive Node.js framework for building efficient server-side apps.',
    url: 'https://github.com/nestjs/nest',
    category: 'Backend',
    language: 'TypeScript',
    stars: 67200,
    forks: 7600,
    topics: ['nestjs', 'backend', 'node'],
  },
  {
    id: 'oss_tailwind',
    name: 'tailwindcss',
    fullName: 'tailwindlabs/tailwindcss',
    description: 'A utility-first CSS framework for rapidly building custom designs.',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    category: 'CSS',
    language: 'JavaScript',
    stars: 82000,
    forks: 4200,
    topics: ['css', 'tailwind', 'design'],
  },
  {
    id: 'oss_prisma',
    name: 'prisma',
    fullName: 'prisma/prisma',
    description: 'Next-generation ORM for Node.js & TypeScript.',
    url: 'https://github.com/prisma/prisma',
    category: 'Database',
    language: 'TypeScript',
    stars: 39800,
    forks: 1500,
    topics: ['orm', 'database', 'postgres'],
  },
  {
    id: 'oss_vite',
    name: 'vite',
    fullName: 'vitejs/vite',
    description: 'Next generation frontend tooling.',
    url: 'https://github.com/vitejs/vite',
    category: 'Build Tools',
    language: 'TypeScript',
    stars: 67100,
    forks: 6100,
    topics: ['bundler', 'frontend', 'tooling'],
  },
  {
    id: 'oss_pinia',
    name: 'pinia',
    fullName: 'vuejs/pinia',
    description: 'Intuitive, type safe and flexible store for Vue.',
    url: 'https://github.com/vuejs/pinia',
    category: 'State',
    language: 'TypeScript',
    stars: 13200,
    forks: 1100,
    topics: ['state-management', 'vue'],
  },
  {
    id: 'oss_element',
    name: 'element-plus',
    fullName: 'element-plus/element-plus',
    description: 'A Vue 3 based component library for designers and developers.',
    url: 'https://github.com/element-plus/element-plus',
    category: 'UI Library',
    language: 'TypeScript',
    stars: 24800,
    forks: 4900,
    topics: ['vue', 'ui', 'components'],
  },
  {
    id: 'oss_router',
    name: 'vue-router',
    fullName: 'vuejs/router',
    description: 'The official router for Vue.js.',
    url: 'https://github.com/vuejs/router',
    category: 'Routing',
    language: 'TypeScript',
    stars: 4100,
    forks: 1900,
    topics: ['routing', 'vue'],
  },
]

export const mockOrders: Order[] = mockProjects.slice(0, 6).map((p, idx) => ({
  id: `ord_${p.id}_${idx}`,
  user: {
    id: regularUser.id,
    username: regularUser.username,
    fullName: regularUser.fullName,
    avatarUrl: regularUser.avatarUrl,
    email: regularUser.email,
  },
  project: {
    id: p.id,
    slug: p.slug,
    title: p.title,
    coverImageUrl: p.coverImageUrl,
    priceCents: p.priceCents,
    currency: p.currency,
  },
  amountCents: p.priceCents,
  currency: p.currency,
  status: idx % 5 === 0 ? 'refunded' : idx % 4 === 0 ? 'pending' : 'paid',
  stripeSessionId: `cs_test_mock_${idx}`,
  createdAt: daysAgo(idx * 7 + 1),
}))

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'blog_1',
    slug: 'why-i-built-devhub',
    title: 'Why I built DevHub',
    excerpt: 'A modern marketplace for developers, by a developer.',
    body: `## The story
Most product marketplaces feel built for buyers, not for the developers who actually maintain them.
DevHub flips the model: a clean creator experience, transparent payouts, and zero lock-in.`,
    coverImageUrl: baseImg('1497091071254-cc9b2ba7c48a'),
    author,
    tags: ['Product', 'Indie'],
    publishedAt: daysAgo(3),
    readingMinutes: 5,
  },
  {
    id: 'blog_2',
    slug: 'shipping-a-design-system',
    title: 'Lessons from shipping a 120-component design system',
    excerpt: 'Three myths about design systems — and what worked instead.',
    body: `Design systems are not products, they are *operations*.
Treat them like infrastructure: versioned, observable, on-call.`,
    coverImageUrl: baseImg('1517694712202-14dd9538aa97'),
    author,
    tags: ['Design', 'Engineering'],
    publishedAt: daysAgo(12),
    readingMinutes: 7,
  },
  {
    id: 'blog_3',
    slug: 'stripe-checkout-best-practices',
    title: 'Stripe Checkout: the boring, correct way',
    excerpt: 'Webhooks, idempotency, and refunds — the parts no tutorial covers.',
    body: `The hard parts of Stripe Checkout are after the redirect: webhook ordering,
idempotency keys, and handling refunds gracefully.`,
    coverImageUrl: baseImg('1521737604893-d14cc237f11d'),
    author,
    tags: ['Payments', 'Engineering'],
    publishedAt: daysAgo(28),
    readingMinutes: 9,
  },
]

export const mockTestimonials: Testimonial[] = [
  {
    id: 'tst_1',
    name: 'Priya Shah',
    role: 'CTO, Lyra Labs',
    avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=priya',
    body: 'DevHub templates saved us 6+ engineering weeks. The quality bar is unreal.',
    rating: 5,
  },
  {
    id: 'tst_2',
    name: 'Mateo Rivera',
    role: 'Indie Hacker',
    avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=mateo',
    body: 'I launched my SaaS in 9 days using Nimbus. Cleanest starter I have seen.',
    rating: 5,
  },
  {
    id: 'tst_3',
    name: 'Sasha Lin',
    role: 'Staff Engineer, Northwind',
    avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=sasha',
    body: 'The admin panel is exactly the architecture we would have built in-house.',
    rating: 5,
  },
]

export const mockStats = {
  totalProjects: mockProjects.length + 24,
  totalUsers: 4820,
  totalDownloads: 128400,
  totalRevenueCents: 5_840_000,
}

const trend = (base: number, days: number): Array<{ date: string; value: number }> =>
  Array.from({ length: days }, (_, i) => {
    const noise = Math.sin(i * 0.7) * (base * 0.18) + (Math.random() - 0.5) * (base * 0.12)
    return { date: daysAgo(days - 1 - i).slice(0, 10), value: Math.max(0, Math.round(base + noise + i * (base * 0.012))) }
  })

export const mockAnalytics: AdminAnalytics = {
  summary: mockStats,
  downloadsTrend: trend(420, 30),
  revenueTrend: trend(2400, 30),
  userGrowth: trend(28, 30),
  topProjects: mockProjects
    .slice()
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      viewCount: p.viewCount,
      downloadCount: p.downloadCount,
      rating: p.rating,
    })),
}

const paginate = <T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> => ({
  items: items.slice((page - 1) * pageSize, page * pageSize),
  total: items.length,
  page,
  pageSize,
})

const sortProjects = (items: Project[], sort: ProjectQuery['sort']): Project[] => {
  const arr = items.slice()
  switch (sort) {
    case 'popular':
      return arr.sort((a, b) => b.likeCount + b.viewCount - (a.likeCount + a.viewCount))
    case 'top_rated':
      return arr.sort((a, b) => b.rating - a.rating)
    case 'most_downloaded':
      return arr.sort((a, b) => b.downloadCount - a.downloadCount)
    case 'latest':
    default:
      return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }
}

export const mockApi = {
  delay: (ms = 220): Promise<void> => new Promise((r) => setTimeout(r, ms)),

  async login(email: string, password: string): Promise<AuthResponse> {
    await this.delay()
    const isAdmin = email.toLowerCase().includes('admin')
    const user = isAdmin ? adminUser : { ...regularUser, email }
    if (!password || password.length < 4) throw new Error('Invalid credentials')
    return {
      user,
      tokens: { accessToken: `mock_access_${user.id}`, refreshToken: `mock_refresh_${user.id}` },
    }
  },

  async register(payload: { email: string; password: string; username: string; fullName: string }): Promise<AuthResponse> {
    await this.delay()
    const user: User = {
      id: `usr_${Date.now()}`,
      email: payload.email,
      username: payload.username,
      fullName: payload.fullName,
      avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${payload.username}`,
      role: 'user',
      emailVerified: false,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    return {
      user,
      tokens: { accessToken: `mock_access_${user.id}`, refreshToken: `mock_refresh_${user.id}` },
    }
  },

  async forgotPassword(email: string): Promise<{ ok: true; email: string }> {
    await this.delay()
    return { ok: true, email }
  },

  async me(token?: string): Promise<User> {
    await this.delay(80)
    if (token && token.includes('usr_admin')) return adminUser
    return regularUser
  },

  async categories(): Promise<Category[]> {
    await this.delay(80)
    return mockCategories
  },

  async tags(): Promise<Tag[]> {
    await this.delay(80)
    return mockTags
  },

  async projects(query: ProjectQuery = {}): Promise<PaginatedResponse<Project>> {
    await this.delay()
    let items = mockProjects.slice()
    if (query.search) {
      const q = query.search.toLowerCase()
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.techStack.some((s) => s.toLowerCase().includes(q)),
      )
    }
    if (query.category && query.category !== 'all') {
      items = items.filter((p) => p.category.slug === query.category)
    }
    if (query.tech) {
      items = items.filter((p) => p.techStack.some((s) => s.toLowerCase() === query.tech!.toLowerCase()))
    }
    if (query.pricing && query.pricing !== 'all') {
      items = items.filter((p) => p.pricingType === query.pricing)
    }
    items = sortProjects(items, query.sort ?? 'latest')
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 9
    return paginate(items, page, pageSize)
  },

  async featuredProjects(): Promise<Project[]> {
    await this.delay(100)
    return mockProjects.filter((p) => p.featured)
  },

  async trendingProjects(): Promise<Project[]> {
    await this.delay(100)
    return mockProjects.filter((p) => p.trending).slice(0, 6)
  },

  async project(slug: string): Promise<Project | null> {
    await this.delay()
    return mockProjects.find((p) => p.slug === slug) ?? null
  },

  async reviews(projectId: string): Promise<Review[]> {
    await this.delay(120)
    return mockReviews.filter((r) => r.projectId === projectId)
  },

  async openSource(): Promise<OpenSourceResource[]> {
    await this.delay(120)
    return mockOpenSourceResources
  },

  async stats() {
    await this.delay(80)
    return mockStats
  },

  async analytics(): Promise<AdminAnalytics> {
    await this.delay(120)
    return mockAnalytics
  },

  async orders(): Promise<Order[]> {
    await this.delay(120)
    return mockOrders
  },

  async users(): Promise<User[]> {
    await this.delay(80)
    return mockUsers
  },

  async blogPosts(): Promise<BlogPost[]> {
    await this.delay(100)
    return mockBlogPosts
  },

  async blogPost(slug: string): Promise<BlogPost | null> {
    await this.delay(80)
    return mockBlogPosts.find((p) => p.slug === slug) ?? null
  },

  async testimonials(): Promise<Testimonial[]> {
    await this.delay(60)
    return mockTestimonials
  },

  async checkoutSession(projectId: string): Promise<{ url: string; sessionId: string }> {
    await this.delay(220)
    return {
      sessionId: `cs_test_mock_${projectId}_${Date.now()}`,
      url: `#/checkout/mock-success?projectId=${projectId}`,
    }
  },
}
