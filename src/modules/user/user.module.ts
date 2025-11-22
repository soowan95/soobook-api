import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { userProvider } from './user-provider';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSettingModule } from '../userSetting/user-setting.module';

@Module({
  imports: [DatabaseModule, UserSettingModule],
  controllers: [UserController],
  providers: [...userProvider, UserService],
  exports: [UserService],
})
export class UserModule {}
