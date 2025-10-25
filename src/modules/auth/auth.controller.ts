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
  Headers,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dtos/requests/sign-in-request.dto';
import { RefreshRequestDto } from './dtos/requests/refresh-request.dto';
import { SignInResponseDto } from './dtos/responses/sign-in-response.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { plainToInstance } from 'class-transformer';
import { Public } from '../../common/decorators/public.decorator';
import { User } from '../user/user.entity';
import type { AuthRequest } from '../../common/interfaces/auth.request.interface';

@ApiTags('- Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '[User] 로그인',
  })
  @ApiBody({ type: SignInRequestDto })
  @ApiOkResponse({ type: SignInResponseDto })
  @ResponseMessage('success.login')
  @Public()
  @Post('sign-in')
  async signIn(
    @Body() signInReq: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const payload: { user: User; accessToken: string; refreshToken: string } =
      await this.authService.signIn(signInReq.email, signInReq.password);

    return plainToInstance(SignInResponseDto, payload);
  }

  @ApiOperation({
    summary: '[User] 게스트 로그인',
  })
  @ApiOkResponse({ type: SignInResponseDto })
  @ResponseMessage('success.guest.login')
  @Public()
  @Post('guest/sign-in')
  async guestSignIn(): Promise<SignInResponseDto> {
    const signUpGuest = await this.authService.guestSignUp();

    const payload: { user: User; accessToken: string; refreshToken: string } =
      await this.authService.guestSingIn(signUpGuest);

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
      throw new UnauthorizedException('error.rtk.notFound');
    }

    const rtk: string = authorization.replace('Bearer ', '').trim();
    const email: string = refreshReq.email;
    return { atk: await this.authService.refreshATK(email, rtk) };
  }

  @ApiOperation({
    summary: '[User] 로그아웃',
  })
  @ApiBearerAuth()
  @ResponseMessage('success.logout')
  @Post('sign-out')
  async signOut(@Req() req: AuthRequest): Promise<void> {
    const user: User = req.user;

    await this.authService.signOut(user);
  }
}
