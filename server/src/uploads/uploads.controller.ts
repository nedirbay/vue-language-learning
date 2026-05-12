import { Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

/**
 * Minimal upload stub. Production: swap in `@nestjs/platform-express` `FileInterceptor`
 * + S3/MinIO/local-disk storage and validate mimetype + size here.
 */
@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('uploads')
export class UploadsController {
  @Post()
  upload(): { url: string } {
    return {
      url: 'https://placehold.co/800x500?text=DevHub+upload+stub',
    }
  }
}
