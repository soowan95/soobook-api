import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RecurrenceService } from './recurrence.service';
import { RecurrenceCreateRequestDto } from './dtos/requests/recurrence-create-request.dto';
import type { AuthRequest } from '../../common/interfaces/auth.request.interface';
import { RecurrenceCreateResponseDto } from './dtos/responses/recurrence-create-response.dto';
import { Recurrence } from './recurrence.entity';
import { plainToInstance } from 'class-transformer';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@ApiTags('- Recurrence')
@Controller('recurrence')
export class RecurrenceController {
  constructor(private readonly recurrenceService: RecurrenceService) {}

  @ApiOperation({
    summary: '[Recurrence] 생성',
  })
  @ApiBody({ type: RecurrenceCreateRequestDto })
  @ApiOkResponse({ type: RecurrenceCreateResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.create')
  @Post('create')
  async create(
    @Body() createReq: RecurrenceCreateRequestDto,
    @Req() req: AuthRequest,
  ): Promise<RecurrenceCreateResponseDto> {
    const recurrence: Promise<Recurrence> = this.recurrenceService.create(
      createReq,
      req.user,
    );

    return plainToInstance(RecurrenceCreateResponseDto, recurrence);
  }
}
