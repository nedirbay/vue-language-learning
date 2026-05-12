import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'

export class CreateBlogPostDto {
  @IsString()
  slug!: string

  @IsString()
  title!: string

  @IsString()
  excerpt!: string

  @IsString()
  body!: string

  @IsOptional()
  @IsString()
  coverImageUrl?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @IsOptional()
  @IsInt()
  readingMinutes?: number
}
