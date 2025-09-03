import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { Argon2Module } from './helper/argon2/argon2.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, UserModule, Argon2Module],
})
export class AppModule {}
