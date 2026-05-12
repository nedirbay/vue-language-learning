import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'
import type { PricingType } from '@prisma/client'

export class QueryProjectsDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(['FREE', 'PAID', 'OPEN_SOURCE'])
  pricing?: PricingType

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  tech?: string

  @IsOptional()
  @IsEnum(['latest', 'popular', 'top_rated', 'most_downloaded'])
  sort?: 'latest' | 'popular' | 'top_rated' | 'most_downloaded'

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number
}
