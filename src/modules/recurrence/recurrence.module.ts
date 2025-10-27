import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { recurrenceProvider } from './recurrence-provider';
import { AccountModule } from '../account/account.module';
import { RecurrenceService } from './recurrence.service';
import { RecurrenceController } from './recurrence.controller';

@Module({
  imports: [DatabaseModule, AccountModule],
  controllers: [RecurrenceController],
  providers: [...recurrenceProvider, RecurrenceService],
})
export class RecurrenceModule {}
