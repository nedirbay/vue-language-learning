import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CommentsService } from './comments.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { PublicUser } from '../auth/auth.service'

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Post()
  create(
    @CurrentUser() user: PublicUser,
    @Body('projectId') projectId: string,
    @Body('rating') rating: number,
    @Body('body') body: string,
  ) {
    return this.comments.create(user.id, projectId, rating, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comments.remove(id)
  }
}
