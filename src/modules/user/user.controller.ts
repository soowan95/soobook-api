import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Post, Put, Req } from '@nestjs/common';
import { SignUpResponseDto } from './dtos/responses/sign-up-response.dto';
import { SignUpRequestDto } from './dtos/requests/sign-up-request.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { plainToInstance } from 'class-transformer';
import { Public } from '../../common/decorators/public.decorator';
import { UserUpdateRequestDto } from './dtos/requests/user-update-request.dto';
import { UserUpdateResponseDto } from './dtos/responses/user-update-response.dto';
import type { AuthRequest } from '../../common/interfaces/auth.request.interface';

@ApiTags('- User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '[User] 회원가입',
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

  @ApiOperation({
    summary: '[User] 정보 갱신',
  })
  @ApiBody({ type: UserUpdateRequestDto })
  @ApiOkResponse({ type: UserUpdateResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.user.update')
  @Put('update')
  async update(
    @Body() updateReq: UserUpdateRequestDto,
    @Req() req: AuthRequest,
  ) {
    const updateUser = this.userService.update(updateReq, req.user);

    return plainToInstance(UserUpdateResponseDto, updateUser);
  }

  @ApiOperation({
    summary: '[User] 회원 탈퇴',
  })
  @ApiBearerAuth()
  @ResponseMessage('success.user.delete')
  @Delete('delete')
  async delete(@Req() req: AuthRequest) {
    await this.userService.delete(req.user.id);
  }
}
