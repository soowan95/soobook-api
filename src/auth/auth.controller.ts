import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dtos/requests/sign-in-request.dto';
import { SignInResponseDto } from './dtos/responses/sign-in-response.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { plainToInstance } from 'class-transformer';
import { Public } from '../common/decorators/public.decorator';

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
}
