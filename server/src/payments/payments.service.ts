import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PaymentsService implements OnModuleInit {
  private readonly logger = new Logger(PaymentsService.name)
  private stripe: Stripe | null = null

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit(): void {
    const key = this.config.get<string>('STRIPE_SECRET_KEY')
    if (key) {
      this.stripe = new Stripe(key, { apiVersion: '2024-06-20' })
      this.logger.log('Stripe configured.')
    } else {
      this.logger.warn('STRIPE_SECRET_KEY missing; payments run in mock mode.')
    }
  }

  /**
   * Create a Stripe Checkout session for a paid project. Falls back to a mock
   * URL when Stripe is not configured so the frontend purchase flow still
   * works end-to-end.
   */
  async createCheckoutSession(
    projectId: string,
    userId: string,
  ): Promise<{ id: string; url: string }> {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) throw new NotFoundException('Project not found')

    const successUrl = this.config.get<string>(
      'STRIPE_SUCCESS_URL',
      'http://localhost:5173/#/checkout/mock-success',
    )
    const cancelUrl = this.config.get<string>(
      'STRIPE_CANCEL_URL',
      'http://localhost:5173/#/projects',
    )

    if (!this.stripe || project.pricingType !== 'PAID') {
      // Create a pending order so the dashboard reflects activity.
      const order = await this.prisma.order.create({
        data: {
          userId,
          projectId: project.id,
          amountCents: project.priceCents,
          currency: project.currency,
          status: 'PAID',
        },
      })
      return { id: `mock_${order.id}`, url: successUrl }
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        projectId: project.id,
        amountCents: project.priceCents,
        currency: project.currency,
        status: 'PENDING',
      },
    })

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: project.currency.toLowerCase(),
            unit_amount: project.priceCents,
            product_data: {
              name: project.title,
              description: project.shortDescription,
              images: [project.coverImageUrl],
            },
          },
        },
      ],
      metadata: { orderId: order.id, projectId: project.id, userId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    await this.prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    return { id: session.id, url: session.url ?? successUrl }
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<{ received: boolean }> {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET')
    if (!this.stripe || !secret) {
      this.logger.warn('Webhook received but Stripe not configured.')
      return { received: true }
    }
    let event: Stripe.Event
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, secret)
    } catch (err) {
      this.logger.error('Invalid Stripe signature', err as Error)
      throw err
    }
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId
      if (orderId) {
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            stripePaymentId: session.payment_intent as string,
          },
        })
      }
    } else if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge
      await this.prisma.order.updateMany({
        where: { stripePaymentId: charge.payment_intent as string },
        data: { status: 'REFUNDED' },
      })
    }
    return { received: true }
  }
}
