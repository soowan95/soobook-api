import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserSettingService } from './user-setting.service';
import { UserSettingBaseResponseDto } from './dtos/responses/user-setting-base-response.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import type { AuthRequest } from '../../common/interfaces/auth.request.interface';
import { UserSetting } from './user-setting.entity';
import { plainToInstance } from 'class-transformer';
import { UserSettingUpdateRequestDto } from './dtos/requests/user-setting-update-request.dto';

@ApiTags('- User Setting')
@Controller('user-setting')
export class UserSettingController {
  constructor(private readonly userSettingService: UserSettingService) {}

  @ApiOperation({
    summary: '[User Setting] 조회',
  })
  @ApiOkResponse({ type: UserSettingBaseResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.show')
  @Get('show')
  async show(@Req() req: AuthRequest): Promise<UserSettingBaseResponseDto> {
    const userSetting: UserSetting = await this.userSettingService.show(
      req.user.id,
    );

    return plainToInstance(UserSettingBaseResponseDto, userSetting);
  }

  @ApiOperation({
    summary: '[User Setting] 갱신',
  })
  @ApiBody({ type: UserSettingUpdateRequestDto })
  @ApiOkResponse({ type: UserSettingBaseResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.update')
  @Put('update')
  async update(
    @Req() req: AuthRequest,
    @Body() request: UserSettingUpdateRequestDto,
  ): Promise<UserSettingBaseResponseDto> {
    const userSetting: UserSetting = await this.userSettingService.update(
      req.user.id,
      request,
    );

    return plainToInstance(UserSettingBaseResponseDto, userSetting);
  }
}
