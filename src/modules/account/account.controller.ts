import { AccountService } from './account.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
import { AccountCreateRequestDto } from './dtos/requests/account-create-request.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import type { AuthRequest } from '../../common/interfaces/auth.request.interface';
import { plainToInstance } from 'class-transformer';
import { Account } from './account.entity';
import { AccountUpdateRequestDto } from './dtos/requests/account-update-request.dto';
import { AccountBaseResponseDto } from './dtos/responses/account-base-response.dto';

@ApiTags('- Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: '[Account] 생성' })
  @ApiBody({ type: AccountCreateRequestDto })
  @ApiOkResponse({ type: AccountBaseResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.create')
  @Post('create')
  async create(
    @Body() createReq: AccountCreateRequestDto,
    @Req() req: AuthRequest,
  ): Promise<AccountBaseResponseDto> {
    const account: Promise<Account> = this.accountService.create(
      createReq,
      req.user,
    );

    return plainToInstance(AccountBaseResponseDto, account);
  }

  @ApiOperation({ summary: '[Account] 전체 조회 ' })
  @ApiOkResponse({ type: AccountBaseResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('retrieve')
  async retrieve(@Req() req: AuthRequest): Promise<AccountBaseResponseDto[]> {
    const accounts: Account[] = await this.accountService.findAllByUserId(
      req.user.id,
    );

    return plainToInstance(AccountBaseResponseDto, accounts);
  }

  @ApiOperation({ summary: '[Account] 키워드를 통한 조회' })
  @ApiQuery({ name: 'keyword', required: true })
  @ApiOkResponse({ type: AccountBaseResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.read')
  @Get('show')
  async showByKeyword(
    @Query('keyword') keyword: string,
    @Req() req: AuthRequest,
  ): Promise<AccountBaseResponseDto[]> {
    const accounts: Account[] = await this.accountService.findAllByKeyword(
      keyword,
      req.user.id,
    );

    return plainToInstance(AccountBaseResponseDto, accounts);
  }

  @ApiOperation({ summary: '[Account] 갱신' })
  @ApiBody({ type: AccountUpdateRequestDto })
  @ApiBearerAuth()
  @ResponseMessage('success.update')
  @Put('update')
  async update(
    @Body() updateReq: AccountUpdateRequestDto,
  ): Promise<AccountBaseResponseDto> {
    const account: Promise<Account> = this.accountService.update(updateReq);

    return plainToInstance(AccountBaseResponseDto, account);
  }

  @ApiOperation({ summary: '[Account] 삭제' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @ResponseMessage('success.delete')
  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.accountService.delete(id);
  }
}
