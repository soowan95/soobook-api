import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  private readonly logger = new Logger(JwtRefreshGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredError)
      throw new HttpException('Refresh 토큰이 만료되었습니다.', 419);

    if (info instanceof JsonWebTokenError)
      throw new UnauthorizedException('유효하지 않은 refresh 토큰입니다.');

    if (err || !user) {
      this.logger.error('Refresh 토큰 에러: ', err)
      throw new ForbiddenException('Refresh 인증에 실패했습니다.');
    }

    return user;
  }
}
