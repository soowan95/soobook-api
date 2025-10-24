import { AccountService } from './account.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { AccountCreateRequestDto } from './dtos/requests/account-create-request.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import type { AuthRequest } from '../../common/interfaces/auth.request.interface';
import { plainToInstance } from 'class-transformer';
import { AccountCreateResponseDto } from './dtos/responses/account-create-response.dto';
import { Account } from './account.entity';

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
    const account: Promise<Account> = this.accountService.create(createReq, req.user);

    return plainToInstance(AccountCreateResponseDto, account);
  }
}
