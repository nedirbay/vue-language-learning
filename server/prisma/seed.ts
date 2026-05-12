import { PrismaClient, PricingType, ProjectStatus, UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  const adminPw = await bcrypt.hash('admin1234', 10)
  const userPw = await bcrypt.hash('demo1234', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@devhub.dev' },
    update: {},
    create: {
      email: 'admin@devhub.dev',
      username: 'admin',
      fullName: 'DevHub Admin',
      passwordHash: adminPw,
      role: UserRole.ADMIN,
      emailVerified: true,
      avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=admin',
    },
  })

  await prisma.user.upsert({
    where: { email: 'alex@devhub.dev' },
    update: {},
    create: {
      email: 'alex@devhub.dev',
      username: 'alex',
      fullName: 'Alex Carter',
      passwordHash: userPw,
      emailVerified: true,
      avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=alex',
    },
  })

  const categoriesData = [
    { slug: 'starter-kits', name: 'Starter Kits' },
    { slug: 'dashboards', name: 'Dashboards' },
    { slug: 'saas', name: 'SaaS Templates' },
    { slug: 'tools', name: 'Developer Tools' },
    { slug: 'ai-ml', name: 'AI / ML' },
    { slug: 'landing-pages', name: 'Landing Pages' },
  ]
  for (const c of categoriesData) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
  }

  const tagsData = [
    { slug: 'vue', name: 'Vue' },
    { slug: 'react', name: 'React' },
    { slug: 'nestjs', name: 'NestJS' },
    { slug: 'nodejs', name: 'Node.js' },
    { slug: 'postgres', name: 'PostgreSQL' },
    { slug: 'stripe', name: 'Stripe' },
    { slug: 'tailwind', name: 'Tailwind' },
    { slug: 'typescript', name: 'TypeScript' },
    { slug: 'docker', name: 'Docker' },
    { slug: 'ai', name: 'AI' },
  ]
  for (const t of tagsData) {
    await prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t })
  }

  const dashboardsCat = await prisma.category.findUnique({ where: { slug: 'dashboards' } })
  const saasCat = await prisma.category.findUnique({ where: { slug: 'saas' } })
  const toolsCat = await prisma.category.findUnique({ where: { slug: 'tools' } })
  if (!dashboardsCat || !saasCat || !toolsCat) {
    throw new Error('Categories not seeded correctly')
  }

  const vueTag = await prisma.tag.findUnique({ where: { slug: 'vue' } })
  const tsTag = await prisma.tag.findUnique({ where: { slug: 'typescript' } })

  const projectsData = [
    {
      slug: 'atlas-admin',
      title: 'Atlas Admin Dashboard',
      shortDescription:
        'Production-ready Vue 3 admin dashboard with 60+ components and 10 themes.',
      description: '## Overview\nAtlas Admin is a comprehensive admin dashboard.',
      coverImageUrl:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=70',
      pricingType: PricingType.PAID,
      priceCents: 4900,
      status: ProjectStatus.PUBLISHED,
      featured: true,
      trending: true,
      techStack: ['Vue 3', 'TypeScript', 'Element Plus', 'Tailwind', 'Pinia'],
      features: [
        'Comprehensive documentation',
        'Production-ready architecture',
        'Type-safe end-to-end',
      ],
      rating: 4.9,
      reviewCount: 128,
      likeCount: 612,
      downloadCount: 2340,
      viewCount: 18420,
      categoryId: dashboardsCat.id,
      authorId: admin.id,
    },
    {
      slug: 'nimbus-saas-starter',
      title: 'Nimbus SaaS Starter',
      shortDescription: 'Full-stack SaaS boilerplate with auth, billing, and team management.',
      description: '## Nimbus\nFull-stack SaaS starter.',
      coverImageUrl:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=70',
      pricingType: PricingType.PAID,
      priceCents: 9900,
      status: ProjectStatus.PUBLISHED,
      featured: true,
      trending: true,
      techStack: ['NestJS', 'Vue 3', 'Prisma', 'PostgreSQL', 'Stripe'],
      features: ['Stripe billing', 'Multi-tenant workspaces', 'Production-ready Docker setup'],
      rating: 4.8,
      reviewCount: 86,
      likeCount: 480,
      downloadCount: 1180,
      viewCount: 12400,
      categoryId: saasCat.id,
      authorId: admin.id,
    },
    {
      slug: 'quill-markdown-editor',
      title: 'Quill Markdown Editor',
      shortDescription: 'A delightful markdown editor component for Vue with live preview.',
      description: '## Quill\nDrop-in markdown editor.',
      coverImageUrl:
        'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=70',
      pricingType: PricingType.FREE,
      priceCents: 0,
      status: ProjectStatus.PUBLISHED,
      featured: false,
      trending: false,
      techStack: ['Vue 3', 'TypeScript', 'CodeMirror'],
      features: ['Syntax highlighting', 'Slash commands', 'Preview pane'],
      rating: 4.6,
      reviewCount: 87,
      likeCount: 612,
      downloadCount: 9220,
      viewCount: 20400,
      categoryId: toolsCat.id,
      authorId: admin.id,
    },
  ]

  for (const p of projectsData) {
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
    if (vueTag && tsTag) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          tags: {
            connect: [{ id: vueTag.id }, { id: tsTag.id }],
          },
        },
      })
    }
  }

  await prisma.blogPost.upsert({
    where: { slug: 'why-i-built-devhub' },
    update: {},
    create: {
      slug: 'why-i-built-devhub',
      title: 'Why I built DevHub',
      excerpt: 'A modern marketplace for developers, by a developer.',
      body: '## The story\nMost product marketplaces feel built for buyers…',
      tags: ['Product', 'Indie'],
      authorId: admin.id,
      readingMinutes: 5,
    },
  })

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
