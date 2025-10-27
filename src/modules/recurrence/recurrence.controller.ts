import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecurrenceService } from './recurrence.service';

@ApiTags('- Recurrence')
@Controller('recurrence')
export class RecurrenceController {
  constructor(private readonly recurrenceService: RecurrenceService) {}

  @ApiOperation({
    summary: '[Recurrence] 생성',
  })
  @ApiBearerAuth()
  @Post('create')
  async create() {
    await this.recurrenceService.create();
  }
}
