import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dtos/requests/sign-in-request.dto';
import { RefreshRequestDto } from './dtos/requests/refresh-request.dto';
import { SignInResponseDto } from './dtos/responses/sign-in-response.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { plainToInstance } from 'class-transformer';
import { Public } from '../../common/decorators/public.decorator';
import {User} from "../user/user.entity";

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
  @ApiBody({ type: RefreshRequestDto })
  @ApiBearerAuth()
  @Public()
  @Post('refresh')
  async refreshAccessToken(
    @Headers('authorization') authorization: string,
    @Body() refreshReq: RefreshRequestDto,
  ): Promise<{ atk: string }> {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const rtk = authorization.replace('Bearer ', '').trim();
    const email = refreshReq.email;
    return { atk: await this.authService.refreshATK(email, rtk) };
  }

  @ApiOperation({
    summary: '[User] 로그아웃'
  })
  @ApiBearerAuth()
  @ResponseMessage('로그아웃 되었습니다.')
  @Post('sign-out')
  async signOut(@Req() req) {
    const user: User = req.user;

    await this.authService.signOut(user);

    return HttpStatus.OK;
  }
}
