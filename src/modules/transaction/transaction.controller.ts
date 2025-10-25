import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { plainToInstance } from 'class-transformer';
import { TransactionShowResponseDto } from './dtos/responses/transaction-show-response.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { TransactionCreateRequestDto } from './dtos/requests/transaction-create-request.dto';
import type { AuthRequest } from '../../common/interfaces/auth.request.interface';
import { Transaction } from './transaction.entity';

@ApiTags('- Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({
    summary: '[Transaction] 일일 조회',
  })
  @ApiOkResponse({ type: TransactionShowResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('daily')
  async showDaily(
    @Req() req: AuthRequest,
  ): Promise<TransactionShowResponseDto[]> {
    const transactions: Transaction[] = await this.transactionService.showDaily(
      req.user.id,
    );

    return plainToInstance(TransactionShowResponseDto, transactions);
  }

  @ApiOperation({
    summary: '[Transaction] 월별 조회',
  })
  @ApiOkResponse({ type: TransactionShowResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('monthly')
  async showMonthly(
    @Req() req: AuthRequest,
  ): Promise<TransactionShowResponseDto[]> {
    const transactions: Transaction[] =
      await this.transactionService.showMonthly(req.user.id);

    return plainToInstance(TransactionShowResponseDto, transactions);
  }

  @ApiOperation({
    summary: '[Transaction] 생성',
  })
  @ApiBody({ type: TransactionCreateRequestDto })
  @ApiOkResponse({ type: TransactionShowResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.create')
  @Post('create')
  async create(
    @Body() createReq: TransactionCreateRequestDto,
    @Req() req: AuthRequest,
  ): Promise<TransactionShowResponseDto> {
    const transaction: Promise<Transaction> = this.transactionService.create(
      createReq,
      req.user,
    );

    return plainToInstance(TransactionShowResponseDto, transaction);
  }
}
