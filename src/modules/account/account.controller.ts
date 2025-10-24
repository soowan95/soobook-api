import { AccountService } from './account.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Post } from '@nestjs/common';

@ApiTags('- Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: '[Account] 생성' })
  @Post('create')
  async create() {
    await this.accountService.create();
  }
}
