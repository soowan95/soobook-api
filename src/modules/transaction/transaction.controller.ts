import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { plainToInstance } from 'class-transformer';
import { TransactionBaseResponseDto } from './dtos/responses/transaction-base-response.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { TransactionCreateRequestDto } from './dtos/requests/transaction-create-request.dto';
import type { AuthRequest } from '../../common/interfaces/auth.request.interface';
import { Transaction } from './transaction.entity';
import { TransactionUpdateRequestDto } from './dtos/requests/transaction-update-request.dto';
import { TransactionMonthlyBriefResponseDto } from './dtos/responses/transaction-monthly-brief-response-dto';

@ApiTags('- Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({
    summary: '[Transaction] 일일 조회',
  })
  @ApiQuery({ name: 'createdAt', required: false })
  @ApiQuery({ name: 'accountId', required: false })
  @ApiOkResponse({ type: TransactionBaseResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('daily')
  async showDaily(
    @Req() req: AuthRequest,
    @Query('createdAt') createdAt: string | undefined,
    @Query('accountId') accountId: number | undefined,
  ): Promise<TransactionBaseResponseDto[]> {
    const transactions: Transaction[] = await this.transactionService.showDaily(
      req.user.id,
      createdAt,
      accountId,
    );

    return plainToInstance(TransactionBaseResponseDto, transactions);
  }

  @ApiOperation({
    summary: '[Transaction] 월별 조회',
  })
  @ApiQuery({ name: 'createdAt', required: false })
  @ApiQuery({ name: 'accountId', required: false })
  @ApiOkResponse({ type: TransactionBaseResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('monthly')
  async showMonthly(
    @Req() req: AuthRequest,
    @Query('createdAt') createdAt: string | undefined,
    @Query('accountId') accountId: number | undefined,
  ): Promise<TransactionBaseResponseDto[]> {
    const transactions: Transaction[] =
      await this.transactionService.showMonthly(
        req.user.id,
        createdAt,
        accountId,
      );

    return plainToInstance(TransactionBaseResponseDto, transactions);
  }

  @ApiOperation({
    summary: '[Transaction] 당월 수입, 지출 총합 조회',
  })
  @ApiQuery({ name: 'accountId', required: false })
  @ApiOkResponse({ type: TransactionMonthlyBriefResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('monthly/brief')
  async showMonthlyBrief(
    @Req() req: AuthRequest,
    @Query('accountId') accountId: number | undefined,
  ): Promise<TransactionMonthlyBriefResponseDto> {
    return await this.transactionService.showMonthlyBrief(
      req.user.id,
      accountId,
    );
  }

  @ApiOperation({
    summary: '[Transaction] 생성',
  })
  @ApiBody({ type: TransactionCreateRequestDto })
  @ApiOkResponse({ type: TransactionBaseResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.create')
  @Post('create')
  async create(
    @Body() createReq: TransactionCreateRequestDto,
    @Req() req: AuthRequest,
  ): Promise<TransactionBaseResponseDto> {
    const transaction: Promise<Transaction> = this.transactionService.create(
      createReq,
      req.user,
    );

    return plainToInstance(TransactionBaseResponseDto, transaction);
  }

  @ApiOperation({
    summary: '[Transaction] 갱신',
  })
  @ApiBody({ type: TransactionUpdateRequestDto })
  @ApiOkResponse({ type: TransactionBaseResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.update')
  @Put('update')
  async update(
    @Body() updateReq: TransactionUpdateRequestDto,
    @Req() req: AuthRequest,
  ): Promise<TransactionBaseResponseDto> {
    const transaction: Promise<Transaction> = this.transactionService.update(
      updateReq,
      req.user.id,
    );

    return plainToInstance(TransactionBaseResponseDto, transaction);
  }

  @ApiOperation({
    summary: '[Transaction] 삭제',
  })
  @ApiBearerAuth()
  @ResponseMessage('success.delete')
  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.transactionService.delete(id);
  }
}
