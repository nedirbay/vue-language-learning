import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import type { User } from '@prisma/client'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existingEmail) {
      throw new ConflictException('Email already in use')
    }
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    })
    if (existingUsername) {
      throw new ConflictException('Username already taken')
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        fullName: dto.fullName,
        passwordHash,
      },
    })
    const tokens = await this.issueTokens(user)
    return { user: this.toPublic(user), tokens }
  }

  async login(dto: LoginDto): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash)
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password')
    }
    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Account suspended')
    }
    const tokens = await this.issueTokens(user)
    return { user: this.toPublic(user), tokens }
  }

  async issueTokens(user: User): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = await this.jwt.signAsync(payload)
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET', 'refresh-change-me'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
    })
    return { accessToken, refreshToken }
  }

  toPublic(user: User): PublicUser {
    const { passwordHash, emailToken, ...rest } = user
    void passwordHash
    void emailToken
    return rest
  }
}

export type PublicUser = Omit<User, 'passwordHash' | 'emailToken'>
