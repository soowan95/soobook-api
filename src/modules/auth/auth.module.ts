import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { UserModule } from '../user/user.module';
import { refreshTokenProvider } from './refresh-token-provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [...refreshTokenProvider, AuthService, JwtAccessStrategy],
})
export class AuthModule {}
