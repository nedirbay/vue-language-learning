import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ProjectsService } from './projects.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { QueryProjectsDto } from './dto/query-projects.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { PublicUser } from '../auth/auth.service'

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  list(@Query() query: QueryProjectsDto) {
    return this.projects.list(query)
  }

  @Get('featured')
  featured() {
    return this.projects.featured()
  }

  @Get('trending')
  trending() {
    return this.projects.trending()
  }

  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.projects.bySlug(slug)
  }

  @Get(':id/reviews')
  reviews(@Param('id') id: string) {
    return this.projects.reviews(id)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('mine/list')
  mine(@CurrentUser() user: PublicUser) {
    return this.projects.listByAuthor(user.id)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Post()
  create(@CurrentUser() user: PublicUser, @Body() dto: CreateProjectDto) {
    return this.projects.create(user.id, dto)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Patch(':id')
  update(
    @CurrentUser() user: PublicUser,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projects.update(id, dto, user)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Delete(':id')
  remove(@CurrentUser() user: PublicUser, @Param('id') id: string) {
    return this.projects.remove(id, user)
  }
}
