import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'
import { AuthService } from '../auth.service'
import type { PublicUser } from '../auth.service'

interface JwtPayload {
  sub: string
  email: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'change-me'),
    })
  }

  async validate(payload: JwtPayload): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) {
      throw new Error('Invalid token: user not found')
    }
    return this.auth.toPublic(user)
  }
}
