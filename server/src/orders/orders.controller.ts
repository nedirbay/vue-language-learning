import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { OrdersService } from './orders.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { PublicUser } from '../auth/auth.service'
import type { OrderStatus } from '@prisma/client'

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get('mine')
  mine(@CurrentUser() user: PublicUser) {
    return this.orders.listForUser(user.id)
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  list() {
    return this.orders.listAll()
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.orders.setStatus(id, status)
  }
}
