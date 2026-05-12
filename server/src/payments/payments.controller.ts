import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'
import { PaymentsService } from './payments.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { PublicUser } from '../auth/auth.service'

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  public static readonly WEBHOOK_PATH = 'api/payments/webhook'

  constructor(private readonly payments: PaymentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout-session')
  async createCheckoutSession(
    @Body('projectId') projectId: string,
    @CurrentUser() user: PublicUser,
  ) {
    return this.payments.createCheckoutSession(projectId, user.id)
  }

  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Req() req: Request & { rawBody?: Buffer; body: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const raw = req.rawBody ?? (req.body as Buffer)
    return this.payments.handleWebhook(raw, signature)
  }
}
