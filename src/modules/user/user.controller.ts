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
import { UserUpdateRequestDto } from './dtos/requests/user-update-request.dto';
import { UserUpdateResponseDto } from './dtos/responses/user-update-response.dto';
import type { AuthRequest } from '../../common/interfaces/auth.request.interface';
import { User } from './user.entity';

@ApiTags('- User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '[User] 회원가입',
  })
  @ApiBody({ type: SignUpRequestDto })
  @ApiOkResponse({ type: SignUpResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.signup')
  @Post('sign-up')
  async signUp(
    @Req() req: AuthRequest,
    @Body() signUpReq: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    const signUpUser: Promise<User> = this.userService.signUp(signUpReq, req.user.id);

    return plainToInstance(SignUpResponseDto, signUpUser);
  }

  @ApiOperation({
    summary: '[User] 정보 갱신',
  })
  @ApiBody({ type: UserUpdateRequestDto })
  @ApiOkResponse({ type: UserUpdateResponseDto })
  @ApiBearerAuth()
  @ResponseMessage('success.update')
  @Put('update')
  async update(
    @Body() updateReq: UserUpdateRequestDto,
    @Req() req: AuthRequest,
  ): Promise<UserUpdateResponseDto> {
    const updateUser: Promise<User> = this.userService.update(
      updateReq,
      req.user,
    );

    return plainToInstance(UserUpdateResponseDto, updateUser);
  }

  @ApiOperation({
    summary: '[User] 회원 탈퇴',
  })
  @ApiBearerAuth()
  @ResponseMessage('success.delete')
  @Delete('delete')
  async delete(@Req() req: AuthRequest): Promise<void> {
    await this.userService.delete(req.user.id);
  }
}
