import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { refreshTokenProvider } from './refresh-token-provider';
import { DatabaseModule } from '../../database/database.module';
import { userProvider } from '../user/user-provider';

@Module({
  imports: [DatabaseModule, UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    ...refreshTokenProvider,
    ...userProvider,
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}
