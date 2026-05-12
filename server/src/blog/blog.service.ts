import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBlogPostDto } from './dto/create-blog-post.dto'
import { UpdateBlogPostDto } from './dto/update-blog-post.dto'

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
      include: { author: true },
    })
  }

  async bySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { author: true },
    })
    if (!post) throw new NotFoundException('Post not found')
    return post
  }

  create(authorId: string, dto: CreateBlogPostDto) {
    return this.prisma.blogPost.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        excerpt: dto.excerpt,
        body: dto.body,
        coverImageUrl: dto.coverImageUrl,
        tags: dto.tags ?? [],
        readingMinutes: dto.readingMinutes ?? 5,
        authorId,
      },
    })
  }

  update(id: string, dto: UpdateBlogPostDto) {
    return this.prisma.blogPost.update({ where: { id }, data: dto })
  }

  remove(id: string) {
    return this.prisma.blogPost.delete({ where: { id } })
  }
}
