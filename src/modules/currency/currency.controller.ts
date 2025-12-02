import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Post } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyBaseResponseDto } from './dtos/responses/currency-base-response.dto';
import { UserRole } from '../user/user.entity';
import { Role } from '../../common/decorators/user-role.decorator';
import { Currency } from './currency.entity';
import { plainToInstance } from 'class-transformer';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@ApiTags('- Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @ApiOperation({
    summary: '[Currency] 한국수출입은행 API 호출',
  })
  @ApiOkResponse({ type: CurrencyBaseResponseDto, isArray: true })
  @ApiBearerAuth()
  @Role(UserRole.ADMIN)
  @ResponseMessage('success.fetch')
  @Post('fetch')
  async fetch(): Promise<CurrencyBaseResponseDto[]> {
    const currencies: Currency[] = await this.currencyService.fetch();

    return plainToInstance(CurrencyBaseResponseDto, currencies);
  }

  @ApiOperation({
    summary: '[Currency] 통화 전체 조회',
  })
  @ApiOkResponse({ type: CurrencyBaseResponseDto, isArray: true })
  @ApiBearerAuth()
  @ResponseMessage('success.retrieve')
  @Get('retrieve')
  async retrieve(): Promise<CurrencyBaseResponseDto[]> {
    const currencies: Currency[] = await this.currencyService.findAll();

    return plainToInstance(CurrencyBaseResponseDto, currencies);
  }
}
