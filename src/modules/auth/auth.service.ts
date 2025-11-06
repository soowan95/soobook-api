import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Argon2Service } from '../../helper/argon2/argon2.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User, UserRole } from '../user/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { SignUpRequestDto } from '../user/dtos/requests/sign-up-request.dto';
import { AccountService } from '../account/account.service';
import { AccountCreateRequestDto } from '../account/dtos/requests/account-create-request.dto';
import { AccountType } from '../account/account.entity';
import Decimal from 'decimal.js';
import { addDays, addMonths, addWeeks, addYears } from 'date-fns';

dotenv.config({ path: `.env.${process.env.NODE_ENV || `dev`}` });

@Injectable()
export class AuthService {
  constructor(
    @Inject('REFRESH_TOKEN_REPOSITORY')
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly argon2Service: Argon2Service,
    private readonly jwtService: JwtService,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const loginUser: User = await this.userService
      .findByEmailOrThrow(email)
      .catch(() => {
        throw new UnauthorizedException('error.invalid.credentials');
      });

    const rtkCnt: number = await this.refreshTokenRepository.count({
      where: {
        user: { id: loginUser.id },
      },
    });

    if (rtkCnt > 0) {
      throw new UnauthorizedException('warning.duplicate.credentials');
    }

    const isValid: boolean = await this.argon2Service.verifyPassword(
      loginUser.password,
      password,
    );

    if (!isValid) throw new UnauthorizedException('error.invalid.credentials');

    return {
      user: loginUser,
      accessToken: await this.generateATK(loginUser),
      refreshToken: await this.generateRTK(loginUser),
    };
  }

  async guestSignUp(): Promise<User> {
    const guestRequest: SignUpRequestDto = plainToInstance(
      SignUpRequestDto,
      User.generateGuest(),
    );
    guestRequest.isGuest = true;

    const guest: User = await this.userService.signUp(guestRequest);

    const accountCreateRequest: AccountCreateRequestDto =
      new AccountCreateRequestDto();
    accountCreateRequest.name = '현금';
    accountCreateRequest.type = AccountType.CASH;
    accountCreateRequest.initialBalance = new Decimal(0);
    accountCreateRequest.isActive = true;

    await this.accountService.create(accountCreateRequest, guest);

    return guest;
  }

  async guestSingIn(guest: User): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    return {
      user: guest,
      accessToken: await this.generateATK(guest),
      refreshToken: await this.generateRTK(guest, true),
    };
  }

  async signOut(user: User): Promise<void> {
    await this.refreshTokenRepository.delete({
      user: user,
    });

    await this.userService.incrementTokenVersion(user);
  }

  async generateATK(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
  }

  async refreshATK(email: string, rtk: string): Promise<string> {
    const user: User = await this.userService
      .findByEmailOrThrow(email, true)
      .catch(() => {
        throw new UnauthorizedException('error.invalid.credentials');
      });

    await this.validateRTK(user, rtk);

    const payload = {
      sub: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };

    const atk: string = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
    });

    const refreshToken: RefreshToken = user.refreshToken;
    refreshToken.expiresAt = await this.calculateExpiresAt(
      user.role === UserRole.GUEST
        ? '1m'
        : String(process.env.REFRESH_TOKEN_EXPIRES),
    );
    await this.refreshTokenRepository.save(refreshToken);

    return atk;
  }

  async generateRTK(user: User, isGuest: boolean = false): Promise<string> {
    const rtk: string = crypto.randomBytes(64).toString('hex');
    await this.refreshTokenRepository.save({
      user: user,
      token: await bcrypt.hash(rtk, 10),
      expiresAt: await this.calculateExpiresAt(
        isGuest ? '1m' : String(process.env.REFRESH_TOKEN_EXPIRES),
      ),
    });

    return rtk;
  }

  private async validateRTK(user: User, rtk: string): Promise<void> {
    if (!(await bcrypt.compare(rtk, user.refreshToken.token))) {
      throw new UnauthorizedException('error.rtk.credentials');
    }
    if (user.refreshToken.expiresAt < new Date()) {
      await this.signOut(user);
      throw new HttpException('error.rtk.expire', 419);
    }
  }

  private async calculateExpiresAt(expires: string): Promise<Date> {
    let expNumber: number = Number(expires.substring(0, expires.length - 1));
    let expiresAt: Date | undefined = undefined;
    if (isNaN(expNumber)) {
      throw new InternalServerErrorException('error.rtk.wrongType');
    }
    const expType: string = expires.substring(expires.length - 1);
    switch (expType) {
      case 'd':
        expiresAt = addDays(new Date(), expNumber);
        break;
      case 'w':
        expiresAt = addWeeks(new Date(), expNumber);
        break;
      case 'm':
        expiresAt = addMonths(new Date(), expNumber);
        break;
      case 'y':
        expiresAt = addYears(new Date(), expNumber);
        break;
    }
    return expiresAt ?? new Date();
  }
}
