import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { OrderStatus } from '@prisma/client'

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  listForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { project: true },
    })
  }

  listAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { project: true, user: true },
    })
  }

  setStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({ where: { id }, data: { status } })
  }
}
