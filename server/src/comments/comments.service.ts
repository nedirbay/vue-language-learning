import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, projectId: string, rating: number, body: string) {
    const review = await this.prisma.review.upsert({
      where: { projectId_userId: { projectId, userId } },
      update: { rating, body },
      create: { userId, projectId, rating, body },
    })
    await this.recompute(projectId)
    return review
  }

  async remove(id: string) {
    const review = await this.prisma.review.delete({ where: { id } })
    await this.recompute(review.projectId)
    return review
  }

  private async recompute(projectId: string): Promise<void> {
    const agg = await this.prisma.review.aggregate({
      where: { projectId },
      _avg: { rating: true },
      _count: true,
    })
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        rating: agg._avg.rating ?? 0,
        reviewCount: agg._count,
      },
    })
  }
}
