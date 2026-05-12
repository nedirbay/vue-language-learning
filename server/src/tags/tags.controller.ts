import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { TagsService } from './tags.service'

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  @Get()
  list() {
    return this.tags.list()
  }
}
