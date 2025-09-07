import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dtos/requests/sign-in-request.dto';
import { SignInResponseDto } from './dtos/responses/sign-in-response.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { plainToInstance } from 'class-transformer';
import { Public } from '../common/decorators/public.decorator';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';

@ApiTags('- Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '[User] 로그인',
  })
  @ApiBody({ type: SignInRequestDto })
  @ApiOkResponse({ type: SignInResponseDto })
  @ResponseMessage('로그인 되었습니다.')
  @Public()
  @Post('sign-in')
  async signIn(
    @Body() signInReq: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const payload = await this.authService.signIn(
      signInReq.email,
      signInReq.password,
    );

    return plainToInstance(SignInResponseDto, payload);
  }

  @ApiOperation({
    summary: '[User] Access token 재발급',
  })
  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @Public()
  @Post('refresh')
  async refreshAccessToken(@Req() req: any): Promise<{ atk: string }> {
    const user = req.user;
    return { atk: await this.authService.refreshATK(user) };
  }
}
