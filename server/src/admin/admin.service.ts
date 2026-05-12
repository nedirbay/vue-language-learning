import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const [totalProjects, totalUsers, downloads, revenue] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.user.count(),
      this.prisma.project.aggregate({ _sum: { downloadCount: true } }),
      this.prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { amountCents: true },
      }),
    ])
    return {
      totalProjects,
      totalUsers,
      totalDownloads: downloads._sum.downloadCount ?? 0,
      totalRevenueCents: revenue._sum.amountCents ?? 0,
    }
  }

  async analytics() {
    const summary = await this.stats()
    const topProjects = await this.prisma.project.findMany({
      orderBy: { downloadCount: 'desc' },
      take: 5,
    })
    return {
      summary,
      topProjects,
      revenueTrend: this.synthTrend(7000, 0.4),
      downloadsTrend: this.synthTrend(380, 0.3),
      userGrowth: this.synthTrend(28, 0.2),
    }
  }

  private synthTrend(base: number, variance: number) {
    const today = new Date()
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (29 - i))
      const value = Math.max(
        0,
        Math.round(base * (1 + (Math.sin(i / 3) * variance)) + i * (base * 0.01)),
      )
      return { date: date.toISOString().slice(0, 10), value }
    })
  }
}
