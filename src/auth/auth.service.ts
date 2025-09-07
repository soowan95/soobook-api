import { BadRequestException, Injectable } from '@nestjs/common';
import { Argon2Service } from '../helper/argon2/argon2.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || `dev`}` });

@Injectable()
export class AuthService {
  constructor(
    private readonly argon2Serivce: Argon2Service,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const loginUser = await this.userService
      .findByEmailOrThrow(email)
      .catch((_) => {
        throw new BadRequestException('등록되지 않은 사용자입니다.');
      });

    const isValid = await this.argon2Serivce.verifyPassword(
      loginUser.password,
      password,
    );

    if (!isValid) throw new BadRequestException('로그인 정보를 확인해주세요.');

    return {
      user: loginUser,
      accessToken: await this.generateATK(loginUser),
      refreshToken: await this.generateRTK(loginUser),
    };
  }

  async generateATK(user: User): Promise<string> {
    const { password, ...payload } = user;

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
  }

  async refreshATK(user: User): Promise<string> {
    const { password, ...payload } = user;

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  async generateRTK(user: User): Promise<string> {
    const { password, ...payload } = user;

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });

    await this.userService.updateRefreshToken(user.id, refreshToken);

    return refreshToken;
  }
}
