import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { HttpException, Inject, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { AuthService } from '../auth.service';

dotenv.config({ path: `.env.${process.env.NODE_ENV || `dev`}` });

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET!,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['refreshToken'],
    });

    if (!user) throw new UnauthorizedException('error.invalid.credentials');

    if (user.refreshToken.expiresAt < new Date()) {
      await this.authService.signOut(user);
      throw new HttpException('error.rtk.expire', 419);
    }

    if (payload.tokenVersion !== user.tokenVersion)
      throw new UnauthorizedException('error.atk.revoked');

    return user;
  }
}
