import { UserService } from './user.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { SignUpResponseDto } from './dtos/response/sign-up-response.dto';
import { SignUpRequestDto } from './dtos/requests/sign-up-request.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { plainToInstance } from 'class-transformer';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('- User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '[User] 회원가입]',
  })
  @ApiBody({ type: SignUpRequestDto })
  @ApiOkResponse({ type: SignUpResponseDto })
  @ResponseMessage('success.signup')
  @Public()
  @Post('sign-up')
  async signUp(
    @Body() signUpReq: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    const signUpUser = this.userService.signUp(signUpReq);

    return plainToInstance(SignUpResponseDto, signUpUser);
  }
}
