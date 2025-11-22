import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { Argon2Module } from './helper/argon2/argon2.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { RequestContextMiddleware } from './common/middlewares/request-context.middleware';
import { AccountModule } from './modules/account/account.module';
import { CategoryModule } from './modules/category/category.module';
import { RecurrenceModule } from './modules/recurrence/recurrence.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './common/task/task.service';
import { UserSettingModule } from './modules/userSetting/user-setting.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    Argon2Module,
    AccountModule,
    AuthModule,
    CategoryModule,
    RecurrenceModule,
    TransactionModule,
    UserModule,
    UserSettingModule,
  ],
  providers: [TaskService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
