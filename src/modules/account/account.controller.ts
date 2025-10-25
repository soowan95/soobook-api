import { AccountService } from './account.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { AccountCreateRequestDto } from './dtos/requests/account-create-request.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import type { AuthRequest } from '../../common/interfaces/auth.request.interface';
import { plainToInstance } from 'class-transformer';
import { AccountCreateResponseDto } from './dtos/responses/account-create-response.dto';
import { Account } from './account.entity';
import { AccountUpdateRequestDto } from './dtos/requests/account-update-request.dto';
import { AccountUpdateResponseDto } from './dtos/responses/account-update-response.dto';
import { AccountReadResponseDto } from './dtos/responses/account-read-response.dto';

@ApiTags('- Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: '[Account] 생성' })
  @ApiBody({ type: AccountCreateRequestDto })
  @ApiOkResponse({ type: AccountCreateResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.create')
  @Post('create')
  async create(
    @Body() createReq: AccountCreateRequestDto,
    @Req() req: AuthRequest,
  ): Promise<AccountCreateResponseDto> {
    const account: Promise<Account> = this.accountService.create(
      createReq,
      req.user,
    );

    return plainToInstance(AccountCreateResponseDto, account);
  }

  @ApiOperation({ summary: '[Account] 전체 조회 ' })
  @ApiOkResponse({ type: AccountReadResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('retrieve')
  async retrieve(@Req() req: AuthRequest): Promise<AccountReadResponseDto[]> {
    const accounts: Account[] = await this.accountService.findAllByUserId(
      req.user.id,
    );

    return plainToInstance(AccountReadResponseDto, accounts);
  }

  @ApiOperation({ summary: '[Account] 키워드를 통한 조회' })
  @ApiOkResponse({ type: AccountReadResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('show')
  async showByKeyword(
    @Query('k') keyword: string,
    @Req() req: AuthRequest,
  ): Promise<AccountReadResponseDto[]> {
    const accounts: Account[] = await this.accountService.findAllByKeyword(
      keyword,
      req.user.id,
    );

    return plainToInstance(AccountReadResponseDto, accounts);
  }

  @ApiOperation({ summary: '[Account] 갱신' })
  @ApiBody({ type: AccountUpdateRequestDto })
  @ApiBearerAuth()
  @ResponseMessage('success.update')
  @Put('update')
  async update(
    @Body() updateReq: AccountUpdateRequestDto,
  ): Promise<AccountUpdateResponseDto> {
    const account: Promise<Account> = this.accountService.update(updateReq);

    return plainToInstance(AccountUpdateResponseDto, account);
  }
}
