import { Global, Module } from '@nestjs/common';
import { Argon2Service } from './argon2.service';

@Global()
@Module({
  providers: [Argon2Service],
  exports: [Argon2Service],
})
export class Argon2Module {}
