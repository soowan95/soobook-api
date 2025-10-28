import { Body, Controller, Get, Post, Req } from '@nestjs/common';
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
import { RecurrenceBaseResponseDto } from './dtos/responses/recurrence-base-response.dto';
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
  @ApiOkResponse({ type: RecurrenceBaseResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.create')
  @Post('create')
  async create(
    @Body() createReq: RecurrenceCreateRequestDto,
    @Req() req: AuthRequest,
  ): Promise<RecurrenceBaseResponseDto> {
    const recurrence: Promise<Recurrence> = this.recurrenceService.create(
      createReq,
      req.user,
    );

    return plainToInstance(RecurrenceBaseResponseDto, recurrence);
  }

  @ApiOperation({
    summary: '[Recurrence] 전체 조회',
  })
  @ApiOkResponse({ type: RecurrenceBaseResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('retrieve')
  async retrieve(
    @Req() req: AuthRequest,
  ): Promise<RecurrenceBaseResponseDto[]> {
    const recurrences: Recurrence[] =
      await this.recurrenceService.findAllByUserId(req.user.id);

    return plainToInstance(RecurrenceBaseResponseDto, recurrences);
  }
}
