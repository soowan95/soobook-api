import { Module } from '@nestjs/common';
import { userSettingProvider } from './user-setting-provider';
import { DatabaseModule } from '../../database/database.module';
import { UserSettingController } from './user-setting.controller';
import { UserSettingService } from './user-setting.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserSettingController],
  providers: [...userSettingProvider, UserSettingService],
  exports: [UserSettingService],
})
export class UserSettingModule {}
