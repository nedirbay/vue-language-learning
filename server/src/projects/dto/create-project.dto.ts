import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'
import type { PricingType, ProjectStatus } from '@prisma/client'

export class CreateProjectDto {
  @IsString()
  slug!: string

  @IsString()
  title!: string

  @IsString()
  shortDescription!: string

  @IsString()
  description!: string

  @IsString()
  coverImageUrl!: string

  @IsString()
  categorySlug!: string

  @IsEnum(['FREE', 'PAID', 'OPEN_SOURCE'])
  pricingType!: PricingType

  @IsOptional()
  @IsInt()
  @Min(0)
  priceCents?: number

  @IsOptional()
  @IsString()
  currency?: string

  @IsArray()
  @IsString({ each: true })
  techStack!: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[]

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: ProjectStatus

  @IsOptional()
  @IsBoolean()
  featured?: boolean

  @IsOptional()
  @IsBoolean()
  trending?: boolean

  @IsOptional()
  @IsString()
  githubUrl?: string

  @IsOptional()
  @IsString()
  liveDemoUrl?: string

  @IsOptional()
  @IsString()
  downloadUrl?: string
}
