import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Argon2Service } from '../../helper/argon2/argon2.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

dotenv.config({ path: `.env.${process.env.NODE_ENV || `dev`}` });

@Injectable()
export class AuthService {
  constructor(
    @Inject('REFRESH_TOKEN_REPOSITORY')
    private refreshTokenRepository: Repository<RefreshToken>,
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

  async refreshATK(email: string, rtk: string): Promise<string> {
    const user = await this.userService.findByEmailOrThrow(email, true).catch((_) => {
      throw new BadRequestException('등록되지 않은 사용자입니다.');
    });
    if (!(await this.validateRTK(user, rtk)))
      throw new HttpException('Refresh 토큰이 유효하지 않습니다.', 419);

    const { password, ...payload } = user;

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  async generateRTK(user: User): Promise<string> {
    const rtk = crypto.randomBytes(32).toString('hex');
    await this.refreshTokenRepository.save({
      user: user,
      token: await bcrypt.hash(rtk, 10),
      expiryDate: this.calculateExpiryDate(
        String(process.env.REFRESH_TOKEN_EXPIRES),
      ),
    });

    return rtk;
  }

  async checkRTK(user: User): Promise<boolean> {
    const rtkCnt = await this.refreshTokenRepository.count({
      where: {
        user: user,
        expiresAt: MoreThan(new Date()),
      },
    });

    return rtkCnt > 0;
  }

  private async validateRTK(user: User, rtk: string): Promise<boolean> {
    return await bcrypt.compare(rtk, user.refreshToken.token);
  }

  private async calculateExpiryDate(expires: string): Promise<Date> {
    const expNumber = Number(expires.substring(0, expires.length - 1));
    if (isNaN(expNumber)) {
      throw new InternalServerErrorException(
        'Token 만료일 설정을 확인해주세요.',
      );
    }
    const expType = expires.substring(expires.length - 1);
    let calExpires = 24 * 60 * 60 * 1000;
    switch (expType) {
      case 'd':
        calExpires *= expNumber;
        break;
      case 'm':
        calExpires = expNumber * 30;
        break;
      case 'y':
        calExpires = expNumber * 365;
        break;
    }
    return new Date(Date.now() + calExpires);
  }
}
