import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { QueryProjectsDto } from './dto/query-projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: QueryProjectsDto) {
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 9
    const where: Prisma.ProjectWhereInput = { status: 'PUBLISHED' }
    if (query.pricing) where.pricingType = query.pricing
    if (query.category) where.category = { slug: query.category }
    if (query.tech) where.techStack = { has: query.tech }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { shortDescription: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput = (() => {
      switch (query.sort) {
        case 'popular':
          return { likeCount: 'desc' }
        case 'top_rated':
          return { rating: 'desc' }
        case 'most_downloaded':
          return { downloadCount: 'desc' }
        default:
          return { createdAt: 'desc' }
      }
    })()

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: true,
          category: true,
          tags: true,
        },
      }),
      this.prisma.project.count({ where }),
    ])
    return { items, total, page, pageSize }
  }

  featured() {
    return this.prisma.project.findMany({
      where: { featured: true, status: 'PUBLISHED' },
      take: 6,
      include: { author: true, category: true, tags: true },
    })
  }

  trending() {
    return this.prisma.project.findMany({
      where: { trending: true, status: 'PUBLISHED' },
      take: 6,
      orderBy: { likeCount: 'desc' },
      include: { author: true, category: true, tags: true },
    })
  }

  async bySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: { author: true, category: true, tags: true },
    })
    if (!project) throw new NotFoundException('Project not found')
    await this.prisma.project.update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } },
    })
    return project
  }

  reviews(projectId: string) {
    return this.prisma.review.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    })
  }

  create(authorId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        shortDescription: dto.shortDescription,
        description: dto.description,
        coverImageUrl: dto.coverImageUrl,
        pricingType: dto.pricingType,
        priceCents: dto.priceCents ?? 0,
        currency: dto.currency ?? 'USD',
        techStack: dto.techStack,
        features: dto.features ?? [],
        status: dto.status ?? 'DRAFT',
        featured: dto.featured ?? false,
        trending: dto.trending ?? false,
        githubUrl: dto.githubUrl,
        liveDemoUrl: dto.liveDemoUrl,
        downloadUrl: dto.downloadUrl,
        category: { connect: { slug: dto.categorySlug } },
        author: { connect: { id: authorId } },
      },
    })
  }

  update(id: string, dto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: {
        title: dto.title,
        shortDescription: dto.shortDescription,
        description: dto.description,
        coverImageUrl: dto.coverImageUrl,
        pricingType: dto.pricingType,
        priceCents: dto.priceCents,
        currency: dto.currency,
        techStack: dto.techStack,
        features: dto.features,
        status: dto.status,
        featured: dto.featured,
        trending: dto.trending,
        githubUrl: dto.githubUrl,
        liveDemoUrl: dto.liveDemoUrl,
        downloadUrl: dto.downloadUrl,
        ...(dto.categorySlug
          ? { category: { connect: { slug: dto.categorySlug } } }
          : {}),
      },
    })
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } })
  }
}
