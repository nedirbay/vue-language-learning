import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import * as express from 'express'
import { AppModule } from './app.module'
import { PaymentsController } from './payments/payments.controller'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  })
  const config = app.get(ConfigService)
  const logger = new Logger('Bootstrap')

  // Stripe webhook needs the raw body, so register it before the JSON parser.
  app.use(
    `/${PaymentsController.WEBHOOK_PATH}`,
    express.raw({ type: 'application/json' }),
  )
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true }))

  app.use(helmet())
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'http://localhost:5173').split(','),
    credentials: true,
  })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  const swagger = new DocumentBuilder()
    .setTitle('DevHub API')
    .setDescription('Backend for the DevHub developer marketplace.')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build()
  const doc = SwaggerModule.createDocument(app, swagger)
  SwaggerModule.setup('api/docs', app, doc)

  const port = Number(config.get<string>('PORT', '4000'))
  await app.listen(port)
  logger.log(`DevHub API listening on http://localhost:${port}/api`)
  logger.log(`Swagger docs at http://localhost:${port}/api/docs`)
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start DevHub API', err)
  process.exit(1)
})
