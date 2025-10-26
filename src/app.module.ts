import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { Argon2Module } from './helper/argon2/argon2.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { RequestContextMiddleware } from './common/middlewares/request-context.middleware';
import { AccountModule } from './modules/account/account.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    Argon2Module,
    AccountModule,
    AuthModule,
    CategoryModule,
    UserModule,
    TransactionModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
